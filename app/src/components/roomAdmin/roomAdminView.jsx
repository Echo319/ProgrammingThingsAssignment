import React, { Component } from 'react';
import GiveAccess from '../roomAdmin/giveAccess.jsx';
import RemoveAccess from '../roomAdmin/removeAccess.jsx';
import CheckAccessExists from '../roomAdmin/checkAccessExists.jsx';
import DisplayRoomUsers from './displayRoomUsers.jsx';
import { Connector } from 'mqtt-react';
import {
  Grid,
} from '@material-ui/core';

const ip = "mqtt://100.68.110.31:9001";

class RoomAdminView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Connector mqttProps={ip}>
              <div className="displayRooms-container">
                <h3>My Room</h3>
                <p>
                  {this.props.user.roomNumber}
                </p>
              </div>
            </Connector>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Connector mqttProps={ip}>
              <DisplayRoomUsers roomNumber={this.props.user.roomNumber}/>
            </Connector>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Connector mqttProps={ip}>
              <GiveAccess roomNumber={this.props.user.roomNumber}/>
            </Connector>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Connector mqttProps={ip}>
              <RemoveAccess roomNumber={this.props.user.roomNumber}/>
            </Connector>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Connector mqttProps={ip}>
              <CheckAccessExists roomNumber={this.props.user.roomNumber}/>
            </Connector>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default RoomAdminView;