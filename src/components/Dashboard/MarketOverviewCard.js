import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Card = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadow};
    border-color: ${props => props.color};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `${props.color}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.color};
  }
`;

const ChangeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${props => props.isPositive ? `${props.theme.success}20` : `${props.theme.error}20`};
  color: ${props => props.isPositive ? props.theme.success : props.theme.error};
  font-size: 12px;
  font-weight: 600;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CardDescription = styled.p`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

const MarketOverviewCard = ({ title, value, change, icon: Icon, color, index }) => {
  const { theme } = useTheme();
  const isPositive = change.startsWith('+');
  
  const descriptions = {
    'Total Market Cap': 'Combined value of all cryptocurrencies',
    '24h Volume': 'Total trading volume in the last 24 hours',
    'BTC Dominance': 'Bitcoin\'s share of the total market cap',
    'Active Coins': 'Number of actively traded cryptocurrencies',
  };

  return (
    <Card
      theme={theme}
      color={color}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <CardHeader>
        <IconContainer color={color}>
          <Icon />
        </IconContainer>
        <ChangeIndicator theme={theme} isPositive={isPositive}>
          {isPositive ? <TrendingUp /> : <TrendingDown />}
          {change}
        </ChangeIndicator>
      </CardHeader>
      
      <CardTitle theme={theme}>{title}</CardTitle>
      <CardValue theme={theme}>{value}</CardValue>
      <CardDescription theme={theme}>
        {descriptions[title]}
      </CardDescription>
    </Card>
  );
};

export default MarketOverviewCard;