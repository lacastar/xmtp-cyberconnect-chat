import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useRef, useState, useEffect } from 'react'
import useXmtp from '../../hooks/useXmtp'
import useConversation from '../../hooks/useConversation'
import { MessagesList, MessageComposer } from '../../components/Conversation'
import Loader from '../../components/Loader'

const Conversation : NextPage = () => {
  const router = useRouter()
  const recipientWalletAddr = router.query.recipientWalletAddr as string
  const { walletAddress, client, getConnections } = useXmtp()
  const messagesEndRef = useRef(null)
  const scrollToMessagesEndRef = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
    getConnections()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesEndRef])

  const { messages, sendMessage, loading } = useConversation(
    recipientWalletAddr,
    scrollToMessagesEndRef
  )
  const [firstMessage, setFirstMessage] = useState<boolean>(false)
  useEffect(() => {
    setFirstMessage(!messages.find((msg) => msg.senderAddress === walletAddress))
  }, [messages, walletAddress])
  
  if (!recipientWalletAddr || !walletAddress || !client) {
    return <div />
  }
  if (loading && !messages?.length) {
    return (
      <Loader
        headingText="Loading messages..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }
  
  return (
    <main className="flex flex-col flex-1 bg-white h-screen">
      <MessagesList
        messagesEndRef={messagesEndRef}
        messages={messages}
        walletAddress={walletAddress}
      />
      {walletAddress && <MessageComposer 
        toAddress={recipientWalletAddr}
        firstMessage= {firstMessage}
        onSend={sendMessage} />}
    </main>
  )
}

export default Conversation
