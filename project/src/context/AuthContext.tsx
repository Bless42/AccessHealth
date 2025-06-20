import React, { createContext, useState, useEffect, useContext } from 'react';

type UserRole = 'patient' | 'doctor' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  phone_number: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  signUp: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user storage
const USERS_STORAGE_KEY = 'accesshealth_users';
const CURRENT_USER_KEY = 'accesshealth_current_user';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
}

// Helper functions for localStorage
const getStoredUsers = (): StoredUser[] => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUser = (user: StoredUser): void => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const findUser = (email: string): StoredUser | null => {
  const users = getStoredUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Generate valid UUID v4
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user session on mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Create a mock profile for the user
      const mockProfile: Profile = {
        id: generateUUID(),
        user_id: currentUser.id,
        first_name: null,
        last_name: null,
        date_of_birth: null,
        phone_number: null,
        address: null,
        role: currentUser.role,
        created_at: currentUser.created_at,
        updated_at: currentUser.created_at,
      };
      setProfile(mockProfile);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      if (!isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (!isValidPassword(password)) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      // Check if user already exists
      const existingUser = findUser(email);
      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Create new user with valid UUID
      const newUser: StoredUser = {
        id: generateUUID(),
        email: email.toLowerCase(),
        password, // In a real app, this would be hashed
        role,
        created_at: new Date().toISOString(),
      };

      // Save user
      saveUser(newUser);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      if (!isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Find user
      const storedUser = findUser(email);
      if (!storedUser) {
        return { success: false, error: 'No account found with this email' };
      }

      // Check password
      if (storedUser.password !== password) {
        return { success: false, error: 'Invalid password' };
      }

      // Create user session
      const sessionUser: User = {
        id: storedUser.id,
        email: storedUser.email,
        role: storedUser.role,
        created_at: storedUser.created_at,
      };

      const userProfile: Profile = {
        id: generateUUID(),
        user_id: storedUser.id,
        first_name: null,
        last_name: null,
        date_of_birth: null,
        phone_number: null,
        address: null,
        role: storedUser.role,
        created_at: storedUser.created_at,
        updated_at: storedUser.created_at,
      };

      setUser(sessionUser);
      setProfile(userProfile);
      setCurrentUser(sessionUser);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign-in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!email) {
        return { success: false, error: 'Email is required' };
      }

      if (!isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Check if user exists
      const storedUser = findUser(email);
      if (!storedUser) {
        return { success: false, error: 'No account found with this email' };
      }

      // Simulate magic link sent
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Magic link failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!email) {
        return { success: false, error: 'Email is required' };
      }

      if (!isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Check if user exists
      const storedUser = findUser(email);
      if (!storedUser) {
        return { success: false, error: 'No account found with this email' };
      }

      // Simulate password reset email sent
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      setUser(null);
      setProfile(null);
      setCurrentUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        signUp,
        signIn,
        signInWithMagicLink,
        signOut,
        resetPassword,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};