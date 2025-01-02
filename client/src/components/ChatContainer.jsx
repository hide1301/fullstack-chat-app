import { Fragment, useEffect, useRef } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { formatMessageTime, groupMessagesByDate } from '../lib/utils'
import FullscreenImage from './FullscreenImage'

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessages()

    return () => unsubscribeFromMessages()
  }, [
    getMessages,
    selectedUser._id,
    subscribeToMessages,
    unsubscribeFromMessages,
  ])

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
          <Fragment key={date}>
            {/* Render date */}
            <div className="text-center text-gray-500 my-4">{date}</div>

            {/* Render messages */}
            {msgs.map((msg) => (
              <div
                ref={messageEndRef}
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? 'chat-end' : 'chat-start'
                }`}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        msg.senderId === authUser._id
                          ? authUser.profilePic || '/avatar.png'
                          : selectedUser.profilePic || '/avatar.png'
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(msg.createdAt)}
                  </time>
                </div>

                <div className="chat-bubble flex flex-col">
                  {msg.image && (
                    <FullscreenImage src={msg.image} alt="attachment" />
                  )}
                  {msg.text && <p>{msg.text}</p>}
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}
export default ChatContainer
