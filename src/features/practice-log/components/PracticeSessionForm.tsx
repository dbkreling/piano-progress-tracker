import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PracticeCategory } from '../../../models/practice';

const practiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category: z.enum(['scale', 'repertoire', 'technical', 'sight-reading', 'theory', 'ear-training']),
});

const sessionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  durationMinutes: z.number().min(1, 'Duration must be at least 1 minute').max(600, 'Duration cannot exceed 600 minutes'),
  rating: z.number().min(1, 'Rating must be between 1-5').max(5, 'Rating must be between 1-5'),
  notes: z.string(),
  isForNextLesson: z.boolean(),
  items: z.array(practiceItemSchema).min(1, 'Add at least one practice item'),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface PracticeSessionFormProps {
  onSubmit: (data: SessionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<SessionFormData>;
  isEditing?: boolean;
}

const CATEGORIES: { value: PracticeCategory; label: string }[] = [
  { value: 'scale', label: 'Scale' },
  { value: 'repertoire', label: 'Repertoire' },
  { value: 'technical', label: 'Technical' },
  { value: 'sight-reading', label: 'Sight Reading' },
  { value: 'theory', label: 'Theory' },
  { value: 'ear-training', label: 'Ear Training' },
];

export function PracticeSessionForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: PracticeSessionFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      date: initialData?.date || new Date().toISOString().split('T')[0],
      durationMinutes: initialData?.durationMinutes || 30,
      rating: initialData?.rating || 3,
      notes: initialData?.notes || '',
      isForNextLesson: initialData?.isForNextLesson || false,
      items: initialData?.items || [{ name: '', category: 'scale' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleFormSubmit = async (data: SessionFormData) => {
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
        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            {...register('date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            {...register('durationMinutes', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.durationMinutes && (
            <p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>
          )}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Self-Rating (1-5)
        </label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <div className="mt-2 flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={field.value === value}
                    onChange={() => field.onChange(value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-1 text-sm text-gray-700">{value}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* Practice Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            What did you practice?
          </label>
          <button
            type="button"
            onClick={() => append({ name: '', category: 'scale' })}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g., C Major Scale"
                  {...register(`items.${index}.name`)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.items?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index]?.name?.message}
                  </p>
                )}
              </div>

              <select
                {...register(`items.${index}.category`)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.items && typeof errors.items.message === 'string' && (
          <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register('notes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="How did the practice go? Any challenges or breakthroughs?"
        />
      </div>

      {/* For Next Lesson */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isForNextLesson"
          {...register('isForNextLesson')}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isForNextLesson" className="ml-2 block text-sm text-gray-700">
          Mark for next lesson
        </label>
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
          {submitting ? 'Saving...' : isEditing ? 'Update Session' : 'Log Practice'}
        </button>
      </div>
    </form>
  );
}
