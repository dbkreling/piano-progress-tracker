import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../../src/services/api/auth.service';

/**
 * Auth Service Tests
 *
 * These tests demonstrate:
 * - Mocking external dependencies (Supabase)
 * - Testing async functions
 * - Testing error handling
 * - Testing different scenarios (success, failure, edge cases)
 */

// Mock the Supabase client
vi.mock('../../../src/services/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Import the mocked supabase client
import { supabase } from '../../../src/services/supabase/client';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Create a fresh instance
    authService = new AuthService();
  });

  describe('signUp', () => {
    it('should create user with email and password', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-15T12:00:00Z',
      };

      // Mock Supabase auth.signUp
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      // Mock database insert for user profile
      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const result = await authService.signUp('test@example.com', 'password123');

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        displayName: undefined,
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      });
    });

    it('should create user with display name', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-15T12:00:00Z',
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const result = await authService.signUp(
        'test@example.com',
        'password123',
        'John Doe'
      );

      expect(mockFrom).toHaveBeenCalledWith('users');
      expect(mockInsert).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'test@example.com',
        display_name: 'John Doe',
      });

      expect(result.displayName).toBe('John Doe');
    });

    it('should throw error when Supabase signUp fails', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid email format', name: 'AuthError', status: 400 },
      });

      await expect(
        authService.signUp('invalid-email', 'password')
      ).rejects.toThrow('Sign up failed: Invalid email format');
    });

    it('should throw error when no user is returned', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      await expect(
        authService.signUp('test@example.com', 'password123')
      ).rejects.toThrow('Sign up failed: No user returned');
    });

    it('should continue even if profile creation fails', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-15T12:00:00Z',
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      // Mock profile creation failure
      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: '500' },
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      // Should still return user even if profile creation fails
      const result = await authService.signUp('test@example.com', 'password123');

      expect(result.id).toBe('user-123');
    });
  });

  describe('signIn', () => {
    it('should sign in user with correct credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-15T12:00:00Z',
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } as never },
        error: null,
      });

      // Mock profile fetch
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { display_name: 'John Doe' },
              error: null,
            }),
          }),
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const result = await authService.signIn('test@example.com', 'password123');

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'John Doe',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      });
    });

    it('should throw error for invalid credentials', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials', name: 'AuthError', status: 400 },
      });

      await expect(
        authService.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Sign in failed: Invalid login credentials');
    });

    it('should handle user without profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-15T12:00:00Z',
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } as never },
        error: null,
      });

      // Profile fetch fails
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found', code: '404' },
            }),
          }),
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const result = await authService.signIn('test@example.com', 'password123');

      expect(result.displayName).toBeUndefined();
    });
  });

  describe('signOut', () => {
    it('should sign out current user', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should throw error when sign out fails', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: { message: 'Network error', name: 'AuthError', status: 500 },
      });

      await expect(authService.signOut()).rejects.toThrow(
        'Sign out failed: Network error'
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user with profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-15T12:00:00Z',
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { display_name: 'John Doe' },
              error: null,
            }),
          }),
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const result = await authService.getCurrentUser();

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'John Doe',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      });
    });

    it('should return null when no user is logged in', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null when getUser fails', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: { message: 'Token expired', name: 'AuthError', status: 401 },
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should return current session', async () => {
      const mockSession = {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession as never },
        error: null,
      });

      const result = await authService.getSession();

      expect(result).toEqual(mockSession);
    });

    it('should return null when no session exists', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await authService.getSession();

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user display name', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      await authService.updateProfile('user-123', 'Jane Doe');

      expect(mockFrom).toHaveBeenCalledWith('users');
    });

    it('should throw error when update fails', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Permission denied', code: '403' },
          }),
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      await expect(
        authService.updateProfile('user-123', 'Jane Doe')
      ).rejects.toThrow('Failed to update profile: Permission denied');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:5173' },
        writable: true,
      });

      await authService.sendPasswordResetEmail('test@example.com');

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: 'http://localhost:5173/reset-password' }
      );
    });

    it('should throw error when email send fails', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: null,
        error: { message: 'Email not found', name: 'AuthError', status: 404 },
      });

      await expect(
        authService.sendPasswordResetEmail('nonexistent@example.com')
      ).rejects.toThrow('Failed to send password reset email: Email not found');
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: { id: 'user-123' } as never },
        error: null,
      });

      await authService.updatePassword('newpassword123');

      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123',
      });
    });

    it('should throw error when password update fails', async () => {
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid session', name: 'AuthError', status: 401 },
      });

      await expect(
        authService.updatePassword('newpassword123')
      ).rejects.toThrow('Failed to update password: Invalid session');
    });
  });

  describe('onAuthStateChange', () => {
    it('should set up auth state change listener', () => {
      const callback = vi.fn();
      const mockUnsubscribe = vi.fn();

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      } as never);

      authService.onAuthStateChange(callback);

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });
  });
});
