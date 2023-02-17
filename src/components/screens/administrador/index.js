import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Reportes from '../reportes';
import Reservaciones from '../reservaciones';
import Usuarios from '../usuarios';

class ViewAdministrador extends Component{
    render(){
        let logout = this.props.logout;
        let data = this.props.data;
        let cd = this.props.calendarData;
        let usrs = this.props.usuarios;
        let noty = this.props.notification;
        return(
            <BrowserRouter>
                <Switch>
                    <Route 
                        path="/reservaciones" 
                        component={() => 
                            <Reservaciones 
                                logout={logout} 
                                data={data} 
                                calendarData={cd} 
                                notification={noty}
                                laboratorio={this.props.laboratorio}
                                setLaboratorio={this.props.setLaboratorio}
                            />
                            
                    } 
                    />
                    <Route 
                        path="/usuarios" 
                        component={() => <Usuarios logout={logout} data={data} usuarios={usrs} notification={noty}/>} 
                    />
                    <Route
                        path="/reportes"
                        component={() => <Reportes logout={logout} data={data} usuarios={usrs} notification={noty} />}
                    />
                    <Redirect from="/" to="/reservaciones"/>
                </Switch>
            </BrowserRouter>
        );
    }

}

export default ViewAdministrador;