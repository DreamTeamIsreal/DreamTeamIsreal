import { query } from '../config/database';
import { logger, securityLogger } from '../utils/logger';
import crypto from 'crypto';
import { encryptionService } from './encryption';
// Import all relevant types that fake data can be generated for
import { User, QuizAnswer, Candidate, Supporter, DreamTeamSelection, NewsletterSubscriber } from '../types';

// A simple pseudo-random number generator for deterministic fake data
class PseudoRandom {
    private seed: number;

    constructor(seed: string) {
        // Convert string seed to a number for consistent generation
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        this.seed = hash;
    }

    next(): number {
        // LCG algorithm
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}

export class FakeDataService {
    private readonly recordIntegritySecret: string;
    private readonly fakeRecordsMultiplier: number;
    private readonly fakeDataGenerationSeed: string;
    private pseudoRandom: PseudoRandom;

    constructor() {
        this.recordIntegritySecret = process.env.RECORD_INTEGRITY_SECRET!;
        this.fakeRecordsMultiplier = parseInt(process.env.FAKE_RECORDS_MULTIPLIER || '5');
        this.fakeDataGenerationSeed = process.env.FAKE_DATA_GENERATION_SEED || 'default_fake_seed';

        if (!this.recordIntegritySecret) {
            throw new Error('Missing RECORD_INTEGRITY_SECRET in environment variables');
        }

        this.pseudoRandom = new PseudoRandom(this.fakeDataGenerationSeed);
    }

    /**
     * Generates a cryptographic signature/MAC for a real record.
     * This tag helps differentiate real records from fake ones.
     */
    private generateIntegrityTag(dataIdentifier: string): string {
        const hmac = crypto.createHmac('sha256', this.recordIntegritySecret);
        hmac.update(dataIdentifier);
        // Add a salt based on seed to make it harder to reverse engineer pattern for fake data
        hmac.update(this.fakeDataGenerationSeed);
        return hmac.digest('hex');
    }

    /**
     * Verifies the integrity tag of a record.
     */
    public verifyIntegrityTag(dataIdentifier: string, tag: string): boolean {
        return this.generateIntegrityTag(dataIdentifier) === tag;
    }

    /**
     * Transforms a real record to store it, adding the integrity tag.
     * Also encrypts the integrity tag itself.
     */
    public prepareRealRecord<T extends { id: string }>(record: T): T & { metadata_tag: string } {
        const integrityTag = this.generateIntegrityTag(record.id);
        const encryptedTag = encryptionService.encrypt(integrityTag); // Encrypt the tag itself
        return {
            ...record,
            metadata_tag: JSON.stringify(encryptedTag) // Store as JSON string
        };
    }

    /**
     * Generates fake data that is indistinguishable from real encrypted data,
     * but will fail the integrity check.
     *
     * @param realRecordId The ID of the real record (for contextual generation).
     * @param model The type of model for which to generate fake records.
     * @returns An array of fake records with metadata_tag.
     */
    public generateFakeRecords<
        M extends 'user' | 'quiz_answer' | 'candidate' | 'supporter' | 'dream_team_selection' | 'newsletter_subscriber',
        T extends (
            M extends 'user' ? User :
                M extends 'quiz_answer' ? QuizAnswer :
                    M extends 'candidate' ? Candidate :
                        M extends 'supporter' ? Supporter :
                            M extends 'dream_team_selection' ? DreamTeamSelection :
                                M extends 'newsletter_subscriber' ? NewsletterSubscriber :
                                    never // Should not reach here if union is exhaustive
            )
    >(realRecordId: string, model: M): (T & { metadata_tag: string })[] {
        const fakeRecords: (T & { metadata_tag: string })[] = [];
        const multiplier = this.fakeRecordsMultiplier;

        for (let i = 0; i < multiplier; i++) {
            const fakeId = crypto.randomUUID();
            let generatedFakeData: T; // Will hold the fully constructed fake data object

            // Generate plausible but fake data based on model type
            switch (model) {
                case 'user':
                    generatedFakeData = {
                        id: fakeId,
                        email: JSON.stringify(encryptionService.encrypt(this.generateFakeEmail())),
                        fullName: JSON.stringify(encryptionService.encrypt(this.generateFakeName())),
                        israelId: JSON.stringify(encryptionService.encrypt(this.generateFakeIsraelId())),
                        mobilePhoneNumber: JSON.stringify(encryptionService.encrypt(this.generateFakePhoneNumber())),
                        city: JSON.stringify(encryptionService.encrypt(this.generateFakeCity())),
                        dateOfBirth: JSON.stringify(encryptionService.encrypt(this.generateFakeDateOfBirth())),
                        passwordHash: JSON.stringify(encryptionService.encrypt(this.generateFakePasswordHash())),
                        mfaSecret: JSON.stringify(encryptionService.encrypt(this.generateFakeMfaSecret())),
                        mfaEnabled: false, // Default fake users to MFA disabled
                        roles: ['voter'],
                        emailVerified: false,
                        phoneVerified: false
                    } as unknown as T; // Cast to T, which is User in this case
                    break;
                case 'quiz_answer':
                    generatedFakeData = {
                        id: fakeId, // Assuming QuizAnswer has an id
                        userId: JSON.stringify(encryptionService.encrypt(crypto.randomUUID())), // Fake user ID
                        questionId: JSON.stringify(encryptionService.encrypt(crypto.randomUUID())), // Fake question ID
                        answer: JSON.stringify(encryptionService.encrypt(String(Math.floor(this.pseudoRandom.next() * 5) + 1))) // Random answer 1-5
                    } as unknown as T; // Cast to T, which is QuizAnswer
                    break;
                case 'candidate':
                    generatedFakeData = {
                        id: fakeId, // Assuming Candidate has an id
                        userId: JSON.stringify(encryptionService.encrypt(crypto.randomUUID())),
                        candidacyType: JSON.stringify(encryptionService.encrypt(this.pseudoRandom.next() > 0.5 ? 'Minister' : 'Knesset Committee')),
                        fullName: JSON.stringify(encryptionService.encrypt(this.generateFakeName())),
                        desiredPosition: JSON.stringify(encryptionService.encrypt(this.generateFakePosition())),
                        desiredCommittee: JSON.stringify(encryptionService.encrypt(this.generateFakeCommittee())),
                        professionalExperience: JSON.stringify(encryptionService.encrypt(this.generateFakeText(100))),
                        education: JSON.stringify(encryptionService.encrypt(this.generateFakeText(50))),
                        personalVision: JSON.stringify(encryptionService.encrypt(this.generateFakeText(200))),
                        policeRecordUrl: `https://fakeurl.com/${fakeId}-police.pdf`,
                        wealthDeclarationUrl: `https://fakeurl.com/${fakeId}-wealth.pdf`,
                        conflictOfInterestUrl: `https://fakeurl.com/${fakeId}-conflict.pdf`,
                        cvUrl: `https://fakeurl.com/${fakeId}-cv.pdf`,
                        fiveYearPlan: JSON.stringify(encryptionService.encrypt(this.generateFakeText(300))),
                        longTermVision2048: JSON.stringify(encryptionService.encrypt(this.generateFakeText(300))),
                        detailedAnnualPlan: JSON.stringify(encryptionService.encrypt(this.generateFakeText(300))),
                        visionAndWorkPlanInCommittee: JSON.stringify(encryptionService.encrypt(this.generateFakeText(300))),
                        introductionVideoLink: `https://fakeyoutube.com/$${fakeId}`,
                        additionalDebateQuestion: JSON.stringify(encryptionService.encrypt(this.generateFakeText(50))),
                        status: JSON.stringify(encryptionService.encrypt(this.pseudoRandom.next() > 0.8 ? 'approved' : 'pending')),
                        numberOfVotes: Math.floor(this.pseudoRandom.next() * 1000),
                        numberOfSupporters: Math.floor(this.pseudoRandom.next() * 500),
                    } as unknown as T; // Cast to T, which is Candidate
                    break;
                case 'supporter':
                    generatedFakeData = {
                        id: fakeId, // Assuming Supporter has an id
                        voterId: JSON.stringify(encryptionService.encrypt(crypto.randomUUID())),
                        candidateId: JSON.stringify(encryptionService.encrypt(crypto.randomUUID())),
                    } as unknown as T; // Cast to T, which is Supporter
                    break;
                case 'dream_team_selection':
                    generatedFakeData = {
                        id: fakeId, // Assuming DreamTeamSelection has an id
                        userId: JSON.stringify(encryptionService.encrypt(crypto.randomUUID())),
                        positionId: JSON.stringify(encryptionService.encrypt(crypto.randomUUID())), // Assuming positions have UUIDs
                        selectedCandidateId: JSON.stringify(encryptionService.encrypt(crypto.randomUUID())),
                    } as unknown as T; // Cast to T, which is DreamTeamSelection
                    break;
                case 'newsletter_subscriber':
                    generatedFakeData = {
                        id: fakeId, // Assuming NewsletterSubscriber has an id
                        email: JSON.stringify(encryptionService.encrypt(this.generateFakeEmail())),
                    } as unknown as T; // Cast to T, which is NewsletterSubscriber
                    break;
                default:
                    // Fallback for exhaustive union check. This part should theoretically be unreachable.
                    throw new Error(`Unknown model type for fake data generation: ${model}`);
            }

            // Generate a fake integrity tag that will not verify correctly
            const fakeTag = crypto.randomBytes(32).toString('hex'); // Random string, won't match HMAC
            const encryptedFakeTag = encryptionService.encrypt(fakeTag);

            fakeRecords.push({
                ...generatedFakeData, // Use the fully constructed and typed fake data
                metadata_tag: JSON.stringify(encryptedFakeTag)
            });
        }
        return fakeRecords;
    }

    /**
     * Wrapper for generating fake candidates. Called by CandidateService.
     */
    public generateFakeCandidates(realCandidate: Partial<Candidate>): (Candidate & { metadata_tag: string })[] {
        if (!realCandidate.id) return [];
        const fakes = this.generateFakeRecords(realCandidate.id, 'candidate');
        // The generic generator returns partial data; we need to encrypt it like the real flow
        return fakes.map(fake => ({
            ...fake,
            professionalExperience: JSON.stringify(encryptionService.encrypt(fake.professionalExperience || '')),
            education: JSON.stringify(encryptionService.encrypt(fake.education || '')),
            personalVision: JSON.stringify(encryptionService.encrypt(fake.personalVision || '')),
        }));
    }

    /**
     * Wrapper for generating fake supporters. Called by CandidateService.
     */
    public generateFakeSupporters(realSupporter: Partial<Supporter>): (Supporter & { metadata_tag: string })[] {
        if (!realSupporter.id) return [];
        return this.generateFakeRecords(realSupporter.id, 'supporter');
    }

    /**
     * Wrapper for generating fake quiz answers. Called by QuizService.
     */
    public generateFakeQuizAnswers(realAnswers: Partial<QuizAnswer>[]): (QuizAnswer & { metadata_tag: string })[] {
        const allFakes: (QuizAnswer & { metadata_tag: string })[] = [];
        for (const realAnswer of realAnswers) {
            if (realAnswer.id) {
                const fakes = this.generateFakeRecords(realAnswer.id, 'quiz_answer');
                allFakes.push(...fakes);
            }
        }
        return allFakes;
    }

    /**
     * Filters out fake records from a query result.
     */
    public async filterRealRecords<T extends { id: string; metadata_tag: string }>(records: T[]): Promise<T[]> {
        const realRecords: T[] = [];
        for (const record of records) {
            try {
                // Decrypt the tag
                const decryptedTag = encryptionService.decrypt(JSON.parse(record.metadata_tag));
                if (this.verifyIntegrityTag(record.id, decryptedTag)) {
                    realRecords.push(record);
                }
            } catch (e) {
                // Handle decryption or parsing errors for fake records gracefully
                // Changed from securityLogger.debug to logger.info
                logger.info('Failed to decrypt or verify metadata_tag, likely a fake record.', { recordId: record.id, error: (e as Error).message });
            }
        }
        return realRecords;
    }

    // --- Helper methods for generating fake data content ---
    private generateFakeEmail(): string {
        const domains = ['example.com', 'test.org', 'mail.net', 'faker.dev'];
        const name = this.generateRandomString(this.pseudoRandom.next() * 10 + 5); // 5-15 chars
        const domain = domains[Math.floor(this.pseudoRandom.next() * domains.length)];
        return `${name}@${domain}`;
    }

    private generateFakeName(): string {
        const firstNames = ['John', 'Jane', 'Alex', 'Sara', 'Chris', 'Pat'];
        const lastNames = ['Doe', 'Smith', 'Jones', 'Williams', 'Brown', 'Davis'];
        const firstName = firstNames[Math.floor(this.pseudoRandom.next() * firstNames.length)];
        const lastName = lastNames[Math.floor(this.pseudoRandom.next() * lastNames.length)];
        return `${firstName} ${lastName}`;
    }

    private generateFakeIsraelId(): string {
        let id = '';
        for (let i = 0; i < 9; i++) {
            id += Math.floor(this.pseudoRandom.next() * 10);
        }
        return id;
    }

    private generateFakePhoneNumber(): string {
        let phone = '05';
        for (let i = 0; i < 8; i++) {
            phone += Math.floor(this.pseudoRandom.next() * 10);
        }
        return phone;
    }

    private generateFakeCity(): string {
        const cities = ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beer Sheva', 'Rishon LeZion', 'Ashdod'];
        return cities[Math.floor(this.pseudoRandom.next() * cities.length)]!;
    }

    private generateFakeDateOfBirth(): string {
        const year = 1950 + Math.floor(this.pseudoRandom.next() * 50); // 1950-1999
        const month = Math.floor(this.pseudoRandom.next() * 12) + 1;
        const day = Math.floor(this.pseudoRandom.next() * 28) + 1; // Simplify for fake data
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    private generateFakePasswordHash(): string {
        // Return a plausible-looking hash, no need for actual hashing
        return crypto.randomBytes(32).toString('hex');
    }

    private generateFakeMfaSecret(): string {
        return crypto.randomBytes(16).toString('base64').substring(0, 24); // TOTP base32 secret length
    }

    private generateFakeText(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(this.pseudoRandom.next() * chars.length));
        }
        return result;
    }

    private generateRandomString(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(this.pseudoRandom.next() * charactersLength));
        }
        return result;
    }

    private generateFakePosition(): string {
        const positions = [
            'Minister of Defense', 'Minister of Finance', 'Minister of Education', 'Minister of Health',
            'Minister of Justice', 'Minister of Interior', 'Minister of Foreign Affairs', 'Minister of Economy',
            'Minister of Transport', 'Minister of Energy', 'Minister of Environmental Protection',
            'Minister of Welfare', 'Minister of Tourism', 'Minister of Culture and Sport',
            'Minister of Science and Technology', 'Minister of Agriculture', 'Minister of Construction and Housing',
            'Minister for Social Equality'
        ];
        return positions[Math.floor(this.pseudoRandom.next() * positions.length)]!;
    }

    private generateFakeCommittee(): string {
        const committees = [
            'Foreign Affairs and Defense Committee', 'Finance Committee', 'Education, Culture, and Sports Committee',
            'Health Committee', 'Constitution, Law, and Justice Committee', 'Interior and Environmental Protection Committee',
            'Economy Committee', 'Labor and Welfare Committee', 'Science and Technology Committee',
            'Aliyah, Absorption, and Diaspora Affairs Committee', 'Public Petitions Committee',
            'State Control Committee', 'Committee on the Status of Women and Gender Equality',
            'Committee for the Advancement of Arab Society', 'Special Committee for the Rights of the Child'
        ];
        return committees[Math.floor(this.pseudoRandom.next() * committees.length)]!;
    }

    /**
     * Logs the generation of fake data.
     */
    public logFakeDataGeneration(
        eventType: 'user_registration' | 'candidate_creation' | 'candidate_support' | 'quiz_partial_answers' | 'quiz_data' | 'candidate_data',
        realCount: number,
        fakeCount: number
    ): void {
        logger.info(`Fake data generated: ${eventType}`, { realCount, fakeCount });
    }
}

export const fakeDataService = new FakeDataService();