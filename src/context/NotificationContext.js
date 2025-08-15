import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: true,
    trendAlerts: true,
    newListingAlerts: true,
    priceAlerts: true,
    portfolioAlerts: true,
    soundEnabled: true,
    currency: 'USD',
    refreshInterval: 30,
    analytics: false,
  });
  const [priceAlerts, setPriceAlerts] = useState([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('vibeshift-notification-settings');
    const savedAlerts = localStorage.getItem('vibeshift-price-alerts');
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing notification settings:', error);
      }
    }
    
    if (savedAlerts) {
      try {
        setPriceAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Error parsing price alerts:', error);
      }
    }
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if (settings.browserNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [settings.browserNotifications]);

  const updateSettings = useCallback((newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('vibeshift-notification-settings', JSON.stringify(updatedSettings));
  }, [settings]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep only last 100
    
    // Show toast notification
    switch (notification.type) {
      case 'success':
        toast.success(notification.message);
        break;
      case 'error':
        toast.error(notification.message);
        break;
      case 'warning':
        toast(notification.message, { icon: '⚠️' });
        break;
      case 'info':
      default:
        toast(notification.message, { icon: 'ℹ️' });
        break;
    }
    
    // Show browser notification if enabled
    if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title || 'VibeShift Alert', {
        body: notification.message,
        icon: '/favicon.svg',
        tag: notification.type,
      });
    }
    
    // Play sound if enabled
    if (settings.soundEnabled) {
      // You can add sound files and play them here
      // const audio = new Audio('/notification-sound.mp3');
      // audio.play().catch(() => {});
    }
  }, [settings]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addPriceAlert = useCallback((alert) => {
    const newAlert = {
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      active: true,
      ...alert,
    };
    
    const updatedAlerts = [...priceAlerts, newAlert];
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('vibeshift-price-alerts', JSON.stringify(updatedAlerts));
    
    addNotification({
      type: 'success',
      title: 'Price Alert Created',
      message: `Alert set for ${alert.coinSymbol} at $${alert.targetPrice}`,
    });
  }, [priceAlerts, addNotification]);

  const removePriceAlert = useCallback((alertId) => {
    const updatedAlerts = priceAlerts.filter(alert => alert.id !== alertId);
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('vibeshift-price-alerts', JSON.stringify(updatedAlerts));
  }, [priceAlerts]);

  const checkPriceAlerts = useCallback((marketData) => {
    if (!settings.priceAlerts) return;
    
    priceAlerts.forEach(alert => {
      if (!alert.active) return;
      
      const coinData = marketData.find(coin => coin.symbol === alert.coinSymbol);
      if (!coinData) return;
      
      const currentPrice = coinData.price;
      let triggered = false;
      
      if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
        triggered = true;
      } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
        triggered = true;
      }
      
      if (triggered) {
        addNotification({
          type: 'warning',
          title: 'Price Alert Triggered',
          message: `${alert.coinSymbol} is now ${alert.condition} $${alert.targetPrice} (Current: $${currentPrice.toFixed(2)})`,
        });
        
        // Deactivate the alert
        const updatedAlerts = priceAlerts.map(a => 
          a.id === alert.id ? { ...a, active: false } : a
        );
        setPriceAlerts(updatedAlerts);
        localStorage.setItem('vibeshift-price-alerts', JSON.stringify(updatedAlerts));
      }
    });
  }, [priceAlerts, settings.priceAlerts, addNotification]);

  const sendTrendAlert = useCallback((coinSymbol, trendChange, trendScore) => {
    if (!settings.trendAlerts) return;
    
    addNotification({
      type: 'info',
      title: 'Trend Change Alert',
      message: `${coinSymbol} trend changed to ${trendChange} (Score: ${trendScore})`,
    });
  }, [settings.trendAlerts, addNotification]);

  const sendNewListingAlert = useCallback((coinName, coinSymbol) => {
    if (!settings.newListingAlerts) return;
    
    addNotification({
      type: 'info',
      title: 'New Coin Listed',
      message: `${coinName} (${coinSymbol}) has been listed`,
    });
  }, [settings.newListingAlerts, addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    settings,
    priceAlerts,
    unreadCount,
    updateSettings,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addPriceAlert,
    removePriceAlert,
    checkPriceAlerts,
    sendTrendAlert,
    sendNewListingAlert,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};