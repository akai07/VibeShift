import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Target,
  BarChart3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatCurrency, formatPercent } from '../../utils/currency';

const OverviewContainer = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
`;

const OverviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const OverviewTitle = styled.h3`
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

const AllocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AllocationChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

const PieSlice = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.segments.map((segment, index) => 
      `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`
    ).join(', ')}
  );
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    background: ${props => props.theme.surface};
    border-radius: 50%;
  }
`;

const ChartCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
`;

const CenterValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const CenterLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  margin-top: 2px;
`;

const AllocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AllocationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.glassEffect};
    transform: translateY(-1px);
  }
`;

const AllocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ColorIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const CoinInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CoinName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const CoinSymbol = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
`;

const AllocationStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const AllocationValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const AllocationPercent = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.border};
`;

const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  text-align: center;
`;

const MetricIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.theme.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.primary};
  }
`;

const MetricValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => {
    if (props.type === 'positive') return props.theme.success;
    if (props.type === 'negative') return props.theme.error;
    return props.theme.text;
  }};
  margin-bottom: 4px;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PortfolioOverview = () => {
  const { theme } = useTheme();
  const { portfolioData, getPortfolioStats } = useData();
  const { settings } = useNotifications();
  
  const holdings = portfolioData?.holdings || [];
  const totalValue = portfolioData?.totalValue || 0;
  
  // Generate colors for pie chart
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  
  // Calculate allocation data
  const allocationData = holdings.map((holding, index) => {
    const value = holding.amount * holding.currentPrice;
    const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
    
    return {
      ...holding,
      value,
      percentage,
      color: colors[index % colors.length]
    };
  }).sort((a, b) => b.value - a.value);
  
  // Create pie chart segments
  let currentAngle = 0;
  const segments = allocationData.map(item => {
    const angle = (item.percentage / 100) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });
  
  // Calculate portfolio metrics
  const totalInvested = holdings.reduce((sum, holding) => 
    sum + (holding.amount * holding.avgBuyPrice), 0
  );
  
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
  
  const bestPerformer = allocationData.reduce((best, current) => {
    const currentGain = ((current.currentPrice - current.avgBuyPrice) / current.avgBuyPrice) * 100;
    const bestGain = ((best.currentPrice - best.avgBuyPrice) / best.avgBuyPrice) * 100;
    return currentGain > bestGain ? current : best;
  }, allocationData[0]);
  
  const worstPerformer = allocationData.reduce((worst, current) => {
    const currentGain = ((current.currentPrice - current.avgBuyPrice) / current.avgBuyPrice) * 100;
    const worstGain = ((worst.currentPrice - worst.avgBuyPrice) / worst.avgBuyPrice) * 100;
    return currentGain < worstGain ? current : worst;
  }, allocationData[0]);
  
  const formatCurrencyValue = (value) => {
    return formatCurrency(value, settings.currency || 'USD');
  };
  
  return (
    <OverviewContainer
      theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <OverviewHeader>
        <OverviewTitle theme={theme}>
          <PieChart />
          Portfolio Allocation
        </OverviewTitle>
      </OverviewHeader>
      
      <AllocationGrid>
        <AllocationChart>
          <ChartContainer>
            <PieSlice theme={theme} segments={segments} />
            <ChartCenter>
              <CenterValue theme={theme}>
                {holdings.length}
              </CenterValue>
              <CenterLabel theme={theme}>
                Assets
              </CenterLabel>
            </ChartCenter>
          </ChartContainer>
        </AllocationChart>
        
        <AllocationList>
          {allocationData.slice(0, 5).map((item, index) => (
            <AllocationItem key={item.id} theme={theme}>
              <AllocationInfo>
                <ColorIndicator color={item.color} />
                <CoinInfo>
                  <CoinName theme={theme}>{item.name}</CoinName>
                  <CoinSymbol theme={theme}>{item.symbol}</CoinSymbol>
                </CoinInfo>
              </AllocationInfo>
              
              <AllocationStats>
                <AllocationValue theme={theme}>
                  {formatCurrencyValue(item.value)}
                </AllocationValue>
                <AllocationPercent theme={theme}>
                  {item.percentage.toFixed(1)}%
                </AllocationPercent>
              </AllocationStats>
            </AllocationItem>
          ))}
          
          {allocationData.length > 5 && (
            <AllocationItem theme={theme}>
              <AllocationInfo>
                <ColorIndicator color="#6B7280" />
                <CoinInfo>
                  <CoinName theme={theme}>Others</CoinName>
                  <CoinSymbol theme={theme}>
                    {allocationData.length - 5} more
                  </CoinSymbol>
                </CoinInfo>
              </AllocationInfo>
              
              <AllocationStats>
                <AllocationValue theme={theme}>
                  {formatCurrencyValue(
                    allocationData.slice(5).reduce((sum, item) => sum + item.value, 0)
                  )}
                </AllocationValue>
                <AllocationPercent theme={theme}>
                  {allocationData.slice(5).reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
                </AllocationPercent>
              </AllocationStats>
            </AllocationItem>
          )}
        </AllocationList>
      </AllocationGrid>
      
      <MetricsGrid>
        <MetricCard theme={theme}>
          <MetricIcon theme={theme}>
            <DollarSign />
          </MetricIcon>
          <MetricValue 
            theme={theme}
            type={totalGainLoss >= 0 ? 'positive' : 'negative'}
          >
            {formatCurrencyValue(Math.abs(totalGainLoss))}
          </MetricValue>
          <MetricLabel theme={theme}>
            {totalGainLoss >= 0 ? 'Total Gain' : 'Total Loss'}
          </MetricLabel>
        </MetricCard>
        
        <MetricCard theme={theme}>
          <MetricIcon theme={theme}>
            <Percent />
          </MetricIcon>
          <MetricValue 
            theme={theme}
            type={totalGainLossPercent >= 0 ? 'positive' : 'negative'}
          >
            {formatPercent(totalGainLossPercent)}
          </MetricValue>
          <MetricLabel theme={theme}>
            Total Return
          </MetricLabel>
        </MetricCard>
        
        <MetricCard theme={theme}>
          <MetricIcon theme={theme}>
            <TrendingUp />
          </MetricIcon>
          <MetricValue theme={theme} type="positive">
            {bestPerformer?.symbol || 'N/A'}
          </MetricValue>
          <MetricLabel theme={theme}>
            Best Performer
          </MetricLabel>
        </MetricCard>
        
        <MetricCard theme={theme}>
          <MetricIcon theme={theme}>
            <TrendingDown />
          </MetricIcon>
          <MetricValue theme={theme} type="negative">
            {worstPerformer?.symbol || 'N/A'}
          </MetricValue>
          <MetricLabel theme={theme}>
            Worst Performer
          </MetricLabel>
        </MetricCard>
      </MetricsGrid>
    </OverviewContainer>
  );
};

export default PortfolioOverview;