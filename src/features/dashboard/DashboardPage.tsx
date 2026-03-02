import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { usePracticeSessions } from '../practice-log/hooks/usePracticeSessions';
import { usePracticeStats } from '../practice-log/hooks/usePracticeStats';
import { useSyllabusItems } from '../syllabus/hooks/useSyllabusItems';
import { useSyllabusProgress } from '../syllabus/hooks/useSyllabusProgress';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load practice data
  const { sessions, loading: practiceLoading } = usePracticeSessions();
  const practiceStats = usePracticeStats(sessions);

  // Load syllabus data
  const { items: syllabusItems, loading: syllabusLoading } = useSyllabusItems();
  const syllabusProgress = useSyllabusProgress(syllabusItems);

  const loading = practiceLoading || syllabusLoading;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back! 🎹
          </h1>
          <p className="mt-2 text-gray-600">
            Track your practice, monitor your progress, and achieve your musical goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Practice Streak */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Practice Streak
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                {loading ? '-' : practiceStats.streak} {practiceStats.streak === 1 ? 'day' : 'days'}
              </dd>
              <p className="mt-2 text-sm text-gray-600">
                {loading ? 'Loading...' : practiceStats.streak > 0 ? 'Keep it up!' : 'Start logging practice to build your streak!'}
              </p>
            </div>
          </div>

          {/* This Week Practice Time */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                This Week
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {loading ? '-' : formatTime(practiceStats.thisWeekMinutes)}
              </dd>
              <p className="mt-2 text-sm text-gray-600">
                Total practice time (last 7 days)
              </p>
            </div>
          </div>

          {/* Syllabus Progress */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Syllabus Progress
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {loading ? '-' : `${syllabusProgress.overallPercentage}%`}
              </dd>
              <p className="mt-2 text-sm text-gray-600">
                {loading ? 'Loading...' : syllabusProgress.totalItems > 0
                  ? `${syllabusProgress.completedItems} of ${syllabusProgress.totalItems} items completed`
                  : 'Add items to your syllabus to track progress'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => navigate('/practice')}
              className="relative block w-full border-2 border-indigo-300 border-dashed rounded-lg p-12 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg
                className="mx-auto h-12 w-12 text-indigo-400"
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
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Log Practice Session
              </span>
              <span className="mt-1 block text-sm text-indigo-600">
                Track today's practice
              </span>
            </button>

            <button
              onClick={() => navigate('/syllabus')}
              className="relative block w-full border-2 border-indigo-300 border-dashed rounded-lg p-12 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg
                className="mx-auto h-12 w-12 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Add Syllabus Item
              </span>
              <span className="mt-1 block text-sm text-indigo-600">
                Track pieces and scales
              </span>
            </button>
          </div>
        </div>

        {/* Getting Started */}
        {!loading && sessions.length === 0 && syllabusItems.length === 0 && (
          <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">
                  Get Started with Piano Progress Tracker
                </h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <p>
                    Start tracking your piano journey! Log your first practice session or add pieces to your syllabus.
                  </p>
                  <p className="mt-2">
                    Use the quick action buttons above or navigate through the menu to explore all features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
