const TOKEN_KEY = 'access_token';

export const authStorage = {
  /** Retrieve the stored access token, or `null` if absent. */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /** Persist an access token. */
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      console.error('Failed to save auth token');
    }
  },

  /** Remove the stored access token. */
  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      console.error('Failed to remove auth token');
    }
  },
};
