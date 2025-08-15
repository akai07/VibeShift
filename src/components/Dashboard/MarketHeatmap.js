import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const HeatmapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 4px;
  height: 300px;
  overflow: hidden;
`;

const HeatmapCell = styled.div`
  background: ${props => {
    const change = props.change;
    const { theme } = props;
    
    if (change > 10) return `${theme.success}CC`;
    if (change > 5) return `${theme.success}99`;
    if (change > 0) return `${theme.success}66`;
    if (change > -5) return `${theme.error}66`;
    if (change > -10) return `${theme.error}99`;
    return `${theme.error}CC`;
  }};
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
    z-index: 10;
    box-shadow: ${props => props.theme.shadow};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.glassEffect};
    backdrop-filter: blur(10px);
    z-index: -1;
  }
`;

const CellHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CoinSymbol = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.text};
  text-transform: uppercase;
`;

const CoinName = styled.span`
  font-size: 10px;
  color: ${props => props.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CellFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-end;
`;

const Price = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const Change = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.isPositive ? props.theme.success : props.theme.error};
`;

const MarketCap = styled.span`
  font-size: 9px;
  color: ${props => props.theme.textMuted};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: ${props => props.theme.textMuted};
  
  h3 {
    margin: 0 0 8px 0;
    color: ${props => props.theme.text};
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  padding: 12px;
  background: ${props => props.theme.glassEffect};
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${props => props.color};
`;

const MarketHeatmap = ({ data }) => {
  const { theme } = useTheme();

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}K`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(1)}M`;
    } else {
      return `$${(marketCap / 1e3).toFixed(1)}K`;
    }
  };

  if (!data || data.length === 0) {
    return (
      <EmptyState theme={theme}>
        <h3>No market data</h3>
        <p>Market heatmap will appear here when data is available</p>
      </EmptyState>
    );
  }

  // Sort by market cap for better visualization
  const sortedData = [...data].sort((a, b) => b.marketCap - a.marketCap);

  const legendItems = [
    { label: '+10%+', color: `${theme.success}CC` },
    { label: '+5% to +10%', color: `${theme.success}99` },
    { label: '0% to +5%', color: `${theme.success}66` },
    { label: '0% to -5%', color: `${theme.error}66` },
    { label: '-5% to -10%', color: `${theme.error}99` },
    { label: '-10%+', color: `${theme.error}CC` },
  ];

  return (
    <div>
      <HeatmapContainer>
        {sortedData.map((coin) => {
          const isPositive = coin.change24h >= 0;
          
          return (
            <HeatmapCell 
              key={coin.id} 
              theme={theme} 
              change={coin.change24h}
              title={`${coin.name} (${coin.symbol.toUpperCase()})\nPrice: ${formatPrice(coin.price)}\nChange: ${isPositive ? '+' : ''}${coin.change24h.toFixed(2)}%\nMarket Cap: ${formatMarketCap(coin.marketCap)}`}
            >
              <CellHeader>
                <CoinSymbol theme={theme}>{coin.symbol}</CoinSymbol>
                <CoinName theme={theme}>{coin.name}</CoinName>
              </CellHeader>
              
              <CellFooter>
                <Price theme={theme}>{formatPrice(coin.price)}</Price>
                <Change theme={theme} isPositive={isPositive}>
                  {isPositive ? '+' : ''}{coin.change24h.toFixed(1)}%
                </Change>
                <MarketCap theme={theme}>
                  {formatMarketCap(coin.marketCap)}
                </MarketCap>
              </CellFooter>
            </HeatmapCell>
          );
        })}
      </HeatmapContainer>
      
      <Legend theme={theme}>
        {legendItems.map((item, index) => (
          <LegendItem key={index} theme={theme}>
            <LegendColor color={item.color} />
            {item.label}
          </LegendItem>
        ))}
      </Legend>
    </div>
  );
};

export default MarketHeatmap;