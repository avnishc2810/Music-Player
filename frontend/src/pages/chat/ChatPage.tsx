import TopBar from '@/components/TopBar'
import { useChatStore } from '@/stores/useChatStore'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useRef } from 'react'
import UsersList from './components/UsersList'
import ChatHeader from './components/ChatHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import MessageInput from './components/MessageInput'

const ChatPage = () => {

  const { users, messages, selectedUser, fetchAllUsers, fetchMessages } = useChatStore()
  const { user } = useUser()
  console.log("loll", user)

  useEffect(() => {
    if (user) fetchAllUsers()

  }, [fetchAllUsers, user])

  function formatDateTime(isoString: string) {
    return new Date(isoString)
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-");
  }

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId)
  }, [selectedUser, fetchMessages])

  const bottomRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    // Scroll to bottom when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
      <TopBar />

      <div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)] bg-black'>
        <UsersList />

        <div className='flex flex-col h-full'>
          {selectedUser ? (
            <>
              <ChatHeader />

              <ScrollArea className='h-[calc(100vh-340px)]'>
                <div className='p-4 space-y-4'>
                  {messages.map((message) => (
                    <div key={message._id}
                      className={`flex items-start gap-3 ${message.senderId === user?.id ? "flex-row-reverse" : ""}`} >
                      <Avatar className='size-8'>
                        <AvatarImage src={message.senderId === user?.id ? user.imageUrl : selectedUser.imageUrl} />

                      </Avatar>

                      <div className={`rounded-lg p-3 max-w-[70%] 
                          ${message.senderId === user?.id ? "bg-green-500 text-black fonn-medium" : "bg-zinc-600"}`}>
                        <p className='text-sm'>{message.content}</p>
                        <span className={`text-xs ${message.senderId === user?.id ? "text-black" : "text-white"} mt-1 block`}>{formatDateTime(message.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (<NoConversationPlaceholder />)}
        </div>
      </div>


    </main>
  )
}

const NoConversationPlaceholder = () => (
  <div className='flex flex-col items-center justify-center h-full space-y-6'>
    <img src='/logo.png' alt='image' className='size-16 animate-bounce invert' />
    <div className='text-center'>
      <h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
      <p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
    </div>
  </div>
);

export default ChatPage
