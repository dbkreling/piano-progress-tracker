# Database Schema Documentation

## Overview

The Piano Progress Tracker uses PostgreSQL (via Supabase) for data storage. The schema is designed for:
- Data integrity via foreign keys and constraints
- Security via Row-Level Security (RLS) policies
- Performance via strategic indexes
- Maintainability via clear relationships

## Entity Relationship Diagram

```
┌──────────────┐
│  auth.users  │ (Supabase managed)
│  (external) │
└──────┬───────┘
       │
       │ 1:1
       ▼
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK, FK)  │
│ email        │
│ display_name │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │
       │ 1:N
       ├───────────────────────────────────────┐
       │                                       │
       ▼                                       ▼
┌──────────────────┐                   ┌─────────────────┐
│practice_sessions │                   │ syllabus_items  │
├──────────────────┤                   ├─────────────────┤
│ id (PK)          │                   │ id (PK)         │
│ user_id (FK)     │                   │ user_id (FK)    │
│ date             │                   │ title           │
│ duration_minutes │                   │ category        │
│ rating           │                   │ level           │
│ notes            │                   │ status          │
│ is_for_lesson    │                   │ created_at      │
│ created_at       │                   │ updated_at      │
│ updated_at       │                   └─────────────────┘
└────────┬─────────┘
         │
         │ 1:N                          ┌──────────────────────┐
         ▼                              │user_theory_progress  │
┌──────────────────┐                   ├──────────────────────┤
│ practice_items   │                   │ id (PK)              │
├──────────────────┤                   │ user_id (FK)         │
│ id (PK)          │                   │ level                │
│ session_id (FK)  │                   │ topic                │
│ name             │                   │ score                │
│ category         │                   │ last_review          │
│ created_at       │                   │ created_at           │
└──────────────────┘                   └──────────────────────┘
                                                ▲
                                                │ 1:N
                                                │
                                       ┌────────┴──────────┐
                                       │   theory_levels   │
                                       ├───────────────────┤
                                       │ id (PK)           │
                                       │ level_name (UQ)   │
                                       │ scales_list       │
                                       │ repertoire        │
                                       │ technical_reqs    │
                                       │ created_at        │
                                       └───────────────────┘
                                       (Reference data)
```

## Tables

### users

Extends Supabase's `auth.users` table with application-specific user data.

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `id`: Primary key, references Supabase auth.users
- `email`: User's email address (synchronized with auth)
- `display_name`: Optional display name for the user
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update timestamp

**Constraints:**
- Primary key on `id`
- Foreign key to `auth.users(id)` with CASCADE delete
- `updated_at` automatically updated via trigger

**Indexes:**
- Primary key index on `id`

---

### practice_sessions

Stores individual practice sessions.

```sql
CREATE TABLE public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  is_for_next_lesson BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `id`: Auto-generated UUID primary key
- `user_id`: Foreign key to users table
- `date`: Practice session date (DATE type)
- `duration_minutes`: Total practice time in minutes
- `rating`: Self-rating 1-5 (nullable)
- `notes`: Free-form practice notes (nullable)
- `is_for_next_lesson`: Flag for lesson prep export
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Constraints:**
- `duration_minutes >= 0`
- `rating BETWEEN 1 AND 5` (when not NULL)
- Foreign key to `users` with CASCADE delete
- `updated_at` automatically updated via trigger

**Indexes:**
- Primary key index on `id`
- Composite index on `(user_id, date DESC)` for efficient queries

**Common Queries:**
```sql
-- Get user's recent sessions
SELECT * FROM practice_sessions
WHERE user_id = $1
ORDER BY date DESC
LIMIT 10;

-- Get sessions in date range
SELECT * FROM practice_sessions
WHERE user_id = $1
  AND date BETWEEN $2 AND $3
ORDER BY date DESC;
```

---

### practice_items

Stores individual items practiced during a session.

```sql
CREATE TABLE public.practice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_session_id UUID NOT NULL REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `id`: Auto-generated UUID primary key
- `practice_session_id`: Foreign key to practice_sessions
- `name`: Name of item (e.g., "C Major Scale", "Beethoven Sonata Op. 49 No. 2")
- `category`: Category of practice item (scale, repertoire, technical, sight-reading, theory, ear-training)
- `created_at`: Record creation timestamp

**Constraints:**
- Foreign key to `practice_sessions` with CASCADE delete
- `name` and `category` are required (NOT NULL)

**Indexes:**
- Primary key index on `id`
- Index on `practice_session_id` for joins

**Common Queries:**
```sql
-- Get items for a session
SELECT * FROM practice_items
WHERE practice_session_id = $1;

-- Get all items by category
SELECT * FROM practice_items
WHERE practice_session_id IN (
  SELECT id FROM practice_sessions WHERE user_id = $1
)
AND category = 'repertoire';
```

---

### syllabus_items

Tracks pieces, scales, and exercises in user's curriculum.

```sql
CREATE TABLE public.syllabus_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `id`: Auto-generated UUID primary key
- `user_id`: Foreign key to users table
- `title`: Title of piece/scale/exercise
- `category`: Category (scale, repertoire, technical, etc.)
- `level`: Grade level (e.g., "RCM 1", "RCM 2", "ABRSM Grade 3")
- `status`: Current status (planned, in-progress, ready-for-exam, completed)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Constraints:**
- Foreign key to `users` with CASCADE delete
- `status` defaults to 'planned'
- `updated_at` automatically updated via trigger

**Indexes:**
- Primary key index on `id`
- Composite index on `(user_id, level, status)` for progress queries

**Common Queries:**
```sql
-- Get items by level
SELECT * FROM syllabus_items
WHERE user_id = $1
  AND level = 'RCM 2'
ORDER BY status, title;

-- Calculate level progress
SELECT
  level,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'completed') as completed
FROM syllabus_items
WHERE user_id = $1
GROUP BY level;
```

---

### theory_levels

Reference data for RCM syllabus requirements.

```sql
CREATE TABLE public.theory_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_name TEXT NOT NULL UNIQUE,
  scales_list JSONB,
  repertoire JSONB,
  technical_requirements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `id`: Auto-generated UUID primary key
- `level_name`: Unique level identifier (e.g., "Prep A", "Level 1")
- `scales_list`: JSONB array of scale definitions
- `repertoire`: JSONB object with repertoire lists (A/B/C/D)
- `technical_requirements`: JSONB array of technical requirements
- `created_at`: Record creation timestamp

**Constraints:**
- `level_name` is unique
- JSONB columns allow flexible schema

**Example Data:**
```json
{
  "level_name": "Level 1",
  "scales_list": [
    {
      "name": "C Major",
      "type": "major",
      "hands": "separate",
      "octaves": 1
    }
  ],
  "repertoire": {
    "listA": [
      {
        "title": "Minuet in G",
        "composer": "Bach",
        "period": "baroque"
      }
    ]
  }
}
```

**Access:**
- Read-only for all authenticated users
- Modified only by admins (future feature)

---

### user_theory_progress

Tracks user's progress through theory topics.

```sql
CREATE TABLE public.user_theory_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  topic TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  last_review TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, level, topic)
);
```

**Columns:**
- `id`: Auto-generated UUID primary key
- `user_id`: Foreign key to users table
- `level`: Level identifier (e.g., "Level 1")
- `topic`: Topic identifier (e.g., "intervals", "scales")
- `score`: Score 0-100 (nullable)
- `last_review`: Timestamp of last review
- `created_at`: Record creation timestamp

**Constraints:**
- Unique constraint on `(user_id, level, topic)`
- Foreign key to `users` with CASCADE delete
- `score BETWEEN 0 AND 100` (when not NULL)

**Indexes:**
- Primary key index on `id`
- Unique index on `(user_id, level, topic)`
- Index on `(user_id, level)` for level-wide queries

---

## Row-Level Security (RLS)

### Security Model

All tables have RLS enabled. Users can only access their own data. Policies are enforced at the database level, making the application secure by default.

### Policy Patterns

**User Data Access:**
```sql
-- SELECT: Users can view own data
CREATE POLICY "Users can view own X"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can create own data
CREATE POLICY "Users can create own X"
  ON table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update own data
CREATE POLICY "Users can update own X"
  ON table_name FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Users can delete own data
CREATE POLICY "Users can delete own X"
  ON table_name FOR DELETE
  USING (auth.uid() = user_id);
```

**Related Data Access (practice_items):**
```sql
-- Users can only access practice items from their own sessions
CREATE POLICY "Users can view own practice items"
  ON practice_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM practice_sessions
      WHERE practice_sessions.id = practice_items.practice_session_id
      AND practice_sessions.user_id = auth.uid()
    )
  );
```

**Public Read Access (theory_levels):**
```sql
-- All authenticated users can read reference data
CREATE POLICY "Authenticated users can view theory levels"
  ON theory_levels FOR SELECT
  TO authenticated
  USING (true);
```

### RLS Testing

Test RLS policies by switching user context:
```sql
-- Set user context for testing
SELECT set_config('request.jwt.claims', '{"sub": "user-id-here"}', true);

-- Try to access data
SELECT * FROM practice_sessions; -- Should only return current user's data
```

---

## Triggers

### Automatic Timestamp Updates

The `updated_at` column is automatically updated on every UPDATE:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Applied to:
- `users`
- `practice_sessions`
- `syllabus_items`

---

## Indexes

Strategic indexes for query performance:

```sql
-- Practice sessions: user's recent sessions
CREATE INDEX idx_practice_sessions_user_date
  ON practice_sessions(user_id, date DESC);

-- Practice items: join with sessions
CREATE INDEX idx_practice_items_session
  ON practice_items(practice_session_id);

-- Syllabus items: filter by user, level, status
CREATE INDEX idx_syllabus_items_user
  ON syllabus_items(user_id, level, status);

-- Theory progress: user's progress by level
CREATE INDEX idx_user_theory_progress_user
  ON user_theory_progress(user_id, level);
```

**Index Strategy:**
- Index foreign keys for joins
- Index columns used in WHERE clauses
- Composite indexes for common filter combinations
- Descending index for date to optimize recent-first queries

---

## Migrations

### Migration Strategy

1. **Version Control**: All schema changes in migration files
2. **Sequential Naming**: `001_initial_schema.sql`, `002_add_feature.sql`
3. **Idempotent**: Use `IF NOT EXISTS` where appropriate
4. **Rollback**: Each migration should be reversible
5. **Data Safety**: Never drop columns without backup

### Applying Migrations

**Supabase Dashboard:**
1. Navigate to SQL Editor
2. Paste migration SQL
3. Run migration
4. Verify changes in Table Editor

**Supabase CLI:**
```bash
supabase migration new migration_name
# Edit migration file
supabase db push
```

---

## Performance Considerations

### Query Optimization
- Use indexes for frequently queried columns
- Avoid SELECT * in production code
- Use EXPLAIN ANALYZE to profile queries
- Limit result sets with LIMIT

### Data Growth
- Practice sessions grow ~365 rows/year per user
- Consider partitioning by date after 10K+ sessions (future)
- Archive old sessions (>2 years) to separate table (future)

### Connection Pooling
- Supabase provides connection pooling
- Use connection pooling mode for serverless

---

## Backup and Recovery

### Supabase Backups
- Automatic daily backups (Pro plan)
- Point-in-time recovery (Pro plan)
- Manual exports via Dashboard

### Local Backups
```bash
# Export schema
pg_dump -h db.xxx.supabase.co -U postgres -d postgres --schema-only > schema.sql

# Export data
pg_dump -h db.xxx.supabase.co -U postgres -d postgres --data-only > data.sql
```

---

## Future Enhancements

### Planned Schema Changes
- **Attachments**: Table for audio recordings, PDFs
- **Goals**: Table for practice goals and tracking
- **Teacher-Student**: Tables for teacher assignments
- **Sharing**: Permissions table for sharing progress

### Optimizations
- Materialized views for analytics
- Full-text search on practice notes
- Partitioning for large datasets
- Caching layer for reference data
