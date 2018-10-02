import React from 'react';
import styled from 'styled-components';

const StyledVideo = styled.div`
  margin-top: 50px;
  width: 500px;
  height: 500px;
  background-color: #000;
`;

const Video = props => {
  return (
    <StyledVideo>
      <video controls={true} src="http://localhost:5000/stream" width={500} height={500} />
    </StyledVideo>
  );
};

export default Video;
