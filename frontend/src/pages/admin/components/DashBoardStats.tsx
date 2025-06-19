import { useMusicStore } from '@/stores/useMusicStore'
import { Library, Music2, PlayCircle, User2 } from 'lucide-react'
import React from 'react'
import StatsCard from './StatsCard'

const DashBoardStats = () => {

    const {stats} = useMusicStore()
    console.log(stats)

    const stastData = [
        {
            icon:Music2,
            label:"Total Songs",
            value:stats.totalSongs.toString(),
            bgColor:"bg-emerald-500/10",
            iconColor:"text-emerald-500"

        },
        {
            icon:Library,
            label:"Total Playlist",
            value:stats.totalAlbums.toString(),
            bgColor:"bg-blue-500/10",
            iconColor:"text-blue-500"

        },
        {
            icon:User2,
            label:"Total Artists",
            value:stats.totalArtists.toString(),
            bgColor:"bg-orange-500/10",
            iconColor:"text-orange-500"

        },
        {
            icon:PlayCircle ,
            label:"Total Users",
            value:stats.totalUsers.toString(),
            bgColor:"bg-purple-500/10",
            iconColor:"text-purple-500"

        },
        
    ]

    return (
        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            {stastData.map((stat) => (
                <StatsCard 
                key={stat.label}
                icon = {stat.icon}
                value = {stat.value}
                iconColor = {stat.iconColor}
                bgColor = {stat.bgColor}
                label={stat.label}
                />
            ))}
        </div>
    )
}

export default DashBoardStats
