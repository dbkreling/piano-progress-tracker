interface PracticeStatsProps {
  streak: number;
  thisWeekMinutes: number;
  totalMinutes: number;
  averageRating: number;
  totalSessions: number;
}

export function PracticeStats({
  streak,
  thisWeekMinutes,
  totalMinutes,
  averageRating,
  totalSessions,
}: PracticeStatsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {/* Streak */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Current Streak
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-indigo-600">
            {streak} {streak === 1 ? 'day' : 'days'}
          </dd>
          <p className="mt-2 text-xs text-gray-500">
            {streak > 0 ? 'Keep it up!' : 'Start practicing to begin a streak!'}
          </p>
        </div>
      </div>

      {/* This Week */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            This Week
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {formatTime(thisWeekMinutes)}
          </dd>
          <p className="mt-2 text-xs text-gray-500">Last 7 days</p>
        </div>
      </div>

      {/* Total Time */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Total Practice
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {formatTime(totalMinutes)}
          </dd>
          <p className="mt-2 text-xs text-gray-500">All time</p>
        </div>
      </div>

      {/* Average Rating */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Avg Rating
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {averageRating.toFixed(1)}/5
          </dd>
          <div className="mt-2 flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-4 w-4 ${
                  star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Total Sessions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Sessions
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {totalSessions}
          </dd>
          <p className="mt-2 text-xs text-gray-500">
            {totalSessions === 0
              ? 'Log your first session!'
              : totalSessions === 1
              ? 'Great start!'
              : 'Keep going!'}
          </p>
        </div>
      </div>
    </div>
  );
}
