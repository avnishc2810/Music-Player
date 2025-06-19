import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMusicStore } from '@/stores/useMusicStore'
import { Plus } from 'lucide-react';
import React, { useRef, useState } from 'react'

const AddSongDialogue = () => {

    const { albums ,addSong} = useMusicStore();
    const [songDialogueOpen, setSongDialogOpen] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false)

    const [newSong, setNewSong] = useState({
        title: "",
        artist: "",
        album: undefined,
        duration: 0,
    })
    
    const handleSubmit = async () => {
        setIsLoading(true)
        try{
            const response = await fetch("http://localhost:8000/download",{
                method:"POST",
                body: JSON.stringify({title:newSong.title,artist:newSong.artist}),
                headers:{
                    "Content-Type":"application/json"
                },
            })

            const data = await response.json()

            if(response.ok){
                await addSong(newSong.title,newSong.artist)
                alert("Song Downloaded Successfully!")
            }
            else{
                alert("Something went wrong")
            }
        }
        catch(error){
            console.log(error);
        }
        finally{
            setIsLoading(false)
            setSongDialogOpen(false)
            setNewSong({title:"",artist:"",album:undefined,duration:0})
        }
    }
    return (
        <Dialog open={songDialogueOpen} onOpenChange={setSongDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Song
                </Button>
            </DialogTrigger>

            <DialogContent className='max-h-[80vh] overflow-auto border-zinc-700 bg-zinc-900'>
                <DialogHeader>
                    <DialogTitle>Add a Song</DialogTitle>
                    <DialogDescription>New song will be added to your music library</DialogDescription>
                </DialogHeader>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Title</label>
                    <Input
                        value={newSong.title}
                        onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                        className='bg-zinc-800 border-zinc-700'
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Artist</label>
                    <Input
                        value={newSong.artist}
                        onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                        className='bg-zinc-800 border-zinc-700'
                    />
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
                        {isLoading ? ("") : ("Cancel")}
                    </Button>
                    <Button onClick={handleSubmit}>
                        {isLoading ? ("Downloading ..."):("Add Song")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddSongDialogue
