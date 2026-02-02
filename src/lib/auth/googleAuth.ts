import type { User } from '@/types';

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Sign in with Google OAuth 2.0 using Chrome Identity API
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken(
      {
        interactive: true,
        scopes: ['openid', 'email', 'profile'],
      },
      async (token) => {
        if (chrome.runtime.lastError) {
          resolve({
            success: false,
            error: chrome.runtime.lastError.message || 'Authentication failed',
          });
          return;
        }

        if (!token) {
          resolve({
            success: false,
            error: 'No token received',
          });
          return;
        }

        try {
          // Fetch user profile using the token
          const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }

          const profile = await response.json();

          const user: User = {
            id: profile.id,
            email: profile.email,
            displayName: profile.name || profile.email,
            photoURL: profile.picture || '',
          };

          // Store token and user info
          await chrome.storage.local.set({
            authToken: token,
            user,
            isAuthenticated: true,
          });

          resolve({ success: true, user });
        } catch (error) {
          console.error('[Auth] Error:', error);
          resolve({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    );
  });
}

/**
 * Sign out user
 */
export async function signOut(): Promise<void> {
  // Remove token from Chrome
  chrome.identity.clearAllCachedAuthTokens(() => {
    // Remove user data from storage
    chrome.storage.local.remove([
      'authToken',
      'user',
      'isAuthenticated',
    ]);
  });
}

/**
 * Get current user from storage
 */
export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['user', 'isAuthenticated'], (result) => {
      if (result.isAuthenticated && result.user) {
        resolve(result.user);
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Refresh authentication token if needed
 */
export async function refreshToken(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken(
      {
        interactive: false,
      },
      async (token) => {
        if (chrome.runtime.lastError || !token) {
          resolve(false);
          return;
        }

        // Update stored token
        await chrome.storage.local.set({ authToken: token });
        resolve(true);
      }
    );
  });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['isAuthenticated', 'authToken'], (result) => {
      resolve(!!result.isAuthenticated && !!result.authToken);
    });
  });
}

