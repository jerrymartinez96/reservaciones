import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Reservaciones from '../reservaciones';

class ViewDocente extends Component{
    render(){
        let logout = this.props.logout;
        let data = this.props.data;
        let cd = this.props.calendarData;
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
                    <Redirect from="/" to="/reservaciones"/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default ViewDocente;