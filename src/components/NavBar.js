// React Imports
import React, { Component } from "react";
//MDBootstrap Components
import { 
  MDBNavbar, 
  MDBNavbarBrand, 
  MDBNavbarNav, 
  MDBNavItem, 
  MDBNavLink, 
  MDBNavbarToggler, 
  MDBCollapse, 
  MDBDropdown,
  MDBDropdownToggle, 
  MDBDropdownMenu, 
  MDBDropdownItem, 
  MDBIcon 
} from "mdbreact";

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
// -------------------------------------------------------------
// avatar style css
const useStyles = makeStyles({avatar: {margin: 10,}, bigAvatar: {margin: 10, width: 60, height: 60,},});

class NavbarPage extends Component {
state = {
  isOpen: false,
  logOut: false
};

toggleCollapse = () => {
  this.setState({ isOpen: !this.state.isOpen });
}

render() {
  let image = this.props.data.userData.image;
  // if(this.state.logOut){return(<Redirect to="/login"/>);}
  let admin = this.props.rol === "Administrador" ?
    <MDBNavbarNav left>
      <MDBNavItem active={this.props.active === "reservaciones" ? true : false}>
        <MDBNavLink to="/reservaciones">Reservaciones</MDBNavLink>
      </MDBNavItem>
      <MDBNavItem active={this.props.active === "reportes" ? true : false}>
        <MDBNavLink to="/reportes">Reportes</MDBNavLink>
      </MDBNavItem>
      <MDBNavItem active={this.props.active === "usuarios" ? true : false}>
        <MDBNavLink to="/usuarios">Usuarios</MDBNavLink>
      </MDBNavItem>
      {/* <MDBNavItem>
        <MDBNavLink to="#!">Laboratorios</MDBNavLink>
      </MDBNavItem> */}
    </MDBNavbarNav>
  :
    <MDBNavbarNav left>
      <MDBNavItem active>
        <MDBNavLink to="/reservaciones">Reservaciones</MDBNavLink>
      </MDBNavItem>
    </MDBNavbarNav>
  ;
  return (
      <MDBNavbar color="special-color" dark expand="md">
        <MDBNavbarBrand>
          <strong className="white-text">{this.props.data.userData.nombre}</strong> 
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
          {admin}
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBDropdown dropleft>
                <MDBDropdownToggle nav>
                  {image ? <Avatar alt="Remy Sharp" src={image} className={useStyles.avatar} /> : <MDBIcon icon="user" />}
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default">
                  <MDBDropdownItem href="#!" onClick={this.props.logout}>Salir</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

export default NavbarPage;