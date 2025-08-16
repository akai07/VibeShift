import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';

// Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import TrendAnalysis from './components/TrendAnalysis/TrendAnalysis';
import NewCoins from './components/NewCoins/NewCoins';
import Portfolio from './components/Portfolio/Portfolio';
import Settings from './components/Settings/Settings';

// Context
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '280px'};
  transition: margin-left 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <NotificationProvider>
          <Router basename={process.env.NODE_ENV === 'production' ? '/VibeShift' : '/'}>
            <AppContainer>
              <Sidebar 
                collapsed={sidebarCollapsed} 
                isMobile={isMobile}
                onToggle={toggleSidebar}
              />
              <MainContent sidebarCollapsed={sidebarCollapsed}>
                <Header 
                  onToggleSidebar={toggleSidebar}
                  sidebarCollapsed={sidebarCollapsed}
                />
                <ContentArea>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/trends" element={<TrendAnalysis />} />
                    <Route path="/new-coins" element={<NewCoins />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </ContentArea>
              </MainContent>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </AppContainer>
          </Router>
        </NotificationProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;