import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartContainer = styled.div`
  height: 400px;
  position: relative;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const CoinSelector = styled.select`
  background: ${props => props.theme.background};
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

const TimeframeButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const TimeframeButton = styled.button`
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  padding: 6px 12px;
  color: ${props => props.active ? 'white' : props.theme.text};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.glassEffect};
  }
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const CurrentPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const PriceChange = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.isPositive ? props.theme.success : props.theme.error};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${props => props.theme.textMuted};
`;

const timeframes = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
];

const CryptoChart = ({ coinId, onCoinChange }) => {
  const { theme } = useTheme();
  const { marketData, getCoinData } = useData();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [chartData, setChartData] = useState(null);
  
  const selectedCoin = getCoinData(coinId);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.surface,
        titleColor: theme.text,
        bodyColor: theme.text,
        borderColor: theme.border,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].label);
            return format(date, 'MMM dd, yyyy HH:mm');
          },
          label: (context) => {
            return `Price: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: theme.border,
          drawBorder: false,
        },
        ticks: {
          color: theme.textMuted,
          maxTicksLimit: 6,
          callback: function(value, index) {
            const date = new Date(this.getLabelForValue(value));
            return format(date, 'MMM dd');
          },
        },
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: theme.border,
          drawBorder: false,
        },
        ticks: {
          color: theme.textMuted,
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      },
      line: {
        tension: 0.1,
      },
    },
  }), [theme]);

  useEffect(() => {
    if (selectedCoin && selectedCoin.priceHistory) {
      const data = {
        labels: selectedCoin.priceHistory.map(point => point.date),
        datasets: [
          {
            label: 'Price',
            data: selectedCoin.priceHistory.map(point => point.price),
            borderColor: theme.primary,
            backgroundColor: `${theme.primary}20`,
            fill: true,
            borderWidth: 2,
          },
        ],
      };
      setChartData(data);
    }
  }, [selectedCoin, selectedTimeframe, theme]);

  if (!selectedCoin) {
    return (
      <LoadingContainer theme={theme}>
        No data available for selected cryptocurrency
      </LoadingContainer>
    );
  }

  const priceChange = selectedCoin.change24h;
  const isPositive = priceChange >= 0;

  return (
    <div>
      <ChartHeader>
        <CoinSelector 
          theme={theme}
          value={coinId}
          onChange={(e) => onCoinChange(e.target.value)}
        >
          {marketData.map(coin => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </CoinSelector>
        
        <TimeframeButtons>
          {timeframes.map(tf => (
            <TimeframeButton
              key={tf.value}
              theme={theme}
              active={selectedTimeframe === tf.value}
              onClick={() => setSelectedTimeframe(tf.value)}
            >
              {tf.label}
            </TimeframeButton>
          ))}
        </TimeframeButtons>
      </ChartHeader>
      
      <PriceInfo>
        <CurrentPrice theme={theme}>
          ${selectedCoin.price.toLocaleString()}
        </CurrentPrice>
        <PriceChange theme={theme} isPositive={isPositive}>
          {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
        </PriceChange>
      </PriceInfo>
      
      <ChartContainer>
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <LoadingContainer theme={theme}>
            Loading chart data...
          </LoadingContainer>
        )}
      </ChartContainer>
    </div>
  );
};

export default CryptoChart;