import styled from 'styled-components';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding-top: 60px;
  max-width: 1800px;
  margin: 0 auto;
  padding: 80px 20px 20px;
`;

const MainLayout = () => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;