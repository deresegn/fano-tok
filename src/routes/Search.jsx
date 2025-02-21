import React, { useState } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const SearchContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 2rem;
  
  &:focus {
    outline: none;
    border-color: #1a8cff;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0;
  color: #1a8cff;
`;

const UserEmail = styled.p`
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const NoResults = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
`;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const searchUsers = async (term) => {
    if (!term.trim()) {
      setUsers([]);
      return;
    }

    setSearching(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('displayName', '>=', term),
        where('displayName', '<=', term + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const foundUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(foundUsers);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchUsers(term);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search users by name..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <UserList>
        {searching ? (
          <NoResults>Searching...</NoResults>
        ) : users.length > 0 ? (
          users.map(user => (
            <UserCard key={user.id} onClick={() => handleUserClick(user.id)}>
              <UserImage 
                src={user.photoURL || 'https://via.placeholder.com/50'} 
                alt={user.displayName} 
              />
              <UserInfo>
                <UserName>{user.displayName}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
            </UserCard>
          ))
        ) : searchTerm ? (
          <NoResults>No users found</NoResults>
        ) : null}
      </UserList>
    </SearchContainer>
  );
};

export default Search;
