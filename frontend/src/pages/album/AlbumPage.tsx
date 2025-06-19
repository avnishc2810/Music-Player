import { useMusicStore } from '@/stores/useMusicStore';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock, Music, Pause, Play, Plus } from 'lucide-react';
import { usePlayerStore } from '@/stores/useAudioPlayer';

const AlbumPage = () => {
  const { albumId } = useParams();
  console.log(albumId);
  const { fetchAlbumById, isLoading, currentAlbum } = useMusicStore();


  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [fetchAlbumById, albumId])

  console.log({ currentAlbum });

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${paddedSeconds}`;
  }

  const { currentSong, togglePlay, playAlbum, isPlaying } = usePlayerStore()

  const handlePlayAlbum = (index: number) => {
    if (!currentAlbum) return

    const isCurrentAlbumPlaying = currentAlbum.songs.some(song => song._id === currentSong?._id)
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      playAlbum(currentAlbum.songs, 0)
    }
  }

  const handlePlaySong = (index: number) => {
    if (currentAlbum) {
      playAlbum(currentAlbum.songs, index);
    }
    else {
      return;
    }
  }



  return (
    <div className='h-screen'>
      <ScrollArea className='max-h-screen overflow-y-auto'>
        <div className="relative min-h-fit">
          <div className='absolute inset-0 bg-gradient-to-b
             from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none' aria-hidden='true' />

          <div className='relative z-10'>
            <div className="flex p-6 gap-6 pb-8">
              <img src={currentAlbum?.imageUrl} alt="image" className='w-[240px] h-[240px] shadow-xl rounded ' />
              <div className='flex flex-col justify-end'>
                <p className='text-sm font-medium'>
                  Playlist
                </p>
                <h2 className='text-7xl font-bold my-4'>{currentAlbum?.title}</h2>
                <span className='font-medium text-white'>{currentAlbum?.songs.length} songs</span>
              </div>
            </div>

            {/* playbutton */}
            <div className='px-6 pb-4 flex items-center justify-between gap-6'>
              <div>
                <Button
                onClick={() => handlePlayAlbum(0)}
                size='icon'
                className='w-14 h-14 rounded-full bg-green-600 hover:bg-green-500 
                hover:scale-105 transition-all'
              >
                {isPlaying && currentAlbum?.songs.some((song) => currentSong?._id === song._id) ? (
                  <Pause className='text-black'/>
                ):
                  (
                    <Play className = 'text-black ' />
                  )}
              </Button>
              </div>
              <div>
                <Button className='bg-green-500 rounded-lg w-15 hover:scale-105 hover:bg-green-500'><Plus/></Button>
                
              </div>
            </div>

            

            {/* table section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 
              border-white/5'>
                <div>#</div>
                <div>Title</div>
                <div>
                  <Clock className='h-4 w-4' />
                </div>
              </div>

              {/* songs list */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {

                    const isCurrentSong = currentSong?._id === song._id;

                    return (
                      <div key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer'>
                        <div className='flex items-center justify-center'>
                          {isCurrentSong && isPlaying ? (
                            <Music className='h-4 w-4 text-green-500' />
                          ) : <span className='group-hover:hidden'>{index + 1}</span>}
                          {!isCurrentSong && (<Play className='h-4 w-4 hidden group-hover:block text-green-500' />)}
                        </div>

                        <div className='flex items-center gap-3'>
                          <img src={song.imageUrl} alt="song" className='size-10' />
                          <div>
                            <div className='text-white font-medium'>{song.title}</div>
                            <div>{song.artist}</div>
                          </div>

                        </div>

                        <div>{formatDuration(song.duration)}</div>
                      </div>

                    )
                  }
                  )}
                </div>
              </div>
            </div>


          </div>

        </div>
      </ScrollArea>
    </div>
  )
}

export default AlbumPage

