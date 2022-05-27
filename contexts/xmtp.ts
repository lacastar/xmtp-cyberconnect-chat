import { createContext, Dispatch } from 'react'
import { Client, Message } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {
  wallet: Signer | undefined
  walletAddress: string | undefined
  client: Client | undefined
  conversations: Conversation[]
  loadingConversations: boolean
  getMessages: (peerAddress: string) => Message[]
  dispatchMessages?: Dispatch<MessageStoreEvent>
  connect: (wallet: Signer) => void
  disconnect: () => void
  followings : {[x: string]: boolean}
  followers : {[x: string]: boolean}
  toggleFollowing: (toAddress: string) => void
  getConnections: () => void
}

export const XmtpContext = createContext<XmtpContextType>({
  wallet: undefined,
  walletAddress: undefined,
  client: undefined,
  conversations: [],
  loadingConversations: false,
  getMessages: () => [],
  connect: () => undefined,
  disconnect: () => undefined,
  followings: {},
  followers: {},
  toggleFollowing: () => undefined,
  getConnections: () => undefined
})

export default XmtpContext
