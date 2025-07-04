import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '@/stores/useAudioPlayer'
import { Ghost, Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

const PlayBackControls = () => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();

    const [volume, setVolume] = useState(75)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        audioRef.current = document.querySelector("audio")
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)

        const handleEnded = () => {
            usePlayerStore.setState({ isPlaying: false })
        }

        audio.addEventListener("timeupdate", updateTime)
        audio.addEventListener("loadedmetadata", updateDuration)

        audio.addEventListener("ended", handleEnded)

        return () => {
            audio.removeEventListener("timeupdate", updateTime)
            audio.removeEventListener("loadedmetadata", updateDuration)

            audio.removeEventListener("ended", handleEnded)
        }
    }, [currentSong])

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            return audioRef.current.currentTime = value[0]
        }
    }


    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutes}:${paddedSeconds}`;
    }

    const handleMute = () => {
        if (volume > 0) {
            setVolume(0)
            if (audioRef.current) {
                audioRef.current.volume = 0
            }
        }
        else {
            setVolume(50)
            if (audioRef.current) {
                audioRef.current.volume = 0.5
            }
        }


    }

    return (
        <footer className='h-20 sm:h-24 bg-zinc-700 border-t border-zinc-900 px-4'>
            <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
                <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
                    {currentSong && (
                        <>
                            <img src={currentSong.imageUrl} alt="image" className='h-14 w-14 object-cover rounded-md' />

                            <div className='flex-1 min-w-0'>
                                <div className='font-medium truncate hover:underline cursor-pointer'>{currentSong.title}</div>
                                <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>{currentSong.artist}</div>
                            </div>

                        </>
                    )}
                </div>

                <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
                    <div className='flex items-center gap-4 sm:gap-6'>
                        {/* <Button size={'icon'} variant={'ghost'} className='hidden sm:inline-flex hover:text-white text-zinc-400'>
                            <Shuffle className='h-4 w-4' />
                        </Button> */}
                        <Button size={'icon'} variant={'ghost'}
                            onClick={playPrevious} disabled={!currentSong}
                            className='hidden sm:inline-flex hover:text-white bg-zinc-100 text-black'>
                            <SkipBack className='h-4 w-4' />
                        </Button>

                        <Button size={'icon'} variant={'ghost'}
                            onClick={togglePlay} disabled={!currentSong}
                            className='hidden sm:inline-flex hover:text-white bg-zinc-100 text-black rounded-lg '>
                            {isPlaying ? (<Pause className='h-4 w-4' />) : (<Play className='h-4 w-4' />)}
                        </Button>

                        <Button size={'icon'} variant={'ghost'}
                            onClick={playNext} disabled={!currentSong}
                            className='hidden sm:inline-flex hover:text-white bg-zinc-100 text-black'>
                            <SkipForward className='h-4 w-4' />
                        </Button>

                        <Button size={'icon'} variant={'ghost'}
                            className='hidden sm:inline-flex hover:text-white'>
                            <Repeat className='h-4 w-4' />
                        </Button>
                    </div>

                    <div className='hidden sm:flex items-center gap-2 w-full'>

                        <div className='text-xs text-zinc-400'>{formatDuration(currentTime)}</div>

                        <Slider
                            value={[currentTime]}
                            max={duration || 100} step={1}
                            className='w-full hover:cursor-grab active:cursor-grabbing text-white'
                            onValueChange={handleSeek} />

                        <div className='text-xs text-zinc-400'>{formatDuration(duration)}</div>
                    </div>
                </div>

                {/* volume controls */}
                <div className='hidden sm:flex items-center gap-4 min-w-[180px] w[30%] justify-end'>
                    {/* <Button size={'icon'} variant={'ghost'} className='hover:text-white text-zinc-400'>
                        <Mic2 className='h-4 w-4'/>
                    </Button>
                    <Button size={'icon'} variant={'ghost'} className='hover:text-white text-zinc-400'>
                        <ListMusic className='h-4 w-4'/>
                    </Button>
                    <Button size={'icon'} variant={'ghost'} className='hover:text-white text-zinc-400'>
                        <Laptop2 className='h-4 w-4'/>
                    </Button>
                    */}
                    <div className='flex items-center gap-2'>
                        <Button size={'icon'} variant={'ghost'} className='hover:text-white text-zinc-400' onClick={
                            handleMute
                        }>

                            {volume == 0 ? <VolumeX /> : (volume > 75 && volume > 0 ? (<Volume2 className='h-4 w-4' />) : (<Volume1 className='h-4 w-4' />))}

                        </Button>
                    </div>
                    <Slider max={100} value={[volume]} step={1}
                        className='w-24 active:cursor-grabbing hover:cursor-grab'
                        onValueChange={(value) => {
                            setVolume(value[0])
                            if (audioRef.current) {
                                audioRef.current.volume = value[0] / 100
                            }

                        }}
                    />
                </div>
            </div>

        </footer>
    )
}

export default PlayBackControls
