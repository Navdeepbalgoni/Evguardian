import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // We can default to logged-in so the demo is immediately visible, while providing full login/register functionality
  const [user, setUser] = useState({
    id: 'USR-8821',
    name: 'Anish Sharma',
    email: 'anish.sharma@evguardian.ai',
    role: 'Powertrain Diagnostics Engineer',
    organization: 'CleanMobility Research Labs',
    memberSince: 'August 2025'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [vehicleSetupComplete, setVehicleSetupComplete] = useState(true);

  const login = (email, password) => {
    // Realistic simulation of auth
    const name = email ? email.split('@')[0].replace('.', ' ') : 'EV Engineer';
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    setUser({
      id: 'USR-9024',
      name: formattedName,
      email: email || 'engineer@evguardian.ai',
      role: 'EV Systems Specialist',
      organization: 'Aetherion Mobility',
      memberSince: 'September 2026'
    });
    setIsAuthenticated(true);
    setVehicleSetupComplete(true);
  };

  const register = (formData) => {
    setUser({
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: formData.fullName || 'New EV Driver',
      email: formData.email || 'user@example.com',
      role: 'EV Fleet Operator',
      organization: 'GreenFleet Systems',
      memberSince: 'Today'
    });
    setIsAuthenticated(true);
    setVehicleSetupComplete(false); // redirects to vehicle setup!
  };

  const completeVehicleSetup = () => {
    setVehicleSetupComplete(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        vehicleSetupComplete,
        login,
        register,
        completeVehicleSetup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
