import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Map, Users, TrendingUp, ArrowLeft, Download, X, Star } from 'lucide-react';
import PlatformHeader from '../components/platform/PlatformHeader';
import { useTranslation, Trans } from 'react-i18next';

// --- Type Definitions ---
interface Candidate {
    position?: string; // Optional for committee reps
    committee?: string; // Optional for ministers
    name: string;
    votes: number;
    percentage: number;
    image: string;
    district?: string; // Optional, mainly for committee reps
}

interface RankingCandidate {
    rank: number;
    name: string;
    votes: number;
    percentage: number;
    experience: string;
    supporters: number;
    rating: string;
    district?: string; // Optional
    image: string;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType; // Type for Lucide icon components
    color: string;
}

const DataVisualization = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState<'national' | 'districts'>('national');
    const [userDistrict, setUserDistrict] = useState<string>('');
    const [showRankingModal, setShowRankingModal] = useState<boolean>(false);
    const [rankingData, setRankingData] = useState<RankingCandidate[]>([]);
    const [rankingTitle, setRankingTitle] = useState<string>('');

    // Load translations from specific namespaces
    const { t, i18n } = useTranslation(['dataViz', 'candidate', 'positions', 'committees', 'common']);

    // Get user's district from localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.district) {
            setUserDistrict(userData.district);
        }
    }, []);

    // Memoize static data that depends on translations to prevent re-creation
    // every time `t` changes (e.g., language switch)
    const nationalTeam: Candidate[] = useMemo(() => [
        { position: t('positions:pm'), name: 'דר\' יוסי כהן', votes: 45234, percentage: 38.2, image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:defense')}`, name: 'גנרל (מיל\') דנה לוי', votes: 52341, percentage: 42.1, image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:finance')}`, name: 'פרופ\' מיכל אברהם', votes: 48567, percentage: 39.8, image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:education')}`, name: 'דר\' שרה לוי', votes: 51234, percentage: 41.5, image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:health')}`, name: 'פרופ\' דוד כהן', votes: 49876, percentage: 40.3, image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:transport')}`, name: 'מהנדס רון ישראלי', votes: 46789, percentage: 37.9, image: 'https://images.pexels.com/photos/3785081/pexels-photo-3785081.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:justice')}`, name: 'עו"ד מירי אברהם', votes: 47123, percentage: 38.5, image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:housing')}`, name: 'אדריכל תום לוי', votes: 45678, percentage: 37.2, image: 'https://images.pexels.com/photos/3785078/pexels-photo-3785078.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:internal_security')}`, name: 'דר\' אמיר דוד', votes: 44321, percentage: 36.8, image: 'https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:foreign_affairs')}`, name: 'פרופ\' רחל כהן', votes: 46890, percentage: 38.9, image: 'https://images.pexels.com/photos/3785080/pexels-photo-3785080.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:science_technology')}`, name: 'מהנדס יוסי לוי', votes: 43567, percentage: 36.2, image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:environment')}`, name: 'דר\' נועה ישראלי', votes: 45123, percentage: 37.5, image: 'https://images.pexels.com/photos/3760265/pexels-photo-3760265.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:culture')}`, name: 'אמן דני אברהם', votes: 42890, percentage: 35.6, image: 'https://images.pexels.com/photos/3785082/pexels-photo-3785082.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:immigration_absorption')}`, name: 'דר\' מרים דוד', votes: 44567, percentage: 37.0, image: 'https://images.pexels.com/photos/3760264/pexels-photo-3760264.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:welfare')}`, name: 'עו"ס שלמה כהן', votes: 43789, percentage: 36.4, image: 'https://images.pexels.com/photos/5327922/pexels-photo-5327922.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:agriculture')}`, name: 'אגרונום רות לוי', votes: 42345, percentage: 35.2, image: 'https://images.pexels.com/photos/3760068/pexels-photo-3760068.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:economy')}`, name: 'כלכלן אבי ישראלי', votes: 45890, percentage: 38.1, image: 'https://images.pexels.com/photos/3785083/pexels-photo-3785083.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { position: `${t('candidate:forMinister')} - ${t('positions:diaspora_affairs')}`, name: 'דר\' יעל אברהם', votes: 41234, percentage: 34.3, image: 'https://images.pexels.com/photos/3760266/pexels-photo-3760266.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
    ], [t]);

    const committeeRepresentatives: Candidate[] = useMemo(() => [
        { committee: `${t('candidate:forCommittee')} ${t('committees:knesset')}`, name: 'עו"ד משה דוד', district: userDistrict || 'תל אביב והמרכז', votes: 12456, percentage: 42.3, image: 'https://images.pexels.com/photos/3785084/pexels-photo-3785084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:finance_committee')}`, name: 'כלכלנית שרה לוי', district: userDistrict || 'תל אביב והמרכז', votes: 15234, percentage: 45.1, image: 'https://images.pexels.com/photos/3760267/pexels-photo-3760267.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:economy')}`, name: 'פרופ\' דוד כהן', district: userDistrict || 'תל אביב והמרכז', votes: 11890, percentage: 38.7, image: 'https://images.pexels.com/photos/5327923/pexels-photo-5327923.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:foreign_defense')}`, name: 'גנרל (מיל\') רחל אברהם', district: userDistrict || 'תל אביב והמרכז', votes: 13567, percentage: 41.2, image: 'https://images.pexels.com/photos/3785085/pexels-photo-3785085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:interior_env')}`, name: 'דר\' אמיר ישראלי', district: userDistrict || 'תל אביב והמרכז', votes: 10234, percentage: 36.8, image: 'https://images.pexels.com/photos/3760268/pexels-photo-3760268.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:internal_security_committee')}`, name: 'קצין (מיל\') יוסי כהן', district: userDistrict || 'תל אביב והמרכז', votes: 9876, percentage: 35.4, image: 'https://images.pexels.com/photos/3785086/pexels-photo-3785086.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:religious_affairs_committee')}`, name: 'רבדר\' אברהם לוי', district: userDistrict || 'תל אביב והמרכז', votes: 8765, percentage: 33.9, image: 'https://images.pexels.com/photos/3760269/pexels-photo-3760269.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:constitution_law')}`, name: 'שופט (בדימוס) מיכל דוד', district: userDistrict || 'תל אביב והמרכז', votes: 11234, percentage: 39.1, image: 'https://images.pexels.com/photos/3785087/pexels-photo-3785087.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:social_affairs_committee')}`, name: 'דר\' אולגה פטרוב', district: userDistrict || 'תל אביב והמרכז', votes: 9543, percentage: 34.7, image: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:education_culture')}`, name: 'פרופ\' רונית ישראלי', district: userDistrict || 'תל אביב והמרכז', votes: 12890, percentage: 43.2, image: 'https://images.pexels.com/photos/3785088/pexels-photo-3785088.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:labor_welfare')}`, name: 'עו"ס דנה כהן', district: userDistrict || 'תל אביב והמרכז', votes: 10567, percentage: 37.8, image: 'https://images.pexels.com/photos/3760271/pexels-photo-3760271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:health_committee')}`, name: 'פרופ\' אמיל חדאד', district: userDistrict || 'תל אביב והמרכז', votes: 8234, percentage: 31.5, image: 'https://images.pexels.com/photos/3785089/pexels-photo-3785089.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:state_audit_committee')}`, name: 'רו"ח יעקב אברהם', district: userDistrict || 'תל אביב והמרכז', votes: 7890, percentage: 29.8, image: 'https://images.pexels.com/photos/3760272/pexels-photo-3760272.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:women_equality_committee')}`, name: 'עו"ד נועה לוי', district: userDistrict || 'תל אביב והמרכז', votes: 11678, percentage: 40.5, image: 'https://images.pexels.com/photos/3785090/pexels-photo-3785090.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
        { committee: `${t('candidate:forCommittee')} ${t('committees:science_technology_committee')}`, name: 'פרופ\' איתן ישראלי', district: userDistrict || 'תל אביב והמרכז', votes: 14567, percentage: 47.3, image: 'https://images.pexels.com/photos/3760273/pexels-photo-3760273.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
    ], [t, userDistrict]);

    const generatePositionRanking = (position: string): RankingCandidate[] => {
        const baseNames = [
            'דר\' יוסי כהן', 'פרופ\' מיכל אברהם', 'עו"דמירילוי', 'מהנדסרוןדוד',
            'דר\' שרה ישראלי', 'פרופ\' אמיר כהן', 'גנרל דנה אברהם', 'עו"ד תום לוי'
        ];
        return baseNames.map((name, index) => ({
            rank: index + 1,
            name,
            votes: Math.floor(Math.random() * 30000) + 20000,
            percentage: Math.floor(Math.random() * 20) + 25,
            experience: `${Math.floor(Math.random() * 15) + 5} ${t('dataViz:experienceYears')}`,
            supporters: Math.floor(Math.random() * 2000) + 500,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            image: `https://images.pexels.com/photos/${3760000 + Math.floor(Math.random() * 1000)}/pexels-photo-${3760000 + Math.floor(Math.random() * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
        })).sort((a, b) => b.votes - a.votes);
    };

    const generateCommitteeRanking = (committee: string): RankingCandidate[] => {
        const baseNames = ['עו"ד משה דוד', 'דר\' שרה לוי', 'פרופ\' אמיר כהן', 'מהנדס רון ישראלי', 'עו"ד מירי אברהם', 'דר\' יוסי לוי', 'פרופ\' דנה כהן', 'עו"ד תום דוד'];
        return baseNames.map((name, index) => ({
            rank: index + 1,
            name,
            votes: Math.floor(Math.random() * 15000) + 5000,
            percentage: Math.floor(Math.random() * 25) + 20,
            experience: `${Math.floor(Math.random() * 12) + 3} ${t('dataViz:experienceYears')}`,
            supporters: Math.floor(Math.random() * 1000) + 200,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            district: userDistrict || 'תל אביב והמרכז',
            image: `https://images.pexels.com/photos/${3785000 + Math.floor(Math.random() * 100)}/pexels-photo-${3785000 + Math.floor(Math.random() * 100)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
        })).sort((a, b) => b.votes - a.votes);
    };

    const showPositionRanking = (position: string) => {
        const ranking = generatePositionRanking(position);
        setRankingData(ranking);
        setRankingTitle(`${t('candidate:fullRanking')} - ${position}`);
        setShowRankingModal(true);
    };

    const showCommitteeRanking = (committee: string) => {
        const ranking = generateCommitteeRanking(committee);
        setRankingData(ranking);
        setRankingTitle(`${t('candidate:fullRanking')} - ${committee}`);
        setShowRankingModal(true);
    };

    const stats: StatCardProps[] = [
        { title: t('dataViz:totalParticipants'), value: '1,247,892', icon: Users, color: 'blue' },
        { title: t('dataViz:participationRate'), value: '68.3%', icon: TrendingUp, color: 'green' },
        { title: t('dataViz:activeDistricts'), value: '12/12', icon: Map, color: 'purple' },
        { title: t('dataViz:registeredCandidates'), value: '2,156', icon: BarChart, color: 'orange' }
    ];

    // Helper component for StatCards (can be moved to a separate file)
    const StatCard: React.FC<StatCardProps> = ({ title, value, icon: IconComponent, color }) => (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    // Helper component for Candidate/Representative Cards (can be moved to a separate file)
    const CandidateCard: React.FC<{ candidate: Candidate; onClick: () => void }> = ({ candidate, onClick }) => (
        <div onClick={onClick} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <img src={candidate.image} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{candidate.position || candidate.committee}</h3>
                <p className="text-sm text-gray-600 mb-1">{candidate.name}</p>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-600 text-sm">{candidate.percentage}%</span>
                    <span className="text-xs text-gray-500">{candidate.votes.toLocaleString()} {t('dataViz:votes')}</span>
                </div>
                {candidate.district && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">{candidate.district}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen bg-gray-50`} dir={i18n.dir()}>
            <PlatformHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('dataViz:title')}</h1>
                    <p className="text-lg text-gray-600">{t('dataViz:description')}</p>
                    {userDistrict && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2">
                            <Map className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 font-medium">{t('dataViz:yourDistrict')}: {userDistrict}</span>
                        </div>
                    )}
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* View Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setActiveView('national')}
                            className={`px-6 py-2 rounded-md transition-colors ${activeView === 'national' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {t('dataViz:nationalTeam')}
                        </button>
                        <button
                            onClick={() => setActiveView('districts')}
                            className={`px-6 py-2 rounded-md transition-colors ${activeView === 'districts' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {t('dataViz:districtCommittees')}
                        </button>
                    </div>
                </div>

                {/* National Team View */}
                {activeView === 'national' && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{t('dataViz:nationalTeamHeadline')}</h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Download className="w-4 h-4" />
                                    {t('dataViz:downloadReport')}
                                </button>
                            </div>
                            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {nationalTeam.map((member, index) => (
                                    <CandidateCard key={index} candidate={member} onClick={() => showPositionRanking(member.position!)} />
                                ))}
                            </div>
                        </div>

                        {/* Committee Representatives - All 15 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dataViz:knessetCommitteesHeadline')}</h2>
                            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {committeeRepresentatives.map((rep, index) => (
                                    <CandidateCard key={index} candidate={rep} onClick={() => showCommitteeRanking(rep.committee!)} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Districts View - Show user's district committees only */}
                {activeView === 'districts' && userDistrict && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                <Trans i18nKey="dataViz:districtKnessetCommitteesHeadline" values={{ district: userDistrict }} components={{ strong: <strong /> }} />
                            </h2>
                            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {committeeRepresentatives.map((rep, index) => (
                                    <div key={index}
                                         className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div
                                            className="flex items-center gap-4 mb-4 cursor-pointer"
                                            onClick={() => showCommitteeRanking(rep.committee!)}
                                        >
                                            <img
                                                src={rep.image}
                                                alt={rep.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 text-sm mb-1">{rep.committee}</h3>
                                                <p className="text-gray-600 text-sm">{rep.name}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">{t('dataViz:support')}:</span>
                                                <span className="font-bold text-green-600">{rep.percentage}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">{t('dataViz:votes')}:</span>
                                                <span
                                                    className="text-sm text-gray-900">{rep.votes.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">{t('dataViz:district')}:</span>
                                                <span
                                                    className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">{rep.district}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => showCommitteeRanking(rep.committee!)}
                                                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                            >
                                                {t('candidate:fullRanking')}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/candidate/${index + 1}`)}
                                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                            >
                                                {t('dataViz:profile')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Real-time Updates */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white mt-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">{t('dataViz:realtimeUpdatesTitle')}</h3>
                            <p className="text-blue-100">{t('dataViz:realtimeUpdatesDescription')}</p>
                        </div>
                        <div className="text-left">
                            <p className="text-sm text-blue-100">{t('dataViz:lastUpdate')}:</p>
                            <p className="font-semibold">{new Date().toLocaleTimeString(i18n.language)}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/platform')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                        {t('common:back')}
                    </button>
                </div>
            </div>

            {/* Ranking Modal */}
            {showRankingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">{rankingTitle}</h2>
                            <button
                                onClick={() => setShowRankingModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="space-y-4">
                                {rankingData.map((candidate, index) => (
                                    <div key={index}
                                         className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                                        <div
                                            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold text-lg">
                                            {candidate.rank}
                                        </div>
                                        <img
                                            src={candidate.image}
                                            alt={candidate.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">{candidate.name}</h3>
                                            <p className="text-gray-600 mb-2">{candidate.experience}</p>
                                            {candidate.district && (
                                                <span
                                                    className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">{candidate.district}</span>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <div
                                                className="text-2xl font-bold text-blue-600">
                                                {candidate.percentage}%
                                            </div>
                                            <p className="text-sm text-gray-500">{candidate.votes.toLocaleString()} {t('dataViz:rankingVotesUnit')}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm font-semibold">{candidate.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataVisualization;