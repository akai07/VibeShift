import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatCurrency, formatPercent } from '../../utils/currency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartContainer = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  height: fit-content;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
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

const ChartControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeframeButton = styled.button`
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  padding: 6px 12px;
  color: ${props => props.active ? 'white' : props.theme.text};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primaryDark : props.theme.glassEffect};
  }
`;

const ChartTypeButton = styled.button`
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  padding: 6px;
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    background: ${props => props.active ? props.theme.primaryDark : props.theme.glassEffect};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ChartWrapper = styled.div`
  height: 300px;
  margin-bottom: 24px;
  
  canvas {
    max-height: 100% !important;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.border};
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  text-align: center;
`;

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => {
    if (props.type === 'positive') return props.theme.success + '20';
    if (props.type === 'negative') return props.theme.error + '20';
    return props.theme.primary + '20';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => {
      if (props.type === 'positive') return props.theme.success;
      if (props.type === 'negative') return props.theme.error;
      return props.theme.primary;
    }};
  }
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => {
    if (props.type === 'positive') return props.theme.success;
    if (props.type === 'negative') return props.theme.error;
    return props.theme.text;
  }};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AllocationSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.border};
`;

const AllocationTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AllocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AllocationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const AllocationCoin = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AllocationIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 700;
`;

const AllocationName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const AllocationPercent = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.textMuted};
`;

const PortfolioChart = ({ holdings }) => {
  const { theme } = useTheme();
  const { portfolioData, getPortfolioStats } = useData();
  const { settings } = useNotifications();
  const [timeframe, setTimeframe] = useState('7d');
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState(null);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalChange: 0,
    totalChangePercent: 0,
    bestPerformer: null,
    worstPerformer: null
  });
  
  const timeframes = [
    { key: '24h', label: '24H' },
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D' }
  ];
  
  // Generate mock historical data
  useEffect(() => {
    const generateHistoricalData = () => {
      const days = {
        '24h': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90
      }[timeframe];
      
      const dataPoints = days === 1 ? 24 : days;
      const labels = [];
      const values = [];
      
      const currentValue = holdings.reduce((sum, holding) => 
        sum + (holding.amount * holding.currentPrice), 0
      );
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        let label;
        if (days === 1) {
          const hour = new Date();
          hour.setHours(hour.getHours() - i);
          label = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
          const date = new Date();
          date.setDate(date.getDate() - i);
          label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        labels.push(label);
        
        // Generate realistic price movement
        const volatility = 0.05; // 5% daily volatility
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const dayValue = currentValue * (1 + randomChange * (i / dataPoints));
        values.push(dayValue);
      }
      
      return { labels, values };
    };
    
    const { labels, values } = generateHistoricalData();
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data: values,
          borderColor: theme.primary,
          backgroundColor: chartType === 'line' 
            ? `${theme.primary}20`
            : theme.primary,
          borderWidth: 2,
          fill: chartType === 'line',
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: theme.primary,
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 2
        }
      ]
    };
    
    setChartData(data);
    
    // Calculate stats
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = lastValue - firstValue;
    const changePercent = firstValue > 0 ? (change / firstValue) * 100 : 0;
    
    // Calculate best and worst performers
    const performers = holdings.map(holding => {
      const gainLoss = ((holding.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;
      return { ...holding, gainLoss };
    });
    
    const bestPerformer = performers.reduce((best, current) => 
      current.gainLoss > best.gainLoss ? current : best, performers[0]
    );
    
    const worstPerformer = performers.reduce((worst, current) => 
      current.gainLoss < worst.gainLoss ? current : worst, performers[0]
    );
    
    setPortfolioStats({
      totalValue: lastValue,
      totalChange: change,
      totalChangePercent: changePercent,
      bestPerformer,
      worstPerformer
    });
  }, [holdings, timeframe, theme.primary, chartType]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
          label: function(context) {
            return `$${context.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.border,
          drawBorder: false
        },
        ticks: {
          color: theme.textMuted,
          font: {
            size: 11
          },
          maxTicksLimit: 6
        }
      },
      y: {
        grid: {
          color: theme.border,
          drawBorder: false
        },
        ticks: {
          color: theme.textMuted,
          font: {
            size: 11
          },
          callback: function(value) {
            return '$' + value.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };
  
  const formatCurrencyValue = (value) => {
    return formatCurrency(value, settings.currency || 'USD');
  };
  
  // Calculate allocation percentages
  const totalValue = holdings.reduce((sum, holding) => 
    sum + (holding.amount * holding.currentPrice), 0
  );
  
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
  ];
  
  const allocationData = holdings.map((holding, index) => {
    const value = holding.amount * holding.currentPrice;
    const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
    
    return {
      ...holding,
      value,
      percentage,
      color: colors[index % colors.length]
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5);
  
  if (!chartData) {
    return (
      <ChartContainer
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChartHeader>
          <ChartTitle theme={theme}>
            <BarChart3 />
            Portfolio Performance
          </ChartTitle>
        </ChartHeader>
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: theme.textMuted }}>Loading chart...</span>
        </div>
      </ChartContainer>
    );
  }
  
  return (
    <ChartContainer
      theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ChartHeader>
        <ChartTitle theme={theme}>
          <BarChart3 />
          Performance
        </ChartTitle>
        
        <ChartControls>
          {timeframes.map(tf => (
            <TimeframeButton
              key={tf.key}
              theme={theme}
              active={timeframe === tf.key}
              onClick={() => setTimeframe(tf.key)}
            >
              {tf.label}
            </TimeframeButton>
          ))}
        </ChartControls>
      </ChartHeader>
      
      <ChartWrapper>
        {chartType === 'line' ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </ChartWrapper>
      
      <StatsGrid>
        <StatCard theme={theme}>
          <StatIcon 
            theme={theme}
            type={portfolioStats.totalChange >= 0 ? 'positive' : 'negative'}
          >
            {portfolioStats.totalChange >= 0 ? <TrendingUp /> : <TrendingDown />}
          </StatIcon>
          <StatValue 
            theme={theme}
            type={portfolioStats.totalChange >= 0 ? 'positive' : 'negative'}
          >
            {formatCurrencyValue(Math.abs(portfolioStats.totalChange))}
          </StatValue>
          <StatLabel theme={theme}>
            {timeframe.toUpperCase()} Change
          </StatLabel>
        </StatCard>
        
        <StatCard theme={theme}>
          <StatIcon 
            theme={theme}
            type={portfolioStats.totalChangePercent >= 0 ? 'positive' : 'negative'}
          >
            <Percent />
          </StatIcon>
          <StatValue 
            theme={theme}
            type={portfolioStats.totalChangePercent >= 0 ? 'positive' : 'negative'}
          >
            {formatPercent(portfolioStats.totalChangePercent)}
          </StatValue>
          <StatLabel theme={theme}>
            Percentage Change
          </StatLabel>
        </StatCard>
      </StatsGrid>
      
      <AllocationSection>
        <AllocationTitle theme={theme}>Top Holdings</AllocationTitle>
        <AllocationList>
          {allocationData.map(item => (
            <AllocationItem key={item.id}>
              <AllocationCoin>
                <AllocationIcon color={item.color}>
                  {item.symbol.charAt(0)}
                </AllocationIcon>
                <AllocationName theme={theme}>
                  {item.symbol.toUpperCase()}
                </AllocationName>
              </AllocationCoin>
              <AllocationPercent theme={theme}>
                {item.percentage.toFixed(1)}%
              </AllocationPercent>
            </AllocationItem>
          ))}
        </AllocationList>
      </AllocationSection>
    </ChartContainer>
  );
};

export default PortfolioChart;