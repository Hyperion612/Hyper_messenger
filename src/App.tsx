import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Landing from './pages/Landing';
import Messenger from './pages/Messenger';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Architecture from './pages/Architecture';
import Connect from './pages/Connect';

interface AppContextType {
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (v: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

export const AppContext = createContext<AppContextType>({
  isAdminAuthenticated: false,
  setIsAdminAuthenticated: () => {},
  theme: 'dark',
  setTheme: () => {},
});

export const useAppContext = () => useContext(AppContext);

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <AppContext.Provider value={{ isAdminAuthenticated, setIsAdminAuthenticated, theme, setTheme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Messenger />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/hyper-admin-7x9k" element={
            isAdminAuthenticated ? <AdminPanel /> : <AdminLogin />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
