import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Flashcard } from '../utils/sm2';

interface Props {
    cards: Flashcard[];
    onClose: () => void;
}

export default function ScenarioChallenge({ cards, onClose }: Props) {

    // ── Card selection: only cards studied in the last 48 hours WITH scenarios ──
    const initialCards = useMemo(() => {
        const now = Date.now();
        const HOURS_48 = 48 * 60 * 60 * 1000;

        // Only cards that have a scenario written
        const withScenario = cards.filter(c => !!c.scenario);

        // Filter to cards that were studied/reviewed in the last 48 hours
        // A card was "recently studied" if:
        // - It's in LEARNING/RELEARNING (actively being studied right now)
        // - It's in REVIEW and nextReviewDate was set recently (meaning it was just rated)
        // - It's NEW but was created in the last 48h (just added)
        const recentlyStudied = withScenario.filter(c => {
            if (c.state === 'LEARNING' || c.state === 'RELEARNING') return true;
            if (c.state === 'REVIEW') {
                // If the card's next review is in the future, it was recently rated
                // Check if interval suggests it was rated recently
                // nextReviewDate - (interval in ms) ≈ when it was last rated
                const lastRated = c.nextReviewDate - (c.interval * 24 * 60 * 60 * 1000);
                return (now - lastRated) <= HOURS_48;
            }
            if (c.state === 'NEW') {
                return (now - c.createdAt) <= HOURS_48;
            }
            return false;
        });

        // If we have enough recently studied cards, use those
        // Otherwise expand to all cards with scenarios (fallback for first-time use)
        const pool = recentlyStudied.length >= 5 ? recentlyStudied : withScenario;

        // Shuffle
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 10);
    }, [cards]);

    // ── State: queue supports re-adding missed cards ──
    const [queue, setQueue] = useState<Flashcard[]>(initialCards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimText, setInterimText] = useState('');
    const [revealed, setRevealed] = useState(false);
    const [gotCount, setGotCount] = useState(0);
    const [missedCount, setMissedCount] = useState(0);
    const [missedCards, setMissedCards] = useState<Flashcard[]>([]);
    const [finished, setFinished] = useState(false);
    const recognitionRef = useRef<any>(null);
    const isListeningRef = useRef(false);

    // Setup speech recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
            let final = '';
            let interim = '';
            for (let i = 0; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript + ' ';
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            if (final) setTranscript(prev => (prev + ' ' + final).trim());
            setInterimText(interim);
        };

        recog.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            if (event.error !== 'no-speech') {
                setIsListening(false);
                isListeningRef.current = false;
            }
        };

        recog.onend = () => {
            if (isListeningRef.current) {
                try { recog.start(); } catch (_) { /* already started */ }
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recog;

        return () => {
            try { recog.stop(); } catch (_) {/* */}
        };
    }, []);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            isListeningRef.current = false;
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                isListeningRef.current = true;
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    }, [isListening]);

    const handleReveal = () => {
        if (isListening) {
            isListeningRef.current = false;
            recognitionRef.current?.stop();
            setIsListening(false);
        }
        setRevealed(true);
    };

    const advanceToNext = () => {
        if (currentIndex < queue.length - 1) {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setTranscript('');
                setInterimText('');
                setRevealed(false);
            }, 400);
        } else {
            setTimeout(() => setFinished(true), 400);
        }
    };

    const handleResult = (result: 'got_it' | 'missed') => {
        const currentCard = queue[currentIndex];

        if (result === 'got_it') {
            setGotCount(prev => prev + 1);
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#10b981', '#34d399', '#6ee7b7']
            });
        } else {
            setMissedCount(prev => prev + 1);
            setMissedCards(prev => [...prev, currentCard]);

            // ── KEY FIX: Re-add missed cards to the end of the queue ──
            // This means they'll come back again later in the session
            setQueue(prev => [...prev, currentCard]);
        }

        advanceToNext();
    };

    // --- No cards available ---
    if (queue.length === 0) {
        return (
            <div className="flex-center full-screen" style={{
                flexDirection: 'column',
                gap: '16px',
                color: 'var(--text-secondary)',
                padding: '24px',
                background: 'var(--bg-color)'
            }}>
                <span style={{ fontSize: '2.5rem' }}>📭</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>No recently studied cards with scenarios</span>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    maxWidth: '300px',
                    lineHeight: '1.6'
                }}>
                    Study some flashcards first, then come back within 48 hours to practice using them in real situations!
                </p>
                <button onClick={onClose} style={{
                    marginTop: '8px',
                    padding: '14px 32px',
                    borderRadius: 'var(--radius)',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    border: 'none'
                }}>
                    Back to Deck
                </button>
            </div>
        );
    }

    // --- Finished screen ---
    if (finished) {
        const total = gotCount + missedCount;
        const pct = total > 0 ? Math.round((gotCount / total) * 100) : 0;

        // Unique missed cards (deduplicated since a card can be missed multiple times)
        const uniqueMissed = Array.from(
            new Map(missedCards.map(c => [c.id, c])).values()
        );

        if (pct >= 70) {
            setTimeout(() => confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            }), 200);
        }

        return (
            <div className="flex-center full-screen" style={{
                flexDirection: 'column',
                gap: '20px',
                padding: '24px',
                background: 'var(--bg-color)',
                overflowY: 'auto',
            }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    style={{ fontSize: '3.5rem' }}
                >
                    {pct >= 80 ? '🔥' : pct >= 50 ? '💪' : '📚'}
                </motion.div>

                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.03em'
                }}>
                    {pct >= 80 ? 'Amazing!' : pct >= 50 ? 'Good effort!' : 'Keep practicing!'}
                </h2>

                <div style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: 'var(--success)',
                        }}>{gotCount}</div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>Nailed it</div>
                    </div>
                    <div style={{
                        width: '1px',
                        height: '40px',
                        background: 'var(--border)'
                    }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: 'var(--danger)',
                        }}>{missedCount}</div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>Missed</div>
                    </div>
                </div>

                {/* Missed words review — show full sentence answers */}
                {uniqueMissed.length > 0 && (
                    <div style={{
                        width: '100%',
                        maxWidth: '380px',
                        background: 'var(--card-bg)',
                        borderRadius: 'var(--radius)',
                        padding: '16px',
                        border: '1px solid var(--border)',
                    }}>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            display: 'block',
                            marginBottom: '12px'
                        }}>Words to revisit</span>
                        {uniqueMissed.map((c) => (
                            <div key={c.id} style={{
                                padding: '12px 0',
                                borderBottom: '1px solid var(--border)',
                            }}>
                                <div style={{
                                    fontSize: '0.95rem',
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    marginBottom: '4px',
                                }}>
                                    {c.scenarioAnswer || c.back}
                                </div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--accent)',
                                    marginBottom: '6px',
                                }}>
                                    {c.back} {c.pronunciation && <span style={{ color: 'var(--text-muted)' }}>{c.pronunciation}</span>}
                                </div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    fontFamily: 'Vazirmatn, sans-serif',
                                    direction: 'rtl',
                                    textAlign: 'right',
                                    lineHeight: '1.8',
                                }}>
                                    {c.scenario || (c.front || '').split('===HINT===')[0]?.trim()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={onClose} style={{
                    marginTop: '8px',
                    padding: '16px 40px',
                    borderRadius: 'var(--radius)',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '1rem',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                }}>
                    Done
                </button>
            </div>
        );
    }

    // --- Main challenge UI ---
    const currentCard = queue[currentIndex];
    const scenarioText = currentCard.scenario || (currentCard.front || '').split('===HINT===')[0]?.trim();
    // The answer is the full sentence (scenarioAnswer), NOT just the bare word
    const targetAnswer = currentCard.scenarioAnswer || currentCard.back || '';
    const targetWord = currentCard.back || '';
    const totalOriginal = initialCards.length;
    // Progress based on original cards only (re-queued missed ones don't inflate progress)
    const completedOriginal = Math.min(currentIndex, totalOriginal);
    const progress = (completedOriginal / totalOriginal) * 100;

    // Check if transcript contains key words from the target
    const checkMatch = (target: string, spoken: string): boolean => {
        const spokenLower = spoken.toLowerCase().replace(/[^a-z0-9'\s-]/g, '');
        const targetLower = target.toLowerCase().replace(/[^a-z0-9'\s-]/g, '');

        // Full phrase match
        if (spokenLower.includes(targetLower)) return true;

        // Check against the key word (back of card)
        const keyWordLower = targetWord.toLowerCase().replace(/[^a-z0-9'\s-]/g, '');
        if (spokenLower.includes(keyWordLower)) return true;

        // For multi-word targets, check if significant words appear
        const targetWords = targetLower.split(/\s+/).filter(w => w.length > 3);
        if (targetWords.length === 0) return spokenLower.includes(targetLower);

        const matchCount = targetWords.filter(w => spokenLower.includes(w)).length;
        return matchCount >= Math.ceil(targetWords.length * 0.5);
    };

    const hasMatch = transcript.length > 0 && checkMatch(targetAnswer, transcript);
    const displayTranscript = transcript + (interimText ? ' ' + interimText : '');

    // Highlight matching words in transcript
    const highlightTranscript = (text: string, target: string) => {
        if (!text) return null;
        const allTargetWords = (target + ' ' + targetWord).toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const words = text.split(/(\s+)/);

        return words.map((word, i) => {
            const clean = word.toLowerCase().replace(/[^a-z0-9'-]/g, '');
            const isMatch = allTargetWords.some(tw => clean.includes(tw) || tw.includes(clean));
            return (
                <span key={i} style={{
                    color: isMatch && revealed ? 'var(--success)' : 'var(--text-primary)',
                    fontWeight: isMatch && revealed ? '700' : '400',
                }}>
                    {word}
                </span>
            );
        });
    };

    return (
        <div className="flex-center full-screen" style={{
            flexDirection: 'column',
            position: 'relative',
            height: '100dvh',
            overflow: 'hidden',
            background: 'var(--bg-color)'
        }}>

            {/* Progress bar */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '3px',
                background: 'var(--border)',
                zIndex: 15
            }}>
                <motion.div
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                        height: '100%',
                        background: 'var(--success)',
                        borderRadius: '0 2px 2px 0'
                    }}
                />
            </div>

            {/* Header */}
            <div style={{
                position: 'absolute',
                top: '12px', left: '16px', right: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                <button onClick={onClose} style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--text-muted)',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                }}>
                    ← Back
                </button>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                }}>
                    <span style={{
                        background: 'var(--success-soft)',
                        color: 'var(--success)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        letterSpacing: '0.04em'
                    }}>
                        CHALLENGE
                    </span>
                    {currentIndex + 1}/{queue.length}
                    {queue.length > totalOriginal && (
                        <span style={{
                            fontSize: '0.65rem',
                            color: 'var(--warning)',
                            fontWeight: '600',
                        }}>
                            +{queue.length - totalOriginal} retry
                        </span>
                    )}
                </div>
            </div>

            {/* Main content area */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: '64px',
                paddingBottom: '200px',
                width: '100%',
                overflowY: 'auto',
                padding: '64px 20px 200px',
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >
                        {/* Scenario prompt card */}
                        <div style={{
                            background: 'var(--card-bg)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '28px 24px',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--card-shadow)',
                        }}>
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                display: 'block',
                                marginBottom: '14px'
                            }}>
                                تصور کن تو این موقعیتی — به انگلیسی چی میگی؟
                            </span>

                            {/* Persian situation text */}
                            <p style={{
                                fontSize: scenarioText.length > 100 ? '0.95rem' : scenarioText.length > 60 ? '1.05rem' : '1.2rem',
                                fontFamily: 'Vazirmatn, sans-serif',
                                fontWeight: '600',
                                direction: 'rtl',
                                textAlign: 'right',
                                lineHeight: '2',
                                color: 'var(--text-primary)',
                                margin: 0,
                            }}>
                                {scenarioText}
                            </p>
                        </div>

                        {/* Transcript area */}
                        {(displayTranscript || isListening) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'var(--card-bg)',
                                    borderRadius: 'var(--radius)',
                                    padding: '20px',
                                    border: `1px solid ${isListening ? 'var(--accent)' : 'var(--border)'}`,
                                    minHeight: '60px',
                                    transition: 'border-color 0.3s',
                                }}
                            >
                                <span style={{
                                    fontSize: '0.65rem',
                                    fontWeight: '700',
                                    color: isListening ? 'var(--accent)' : 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginBottom: '8px'
                                }}>
                                    {isListening && (
                                        <motion.span
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.2 }}
                                            style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: 'var(--danger)',
                                                display: 'inline-block'
                                            }}
                                        />
                                    )}
                                    {isListening ? 'Listening...' : 'You said'}
                                </span>
                                <p style={{
                                    margin: 0,
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    color: 'var(--text-primary)',
                                }}>
                                    {revealed
                                        ? highlightTranscript(displayTranscript, targetAnswer)
                                        : displayTranscript
                                    }
                                    {isListening && !displayTranscript && (
                                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                            Speak naturally...
                                        </span>
                                    )}
                                </p>
                            </motion.div>
                        )}

                        {/* Revealed answer — shows FULL SENTENCE, not just the word */}
                        {revealed && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: hasMatch
                                        ? 'rgba(16, 185, 129, 0.08)'
                                        : 'rgba(245, 158, 11, 0.08)',
                                    borderRadius: 'var(--radius)',
                                    padding: '20px',
                                    border: `1px solid ${hasMatch
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : 'rgba(245, 158, 11, 0.2)'
                                    }`,
                                }}
                            >
                                <span style={{
                                    fontSize: '0.65rem',
                                    fontWeight: '700',
                                    color: hasMatch ? 'var(--success)' : 'var(--warning)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    display: 'block',
                                    marginBottom: '10px'
                                }}>
                                    {hasMatch ? '✓ You got it!' : 'How you could say it'}
                                </span>

                                {/* Full sentence answer */}
                                <p style={{
                                    margin: 0,
                                    fontSize: targetAnswer.length > 60 ? '1rem' : '1.15rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    lineHeight: '1.5',
                                    marginBottom: '10px',
                                }}>
                                    "{targetAnswer}"
                                </p>

                                {/* Key word + pronunciation */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    flexWrap: 'wrap',
                                }}>
                                    <span style={{
                                        background: 'rgba(99, 102, 241, 0.15)',
                                        color: 'var(--accent)',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                    }}>
                                        {targetWord}
                                    </span>
                                    {currentCard.pronunciation && (
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                        }}>
                                            {currentCard.pronunciation}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom controls */}
            <div style={{
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                padding: '16px',
                paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                background: 'linear-gradient(to top, var(--bg-color) 60%, transparent)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
            }}>
                <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    {!revealed ? (
                        <>
                            {/* Mic button */}
                            <motion.button
                                onClick={toggleListening}
                                whileTap={{ scale: 0.92 }}
                                animate={isListening ? {
                                    boxShadow: [
                                        '0 0 0 0 rgba(239, 68, 68, 0.4)',
                                        '0 0 0 16px rgba(239, 68, 68, 0)',
                                    ],
                                } : {}}
                                transition={isListening ? {
                                    repeat: Infinity,
                                    duration: 1.5,
                                } : {}}
                                style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '50%',
                                    background: isListening ? 'var(--danger)' : 'var(--accent)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.8rem',
                                    color: '#fff',
                                    boxShadow: isListening
                                        ? '0 4px 20px rgba(239, 68, 68, 0.4)'
                                        : '0 4px 20px rgba(99, 102, 241, 0.4)',
                                    transition: 'background 0.2s',
                                }}
                            >
                                {isListening ? '◼' : '🎤'}
                            </motion.button>

                            <span style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                fontWeight: '500'
                            }}>
                                {isListening ? 'Tap to stop' : 'Tap to speak'}
                            </span>

                            {/* Reveal button */}
                            {transcript && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleReveal}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: 'var(--radius)',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Reveal Answer
                                </motion.button>
                            )}

                            {/* Skip button */}
                            {!transcript && !isListening && (
                                <button
                                    onClick={handleReveal}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        padding: '8px',
                                    }}
                                >
                                    Skip — show answer
                                </button>
                            )}
                        </>
                    ) : (
                        /* Got it / Missed buttons */
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            <button
                                onClick={() => handleResult('missed')}
                                style={{
                                    flex: 1,
                                    padding: '18px',
                                    borderRadius: 'var(--radius)',
                                    background: 'var(--danger)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                }}
                            >
                                ✗ Missed
                            </button>
                            <button
                                onClick={() => handleResult('got_it')}
                                style={{
                                    flex: 1,
                                    padding: '18px',
                                    borderRadius: 'var(--radius)',
                                    background: 'var(--success)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                }}
                            >
                                ✓ Got it
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
