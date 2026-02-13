import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../src/features/auth/AuthContext';
import type { User } from '../../../src/models/user';

/**
 * Auth Context Tests
 *
 * These tests demonstrate:
 * - Testing React Context
 * - Testing custom hooks
 * - Testing async state updates
 * - Mocking service layer
 */

// Create mocks using vi.hoisted to avoid hoisting issues
const { mockGetCurrentUser, mockOnAuthStateChange, mockSignUp, mockSignIn, mockSignOut, mockUpdateProfile } = vi.hoisted(() => {
  return {
    mockGetCurrentUser: vi.fn(),
    mockOnAuthStateChange: vi.fn(),
    mockSignUp: vi.fn(),
    mockSignIn: vi.fn(),
    mockSignOut: vi.fn(),
    mockUpdateProfile: vi.fn(),
  };
});

vi.mock('../../../src/services/api/auth.service', () => ({
  authService: {
    getCurrentUser: mockGetCurrentUser,
    onAuthStateChange: mockOnAuthStateChange,
    signUp: mockSignUp,
    signIn: mockSignIn,
    signOut: mockSignOut,
    updateProfile: mockUpdateProfile,
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('should load current user on mount', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      };

      mockGetCurrentUser.mockResolvedValue(mockUser);
      mockOnAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();

      // Wait for user to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockGetCurrentUser).toHaveBeenCalledOnce();
    });

    it('should set loading to false when no user is logged in', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockOnAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('should listen for auth state changes', async () => {
      mockGetCurrentUser.mockResolvedValue(null);

      let authCallback: ((user: User | null) => void) | undefined;
      mockOnAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Simulate auth state change (user logs in)
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      };

      if (authCallback) {
        authCallback(mockUser);
      }

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });
    });

    it('should unsubscribe from auth changes on unmount', async () => {
      const mockUnsubscribe = vi.fn();
      mockGetCurrentUser.mockResolvedValue(null);
      mockOnAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      });

      const { unmount } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalled();
      });

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should provide auth state and methods', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockOnAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that all methods are available
      expect(typeof result.current.signUp).toBe('function');
      expect(typeof result.current.signIn).toBe('function');
      expect(typeof result.current.signOut).toBe('function');
      expect(typeof result.current.updateProfile).toBe('function');
    });
  });

  describe('Auth actions', () => {
    beforeEach(async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockOnAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });
    });

    it('should call signUp and update user state', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      };

      mockSignUp.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.signUp('test@example.com', 'password123', 'Test User');

      expect(mockSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'Test User'
      );

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });
    });

    it('should call signIn and update user state', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      };

      mockSignIn.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.signIn('test@example.com', 'password123');

      expect(mockSignIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });
    });

    it('should call signOut and clear user state', async () => {
      // Start with a logged-in user
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      };

      mockGetCurrentUser.mockResolvedValue(mockUser);
      mockSignOut.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await result.current.signOut();

      expect(mockSignOut).toHaveBeenCalled();

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });

    it('should update profile and update user state', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      };

      mockGetCurrentUser.mockResolvedValue(mockUser);
      mockUpdateProfile.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await result.current.updateProfile('Updated Name');

      expect(mockUpdateProfile).toHaveBeenCalledWith(
        'user-123',
        'Updated Name'
      );

      await waitFor(() => {
        expect(result.current.user?.displayName).toBe('Updated Name');
      });
    });

    it('should throw error when updating profile without user', async () => {
      mockGetCurrentUser.mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.updateProfile('New Name')).rejects.toThrow(
        'No user logged in'
      );
    });
  });
});
