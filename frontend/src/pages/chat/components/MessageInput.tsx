import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/stores/useChatStore'
import { useUser } from '@clerk/clerk-react'
import { Send } from 'lucide-react'
import React, { useState } from 'react'

const MessageInput = () => {
    const { user } = useUser()
    const { selectedUser,sendMessage} = useChatStore()
    const [newMessage,setNewMessage] = useState("")


    const handleSend = () => {
        if(!user || !selectedUser || !newMessage) return

        sendMessage(user.id,selectedUser.clerkId,newMessage.trim())
        setNewMessage("")
    }
    return (
        <div className='mt-auto p-4 border-t border-zinc-700'>
            <div className='flex gap-2'>
                <Input placeholder='Type a Message'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className='bg-zinc-800 border-none'
                onKeyDown={(e) => e.key === "Enter" && handleSend()}/>
            
                <Button size={"icon"} onClick={handleSend} className='bg-blue-600 text-white hover:bg-blue-600'>
                    <Send className='size-4' />
                </Button>
            </div>

        </div>
    )
}

export default MessageInput
