import { useState } from 'react';
import { usePracticeSessions } from './hooks/usePracticeSessions';
import { usePracticeStats } from './hooks/usePracticeStats';
import { PracticeSessionForm } from './components/PracticeSessionForm';
import { PracticeSessionsList } from './components/PracticeSessionsList';
import { PracticeStats } from './components/PracticeStats';
import type { PracticeSession } from '../../models/practice';

export function PracticeLogPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<PracticeSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    sessions,
    loading,
    error: loadError,
    createSession,
    updateSession,
    deleteSession,
  } = usePracticeSessions();

  const stats = usePracticeStats(sessions);

  const handleSubmit = async (data: {
    date: string;
    durationMinutes: number;
    rating: number;
    notes: string;
    isForNextLesson: boolean;
    items: Array<{ name: string; category: string }>;
  }) => {
    try {
      setError(null);

      if (editingSession) {
        // Update existing session
        await updateSession(editingSession.id, data);
      } else {
        // Create new session
        await createSession(data);
      }

      setShowForm(false);
      setEditingSession(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save session');
      throw err; // Re-throw so form can handle it
    }
  };

  const handleEdit = (session: PracticeSession) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this practice session?')) {
      return;
    }

    try {
      setError(null);
      await deleteSession(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSession(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading practice sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Practice Log
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your practice sessions and monitor your progress
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Log Practice
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {(error || loadError) && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error || loadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {!showForm && sessions.length > 0 && (
        <div className="mb-8">
          <PracticeStats {...stats} />
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              {editingSession ? 'Edit Practice Session' : 'Log New Practice Session'}
            </h3>
            <PracticeSessionForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={
                editingSession
                  ? {
                      date: editingSession.date,
                      durationMinutes: editingSession.durationMinutes,
                      rating: editingSession.rating,
                      notes: editingSession.notes,
                      isForNextLesson: editingSession.isForNextLesson,
                      items: editingSession.items.map((item) => ({
                        name: item.name,
                        category: item.category,
                      })),
                    }
                  : undefined
              }
              isEditing={!!editingSession}
            />
          </div>
        </div>
      )}

      {/* Sessions List */}
      {!showForm && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Sessions
            {sessions.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({sessions.length} total)
              </span>
            )}
          </h2>
          <PracticeSessionsList
            sessions={sessions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
