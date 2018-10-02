import React from 'react';
import styled from 'styled-components';

const StyledVideo = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  width: 500px;
  height: 100%;
  background-color: #000;
`;

const Video = props => {
  return (
    <StyledVideo>
      <video controls={true} src="http://localhost:5000/stream" width={500} height={310} />
    </StyledVideo>
  );
};

export default Video;
