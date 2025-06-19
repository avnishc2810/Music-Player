import { axiosInstance } from '@/lib/axios';
import type { Album, Song, Stats, User } from '@/types';
import toast from 'react-hot-toast';
import {create} from 'zustand';


interface MusicStore {
    songs:Song[],
    albums:Album[],
    isLoading:boolean,
    error:string|null,
    currentAlbum:Album|null,

    madeForYouSongs:Song[],
    trendingSongs:Song[],
    featuredSongs:Song[],
    stats: Stats,
    fetchAlbums: () => Promise<void>
    
    fetchAlbumById: (id:string) => Promise<void>
    fetchFeaturedSongs:() => Promise<void>
    fetchMadeForYouSongs:() => Promise<void>
    deleteSong: (id:string) => Promise<void>
    fetchSongs: () => Promise<void>,
    fetchStats: () => Promise<void>,
    deleteAlbum: (id: string) => Promise<void>;
    addSong:(title:string,artist:string) => Promise<void>


    
    

}



export const useMusicStore = create<MusicStore>((set) => ({
    songs:[],
    albums:[],
    isLoading:false,
    error:null,
    currentAlbum:null,
    trendingSongs:[],
    featuredSongs:[],
    madeForYouSongs:[],
    stats :{
        totalAlbums:0,
        totalArtists:0,
        totalSongs:0,
        totalUsers:0,
    },
    fetchAlbums: async () => {
        set({isLoading:true,error:null});

        try{
            const response = await axiosInstance.get("/albums/albums");
            set({albums:response.data});
        }
        catch(error:any){
            set({error:error.response.data.message});
        }
        finally{
            set({isLoading:false});
        }
    },
    fetchAlbumById:async(id:string) =>{
        set({isLoading:true,error:null});

        try{
            const response = await axiosInstance.get(`/albums/${id}`);
            set({currentAlbum:response.data});
            
        }
        catch(error:any){
            set({error:error.response.data.message});
        }
        finally{
            set({isLoading:false});
        }
    },
    fetchFeaturedSongs: async()=>{
        set({isLoading:true,error:null})

        try{
            const response = await axiosInstance.get("/songs/featured")
            set({featuredSongs:response.data});
        }
        catch(error:any){
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false});
        }
    },
    fetchMadeForYouSongs: async()=>{
        set({isLoading:true,error:null})

        try{
            const response = await axiosInstance.get("/songs/made-for-you")
            set({madeForYouSongs:response.data});
        }
        catch(error:any){
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false});
        }
    },
    fetchSongs:async () => { 
        set({isLoading:true,error:null})
        
        try{
            const response = await axiosInstance.get("/songs/")
            set({songs:response.data});
        }
        catch(error:any){
             set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false});
        }
    },
    fetchStats:async () => {
        set({isLoading:true,error:null})
        try{
            const response = await axiosInstance.get("/stats/")
            set({stats:response.data});
        }
        catch(error:any){
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false});
        }
    },
    addSong:async(title:string,artist:string) => {  
        set({isLoading:true,error:null})

        try{
            await axiosInstance.post(`/admin/songs/${encodeURIComponent(title)}/${encodeURIComponent(artist)}`)
        }
        catch(error:any){
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false});
        }
    },
    deleteSong:async(id: string) => {
        set({isLoading:true,error:null})
        try{
            await axiosInstance.delete(`/admin/songs/${id}`)

            set(state => ({
                songs: state.songs.filter(song => song._id !== id)
            }))
            toast.success("Song Deleted Successfully!")
        }
        catch(error){
            set({error:"Could not delete the song"})
            toast.error("Error Deleting the Song")
        }
        finally{
            set({isLoading:false});
        }
        
    },
    deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},
   
}));