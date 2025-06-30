
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  studentId: string;
  role: 'voter' | 'candidate' | 'admin' | 'lecturer';
  hasVoted?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('voteverse_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Check if user has already voted by looking at voting records
        const votingRecords = JSON.parse(localStorage.getItem('voteverse_voting_records') || '[]');
        const hasVoted = votingRecords.some((record: any) => record.voterId === parsedUser.id);
        setUser({ ...parsedUser, hasVoted });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('voteverse_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock authentication - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock user data based on email
      let userData: User;
      
      if (email === 'admin@university.edu') {
        userData = {
          id: 'admin-1',
          email,
          name: 'System Administrator',
          studentId: 'ADMIN001',
          role: 'admin'
        };
      } else if (email.includes('lecturer')) {
        userData = {
          id: `lecturer-${Date.now()}`,
          email,
          name: email.split('@')[0].replace('lecturer', 'Dr. '),
          studentId: `LEC${Math.floor(Math.random() * 1000)}`,
          role: 'lecturer'
        };
      } else if (email.includes('candidate')) {
        userData = {
          id: `candidate-${Date.now()}`,
          email,
          name: email.split('@')[0].replace('candidate', 'Candidate '),
          studentId: `STU${Math.floor(Math.random() * 10000)}`,
          role: 'candidate'
        };
      } else {
        userData = {
          id: `voter-${Date.now()}`,
          email,
          name: email.split('@')[0],
          studentId: `STU${Math.floor(Math.random() * 10000)}`,
          role: 'voter'
        };
      }
      
      // Check if user has already voted
      const votingRecords = JSON.parse(localStorage.getItem('voteverse_voting_records') || '[]');
      const hasVoted = votingRecords.some((record: any) => record.voterEmail === email);
      userData.hasVoted = hasVoted;
      
      setUser(userData);
      localStorage.setItem('voteverse_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voteverse_user');
    // Clear any session data
    console.log('User logged out successfully');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
