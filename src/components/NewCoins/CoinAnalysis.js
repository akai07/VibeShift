import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  Star,
  StarOff
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const AnalysisModal = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  position: sticky;
  top: 0;
  background: ${props => props.theme.surface};
  z-index: 10;
`;

const CoinHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CoinIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: white;
`;

const CoinDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CoinName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const CoinSymbol = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px;
  color: ${props => props.theme.textMuted};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.error};
    color: ${props => props.theme.error};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalContent = styled.div`
  padding: 24px;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AnalysisSection = styled.div`
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.primary};
  }
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ScoreCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => {
      const percentage = (props.score / 10) * 100;
      if (props.score >= 8) return `${props.theme.success} ${percentage}%, ${props.theme.border} ${percentage}%`;
      if (props.score >= 6) return `${props.theme.warning} ${percentage}%, ${props.theme.border} ${percentage}%`;
      if (props.score >= 4) return `${props.theme.primary} ${percentage}%, ${props.theme.border} ${percentage}%`;
      return `${props.theme.error} ${percentage}%, ${props.theme.border} ${percentage}%`;
    }}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${props => props.theme.surface};
  }
`;

const ScoreValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.text};
  z-index: 1;
`;

const ScoreDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textMuted};
  text-align: center;
  margin: 0;
  line-height: 1.4;
`;

const MetricsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
`;

const MetricLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textMuted};
`;

const MetricValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const RiskFactors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RiskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => {
    if (props.level === 'high') return `${props.theme.error}20`;
    if (props.level === 'medium') return `${props.theme.warning}20`;
    return `${props.theme.success}20`;
  }};
  border-radius: 8px;
  font-size: 13px;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => {
      if (props.level === 'high') return props.theme.error;
      if (props.level === 'medium') return props.theme.warning;
      return props.theme.success;
    }};
  }
`;

const FullWidthSection = styled.div`
  background: ${props => props.theme.glassEffect};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const RecommendationCard = styled.div`
  background: ${props => props.theme.gradient};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: white;
`;

const RecommendationTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const RecommendationText = styled.p`
  font-size: 14px;
  margin: 0 0 16px 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CoinAnalysis = ({ coin, onClose }) => {
  const { theme } = useTheme();
  const [analysisData, setAnalysisData] = useState(null);
  const [isWatched, setIsWatched] = useState(coin.isWatched);

  useEffect(() => {
    // Simulate analysis data generation
    const generateAnalysis = () => {
      const riskFactors = [
        { text: 'New project with limited track record', level: 'high' },
        { text: 'Low liquidity in early stages', level: 'medium' },
        { text: 'Unaudited smart contract', level: 'high' },
        { text: 'Small development team', level: 'medium' },
        { text: 'Active community engagement', level: 'low' }
      ];
      
      const metrics = {
        holders: Math.floor(Math.random() * 5000) + 500,
        transactions24h: Math.floor(Math.random() * 1000) + 100,
        liquidityUSD: Math.floor(Math.random() * 500000) + 50000,
        marketCapRank: Math.floor(Math.random() * 2000) + 1000,
        ageInDays: Math.floor((Date.now() - new Date(coin.launchDate)) / (1000 * 60 * 60 * 24))
      };
      
      const overallScore = Math.round(
        (coin.potentialScore + (10 - coin.riskScore) + coin.liquidityScore + coin.communityScore) / 4
      );
      
      let recommendation = 'Monitor';
      let recommendationText = 'Keep an eye on this project for future developments.';
      
      if (overallScore >= 8) {
        recommendation = 'Strong Buy';
        recommendationText = 'Excellent fundamentals with high growth potential.';
      } else if (overallScore >= 6) {
        recommendation = 'Buy';
        recommendationText = 'Good project with solid fundamentals and growth potential.';
      } else if (overallScore >= 4) {
        recommendation = 'Hold/Monitor';
        recommendationText = 'Mixed signals, monitor closely for trend changes.';
      } else {
        recommendation = 'Avoid';
        recommendationText = 'High risk factors outweigh potential benefits.';
      }
      
      return {
        overallScore,
        recommendation,
        recommendationText,
        riskFactors,
        metrics
      };
    };

    setAnalysisData(generateAnalysis());
  }, [coin]);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high':
        return <XCircle />;
      case 'medium':
        return <AlertTriangle />;
      default:
        return <CheckCircle />;
    }
  };

  const getScoreDescription = (score) => {
    if (score >= 8) return 'Excellent fundamentals with strong growth potential';
    if (score >= 6) return 'Good project with solid foundation';
    if (score >= 4) return 'Average project with mixed signals';
    return 'High risk project requiring caution';
  };

  if (!analysisData) {
    return null;
  }

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <AnalysisModal
          theme={theme}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader theme={theme}>
            <CoinHeaderInfo>
              <CoinIcon theme={theme}>
                {coin.symbol.substring(0, 2).toUpperCase()}
              </CoinIcon>
              <CoinDetails>
                <CoinName theme={theme}>{coin.name}</CoinName>
                <CoinSymbol theme={theme}>{coin.symbol} • Detailed Analysis</CoinSymbol>
              </CoinDetails>
            </CoinHeaderInfo>
            
            <CloseButton theme={theme} onClick={onClose}>
              <X />
            </CloseButton>
          </ModalHeader>

          <ModalContent>
            <AnalysisGrid>
              <AnalysisSection theme={theme}>
                <SectionTitle theme={theme}>
                  <BarChart3 />
                  Overall Score
                </SectionTitle>
                <ScoreDisplay>
                  <ScoreCircle theme={theme} score={analysisData.overallScore}>
                    <ScoreValue theme={theme}>{analysisData.overallScore}/10</ScoreValue>
                  </ScoreCircle>
                </ScoreDisplay>
                <ScoreDescription theme={theme}>
                  {getScoreDescription(analysisData.overallScore)}
                </ScoreDescription>
              </AnalysisSection>

              <AnalysisSection theme={theme}>
                <SectionTitle theme={theme}>
                  <Shield />
                  Risk Assessment
                </SectionTitle>
                <RiskFactors>
                  {analysisData.riskFactors.map((risk, index) => (
                    <RiskItem key={index} theme={theme} level={risk.level}>
                      {getRiskIcon(risk.level)}
                      {risk.text}
                    </RiskItem>
                  ))}
                </RiskFactors>
              </AnalysisSection>
            </AnalysisGrid>

            <FullWidthSection theme={theme}>
              <SectionTitle theme={theme}>
                <Info />
                Key Metrics
              </SectionTitle>
              <MetricsList>
                <MetricItem theme={theme}>
                  <MetricLabel theme={theme}>Token Holders</MetricLabel>
                  <MetricValue theme={theme}>{formatNumber(analysisData.metrics.holders)}</MetricValue>
                </MetricItem>
                <MetricItem theme={theme}>
                  <MetricLabel theme={theme}>24h Transactions</MetricLabel>
                  <MetricValue theme={theme}>{formatNumber(analysisData.metrics.transactions24h)}</MetricValue>
                </MetricItem>
                <MetricItem theme={theme}>
                  <MetricLabel theme={theme}>Liquidity (USD)</MetricLabel>
                  <MetricValue theme={theme}>${formatNumber(analysisData.metrics.liquidityUSD)}</MetricValue>
                </MetricItem>
                <MetricItem theme={theme}>
                  <MetricLabel theme={theme}>Market Cap Rank</MetricLabel>
                  <MetricValue theme={theme}>#{analysisData.metrics.marketCapRank}</MetricValue>
                </MetricItem>
                <MetricItem theme={theme}>
                  <MetricLabel theme={theme}>Age</MetricLabel>
                  <MetricValue theme={theme}>{analysisData.metrics.ageInDays} days</MetricValue>
                </MetricItem>
              </MetricsList>
            </FullWidthSection>

            <RecommendationCard theme={theme}>
              <RecommendationTitle>Recommendation: {analysisData.recommendation}</RecommendationTitle>
              <RecommendationText>{analysisData.recommendationText}</RecommendationText>
              <ActionButtons>
                <ActionButton onClick={() => setIsWatched(!isWatched)}>
                  {isWatched ? <Star /> : <StarOff />}
                  {isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </ActionButton>
                <ActionButton>
                  <ExternalLink />
                  View on Explorer
                </ActionButton>
              </ActionButtons>
            </RecommendationCard>
          </ModalContent>
        </AnalysisModal>
      </Overlay>
    </AnimatePresence>
  );
};

export default CoinAnalysis;