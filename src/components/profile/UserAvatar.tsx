interface UserAvatarProps {
  image: string;
  alt: string;
  size?: number;
}

const UserAvatar = ({ image, alt, size = 12 }: UserAvatarProps) => {
  return (
    <div className={`w-${size} h-${size} ${size < 10 ? 'rounded-md' : 'rounded-xl'} overflow-hidden dark:bg-white`}>
      <img src={image} alt={alt} className='w-full h-full object-cover rounded-[10px]' />
    </div>
  );
};

export default UserAvatar;
