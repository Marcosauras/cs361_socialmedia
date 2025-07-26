import decode from 'jwt-decode';
const TOKEN_KEY = 'id_token';

class AuthService {
  // Decode the stored token to get the user profile data
  getProfile() {
    const token = this.getToken();
    return token ? decode(token) : null;
  }

  // Check if there’s a valid, non-expired token
  loggedIn() {
    const token = this.getToken();
    return Boolean(token) && !this.isTokenExpired(token);
  }

  // Determine if the token is expired
  isTokenExpired(token) {
    try {
      const { exp } = decode(token);
      if (exp < Date.now() / 1000) {
        // Token expired
        localStorage.removeItem(TOKEN_KEY);
        return true;
      }
      return false;
    } catch {
      // If decode throws, treat as expired
      return true;
    }
  }

  // Retrieve token from localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Save token then redirect to home
  login(token) {
    localStorage.setItem(TOKEN_KEY, token);
    window.location.assign('/');
  }

  // Remove token and reload page
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  }
}

export default new AuthService();
