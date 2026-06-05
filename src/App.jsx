import { Toaster } from 'react-hot-toast';
import { DataProvider } from './contexts/DataContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <DataProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <AppRoutes />
    </DataProvider>
  );
}

export default App;