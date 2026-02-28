# AprendiMoz - Installation Guide

## Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **Redis** (opcional, para cache)
- **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aprendimoz
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Or install manually:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Database Setup

#### PostgreSQL

```bash
# Create database
createdb aprendimoz

# Create user (optional)
createuser aprendimoz
psql -c "ALTER USER aprendimoz WITH PASSWORD 'your_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE aprendimoz TO aprendimoz;"
```

#### Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your configuration
```

### 4. Database Migration

```bash
cd backend
npm run migration:run
```

### 5. Start Development Servers

```bash
# Start both backend and frontend
npm run dev

# Or start individually:
npm run dev:backend  # Backend on port 3001
npm run dev:frontend # Frontend on port 3000
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## Environment Configuration

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/aprendimoz
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=aprendimoz
DB_PASSWORD=your_password
DB_DATABASE=aprendimoz

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Redis (opcional)
REDIS_URL=redis://localhost:6379

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# M-Pesa
MPESA_API_KEY=your-mpesa-api-key
MPESA_SECRET=your-mpesa-secret
MPESA_ENVIRONMENT=sandbox

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=aprendimoz-uploads

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AprendiMoz
NEXT_PUBLIC_APP_DESCRIPTION=Plataforma de Educação Online Moçambicana
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_CERTIFICATES=true
NEXT_PUBLIC_ENABLE_MARKETPLACE=true
```

## Docker Setup (Optional)

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

```bash
# Backend
cd backend
docker build -t aprendimoz-backend .
docker run -p 3001:3001 aprendimoz-backend

# Frontend
cd frontend
docker build -t aprendimoz-frontend .
docker run -p 3000:3000 aprendimoz-frontend
```

## Development Workflow

### Code Structure

```
aprendimoz/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # Configuration
│   │   └── database/       # Database setup
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
├── shared/                 # Shared types and utilities
├── docs/                  # Documentation
└── docker/               # Docker configurations
```

### Common Commands

```bash
# Development
npm run dev                # Start both servers
npm run dev:backend        # Backend only
npm run dev:frontend       # Frontend only

# Building
npm run build              # Build both
npm run build:backend      # Backend only
npm run build:frontend     # Frontend only

# Testing
npm run test               # Run all tests
npm run test:backend        # Backend tests
npm run test:frontend      # Frontend tests

# Linting
npm run lint               # Lint both
npm run lint:backend        # Backend linting
npm run lint:frontend      # Frontend linting

# Database
npm run migration:generate  # Create new migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432

# Check if database exists
psql -l

# Create database if missing
createdb aprendimoz
```

#### 2. Port Already in Use

```bash
# Find process using port
lsof -ti:3000  # Frontend
lsof -ti:3001  # Backend

# Kill process
kill -9 <PID>
```

#### 3. Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors

```bash
# Check TypeScript version
npm list typescript

# Rebuild
npm run build
```

### Getting Help

- **Documentation**: Check `/docs` folder
- **API Docs**: http://localhost:3001/api/docs
- **Issues**: Create issue on repository
- **Support**: Contact development team

## Production Deployment

### Environment Setup

1. **Set production environment variables**
2. **Build applications**: `npm run build`
3. **Setup database**: Run migrations
4. **Configure reverse proxy** (nginx)
5. **Setup SSL certificates**
6. **Configure monitoring**

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests: `npm run test`
5. Submit pull request

## License

MIT License - see LICENSE file for details.
