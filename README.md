# Medical Assessment Platform - Setup Instructions

## Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- LiveKit account (optional for voice features)
- Google Cloud account (for cloud SQL)

## Installation Steps

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd medical-assessment-platform
npm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations (if needed)
npm run db:migrate
```

### 3. Environment Configuration
Copy `.env.local.example` to `.env.local` and fill in your values:
```bash
cp .env.local.example .env.local
```

### 4. Seed Database (Optional)
```bash
# Run the Python seeding script first (from the SQLAlchemy section)
python seed_database.py

# Or create sample data through the API
```

### 5. Run Development Server
```bash
npm run dev
```

## Features Overview

### 🎤 Voice Assessment
- Real-time speech recognition
- Natural language processing
- LiveKit integration for real-time communication

### 🧠 AI Analysis
- OpenAI GPT integration
- Medical information extraction
- Risk score calculation using CADC algorithms

### 💾 Database Integration
- Prisma ORM with PostgreSQL
- Google Cloud SQL support
- Secure patient data storage

### 📊 Risk Assessment
- CADC clinical risk calculation
- Chest pain classification
- Probability scoring

## API Endpoints

- `POST /api/assessment` - Submit assessment responses
- `POST /api/voice/session` - Create voice session
- `POST /api/voice/process` - Process voice transcript
- `PUT /api/voice/session/:id/end` - End voice session

## Usage

1. Navigate to `/assessment` to start a new assessment
2. Choose between text or voice input
3. Answer all medical questions
4. Review risk assessment results
5. Data is automatically stored in the database

## Important Notes

⚠️ **Medical Disclaimer**: This platform is for educational and research purposes only. Always consult qualified healthcare professionals for medical decisions.

🔒 **Security**: Ensure proper HIPAA compliance when handling real patient data.

🚀 **Deployment**: Configure proper environment variables for production deployment.