import { useState, useEffect } from 'react';
import { practiceService } from '../../../services/api/practice.service';
import type { PracticeSession, CreatePracticeSessionInput } from '../../../models/practice';

/**
 * Hook for managing practice sessions data
 */
export function usePracticeSessions() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await practiceService.getSessions();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (input: CreatePracticeSessionInput) => {
    try {
      const newSession = await practiceService.createSession(input);
      setSessions((prev) => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create session');
    }
  };

  const updateSession = async (id: string, input: Partial<CreatePracticeSessionInput>) => {
    try {
      const updated = await practiceService.updateSession(id, input);
      setSessions((prev) =>
        prev.map((session) => (session.id === id ? updated : session))
      );
      return updated;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update session');
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await practiceService.deleteSession(id);
      setSessions((prev) => prev.filter((session) => session.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    createSession,
    updateSession,
    deleteSession,
    refreshSessions: loadSessions,
  };
}
