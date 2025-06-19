import React, { useEffect } from 'react'
import Header from './components/Header'
import DashBoardStats from './components/DashBoardStats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Library, Music } from 'lucide-react'
import SongsTabContent from './components/SongsTabContent'
import AlbumsTabContent from './components/AlbumsTabContent'
import { useMusicStore } from '@/stores/useMusicStore'
import { useAuthStore } from '@/stores/useAuthStore'
import NotFoundPage from '../error/NotFoundPage'

const AdminPage = () => {

    const { isAdmin,isLoading} = useAuthStore()
    const {fetchSongs,fetchStats,fetchAlbums} = useMusicStore();
    useEffect(()=>{
        fetchAlbums()
        fetchSongs()
        fetchStats()
    },[fetchStats,fetchAlbums,fetchSongs])

    if(!isAdmin && !isLoading){
        return <NotFoundPage/>
    }   

    return (
        <div className='bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8'>
            <Header />
            <DashBoardStats />

            <Tabs defaultValue="songs" className='space-y-6'>
                <TabsList className='bg-zinc-800/50 p-1'>
                    <TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
                        <Music className='mr-2 size-4' />Songs
                    </TabsTrigger>
                    <TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
                        <Library className='mr-2 size-4 text-white' />Playlists
                    </TabsTrigger>
                </TabsList>


                <TabsContent value='songs'>
                    <SongsTabContent />
                </TabsContent>
                <TabsContent value='albums'>
                    <AlbumsTabContent />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AdminPage
