import './avatar.css';

type AvatarProps = {
  userName: string;
}

export const Avatar = (props: AvatarProps) => {
  return (
    <button class='avatar'>
      <p class="avatar-letter">{props.userName?.[0]}</p>
    </button>
  )
}