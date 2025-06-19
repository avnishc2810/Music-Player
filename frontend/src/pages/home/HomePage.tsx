import FeaturedGridSkeleton from '@/components/skeletons/FeaturedGridSkeleton'
import TopBar from '@/components/TopBar'
import { useMusicStore } from '@/stores/useMusicStore'
import React, { useEffect } from 'react'
import FeaturedSection from './components/FeaturedSection'
import { ScrollArea } from '@/components/ui/scroll-area'
import SectionGrid from './components/SectionGrid'
import { usePlayerStore } from '@/stores/useAudioPlayer'

const HomePage = () => {

  const {featuredSongs,madeForYouSongs,isLoading,error,fetchFeaturedSongs,fetchMadeForYouSongs} = useMusicStore()

  useEffect(() => {
    fetchFeaturedSongs()
    fetchMadeForYouSongs()
  },[fetchFeaturedSongs,fetchMadeForYouSongs])

  console.log(featuredSongs,madeForYouSongs)
  const {initializeQueue} = usePlayerStore()
  useEffect(() => {
    if(featuredSongs.length > 0 && madeForYouSongs.length > 0){
      const allSongs = [...featuredSongs,...madeForYouSongs]
      initializeQueue(allSongs)
    }
  },[initializeQueue,madeForYouSongs,featuredSongs])

  return (
    <main className='h-full rounded-md overflow-hidden bg-gradient-to-b from-zinc-800 to-black'>
      <TopBar/>
      
      <ScrollArea className='h-[calc(100vh-180px)]'>
        <div className='p-4 sm:p-6'>
          <h1 className='font-bold text-2xl sm:text-3xl mb-6'>Featured</h1>
          <FeaturedSection/> 
        </div>

        <div className='p-4 sm:p-6'>
          <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading}/>

        </div>

      </ScrollArea>
    </main>
  )
}

export default HomePage
