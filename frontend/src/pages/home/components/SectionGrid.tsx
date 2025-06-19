import FeaturedGridSkeleton from '@/components/skeletons/FeaturedGridSkeleton';
import { Button } from '@/components/ui/button';
import type { Song } from '@/types'
import React from 'react'
import type { SecureContext } from 'tls';
import PlayButton from './PlayButton';
import { clsx } from 'clsx';

type SectionProps = {
    title: string,
    songs: Song[],
    isLoading: boolean
};

const SectionGrid = ({ title, songs, isLoading }: SectionProps) => {

    if(isLoading){
        return <FeaturedGridSkeleton/>
    }

    return (
        <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4'>
                {songs.map((song)=>(
                    <div key={song._id}
                    className='bg-zinc-800/50 hover:bg-zinc-700/50 transition-all group cursor-pointer p-2'>
                        <div className='relative mb-4'>
                            <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                                <img src={song.imageUrl} alt="image" 
                                className='w-full h-full object-cover transform duration-300 group-hover:scale-105'/>
                                <PlayButton song = {song}/>
                            </div>
                        </div>
                        <h3 className='text-md truncate mb-2'>{song.title}</h3>
                        <h4 className='text-sm truncate text-zinc-400'>{song.artist}</h4>

                        

                    </div>
                ))}
            </div>

        </div>
    )
}

export default SectionGrid
