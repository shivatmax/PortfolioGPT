import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { LiveGeminiService } from '../services/liveGeminiService';
import { APP_CONFIG } from '../constants';

interface VoiceAssistantPanelProps {
    isOpen: boolean;
    onClose: () => void;
    aiTone: string;
    onNavigate: (view: any) => void;
}

const VoiceAssistantPanel: React.FC<VoiceAssistantPanelProps> = ({
    isOpen,
    onClose,
    aiTone,
    onNavigate
}) => {
    const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'processing' | 'userSpeaking' | 'error'>('connecting');
    const [volume, setVolume] = useState(0);
    const [userVolume, setUserVolume] = useState(0);
    const [errorInfo, setErrorInfo] = useState<{ type: string; message: string; canRetry: boolean } | null>(null);
    const [transcriptHistory, setTranscriptHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const liveServiceRef = useRef<LiveGeminiService | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Smooth volume springs
    const smoothVolume = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 });
    const smoothUserVolume = useSpring(0, { stiffness: 300, damping: 25, mass: 0.3 });

    useEffect(() => {
        smoothVolume.set(Math.max(0.2, volume));
        smoothUserVolume.set(Math.max(0.1, userVolume));
    }, [volume, userVolume, smoothVolume, smoothUserVolume]);

    const connectService = () => {
        setStatus('connecting');
        setErrorInfo(null);
        setTranscriptHistory([]);

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
                    // Navigate asynchronously without closing voice panel
                    onNavigate(data);
                }
            },
            (vol) => {
                setVolume(vol);
                // Detect if user is speaking based on input volume
                if (vol > 0.1 && status === 'listening') {
                    setUserVolume(vol);
                } else if (status === 'speaking') {
                    setUserVolume(0);
                }
            }
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

    // Get status display info
    const getStatusInfo = () => {
        switch (status) {
            case 'connecting':
                return { text: 'Connecting...', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
            case 'listening':
                return { text: 'Listening', color: 'text-sky-500', bgColor: 'bg-sky-500' };
            case 'speaking':
                return { text: 'Speaking', color: 'text-green-500', bgColor: 'bg-green-500' };
            case 'processing':
                return { text: 'Thinking', color: 'text-purple-500', bgColor: 'bg-purple-500' };
            case 'error':
                return { text: 'Error', color: 'text-red-500', bgColor: 'bg-red-500' };
            default:
                return { text: 'Ready', color: 'text-gray-500', bgColor: 'bg-gray-500' };
        }
    };

    const statusInfo = getStatusInfo();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full w-[380px] lg:w-[420px] xl:w-[450px] flex-shrink-0
                 bg-gray-50 dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-white/10 
                 shadow-2xl flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                    {/* Avatar with glow */}
                    <div className="relative">
                        <motion.div
                            animate={{
                                boxShadow: status === 'speaking'
                                    ? ['0 0 0 0 rgba(14, 165, 233, 0)', '0 0 0 8px rgba(14, 165, 233, 0.3)', '0 0 0 0 rgba(14, 165, 233, 0)']
                                    : status === 'listening'
                                        ? ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 6px rgba(34, 197, 94, 0.2)', '0 0 0 0 rgba(34, 197, 94, 0)']
                                        : 'none'
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800"
                        >
                            <img src="/photo.jpeg" alt={APP_CONFIG.name} className="w-full h-full object-cover" />
                        </motion.div>
                        {/* Status indicator dot */}
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${statusInfo.bgColor}`}>
                            {status === 'speaking' && (
                                <motion.span
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full bg-green-500 opacity-50"
                                />
                            )}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{APP_CONFIG.name} Voice</h3>
                        <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
                            {status === 'processing' && (
                                <motion.div className="flex gap-0.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                            className="w-1 h-1 rounded-full bg-purple-500"
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Main Visualizer Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6">
                {/* Background ambient effect */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            background: status === 'speaking'
                                ? ['radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
                                    'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
                                    'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 70%)']
                                : status === 'listening'
                                    ? ['radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
                                        'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                                        'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 70%)']
                                    : 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 70%)'
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0"
                    />
                </div>

                {/* Central Orb */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                    {/* Outer ring - volume reactive */}
                    <motion.div
                        style={{ scale: smoothVolume }}
                        className={`absolute inset-0 rounded-full blur-xl transition-colors duration-500 ${status === 'speaking' ? 'bg-sky-500/40' :
                            status === 'listening' ? 'bg-green-500/30' :
                                'bg-gray-500/20'
                            }`}
                    />

                    {/* Main orb */}
                    <motion.div
                        animate={{
                            scale: status === 'processing' ? [1, 0.95, 1] : 1,
                        }}
                        transition={{ duration: 1.5, repeat: status === 'processing' ? Infinity : 0 }}
                        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden 
                       shadow-lg border-2 border-white/20 dark:border-white/10"
                    >
                        <img src="/photo.jpeg" alt="ShivGPT" className="w-full h-full object-cover" />

                        {/* Overlay gradient */}
                        <div className={`absolute inset-0 transition-all duration-500 mix-blend-overlay ${status === 'speaking' ? 'bg-gradient-to-br from-sky-400/60 via-transparent to-sky-600/40' :
                            status === 'listening' ? 'bg-gradient-to-br from-green-400/40 via-transparent to-green-600/30' :
                                status === 'processing' ? 'bg-gradient-to-br from-purple-400/50 via-transparent to-purple-600/40' :
                                    'bg-transparent'
                            }`} />

                        {/* Processing spinner */}
                        {status === 'processing' && (
                            <div className="absolute inset-0 border-4 border-transparent border-t-white/50 rounded-full animate-spin" />
                        )}
                    </motion.div>

                    {/* Ripples for listening */}
                    {status === 'listening' && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-green-500/40"
                            />
                            <motion.div
                                animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                                className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-green-500/30"
                            />
                        </>
                    )}

                    {/* Sound waves for speaking */}
                    {status === 'speaking' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                style={{ scale: smoothVolume }}
                                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-sky-400/40"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-sky-300/20"
                            />
                        </div>
                    )}
                </div>

                {/* Status text */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 text-center"
                    >
                        {status === 'error' ? (
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                        {errorInfo?.message || 'Connection failed'}
                                    </span>
                                </div>
                                {errorInfo?.canRetry && (
                                    <button
                                        onClick={handleRetry}
                                        className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M23 4v6h-6"></path>
                                            <path d="M1 20v-6h6"></path>
                                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                        </svg>
                                        Try Again
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                    {status === 'connecting' && 'Connecting...'}
                                    {status === 'listening' && 'I\'m listening...'}
                                    {status === 'speaking' && 'Speaking'}
                                    {status === 'processing' && 'Thinking...'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {status === 'listening' && 'Say something to start'}
                                    {status === 'speaking' && `${APP_CONFIG.name} is responding`}
                                    {status === 'processing' && 'Processing your request'}
                                </p>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* User audio indicator */}
                {status === 'listening' && userVolume > 0.05 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-green-500"
                        />
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Hearing you</span>
                    </motion.div>
                )}
            </div>

            {/* Audio Waveform Visualization */}
            <div className="h-16 flex items-center justify-center gap-0.5 px-8 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            height: status === 'speaking'
                                ? [4, Math.random() * 24 + 8, 4]
                                : status === 'listening' && userVolume > 0.05
                                    ? [4, Math.random() * 16 + 4, 4]
                                    : [4, 6, 4]
                        }}
                        transition={{
                            duration: status === 'speaking' ? 0.3 : 0.5,
                            repeat: Infinity,
                            delay: i * 0.05,
                            ease: "easeInOut"
                        }}
                        className={`w-1 rounded-full transition-colors duration-300 ${status === 'speaking' ? 'bg-sky-500' :
                            status === 'listening' && userVolume > 0.05 ? 'bg-green-500' :
                                'bg-gray-300 dark:bg-gray-700'
                            }`}
                    />
                ))}
            </div>

            {/* Footer Controls */}
            <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black/80 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                    {/* Mic Toggle Button */}
                    <button
                        onClick={handleToggleMic}
                        className={`p-3 rounded-full transition-all ${isMicMuted
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50'
                                : 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-400'
                            }`}
                        title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
                    >
                        {isMicMuted ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium text-sm shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
                            <line x1="23" y1="1" x2="1" y2="23"></line>
                        </svg>
                        End Call
                    </button>

                    {/* Speaker Toggle Button */}
                    <button
                        onClick={handleToggleSpeaker}
                        className={`p-3 rounded-full transition-all ${isSpeakerMuted
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50'
                                : 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-400'
                            }`}
                        title={isSpeakerMuted ? "Unmute speaker" : "Mute speaker"}
                    >
                        {isSpeakerMuted ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <line x1="23" y1="9" x2="17" y2="15"></line>
                                <line x1="17" y1="9" x2="23" y2="15"></line>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default VoiceAssistantPanel;
