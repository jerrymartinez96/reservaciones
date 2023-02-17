import React, { Component } from 'react';
import firebase_session from './components/hocs/user-session';
import ViewAdministrador from './components/screens/administrador';
import ViewDocente from './components/screens/docente';

class App extends Component{
  render(){
    let logout = this.props.logout;
    let data = this.props.data;
    let rol = this.props.credentials;
    let cd = this.props.calendarData;
    let noty = this.props.notification;

    if(rol === "Administrador"){
      return(
        <ViewAdministrador 
          logout={logout} 
          data={data} 
          calendarData={cd} 
          usuarios={this.props.usuarios}
          notification={noty}
          laboratorio={this.props.laboratorio}
          setLaboratorio={this.props.setLaboratorio}
        />
      );
    }else{
      return(
        <ViewDocente 
          logout={logout} 
          data={data} 
          calendarData={cd}
          notification={noty}
          laboratorio={this.props.laboratorio}
          setLaboratorio={this.props.setLaboratorio}
        />
      );
    }
  }
}

export default firebase_session(App);
