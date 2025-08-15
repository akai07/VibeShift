import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Edit3,
  Trash2,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ArrowUpDown,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/currency';

const TableContainer = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const TableTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const SortButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 6px 12px;
  color: ${props => props.theme.text};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: ${props => props.theme.glassEffect};
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const Table = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 80px;
  gap: 16px;
  padding: 16px 24px;
  background: ${props => props.theme.background};
  border-bottom: 1px solid ${props => props.theme.border};
  
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr 80px;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const TableHeadCell = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    color: ${props => props.sortable ? props.theme.text : props.theme.textMuted};
  }
  
  svg {
    width: 12px;
    height: 12px;
    opacity: 0.5;
  }
`;

const TableBody = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 80px;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.glassEffect};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr 80px;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const CoinCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CoinIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 700;
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

const TableCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

const CellValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => {
    if (props.type === 'positive') return props.theme.success;
    if (props.type === 'negative') return props.theme.error;
    return props.theme.text;
  }};
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const CellSubValue = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textMuted};
`;

const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ActionsButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 4px;
  color: ${props => props.theme.textMuted};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.glassEffect};
    color: ${props => props.theme.text};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActionsMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 120px;
`;

const ActionMenuItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  color: ${props => props.danger ? props.theme.error : props.theme.text};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.danger ? props.theme.error + '20' : props.theme.glassEffect};
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
    margin-bottom: 12px;
    opacity: 0.5;
  }
  
  h4 {
    margin: 0 0 8px 0;
    color: ${props => props.theme.text};
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const HoldingsTable = ({ holdings, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const { getCoinData } = useData();
  const { settings } = useNotifications();
  const [sortBy, setSortBy] = useState('value');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeMenu, setActiveMenu] = useState(null);
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  const sortedHoldings = [...holdings].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'price':
        aValue = a.currentPrice;
        bValue = b.currentPrice;
        break;
      case 'value':
        aValue = a.amount * a.currentPrice;
        bValue = b.amount * b.currentPrice;
        break;
      case 'change':
        aValue = ((a.currentPrice - a.avgBuyPrice) / a.avgBuyPrice) * 100;
        bValue = ((b.currentPrice - b.avgBuyPrice) / b.avgBuyPrice) * 100;
        break;
      case 'date':
        aValue = new Date(a.dateAdded);
        bValue = new Date(b.dateAdded);
        break;
      default:
        aValue = a.amount * a.currentPrice;
        bValue = b.amount * b.currentPrice;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const formatCurrencyValue = (value) => {
    return formatCurrency(value, settings.currency || 'USD');
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleMenuToggle = (holdingId) => {
    setActiveMenu(activeMenu === holdingId ? null : holdingId);
  };
  
  const handleEdit = (holding) => {
    onEdit(holding.id, holding);
    setActiveMenu(null);
  };
  
  const handleDelete = (holdingId) => {
    onDelete(holdingId);
    setActiveMenu(null);
  };
  
  if (holdings.length === 0) {
    return (
      <TableContainer
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TableHeader>
          <TableTitle theme={theme}>Holdings</TableTitle>
        </TableHeader>
        
        <EmptyState theme={theme}>
          <DollarSign />
          <h4>No holdings found</h4>
          <p>Add your first cryptocurrency holding to get started</p>
        </EmptyState>
      </TableContainer>
    );
  }
  
  return (
    <TableContainer
      theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TableHeader>
        <TableTitle theme={theme}>Holdings ({holdings.length})</TableTitle>
        <SortButton theme={theme} onClick={() => handleSort('value')}>
          <ArrowUpDown />
          Sort by Value
        </SortButton>
      </TableHeader>
      
      <Table>
        <TableHead theme={theme}>
          <TableHeadCell 
            theme={theme} 
            sortable 
            onClick={() => handleSort('name')}
          >
            Asset
            <ArrowUpDown />
          </TableHeadCell>
          
          <TableHeadCell 
            theme={theme} 
            sortable 
            onClick={() => handleSort('amount')}
          >
            Amount
            <ArrowUpDown />
          </TableHeadCell>
          
          <TableHeadCell 
            theme={theme} 
            sortable 
            onClick={() => handleSort('price')}
          >
            Price
            <ArrowUpDown />
          </TableHeadCell>
          
          <TableHeadCell 
            theme={theme} 
            sortable 
            onClick={() => handleSort('value')}
            className="hide-mobile"
          >
            Value
            <ArrowUpDown />
          </TableHeadCell>
          
          <TableHeadCell 
            theme={theme} 
            sortable 
            onClick={() => handleSort('change')}
            className="hide-mobile"
          >
            P&L
            <ArrowUpDown />
          </TableHeadCell>
          
          <TableHeadCell 
            theme={theme} 
            sortable 
            onClick={() => handleSort('date')}
            className="hide-mobile"
          >
            Date Added
            <ArrowUpDown />
          </TableHeadCell>
          
          <TableHeadCell theme={theme}>
            Actions
          </TableHeadCell>
        </TableHead>
        
        <TableBody>
          {sortedHoldings.map((holding, index) => {
            const currentValue = holding.amount * holding.currentPrice;
            const investedValue = holding.amount * holding.avgBuyPrice;
            const gainLoss = currentValue - investedValue;
            const gainLossPercent = ((holding.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;
            
            return (
              <TableRow
                key={holding.id}
                theme={theme}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CoinCell>
                  <CoinIcon theme={theme}>
                    {holding.symbol.charAt(0)}
                  </CoinIcon>
                  <CoinInfo>
                    <CoinName theme={theme}>{holding.name}</CoinName>
                    <CoinSymbol theme={theme}>{holding.symbol}</CoinSymbol>
                  </CoinInfo>
                </CoinCell>
                
                <TableCell>
                  <CellValue theme={theme}>
                    {formatNumber(holding.amount)}
                  </CellValue>
                  <CellSubValue theme={theme}>
                    {holding.symbol}
                  </CellSubValue>
                </TableCell>
                
                <TableCell>
                  <CellValue theme={theme}>
                    {formatCurrencyValue(holding.currentPrice)}
                  </CellValue>
                  <CellSubValue theme={theme}>
                    Avg: {formatCurrencyValue(holding.avgBuyPrice)}
                  </CellSubValue>
                </TableCell>
                
                <TableCell className="hide-mobile">
                  <CellValue theme={theme}>
                    {formatCurrencyValue(currentValue)}
                  </CellValue>
                  <CellSubValue theme={theme}>
                    Invested: {formatCurrencyValue(investedValue)}
                  </CellSubValue>
                </TableCell>
                
                <TableCell className="hide-mobile">
                  <CellValue 
                    theme={theme}
                    type={gainLoss >= 0 ? 'positive' : 'negative'}
                  >
                    {gainLoss >= 0 ? <TrendingUp /> : <TrendingDown />}
                    {formatCurrencyValue(Math.abs(gainLoss))}
                  </CellValue>
                  <CellSubValue theme={theme}>
                    {formatPercent(gainLossPercent)}
                  </CellSubValue>
                </TableCell>
                
                <TableCell className="hide-mobile">
                  <CellValue theme={theme}>
                    {formatDate(holding.dateAdded)}
                  </CellValue>
                </TableCell>
                
                <ActionsCell>
                  <ActionsButton 
                    theme={theme}
                    onClick={() => handleMenuToggle(holding.id)}
                  >
                    <MoreVertical />
                  </ActionsButton>
                  
                  {activeMenu === holding.id && (
                    <ActionsMenu
                      theme={theme}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <ActionMenuItem 
                        theme={theme}
                        onClick={() => handleEdit(holding)}
                      >
                        <Edit3 />
                        Edit
                      </ActionMenuItem>
                      
                      <ActionMenuItem 
                        theme={theme}
                        danger
                        onClick={() => handleDelete(holding.id)}
                      >
                        <Trash2 />
                        Delete
                      </ActionMenuItem>
                    </ActionsMenu>
                  )}
                </ActionsCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HoldingsTable;