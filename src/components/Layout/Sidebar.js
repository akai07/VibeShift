import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  BarChart3, 
  TrendingUp, 
  Coins, 
  Briefcase, 
  Settings, 
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.collapsed ? '80px' : '280px'};
  background: ${props => props.theme.surface};
  border-right: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.mobileOpen ? '0' : '-100%'});
    width: 280px;
  }
`;

const Logo = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    font-size: 24px;
    font-weight: 700;
    background: ${props => props.theme.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    opacity: ${props => props.collapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.theme.gradient};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 24px 0;
  overflow-y: auto;
`;

const NavItem = styled(NavLink).withConfig({
  shouldForwardProp: (prop) => !['collapsed'].includes(prop),
})`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: ${props => props.theme.textSecondary};
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  
  &:hover {
    background: ${props => props.theme.glassEffect};
    color: ${props => props.theme.text};
  }
  
  &.active {
    background: ${props => props.theme.cardGradient};
    color: ${props => props.theme.primary};
    border-left-color: ${props => props.theme.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  span {
    opacity: ${props => props.collapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 24px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1001;
  
  svg {
    width: 12px;
    height: 12px;
    color: white;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.show ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileCloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const navigationItems = [
  {
    path: '/dashboard',
    icon: BarChart3,
    label: 'Dashboard',
  },
  {
    path: '/trends',
    icon: TrendingUp,
    label: 'Trend Analysis',
  },
  {
    path: '/new-coins',
    icon: Coins,
    label: 'New Coins',
  },
  {
    path: '/portfolio',
    icon: Briefcase,
    label: 'Portfolio',
  },
  {
    path: '/settings',
    icon: Settings,
    label: 'Settings',
  },
];

const Sidebar = ({ collapsed, isMobile, onToggle }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleMobileToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      onToggle();
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  React.useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Expose mobile toggle function to parent if needed
  React.useEffect(() => {
    if (isMobile && window.toggleMobileSidebar) {
      window.toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
    }
  }, [isMobile, mobileOpen]);

  return (
    <>
      <MobileOverlay show={isMobile && mobileOpen} onClick={() => setMobileOpen(false)} />
      <SidebarContainer 
        theme={theme} 
        collapsed={collapsed && !isMobile}
        mobileOpen={mobileOpen}
      >
        <Logo theme={theme} collapsed={collapsed && !isMobile}>
          <LogoIcon theme={theme}>
            <TrendingUp />
          </LogoIcon>
          <h1>VibeShift</h1>
        </Logo>
        
        <Navigation>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem
                key={item.path}
                to={item.path}
                theme={theme}
                collapsed={collapsed && !isMobile}
                onClick={handleNavClick}
              >
                <Icon />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </Navigation>
        
        {!isMobile && (
          <ToggleButton theme={theme} onClick={onToggle}>
            {collapsed ? <Menu /> : <X />}
          </ToggleButton>
        )}
        
        <MobileCloseButton theme={theme} onClick={() => setMobileOpen(false)}>
          <X />
        </MobileCloseButton>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;