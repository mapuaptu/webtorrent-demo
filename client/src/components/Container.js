import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  padding-top: 20px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
`;

const Container = props => {
  return <StyledContainer>{props.children}</StyledContainer>;
};

export default Container;
