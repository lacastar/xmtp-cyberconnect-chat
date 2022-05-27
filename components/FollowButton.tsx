import useXmtp from '../hooks/useXmtp'

type FollowButtonProps = {
  toAddress: string
}

const FollowButton = ({ toAddress}: FollowButtonProps): JSX.Element => {
  const {
    followings,
    toggleFollowing,
  } = useXmtp()

  const handleFollow = () => {
    toggleFollowing(toAddress)
  }
  
  return (
    <a
      onClick={handleFollow}
      className="cursor-pointer text-right font-bold text-blue-600"
    >
      {followings && followings[toAddress.toLowerCase()]?"Stop following":"Follow address"}
    </a>
  )

}

export default FollowButton
