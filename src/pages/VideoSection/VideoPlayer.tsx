/* eslint-disable no-return-assign */

import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

export interface VideoPlayerHandle {
  loadVideo: (url: string, autoplay: boolean) => void;
  playVideo: () => void;
}

interface VideoPlayerProps {
  initialUrl: string;
  onEnded?: () => void;
  onProgressUpdate: (progress: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ initialUrl, onEnded, onProgressUpdate }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

    useImperativeHandle(ref, () => ({
      loadVideo(url: string, autoplay: boolean): void {
        if (videoRef.current) {
          videoRef.current.src = url;
          videoRef.current.load();
          // Apply the current playback speed to the new video
          videoRef.current.playbackRate = playbackSpeed;
          if (autoplay) {
            videoRef.current.play().catch((error) => {
              console.warn('AutoPlay failed:', error);
            });
          }
        }
      },
      playVideo(): void {
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.warn('Play failed:', error);
          });
        }
      },
    }));

    // ... rest of the component remains exactly the same ...
    const togglePlay = (): void => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const toggleMute = (): void => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newVolume = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
      }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newProgress = parseFloat(e.target.value);
      if (videoRef.current) {
        const newTime = (duration * newProgress) / 100;
        videoRef.current.currentTime = newTime;
        setProgress(newProgress);
      }
    };

    const toggleFullscreen = (): void => {
      const container = videoRef.current?.parentElement;
      if (container) {
        if (!document.fullscreenElement) {
          container.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    };

    const handleSpeedChange = (speed: number): void => {
      if (videoRef.current) {
        videoRef.current.playbackRate = speed;
        setPlaybackSpeed(speed);
        setShowSpeedMenu(false);
      }
    };

    const formatTime = (timeInSeconds: number): string => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = (): void => {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
        setCurrentTime(video.currentTime);
        onProgressUpdate(currentProgress);
      };

      const handleLoadedMetadata = (): void => {
        setDuration(video.duration);
      };

      const handlePlay = (): void => {
        setIsPlaying(true);
      };

      const handlePause = (): void => {
        setIsPlaying(false);
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }, [onProgressUpdate]);

    return (
      <div className="relative group w-full" style={{ backgroundColor: '#0A1929' }}>
        <style>
          {`
            /* Custom slider styles */
            input[type="range"] {
              -webkit-appearance: none;
              appearance: none;
              background: transparent;
              cursor: pointer;
            }

            /* Progress bar track */
            input[type="range"]::-webkit-slider-runnable-track {
              background: #574866;
              height: 4px;
              border-radius: 2px;
            }

            input[type="range"]::-moz-range-track {
              background: #574866;
              height: 4px;
              border-radius: 2px;
            }

            /* Progress bar thumb */
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              margin-top: -6px;
              background-color: #2563EB;
              height: 16px;
              width: 16px;
              border-radius: 50%;
              border: none;
            }

            input[type="range"]::-moz-range-thumb {
              border: none;
              border-radius: 50%;
              background-color: #2563EB;
              height: 16px;
              width: 16px;
            }

            /* Hover states */
            input[type="range"]:hover::-webkit-slider-thumb {
              background-color: #3B82F6;
            }

            input[type="range"]:hover::-moz-range-thumb {
              background-color: #3B82F6;
            }

            /* Focus states */
            input[type="range"]:focus::-webkit-slider-thumb {
              box-shadow: 0 0 0 2px #574866;
            }

            input[type="range"]:focus::-moz-range-thumb {
              box-shadow: 0 0 0 2px #574866;
            }
          `}
        </style>

        <video
          ref={videoRef}
          className="w-full h-auto"
          onClick={togglePlay}
          onEnded={onEnded}
        >
          <source src={initialUrl} type="video/mp4" />
        </video>

        <div 
          className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ 
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.95))',
            backdropFilter: 'blur(1px)'
          }}
        >
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full mb-4"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="transition-colors"
                  style={{ color: '#94A3B8' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <div style={{ color: '#94A3B8' }} className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="relative">
                <button
                  onClick={() => { setShowSpeedMenu(!showSpeedMenu); }}
                  className="flex items-center space-x-1 transition-colors"
                  style={{ color: '#94A3B8' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">{playbackSpeed}x</span>
                </button>

                {showSpeedMenu && (
                  <div 
                    className="absolute bottom-full mb-2 rounded-lg py-2 min-w-[100px]"
                    style={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(51, 65, 85, 0.5)'
                    }}
                  >
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => { handleSpeedChange(speed); }}
                        className="w-full px-4 py-1 text-sm text-left transition-colors"
                        style={{ 
                          color: playbackSpeed === speed ? '#2563EB' : '#94A3B8',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#574866'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="transition-colors"
              style={{ color: '#94A3B8' }}
              onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
              onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
            >
              <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;

