import { useState } from 'react';
import { useSyllabusItems } from './hooks/useSyllabusItems';
import { useSyllabusProgress } from './hooks/useSyllabusProgress';
import { SyllabusItemForm } from './components/SyllabusItemForm';
import { SyllabusItemsList } from './components/SyllabusItemsList';
import { SyllabusProgressOverview } from './components/SyllabusProgressOverview';
import type { SyllabusItem, SyllabusStatus } from '../../models/syllabus';

export function SyllabusPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SyllabusItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const {
    items,
    loading,
    error: loadError,
    createItem,
    updateItem,
    deleteItem,
  } = useSyllabusItems();

  const progress = useSyllabusProgress(items);

  const handleSubmit = async (data: {
    title: string;
    category: string;
    level: string;
    status: SyllabusStatus;
  }) => {
    try {
      setError(null);

      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await createItem(data);
      }

      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
      throw err;
    }
  };

  const handleEdit = (item: SyllabusItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setError(null);
      await deleteItem(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleStatusChange = async (id: string, status: SyllabusStatus) => {
    try {
      setError(null);
      await updateItem(id, { status });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setError(null);
  };

  // Filter items by selected level
  const filteredItems = filterLevel === 'all'
    ? items
    : items.filter((item) => item.level === filterLevel);

  // Get unique levels for filter dropdown
  const levels = ['all', ...Array.from(new Set(items.map((item) => item.level)))];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading syllabus...</p>
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
            Syllabus Tracker
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your repertoire, scales, and technical requirements
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
              Add Item
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

      {/* Progress Overview */}
      {!showForm && items.length > 0 && (
        <div className="mb-8">
          <SyllabusProgressOverview {...progress} />
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              {editingItem ? 'Edit Syllabus Item' : 'Add New Syllabus Item'}
            </h3>
            <SyllabusItemForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={
                editingItem
                  ? {
                      title: editingItem.title,
                      category: editingItem.category,
                      level: editingItem.level,
                      status: editingItem.status,
                    }
                  : undefined
              }
              isEditing={!!editingItem}
            />
          </div>
        </div>
      )}

      {/* Filter and List */}
      {!showForm && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Items
              {items.length > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  ({filteredItems.length} {filterLevel !== 'all' && `of ${items.length}`})
                </span>
              )}
            </h2>
            {items.length > 0 && (
              <div className="flex items-center space-x-2">
                <label htmlFor="level-filter" className="text-sm text-gray-700">
                  Filter by level:
                </label>
                <select
                  id="level-filter"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <SyllabusItemsList
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
}
