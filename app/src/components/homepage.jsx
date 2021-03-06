import React, { Component } from 'react';
import { Card, Grid } from '@material-ui/core';
import Firebase from 'firebase';
import Loading from './loading.jsx';
import MenuAppBar from './header.jsx';
import AdminView from './admin/adminView.jsx';
import RoomAdminView from './roomAdmin/roomAdminView.jsx'
import UserView from './user/userView.jsx';
import '../styles/homepage.css';

/**
 * the Homepage componenet decides which view should be displayed,
 * This is done by retrieving user data from firebase then depending
 * on their permissions, selects which view they can see.
 */
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: { permission: "user" },
      ip: "mqtt://100.68.110.31:9001",
      selectedView: "user",
    };
    this.renderPermissionView = this.renderPermissionView.bind(this);
    this.changeView = this.changeView.bind(this);
  }

  /**
   * checks uid of currently signed in user. then retieves user data
   * from the firebase database.
   * also gets all room data,
   * then stores this data into the state of the homepage componenet,
   * to be passed to individual components.
   */
  async componentWillMount() {
    const uid = Firebase.auth().currentUser.uid;
    let user;
    // gets user detials from firebase
    await Firebase.database().ref('users/' + uid).once('value')
    .then(snapshot => {
      user = snapshot.val() || { permission: "user" };
    }); 

    let rooms;
    // gets room details from firebase
    await Firebase.database().ref('rooms/').once('value')
    .then(snapshot => {
      rooms = snapshot.val() || {};
    });

    // create a list of views that the current users permissions permit them to view
    let views;
    switch (user.permission) {
      case "super": {
        views = ["super", "roomAdmin", "user"];
      } break;
      case "roomAdmin": {
        views = ["roomAdmin", "user"];
      } break;
      case "user": {
        views = ["user"];
      } break;
    }

    this.setState({ loading: false, user, rooms, views, selectedView: views[0] });
  }

  /**
   * Changes the currently selected view to the new view
   * I.e. admin view -> user view
   */
  changeView(newView) {
    this.setState({ selectedView: newView });
  }

  /**
   * Display the currently selected view
   */
  renderPermissionView() {
    switch (this.state.selectedView) {
      case "super": {
        return (
          <AdminView ip={this.state.ip} user={this.state.user} />
        );
      }
      case "roomAdmin": {
        return (
            <RoomAdminView ip={this.state.ip} user={this.state.user} rooms={this.state.rooms} />
        )
      }
      case "user": {
        return (
          <UserView ip={this.state.ip} user={this.state.user} rooms={this.state.rooms} />
        );
      }
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      );
    }
    return (
      <div className="background">
        <MenuAppBar changeView={this.changeView} views={this.state.views}/>
        <Grid container>
          <Grid item xs={12}>
            <Card className="homepage-container">
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <h1>Room Access System</h1>
                  {this.renderPermissionView()}
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Homepage;
