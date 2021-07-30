import React from 'react';
import { connect } from 'react-redux';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import auth from '../../../redux/actions/auths/index';

class DropdownProfile extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  render() {
    return (
      <Dropdown
        isOpen={this.state.dropdownOpen}
        toggle={this.toggle}
        className='dropdown navbar-user'
        tag='li'
      >
        <DropdownToggle tag='a'>
          <img
            src={this.props.currentUser.imageUrl}
            alt={this.props.currentUser.imageUrl}
          />
          <span className='d-none d-md-inline'>
            {this.props.currentUser.username}
          </span>{' '}
          <b className='caret'></b>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu dropdown-menu-right' tag='ul'>
          <DropdownItem disabled>Edit Profile</DropdownItem>
          {/*<DropdownItem>
            <span className='badge badge-danger pull-right'>2</span> Inbox
          </DropdownItem>*/}
          {/*<DropdownItem>Calendar</DropdownItem>*/}
          <DropdownItem disabled>Setting</DropdownItem>
          <div className='dropdown-divider'></div>
          <DropdownItem onClick={this.props.logOut}>Log Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(auth.logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DropdownProfile);
