import React, {Component} from 'react';
import {Redirect, Route} from "react-router-dom";
import {userChange} from '../services/firebase';
import Login from '../components/Login';

export const contextRes = React.createContext();

export class ComprobacionesContext extends Component{
    
    state = {
        firebaseReady: false,
        isLoggedIn: false,
        isLogOut: false,
        userData: [],
        reservaciones: [],
    }

    componentDidMount(){
        userChange((userData) => {
            if(userData){
                this.setState({
                    firebaseReady: true,
                    isLoggedIn: true,
                    userData: userData, 
                });
            }else{
                this.setState({
                    firebaseReady: true,
                    isLoggedIn: false,
                    userData: [], 
                })
            }
        });
    }

    render(){

        return(
            <contextRes.Provider value={this.state}> 
                {
                this.state.isLoggedIn
                ? 
                this.props.children 
                : 
                <React.Fragment>
                    <Route path="/login" component={Login}/>
                    <Redirect from="/" to="/login"/>
                    <Redirect from="/reservaciones" to="/login"/>
                </React.Fragment>
                
                } 
            </contextRes.Provider>
        );

    }
}

export const ComisionesCunsumer = contextRes.Consumer;