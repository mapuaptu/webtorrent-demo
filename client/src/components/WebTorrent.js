import React, { Component } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import Container from './Container';
import styled from 'styled-components';
import axios from 'axios';
import Video from './Video';

const StyledInput = styled.div`
  margin-bottom: 40px;
  width: 500px;
  max-width: 100%;

  div {
    width: 100%;
  }

  input {
    width: 100%;
  }
`;

const StyledButton = styled.div`
  margin-bottom: 20px;
`;

class WebTorrent extends Component {
  state = {
    value: '',
    msg: '',
    showVideo: false,
    files: [],
    disabled: false,
    stats: {
      progress: 0,
      downloadSpeed: 0,
      ratio: 0,
    },
  };

  getStatus = async () => {
    const { error, data } = await axios.get('http://localhost:5000/status');

    this.setState(() => ({
      stats: data.stats,
    }));
  };

  handleSubmit = async () => {
    const { error, data } = await axios.post('http://localhost:5000/addtorrent', {
      value: this.state.value,
    });

    if (!error) {
      this.setState(() => ({
        showVideo: data.status === 200,
        msg: data.msg,
        files: data.files,
        disabled: true,
      }));

      this.interval = setInterval(this.getStatus, 1000);
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleChange = event => {
    event.persist();

    const value = event.target.value;

    this.setState(() => ({
      value,
    }));
  };

  render() {
    return (
      <Container>
        <StyledInput>
          <TextField
            id="webtorrent"
            label="Введите ссылку"
            name="webtorrent"
            required={true}
            onChange={this.handleChange}
          />
        </StyledInput>
        <StyledButton>
          <Button
            disabled={this.state.disabled}
            variant="contained"
            color="primary"
            onClick={this.handleSubmit}
          >
            Отправить
          </Button>
        </StyledButton>
        {this.state.files.map((file, index) => {
          return <Typography key={index}>{file.name}</Typography>;
        })}

        {this.state.showVideo && (
          <div>
            <Typography>Progress: {this.state.stats.progress}</Typography>
            <Typography>Speed: {this.state.stats.downloadSpeed}</Typography>
            <Typography>Ratio: {this.state.stats.ratio}</Typography>
          </div>
        )}

        {this.state.showVideo && <Video />}
      </Container>
    );
  }
}

export default WebTorrent;
