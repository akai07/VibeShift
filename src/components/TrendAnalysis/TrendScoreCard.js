import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ScoreDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: ${props => props.theme.gradient};
  border-radius: 16px;
  text-align: center;
`;

const ScoreValue = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const ScoreLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
`;

const ScoreDescription = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 200px;
`;

const ScoreBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BreakdownItem = styled(motion.div)`
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

const BreakdownLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.primary};
  }
`;

const BreakdownName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const BreakdownValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BreakdownScore = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => {
    if (props.value > 0) return props.theme.success;
    if (props.value < 0) return props.theme.error;
    return props.theme.textMuted;
  }};
`;

const BreakdownBar = styled.div`
  width: 60px;
  height: 4px;
  background: ${props => props.theme.border};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const BreakdownFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.value > 0) return props.theme.success;
    if (props.value < 0) return props.theme.error;
    return props.theme.textMuted;
  }};
  width: ${props => Math.abs(props.value) * 10}%;
  max-width: 100%;
  transition: width 0.3s ease;
`;

const HistorySection = styled.div`
  margin-top: 20px;
`;

const HistoryTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HistoryChart = styled.div`
  display: flex;
  align-items: end;
  gap: 4px;
  height: 60px;
  padding: 8px;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
`;

const HistoryBar = styled.div`
  flex: 1;
  background: ${props => {
    if (props.value > 0) return props.theme.success;
    if (props.value < 0) return props.theme.error;
    return props.theme.textMuted;
  }};
  border-radius: 2px;
  height: ${props => Math.abs(props.value) * 8 + 4}px;
  min-height: 4px;
  max-height: 44px;
  opacity: ${props => 0.3 + (Math.abs(props.value) * 0.07)};
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
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

const TrendScoreCard = ({ coinId }) => {
  const { theme } = useTheme();
  const { marketData } = useData();
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateScoreData = () => {
      const coin = marketData.find(c => c.id === coinId);
      if (!coin) return null;

      // Generate breakdown scores
      const technicalScore = (Math.random() - 0.5) * 8;
      const volumeScore = (Math.random() - 0.5) * 6;
      const sentimentScore = (Math.random() - 0.5) * 4;
      const momentumScore = (Math.random() - 0.5) * 6;
      const volatilityScore = (Math.random() - 0.5) * 4;
      
      const totalScore = technicalScore + volumeScore + sentimentScore + momentumScore + volatilityScore;
      
      // Generate historical data (last 10 periods)
      const history = Array.from({ length: 10 }, () => (Math.random() - 0.5) * 10);
      
      return {
        totalScore: Math.round(totalScore * 10) / 10,
        breakdown: [
          {
            name: 'Technical Analysis',
            value: Math.round(technicalScore * 10) / 10,
            icon: <BarChart3 />
          },
          {
            name: 'Volume Analysis',
            value: Math.round(volumeScore * 10) / 10,
            icon: <Activity />
          },
          {
            name: 'Market Sentiment',
            value: Math.round(sentimentScore * 10) / 10,
            icon: <Target />
          },
          {
            name: 'Price Momentum',
            value: Math.round(momentumScore * 10) / 10,
            icon: <TrendingUp />
          },
          {
            name: 'Volatility Index',
            value: Math.round(volatilityScore * 10) / 10,
            icon: <Zap />
          }
        ],
        history
      };
    };

    setLoading(true);
    const timer = setTimeout(() => {
      setScoreData(generateScoreData());
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [coinId, marketData]);

  const getScoreInfo = (score) => {
    if (score > 5) {
      return {
        label: 'Very Bullish',
        description: 'Strong upward trend expected',
        icon: <TrendingUp />
      };
    }
    if (score > 2) {
      return {
        label: 'Bullish',
        description: 'Positive trend indicators',
        icon: <TrendingUp />
      };
    }
    if (score > -2) {
      return {
        label: 'Neutral',
        description: 'Mixed signals, monitor closely',
        icon: <Target />
      };
    }
    if (score > -5) {
      return {
        label: 'Bearish',
        description: 'Negative trend indicators',
        icon: <TrendingDown />
      };
    }
    return {
      label: 'Very Bearish',
      description: 'Strong downward trend expected',
      icon: <TrendingDown />
    };
  };

  if (loading) {
    return (
      <LoadingState theme={theme}>
        <Activity />
        Calculating trend score...
      </LoadingState>
    );
  }

  if (!scoreData) {
    return (
      <LoadingState theme={theme}>
        <Target />
        No score data available
      </LoadingState>
    );
  }

  const scoreInfo = getScoreInfo(scoreData.totalScore);

  return (
    <ScoreContainer>
      <ScoreDisplay theme={theme}>
        <ScoreValue>
          {scoreInfo.icon}
          {scoreData.totalScore > 0 ? '+' : ''}{scoreData.totalScore}
        </ScoreValue>
        <ScoreLabel>{scoreInfo.label}</ScoreLabel>
        <ScoreDescription>{scoreInfo.description}</ScoreDescription>
      </ScoreDisplay>

      <ScoreBreakdown>
        {scoreData.breakdown.map((item, index) => (
          <BreakdownItem
            key={item.name}
            theme={theme}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BreakdownLabel>
              {item.icon}
              <BreakdownName theme={theme}>{item.name}</BreakdownName>
            </BreakdownLabel>
            
            <BreakdownValue>
              <BreakdownScore theme={theme} value={item.value}>
                {item.value > 0 ? '+' : ''}{item.value}
              </BreakdownScore>
              <BreakdownBar theme={theme}>
                <BreakdownFill theme={theme} value={item.value} />
              </BreakdownBar>
            </BreakdownValue>
          </BreakdownItem>
        ))}
      </ScoreBreakdown>

      <HistorySection>
        <HistoryTitle theme={theme}>Score History</HistoryTitle>
        <HistoryChart theme={theme}>
          {scoreData.history.map((value, index) => (
            <HistoryBar
              key={index}
              theme={theme}
              value={value}
              title={`Period ${index + 1}: ${value > 0 ? '+' : ''}${value.toFixed(1)}`}
            />
          ))}
        </HistoryChart>
      </HistorySection>
    </ScoreContainer>
  );
};

export default TrendScoreCard;