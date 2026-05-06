import { AuthProvider } from '../features/auth/components/AuthContext';
import { ThemeProvider } from './ThemeContext';

export function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
