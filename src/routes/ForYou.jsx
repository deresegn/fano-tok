import styled from 'styled-components';
import VideoFeed from '../components/video/VideoFeed';
import LiveStream from '../components/stream/LiveStream';

const ForYouContainer = styled.div`  // Renamed from HomeContainer
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const ForYou = () => {  // Renamed from Home
  return (
    <ForYouContainer>
      <LiveStream />
      <VideoFeed />
    </ForYouContainer>
  );
};

export default ForYou;