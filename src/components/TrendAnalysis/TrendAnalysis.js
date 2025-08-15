import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import TechnicalIndicators from './TechnicalIndicators';
import TrendScoreCard from './TrendScoreCard';
import AlertsPanel from './AlertsPanel';

const TrendContainer = styled.div`
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
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  color: ${props => props.theme.text};
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  option {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
  }
`;

const FilterButton = styled.button`
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  padding: 8px 16px;
  color: ${props => props.active ? 'white' : props.theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.glassEffect};
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const TrendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.primary};
  }
`;

const TrendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TrendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.theme.primary};
    box-shadow: ${props => props.theme.shadowLight};
  }
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CoinIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: white;
`;

const CoinDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CoinName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
`;

const CoinSymbol = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
`;

const TrendInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TrendScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const ScoreValue = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: ${props => {
    if (props.score > 3) return props.theme.success;
    if (props.score < -3) return props.theme.error;
    return props.theme.warning;
  }};
`;

const ScoreLabel = styled.span`
  font-size: 10px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TrendDirection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${props => props.isPositive ? `${props.theme.success}20` : `${props.theme.error}20`};
  color: ${props => props.isPositive ? props.theme.success : props.theme.error};
  font-size: 12px;
  font-weight: 600;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: ${props => props.theme.textMuted};
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: ${props => props.theme.text};
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const TrendAnalysis = () => {
  const { theme } = useTheme();
  const { marketData, loading } = useData();
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [trendFilter, setTrendFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('1d');

  const getTrendDirection = (score) => {
    if (score > 3) return { label: 'Strong Bullish', isPositive: true };
    if (score > 0) return { label: 'Bullish', isPositive: true };
    if (score < -3) return { label: 'Strong Bearish', isPositive: false };
    if (score < 0) return { label: 'Bearish', isPositive: false };
    return { label: 'Neutral', isPositive: null };
  };

  const filteredData = marketData.filter(coin => {
    if (trendFilter === 'bullish') return coin.trendScore > 0;
    if (trendFilter === 'bearish') return coin.trendScore < 0;
    if (trendFilter === 'strong') return Math.abs(coin.trendScore) > 3;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => Math.abs(b.trendScore) - Math.abs(a.trendScore));

  if (loading && marketData.length === 0) {
    return (
      <TrendContainer>
        <EmptyState theme={theme}>
          <Activity />
          <h3>Loading trend analysis...</h3>
          <p>Please wait while we analyze market trends</p>
        </EmptyState>
      </TrendContainer>
    );
  }

  return (
    <TrendContainer>
      <PageHeader>
        <PageTitle theme={theme}>Trend Analysis</PageTitle>
        <PageSubtitle theme={theme}>
          Advanced technical analysis and trend prediction for cryptocurrency markets
        </PageSubtitle>
      </PageHeader>

      <FilterSection>
        <FilterSelect 
          theme={theme}
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
        >
          {marketData.map(coin => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </FilterSelect>
        
        <FilterSelect 
          theme={theme}
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="1h">1 Hour</option>
          <option value="4h">4 Hours</option>
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
        </FilterSelect>
        
        <FilterButton 
          theme={theme}
          active={trendFilter === 'all'}
          onClick={() => setTrendFilter('all')}
        >
          All Trends
        </FilterButton>
        
        <FilterButton 
          theme={theme}
          active={trendFilter === 'bullish'}
          onClick={() => setTrendFilter('bullish')}
        >
          Bullish
        </FilterButton>
        
        <FilterButton 
          theme={theme}
          active={trendFilter === 'bearish'}
          onClick={() => setTrendFilter('bearish')}
        >
          Bearish
        </FilterButton>
        
        <FilterButton 
          theme={theme}
          active={trendFilter === 'strong'}
          onClick={() => setTrendFilter('strong')}
        >
          Strong Signals
        </FilterButton>
      </FilterSection>

      <MainGrid>
        <Card
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardHeader>
            <CardTitle theme={theme}>
              <BarChart3 />
              Technical Indicators
            </CardTitle>
          </CardHeader>
          <TechnicalIndicators coinId={selectedCoin} timeframe={timeframe} />
        </Card>

        <Card
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardHeader>
            <CardTitle theme={theme}>
              <AlertTriangle />
              Trend Alerts
            </CardTitle>
          </CardHeader>
          <AlertsPanel />
        </Card>
      </MainGrid>

      <TrendGrid>
        <Card
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardHeader>
            <CardTitle theme={theme}>
              <Target />
              Trend Score Overview
            </CardTitle>
          </CardHeader>
          <TrendScoreCard coinId={selectedCoin} />
        </Card>

        <Card
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CardHeader>
            <CardTitle theme={theme}>
              <Zap />
              Market Trends
            </CardTitle>
          </CardHeader>
          
          {sortedData.length === 0 ? (
            <EmptyState theme={theme}>
              <TrendingUp />
              <h3>No trends found</h3>
              <p>Try adjusting your filters</p>
            </EmptyState>
          ) : (
            <TrendList>
              {sortedData.slice(0, 8).map((coin) => {
                const trend = getTrendDirection(coin.trendScore);
                
                return (
                  <TrendItem key={coin.id} theme={theme}>
                    <CoinInfo>
                      <CoinIcon theme={theme}>
                        {coin.symbol.substring(0, 2).toUpperCase()}
                      </CoinIcon>
                      <CoinDetails>
                        <CoinName theme={theme}>{coin.name}</CoinName>
                        <CoinSymbol theme={theme}>{coin.symbol}</CoinSymbol>
                      </CoinDetails>
                    </CoinInfo>
                    
                    <TrendInfo>
                      <TrendScore>
                        <ScoreValue theme={theme} score={coin.trendScore}>
                          {coin.trendScore > 0 ? '+' : ''}{coin.trendScore}
                        </ScoreValue>
                        <ScoreLabel theme={theme}>Score</ScoreLabel>
                      </TrendScore>
                      
                      <TrendDirection theme={theme} isPositive={trend.isPositive}>
                        {trend.isPositive ? <TrendingUp /> : <TrendingDown />}
                        {trend.label}
                      </TrendDirection>
                    </TrendInfo>
                  </TrendItem>
                );
              })}
            </TrendList>
          )}
        </Card>
      </TrendGrid>
    </TrendContainer>
  );
};

export default TrendAnalysis;