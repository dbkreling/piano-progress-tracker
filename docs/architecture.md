# Architecture Documentation

## Overview

The Piano Progress Tracker is a full-stack web application built with React, TypeScript, and Supabase. It follows a clean architecture pattern with clear separation of concerns to maximize maintainability, testability, and learning value.

## Technology Stack

### Frontend
- **React 19** - UI library with hooks-based component model
- **TypeScript 5.9** - Strict typing for type safety
- **Vite 7** - Fast build tool and dev server
- **React Router 6** - Client-side routing
- **React Hook Form** - Form state management
- **Zod** - Runtime schema validation
- **Recharts** - Data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (email/password)
  - Row-Level Security (RLS)
  - Realtime subscriptions (future)

### Testing
- **Vitest** - Fast unit test runner
- **Testing Library** - Component testing utilities
- **Happy DOM** - Lightweight DOM implementation

## Project Structure

```
piano-progress-tracker/
├── src/
│   ├── components/          # Presentational UI components
│   │   ├── ui/              # Generic reusable components (Button, Card, Input)
│   │   └── layout/          # Layout components (Header, Sidebar)
│   ├── features/            # Feature modules (self-contained business logic)
│   │   ├── auth/            # Authentication
│   │   ├── practice-log/    # Practice logging
│   │   ├── syllabus/        # Syllabus tracking
│   │   ├── analytics/       # Charts and analytics
│   │   ├── theory/          # Theory exercises
│   │   └── lesson-prep/     # Lesson preparation
│   ├── services/            # API and data access layer
│   │   ├── supabase/        # Supabase client configuration
│   │   ├── api/             # Service classes for data operations
│   │   └── storage/         # Local storage utilities
│   ├── models/              # TypeScript type definitions
│   │   ├── user.ts
│   │   ├── practice.ts
│   │   ├── syllabus.ts
│   │   └── theory.ts
│   ├── utils/               # Pure utility functions
│   │   ├── date.ts
│   │   ├── streak.ts
│   │   ├── aggregation.ts
│   │   └── validation.ts
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Third-party library configurations
│   ├── App.tsx
│   └── main.tsx
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   │   ├── utils/
│   │   ├── services/
│   │   └── features/
│   └── integration/         # Integration tests (future)
├── docs/                    # Documentation
├── supabase/               # Supabase configuration
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## Architectural Layers

### 1. Presentation Layer (Components)

**Purpose:** Render UI and handle user interactions.

**Characteristics:**
- Dumb/presentational components in `components/`
- Smart/container components in `features/`
- No direct database or API calls
- Receive data via props or custom hooks
- Emit events via callbacks

**Example:**
```typescript
// Presentational component
function PracticeSessionCard({ session, onEdit, onDelete }) {
  return (
    <Card>
      <h3>{session.date}</h3>
      <p>{session.durationMinutes} minutes</p>
      <Rating value={session.rating} />
      <Button onClick={() => onEdit(session)}>Edit</Button>
    </Card>
  );
}
```

### 2. Feature Layer (Business Logic)

**Purpose:** Coordinate application features and business logic.

**Characteristics:**
- Feature-specific components and hooks
- Contains UI logic and state management
- Uses services for data operations
- Orchestrates user workflows

**Example:**
```typescript
// Feature module hook
function usePracticeLog() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  const loadSessions = async () => {
    const data = await practiceService.getSessions();
    setSessions(data);
  };

  return { sessions, loadSessions };
}
```

### 3. Service Layer (Data Access)

**Purpose:** Abstract data operations and external API calls.

**Characteristics:**
- Service classes for each domain entity
- Handle Supabase queries
- Error handling and data transformation
- Map database records to domain models

**Example:**
```typescript
// Service class
class PracticeService {
  async getSessions(): Promise<PracticeSession[]> {
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapFromDb);
  }
}
```

### 4. Domain Model Layer (Types)

**Purpose:** Define core business entities and their relationships.

**Characteristics:**
- Pure TypeScript interfaces and types
- No implementation logic
- Shared across all layers
- Single source of truth for data structures

**Example:**
```typescript
// Domain model
interface PracticeSession {
  id: string;
  userId: string;
  date: string;
  durationMinutes: number;
  rating: number;
  items: PracticeItem[];
}
```

### 5. Utility Layer (Pure Functions)

**Purpose:** Provide reusable, testable business logic.

**Characteristics:**
- Pure functions (no side effects)
- No dependencies on React or Supabase
- Easily testable
- Domain-specific calculations

**Example:**
```typescript
// Pure utility function
function calculateStreak(sessions: Array<{ date: string }>): number {
  // Business logic for streak calculation
  // No side effects, easy to test
}
```

## Data Flow

### Read Flow (Query)
1. User interacts with UI component
2. Component calls custom hook or triggers effect
3. Hook calls service method
4. Service queries Supabase
5. Service maps database records to domain models
6. Domain models returned to hook
7. Hook updates component state
8. Component re-renders with new data

### Write Flow (Command)
1. User submits form in UI
2. Form handler validates input
3. Handler calls service method with validated data
4. Service transforms domain model to database format
5. Service inserts/updates Supabase
6. Service returns updated domain model
7. Component updates local state
8. UI reflects changes

## Security Model

### Authentication
- Supabase Auth handles user authentication
- Email/password authentication
- JWT tokens for session management
- Automatic token refresh

### Authorization
- Row-Level Security (RLS) policies in PostgreSQL
- Users can only access their own data
- Policies enforced at database level
- No server-side auth logic needed

### Data Validation
- Client-side validation with Zod schemas
- Database constraints (CHECK, NOT NULL)
- Type safety via TypeScript

## State Management

### Local Component State
- `useState` for simple component-level state
- Form state managed by React Hook Form

### Server State
- Service layer handles server communication
- Future: React Query for caching and optimistic updates

### Global State
- React Context for authentication state
- Future: Consider Zustand for complex global state

## Error Handling

### API Errors
- Services throw errors with descriptive messages
- Components catch and display user-friendly errors
- Error boundaries for unexpected errors

### Validation Errors
- Zod schemas validate user input
- Form libraries display field-level errors

## Performance Considerations

### Database
- Indexes on frequently queried columns
- RLS policies optimized for performance
- Pagination for large result sets (future)

### Frontend
- Code splitting by route (future)
- Lazy loading for heavy components
- Memoization for expensive calculations

## Scalability

### Current Architecture
- Suitable for single-user or small-team usage
- Supabase free tier supports initial users

### Future Enhancements
- Add caching layer (React Query)
- Implement optimistic updates
- Add real-time collaboration features
- Consider CDN for static assets

## Testing Strategy

### Unit Tests
- Test pure utility functions
- Test service layer methods (mocked Supabase)
- Test custom hooks (React Testing Library)

### Integration Tests (Future)
- Test complete user workflows
- Test database interactions with test database

### E2E Tests (Future)
- Playwright for critical user paths

## Deployment

### Frontend
- Build with `npm run build`
- Deploy to Vercel, Netlify, or similar
- Environment variables for Supabase config

### Database
- Migrations applied via Supabase dashboard or CLI
- Automated backups via Supabase

## Design Principles

1. **Separation of Concerns** - Each layer has a single responsibility
2. **Dependency Inversion** - Higher layers depend on abstractions (interfaces)
3. **DRY** - Reusable utilities and components
4. **Type Safety** - Strict TypeScript, no `any` types
5. **Testability** - Pure functions, dependency injection
6. **Progressive Enhancement** - Core features work, enhancements added incrementally

## Learning Goals

This architecture is designed to teach:
- Clean architecture patterns
- TypeScript best practices
- React hooks and modern patterns
- Database design and RLS
- Testing methodologies
- Full-stack development workflow
