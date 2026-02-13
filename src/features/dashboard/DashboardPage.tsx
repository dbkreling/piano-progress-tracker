import { useAuth } from '../auth/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.displayName || 'Pianist'}! 🎹
          </h1>
          <p className="mt-2 text-gray-600">
            Track your practice, monitor your progress, and achieve your musical goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Stats Placeholder */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Practice Streak
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">0 days</dd>
              <p className="mt-2 text-sm text-gray-600">
                Start logging practice to build your streak!
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Practice Time
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">0 min</dd>
              <p className="mt-2 text-sm text-gray-600">
                This week's practice time
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Syllabus Progress
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">0%</dd>
              <p className="mt-2 text-sm text-gray-600">
                Add items to your syllabus to track progress
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <span className="mt-1 block text-sm text-gray-500">
                Coming soon - Track today's practice
              </span>
            </button>

            <button className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <span className="mt-1 block text-sm text-gray-500">
                Coming soon - Track pieces and scales
              </span>
            </button>
          </div>
        </div>

        {/* Welcome Message */}
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
                Welcome to Piano Progress Tracker!
              </h3>
              <div className="mt-2 text-sm text-indigo-700">
                <p>
                  Your authentication is working! The practice log, syllabus tracker, and
                  analytics features are coming next.
                </p>
                <p className="mt-2">
                  Check out the navigation menu above to explore different sections (coming soon).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
