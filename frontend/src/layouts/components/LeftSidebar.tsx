
import PlaylistSkeleton from '@/components/skeletons/PlaylistSkeleton';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/stores/useMusicStore';
import { SignedIn } from '@clerk/clerk-react';
import { HomeIcon, Library, MessageCircleHeart, MessageCircleIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'


const LeftSidebar = () => {

    const { songs, albums, fetchAlbums, isLoading } = useMusicStore();
    useEffect(() => {
        fetchAlbums();
    }, [fetchAlbums])

    console.log({ albums });


    return (
        <div className='h-full flex flex-col gap-2'>
            {/* Navigation menu  */}
            <div className='rounded-lg bg-zinc-900 p-4 '>

                <div className='space-y-2'>

                    <Link to={"/"} className={cn(buttonVariants(
                        {
                            variant: "ghost",
                            className: "w-full justify-start text-white hover:bg-zinc-800"
                        }
                    ))}>
                        <HomeIcon className='mr-2 size-5' />
                        <span className='hidden md:inline'>Home</span>
                    </Link>
                </div>

                <SignedIn>
                    <Link to={"/chat"} className={cn(buttonVariants(
                        {
                            variant: "ghost",
                            className: "w-full justify-start text-white hover:bg-zinc-800"
                        }
                    ))}>
                        <MessageCircleIcon className='mr-2 size-5' />
                        <span className='hidden md:inline'>Messages</span>
                    </Link>
                </SignedIn>
            </div>



            {/* library section */}
            <div className='flex-1 rounded-lg bg-zinc-800 p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center text-white px-3'>
                        <Library className='mr-2 size-6' />
                        <span className='hidden md:inline font-bold'>Playlists</span>
                    </div>
                </div>

                <ScrollArea className='h-[calc(100vh-300px)]'>
                    <div className='space-y-2'>
                        {
                            isLoading ? (<PlaylistSkeleton />) : (
                                albums.map((album) => (
                                    <Link to={`/albums/${album._id}`} key={album._id}
                                        className='bg-zinc-800 p-2 rounded-md flex items-center gap-3 hover:bg-zinc-700 transition-colors group cursor-pointer'>
                                        <img src={album.imageUrl} alt="img"
                                            className='size-12 rounded-md flex-shrink-0' />
                                        <div className='flex-1 min-w-0 hidden md:block space-y-2'>
                                            <p className='font-bold text-white text-lg'>{album.title}</p>
                                            <p className='font-bold text-white' >{album.artist}</p>
                                        </div>



                                    </Link>

                                ))
                            )
                        }
                    </div>
                </ScrollArea>
            </div>

            


        </div>
    )
}

export default LeftSidebar
