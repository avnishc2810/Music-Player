import FeaturedGridSkeleton from '@/components/skeletons/FeaturedGridSkeleton'
import { useMusicStore } from '@/stores/useMusicStore'
import React, { useEffect } from 'react'
import PlayButton from './PlayButton'

const FeaturedSection = () => {

    const { featuredSongs, isLoading, error} = useMusicStore()

    if(isLoading){
        return <FeaturedGridSkeleton/>
    }

    if(error){return <p className='bg-red-700'>{error}</p>}

    return (
        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 m-8 gap-4'>
            
            {featuredSongs.map((song) =>(
                <div key={song._id} className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
                hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'>
                    <img src={song.imageUrl} alt="image" className='w-16 sm:w-20 h-16 sm:h-20 
                    object-cover flex-shrink-0 '/>

                    <div className='flex-1 p-4'>
                        <p className='font-medium truncate'>{song.title}</p>
                        <p className='text-sm text-stone-600'>{song?.artist}</p>
                    </div>
                    
                    <PlayButton song = {song}/>
                    
                </div>
            ))}

        </div>
    )
}

export default FeaturedSection
