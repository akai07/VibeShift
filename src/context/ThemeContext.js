import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  dark: {
    primary: '#4F46E5',
    secondary: '#06B6D4',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceLight: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    textMuted: '#666666',
    border: '#333333',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
    glassEffect: 'rgba(255, 255, 255, 0.05)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    shadowLight: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  light: {
    primary: '#4F46E5',
    secondary: '#06B6D4',
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceLight: '#f1f5f9',
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
    glassEffect: 'rgba(255, 255, 255, 0.8)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    shadowLight: '0 4px 16px rgba(0, 0, 0, 0.05)',
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [customSettings, setCustomSettings] = useState({
    fontSize: 'medium',
    animations: true,
    compactMode: false,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('vibeshift-theme');
    const savedSettings = localStorage.getItem('vibeshift-theme-settings');
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedSettings) {
      try {
        setCustomSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing saved theme settings:', error);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    localStorage.setItem('vibeshift-theme', newTheme);
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...customSettings, ...newSettings };
    setCustomSettings(updatedSettings);
    localStorage.setItem('vibeshift-theme-settings', JSON.stringify(updatedSettings));
  };

  const theme = themes[currentTheme];

  const value = {
    theme,
    currentTheme,
    customSettings,
    toggleTheme,
    updateSettings,
    isDark: currentTheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};