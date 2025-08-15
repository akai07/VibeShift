import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit3,
  Trash2,
  PieChart,
  BarChart3,
  DollarSign,
  Target,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatCurrency, formatPercent } from '../../utils/currency';
import PortfolioOverview from './PortfolioOverview';
import HoldingsTable from './HoldingsTable';
import AddHoldingModal from './AddHoldingModal';
import PortfolioChart from './PortfolioChart';

const PortfolioContainer = styled.div`
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
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PortfolioStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${props => {
    if (props.type === 'positive') return props.theme.success;
    if (props.type === 'negative') return props.theme.error;
    return props.theme.text;
  }};
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.primary ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  padding: 10px 16px;
  color: ${props => props.primary ? 'white' : props.theme.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: ${props => props.primary ? props.theme.primaryDark : props.theme.glassEffect};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const PortfolioContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: ${props => props.theme.textMuted};
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  
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
    margin: 0 0 20px 0;
    font-size: 14px;
  }
`;

const EmptyActionButton = styled.button`
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-1px);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Portfolio = () => {
  const { theme } = useTheme();
  const { marketData, loading } = useData();
  const { settings } = useNotifications();
  const [holdings, setHoldings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalChange24h: 0,
    totalChangePercent: 0
  });
  const [refreshing, setRefreshing] = useState(false);

  // Initialize with some sample holdings
  useEffect(() => {
    const sampleHoldings = [
      {
        id: 1,
        coinId: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.5,
        avgBuyPrice: 35000,
        currentPrice: 43000,
        dateAdded: new Date('2024-01-15')
      },
      {
        id: 2,
        coinId: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 2.5,
        avgBuyPrice: 2200,
        currentPrice: 2650,
        dateAdded: new Date('2024-01-20')
      },
      {
        id: 3,
        coinId: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        amount: 1000,
        avgBuyPrice: 0.45,
        currentPrice: 0.52,
        dateAdded: new Date('2024-02-01')
      }
    ];
    
    setHoldings(sampleHoldings);
  }, []);

  // Calculate portfolio statistics
  useEffect(() => {
    if (holdings.length === 0) {
      setPortfolioStats({
        totalValue: 0,
        totalChange24h: 0,
        totalChangePercent: 0
      });
      return;
    }

    let totalValue = 0;
    let totalInvested = 0;

    holdings.forEach(holding => {
      const currentValue = holding.amount * holding.currentPrice;
      const investedValue = holding.amount * holding.avgBuyPrice;
      
      totalValue += currentValue;
      totalInvested += investedValue;
    });

    const totalChange24h = totalValue - totalInvested;
    const totalChangePercent = totalInvested > 0 ? (totalChange24h / totalInvested) * 100 : 0;

    setPortfolioStats({
      totalValue,
      totalChange24h,
      totalChangePercent
    });
  }, [holdings]);

  const handleAddHolding = (newHolding) => {
    const holding = {
      ...newHolding,
      id: Date.now(),
      dateAdded: new Date()
    };
    
    setHoldings(prev => [...prev, holding]);
    setShowAddModal(false);
  };

  const handleEditHolding = (holdingId, updatedHolding) => {
    setHoldings(prev => prev.map(holding => 
      holding.id === holdingId ? { ...holding, ...updatedHolding } : holding
    ));
  };

  const handleDeleteHolding = (holdingId) => {
    setHoldings(prev => prev.filter(holding => holding.id !== holdingId));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Simulate price updates
    setTimeout(() => {
      setHoldings(prev => prev.map(holding => ({
        ...holding,
        currentPrice: holding.currentPrice * (0.95 + Math.random() * 0.1) // ±5% price change
      })));
      setRefreshing(false);
    }, 1500);
  };

  const formatCurrencyValue = (value) => {
    return formatCurrency(value, settings.currency || 'USD');
  };

  if (holdings.length === 0) {
    return (
      <PortfolioContainer>
        <PageHeader>
          <PageTitle theme={theme}>
            <Wallet />
            Portfolio
          </PageTitle>
          <PageSubtitle theme={theme}>
            Track and manage your cryptocurrency investments
          </PageSubtitle>
        </PageHeader>

        <EmptyState theme={theme}>
          <Wallet />
          <h3>Your portfolio is empty</h3>
          <p>Start building your crypto portfolio by adding your first holding</p>
          <EmptyActionButton theme={theme} onClick={() => setShowAddModal(true)}>
            <Plus />
            Add First Holding
          </EmptyActionButton>
        </EmptyState>

        {showAddModal && (
          <AddHoldingModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddHolding}
            availableCoins={marketData}
          />
        )}
      </PortfolioContainer>
    );
  }

  return (
    <PortfolioContainer>
      <PageHeader>
        <PageTitle theme={theme}>
          <Wallet />
          Portfolio
        </PageTitle>
        <PageSubtitle theme={theme}>
          Track and manage your cryptocurrency investments
        </PageSubtitle>
      </PageHeader>

      <ControlsSection>
        <PortfolioStats>
          <StatItem>
            <StatLabel theme={theme}>Total Value</StatLabel>
            <StatValue theme={theme}>
              {formatCurrencyValue(portfolioStats.totalValue)}
            </StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel theme={theme}>24h Change</StatLabel>
            <StatValue 
              theme={theme} 
              type={portfolioStats.totalChange24h >= 0 ? 'positive' : 'negative'}
            >
              {portfolioStats.totalChange24h >= 0 ? <TrendingUp /> : <TrendingDown />}
              {formatCurrencyValue(Math.abs(portfolioStats.totalChange24h))}
            </StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel theme={theme}>Total Return</StatLabel>
            <StatValue 
              theme={theme} 
              type={portfolioStats.totalChangePercent >= 0 ? 'positive' : 'negative'}
            >
              {formatPercent(portfolioStats.totalChangePercent)}
            </StatValue>
          </StatItem>
        </PortfolioStats>
        
        <ActionButtons>
          <ActionButton
            theme={theme}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </ActionButton>
          
          <ActionButton
            theme={theme}
            primary
            onClick={() => setShowAddModal(true)}
          >
            <Plus />
            Add Holding
          </ActionButton>
        </ActionButtons>
      </ControlsSection>

      <MainGrid>
        <PortfolioContent>
          <PortfolioOverview 
            holdings={holdings}
            totalValue={portfolioStats.totalValue}
          />
          
          <HoldingsTable
            holdings={holdings}
            onEdit={handleEditHolding}
            onDelete={handleDeleteHolding}
          />
        </PortfolioContent>
        
        <SidePanel>
          <PortfolioChart holdings={holdings} />
        </SidePanel>
      </MainGrid>

      {showAddModal && (
        <AddHoldingModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddHolding}
          availableCoins={marketData}
        />
      )}
    </PortfolioContainer>
  );
};

export default Portfolio;