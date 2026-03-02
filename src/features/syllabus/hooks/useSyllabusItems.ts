import { useState, useEffect } from 'react';
import { syllabusService } from '../../../services/api/syllabus.service';
import type { SyllabusItem } from '../../../models/syllabus';
import type { CreateSyllabusItemInput, UpdateSyllabusItemInput } from '../../../services/api/syllabus.service';

/**
 * Hook for managing syllabus items data
 */
export function useSyllabusItems() {
  const [items, setItems] = useState<SyllabusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await syllabusService.getItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load syllabus items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (input: CreateSyllabusItemInput) => {
    try {
      const newItem = await syllabusService.createItem(input);
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create item');
    }
  };

  const updateItem = async (id: string, input: UpdateSyllabusItemInput) => {
    try {
      const updated = await syllabusService.updateItem(id, input);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await syllabusService.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: loadItems,
  };
}
