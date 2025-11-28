import React, { useState, useEffect, useRef } from 'react';
import { CreatorMode } from './components/CreatorMode';
import { ReceiverMode } from './components/ReceiverMode';
import { AudioManager } from './utils/AudioManager';
import { CONFETTI_COLORS, WISH_MESSAGES } from './utils/constants';

export default function App() {
  const [mode, setMode] = useState('creator');
  const [candles, setCandles] = useState(5);
  const [candleStates, setCandleStates] = useState(Array(5).fill(true));
  const [isListening, setIsListening] = useState(false);
  const [blowStrength, setBlowStrength] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wishMessage, setWishMessage] = useState('');
  const [confetti, setConfetti] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('elegant');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  
  const audioManagerRef = useRef(new AudioManager());

  // Load configuration from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const configData = urlParams.get('config');
    
    if (configData) {
      try {
        const config = JSON.parse(atob(configData));
        setMode('receiver');
        setCandles(config.candles);
        setCandleStates(Array(config.candles).fill(true));
        setSelectedTheme(config.theme);
        setRecipientName(config.recipientName);
        setSenderName(config.senderName);
        setPersonalMessage(config.message);
      } catch (err) {
        console.error('Invalid configuration');
      }
    }
  }, []);

  // Update candle states when candle count changes
  useEffect(() => {
    setCandleStates(Array(candles).fill(true));
    setShowCelebration(false);
    setWishMessage('');
    setConfetti([]);
  }, [candles]);

  // Check if all candles are blown out
  useEffect(() => {
    const litCount = candleStates.filter(s => s).length;
    const allOut = litCount === 0 && candleStates.length > 0;
    
    if (allOut && !showCelebration) {
      setShowCelebration(true);
      createConfetti();
      audioManagerRef.current.stopListening();
      setIsListening(false);
      setWishMessage(WISH_MESSAGES[Math.floor(Math.random() * WISH_MESSAGES.length)]);
    }
  }, [candleStates, showCelebration]);

  // Confetti animation
  useEffect(() => {
    if (confetti.length > 0) {
      const interval = setInterval(() => {
        setConfetti(prev => 
          prev.map(c => ({
            ...c,
            y: c.y + c.speed,
            rotation: c.rotation + 8
          })).filter(c => c.y < 110)
        );
      }, 30);
      return () => clearInterval(interval);
    }
  }, [confetti]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioManagerRef.current.stopListening();
    };
  }, []);

  const startListening = async () => {
    const success = await audioManagerRef.current.startListening();
    if (success) {
      setIsListening(true);
      audioManagerRef.current.detectBlow((strength) => {
        setBlowStrength(strength);
        if (strength > 1.5) {
          blowOutCandles();
        }
      });
    } else {
      alert('Microphone access is required. Please allow microphone permissions in your browser settings.');
    }
  };

  const stopListening = () => {
    audioManagerRef.current.stopListening();
    setIsListening(false);
    setBlowStrength(0);
  };

  const blowOutCandles = () => {
    setCandleStates(prev => {
      return prev.map(lit => {
        if (lit && Math.random() < 0.3) {
          return false;
        }
        return lit;
      });
    });
  };

  const resetCandles = () => {
    setCandleStates(Array(candles).fill(true));
    setShowCelebration(false);
    setWishMessage('');
    setConfetti([]);
  };

  const createConfetti = () => {
    const newConfetti = [];
    for (let i = 0; i < 150; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        speed: 1 + Math.random() * 2.5,
        size: 8 + Math.random() * 8
      });
    }
    setConfetti(newConfetti);
  };

  const captureScreenshot = () => {
    // This will be handled by passing the renderer ref from the hook
    // For now, we'll create a simple placeholder
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhotos(prev => [...prev, { 
        id: Date.now(), 
        url: dataUrl, 
        timestamp: new Date() 
      }]);
    }
  };

  const downloadPhoto = (photo) => {
    const link = document.createElement('a');
    link.download = `birthday-${photo.timestamp.getTime()}.png`;
    link.href = photo.url;
    link.click();
  };

  const generateShareableLink = () => {
    const config = {
      candles,
      theme: selectedTheme,
      recipientName,
      senderName,
      message: personalMessage
    };
    
    const encoded = btoa(JSON.stringify(config));
    const url = `${window.location.origin}${window.location.pathname}?config=${encoded}`;
    setShareableLink(url);
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  };

  if (mode === 'creator') {
    return (
      <CreatorMode
        candles={candles}
        setCandles={setCandles}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        recipientName={recipientName}
        setRecipientName={setRecipientName}
        senderName={senderName}
        setSenderName={setSenderName}
        personalMessage={personalMessage}
        setPersonalMessage={setPersonalMessage}
        shareableLink={shareableLink}
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        generateShareableLink={generateShareableLink}
        copyToClipboard={copyToClipboard}
        candleStates={candleStates}
      />
    );
  }

  return (
    <ReceiverMode
      candles={candles}
      selectedTheme={selectedTheme}
      autoRotate={autoRotate}
      setAutoRotate={setAutoRotate}
      recipientName={recipientName}
      senderName={senderName}
      personalMessage={personalMessage}
      candleStates={candleStates}
      isListening={isListening}
      startListening={startListening}
      stopListening={stopListening}
      blowStrength={blowStrength}
      showCelebration={showCelebration}
      wishMessage={wishMessage}
      resetCandles={resetCandles}
      captureScreenshot={captureScreenshot}
      capturedPhotos={capturedPhotos}
      downloadPhoto={downloadPhoto}
      soundEnabled={soundEnabled}
      setSoundEnabled={setSoundEnabled}
      confetti={confetti}
    />
  );
}