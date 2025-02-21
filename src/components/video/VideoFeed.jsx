import styled from 'styled-components';
import VideoCard from './VideoCard';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { listUserVideos } from '../../services/videoService';

const FeedContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.error || '#ff0000'};
`;

const RetryButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary || '#3498db'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const VideoFeed = ({ followingOnly, userOnly, likedOnly }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        // For now, we'll just load the current user's videos
        // You can expand this based on followingOnly, userOnly, and likedOnly props
        if (currentUser) {
          const userVideos = await listUserVideos(currentUser.uid);
          setVideos(userVideos.map(video => ({
            id: video.name,
            url: video.url,
            user: {
              id: currentUser.uid,
              name: currentUser.displayName || 'Anonymous',
              avatar: currentUser.photoURL || '/default-avatar.png'
            },
            description: `Video: ${video.name}`,
            likes: 0,
            comments: []
          })));
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [currentUser, followingOnly, userOnly, likedOnly]);

  if (loading) {
    return (
      <LoadingMessage>
        <LoadingSpinner />
        Loading videos...
      </LoadingMessage>
    );
  }

  if (error) {
    return (
      <LoadingMessage>
        {error}
      </LoadingMessage>
    );
  }

  if (videos.length === 0) {
    return (
      <LoadingMessage>
        No videos found. Try uploading some!
      </LoadingMessage>
    );
  }

  return (
    <FeedContainer>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
        />
      ))}
    </FeedContainer>
  );
};

VideoFeed.propTypes = {
  followingOnly: PropTypes.bool,
  userOnly: PropTypes.bool,
  likedOnly: PropTypes.bool
};

VideoFeed.defaultProps = {
  followingOnly: false,
  userOnly: false,
  likedOnly: false
};

export default VideoFeed;