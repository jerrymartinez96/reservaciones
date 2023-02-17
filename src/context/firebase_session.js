import React,{ Component } from 'react';
import {userChange, auth, provider} from '../services/firebase';
import Login from '../components/Login';

// const styledef = {
//     color: '#17a2b8',
//     fontSize: '12px',
//     width: '6rem',
//     height: '6rem',
//     marginLeft: '50%',
//     marginTop: '200px',
// }

export default function firebase_session(IOComponent){
    return class extends Component{
        constructor(props){
            super(props)
            this.state = { 
                firebaseReady: false,
                isLoggedIn: false,
                isLogOut: false,
                errorLog: false,
                userData: [],
                reservaciones: [],
            }
        }

        handleLogin = () => {
            auth.signInWithPopup(provider) 
            .then(() => {
                console.log("login");
            }).catch(() =>{
                console.log("login error");
            }); 
        }

        handleLogout = () => {
            const st = () =>{
                this.setState({isLoggedIn: false});
            }
            auth.signOut() 
            .then(function() {
                st();
            }).catch(function(e) {
                console.log(e);
            });
        }

        componentDidMount(){
            userChange((userData) => {
                if(userData){
                    this.setState({firebaseReady: true, isLoggedIn: true, userData: userData,});
                }else{
                    this.setState({ firebaseReady: true, isLoggedIn: false, userData: [],});
                }
            });
        }

        render(){

            if(!this.state.firebaseReady && !this.state.isLoggedIn){
                return(<Login login={this.handleLogin} error={this.state.errorLog}/>);
            }else{
                if(!this.state.isLoggedIn && this.state.firebaseReady){
                    return(<Login login={this.handleLogin} error={this.state.errorLog}/>);
                }else{
                    return(<IOComponent data={this.state} login={this.handleLogin} logout={this.handleLogout}/>);
                }
            }

            // if(this.state.isLoggedIn && !this.state.firebaseReady){
            //     return(<div style={styledef} className="spinner-border" role="status"></div>);
            // }
            
        }
    }
}
