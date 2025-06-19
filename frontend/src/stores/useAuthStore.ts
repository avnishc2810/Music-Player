import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface AuthStore{
    isLoading:boolean,
    error:string | null,
    isAdmin:boolean,
    reset : () => void,
    checkAdminStatus :() => Promise<void>
        
}

export const useAuthStore = create<AuthStore>((set) => ({
    isLoading:false,
    error:null,
    isAdmin:false,
    reset : () => {
        set({isLoading:false,isAdmin:false,error:null})
    },
    checkAdminStatus: async() => {
        set({isLoading:true,error:null})
        try{
            const response = await axiosInstance.get("/admin/check")
            set({isAdmin:response.data.admin})
        }
        catch(error:any){
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false});
        }
    },
}))