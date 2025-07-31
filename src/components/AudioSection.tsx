import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Volume2, Pause, Play } from 'lucide-react';

interface AudioProps {
    audio: string
}

const AudioSection: React.FC<AudioProps> = ({ audio }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    }

    const handleLoadedMetaData = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    }

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && audioRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const clickx = e.clientX - rect.left;
            const progress = clickx / rect.width;
            const newTime = progress * duration;

            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-8"
        >
            <div className="space-y-6 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <Volume2 className="w-12 h-12 text-white" />
                </div>

                <div>
                    <h4 className="text-xl font-noto font-semibold text-slate-900 mb-2">
                        Audio Explanation Ready
                    </h4>
                    <p className="text-slate-600 font-noto mb-6">
                        Listen to a detailed explanation of your medication analysis
                    </p>
                </div>

                <Button
                    onClick={toggleAudio}
                    size="lg"
                    className="bg-slate-950 hover:bg-slate-900 cursor-pointer font-noto font-normal w-[300px]"
                >
                    {isPlaying ? (
                        <>
                            <Pause className="w-5 h-5 mr-2" />
                            Pause Audio
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 mr-2" />
                            Play Audio Explanation
                        </>
                    )}
                </Button>
                <span className="text-sm font-noto text-slate-600">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <div
                    ref={progressRef}
                    className="relative h-3 bg-slate-200 rounded cursor-pointer w-80"
                    onClick={handleSeek}
                >
                    <div
                        className="absolute top-0 left-0 h-full bg-orange-500 rounded"
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    />
                </div>
            </div>

            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetaData}
            >
                <source src={audio} type='audio/mpeg' />
            </audio>
        </motion.div>
    )
}

export default AudioSection;