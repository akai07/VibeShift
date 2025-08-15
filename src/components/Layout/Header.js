import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  Bell, 
  Menu, 
  Sun, 
  Moon, 
  RefreshCw,
  User
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const HeaderContainer = styled.header`
  height: 80px;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 400px;
  
  @media (max-width: 768px) {
    width: 200px;
  }
  
  @media (max-width: 480px) {
    width: 150px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0 16px 0 40px;
  color: ${props => props.theme.text};
  font-size: 14px;
  
  &::placeholder {
    color: ${props => props.theme.textMuted};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textMuted};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.theme.surfaceLight};
    transform: translateY(-1px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.theme.error};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
`;

const LastUpdateText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.surfaceLight};
  }
  
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.theme.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 18px;
    height: 18px;
    color: white;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const UserRole = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
`;

const Header = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { refreshData, loading, lastUpdate } = useData();
  const { unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = () => {
    if (!loading) {
      refreshData();
    }
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    return `Updated ${formatDistanceToNow(lastUpdate, { addSuffix: true })}`;
  };

  return (
    <HeaderContainer theme={theme}>
      <LeftSection>
        <MobileMenuButton theme={theme} onClick={onToggleSidebar}>
          <Menu />
        </MobileMenuButton>
        
        <SearchContainer>
          <SearchIcon theme={theme}>
            <Search />
          </SearchIcon>
          <SearchInput
            theme={theme}
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        
        <LastUpdateText theme={theme}>
          {formatLastUpdate()}
        </LastUpdateText>
      </LeftSection>
      
      <RightSection>
        <ActionButton 
          theme={theme} 
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh data"
        >
          <RefreshCw className={loading ? 'pulse' : ''} />
        </ActionButton>
        
        <ActionButton theme={theme} onClick={toggleTheme} title="Toggle theme">
          {isDark ? <Sun /> : <Moon />}
        </ActionButton>
        
        <ActionButton theme={theme} title="Notifications">
          <Bell />
          {unreadCount > 0 && (
            <NotificationBadge theme={theme}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </NotificationBadge>
          )}
        </ActionButton>
        
        <UserProfile theme={theme}>
          <Avatar theme={theme}>
            <User />
          </Avatar>
          <UserInfo>
            <UserName theme={theme}>Trader</UserName>
            <UserRole theme={theme}>Pro User</UserRole>
          </UserInfo>
        </UserProfile>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;