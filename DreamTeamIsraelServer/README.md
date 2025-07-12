# DreamTeamIsrael Server

A highly secure, scalable backend API for the DreamTeamIsrael platform featuring advanced data obfuscation, encryption, and comprehensive security measures.

## 🔐 Key Security Features

### 1. **Real vs Fake Data Obfuscation (Unique Security Feature)**
This application implements a groundbreaking security mechanism where **for every real record stored, multiple fake records are also inserted**. This creates a honeypot effect that makes it extremely difficult for attackers to distinguish legitimate data even if they gain full database access.

**How it works:**
- For each real user registration, candidate submission, quiz answer, etc., the system automatically generates 5 fake records (configurable)
- Each record contains a cryptographically signed metadata tag that only the application can verify
- Fake records appear plausible but contain meaningless encrypted data
- The application filters out fake records during queries using cryptographic verification
- Even with database access AND encryption keys, attackers cannot easily identify real data

### 2. **Comprehensive Data Encryption**
- All sensitive fields encrypted with AES-256-CBC
- Separate encryption keys for data and integrity checks
- HMAC-based integrity verification
- Secure key management through environment variables

### 3. **Advanced Authentication & Authorization**
- JWT-based stateless authentication
- Multi-Factor Authentication (TOTP) support
- Role-based access control (voter, candidate, admin)
- Secure password hashing with bcrypt
- Token refresh mechanism

### 4. **Production-Ready Security**
- Rate limiting on all endpoints
- Comprehensive input validation and sanitization
- Security headers with Helmet.js
- CORS protection
- Request/response logging
- SQL injection prevention
- XSS protection

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Server    │    │   PostgreSQL    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Redis Cache   │    │   File Storage  │
                       │   (Optional)    │    │   (AWS S3)      │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis (optional, for caching)

### 1. Environment Setup

Copy the environment template and configure:
```bash
cp .env.example .env
```

**Critical Security Keys** (Generate secure values for production):
```bash
# Generate 32-byte encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate HMAC secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Database Setup

```bash
# Create database
createdb dreamteam_db

# Run migrations
npm run migrate

# Seed initial data (positions, quiz questions)
npm run seed
```

### 3. Install and Run

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development
npm run dev

# Run in production
npm start
```

## 📊 Database Schema

### Core Tables
- **users** - Encrypted user data with fake record obfuscation
- **candidates** - Candidate profiles with encrypted work plans
- **quiz_questions** - 100 political matching questions
- **quiz_answers** - Anonymized user responses with fake records
- **supporters** - Anonymized user-candidate relationships
- **positions** - 18 Minister + 15 Committee positions

### Security Features
- All sensitive data encrypted at application level
- `metadata_tag` column on each table for real/fake identification
- Anonymized user IDs for quiz answers and supporters
- Comprehensive indexing for performance with large datasets

## 🔗 API Endpoints

### Authentication
```
POST /api/auth/register      # User registration
POST /api/auth/login         # User login
POST /api/auth/verify-mfa    # MFA verification
GET  /api/auth/mfa-setup     # Setup MFA
POST /api/auth/mfa-enable    # Enable MFA
POST /api/auth/refresh-token # Refresh access token
GET  /api/auth/profile       # Get user profile
```

### Quiz System (Planned)
```
GET  /api/quiz/questions     # Get 100 questions
POST /api/quiz/answers       # Submit answers
GET  /api/quiz/my-answers    # Get user's answers
```

### Candidates (Planned)
```
GET  /api/candidates/public  # Public candidate directory
GET  /api/candidates/:id     # Candidate profile
POST /api/candidates/submit  # Submit candidacy
POST /api/candidates/:id/support # Support candidate
```

### Statistics (Planned)
```
GET  /api/stats/total-participants   # Total users
GET  /api/stats/national-dream-team  # Top ministers
GET  /api/stats/knesset-committees   # Top committees
```

## 🛡️ Security Implementation Details

### Real vs Fake Data Mechanism

```typescript
// Example: User registration creates 1 real + 5 fake records
const realUser = { /* actual user data */ };
const fakeUsers = fakeDataService.generateFakeUsers(realUser);

// All records get metadata tags
const realTag = encryptionService.generateRecordIntegrityTag(realUser, true);
const fakeTag = encryptionService.generateRecordIntegrityTag(fakeUser, false);

// Only real records pass verification
const integrity = encryptionService.verifyRecordIntegrity(tag, data);
if (integrity.isReal) {
  // Process real record
}
```

### Encryption Flow

```typescript
// Encryption
const encrypted = encryptionService.encrypt("sensitive data");
// Result: { encryptedData: "...", iv: "..." }

// Decryption
const decrypted = encryptionService.decrypt(encrypted);
```

### Anonymous User Identification

```typescript
// For quiz answers and supporters - no direct user linkage
const anonymousId = encryptionService.generateAnonymousUserHash(
  userId, 
  "quiz_context"
);
```

## 📈 Performance Considerations

- **Fake Data Impact**: 5x database size increase
- **Query Performance**: Optimized indexes on metadata tags
- **Memory Usage**: Efficient filtering of fake records
- **Caching**: Redis for frequently accessed data
- **Database Partitioning**: Recommended for 50M+ records

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dreamteam_db

# Security (CRITICAL - Use strong values in production)
ENCRYPTION_KEY=64_character_hex_key
HMAC_SECRET=64_character_hex_key
RECORD_INTEGRITY_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Fake Data Configuration
FAKE_RECORDS_MULTIPLIER=5
FAKE_DATA_GENERATION_SEED=deterministic_seed

# External Services
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
```

## 🚨 Security Warnings

1. **Never commit real encryption keys to version control**
2. **Use environment-specific keys for each deployment**
3. **Regularly rotate JWT secrets**
4. **Monitor failed authentication attempts**
5. **Backup encryption keys securely**

## 📝 Development

### Code Structure
```
src/
├── config/          # Database and external service configs
├── controllers/     # API endpoint handlers
├── middleware/      # Authentication, validation, security
├── models/          # Database models and queries
├── routes/          # API route definitions
├── services/        # Business logic and encryption
├── types/           # TypeScript type definitions
├── utils/           # Logging and helper functions
└── migrations/      # Database schema and seeds
```

### Testing
```bash
npm test                 # Run all tests
npm run test:coverage    # Coverage report
npm run test:security    # Security-focused tests
```

## 🔍 Monitoring & Logs

- **Security Events**: All authentication attempts logged
- **Data Access**: Comprehensive audit trail
- **Fake Data Filtering**: Monitoring of obfuscation effectiveness
- **Performance Metrics**: Query performance tracking
- **Error Handling**: Structured error logging

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Implement comprehensive tests for security features
3. Document any changes to encryption mechanisms
4. Test fake data generation thoroughly
5. Security review required for authentication changes

---

**Security Notice**: This application contains advanced security features including data obfuscation. Ensure all team members understand the encryption mechanisms before making changes to core security components.