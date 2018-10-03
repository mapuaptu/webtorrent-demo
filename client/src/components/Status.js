import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import axios from 'axios';

class Status extends Component {
  state = {
    stats: {
      progress: 0,
      downloadSpeed: 0,
    },
  };

  getStatus = async () => {
    try {
      const { data } = await axios.get(`${this.props.host}/status`);

      this.setState(() => ({
        stats: data.stats,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.interval = setInterval(this.getStatus, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <Typography>Progress: {this.state.stats.progress} %</Typography>
        <Typography>Speed: {(this.state.stats.downloadSpeed / 10 ** 6).toFixed(2)} Mb/s</Typography>
      </div>
    );
  }
}

export default Status;
