import type { SyllabusItem, SyllabusStatus } from '../../../models/syllabus';

interface SyllabusItemsListProps {
  items: SyllabusItem[];
  onEdit: (item: SyllabusItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SyllabusStatus) => void;
}

const STATUS_CONFIG: Record<SyllabusStatus, { label: string; color: string }> = {
  'planned': { label: 'Planned', color: 'bg-gray-100 text-gray-800' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  'ready-for-exam': { label: 'Ready for Exam', color: 'bg-green-100 text-green-800' },
  'completed': { label: 'Completed', color: 'bg-indigo-100 text-indigo-800' },
};

export function SyllabusItemsList({
  items,
  onEdit,
  onDelete,
  onStatusChange,
}: SyllabusItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">No syllabus items</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a piece or scale you're working on.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_CONFIG[item.status].color
                      }`}
                    >
                      {STATUS_CONFIG[item.status].label}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      {item.category}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {item.level}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                  {/* Quick status change buttons */}
                  {item.status !== 'completed' && (
                    <button
                      onClick={() => {
                        const nextStatus: Record<SyllabusStatus, SyllabusStatus> = {
                          'planned': 'in-progress',
                          'in-progress': 'ready-for-exam',
                          'ready-for-exam': 'completed',
                          'completed': 'completed',
                        };
                        onStatusChange(item.id, nextStatus[item.status]);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                      title="Advance status"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
