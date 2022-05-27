import { useCallback, useEffect, useReducer, useState } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'
import useMessageStore from '../hooks/useMessageStore'

import { CYBERCONNECT_ENDPOINT } from "../helpers/constants";
import { GraphQLClient, gql } from "graphql-request";
import { getErrorMessage } from '../helpers/string'
import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

// Initialize the GraphQL Client
const clientGQ = new GraphQLClient(CYBERCONNECT_ENDPOINT);

const GET_CONNECTIONS = gql`
  query($address: String!, $first: Int) {
    identity(address: $address) {
      followings(first: $first) {
        list {
          address
          domain
        }
      }
      followers(first: $first) {
        list {
          address
          domain
        }
      }
    }
  }
`;

type Following = {
  address: string
  domain: string
}

export const XmtpProvider: React.FC = ({ children }) => {
  const [wallet, setWallet] = useState<Signer>()
  const [walletAddress, setWalletAddress] = useState<string>()
  const [client, setClient] = useState<Client>()
  const { getMessages, dispatchMessages } = useMessageStore()
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false)

  const [followings, setFollowings] = useState<{[x: string]: boolean}>({})
  const [followers, setFollowers] = useState<{[x: string]: boolean}>({})

  const [conversations, dispatchConversations] = useReducer(
    (state: Conversation[], newConvos: Conversation[] | undefined) => {
      if (newConvos === undefined) {
        return []
      }
      newConvos = newConvos.filter(
        (convo) =>
          state.findIndex((otherConvo) => {
            return convo.peerAddress === otherConvo.peerAddress
          }) < 0 && convo.peerAddress != client?.address
      )
      return newConvos === undefined ? [] : state.concat(newConvos)
    },
    []
  )

  const connect = useCallback(
    async (wallet: Signer) => {
      setWallet(wallet)
      const walletAddr = await wallet.getAddress()
      setWalletAddress(walletAddr)
    },
    [setWallet, setWalletAddress]
  )

  const disconnect = useCallback(async () => {
    setWallet(undefined)
    setWalletAddress(undefined)
    setClient(undefined)
    dispatchConversations(undefined)
    setFollowers({})
    setFollowings({})
  }, [setWallet, setWalletAddress, setClient, dispatchConversations])

  
  const toggleFollowing = useCallback(async (
    toAddress:string, 
    ) => {
    try {
      if ( toAddress ) 
      {
        const cyberConnect = new CyberConnect({
          namespace: "CyberConnect",
          env: Env.PRODUCTION,
          chain: Blockchain.ETH,
          provider: window.ethereum
        });
        if ( followings[toAddress.toLowerCase()] ) {
          await cyberConnect.disconnect(toAddress);
          //followings[toAddress.toLowerCase()] = false
          setFollowings({...followings, [toAddress.toLowerCase()] : false })
        } else {
          await cyberConnect.connect(toAddress);
          setFollowings({...followings, [toAddress.toLowerCase()] : true })
        }
      }
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }, [followings])

  const getConnections = useCallback(async () => {

    let followings : {[x: string]: boolean} = {}
    let followers : {[x: string]: boolean} = {}
  
    const variables = {
      address: walletAddress
      // first: 5
    }
    let res = null
    if(walletAddress){
      try{
        res = await clientGQ.request(GET_CONNECTIONS, variables)
      } catch(e){
        console.log(getErrorMessage(e))
     }
    }
    followings = res?.identity?.followings?.list?.reduce((acc: { [x: string]: boolean; },curr: Following )=> (acc[curr.address.toLowerCase()]=true,acc),{});
    followers = res?.identity?.followers?.list?.reduce((acc: { [x: string]: boolean; },curr: Following )=> (acc[curr.address.toLowerCase()]=true,acc),{});
    setFollowings(followings)
    setFollowers(followers)
  },[walletAddress])

  useEffect(() => {
    const initClient = async () => {
      if (!wallet) return
      setClient(await Client.create(wallet))
    }
    initClient()
  }, [wallet])

  useEffect(() => {
    const listConversations = async () => {
      if (!client) return
      console.log('Listing conversations')
      setLoadingConversations(true)
      const convos = await client.conversations.list()
      convos.forEach((convo: Conversation) => {
        dispatchConversations([convo])
      })
      setLoadingConversations(false)
    }
    listConversations()
  }, [client, walletAddress])

  useEffect(() => {
    const streamConversations = async () => {
      if (!client) return
      const stream = client.conversations.stream()
      for await (const convo of stream) {
        dispatchConversations([convo])
      }
    }
    streamConversations()
  }, [client, walletAddress])

  useEffect(() => {
    getConnections()
  },[getConnections, walletAddress])

  const [providerState, setProviderState] = useState<XmtpContextType>({
    wallet,
    walletAddress,
    client,
    conversations,
    loadingConversations,
    getMessages,
    dispatchMessages,
    connect,
    disconnect,
    followings,
    followers,
    toggleFollowing,
    getConnections
  })

  useEffect(() => {
    setProviderState({
      wallet,
      walletAddress,
      client,
      conversations,
      loadingConversations,
      getMessages,
      dispatchMessages,
      connect,
      disconnect,
      followings,
      followers,
      toggleFollowing,
      getConnections
    })
  }, [
    wallet,
    walletAddress,
    client,
    conversations,
    loadingConversations,
    getMessages,
    dispatchMessages,
    connect,
    disconnect,
    followings,
    followers,
    toggleFollowing,
    getConnections
  ])

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
