import type { SyllabusProgress } from '../../../models/syllabus';

interface SyllabusProgressOverviewProps {
  progressByLevel: SyllabusProgress[];
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  readyForExamItems: number;
  overallPercentage: number;
}

export function SyllabusProgressOverview({
  progressByLevel,
  totalItems,
  completedItems,
  inProgressItems,
  readyForExamItems,
  overallPercentage,
}: SyllabusProgressOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Items
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {totalItems}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              In Progress
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">
              {inProgressItems}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Ready for Exam
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">
              {readyForExamItems}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Completed
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">
              {completedItems}
            </dd>
          </div>
        </div>
      </div>

      {/* Progress by Level */}
      {progressByLevel.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Progress by Level
            </h3>
            <div className="space-y-4">
              {progressByLevel.map((progress) => (
                <div key={progress.level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {progress.level}
                    </span>
                    <span className="text-sm text-gray-500">
                      {progress.completed} / {progress.total} ({progress.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
