import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import LiveChat from './LiveChat';

const StreamContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  position: sticky;
  top: 70px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  height: calc(100vh - 100px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const VideoSection = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StreamInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
`;

const ViewerCount = styled.div`
  display: inline-block;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const ChatSection = styled.div`
  height: 100%;
  background: #1a1a1a;
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const LoadingMessage = styled.div`
  color: white;
  text-align: center;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  text-align: center;
  padding: 2rem;
`;

const LiveStream = ({ followingOnly }) => {
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(1234);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamer, setStreamer] = useState(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStreamer = {
          id: 'stream123',
          username: 'CodeMaster',
          isFollowed: true,
          videoUrl: '/videos/Sample1.mp4'
        };

        // Apply following filter if needed
        if (followingOnly && !mockStreamer.isFollowed) {
          setStreamer(null);
          return;
        }

        setStreamer(mockStreamer);
      } catch (err) {
        setError('Failed to load stream. Please try again.');
        console.error('Error fetching stream:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();

    // Simulate viewer count updates
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => clearInterval(viewerInterval);
  }, [followingOnly]);

  if (loading) {
    return <LoadingMessage>Loading stream...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!streamer) {
    return (
      <LoadingMessage>
        No active streams {followingOnly ? 'from followed users ' : ''}at the moment.
      </LoadingMessage>
    );
  }

  return (
    <StreamContainer>
      <VideoSection>
        <Video
          src={streamer.videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
        <StreamInfo>
          <ViewerCount>{viewerCount.toLocaleString()} watching</ViewerCount>
        </StreamInfo>
      </VideoSection>
      <ChatSection>
        <LiveChat streamId={streamer.id} />
      </ChatSection>
    </StreamContainer>
  );
};

LiveStream.propTypes = {
  followingOnly: PropTypes.bool
};

LiveStream.defaultProps = {
  followingOnly: false
};

export default LiveStream;