import React,{ Component, Fragment } from 'react';
import Notificaciones from '../untils/Notificaciones';
import {userChange, auth, provider, credentialsData,obtenerUsuarios} from '../../services/firebase';
import Login from '../Login';
import * as moment from 'moment';
moment.locale('es');

const styledef = {
    color: '#17a2b8',
    fontSize: '12px',
    width: '6rem',
    height: '6rem',
    marginLeft: '50%',
    marginTop: '200px',
}

export default function firebase_session(IOComponent){
    return class extends Component{
        constructor(props){
            super(props)
            this.state = { 
                firebaseReady: false,
                isLoggedIn: false,
                isLogOut: false,
                errorLog: false,
                awaitRol: true,
                userData: [],
                reservaciones: [],
                userRol:"",
                programas: [],
                usuarios: [],
                current_week: 0,
                current_year: 0,
                notification: false,
                notifType: 'success',
                notifBody: '',
                laboratorio: 0
                
            }
        }
        handleChangeLaboratorio = (laboratorio) => {
            this.setState({laboratorio:laboratorio});
        }

        handleLogin = () => {
            auth.signInWithPopup(provider) 
            .then(() => {
                console.log("login");
            }).catch((e) =>{
                if(e.code === "auth/network-request-failed"){
                    console.log("Error al conectar con el servidor, intentalo de nuevo.");
                }
            }); 
        }

        handleLogout = () => {
            const st = () =>{
                this.setState({
                    isLoggedIn: false,
                    firebaseReady: false
                });
            }
            auth.signOut() 
            .then(function() {
                st();
            }).catch(function(e) {
                console.log(e);
            });
        }

        handleGetUserRol = (data) => {
            this.setState({awaitRol: false});
            if(data.exists && data.data){
                let rol = data.data[0];
                if(rol.rol === 1){
                    this.setState({userRol: "Administrador"});
                }

                if(rol.rol === 2){
                    this.setState({userRol: "Docente"});
                }
            }else{
                this.setState({
                    isLoggedIn: false,
                    firebaseReady: true,
                    userData: false
                });
            }
        }

        // handleGetRes = (callback) => {

        // }

        handleNextWeek = () => {
            let neweek = this.state.current_week + 1;
            this.setState({current_week: neweek});
            this.setState({current_year:moment().week(neweek).year()});
            // console.log(this.state.current_year);
        }
        
        handleBackWeek = () => {
            let neweek = this.state.current_week - 1;
            this.setState({current_week: neweek});
            this.setState({current_year:moment().week(neweek).year()});
        }

        handleSetNotification = (type,body) => {
            this.setState({
                notification: true,
                notifType: type,
                notifBody: body
            });
        }

        handleCloseNotification = () => {
            this.setState({notification: false});
        }

        componentDidMount(){
            let c_week = moment().week();
            let c_year = moment().week(c_week).year();
            this.setState({
                current_week:c_week,
                current_year:c_year
            });
            
            userChange((userData) => {
                if(userData){
                    this.setState({firebaseReady: true, isLoggedIn: true, userData: userData,});
                    // console.log(this.state.userData.correo);
                    credentialsData(this.state.userData.correo,this.handleGetUserRol);
                    obtenerUsuarios((data) => {this.setState({usuarios:data.data})});
                    // obtenerUsuarios((data) => {console.log(data)});
                }else{
                    this.setState({ firebaseReady: true, isLoggedIn: false, userData: [],});
                }
            });
        }

        render(){

            if(!this.state.firebaseReady && !this.state.isLoggedIn){
                return(<Login login={this.handleLogin} error={this.state.errorLog}/>);
            }else{
                if(!this.state.isLoggedIn && this.state.firebaseReady && !this.state.userData){
                    return(<Login login={this.handleLogin} error={this.state.errorLog}/>);
                }else{
                    if(!this.state.awaitRol){
                        
                        return(
                            <Fragment>
                                <IOComponent 
                                    data={this.state} 
                                    login={this.handleLogin} 
                                    logout={this.handleLogout} 
                                    credentials={this.state.userRol}
                                    usuarios={this.state.usuarios}
                                    notification={this.handleSetNotification}
                                    calendarData={{
                                        week:this.state.current_week,
                                        year:this.state.current_year,
                                        back:() => {this.handleBackWeek()},
                                        next:() => {this.handleNextWeek()}
                                    }}
                                    laboratorio={this.state.laboratorio}
                                    setLaboratorio={this.handleChangeLaboratorio}
                                />
                                
                                <Notificaciones 
                                    show={this.state.notification} 
                                    close={this.handleCloseNotification}
                                    type={this.state.notifType}
                                    body={this.state.notifBody}
                                />
                            </Fragment>
                            
                        );
                    }else{
                        return(<div style={styledef} className="spinner-border" role="status"></div>);
                    }
                }
            }

            // if(this.state.isLoggedIn && !this.state.firebaseReady){
            //     return(<div style={styledef} className="spinner-border" role="status"></div>);
            // }
            
        }
    }
}
   
