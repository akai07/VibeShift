import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  Search,
  Plus,
  DollarSign,
  Hash,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/currency';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ModalTitle = styled.h2`
  font-size: 20px;
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

const CloseButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 6px;
  color: ${props => props.theme.textMuted};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.glassEffect};
    color: ${props => props.theme.text};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 16px 0;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px 16px 12px 40px;
  color: ${props => props.theme.text};
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
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

const CoinList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
`;

const CoinItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:hover {
    background: ${props => props.theme.glassEffect};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.selected && `
    background: ${props.theme.primary}20;
    border-color: ${props.theme.primary};
  `}
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
  flex: 1;
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

const CoinPrice = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  ${props => props.fullWidth && `
    grid-column: 1 / -1;
  `}
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    width: 14px;
    height: 14px;
    color: ${props => props.theme.primary};
  }
`;

const FormInput = styled.input`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px 16px;
  color: ${props => props.theme.text};
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textMuted};
  }
  
  ${props => props.error && `
    border-color: ${props.theme.error};
  `}
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.error};
  font-size: 12px;
  margin-top: 4px;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const CalculatedValue = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const ValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 8px;
    border-top: 1px solid ${props => props.theme.border};
    font-weight: 600;
  }
`;

const ValueLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textMuted};
`;

const ValueAmount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid ${props => props.theme.border};
`;

const Button = styled.button`
  background: ${props => props.primary ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.primary ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  padding: 12px 24px;
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

const AddHoldingModal = ({ onClose, onAdd, availableCoins }) => {
  const { theme } = useTheme();
  const { settings } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    avgBuyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [filteredCoins, setFilteredCoins] = useState([]);
  
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = availableCoins.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10);
      setFilteredCoins(filtered);
    } else {
      setFilteredCoins(availableCoins.slice(0, 10));
    }
  }, [searchTerm, availableCoins]);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedCoin) {
      newErrors.coin = 'Please select a cryptocurrency';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.avgBuyPrice || parseFloat(formData.avgBuyPrice) <= 0) {
      newErrors.avgBuyPrice = 'Please enter a valid purchase price';
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Please select a purchase date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newHolding = {
      coinId: selectedCoin.id,
      symbol: selectedCoin.symbol,
      name: selectedCoin.name,
      amount: parseFloat(formData.amount),
      avgBuyPrice: parseFloat(formData.avgBuyPrice),
      currentPrice: selectedCoin.current_price,
      purchaseDate: formData.purchaseDate
    };
    
    onAdd(newHolding);
  };
  
  const formatCurrencyValue = (value) => {
    return formatCurrency(value, settings.currency || 'USD');
  };
  
  const totalInvestment = formData.amount && formData.avgBuyPrice ? 
    parseFloat(formData.amount) * parseFloat(formData.avgBuyPrice) : 0;
  
  const currentValue = formData.amount && selectedCoin ? 
    parseFloat(formData.amount) * selectedCoin.current_price : 0;
  
  const gainLoss = currentValue - totalInvestment;
  
  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          theme={theme}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle theme={theme}>
              <Plus />
              Add New Holding
            </ModalTitle>
            <CloseButton theme={theme} onClick={onClose}>
              <X />
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <FormSection>
              <SectionTitle theme={theme}>Select Cryptocurrency</SectionTitle>
              
              <SearchContainer>
                <SearchIcon theme={theme}>
                  <Search />
                </SearchIcon>
                <SearchInput
                  theme={theme}
                  type="text"
                  placeholder="Search for a cryptocurrency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchContainer>
              
              {errors.coin && (
                <ErrorMessage theme={theme}>
                  <AlertCircle />
                  {errors.coin}
                </ErrorMessage>
              )}
              
              <CoinList theme={theme}>
                {filteredCoins.map(coin => (
                  <CoinItem
                    key={coin.id}
                    theme={theme}
                    selected={selectedCoin?.id === coin.id}
                    onClick={() => setSelectedCoin(coin)}
                  >
                    <CoinIcon theme={theme}>
                      {coin.symbol.charAt(0).toUpperCase()}
                    </CoinIcon>
                    <CoinInfo>
                      <CoinName theme={theme}>{coin.name}</CoinName>
                      <CoinSymbol theme={theme}>{coin.symbol}</CoinSymbol>
                    </CoinInfo>
                    <CoinPrice theme={theme}>
                      {formatCurrencyValue(coin.current_price)}
                    </CoinPrice>
                  </CoinItem>
                ))}
              </CoinList>
            </FormSection>
            
            {selectedCoin && (
              <FormSection>
                <SectionTitle theme={theme}>Transaction Details</SectionTitle>
                
                <FormGrid>
                  <FormGroup>
                    <FormLabel theme={theme}>
                      <Hash />
                      Amount
                    </FormLabel>
                    <FormInput
                      theme={theme}
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      error={errors.amount}
                    />
                    {errors.amount && (
                      <ErrorMessage theme={theme}>
                        <AlertCircle />
                        {errors.amount}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel theme={theme}>
                      <DollarSign />
                      Purchase Price
                    </FormLabel>
                    <FormInput
                      theme={theme}
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={formData.avgBuyPrice}
                      onChange={(e) => handleInputChange('avgBuyPrice', e.target.value)}
                      error={errors.avgBuyPrice}
                    />
                    {errors.avgBuyPrice && (
                      <ErrorMessage theme={theme}>
                        <AlertCircle />
                        {errors.avgBuyPrice}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                  
                  <FormGroup fullWidth>
                    <FormLabel theme={theme}>
                      <Calendar />
                      Purchase Date
                    </FormLabel>
                    <FormInput
                      theme={theme}
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                      error={errors.purchaseDate}
                    />
                    {errors.purchaseDate && (
                      <ErrorMessage theme={theme}>
                        <AlertCircle />
                        {errors.purchaseDate}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                </FormGrid>
                
                {totalInvestment > 0 && (
                  <CalculatedValue theme={theme}>
                    <ValueRow>
                      <ValueLabel theme={theme}>Total Investment:</ValueLabel>
                      <ValueAmount theme={theme}>
                        {formatCurrencyValue(totalInvestment)}
                      </ValueAmount>
                    </ValueRow>
                    
                    <ValueRow>
                      <ValueLabel theme={theme}>Current Value:</ValueLabel>
                      <ValueAmount theme={theme}>
                        {formatCurrencyValue(currentValue)}
                      </ValueAmount>
                    </ValueRow>
                    
                    <ValueRow>
                      <ValueLabel theme={theme}>Unrealized P&L:</ValueLabel>
                      <ValueAmount 
                        theme={theme}
                        style={{ color: gainLoss >= 0 ? theme.success : theme.error }}
                      >
                        {gainLoss >= 0 ? '+' : ''}{formatCurrencyValue(gainLoss)}
                      </ValueAmount>
                    </ValueRow>
                  </CalculatedValue>
                )}
              </FormSection>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button theme={theme} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              theme={theme} 
              primary 
              onClick={handleSubmit}
              disabled={!selectedCoin || !formData.amount || !formData.avgBuyPrice}
            >
              <Plus />
              Add Holding
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default AddHoldingModal;