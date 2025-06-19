import { axiosInstance } from '@/lib/axios';
import type { Message, User } from '@/types';
import {create} from 'zustand';
import { io } from 'socket.io-client';

interface ChatStore{
    isLoading:boolean,
    error:string|null,
    users:User[],
    
    socket:any,
    isConnected:boolean,
    onlineUsers: Set<string>,
    userActivities : Map <string,string>,
    messages: Message[],
    selectedUser:User | null

    fetchAllUsers:() => Promise<void>,
    initSocket: (userId:string) => void,
    sendMessage: (senderId:string,receiverId:string, content:string) => void,
    disconnectSocket: () => void,
    fetchMessages: (userId:string) => Promise<void>
    setSelectedUser: (user:User | null) => void
}

const baseURL = "http://localhost:5000";
const socket = io(baseURL,{
    autoConnect:false, // only connect if the user is authenticated
    withCredentials:true, // to allow cookies to be sent with the request
})

export const useChatStore = create<ChatStore>((set,get) => ({
    isLoading:false,
    error:null,
    users:[],
    isConnected:false,
    onlineUsers:new Set(),
    userActivities:new Map(),
    messages:[],
    socket:socket,
    selectedUser:null,

    setSelectedUser:(user:User | null) => {
        set({selectedUser:user});
    },
    fetchAllUsers:async() =>{
        set({isLoading:true,error:null})

        try{
            const response = await axiosInstance.get("/users/");
            set({users:response.data})
        }
        catch(error:any){
            set({error:error.response.data.message});
        }
        finally{
            set({isLoading:false});
        }
    },
    initSocket: (userId:string) => {
        if(!get().isConnected){
            
            socket.auth = {userId}
            socket.connect();
            socket.emit("user_connected", userId);

            socket.on("users_online",(users:string[]) => {
                set({onlineUsers:new Set(users)}); 
            })

            socket.on("activities",(activities:[string,string][]) => {
                set({userActivities:new Map(activities)});
            })

            socket.on("user_connected",(userId:string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId])
                }))
            })
            socket.on("user_disconnected",(userId:string) => {
                set((state) => {
                    const updatedUsers = new Set(state.onlineUsers);
                    updatedUsers.delete(userId);
                    return {onlineUsers: updatedUsers};
                })
            })

            socket.on("receive_message",(message:Message) => {
                set((state) => ({
                    messages:[...state.messages,message]
                }))
            })

            socket.on("message_sent",(message:Message) => {
                set((state) => ({
                    messages:[...state.messages,message]
                }));
            });

            socket.on("activity_updated",({userId,activity} :{userId:string,activity :string}) => {
                set((state) => {
                    const newActivities = new Map(state.userActivities)
                    newActivities.set(userId,activity);
                    return {userActivities:newActivities};
                })
            })
            set({isConnected:true});
        }
    },
    sendMessage: async (senderId:string, receiverId:string, content:string) => {
        const socket = get().socket;
        if(!socket) return 

        socket.emit("send_message",{receiverId,senderId,content})
    },
    disconnectSocket: ()=>{
        if(get().isConnected){
            socket.disconnect();
            set({isConnected:false});
        }
    },
    fetchMessages: async(userId:string) => {
        set({isLoading:false,error:null})
        const response = await axiosInstance.get(`users/messages/${userId}`)

        try{
            set({messages:response.data})
        }
        catch(error:any){
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false});
        }
    }

    
}))