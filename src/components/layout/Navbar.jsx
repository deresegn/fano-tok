import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaUserFriends, FaUser, FaUpload, FaCog, FaSearch } from 'react-icons/fa';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.background || '#fff'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  color: ${({ theme }) => theme.colors.primary || '#000'};
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text || '#000'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.2s;
  text-decoration: none;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primaryLight || '#e6e6e6' : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight || '#e6e6e6'};
  }

  svg {
    font-size: 1.2rem;
  }
`;

const UploadButton = styled(NavLink)`
  background-color: ${({ theme }) => theme.colors.primary || '#000'};
  color: ${({ theme }) => theme.colors.white || '#fff'};
  font-weight: bold;

  &:hover {
    opacity: 0.9;
    background-color: ${({ theme }) => theme.colors.primary || '#000'};
  }
`;

const Navbar = () => {
  const location = useLocation();

  return (
    <Nav>
      <Logo to="/">FANO TOK</Logo>
      <NavLinks>
        <NavLink to="/" active={location.pathname === '/' ? 1 : 0}>
          For You
        </NavLink>
        <NavLink 
          to="/following" 
          active={location.pathname === '/following' ? 1 : 0}
        >
          <FaUserFriends /> Following
        </NavLink>
        <NavLink 
          to="/search" 
          active={location.pathname === '/search' ? 1 : 0}
        >
          <FaSearch /> Search
        </NavLink>
        <UploadButton 
          to="/upload"
          active={location.pathname === '/upload' ? 1 : 0}
        >
          <FaUpload /> Upload
        </UploadButton>
        <NavLink 
          to="/profile" 
          active={location.pathname === '/profile' ? 1 : 0}
        >
          <FaUser /> Profile
        </NavLink>
        <NavLink 
          to="/settings"
          active={location.pathname === '/settings' ? 1 : 0}
        >
          <FaCog /> Settings
        </NavLink>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;