import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  Star,
  StarOff,
  Eye,
  Calendar,
  DollarSign,
  BarChart3,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import NewCoinCard from './NewCoinCard';
import CoinAnalysis from './CoinAnalysis';

const NewCoinsContainer = styled.div`
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

const SearchAndFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 10px 12px 10px 40px;
  color: ${props => props.theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.textMuted};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textMuted};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const FilterSelect = styled.select`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 10px 12px;
  color: ${props => props.theme.text};
  font-size: 14px;
  cursor: pointer;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  option {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CoinsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
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

const NewCoins = () => {
  const { theme } = useTheme();
  const { marketData, loading, refreshData } = useData();
  const { sendNewListingAlert } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Generate new coins data (simulate new listings)
  const [newCoins, setNewCoins] = useState([]);

  useEffect(() => {
    const generateNewCoins = () => {
      const coinNames = [
        'MetaVerse Token', 'DeFi Protocol', 'Green Energy Coin', 'AI Network',
        'Gaming Token', 'Social Media Coin', 'Privacy Token', 'Oracle Network',
        'Cross-Chain Bridge', 'NFT Marketplace', 'Yield Farming', 'Prediction Market'
      ];
      
      const symbols = [
        'META', 'DEFI', 'GREEN', 'AINE', 'GAME', 'SOCIAL', 'PRIV', 'ORACLE',
        'BRIDGE', 'NFTM', 'YIELD', 'PRED'
      ];
      
      return Array.from({ length: 12 }, (_, index) => {
        const price = Math.random() * 10 + 0.1;
        const change24h = (Math.random() - 0.5) * 200;
        const volume = Math.random() * 1000000 + 50000;
        const marketCap = price * (Math.random() * 10000000 + 1000000);
        const launchDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        return {
          id: `new-coin-${index}`,
          name: coinNames[index],
          symbol: symbols[index],
          price,
          change24h,
          volume,
          marketCap,
          launchDate,
          isNew: true,
          riskScore: Math.floor(Math.random() * 10) + 1,
          potentialScore: Math.floor(Math.random() * 10) + 1,
          liquidityScore: Math.floor(Math.random() * 10) + 1,
          communityScore: Math.floor(Math.random() * 10) + 1,
          isWatched: false
        };
      });
    };

    setNewCoins(generateNewCoins());
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    // Simulate new coin discovery
    setTimeout(() => {
      const newCoin = {
        id: `new-coin-${Date.now()}`,
        name: 'Latest Discovery',
        symbol: 'LATEST',
        price: Math.random() * 5 + 0.1,
        change24h: (Math.random() - 0.5) * 100,
        volume: Math.random() * 500000 + 25000,
        marketCap: 0,
        launchDate: new Date(),
        isNew: true,
        riskScore: Math.floor(Math.random() * 10) + 1,
        potentialScore: Math.floor(Math.random() * 10) + 1,
        liquidityScore: Math.floor(Math.random() * 10) + 1,
        communityScore: Math.floor(Math.random() * 10) + 1,
        isWatched: false
      };
      
      setNewCoins(prev => [newCoin, ...prev]);
      sendNewListingAlert(newCoin.name, newCoin.symbol);
      setRefreshing(false);
    }, 2000);
  };

  const handleToggleWatch = (coinId) => {
    setNewCoins(prev => prev.map(coin => 
      coin.id === coinId ? { ...coin, isWatched: !coin.isWatched } : coin
    ));
  };

  const filteredCoins = newCoins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterBy) {
      case 'high-potential':
        return coin.potentialScore >= 7;
      case 'low-risk':
        return coin.riskScore <= 4;
      case 'high-volume':
        return coin.volume > 500000;
      case 'watched':
        return coin.isWatched;
      default:
        return true;
    }
  });

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.launchDate) - new Date(a.launchDate);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'volume':
        return b.volume - a.volume;
      case 'potential':
        return b.potentialScore - a.potentialScore;
      default:
        return 0;
    }
  });

  const stats = {
    total: newCoins.length,
    today: newCoins.filter(coin => {
      const today = new Date();
      const coinDate = new Date(coin.launchDate);
      return coinDate.toDateString() === today.toDateString();
    }).length,
    highPotential: newCoins.filter(coin => coin.potentialScore >= 7).length,
    watched: newCoins.filter(coin => coin.isWatched).length
  };

  if (loading && newCoins.length === 0) {
    return (
      <NewCoinsContainer>
        <LoadingState theme={theme}>
          <RefreshCw />
          Loading new coin listings...
        </LoadingState>
      </NewCoinsContainer>
    );
  }

  return (
    <NewCoinsContainer>
      <PageHeader>
        <PageTitle theme={theme}>
          <Sparkles />
          New Coin Listings
        </PageTitle>
        <PageSubtitle theme={theme}>
          Discover and analyze newly launched cryptocurrencies with comprehensive risk assessment
        </PageSubtitle>
      </PageHeader>

      <ControlsSection>
        <SearchAndFilter>
          <SearchBox>
            <SearchIcon theme={theme}>
              <Search />
            </SearchIcon>
            <SearchInput
              theme={theme}
              placeholder="Search new coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          
          <FilterSelect
            theme={theme}
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Coins</option>
            <option value="high-potential">High Potential</option>
            <option value="low-risk">Low Risk</option>
            <option value="high-volume">High Volume</option>
            <option value="watched">Watched</option>
          </FilterSelect>
          
          <FilterSelect
            theme={theme}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="volume">Volume: High to Low</option>
            <option value="potential">Potential Score</option>
          </FilterSelect>
        </SearchAndFilter>
        
        <ActionButtons>
          <ActionButton
            theme={theme}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Scanning...' : 'Scan New'}
          </ActionButton>
        </ActionButtons>
      </ControlsSection>

      <StatsBar>
        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue theme={theme}>{stats.total}</StatValue>
          <StatLabel theme={theme}>Total New Coins</StatLabel>
        </StatCard>
        
        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue theme={theme}>{stats.today}</StatValue>
          <StatLabel theme={theme}>Launched Today</StatLabel>
        </StatCard>
        
        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue theme={theme}>{stats.highPotential}</StatValue>
          <StatLabel theme={theme}>High Potential</StatLabel>
        </StatCard>
        
        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue theme={theme}>{stats.watched}</StatValue>
          <StatLabel theme={theme}>Watching</StatLabel>
        </StatCard>
      </StatsBar>

      {sortedCoins.length === 0 ? (
        <EmptyState theme={theme}>
          <Search />
          <h3>No coins found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </EmptyState>
      ) : (
        <CoinsGrid>
          {sortedCoins.map((coin, index) => (
            <NewCoinCard
              key={coin.id}
              coin={coin}
              index={index}
              onToggleWatch={() => handleToggleWatch(coin.id)}
              onAnalyze={() => setSelectedCoin(coin)}
            />
          ))}
        </CoinsGrid>
      )}

      {selectedCoin && (
        <CoinAnalysis
          coin={selectedCoin}
          onClose={() => setSelectedCoin(null)}
        />
      )}
    </NewCoinsContainer>
  );
};

export default NewCoins;