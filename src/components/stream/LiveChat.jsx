import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 10px;
  color: white;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const Message = styled.div`
  margin-bottom: 8px;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Username = styled.span`
  color: #ff4d4d;
  font-weight: bold;
  margin-right: 8px;
`;

const ChatInput = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #ff4d4d;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  background: #ff4d4d;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #ff3333;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const LiveChat = ({ streamId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Mock data for testing
  const mockMessages = [
    { id: 1, username: 'User1', text: 'Great stream! 🎉', timestamp: new Date() },
    { id: 2, username: 'User2', text: 'How did you learn this?', timestamp: new Date() },
    { id: 3, username: 'User3', text: '👏👏👏', timestamp: new Date() }
  ];

  useEffect(() => {
    // Simulate receiving initial messages
    setMessages(mockMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      username: 'CurrentUser',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message) => (
          <Message key={message.id}>
            <Username>{message.username}:</Username>
            {message.text}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <form onSubmit={handleSend}>
        <ChatInput>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={200}
          />
          <SendButton type="submit" disabled={!newMessage.trim()}>
            Send
          </SendButton>
        </ChatInput>
      </form>
    </ChatContainer>
  );
};

LiveChat.propTypes = {
  streamId: PropTypes.string.isRequired
};

export default LiveChat;
