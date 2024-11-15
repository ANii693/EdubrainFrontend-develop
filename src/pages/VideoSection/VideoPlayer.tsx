// import React, {
//   useRef,
//   useImperativeHandle,
//   forwardRef,
//   useState,
//   useEffect,
// } from 'react';
// import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

// export interface VideoPlayerHandle {
//   loadVideo: (url: string, autoplay: boolean) => void;
//   playVideo: () => void;
// }

// interface VideoPlayerProps {
//   initialUrl: string;
//   onEnded?: () => void;
//   onProgressUpdate: (progress: number) => void;
// }

// const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
//   ({ initialUrl, onEnded, onProgressUpdate }, ref) => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const [volume, setVolume] = useState(1);
//     const [isMuted, setIsMuted] = useState(false);
//     const [duration, setDuration] = useState(0);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//     const [playbackSpeed, setPlaybackSpeed] = useState(1);

//     const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

//     useImperativeHandle(ref, () => ({
//       loadVideo(url: string, autoplay: boolean): void {
//         if (videoRef.current) {
//           videoRef.current.src = url;
//           videoRef.current.load();
//           if (autoplay) {
//             videoRef.current.play().catch((error) => {
//               console.warn('AutoPlay failed:', error);
//             });
//           }
//         }
//       },
//       playVideo(): void {
//         if (videoRef.current) {
//           videoRef.current.play().catch((error) => {
//             console.warn('Play failed:', error);
//           });
//         }
//       },
//     }));

//     const togglePlay = (): void => {
//       if (videoRef.current) {
//         if (isPlaying) {
//           videoRef.current.pause();
//         } else {
//           videoRef.current.play();
//         }
//         setIsPlaying(!isPlaying);
//       }
//     };

//     const toggleMute = (): void => {
//       if (videoRef.current) {
//         videoRef.current.muted = !isMuted;
//         setIsMuted(!isMuted);
//       }
//     };

//     const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//       const newVolume = parseFloat(e.target.value);
//       if (videoRef.current) {
//         videoRef.current.volume = newVolume;
//         setVolume(newVolume);
//         setIsMuted(newVolume === 0);
//       }
//     };

//     const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//       const newProgress = parseFloat(e.target.value);
//       if (videoRef.current) {
//         const newTime = (duration * newProgress) / 100;
//         videoRef.current.currentTime = newTime;
//         setProgress(newProgress);
//       }
//     };

//     const toggleFullscreen = (): void => {
//       const container = videoRef.current?.parentElement;
//       if (container) {
//         if (!document.fullscreenElement) {
//           container.requestFullscreen();
//         } else {
//           document.exitFullscreen();
//         }
//       }
//     };

//     const handleSpeedChange = (speed: number): void => {
//       if (videoRef.current) {
//         videoRef.current.playbackRate = speed;
//         setPlaybackSpeed(speed);
//         setShowSpeedMenu(false);
//       }
//     };

//     const formatTime = (timeInSeconds: number): string => {
//       const minutes = Math.floor(timeInSeconds / 60);
//       const seconds = Math.floor(timeInSeconds % 60);
//       return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     };

//     useEffect(() => {
//       const video = videoRef.current;
//       if (!video) return;

//       const handleTimeUpdate = (): void => {
//         const currentProgress = (video.currentTime / video.duration) * 100;
//         setProgress(currentProgress);
//         setCurrentTime(video.currentTime);
//         onProgressUpdate(currentProgress);
//       };

//       const handleLoadedMetadata = (): void => {
//         setDuration(video.duration);
//       };

//       const handlePlay = (): void => {
//         setIsPlaying(true);
//       };

//       const handlePause = (): void => {
//         setIsPlaying(false);
//       };

//       video.addEventListener('timeupdate', handleTimeUpdate);
//       video.addEventListener('loadedmetadata', handleLoadedMetadata);
//       video.addEventListener('play', handlePlay);
//       video.addEventListener('pause', handlePause);

//       return () => {
//         video.removeEventListener('timeupdate', handleTimeUpdate);
//         video.removeEventListener('loadedmetadata', handleLoadedMetadata);
//         video.removeEventListener('play', handlePlay);
//         video.removeEventListener('pause', handlePause);
//       };
//     }, [onProgressUpdate]);

//     return (
//       <div className="   relative group w-full bg-black">
//         <video
//           ref={videoRef}
//           className="w-full h-auto"
//           onClick={togglePlay}
//           onEnded={onEnded}
//         >
//           <source src={initialUrl} type="video/mp4" />
//         </video>

//         {/* Custom Controls */}
//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
//           {/* Progress Bar */}
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={progress}
//             onChange={handleProgressChange}
//             className="w-full h-1 mb-4 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
//           />

//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               {/* Play/Pause Button */}
//               <button
//                 onClick={togglePlay}
//                 className="text-white hover:text-gray-300 transition-colors"
//               >
//                 {isPlaying ? (
//                   <Pause className="w-6 h-6" />
//                 ) : (
//                   <Play className="w-6 h-6" />
//                 )}
//               </button>

//               {/* Volume Controls */}
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={toggleMute}
//                   className="text-white hover:text-gray-300 transition-colors"
//                 >
//                   {isMuted ? (
//                     <VolumeX className="w-6 h-6" />
//                   ) : (
//                     <Volume2 className="w-6 h-6" />
//                   )}
//                 </button>
//                 <input
//                   type="range"
//                   min="0"
//                   max="1"
//                   step="0.1"
//                   value={volume}
//                   onChange={handleVolumeChange}
//                   className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
//                 />
//               </div>

//               {/* Time Display */}
//               <div className="text-white text-sm">
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </div>

//               {/* Playback Speed */}
//               <div className="relative">
//                 <button
//                   onClick={() => { setShowSpeedMenu(!showSpeedMenu); }}
//                   className="text-white hover:text-gray-300 transition-colors flex items-center space-x-1"
//                 >
//                   <Settings className="w-5 h-5" />
//                   <span className="text-sm">{playbackSpeed}x</span>
//                 </button>

//                 {showSpeedMenu && (
//                   <div className="absolute bottom-full mb-2 bg-black/90 rounded-lg py-2 min-w-[100px]">
//                     {speedOptions.map((speed) => (
//                       <button
//                         key={speed}
//                         onClick={() => { handleSpeedChange(speed); }}
//                         className={`w-full px-4 py-1 text-sm text-left hover:bg-gray-700 ${
//                           playbackSpeed === speed ? 'text-blue-400' : 'text-white'
//                         }`}
//                       >
//                         {speed}x
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Fullscreen Button */}
//             <button
//               onClick={toggleFullscreen}
//               className="text-white hover:text-gray-300 transition-colors"
//             >
//               <Maximize className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// VideoPlayer.displayName = 'VideoPlayer';

// export default VideoPlayer;











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
      <div className="   relative group w-full bg-black">
        <video
          ref={videoRef}
          className="w-full h-auto"
          onClick={togglePlay}
          onEnded={onEnded}
        >
          <source src={initialUrl} type="video/mp4" />
        </video>

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 mb-4 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              {/* Volume Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors"
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
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                />
              </div>

              {/* Time Display */}
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Playback Speed */}
              <div className="relative">
                <button
                  onClick={() => { setShowSpeedMenu(!showSpeedMenu); }}
                  className="text-white hover:text-gray-300 transition-colors flex items-center space-x-1"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">{playbackSpeed}x</span>
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-full mb-2 bg-black/90 rounded-lg py-2 min-w-[100px]">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => { handleSpeedChange(speed); }}
                        className={`w-full px-4 py-1 text-sm text-left hover:bg-gray-700 ${
                          playbackSpeed === speed ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
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