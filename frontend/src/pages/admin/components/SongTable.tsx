import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMusicStore } from '@/stores/useMusicStore'
import { Ghost, Loader2, Trash2 } from 'lucide-react'
import React from 'react'

const SongTable = () => {
    const {songs ,isLoading,error,deleteSong} = useMusicStore()
    if(isLoading){
        return <div>Loading</div>
    }
    
    if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}

    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-zinc-700'>
                    <TableHead className='w-[100px]'></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {songs.map((song) => (
                    <TableRow key={song._id} className='hover:bg-zinc-700'>
                        <TableCell>
                            <img src={song.imageUrl} alt="img" className='size-10 rounded object-cover'/>
                        </TableCell>
                        <TableCell>{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>
                            <div className='flex justify-end gap-2'>
                                <Button variant={"ghost"} size={"sm"}
                                className='text-red-400 hover:text-red-300 hover:bg-red-400'
                                onClick={() => deleteSong(song._id)}>
                                    <Trash2 size={5}/>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SongTable
