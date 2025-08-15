import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity,
  BarChart3,
  Target
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const IndicatorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const IndicatorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GroupTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const IndicatorItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const IndicatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IndicatorName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const IndicatorValue = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
`;

const IndicatorSignal = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.signal === 'buy') return `${props.theme.success}20`;
    if (props.signal === 'sell') return `${props.theme.error}20`;
    return `${props.theme.textMuted}20`;
  }};
  color: ${props => {
    if (props.signal === 'buy') return props.theme.success;
    if (props.signal === 'sell') return props.theme.error;
    return props.theme.textMuted;
  }};
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const OverallSignal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  background: ${props => props.theme.gradient};
  border-radius: 12px;
  margin-top: 16px;
`;

const SignalIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const SignalText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SignalLabel = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

const SignalDescription = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${props => props.theme.textMuted};
  
  svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const TechnicalIndicators = ({ coinId, timeframe }) => {
  const { theme } = useTheme();
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateIndicators = () => {
      // Simulate technical indicators calculation
      const rsi = Math.random() * 100;
      const macd = (Math.random() - 0.5) * 2;
      const bb_upper = 45000 + Math.random() * 5000;
      const bb_lower = 40000 + Math.random() * 5000;
      const sma_20 = 42000 + Math.random() * 3000;
      const ema_12 = 42500 + Math.random() * 2500;
      const stoch = Math.random() * 100;
      const williams = Math.random() * -100;
      
      const getSignal = (value, type) => {
        if (type === 'rsi') {
          if (value > 70) return 'sell';
          if (value < 30) return 'buy';
          return 'neutral';
        }
        if (type === 'macd') {
          return value > 0 ? 'buy' : 'sell';
        }
        if (type === 'stoch') {
          if (value > 80) return 'sell';
          if (value < 20) return 'buy';
          return 'neutral';
        }
        if (type === 'williams') {
          if (value > -20) return 'sell';
          if (value < -80) return 'buy';
          return 'neutral';
        }
        return 'neutral';
      };
      
      const indicatorData = {
        momentum: [
          {
            name: 'RSI (14)',
            value: rsi.toFixed(2),
            signal: getSignal(rsi, 'rsi')
          },
          {
            name: 'Stochastic %K',
            value: stoch.toFixed(2),
            signal: getSignal(stoch, 'stoch')
          },
          {
            name: 'Williams %R',
            value: williams.toFixed(2),
            signal: getSignal(williams, 'williams')
          }
        ],
        trend: [
          {
            name: 'MACD',
            value: macd.toFixed(4),
            signal: getSignal(macd, 'macd')
          },
          {
            name: 'SMA (20)',
            value: `$${sma_20.toFixed(0)}`,
            signal: 'neutral'
          },
          {
            name: 'EMA (12)',
            value: `$${ema_12.toFixed(0)}`,
            signal: 'neutral'
          }
        ],
        volatility: [
          {
            name: 'Bollinger Upper',
            value: `$${bb_upper.toFixed(0)}`,
            signal: 'neutral'
          },
          {
            name: 'Bollinger Lower',
            value: `$${bb_lower.toFixed(0)}`,
            signal: 'neutral'
          }
        ]
      };
      
      // Calculate overall signal
      const signals = [
        ...indicatorData.momentum.map(i => i.signal),
        ...indicatorData.trend.map(i => i.signal)
      ].filter(s => s !== 'neutral');
      
      const buySignals = signals.filter(s => s === 'buy').length;
      const sellSignals = signals.filter(s => s === 'sell').length;
      
      let overallSignal = 'neutral';
      if (buySignals > sellSignals) overallSignal = 'buy';
      else if (sellSignals > buySignals) overallSignal = 'sell';
      
      return { ...indicatorData, overallSignal };
    };

    setLoading(true);
    const timer = setTimeout(() => {
      setIndicators(generateIndicators());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [coinId, timeframe]);

  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp />;
      case 'sell':
        return <TrendingDown />;
      default:
        return <Minus />;
    }
  };

  const getOverallSignalInfo = (signal) => {
    switch (signal) {
      case 'buy':
        return {
          icon: <TrendingUp />,
          label: 'Bullish Signal',
          description: 'Technical indicators suggest upward momentum'
        };
      case 'sell':
        return {
          icon: <TrendingDown />,
          label: 'Bearish Signal',
          description: 'Technical indicators suggest downward momentum'
        };
      default:
        return {
          icon: <Target />,
          label: 'Neutral Signal',
          description: 'Mixed signals, monitor for clearer direction'
        };
    }
  };

  if (loading) {
    return (
      <LoadingState theme={theme}>
        <Activity />
        Analyzing technical indicators...
      </LoadingState>
    );
  }

  if (!indicators) {
    return (
      <LoadingState theme={theme}>
        <BarChart3 />
        No data available
      </LoadingState>
    );
  }

  const overallInfo = getOverallSignalInfo(indicators.overallSignal);

  return (
    <IndicatorsContainer>
      <IndicatorGroup>
        <GroupTitle theme={theme}>Momentum Indicators</GroupTitle>
        {indicators.momentum.map((indicator, index) => (
          <IndicatorItem
            key={indicator.name}
            theme={theme}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <IndicatorInfo>
              <IndicatorName theme={theme}>{indicator.name}</IndicatorName>
              <IndicatorValue theme={theme}>{indicator.value}</IndicatorValue>
            </IndicatorInfo>
            <IndicatorSignal theme={theme} signal={indicator.signal}>
              {getSignalIcon(indicator.signal)}
              {indicator.signal.toUpperCase()}
            </IndicatorSignal>
          </IndicatorItem>
        ))}
      </IndicatorGroup>

      <IndicatorGroup>
        <GroupTitle theme={theme}>Trend Indicators</GroupTitle>
        {indicators.trend.map((indicator, index) => (
          <IndicatorItem
            key={indicator.name}
            theme={theme}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (indicators.momentum.length + index) * 0.1 }}
          >
            <IndicatorInfo>
              <IndicatorName theme={theme}>{indicator.name}</IndicatorName>
              <IndicatorValue theme={theme}>{indicator.value}</IndicatorValue>
            </IndicatorInfo>
            <IndicatorSignal theme={theme} signal={indicator.signal}>
              {getSignalIcon(indicator.signal)}
              {indicator.signal.toUpperCase()}
            </IndicatorSignal>
          </IndicatorItem>
        ))}
      </IndicatorGroup>

      <IndicatorGroup>
        <GroupTitle theme={theme}>Volatility Indicators</GroupTitle>
        {indicators.volatility.map((indicator, index) => (
          <IndicatorItem
            key={indicator.name}
            theme={theme}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (indicators.momentum.length + indicators.trend.length + index) * 0.1 }}
          >
            <IndicatorInfo>
              <IndicatorName theme={theme}>{indicator.name}</IndicatorName>
              <IndicatorValue theme={theme}>{indicator.value}</IndicatorValue>
            </IndicatorInfo>
            <IndicatorSignal theme={theme} signal={indicator.signal}>
              {getSignalIcon(indicator.signal)}
              {indicator.signal.toUpperCase()}
            </IndicatorSignal>
          </IndicatorItem>
        ))}
      </IndicatorGroup>

      <OverallSignal theme={theme}>
        <SignalIcon>
          {overallInfo.icon}
        </SignalIcon>
        <SignalText>
          <SignalLabel>{overallInfo.label}</SignalLabel>
          <SignalDescription>{overallInfo.description}</SignalDescription>
        </SignalText>
      </OverallSignal>
    </IndicatorsContainer>
  );
};

export default TechnicalIndicators;