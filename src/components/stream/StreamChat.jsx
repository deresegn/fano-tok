import styled from 'styled-components';
import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const ChatContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${({ theme }) => theme.colors.background};
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 0.5rem;
  
  span {
    &.username {
      font-weight: bold;
      color: ${({ theme }) => theme.colors.primary};
      margin-right: 0.5rem;
    }
  }
`;

const ChatInput = styled.div`
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.background};
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 20px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.darkBlue};
  }
`;

const StreamChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, username: 'user1', text: 'Hello everyone!' },
    { id: 2, username: 'user2', text: 'Great stream!' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        username: 'you',
        text: newMessage.trim()
      }]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatMessages>
        {messages.map(message => (
          <Message key={message.id}>
            <span className="username">@{message.username}</span>
            <span>{message.text}</span>
          </Message>
        ))}
      </ChatMessages>
      <ChatInput>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <SendButton onClick={handleSend}>
          <FaPaperPlane />
          Send
        </SendButton>
      </ChatInput>
    </ChatContainer>
  );
};

export default StreamChat;