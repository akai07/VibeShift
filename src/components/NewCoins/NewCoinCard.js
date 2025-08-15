import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Star,
  StarOff,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CardContainer = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowMedium};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const CoinIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    background: ${props => props.theme.success};
    border: 2px solid ${props => props.theme.surface};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const CoinDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const CoinName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  line-height: 1.2;
`;

const CoinSymbol = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  font-weight: 500;
`;

const LaunchBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.success}20;
  color: ${props => props.theme.success};
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  svg {
    width: 10px;
    height: 10px;
  }
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  padding: 6px;
  color: ${props => props.active ? 'white' : props.theme.textMuted};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    color: ${props => props.active ? 'white' : props.theme.primary};
    transform: scale(1.05);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.isPositive ? props.theme.success : props.theme.error};
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const VolumeInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const VolumeLabel = styled.span`
  font-size: 10px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const VolumeValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const ScoresSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const ScoreLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  svg {
    width: 10px;
    height: 10px;
  }
`;

const ScoreValue = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${props => {
    if (props.score >= 8) return props.theme.success;
    if (props.score >= 6) return props.theme.warning;
    if (props.score >= 4) return props.theme.text;
    return props.theme.error;
  }};
`;

const MetricsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.border};
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
`;

const MetricLabel = styled.span`
  font-size: 9px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const NewCoinCard = ({ coin, index, onToggleWatch, onAnalyze }) => {
  const { theme } = useTheme();

  const formatPrice = (price) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000000) return `$${(marketCap / 1000000000).toFixed(1)}B`;
    if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(1)}M`;
    if (marketCap >= 1000) return `$${(marketCap / 1000).toFixed(0)}K`;
    return `$${marketCap.toFixed(0)}`;
  };

  const getTimeSinceLaunch = (launchDate) => {
    const now = new Date();
    const launch = new Date(launchDate);
    const diffInHours = Math.floor((now - launch) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just launched';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <CardContainer
      theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onAnalyze}
    >
      <CardHeader>
        <CoinInfo>
          <CoinIcon theme={theme}>
            {coin.symbol.substring(0, 2).toUpperCase()}
          </CoinIcon>
          
          <CoinDetails>
            <CoinName theme={theme}>{coin.name}</CoinName>
            <CoinSymbol theme={theme}>{coin.symbol}</CoinSymbol>
          </CoinDetails>
          
          <LaunchBadge theme={theme}>
            <Calendar />
            {getTimeSinceLaunch(coin.launchDate)}
          </LaunchBadge>
        </CoinInfo>
        
        <CardActions>
          <ActionButton
            theme={theme}
            active={coin.isWatched}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatch();
            }}
            title={coin.isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {coin.isWatched ? <Star /> : <StarOff />}
          </ActionButton>
          
          <ActionButton
            theme={theme}
            onClick={(e) => {
              e.stopPropagation();
              onAnalyze();
            }}
            title="Analyze coin"
          >
            <Eye />
          </ActionButton>
        </CardActions>
      </CardHeader>

      <PriceSection>
        <PriceInfo>
          <Price theme={theme}>{formatPrice(coin.price)}</Price>
          <PriceChange theme={theme} isPositive={coin.change24h > 0}>
            {coin.change24h > 0 ? <TrendingUp /> : <TrendingDown />}
            {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
          </PriceChange>
        </PriceInfo>
        
        <VolumeInfo>
          <VolumeLabel theme={theme}>24h Volume</VolumeLabel>
          <VolumeValue theme={theme}>{formatVolume(coin.volume)}</VolumeValue>
        </VolumeInfo>
      </PriceSection>

      <ScoresSection>
        <ScoreItem theme={theme}>
          <ScoreLabel theme={theme}>
            <Zap />
            Potential
          </ScoreLabel>
          <ScoreValue theme={theme} score={coin.potentialScore}>
            {coin.potentialScore}/10
          </ScoreValue>
        </ScoreItem>
        
        <ScoreItem theme={theme}>
          <ScoreLabel theme={theme}>
            <Shield />
            Risk
          </ScoreLabel>
          <ScoreValue theme={theme} score={10 - coin.riskScore}>
            {coin.riskScore}/10
          </ScoreValue>
        </ScoreItem>
        
        <ScoreItem theme={theme}>
          <ScoreLabel theme={theme}>
            <BarChart3 />
            Liquidity
          </ScoreLabel>
          <ScoreValue theme={theme} score={coin.liquidityScore}>
            {coin.liquidityScore}/10
          </ScoreValue>
        </ScoreItem>
        
        <ScoreItem theme={theme}>
          <ScoreLabel theme={theme}>
            <Users />
            Community
          </ScoreLabel>
          <ScoreValue theme={theme} score={coin.communityScore}>
            {coin.communityScore}/10
          </ScoreValue>
        </ScoreItem>
      </ScoresSection>

      <MetricsSection theme={theme}>
        <MetricItem>
          <MetricLabel theme={theme}>Market Cap</MetricLabel>
          <MetricValue theme={theme}>
            {coin.marketCap > 0 ? formatMarketCap(coin.marketCap) : 'N/A'}
          </MetricValue>
        </MetricItem>
        
        <MetricItem>
          <MetricLabel theme={theme}>Launch Date</MetricLabel>
          <MetricValue theme={theme}>
            {new Date(coin.launchDate).toLocaleDateString()}
          </MetricValue>
        </MetricItem>
        
        <MetricItem>
          <MetricLabel theme={theme}>Status</MetricLabel>
          <MetricValue theme={theme} style={{ color: theme.success }}>
            Active
          </MetricValue>
        </MetricItem>
      </MetricsSection>
    </CardContainer>
  );
};

export default NewCoinCard;