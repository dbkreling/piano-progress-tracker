# Domain Model Documentation

## Overview

This document describes the core domain entities, their relationships, and business rules in the Piano Progress Tracker application.

## Domain Entities

### User

Represents a piano student using the application.

```typescript
interface User {
  id: string;              // UUID from Supabase auth
  email: string;           // Login email
  displayName?: string;    // Optional display name
  createdAt: string;       // Account creation timestamp
  updatedAt: string;       // Last profile update timestamp
}
```

**Business Rules:**
- Each user has a unique email address
- Users can only access their own data (enforced by RLS)
- Display name is optional and can be updated

**Relationships:**
- One user has many practice sessions
- One user has many syllabus items
- One user has many theory progress records

---

### PracticeSession

Represents a single practice session with duration, rating, and items practiced.

```typescript
interface PracticeSession {
  id: string;                   // UUID
  userId: string;               // Foreign key to User
  date: string;                 // ISO date string (YYYY-MM-DD)
  durationMinutes: number;      // Total practice time in minutes
  rating: number;               // Self-rating 1-5
  notes: string;                // Free-form practice notes
  isForNextLesson: boolean;     // Flag for lesson prep
  items: PracticeItem[];        // Items practiced in this session
  createdAt: string;            // Creation timestamp
  updatedAt: string;            // Last update timestamp
}
```

**Business Rules:**
- Duration must be >= 0 minutes
- Rating must be between 1 and 5 (inclusive)
- A session can have zero or more practice items
- Sessions are ordered by date (most recent first)
- Users can mark sessions for lesson prep export

**Relationships:**
- One session belongs to one user
- One session has many practice items

**Common Operations:**
- Create a new practice session
- Update session duration, rating, or notes
- Mark session for next lesson
- Delete session (cascades to practice items)
- Filter sessions by date range
- Calculate total practice time over a period

---

### PracticeItem

Represents an individual item (scale, piece, exercise) practiced during a session.

```typescript
interface PracticeItem {
  id: string;                  // UUID
  practiceSessionId: string;   // Foreign key to PracticeSession
  name: string;                // Name of item (e.g., "C Major Scale")
  category: PracticeCategory;  // Type of practice item
  createdAt: string;           // Creation timestamp
}

type PracticeCategory =
  | 'scale'
  | 'repertoire'
  | 'technical'
  | 'sight-reading'
  | 'theory'
  | 'ear-training';
```

**Business Rules:**
- Each item must have a name and category
- Items are automatically deleted when parent session is deleted
- Items can be filtered by category for analytics

**Relationships:**
- One item belongs to one practice session
- One session can have many items

**Common Operations:**
- Add item to practice session
- Group items by category for analysis
- Track most frequently practiced items

---

### SyllabusItem

Represents a piece, scale, or exercise in the user's syllabus with status tracking.

```typescript
interface SyllabusItem {
  id: string;           // UUID
  userId: string;       // Foreign key to User
  title: string;        // Title of piece/scale/exercise
  category: string;     // Category (scale, repertoire, technical, etc.)
  level: string;        // Grade level (e.g., "RCM 1", "RCM 2")
  status: SyllabusStatus;  // Current status
  createdAt: string;    // Creation timestamp
  updatedAt: string;    // Last update timestamp
}

type SyllabusStatus =
  | 'planned'          // Not started yet
  | 'in-progress'      // Currently learning
  | 'ready-for-exam'   // Polished and exam-ready
  | 'completed';       // Mastered or examined

interface SyllabusProgress {
  level: string;       // Grade level
  total: number;       // Total items at this level
  completed: number;   // Number of completed items
  percentage: number;  // Completion percentage (0-100)
}
```

**Business Rules:**
- Status must follow logical progression (planned → in-progress → ready-for-exam → completed)
- Multiple items can be at the same level
- Level format is flexible (supports RCM, ABRSM, or custom levels)
- Progress is calculated per level

**Relationships:**
- One item belongs to one user
- Items are grouped by level for progress tracking

**Common Operations:**
- Create new syllabus item
- Update item status
- Calculate progress by level
- Filter items by level and status
- Track items ready for exam

---

### TheoryLevel

Represents a grade level's theory requirements (reference data).

```typescript
interface TheoryLevel {
  id: string;                              // UUID
  levelName: string;                       // "Prep A", "Level 1", etc.
  scalesList?: ScaleDefinition[];          // Required scales
  repertoire?: RepertoireList;             // Repertoire lists A/B/C/D
  technicalRequirements?: TechnicalRequirement[];  // Arpeggios, chords, etc.
  createdAt: string;                       // Creation timestamp
}

interface ScaleDefinition {
  name: string;            // "C Major"
  type: 'major' | 'minor-natural' | 'minor-harmonic' | 'minor-melodic';
  key: string;             // "C", "G", "D", etc.
  hands: 'separate' | 'together' | 'both';
  octaves: number;         // Number of octaves required
}

interface RepertoireList {
  listA?: RepertoirePiece[];  // Baroque
  listB?: RepertoirePiece[];  // Classical
  listC?: RepertoirePiece[];  // Romantic
  listD?: RepertoirePiece[];  // Contemporary
}
```

**Business Rules:**
- Theory levels are pre-populated reference data
- All authenticated users can read theory levels
- Only admins can modify (future feature)
- Data stored as JSONB for flexibility

**Relationships:**
- No direct foreign keys (reference data)
- Used for content generation and recommendations

---

### UserTheoryProgress

Tracks user's progress through theory topics and exercises.

```typescript
interface UserTheoryProgress {
  id: string;           // UUID
  userId: string;       // Foreign key to User
  level: string;        // Level identifier (e.g., "Level 1")
  topic: string;        // Topic identifier (e.g., "intervals", "scales")
  score: number;        // Score 0-100
  lastReview: string;   // Last review timestamp
  createdAt: string;    // Creation timestamp
}
```

**Business Rules:**
- Score must be between 0 and 100
- Each user can have only one progress record per (level, topic) combination
- Progress is updated on each review/exercise completion
- Used for adaptive learning and recommendations

**Relationships:**
- One progress record belongs to one user
- Multiple progress records per user (one per level/topic combination)

---

## Domain Workflows

### Practice Session Workflow

1. **Create Session**
   - User starts new practice session
   - Enters date, duration, rating
   - Adds items practiced
   - Optionally adds notes
   - Saves session

2. **Review Session**
   - User views list of past sessions
   - Sessions sorted by date (newest first)
   - Can filter by date range

3. **Update Session**
   - User edits existing session
   - Can update duration, rating, notes, lesson prep flag
   - Cannot change user or creation date

4. **Mark for Lesson Prep**
   - User marks important sessions
   - Flagged sessions appear in lesson prep export

### Syllabus Management Workflow

1. **Plan Curriculum**
   - User adds pieces/scales to syllabus
   - Sets level and category
   - Starts with 'planned' status

2. **Start Learning**
   - User updates status to 'in-progress'
   - Logs practice sessions for this item

3. **Polish and Prepare**
   - User updates status to 'ready-for-exam'
   - Item is exam-ready

4. **Complete**
   - User updates status to 'completed'
   - Contributes to level progress percentage

### Analytics Workflow

1. **Calculate Streak**
   - System counts consecutive days with practice
   - Breaks on first gap day
   - Displayed on dashboard

2. **Aggregate Practice Time**
   - System sums practice minutes per day/week/month
   - Displays in charts
   - Shows trends over time

3. **Track Progress**
   - System calculates completion % per level
   - Shows which pieces are ready for exam
   - Identifies gaps in curriculum

## Business Rules Summary

### Constraints
- Practice duration >= 0 minutes
- Practice rating between 1-5
- Theory score between 0-100
- Unique (user_id, level, topic) for theory progress

### Validation
- Dates must be valid ISO strings
- Email must be valid format
- Required fields cannot be null

### Access Control
- Users can only access their own data
- Theory levels are read-only for all users
- RLS enforces all access rules at database level

### Data Integrity
- Cascade delete: deleting session deletes practice items
- Cascade delete: deleting user deletes all user data
- Foreign key constraints prevent orphaned records

## Future Enhancements

### Planned Features
- **Goals**: Set practice time goals, track completion
- **Reminders**: Practice reminders based on streak
- **Sharing**: Share progress with teacher
- **Audio**: Attach recordings to practice items
- **AI Recommendations**: Suggest next items to practice

### Domain Model Extensions
- `Goal` entity for practice goals
- `Recording` entity for audio files
- `Teacher` entity for teacher-student relationship
- `Assignment` entity for teacher-assigned items
