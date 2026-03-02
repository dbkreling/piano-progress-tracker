import type { Resource } from '../resourcesData';

interface ResourceCardProps {
  resource: Resource;
}

const TYPE_ICONS = {
  video: '🎥',
  'sheet-music': '🎵',
  interactive: '🎮',
  website: '🌐',
  article: '📄',
};

const LEVEL_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  all: 'bg-blue-100 text-blue-800',
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <span className="text-3xl flex-shrink-0">{TYPE_ICONS[resource.type]}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {resource.title}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                  LEVEL_COLORS[resource.level]
                }`}
              >
                {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
              </span>
            </div>
          </div>
          <svg
            className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-500">
                +{resource.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
