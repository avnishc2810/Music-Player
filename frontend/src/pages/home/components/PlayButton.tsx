import { Button } from '@/components/ui/button'
import { usePlayerStore } from '@/stores/useAudioPlayer'
import type { Song } from '@/types'
import { Pause, Play } from 'lucide-react'
import React from 'react'

const PlayButton = ({ song }: { song: Song }) => {

    const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore()
    const isCurrentSong = currentSong?._id === song._id

    const handlePlay = () => {
        if (isCurrentSong) togglePlay()
        else {
            setCurrentSong(song)   
        }

    }

    return (
        <Button onClick={handlePlay} size={'icon'}
        className={`absolute bottom-3 right-0 bg-green-600 hover:bg-green-500 hover:scale-105 transition-all
        opacity-0 translate-y-2 group-hover:translate-y-0 ${isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            {isPlaying && isCurrentSong ? 
            <Pause className='text-black'/>:<Play className='text-black'/> }
        </Button>
    )
}

export default PlayButton
