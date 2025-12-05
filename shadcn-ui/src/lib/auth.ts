export type AuthPage = 'dashboard' | 'projection';

const AUTH_KEY = 'auth_page';

export function login(page: AuthPage, username: string, password: string) {
  const valid =
    (page === 'dashboard' && username === 'master' && password === 'aziz2004') ||
    (page === 'projection' && username === 'parent' && password === 'diamondgym');

  if (valid) {
    localStorage.setItem(AUTH_KEY, page);
    return true;
  }
  return false;
}

export function isAuthorized(_page: AuthPage) {
  return localStorage.getItem(AUTH_KEY) != null;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
