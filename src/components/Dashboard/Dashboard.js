import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity,
  Eye,
  Plus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatCompactCurrency } from '../../utils/currency';
import MarketOverviewCard from './MarketOverviewCard';
import CryptoChart from './CryptoChart';
import WatchlistWidget from './WatchlistWidget';
import TrendingCoins from './TrendingCoins';
import MarketHeatmap from './MarketHeatmap';

const DashboardContainer = styled.div`
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ChartSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
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

const AddButton = styled.button`
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${props => props.theme.border};
    border-top: 4px solid ${props => props.theme.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Dashboard = () => {
  const { theme } = useTheme();
  const { marketData, marketOverview, loading, getWatchlistData } = useData();
  const { settings } = useNotifications();
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const watchlistData = getWatchlistData();

  useEffect(() => {
    // Set default crypto if available
    if (marketData.length > 0 && !marketData.find(coin => coin.id === selectedCrypto)) {
      setSelectedCrypto(marketData[0].id);
    }
  }, [marketData, selectedCrypto]);

  const formatCurrency = (value) => {
    return formatCompactCurrency(value, settings.currency || 'USD');
  };

  const overviewCards = [
    {
      title: 'Total Market Cap',
      value: formatCurrency(marketOverview.totalMarketCap),
      change: '+2.34%',
      icon: DollarSign,
      color: theme.success,
    },
    {
      title: '24h Volume',
      value: formatCurrency(marketOverview.totalVolume24h),
      change: '+5.67%',
      icon: BarChart3,
      color: theme.info,
    },
    {
      title: 'BTC Dominance',
      value: `${marketOverview.btcDominance.toFixed(1)}%`,
      change: '-0.12%',
      icon: Activity,
      color: theme.warning,
    },
    {
      title: 'Active Coins',
      value: marketOverview.activeCoins.toLocaleString(),
      change: '+12',
      icon: TrendingUp,
      color: theme.primary,
    },
  ];

  if (loading && marketData.length === 0) {
    return (
      <DashboardContainer>
        <LoadingSpinner theme={theme}>
          <div className="spinner" />
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle theme={theme}>Market Overview</PageTitle>
        <PageSubtitle theme={theme}>
          Real-time cryptocurrency market data and insights
        </PageSubtitle>
      </PageHeader>

      <GridContainer>
        {overviewCards.map((card, index) => (
          <MarketOverviewCard
            key={card.title}
            {...card}
            index={index}
          />
        ))}
      </GridContainer>

      <ChartSection>
        <Card
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CardHeader>
            <CardTitle theme={theme}>
              <BarChart3 />
              Price Chart
            </CardTitle>
          </CardHeader>
          <CryptoChart 
            coinId={selectedCrypto}
            onCoinChange={setSelectedCrypto}
          />
        </Card>

        <Card
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CardHeader>
            <CardTitle theme={theme}>
              <Eye />
              Watchlist
            </CardTitle>
            <AddButton theme={theme}>
              <Plus />
            </AddButton>
          </CardHeader>
          <WatchlistWidget data={watchlistData} />
        </Card>
      </ChartSection>

      <BottomSection>
        <Card
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CardHeader>
            <CardTitle theme={theme}>
              <TrendingUp />
              Trending Coins
            </CardTitle>
          </CardHeader>
          <TrendingCoins data={marketData.slice(0, 5)} />
        </Card>

        <Card
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <CardHeader>
            <CardTitle theme={theme}>
              <Activity />
              Market Heatmap
            </CardTitle>
          </CardHeader>
          <MarketHeatmap data={marketData.slice(0, 20)} />
        </Card>
      </BottomSection>
    </DashboardContainer>
  );
};

export default Dashboard;