import styled from 'styled-components';
import VideoFeed from '../components/video/VideoFeed';
import LiveStream from '../components/stream/LiveStream';

const FollowingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text};
  grid-column: 1 / -1;
`;

const Following = () => {
  // This would normally come from a user context or state management
  const hasFollowedUsers = true; // TODO: Replace with actual following state

  if (!hasFollowedUsers) {
    return (
      <EmptyStateMessage>
        <h2>Start Following Users</h2>
        <p>Videos from users you follow will appear here</p>
      </EmptyStateMessage>
    );
  }

  return (
    <FollowingContainer>
      <LiveStream followingOnly={true} />
      <VideoFeed followingOnly={true} />
    </FollowingContainer>
  );
};

export default Following;
