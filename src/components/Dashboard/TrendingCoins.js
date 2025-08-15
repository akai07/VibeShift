import React from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

const TrendingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TrendingItem = styled.div`
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

const RankBadge = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
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
  margin-right: 12px;
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

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-right: 12px;
`;

const Price = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.isPositive ? props.theme.success : props.theme.error};
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const TrendScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-right: 12px;
`;

const ScoreValue = styled.span`
  font-weight: 700;
  font-size: 16px;
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

const AddToWatchlistButton = styled.button`
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 6px;
  padding: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
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
  padding: 40px 20px;
  text-align: center;
  color: ${props => props.theme.textMuted};
  
  svg {
    width: 48px;
    height: 48px;
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

const TrendingCoins = ({ data }) => {
  const { theme } = useTheme();
  const { addToWatchlist, watchlist } = useData();

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const handleAddToWatchlist = (e, coinId) => {
    e.stopPropagation();
    addToWatchlist(coinId);
  };

  const getTrendLabel = (score) => {
    if (score > 3) return 'Strong Bull';
    if (score > 0) return 'Bullish';
    if (score < -3) return 'Strong Bear';
    if (score < 0) return 'Bearish';
    return 'Neutral';
  };

  if (!data || data.length === 0) {
    return (
      <EmptyState theme={theme}>
        <TrendingUp />
        <h3>No trending data</h3>
        <p>Trending coins will appear here when data is available</p>
      </EmptyState>
    );
  }

  // Sort by trend score and price change
  const sortedData = [...data].sort((a, b) => {
    const scoreA = Math.abs(a.trendScore) + Math.abs(a.change24h);
    const scoreB = Math.abs(b.trendScore) + Math.abs(b.change24h);
    return scoreB - scoreA;
  });

  return (
    <TrendingContainer>
      {sortedData.map((coin, index) => {
        const isPositive = coin.change24h >= 0;
        const isInWatchlist = watchlist.includes(coin.id);
        
        return (
          <TrendingItem key={coin.id} theme={theme}>
            <CoinInfo>
              <RankBadge theme={theme}>{index + 1}</RankBadge>
              <CoinIcon theme={theme}>
                {coin.symbol.substring(0, 2).toUpperCase()}
              </CoinIcon>
              <CoinDetails>
                <CoinName theme={theme}>{coin.name}</CoinName>
                <CoinSymbol theme={theme}>{coin.symbol}</CoinSymbol>
              </CoinDetails>
            </CoinInfo>
            
            <PriceSection>
              <Price theme={theme}>{formatPrice(coin.price)}</Price>
              <PriceChange theme={theme} isPositive={isPositive}>
                {isPositive ? <TrendingUp /> : <TrendingDown />}
                {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
              </PriceChange>
            </PriceSection>
            
            <TrendScore>
              <ScoreValue theme={theme} score={coin.trendScore}>
                {coin.trendScore > 0 ? '+' : ''}{coin.trendScore}
              </ScoreValue>
              <ScoreLabel theme={theme}>Trend</ScoreLabel>
            </TrendScore>
            
            {!isInWatchlist && (
              <AddToWatchlistButton 
                theme={theme}
                onClick={(e) => handleAddToWatchlist(e, coin.id)}
                title="Add to watchlist"
              >
                <Plus />
              </AddToWatchlistButton>
            )}
          </TrendingItem>
        );
      })}
    </TrendingContainer>
  );
};

export default TrendingCoins;