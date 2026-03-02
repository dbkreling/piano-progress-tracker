import { supabase } from '../supabase/client';
import type { SyllabusItem, SyllabusStatus } from '../../models/syllabus';

export interface CreateSyllabusItemInput {
  title: string;
  category: string;
  level: string;
  status?: SyllabusStatus;
}

export interface UpdateSyllabusItemInput {
  title?: string;
  category?: string;
  level?: string;
  status?: SyllabusStatus;
}

class SyllabusService {
  async getItems(): Promise<SyllabusItem[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('syllabus_items')
      .select('*')
      .eq('user_id', user.id)
      .order('level', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch syllabus items: ${error.message}`);
    }

    return data.map(this.mapItemFromDb);
  }

  async createItem(input: CreateSyllabusItemInput): Promise<SyllabusItem> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('syllabus_items')
      .insert({
        user_id: user.id,
        title: input.title,
        category: input.category,
        level: input.level,
        status: input.status || 'planned',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create syllabus item: ${error.message}`);
    }

    return this.mapItemFromDb(data);
  }

  async updateItem(id: string, input: UpdateSyllabusItemInput): Promise<SyllabusItem> {
    const { data, error } = await supabase
      .from('syllabus_items')
      .update({
        title: input.title,
        category: input.category,
        level: input.level,
        status: input.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update syllabus item: ${error.message}`);
    }

    return this.mapItemFromDb(data);
  }

  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('syllabus_items')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete syllabus item: ${error.message}`);
    }
  }

  private mapItemFromDb(dbItem: any): SyllabusItem {
    return {
      id: dbItem.id,
      userId: dbItem.user_id,
      title: dbItem.title,
      category: dbItem.category,
      level: dbItem.level,
      status: dbItem.status,
      createdAt: dbItem.created_at,
      updatedAt: dbItem.updated_at,
    };
  }
}

export const syllabusService = new SyllabusService();
