import { AppProvider } from './app/AppProvider';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
