import { supabase } from '../supabase/client';
import type {
  PracticeSession,
  CreatePracticeSessionInput,
  UpdatePracticeSessionInput,
} from '../../models/practice';

/**
 * Service for managing practice sessions.
 * Handles all CRUD operations for practice sessions and items.
 */
export class PracticeService {
  /**
   * Creates a new practice session with associated practice items.
   */
  async createSession(input: CreatePracticeSessionInput): Promise<PracticeSession> {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Insert practice session
    const { data: session, error: sessionError } = await supabase
      .from('practice_sessions')
      .insert({
        date: input.date,
        duration_minutes: input.durationMinutes,
        rating: input.rating,
        notes: input.notes,
        is_for_next_lesson: input.isForNextLesson ?? false,
        user_id: user.id,
      })
      .select()
      .single();

    if (sessionError) {
      throw new Error(`Failed to create practice session: ${sessionError.message}`);
    }

    // Insert practice items
    if (input.items.length > 0) {
      const { error: itemsError } = await supabase
        .from('practice_items')
        .insert(
          input.items.map(item => ({
            practice_session_id: session.id,
            name: item.name,
            category: item.category,
          }))
        );

      if (itemsError) {
        throw new Error(`Failed to create practice items: ${itemsError.message}`);
      }
    }

    // Fetch the complete session with items
    return this.getSessionById(session.id);
  }

  /**
   * Retrieves all practice sessions for the current user.
   */
  async getSessions(): Promise<PracticeSession[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('practice_sessions')
      .select(
        `
        *,
        practice_items (*)
      `
      )
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch practice sessions: ${error.message}`);
    }

    return data.map(this.mapSessionFromDb);
  }

  /**
   * Retrieves a single practice session by ID.
   */
  async getSessionById(id: string): Promise<PracticeSession> {
    const { data, error } = await supabase
      .from('practice_sessions')
      .select(
        `
        *,
        practice_items (*)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch practice session: ${error.message}`);
    }

    return this.mapSessionFromDb(data);
  }

  /**
   * Updates an existing practice session.
   */
  async updateSession(
    id: string,
    input: UpdatePracticeSessionInput
  ): Promise<PracticeSession> {
    const updateData: Record<string, unknown> = {};

    if (input.date !== undefined) updateData.date = input.date;
    if (input.durationMinutes !== undefined)
      updateData.duration_minutes = input.durationMinutes;
    if (input.rating !== undefined) updateData.rating = input.rating;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.isForNextLesson !== undefined)
      updateData.is_for_next_lesson = input.isForNextLesson;

    const { error } = await supabase
      .from('practice_sessions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update practice session: ${error.message}`);
    }

    return this.getSessionById(id);
  }

  /**
   * Deletes a practice session and all associated items.
   */
  async deleteSession(id: string): Promise<void> {
    const { error } = await supabase
      .from('practice_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete practice session: ${error.message}`);
    }
  }

  /**
   * Retrieves practice sessions within a date range.
   */
  async getSessionsByDateRange(startDate: string, endDate: string): Promise<PracticeSession[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('practice_sessions')
      .select(
        `
        *,
        practice_items (*)
      `
      )
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch practice sessions: ${error.message}`);
    }

    return data.map(this.mapSessionFromDb);
  }

  /**
   * Maps a database session record to a domain model.
   */
  private mapSessionFromDb(dbSession: {
    id: string;
    user_id: string;
    date: string;
    duration_minutes: number;
    rating: number | null;
    notes: string | null;
    is_for_next_lesson: boolean;
    created_at: string;
    updated_at: string;
    practice_items?: Array<{
      id: string;
      practice_session_id: string;
      name: string;
      category: string;
      created_at: string;
    }>;
  }): PracticeSession {
    return {
      id: dbSession.id,
      userId: dbSession.user_id,
      date: dbSession.date,
      durationMinutes: dbSession.duration_minutes,
      rating: dbSession.rating ?? 0,
      notes: dbSession.notes ?? '',
      isForNextLesson: dbSession.is_for_next_lesson,
      items:
        dbSession.practice_items?.map(item => ({
          id: item.id,
          practiceSessionId: item.practice_session_id,
          name: item.name,
          category: item.category as never,
          createdAt: item.created_at,
        })) ?? [],
      createdAt: dbSession.created_at,
      updatedAt: dbSession.updated_at,
    };
  }
}

export const practiceService = new PracticeService();
