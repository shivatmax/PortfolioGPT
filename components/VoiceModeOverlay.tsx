import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { LiveGeminiService } from '../services/liveGeminiService';
import { APP_CONFIG } from '../constants';

interface VoiceModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  aiTone: string;
  onNavigate: (view: any) => void;
}

const VoiceModeOverlay: React.FC<VoiceModeOverlayProps> = ({ isOpen, onClose, aiTone, onNavigate }) => {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'processing' | 'error'>('connecting');
  const [volume, setVolume] = useState(0);
  const [errorInfo, setErrorInfo] = useState<{ type: string; message: string; canRetry: boolean } | null>(null);
  const liveServiceRef = useRef<LiveGeminiService | null>(null);

  // Use framer-motion springs to smooth out the volume values to prevent jitter/glitches
  // This creates that "fluid" feeling even if data updates are sporadic
  const smoothVolume = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 });
  const smoothGlow = useSpring(0, { stiffness: 150, damping: 25 });

  useEffect(() => {
    // Update the spring target whenever the raw volume changes
    smoothVolume.set(Math.max(0.1, volume)); // Keep a minimum size
    smoothGlow.set(volume * 1.5);
  }, [volume, smoothVolume, smoothGlow]);

  const connectService = () => {
    setStatus('connecting');
    setErrorInfo(null);

    const service = new LiveGeminiService(
      (action, data) => {
        if (action === 'connected') setStatus('listening');
        if (action === 'listening') setStatus('listening');
        if (action === 'speaking') setStatus('speaking');
        if (action === 'processing') setStatus('processing');
        if (action === 'error') {
          console.error("Voice Error", data);
          setStatus('error');
          setErrorInfo(data);
        }
        if (action === 'navigate' && data) {
          onNavigate(data);
        }
      },
      (vol) => setVolume(vol)
    );

    service.connect(aiTone);
    liveServiceRef.current = service;
  };

  const handleRetry = () => {
    if (liveServiceRef.current) {
      liveServiceRef.current.disconnect();
      liveServiceRef.current = null;
    }
    connectService();
  };

  // Mic and Speaker mute states
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);

  const handleToggleMic = () => {
    if (liveServiceRef.current) {
      const newState = liveServiceRef.current.toggleMic();
      setIsMicMuted(newState);
    }
  };

  const handleToggleSpeaker = () => {
    if (liveServiceRef.current) {
      const newState = liveServiceRef.current.toggleSpeaker();
      setIsSpeakerMuted(newState);
    }
  };

  useEffect(() => {
    if (isOpen) {
      connectService();
    } else {
      if (liveServiceRef.current) {
        liveServiceRef.current.disconnect();
        liveServiceRef.current = null;
      }
    }

    return () => {
      if (liveServiceRef.current) {
        liveServiceRef.current.disconnect();
      }
    };
  }, [isOpen, aiTone]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-b from-sky-900/20 via-black to-black pointer-events-none"
      />

      {/* Header */}
      <div className="absolute top-4 sm:top-6 md:top-8 w-full px-4 sm:px-6 md:px-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-red-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-white/70">Live</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white backdrop-blur-md"
        >
          <svg width="18" height="18" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Main Visuals - 3D Orb Effect */}
      <div className="relative flex flex-col items-center justify-center w-full h-full">

        {/* Status Text with Blur Effect */}
        <div className="absolute top-[12%] sm:top-[15%] text-center z-20">
          <AnimatePresence mode="wait">
            {status === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span className="text-sm font-medium text-red-300">
                    {errorInfo?.message || 'Connection failed'}
                  </span>
                </div>
                {errorInfo?.canRetry && (
                  <button
                    onClick={handleRetry}
                    className="px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto shadow-lg"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 4v6h-6"></path>
                      <path d="M1 20v-6h6"></path>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    Try Again
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.h2
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-1 sm:mb-2 tracking-wide"
              >
                {status === 'connecting' && "Connecting..."}
                {status === 'listening' && "Listening..."}
                {status === 'speaking' && APP_CONFIG.name}
                {status === 'processing' && "Thinking..."}
              </motion.h2>
            )}
          </AnimatePresence>
          {status !== 'error' && <p className="text-white/40 text-[10px] sm:text-xs md:text-sm">Voice Mode Active</p>}
        </div>

        {/* THE ORB */}
        <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 flex items-center justify-center">

          {/* Outer Glow Ring (Reacts to volume) */}
          <motion.div
            style={{ scale: smoothVolume, opacity: smoothGlow }}
            className={`absolute inset-0 rounded-full blur-2xl sm:blur-3xl transition-colors duration-500
                 ${status === 'speaking' ? 'bg-sky-500/60' : 'bg-blue-500/40'}
               `}
          />

          {/* Core Orb */}
          <motion.div
            animate={{
              scale: status === 'processing' ? [1, 0.9, 1] : 1,
            }}
            transition={{ duration: 1.5, repeat: status === 'processing' ? Infinity : 0 }}
            className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] sm:shadow-[0_0_50px_rgba(255,255,255,0.3)] backdrop-blur-sm overflow-hidden"
          >
            <img src="/photo.jpeg" alt={APP_CONFIG.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            {/* Orb Gradient Surface */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000
                  ${status === 'speaking' ? 'from-sky-400 via-blue-600 to-sky-900' :
                status === 'processing' ? 'from-white/80 via-white/50 to-transparent' :
                  'from-sky-400 via-sky-600 to-black'}
               `} />

            {/* Internal "Liquid" Movement */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-50%] bg-gradient-to-t from-transparent via-white/20 to-transparent w-[200%] h-[200%] opacity-50 blur-md"
            />

            {/* Loading Ring for Processing */}
            {status === 'processing' && (
              <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            )}
          </motion.div>

          {/* Ripples (Listening State) */}
          {status === 'listening' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border border-blue-500/30"
              />
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="absolute w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border border-sky-500/20"
              />
            </>
          )}

          {/* Dynamic Waveform (Speaking State) */}
          {status === 'speaking' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                style={{ scale: smoothVolume }}
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-2 border-white/20 opacity-50"
              />
              <motion.div
                style={{ scale: smoothGlow }}
                className="absolute w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full border border-sky-400/30 opacity-30"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 flex items-center gap-4 sm:gap-6 z-20">
        {/* Mic Toggle Button */}
        <button
          onClick={handleToggleMic}
          className={`p-3 sm:p-4 rounded-full transition-all ${isMicMuted
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
              : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
            }`}
          title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMicMuted ? (
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          ) : (
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </button>

        {/* End Call Button */}
        <button
          onClick={onClose}
          className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium text-sm sm:text-base shadow-lg hover:shadow-red-500/40 transition-all flex items-center gap-2 sm:gap-3 backdrop-blur-sm"
        >
          <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
          End Call
        </button>

        {/* Speaker Toggle Button */}
        <button
          onClick={handleToggleSpeaker}
          className={`p-3 sm:p-4 rounded-full transition-all ${isSpeakerMuted
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
              : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
            }`}
          title={isSpeakerMuted ? "Unmute speaker" : "Mute speaker"}
        >
          {isSpeakerMuted ? (
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default VoiceModeOverlay;