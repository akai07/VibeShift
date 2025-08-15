import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data for development - replace with real API calls
const generateMockData = () => {
  const cryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
    { id: 'polygon', symbol: 'MATIC', name: 'Polygon' },
    { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche' },
  ];

  return cryptos.map(crypto => {
    const basePrice = Math.random() * 50000 + 1000;
    const change24h = (Math.random() - 0.5) * 20;
    const volume = Math.random() * 1000000000;
    const marketCap = basePrice * (Math.random() * 1000000 + 100000);
    
    return {
      ...crypto,
      price: basePrice,
      change24h,
      volume24h: volume,
      marketCap,
      priceHistory: generatePriceHistory(basePrice),
      trendScore: Math.floor((Math.random() - 0.5) * 10),
      rsi: Math.random() * 100,
      macd: (Math.random() - 0.5) * 100,
      volume: volume,
      lastUpdated: new Date().toISOString(),
    };
  });
};

const generatePriceHistory = (basePrice) => {
  const history = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    currentPrice += (Math.random() - 0.5) * basePrice * 0.1;
    history.push({
      date: date.toISOString(),
      price: Math.max(currentPrice, 0),
      volume: Math.random() * 1000000000,
    });
  }
  
  return history;
};

export const DataProvider = ({ children }) => {
  const [marketData, setMarketData] = useState([]);
  const [marketOverview, setMarketOverview] = useState({
    totalMarketCap: 0,
    totalVolume24h: 0,
    btcDominance: 0,
    activeCoins: 0,
  });
  const [watchlist, setWatchlist] = useState(['bitcoin', 'ethereum', 'cardano']);
  const [newCoins, setNewCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Initialize with mock data
  useEffect(() => {
    const initializeData = () => {
      setLoading(true);
      try {
        const mockData = generateMockData();
        setMarketData(mockData);
        
        // Calculate market overview
        const totalMarketCap = mockData.reduce((sum, coin) => sum + coin.marketCap, 0);
        const totalVolume24h = mockData.reduce((sum, coin) => sum + coin.volume24h, 0);
        const btcData = mockData.find(coin => coin.id === 'bitcoin');
        const btcDominance = btcData ? (btcData.marketCap / totalMarketCap) * 100 : 0;
        
        setMarketOverview({
          totalMarketCap,
          totalVolume24h,
          btcDominance,
          activeCoins: mockData.length,
        });
        
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        setError('Failed to load market data');
        toast.error('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
    
    // Update data every 30 seconds
    const interval = setInterval(initializeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, this would make API calls to CoinDesk or other crypto APIs
      const mockData = generateMockData();
      setMarketData(mockData);
      
      const totalMarketCap = mockData.reduce((sum, coin) => sum + coin.marketCap, 0);
      const totalVolume24h = mockData.reduce((sum, coin) => sum + coin.volume24h, 0);
      const btcData = mockData.find(coin => coin.id === 'bitcoin');
      const btcDominance = btcData ? (btcData.marketCap / totalMarketCap) * 100 : 0;
      
      setMarketOverview({
        totalMarketCap,
        totalVolume24h,
        btcDominance,
        activeCoins: mockData.length,
      });
      
      setLastUpdate(new Date());
      setError(null);
      toast.success('Data refreshed successfully');
    } catch (err) {
      setError('Failed to refresh data');
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWatchlist = useCallback((coinId) => {
    if (!watchlist.includes(coinId)) {
      const newWatchlist = [...watchlist, coinId];
      setWatchlist(newWatchlist);
      localStorage.setItem('vibeshift-watchlist', JSON.stringify(newWatchlist));
      toast.success('Added to watchlist');
    }
  }, [watchlist]);

  const removeFromWatchlist = useCallback((coinId) => {
    const newWatchlist = watchlist.filter(id => id !== coinId);
    setWatchlist(newWatchlist);
    localStorage.setItem('vibeshift-watchlist', JSON.stringify(newWatchlist));
    toast.success('Removed from watchlist');
  }, [watchlist]);

  const getCoinData = useCallback((coinId) => {
    return marketData.find(coin => coin.id === coinId);
  }, [marketData]);

  const getWatchlistData = useCallback(() => {
    return marketData.filter(coin => watchlist.includes(coin.id));
  }, [marketData, watchlist]);

  const value = {
    marketData,
    marketOverview,
    watchlist,
    newCoins,
    loading,
    error,
    lastUpdate,
    refreshData,
    addToWatchlist,
    removeFromWatchlist,
    getCoinData,
    getWatchlistData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};