import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar: string;
  status: string;
  bio: string;
  createdAt: string;
  lastSeen: string;
  isOnline: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'hyper_users';
const CURRENT_USER_KEY = 'hyper_current_user';
const SESSION_KEY = 'hyper_session';

// Helper functions
function getUsers(): Array<User & { password: string }> {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: Array<User & { password: string }>): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users:', e);
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const AVATARS = ['👤', '👩', '👨', '🧑', '👩‍💻', '👨‍💻', '🧑‍🎨', '👩‍🔬', '👨‍🚀', '🦊', '🐱', '🐶', '🦁', '🐼', '🦄'];

function getRandomAvatar(): string {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const userId = JSON.parse(session);
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
          const { password: _, ...userData } = user;
          setAuthState({
            user: userData as User,
            isAuthenticated: true,
            isLoading: false,
          });
          // Update last seen
          updateLastSeen(user.id);
          return;
        }
      }
    } catch (e) {
      console.error('Session check failed:', e);
    }
    setAuthState(prev => ({ ...prev, isLoading: false }));
  }, []);

  // Update online status periodically
  useEffect(() => {
    if (!authState.user) return;
    
    const userId = authState.user.id;
    
    const interval = setInterval(() => {
      updateLastSeen(userId);
    }, 30000);
    
    // Set online on mount
    setOnlineStatus(userId, true);
    
    // Set offline on unmount
    const handleUnload = () => {
      setOnlineStatus(userId, false);
    };
    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      clearInterval(interval);
      handleUnload();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [authState.user]);

  function updateLastSeen(userId: string) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      users[idx].lastSeen = new Date().toISOString();
      users[idx].isOnline = true;
      saveUsers(users);
    }
  }

  function setOnlineStatus(userId: string, online: boolean) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      users[idx].isOnline = online;
      if (!online) users[idx].lastSeen = new Date().toISOString();
      saveUsers(users);
      // Broadcast status change
      window.dispatchEvent(new CustomEvent('hyper-user-status', { detail: { userId, online } }));
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 500)); // Simulate network
    
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || user.password !== password) {
      return { success: false, error: 'auth.invalidCredentials' };
    }
    
    const { password: _, ...userData } = user;
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(user.id));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    
    setAuthState({
      user: userData as User,
      isAuthenticated: true,
      isLoading: false,
    });
    
    setOnlineStatus(user.id, true);
    
    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 500));
    
    const users = getUsers();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'auth.userExists' };
    }
    
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'auth.userExists' };
    }
    
    const newUser = {
      id: generateId(),
      email,
      password,
      username,
      fullName,
      avatar: getRandomAvatar(),
      status: 'active',
      bio: '',
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isOnline: true,
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const { password: _, ...userData } = newUser;
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser.id));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    
    setAuthState({
      user: userData as User,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return { success: true };
  };

  const logout = () => {
    if (authState.user) {
      setOnlineStatus(authState.user.id, false);
    }
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!authState.user) return;
    
    const users = getUsers();
    const idx = users.findIndex(u => u.id === authState.user!.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      saveUsers(users);
      
      const { password: _, ...userData } = users[idx];
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      
      setAuthState(prev => ({
        ...prev,
        user: userData as User,
      }));
    }
  };

  const getAllUsers = (): User[] => {
    return getUsers().map(({ password: _, ...u }) => u as User);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile,
      getAllUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
