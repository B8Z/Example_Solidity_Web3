import React, { Component } from 'react'
import logo from '../logo.png'
import telegram_logo from '../telegram-logo.png'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-2 shadow">
        <a
          className="navbar-brand col-sm-1 col-md-2 mr-0"
          href="https://VCS.crypto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; VCS
        </a>
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://telegram.me/collablandbot?start=VFBDI1RFTCNDT01NIy0xMDAxMjIyOTQ3NTQy"
        >
        <img src={telegram_logo} width="30" height="30" className="d-inline-block align-top" alt="" />
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">Metamask Account: {this.props.account}</small>
            </small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
