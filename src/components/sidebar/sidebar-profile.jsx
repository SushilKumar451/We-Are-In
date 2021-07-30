import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PageSettings } from './../../config/page-settings.js';

class SidebarProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileActive: 0,
    };
    this.handleProfileExpand = this.handleProfileExpand.bind(this);
  }

  handleProfileExpand(e) {
    e.preventDefault();
    this.setState((state) => ({
      profileActive: !this.state.profileActive,
    }));
  }

  render() {
    return (
      <PageSettings.Consumer>
        {({ pageSidebarMinify }) => (
          <ul className='nav'>
            <li
              className={
                'nav-profile ' + (this.state.profileActive ? 'expand ' : '')
              }
            >
              <Link to='/' onClick={this.handleProfileExpand}>
                <div className='cover with-shadow'></div>
                <div className='image'>
                  <img
                    src={this.props.currentUser.imageUrl}
                    alt={this.props.currentUser.imageUrl}
                  />
                </div>
                <div className='info'>
                  <b className='caret pull-right'></b>
                  {this.props.currentUser.username}
                  <small>Front end developer</small>
                </div>
              </Link>
            </li>
            <li className='d-none'>
              <ul
                className={
                  'nav nav-profile ' +
                  (this.state.profileActive && !pageSidebarMinify
                    ? 'd-block '
                    : '')
                }
              >
                <li>
                  <Link to='/'>
                    <i className='fa fa-cog'></i> Settings
                  </Link>
                </li>
                <li>
                  <Link to='/'>
                    <i className='fa fa-pencil-alt'></i> Send Feedback
                  </Link>
                </li>
                <li>
                  <Link to='/'>
                    <i className='fa fa-question-circle'></i> Helps
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        )}
      </PageSettings.Consumer>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps, null)(SidebarProfile);
