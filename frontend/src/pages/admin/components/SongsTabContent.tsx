import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music2 } from 'lucide-react'
import AddSongDialogue from './AddSongDialogue'
import SongTable from './SongTable'

const SongsTabContent = () => {
    return (
        <Card className='bg-zinc-800/50'>
            <CardHeader>
                <div className='flex justify-between items-center '>
                    <div>
                        <CardTitle className='flex gap-2 mb-2 items-center'>
                            <Music2 className='size-5 text-blue-500' />
                            Songs Library
                        </CardTitle>
                        <CardDescription>
                            <p>Manage your music tracks</p>
                        </CardDescription>

                    </div>
                    <AddSongDialogue />
                </div>

            </CardHeader>

            <CardContent >
                <SongTable />
            </CardContent>
        </Card>
    )
}

export default SongsTabContent
