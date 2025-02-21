import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { 
  getUserProfile, 
  followUser, 
  unfollowUser, 
  isFollowing,
  getFollowers,
  getFollowing
} from '../services/userService';

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: black;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #1a8cff;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1a8cff;
`;

const ProfileEmail = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.5rem 1rem;
  
  &:not(:last-child) {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a8cff;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: black;
  font-weight: 500;
`;

const StyledTabs = styled(Tabs)`
  .react-tabs__tab-list {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 2rem;
  }

  .react-tabs__tab {
    color: #666;
    padding: 1rem 2rem;
    cursor: pointer;
    
    &--selected {
      color: #1a8cff;
      border-bottom: 2px solid #1a8cff;
    }

    &:hover {
      color: #1a8cff;
    }
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
  }
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  padding: 1rem;
`;

const VideoTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: black;
`;

const VideoStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
`;

const FollowButton = styled.button`
  background: ${props => props.following ? '#e0e0e0' : '#1a8cff'};
  color: ${props => props.following ? '#666' : 'white'};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.following ? '#cccccc' : '#0066cc'};
  }
`;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const [selectedTab, setSelectedTab] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = !userId || userId === user?.uid;

  console.log('Profile component render:', {
    userId,
    isOwnProfile,
    userUid: user?.uid,
    loading,
    profileData
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        console.log('Loading profile data for:', {
          targetUserId: userId || user?.uid,
          isOwnProfile
        });

        const targetUserId = userId || user?.uid;
        if (!targetUserId) {
          console.log('No target user ID, redirecting to login');
          navigate('/login');
          return;
        }

        // Load profile data
        console.log('Fetching user profile...');
        const profile = await getUserProfile(targetUserId);
        console.log('Fetched profile:', profile);
        
        if (!profile) {
          console.error('Profile not found for ID:', targetUserId);
          setError('Profile not found');
          setLoading(false);
          return;
        }

        setProfileData(profile);

        // Check if the current user is following this profile
        if (!isOwnProfile && user) {
          console.log('Checking follow status...');
          const following = await isFollowing(user.uid, targetUserId);
          console.log('Follow status:', following);
          setIsFollowingUser(following);
        }

        // Load followers and following
        console.log('Loading followers and following...');
        const [followersData, followingData] = await Promise.all([
          getFollowers(targetUserId),
          getFollowing(targetUserId)
        ]);
        console.log('Loaded followers:', followersData);
        console.log('Loaded following:', followingData);
        
        setFollowers(followersData);
        setFollowing(followingData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    loadProfileData();
  }, [userId, user, navigate, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFollowingUser) {
        await unfollowUser(user.uid, userId);
        setIsFollowingUser(false);
        setFollowers(prev => prev.filter(f => f.uid !== user.uid));
      } else {
        await followUser(user.uid, userId);
        setIsFollowingUser(true);
        const currentUser = await getUserProfile(user.uid);
        setFollowers(prev => [...prev, currentUser]);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!profileData) {
    return <div>Profile not found</div>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileImage 
          src={profileData.photoURL || user?.photoURL || 'https://via.placeholder.com/150'} 
          alt="Profile" 
        />
        <ProfileInfo>
          <ProfileName>{profileData.displayName || 'Anonymous User'}</ProfileName>
          <ProfileEmail>{profileData.email || 'No email set'}</ProfileEmail>
          
          {!isOwnProfile && (
            <FollowButton 
              onClick={handleFollowToggle}
              following={isFollowingUser}
            >
              {isFollowingUser ? 'Unfollow' : 'Follow'}
            </FollowButton>
          )}

          <Stats>
            <StatItem>
              <StatNumber>{followers.length}</StatNumber>
              <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{following.length}</StatNumber>
              <StatLabel>Following</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{profileData.videoCount || 0}</StatNumber>
              <StatLabel>Videos</StatLabel>
            </StatItem>
          </Stats>
        </ProfileInfo>
      </ProfileHeader>

      <StyledTabs selectedIndex={selectedTab} onSelect={index => setSelectedTab(index)}>
        <TabList>
          <Tab>Videos</Tab>
          <Tab>Liked</Tab>
          {isOwnProfile && <Tab>Following</Tab>}
        </TabList>

        <TabPanel>
          <VideoGrid>
            {profileData.videos?.map(video => (
              <VideoCard key={video.id}>
                <VideoThumbnail src={video.thumbnail} alt={video.title} />
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoStats>
                    <span>{video.views} views</span>
                    <span>{video.likes} likes</span>
                  </VideoStats>
                </VideoInfo>
              </VideoCard>
            ))}
          </VideoGrid>
        </TabPanel>

        <TabPanel>
          <VideoGrid>
            {profileData.likedVideos?.map(video => (
              <VideoCard key={video.id}>
                <VideoThumbnail src={video.thumbnail} alt={video.title} />
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoStats>
                    <span>{video.views} views</span>
                    <span>{video.likes} likes</span>
                  </VideoStats>
                </VideoInfo>
              </VideoCard>
            ))}
          </VideoGrid>
        </TabPanel>

        {isOwnProfile && (
          <TabPanel>
            <VideoGrid>
              {following.map(follow => (
                <VideoCard 
                  key={follow.uid}
                  onClick={() => navigate(`/profile/${follow.uid}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <VideoThumbnail src={follow.photoURL || 'https://via.placeholder.com/150'} alt="Following" />
                  <VideoInfo>
                    <VideoTitle>{follow.displayName || 'User'}</VideoTitle>
                  </VideoInfo>
                </VideoCard>
              ))}
            </VideoGrid>
          </TabPanel>
        )}
      </StyledTabs>
    </ProfileContainer>
  );
};

export default Profile;
