import styled from 'styled-components';
import { useState } from 'react';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  background: #000;
`;

const VideoInfo = styled.div`
  padding: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Username = styled.span`
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightYellow};
  }
`;

const VideoCard = ({ video }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card>
      <Video controls>
        <source src={video?.url} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
      <VideoInfo>
        <UserInfo>
          <Avatar src={video?.user?.avatar} alt="User avatar" />
          <Username>@{video?.user?.username}</Username>
        </UserInfo>
        <ActionButtons>
          <ActionButton onClick={handleLike}>
            <FaHeart color={isLiked ? 'red' : 'currentColor'} />
            <span>{likes}</span>
          </ActionButton>
          <ActionButton>
            <FaComment />
            <span>0</span>
          </ActionButton>
          <ActionButton>
            <FaShare />
            <span>Share</span>
          </ActionButton>
        </ActionButtons>
      </VideoInfo>
    </Card>
  );
};

export default VideoCard;