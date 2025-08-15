import React from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, Star, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

const WatchlistContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const WatchlistItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: all 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.glassEffect};
    margin: 0 -12px;
    padding: 12px;
    border-radius: 8px;
  }
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const CoinIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
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

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: ${props => props.theme.textMuted};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.glassEffect};
    color: ${props => props.theme.text};
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

const AddButton = styled.button`
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const WatchlistWidget = ({ data }) => {
  const { theme } = useTheme();
  const { removeFromWatchlist } = useData();

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const handleRemoveFromWatchlist = (coinId) => {
    removeFromWatchlist(coinId);
  };

  if (!data || data.length === 0) {
    return (
      <EmptyState theme={theme}>
        <Star />
        <h3>No coins in watchlist</h3>
        <p>Add cryptocurrencies to track their performance</p>
        <AddButton theme={theme}>Add Coins</AddButton>
      </EmptyState>
    );
  }

  return (
    <WatchlistContainer>
      {data.map((coin) => {
        const isPositive = coin.change24h >= 0;
        
        return (
          <WatchlistItem key={coin.id} theme={theme}>
            <CoinInfo>
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
            
            <ActionButtons>
              <ActionButton 
                theme={theme}
                onClick={() => handleRemoveFromWatchlist(coin.id)}
                title="Remove from watchlist"
              >
                <X />
              </ActionButton>
            </ActionButtons>
          </WatchlistItem>
        );
      })}
    </WatchlistContainer>
  );
};

export default WatchlistWidget;