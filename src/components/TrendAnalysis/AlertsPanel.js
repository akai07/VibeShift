import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellOff,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Settings,
  Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useData } from '../../context/DataContext';

const AlertsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
`;

const AlertsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const AlertsTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.primary};
  }
`;

const AddAlertButton = styled.button`
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-1px);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AlertItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const AlertInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const AlertIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    if (props.type === 'bullish') return `${props.theme.success}20`;
    if (props.type === 'bearish') return `${props.theme.error}20`;
    return `${props.theme.warning}20`;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => {
      if (props.type === 'bullish') return props.theme.success;
      if (props.type === 'bearish') return props.theme.error;
      return props.theme.warning;
    }};
  }
`;

const AlertDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const AlertTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const AlertDescription = styled.span`
  font-size: 11px;
  color: ${props => props.theme.textMuted};
`;

const AlertActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  padding: 4px;
  color: ${props => props.theme.textMuted};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.primary};
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const AlertForm = styled(motion.div)`
  padding: 16px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  margin-bottom: 16px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormSelect = styled.select`
  flex: 1;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 8px;
  color: ${props => props.theme.text};
  font-size: 12px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  option {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
  }
`;

const FormInput = styled.input`
  flex: 1;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 8px;
  color: ${props => props.theme.text};
  font-size: 12px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.textMuted};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const FormButton = styled.button`
  background: ${props => props.primary ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.primary ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  padding: 6px 12px;
  color: ${props => props.primary ? 'white' : props.theme.text};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? props.theme.primaryDark : props.theme.glassEffect};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  color: ${props => props.theme.textMuted};
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
  
  h4 {
    margin: 0 0 4px 0;
    color: ${props => props.theme.text};
    font-size: 14px;
  }
  
  p {
    margin: 0;
    font-size: 12px;
  }
`;

const AlertsPanel = () => {
  const { theme } = useTheme();
  const { marketData } = useData();
  const { sendTrendAlert } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      coin: 'bitcoin',
      type: 'bullish',
      condition: 'RSI < 30',
      title: 'Bitcoin Oversold Alert',
      description: 'RSI indicates oversold condition'
    },
    {
      id: 2,
      coin: 'ethereum',
      type: 'bearish',
      condition: 'MACD < 0',
      title: 'Ethereum Bearish Signal',
      description: 'MACD crossed below signal line'
    }
  ]);
  
  const [formData, setFormData] = useState({
    coin: 'bitcoin',
    type: 'bullish',
    condition: 'RSI < 30',
    threshold: ''
  });

  const handleAddAlert = () => {
    if (!formData.threshold) return;
    
    const newAlert = {
      id: Date.now(),
      coin: formData.coin,
      type: formData.type,
      condition: `${formData.condition} ${formData.threshold}`,
      title: `${marketData.find(c => c.id === formData.coin)?.name || 'Coin'} ${formData.type === 'bullish' ? 'Bullish' : 'Bearish'} Alert`,
      description: `${formData.condition} ${formData.threshold}`
    };
    
    setAlerts(prev => [...prev, newAlert]);
    sendTrendAlert(newAlert.coin, newAlert.type, newAlert.condition);
    setShowForm(false);
    setFormData({ coin: 'bitcoin', type: 'bullish', condition: 'RSI < 30', threshold: '' });
  };

  const handleRemoveAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp />;
      case 'bearish':
        return <TrendingDown />;
      default:
        return <AlertTriangle />;
    }
  };

  return (
    <AlertsContainer>
      <AlertsHeader>
        <AlertsTitle theme={theme}>
          <Bell />
          Active Alerts ({alerts.length})
        </AlertsTitle>
        <AddAlertButton 
          theme={theme}
          onClick={() => setShowForm(!showForm)}
        >
          <Plus />
          Add Alert
        </AddAlertButton>
      </AlertsHeader>

      <AnimatePresence>
        {showForm && (
          <AlertForm
            theme={theme}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FormRow>
              <FormSelect
                theme={theme}
                value={formData.coin}
                onChange={(e) => setFormData(prev => ({ ...prev, coin: e.target.value }))}
              >
                {marketData.slice(0, 10).map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </FormSelect>
              
              <FormSelect
                theme={theme}
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="bullish">Bullish Signal</option>
                <option value="bearish">Bearish Signal</option>
              </FormSelect>
            </FormRow>
            
            <FormRow>
              <FormSelect
                theme={theme}
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
              >
                <option value="RSI <">RSI Below</option>
                <option value="RSI >">RSI Above</option>
                <option value="MACD <">MACD Below</option>
                <option value="MACD >">MACD Above</option>
                <option value="Price <">Price Below</option>
                <option value="Price >">Price Above</option>
              </FormSelect>
              
              <FormInput
                theme={theme}
                type="number"
                placeholder="Threshold value"
                value={formData.threshold}
                onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
              />
            </FormRow>
            
            <FormActions>
              <FormButton 
                theme={theme}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </FormButton>
              <FormButton 
                theme={theme}
                primary
                onClick={handleAddAlert}
              >
                Create Alert
              </FormButton>
            </FormActions>
          </AlertForm>
        )}
      </AnimatePresence>

      <AlertsList>
        <AnimatePresence>
          {alerts.length === 0 ? (
            <EmptyState theme={theme}>
              <BellOff />
              <h4>No Active Alerts</h4>
              <p>Create your first trend alert to get notified</p>
            </EmptyState>
          ) : (
            alerts.map((alert, index) => (
              <AlertItem
                key={alert.id}
                theme={theme}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <AlertInfo>
                  <AlertIcon theme={theme} type={alert.type}>
                    {getAlertIcon(alert.type)}
                  </AlertIcon>
                  
                  <AlertDetails>
                    <AlertTitle theme={theme}>{alert.title}</AlertTitle>
                    <AlertDescription theme={theme}>
                      {alert.description}
                    </AlertDescription>
                  </AlertDetails>
                </AlertInfo>
                
                <AlertActions>
                  <ActionButton theme={theme}>
                    <Settings />
                  </ActionButton>
                  <ActionButton 
                    theme={theme}
                    onClick={() => handleRemoveAlert(alert.id)}
                  >
                    <X />
                  </ActionButton>
                </AlertActions>
              </AlertItem>
            ))
          )}
        </AnimatePresence>
      </AlertsList>
    </AlertsContainer>
  );
};

export default AlertsPanel;