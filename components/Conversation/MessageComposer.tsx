import React, { useCallback, useEffect, useState } from 'react'
import { classNames } from '../../helpers'
import messageComposerStyles from '../../styles/MessageComposer.module.scss'
import upArrowGreen from '../../public/up-arrow-green.svg'
import upArrowGrey from '../../public/up-arrow-grey.svg'
import { useRouter } from 'next/router'
import useXmtp from '../../hooks/useXmtp'

type MessageComposerProps = {
  toAddress: string
  firstMessage: boolean
  onSend: (msg: string) => Promise<void>
}

const MessageComposer = ({ toAddress, firstMessage, onSend }: MessageComposerProps): JSX.Element => {
  const {
    followers,
    followings,
    toggleFollowing,
  } = useXmtp()
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => setMessage(''), [router.query.recipientWalletAddr])

  const onMessageChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => setMessage(e.currentTarget.value),
    []
  )

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!(message && (firstMessage || followers[toAddress.toLowerCase()]))) {
        return
      }
      setMessage('')
      if ( !followings[toAddress.toLowerCase()]) {
        toggleFollowing(toAddress)
      }
      await onSend(message)
    },
    [message, firstMessage, followers, toAddress, followings, onSend, toggleFollowing]
  )
 
  return (
    <div
      className={classNames(
        'sticky',
        'bottom-3 md:bottom-2',
        'z-10',
        'flex-shrink-0',
        'flex',
        'h-16',
        'bg-white',

        messageComposerStyles.container
      )}
    >
      <form
        className={classNames(
          'flex',
          'w-full',
          'border',
          'py-2',
          'pl-4',
          'mr-3',
          messageComposerStyles.bubble
        )}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Type something..."
          className={classNames(
            'block',
            'w-full',
            'text-md',
            'md:text-sm',
            messageComposerStyles.input
          )}
          name="message"
          value={message}
          onChange={onMessageChange}
          required
        />
        <button type="submit" className={messageComposerStyles.arrow}>
          <img
            src={message && (firstMessage || followers[toAddress.toLowerCase()] )  ? upArrowGreen : upArrowGrey}
            alt="send"
            height={32}
            width={32}
          />
        </button>
      </form>
    </div>
  )
}

export default MessageComposer
