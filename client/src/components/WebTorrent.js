import React, { Component, Fragment } from 'react';
import { TextField, Button, Typography, CircularProgress } from '@material-ui/core';
import Container from './Container';
import styled from 'styled-components';
import axios from 'axios';
import Video from './Video';
import Status from './Status';

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

const StyledProgress = styled.div`
  margin-top: 220px;
`;

const VideoContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const host = `http://localhost:5000`;

class WebTorrent extends Component {
  state = {
    value: '',
    disableAdd: true,
    disableInput: false,
    helperText: '',
    loading: false,
    msg: '',
    showVideo: false,
    files: [],
    torrents: '',
    stats: {
      progress: 0,
      downloadSpeed: 0,
    },
  };

  handleChange = event => {
    event.persist();

    const value = event.target.value;

    if (!value) {
      return this.setState(() => ({
        helperText: 'Ссылка не может быть пустой',
      }));
    }

    this.setState(() => ({
      value,
      disableAdd: false,
      helperText: '',
    }));
  };

  handleSubmit = async () => {
    try {
      this.setState(() => ({
        disableAdd: true,
        disableInput: true,
        loading: true,
      }));

      const { data } = await axios.post(`${host}/addtorrent`, {
        value: this.state.value,
      });

      this.setState(() => ({
        showVideo: true,
        loading: false,
        msg: data.msg,
        files: data.files,
        torrents: data.torrents,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  handleRemove = async () => {
    try {
      await axios.get(`${host}/removetorrent`);

      this.setState(() => ({
        disableAdd: false,
        disableInput: false,
        showVideo: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <Container>
        <StyledInput>
          <TextField
            disabled={this.state.disableInput}
            id="webtorrent"
            label="Введите ссылку"
            name="webtorrent"
            required={true}
            onChange={this.handleChange}
            helperText={this.state.helperText}
          />
        </StyledInput>
        <StyledButton>
          <Button
            disabled={this.state.disableAdd}
            variant="contained"
            color="primary"
            onClick={this.handleSubmit}
          >
            Добавить
          </Button>
        </StyledButton>

        {this.state.loading && (
          <StyledProgress>
            <CircularProgress />
          </StyledProgress>
        )}

        {this.state.showVideo && (
          <Fragment>
            <Status host={host} />
            <VideoContainer>
              <Video src={`${host}/stream?${Date.now()}`} />
              <Button variant="contained" color="secondary" onClick={this.handleRemove}>
                Удалить
              </Button>
            </VideoContainer>
          </Fragment>
        )}
      </Container>
    );
  }
}

export default WebTorrent;
