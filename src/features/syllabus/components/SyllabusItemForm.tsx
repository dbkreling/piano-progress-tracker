import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SyllabusStatus } from '../../../models/syllabus';

const syllabusItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  status: z.enum(['planned', 'in-progress', 'ready-for-exam', 'completed']),
});

type SyllabusItemFormData = z.infer<typeof syllabusItemSchema>;

interface SyllabusItemFormProps {
  onSubmit: (data: SyllabusItemFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<SyllabusItemFormData>;
  isEditing?: boolean;
}

const LEVELS = [
  'Prep A',
  'Prep B',
  'Level 1',
  'Level 2',
  'Level 3',
  'Level 4',
  'Level 5',
  'Level 6',
  'Level 7',
  'Level 8',
  'Level 9',
  'Level 10',
];

const CATEGORIES = [
  'Etude',
  'Repertoire - Baroque',
  'Repertoire - Classical',
  'Repertoire - Romantic',
  'Repertoire - Contemporary',
  'Scale',
  'Chord',
  'Arpeggio',
  'Sight Reading',
  'Ear Training',
  'Theory',
];

const STATUSES: { value: SyllabusStatus; label: string; color: string }[] = [
  { value: 'planned', label: 'Planned', color: 'bg-gray-100 text-gray-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'ready-for-exam', label: 'Ready for Exam', color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: 'Completed', color: 'bg-indigo-100 text-indigo-800' },
];

export function SyllabusItemForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: SyllabusItemFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SyllabusItemFormData>({
    resolver: zodResolver(syllabusItemSchema),
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || 'Repertoire - Classical',
      level: initialData?.level || 'Level 1',
      status: initialData?.status || 'planned',
    },
  });

  const handleFormSubmit = async (data: SyllabusItemFormData) => {
    try {
      setSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="e.g., Minuet in G (Bach)"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Level */}
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">
            RCM Level
          </label>
          <select
            id="level"
            {...register('level')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATUSES.map((status) => (
              <label
                key={status.value}
                className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 hover:border-gray-400"
              >
                <input
                  type="radio"
                  value={status.value}
                  {...register('status')}
                  className="sr-only"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {status.label}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}
