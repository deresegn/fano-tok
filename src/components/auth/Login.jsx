import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 20px;
  background: #000;
  color: white;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 2rem;
  color: #ff4d4d;
`;

const Subtitle = styled.p`
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

const Button = styled.button`
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background: #ff3333;
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

const ErrorMessage = styled.div`
  color: #ff4d4d;
  margin-top: 1rem;
  padding: 10px;
  border-radius: 4px;
  background: rgba(255, 77, 77, 0.1);
`;

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/', { replace: true });
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome to Fano Tok</Title>
        <Subtitle>Sign in to start sharing and watching videos</Subtitle>
        <Button onClick={handleGoogleSignIn} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
