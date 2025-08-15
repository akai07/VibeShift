import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  TrendingUp,
  Plus,
  DollarSign,
  PieChart,
  Volume2,
  VolumeX,
  Save,
  RefreshCw,
  Shield,
  Database,
  Palette,
  Globe
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

const SettingsContainer = styled.div`
  padding: 0;
  max-width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SettingsCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.theme.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.primary};
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textMuted};
  margin: 4px 0 0 0;
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const SettingInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SettingLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.primary};
  }
`;

const SettingDescription = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  line-height: 1.4;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 48px;
  height: 24px;
  background: ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SelectInput = styled.select`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  color: ${props => props.theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  option {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
  }
`;

const NumberInput = styled.input`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  color: ${props => props.theme.text};
  font-size: 14px;
  width: 80px;
  text-align: center;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const ThemeOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? props.theme.primary + '10' : 'transparent'};
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary + '05'};
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.active ? props.theme.primary : props.theme.textMuted};
  }
`;

const ThemeLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.border};
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.primary ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  padding: 12px 20px;
  color: ${props => props.primary ? 'white' : props.theme.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.primary ? props.theme.primaryDark : props.theme.glassEffect};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Settings = () => {
  const { theme, toggleTheme, themeMode, setThemeMode } = useTheme();
  const { settings, updateSettings } = useNotifications();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };
  
  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
  };
  
  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };
  
  const themeOptions = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor }
  ];
  
  return (
    <SettingsContainer>
      <PageHeader>
        <PageTitle theme={theme}>
          <SettingsIcon />
          Settings
        </PageTitle>
        <PageSubtitle theme={theme}>
          Customize your experience and manage preferences
        </PageSubtitle>
      </PageHeader>
      
      <SettingsGrid>
        {/* Appearance Settings */}
        <SettingsCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardHeader>
            <CardIcon theme={theme}>
              <Palette />
            </CardIcon>
            <div>
              <CardTitle theme={theme}>Appearance</CardTitle>
              <CardDescription theme={theme}>
                Customize the look and feel of the application
              </CardDescription>
            </div>
          </CardHeader>
          
          <SettingsList>
            <div>
              <SettingLabel theme={theme}>
                <Palette />
                Theme Mode
              </SettingLabel>
              <SettingDescription theme={theme}>
                Choose your preferred color scheme
              </SettingDescription>
              
              <ThemeGrid>
                {themeOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <ThemeOption
                      key={option.key}
                      theme={theme}
                      active={themeMode === option.key}
                      onClick={() => setThemeMode(option.key)}
                    >
                      <IconComponent />
                      <ThemeLabel theme={theme} active={themeMode === option.key}>
                        {option.label}
                      </ThemeLabel>
                    </ThemeOption>
                  );
                })}
              </ThemeGrid>
            </div>
          </SettingsList>
        </SettingsCard>
        
        {/* Notification Settings */}
        <SettingsCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CardHeader>
            <CardIcon theme={theme}>
              <Bell />
            </CardIcon>
            <div>
              <CardTitle theme={theme}>Notifications</CardTitle>
              <CardDescription theme={theme}>
                Configure how and when you receive alerts
              </CardDescription>
            </div>
          </CardHeader>
          
          <SettingsList>
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <Mail />
                  Email Notifications
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Receive notifications via email
                </SettingDescription>
              </SettingInfo>
              <ToggleSwitch
                theme={theme}
                active={localSettings.email}
                onClick={() => handleSettingChange('email', !localSettings.email)}
              />
            </SettingItem>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <Smartphone />
                  Browser Notifications
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Show desktop notifications in your browser
                </SettingDescription>
              </SettingInfo>
              <ToggleSwitch
                theme={theme}
                active={localSettings.browser}
                onClick={() => handleSettingChange('browser', !localSettings.browser)}
              />
            </SettingItem>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <Volume2 />
                  Sound Alerts
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Play sound when notifications arrive
                </SettingDescription>
              </SettingInfo>
              <ToggleSwitch
                theme={theme}
                active={localSettings.sound}
                onClick={() => handleSettingChange('sound', !localSettings.sound)}
              />
            </SettingItem>
          </SettingsList>
        </SettingsCard>
        
        {/* Alert Settings */}
        <SettingsCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CardHeader>
            <CardIcon theme={theme}>
              <TrendingUp />
            </CardIcon>
            <div>
              <CardTitle theme={theme}>Alert Preferences</CardTitle>
              <CardDescription theme={theme}>
                Choose which market events trigger notifications
              </CardDescription>
            </div>
          </CardHeader>
          
          <SettingsList>
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <TrendingUp />
                  Trend Change Alerts
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Get notified when market trends change
                </SettingDescription>
              </SettingInfo>
              <ToggleSwitch
                theme={theme}
                active={localSettings.trend}
                onClick={() => handleSettingChange('trend', !localSettings.trend)}
              />
            </SettingItem>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <Plus />
                  New Listing Alerts
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Be the first to know about new cryptocurrency listings
                </SettingDescription>
              </SettingInfo>
              <ToggleSwitch
                theme={theme}
                active={localSettings.newListing}
                onClick={() => handleSettingChange('newListing', !localSettings.newListing)}
              />
            </SettingItem>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <DollarSign />
                  Price Alerts
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Receive alerts when prices hit your targets
                </SettingDescription>
              </SettingInfo>
              <ToggleSwitch
                theme={theme}
                active={localSettings.price}
                onClick={() => handleSettingChange('price', !localSettings.price)}
              />
            </SettingItem>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <PieChart />
                  Portfolio Alerts
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Get updates on significant portfolio changes
                </SettingDescription>
              </SettingInfo>
              <ToggleSwitch
                theme={theme}
                active={localSettings.portfolio}
                onClick={() => handleSettingChange('portfolio', !localSettings.portfolio)}
              />
            </SettingItem>
          </SettingsList>
        </SettingsCard>
        
        {/* Data & Privacy */}
        <SettingsCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CardHeader>
            <CardIcon theme={theme}>
              <Shield />
            </CardIcon>
            <div>
              <CardTitle theme={theme}>Data & Privacy</CardTitle>
              <CardDescription theme={theme}>
                Manage your data and privacy preferences
              </CardDescription>
            </div>
          </CardHeader>
          
          <SettingsList>
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <Database />
                  Data Refresh Interval
                </SettingLabel>
                <SettingDescription theme={theme}>
                  How often to update market data (seconds)
                </SettingDescription>
              </SettingInfo>
              <NumberInput
                theme={theme}
                type="number"
                min="10"
                max="300"
                value={localSettings.refreshInterval || 30}
                onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
              />
            </SettingItem>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <Globe />
                  Default Currency
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Primary currency for displaying prices
                </SettingDescription>
              </SettingInfo>
              <SelectInput
                theme={theme}
                value={localSettings.currency || 'USD'}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="BTC">BTC (₿)</option>
                <option value="ETH">ETH (Ξ)</option>
              </SelectInput>
            </SettingItem>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel theme={theme}>
                  <Shield />
                  Analytics Tracking
                </SettingLabel>
                <SettingDescription theme={theme}>
                  Help improve the app by sharing anonymous usage data
                </SettingDescription>
              </SettingInfo>
              <ToggleSwitch
                theme={theme}
                active={localSettings.analytics || false}
                onClick={() => handleSettingChange('analytics', !localSettings.analytics)}
              />
            </SettingItem>
          </SettingsList>
        </SettingsCard>
      </SettingsGrid>
      
      {hasChanges && (
        <ActionButtons>
          <ActionButton theme={theme} onClick={handleReset}>
            <RefreshCw />
            Reset Changes
          </ActionButton>
          <ActionButton theme={theme} primary onClick={handleSave}>
            <Save />
            Save Settings
          </ActionButton>
        </ActionButtons>
      )}
    </SettingsContainer>
  );
};

export default Settings;