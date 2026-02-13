# Piano Progress Tracker

A full-stack web application for tracking piano practice, syllabus progress, and theory learning. Built with React, TypeScript, and Supabase, designed for both practical use and studying software engineering best practices.

## Features

### Current (Scaffolding Complete)
- ✅ Clean architecture with separation of concerns
- ✅ TypeScript with strict mode
- ✅ Comprehensive test setup with Vitest
- ✅ Database schema with Row-Level Security
- ✅ Example utility functions with full test coverage
- ✅ Documentation for architecture, domain model, and testing

### Planned Features
- 🎯 **Practice Log** - Track daily practice sessions with duration, rating, and items practiced
- 📊 **Analytics** - View practice streaks, time trends, and progress charts
- 📚 **Syllabus Tracker** - Manage pieces, scales, and exercises with status tracking
- 🎵 **Theory Exercises** - Interactive theory drills and flashcards
- 📖 **Lesson Prep** - Export practice summary for teacher review
- 🤖 **Adaptive Learning** - AI-powered exercise generation and recommendations

## Technology Stack

- **Frontend:** React 19, TypeScript 5.9, Vite 7
- **Backend:** Supabase (PostgreSQL, Authentication, RLS)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Testing:** Vitest + Testing Library
- **Icons:** Lucide React

## Project Structure

```
piano-progress-tracker/
├── src/
│   ├── components/       # UI components
│   ├── features/         # Feature modules
│   ├── services/         # API/data access
│   ├── models/           # TypeScript types
│   ├── utils/            # Pure utility functions
│   └── hooks/            # Custom React hooks
├── tests/                # Test files
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── docs/                 # Documentation
│   ├── architecture.md
│   ├── domain-model.md
│   ├── testing.md
│   └── database-schema.md
├── supabase/
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd piano-progress-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Run the database migration:
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Run the migration

   c. Get your project credentials:
   - Go to Project Settings → API
   - Copy the Project URL and anon/public key

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

### Running Tests

The project includes comprehensive unit tests demonstrating best practices:

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run specific test file
npm test -- streak.test.ts

# Generate coverage report
npm run test:coverage
```

**Current Test Coverage:**
- `utils/streak.ts` - 100% coverage (8 test cases)
- `utils/aggregation.ts` - 100% coverage (7 test cases)

See `docs/testing.md` for detailed testing documentation.

## Architecture

### Architectural Layers

1. **Presentation Layer** (`components/`)
   - Dumb UI components
   - No business logic or API calls

2. **Feature Layer** (`features/`)
   - Smart components
   - Feature-specific logic
   - Orchestrates workflows

3. **Service Layer** (`services/`)
   - Data access and API calls
   - Supabase integration
   - Error handling

4. **Domain Layer** (`models/`)
   - TypeScript interfaces
   - Type definitions
   - Business entities

5. **Utility Layer** (`utils/`)
   - Pure functions
   - Business logic
   - Highly testable

### Data Flow

```
User → Component → Hook → Service → Supabase → Database
                                             ← RLS Policies
```

For detailed architecture documentation, see `docs/architecture.md`.

## Database Schema

### Core Tables

- **users** - User profiles
- **practice_sessions** - Practice sessions with duration and rating
- **practice_items** - Items practiced in each session
- **syllabus_items** - Curriculum tracking with status
- **theory_levels** - RCM syllabus reference data
- **user_theory_progress** - Theory topic progress

### Security

All tables use Row-Level Security (RLS) to ensure users can only access their own data. Policies are enforced at the database level.

See `docs/database-schema.md` for complete schema documentation.

## Domain Model

### Key Entities

- **PracticeSession** - Individual practice session
- **PracticeItem** - Item practiced (scale, piece, exercise)
- **SyllabusItem** - Curriculum item with status tracking
- **UserTheoryProgress** - Progress through theory topics

See `docs/domain-model.md` for detailed domain documentation.

## Testing Strategy

Following the testing pyramid:
- **Unit Tests** (Many) - Pure functions, business logic
- **Integration Tests** (Some) - Feature workflows
- **E2E Tests** (Few) - Critical user paths

### Test-Driven Development

This project demonstrates TDD principles:
1. Write failing test (Red)
2. Write minimal code to pass (Green)
3. Refactor code (Refactor)

See `docs/testing.md` for comprehensive testing documentation.

## Contributing

This is a learning project. Contributions are welcome!

### Development Workflow

1. Create a feature branch
2. Write tests first (TDD)
3. Implement feature
4. Ensure all tests pass
5. Update documentation
6. Submit pull request

### Code Style

- Use TypeScript strict mode
- No `any` types in core modules
- Follow existing architecture patterns
- Write tests for new features
- Update documentation as needed

## Learning Goals

This project is designed to teach:

- **Clean Architecture** - Separation of concerns, dependency inversion
- **TypeScript** - Type safety, interfaces, generics
- **Testing** - Unit testing, TDD, mocking strategies
- **Database Design** - Schema design, RLS, migrations
- **Full-Stack Development** - Frontend, backend, authentication
- **Software Engineering** - SDLC, documentation, best practices

## Documentation

- [Architecture](docs/architecture.md) - System architecture and design patterns
- [Domain Model](docs/domain-model.md) - Business entities and rules
- [Testing](docs/testing.md) - Testing strategy and best practices
- [Database Schema](docs/database-schema.md) - Database design and RLS policies

## Roadmap

### Phase 1: Foundation (Current)
- [x] Project scaffolding
- [x] Database schema
- [x] Type definitions
- [x] Example utilities with tests
- [x] Documentation

### Phase 2: Core Features
- [ ] Authentication (sign up, login, logout)
- [ ] Practice log CRUD
- [ ] Dashboard with basic stats
- [ ] Syllabus tracker

### Phase 3: Analytics
- [ ] Practice streak calculation
- [ ] Charts and visualizations
- [ ] Progress tracking by level
- [ ] Lesson prep export

### Phase 4: Theory & Exercises
- [ ] Theory level content
- [ ] Interactive exercises
- [ ] Flashcards
- [ ] Progress tracking

### Phase 5: Advanced Features
- [ ] AI exercise generation
- [ ] Adaptive learning
- [ ] Audio/video attachments
- [ ] Teacher-student collaboration

## License

MIT

## Acknowledgments

- Built for RCM (Royal Conservatory of Music) syllabus structure
- Inspired by deliberate practice principles
- Designed for learning software engineering

---

**Status:** 🚧 Scaffolding Complete - Ready for Feature Development

**Current Phase:** Foundation - All architectural components in place, ready to build features

**Next Steps:** Implement authentication and practice log features
