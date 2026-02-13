# Testing Documentation

## Overview

This document describes the testing strategy, methodologies, and practices for the Piano Progress Tracker application. Testing is a core part of this project's learning goals, demonstrating software engineering discipline and quality assurance.

## Testing Philosophy

### Goals
1. **Confidence**: Tests provide confidence that code works as expected
2. **Documentation**: Tests serve as executable specifications
3. **Refactoring Safety**: Tests enable safe code improvements
4. **Learning**: Tests teach testing best practices and methodologies

### Principles
- Test behavior, not implementation details
- Write tests that give confidence in production code
- Keep tests simple, readable, and maintainable
- Favor integration tests over implementation-specific tests
- Use the testing pyramid as a guide

## Testing Pyramid

```
       /\
      /  \     E2E Tests (Few)
     /----\    - Critical user paths
    /      \   - Full system tests
   /--------\
  /          \ Integration Tests (Some)
 /------------\ - Feature workflows
/              \ - API integration
----------------
                Unit Tests (Many)
                - Pure functions
                - Business logic
                - Utility functions
```

### Unit Tests (Base - Most Tests)
- Test individual functions and modules in isolation
- Fast execution (milliseconds)
- Easy to write and maintain
- Focus on pure functions and business logic
- Mock external dependencies

### Integration Tests (Middle - Moderate Tests)
- Test multiple components working together
- Test service layer with real database (test DB)
- Verify API integrations
- Slower than unit tests but faster than E2E

### E2E Tests (Top - Fewest Tests)
- Test complete user workflows
- Test critical paths only
- Slowest but highest confidence
- Run less frequently

## Testing Tools

### Vitest
- Fast, modern test runner
- Compatible with Jest API
- Native ESM support
- Watch mode for development

### Testing Library
- User-centric testing utilities
- Tests behavior users see
- Encourages accessible markup
- Works with React components

### Happy DOM
- Lightweight DOM implementation
- Faster than jsdom
- Sufficient for most component tests

## Test Organization

### Directory Structure
```
tests/
├── unit/              # Unit tests
│   ├── utils/         # Utility function tests
│   │   ├── streak.test.ts
│   │   └── aggregation.test.ts
│   ├── services/      # Service layer tests
│   │   └── practice.service.test.ts
│   └── features/      # Feature logic tests
│       └── practice-log/
├── integration/       # Integration tests (future)
│   └── practice-workflow.test.ts
└── setup.ts          # Test configuration
```

### Test File Naming
- Unit test files: `*.test.ts` or `*.test.tsx`
- Place tests in `/tests` directory mirroring `src/` structure
- Alternative: Co-locate tests with source (future consideration)

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../../../src/utils/streak';

describe('calculateStreak', () => {
  it('returns 0 for empty sessions array', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('calculates consecutive days correctly', () => {
    const sessions = [
      { date: '2024-01-15' },
      { date: '2024-01-14' },
      { date: '2024-01-13' },
    ];
    expect(calculateStreak(sessions)).toBe(3);
  });
});
```

**Best Practices:**
- Descriptive test names (what it does, not how)
- Test one concept per test
- Use AAA pattern: Arrange, Act, Assert
- Avoid magic numbers, use descriptive constants

### Service Layer Test Example

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { practiceService } from '../../../src/services/api/practice.service';
import { supabase } from '../../../src/services/supabase/client';

// Mock Supabase client
vi.mock('../../../src/services/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('PracticeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a practice session successfully', async () => {
    // Arrange
    const mockSession = {
      id: 'session-1',
      user_id: 'user-1',
      date: '2024-01-15',
      duration_minutes: 30,
      rating: 4,
    };

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    // Mock chain: from().insert().select().single()
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSession, error: null }),
    };

    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue(mockChain),
    });

    // Act
    const input = {
      date: '2024-01-15',
      durationMinutes: 30,
      rating: 4,
      notes: '',
      items: [],
    };

    const result = await practiceService.createSession(input);

    // Assert
    expect(result.id).toBe('session-1');
    expect(result.durationMinutes).toBe(30);
  });
});
```

### Component Test Example (Future)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PracticeSessionCard } from '../../../src/components/PracticeSessionCard';

describe('PracticeSessionCard', () => {
  it('displays session information', () => {
    const session = {
      id: '1',
      date: '2024-01-15',
      durationMinutes: 30,
      rating: 4,
      notes: 'Good practice',
    };

    render(<PracticeSessionCard session={session} />);

    expect(screen.getByText('30 minutes')).toBeInTheDocument();
    expect(screen.getByText('Good practice')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    const session = { id: '1', /* ... */ };

    render(<PracticeSessionCard session={session} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(session);
  });
});
```

## Running Tests

### Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with UI (interactive browser interface)
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- streak.test.ts

# Run tests matching pattern
npm test -- --grep="calculateStreak"
```

### Watch Mode Workflow
1. Start watch mode: `npm run test:watch`
2. Edit code or tests
3. Tests auto-run on save
4. Fix failures iteratively
5. Commit when all tests pass

## Test Coverage

### Coverage Goals
- **Utility functions**: 100% coverage (pure logic, easy to test)
- **Service layer**: 80%+ coverage (critical business logic)
- **Components**: 70%+ coverage (focus on user interactions)
- **Overall**: 75%+ coverage

### Coverage Reports
- Generated in `coverage/` directory
- HTML report: `coverage/index.html`
- View line-by-line coverage
- Identify untested code paths

### What to Test
✅ **Do Test:**
- Pure utility functions
- Business logic
- Service layer methods
- User interactions
- Error handling
- Edge cases

❌ **Don't Test:**
- Third-party libraries
- Simple getter/setter methods
- Trivial code
- UI styling details

## Mocking Strategy

### When to Mock
- External APIs (Supabase, OpenAI)
- File system operations
- Time-dependent code (dates, timers)
- Random number generation

### Mocking Techniques

```typescript
// Mock module
vi.mock('../services/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock function
const mockFn = vi.fn();

// Mock implementation
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: [] });

// Mock timers
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-01-15'));
```

## Test Data

### Factories and Fixtures

```typescript
// test/factories/practice.ts
export function createMockPracticeSession(overrides = {}) {
  return {
    id: 'session-1',
    userId: 'user-1',
    date: '2024-01-15',
    durationMinutes: 30,
    rating: 4,
    notes: '',
    items: [],
    ...overrides,
  };
}

// Usage in tests
const session = createMockPracticeSession({ rating: 5 });
```

### Test Data Principles
- Use factories for complex objects
- Make test data obvious and readable
- Use descriptive IDs ('user-1' not 'abc123')
- Keep test data minimal

## Continuous Integration

### CI Pipeline (Future)
1. Checkout code
2. Install dependencies
3. Run linter
4. Run type check
5. Run all tests
6. Generate coverage report
7. Fail build if tests fail or coverage drops

### Pre-commit Hooks (Future)
- Run tests on staged files
- Block commit if tests fail
- Ensure code quality before push

## Testing Anti-Patterns

### Avoid These Mistakes

❌ **Testing Implementation Details**
```typescript
// Bad: Tests internal state
expect(component.state.count).toBe(5);

// Good: Tests user-visible behavior
expect(screen.getByText('Count: 5')).toBeInTheDocument();
```

❌ **Brittle Tests**
```typescript
// Bad: Depends on exact DOM structure
expect(container.firstChild.firstChild.textContent).toBe('Hello');

// Good: Uses semantic queries
expect(screen.getByRole('heading')).toHaveTextContent('Hello');
```

❌ **Huge Test Files**
- Keep test files focused
- Split large test suites into multiple files
- Group related tests with `describe` blocks

❌ **Slow Tests**
- Mock expensive operations
- Avoid unnecessary DOM rendering
- Run heavy tests less frequently

## SDLC Integration

### Development Workflow
1. Write failing test (Red)
2. Write minimal code to pass (Green)
3. Refactor code (Refactor)
4. Repeat (TDD cycle)

### Code Review Checklist
- [ ] New features have tests
- [ ] Tests are readable
- [ ] Tests check edge cases
- [ ] Coverage hasn't decreased
- [ ] Tests are fast

### Definition of Done
- Code implemented
- Tests written and passing
- Code reviewed
- Documentation updated
- Coverage target met

## Learning Resources

### Concepts Demonstrated
1. **Unit Testing**: Pure function testing
2. **Mocking**: External dependency isolation
3. **TDD**: Test-first development
4. **AAA Pattern**: Arrange-Act-Assert structure
5. **Test Pyramid**: Balance of test types

### Further Learning
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Writing Testable Code](https://testing.googleblog.com/2008/08/by-miko-hevery-so-you-decided-to.html)

## Current Test Coverage

### Implemented Tests

✅ **utils/streak.ts**
- Empty sessions
- Single session today
- Consecutive days
- Gaps in practice
- Multiple sessions per day
- Long streaks

✅ **utils/aggregation.ts**
- Empty input
- Single session
- Multiple sessions per day
- Date sorting
- Average rating calculation
- Level progress calculation

### Planned Tests

🔜 **Service Layer**
- PracticeService CRUD operations
- Error handling
- Data transformation

🔜 **Components**
- PracticeSessionCard
- PracticeSessionForm
- SessionList

🔜 **Features**
- Practice log workflow
- Syllabus management
- Analytics calculations

## Metrics and Goals

### Current Status
- Total tests: 15
- Test files: 2
- Coverage: ~100% for utilities
- Average test runtime: <100ms

### Future Goals
- 50+ total tests
- 75% overall coverage
- All critical paths tested
- CI/CD integration
- Pre-commit hooks
