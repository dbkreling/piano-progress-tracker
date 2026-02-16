import { supabase } from '../supabase/client';
import type { User } from '../../models/user';

/**
 * Authentication service handling user signup, login, logout, and session management.
 */
export class AuthService {
  /**
   * Sign up a new user with email and password.
   */
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('Sign up failed: No user returned');
    }

    // Create user profile in public.users table
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email!,
      display_name: displayName,
    });

    if (profileError) {
      // If profile creation fails, we still have the auth user
      console.error('Failed to create user profile:', profileError);
    }

    return this.mapUserFromAuth(data.user, displayName);
  }

  /**
   * Sign in an existing user with email and password.
   */
  async signIn(email: string, password: string): Promise<User> {
    console.log('🔐 AUTH: Starting sign in...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('🔐 AUTH: signInWithPassword completed', { data, error });

    if (error) {
      console.error('❌ AUTH: Sign in error:', error);
      throw new Error(`Sign in failed: ${error.message}`);
    }

    if (!data.user) {
      console.error('❌ AUTH: No user returned');
      throw new Error('Sign in failed: No user returned');
    }

    console.log('✅ AUTH: Sign in successful, mapping user...');
    const result = this.mapUserFromAuth(data.user, null);
    console.log('✅ AUTH: Sign in complete', result);
    return result;
  }

  /**
   * Sign out the current user.
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
  }

  /**
   * Get the current authenticated user.
   */
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Failed to get current user:', error);
      return null;
    }

    if (!user) {
      return null;
    }

    // TEMP: Skip profile fetch to fix loading issue
    // const profile = await this.getUserProfile(user.id);
    // return this.mapUserFromAuth(user, profile?.display_name);

    return this.mapUserFromAuth(user, null);
  }

  /**
   * Get the current session.
   */
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Listen for auth state changes.
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 AUTH: State change event:', event);
      if (session?.user) {
        // TEMP: Skip profile fetch to fix loading issue
        // const profile = await this.getUserProfile(session.user.id);
        // callback(this.mapUserFromAuth(session.user, profile?.display_name));
        callback(this.mapUserFromAuth(session.user, null));
      } else {
        callback(null);
      }
    });
  }

  /**
   * Update user profile (display name).
   */
  async updateProfile(userId: string, displayName: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ display_name: displayName })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  /**
   * Send password reset email to user.
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  /**
   * Update user's password (must be called after clicking reset link).
   */
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(`Failed to update password: ${error.message}`);
    }
  }

  /**
   * Get user profile from public.users table.
   */
  private async getUserProfile(
    userId: string
  ): Promise<{ display_name: string | null } | null> {
    const { data, error } = await supabase
      .from('users')
      .select('display_name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Map Supabase auth user to our User model.
   */
  private mapUserFromAuth(
    authUser: { id: string; email?: string; created_at: string },
    displayName?: string | null
  ): User {
    return {
      id: authUser.id,
      email: authUser.email || '',
      displayName: displayName || undefined,
      createdAt: authUser.created_at,
      updatedAt: authUser.created_at,
    };
  }
}

export const authService = new AuthService();
