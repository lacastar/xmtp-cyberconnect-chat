# ETH Shanghai Hackathon 2022 Bounty #1
Building on the React Chat Example application this submission integrates CyberConnect Protocol to implement the following use-cases:
1. Adds filtering for the following conditions: all conversations, connections only, invites only
2. When the first message is sent to a peer, it automatically creates a follow relation with CyberConnect - it is also possible to follow and unfollow the specified address

A heuristic solution is used to implement the happy path and fulfill the requirements listed as a fully-featured UX:
1. When a message is sent to a new address it also creates a CyberConnect FOLLOW connection - and treated as a new connection request towards the peer
2. It is not poosible to send any further messages until the remote peer answers (and creates a backwards FOLLOW connection)
3. Once both parties follow eachother, they can send as many messages as they wish

This is the flow of the happy path. Although it is possible to manually follow and unfollow an address, it is only present for debug purposes, and can mess up the flow (but it can fix it as well).
Since to my knowledge it is not possible to subscribe to CyberConnect events, connection changes are checked when a new message is received. It is by no means optimal, but does work as a good enough solution instead of polling (the dapp creates connections first, and sends messages serialized later, so it should work as expected). If it seems that your dapp became inconsistent try to reload it.

I believe all of the requierements are met that were listed in the bounty description:
1. A user connects to the application using a wallet provider. - provided by the example application
2. The user should see a list of their conversations. - provided by the example application
3. The user can select a conversation, see a list of historical messages, send a new message to the other party, and see new messages from the other party in real-time. - provided by the example applications
4. The user can start a new conversation and specify any Ethereum or ENS address as the recipient. - provided by the example application
5. The user should be able to successfully send an arbitrary message to an address that is connected with them through CyberConnect, that is also registered with the XMTP network. - provided by the example application
6. The user should be able to send a connection request to a recipient address that is not yet connected with them through CyberConnect, that is registered with the XMTP network. - implemented: Sending a message to an unconnected recipient also creates a FOLLOW connection (and is treated as an invitation)
7. The user can include an arbitrary message with the connection request. - implemented: The first message sent creates the FOLLOW connection and will be displayed when the user filters for invites only.
8. The user cannot send further messages to that recipient address until the initial connection request has been accepted. - implemented: no further messages can be sent unless the recipient party answers (and creates a backward FOLLOW connection)
9. It is indicated to the user that they have a pending connection request with the recipient address. - implemented: filtering for new connections displays the pending connections (incoming conversations with only one message)
10. The user should see a warning when the recipient address is not registered with the XMTP network. - provided by the example application
11. The user can view inbound connection requests, accept them, and reply to the sender in a new conversation without needing to send a connection request of their own.- implemented: Filtering for invites and replying to them automatically creates the backwards connection to the peer.
12. The user can access an expanded inbox view that includes conversations with addresses they are not connected with through CyberConnect. - implemented: filtering for all peers will show conversations with addresses they are not connected with through CyberConnect

Also commited some console error fixes that were related to multiple elements with the same key.

Since this is my first React project, please be forgiving for any uncommon coding practices, it is possible that I have not arrived yet at the designated part of the tutorial where it is discussed ;) 

See the original readme below:

# React Chat Example

![Test](https://github.com/xmtp/example-chat-react/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/xmtp/example-chat-react/actions/workflows/lint.yml/badge.svg)
![Build](https://github.com/xmtp/example-chat-react/actions/workflows/build.yml/badge.svg)

![x-red-sm](https://user-images.githubusercontent.com/510695/163488403-1fb37e86-c673-4b48-954e-8460ae4d4b05.png)

**This example chat application demonstrates the core concepts and capabilities of the XMTP Client SDK.** It is built with React, [Next.js](https://nextjs.org/), and the [`xmtp-js`](https://github.com/xmtp/xmtp-js) client library. The application is capable of sending and receiving messages via the [XMTP Labs](https://xmtp.com) development network, with no performance guarantees and [notable limitations](#limitations) to its functionality.

It is maintained by [XMTP Labs](https://xmtp.com) and distributed under [MIT License](./LICENSE) for learning about and developing applications that utilize the XMTP decentralized communication protocol.

**All wallets and messages are forcibly deleted from the development network on Mondays.**

## Disclaimer

The XMTP protocol is in the early stages of development. This software is being provided for evaluation, feedback, and community contribution. It has not undergone a formal security audit and is not intended for production applications. Significant breaking revisions should be expected.

## Getting Started

### Configure Infura

Add your Infura ID to `.env.local` in the project's root.

```
NEXT_PUBLIC_INFURA_ID={YOUR_INFURA_ID}
```

If you do not have an Infura ID, you can follow [these instructions](https://blog.infura.io/getting-started-with-infura-28e41844cc89/) to get one.

_This example comes preconfigured with an Infura ID provided for demonstration purposes. If you plan to fork or host it, you must use your own Infura ID as detailed above._

### Install the package

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Functionality

### Wallet Connections

[`Web3Modal`](https://github.com/Web3Modal/web3modal) is used to inject a Metamask, Coinbase Wallet, or WalletConnect provider through [`ethers`](https://docs.ethers.io/v5/). Methods for connecting and disconnecting are included in **WalletContext** alongside the provider, signer, wallet address, and ENS utilities.

In order to use the application's chat functionality, the connected wallet must provide two signatures:

1. A one-time signature that is used to generate the wallet's private XMTP identity
2. A signature that is used on application start-up to initialize the XMTP client with that identity

### Chat Conversations

The application utilizes the `xmtp-js` [Conversations](https://github.com/xmtp/xmtp-js#conversations) abstraction to list the available conversations for a connected wallet and to listen for or create new conversations. For each convesation, it gets existing messages and listens for or creates new messages. Conversations and messages are kept in a lightweight store and made available through **XmtpContext** alongside the client and its methods.

### Limitations

The application's functionality is limited by current work-in-progress on the `xmtp-js` client.

#### Messages cannot yet be directed to wallets that have not used XMTP

The client will throw an error when attempting to lookup an address that does not have an identity broadcast on the XMTP network.

This limitation will be mitigated very soon by the example application's UI, and resolved soon via improvements to the `xmtp-js` library that will allow messages to be created even if the intended recipient has not yet generated its keys.
