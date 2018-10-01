import React, { Component } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import Container from './Container';
import styled from 'styled-components';
import axios from 'axios';

const StyledInput = styled.div`
  margin-bottom: 40px;
`;

class WebTorrent extends Component {
  state = {
    value: '',
    response: '',
  };

  handleSubmit = () => {
    axios
      .post(
        'http://localhost:5000/webtorrent',
        {
          value: this.state.value,
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then(response => {
        console.log(response);

        this.setState(() => ({
          response: response.data.msg,
        }));
      });
  };

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
        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
          Отправить
        </Button>
        <Typography>{this.state.response}</Typography>
      </Container>
    );
  }
}

export default WebTorrent;
