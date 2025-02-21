import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  color: black;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #1a8cff;
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1a8cff;
`;

const Field = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: black;
  font-size: 1rem;

  /* Style for checkbox labels */
  &:has(input[type="checkbox"]) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    &:hover {
      color: #1a8cff;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: white;
  color: black;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1a8cff;
    box-shadow: 0 0 0 2px rgba(26, 140, 255, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    color: #666;
    cursor: not-allowed;
  }

  /* Style for checkboxes */
  &[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin: 0;
    cursor: pointer;
    accent-color: #1a8cff;
  }
`;

const Button = styled.button`
  background: #1a8cff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: #0066cc;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const LogoutButton = styled(Button)`
  background: transparent;
  border: 2px solid #1a8cff;
  color: #1a8cff;
  margin-top: 2rem;
  font-weight: 600;
  padding: 14px 32px;
  font-size: 1.1rem;

  &:hover {
    background: rgba(26, 140, 255, 0.1);
    border-color: #0066cc;
    color: #0066cc;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    followers: false,
    liveStreams: false
  });
  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showActivity: true
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyChange = (setting) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <SettingsContainer>
      <Title>Settings</Title>

      <Section>
        <SectionTitle>Profile Settings</SectionTitle>
        <Field>
          <Label>Display Name</Label>
          <Input 
            type="text" 
            value={user.displayName || ''} 
            disabled
            placeholder="No display name set"
          />
        </Field>
        <Field>
          <Label>Email</Label>
          <Input 
            type="email" 
            value={user.email || ''} 
            disabled
            placeholder="No email set"
          />
        </Field>
      </Section>

      <Section>
        <SectionTitle>Notification Settings</SectionTitle>
        <Field>
          <Label>
            <Input 
              type="checkbox"
              checked={notifications.followers}
              onChange={() => handleNotificationChange('followers')}
            />
            Email notifications for new followers
          </Label>
        </Field>
        <Field>
          <Label>
            <Input 
              type="checkbox"
              checked={notifications.liveStreams}
              onChange={() => handleNotificationChange('liveStreams')}
            />
            Email notifications for live streams
          </Label>
        </Field>
      </Section>

      <Section>
        <SectionTitle>Privacy Settings</SectionTitle>
        <Field>
          <Label>
            <Input 
              type="checkbox"
              checked={privacy.privateAccount}
              onChange={() => handlePrivacyChange('privateAccount')}
            />
            Private account
          </Label>
        </Field>
        <Field>
          <Label>
            <Input 
              type="checkbox"
              checked={privacy.showActivity}
              onChange={() => handlePrivacyChange('showActivity')}
            />
            Show activity status
          </Label>
        </Field>
      </Section>

      <LogoutButton onClick={handleLogout}>
        Sign Out
      </LogoutButton>
    </SettingsContainer>
  );
};

export default Settings;
