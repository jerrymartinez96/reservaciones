import React, {Component} from "react";
import '../styles/login.css';
import image from '../assents/gradient1.jpg';
import { MDBJumbotron, MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCardTitle } from "mdbreact";
// import {auth, provider} from '../services/firebase';

class Login extends Component{
    state = {
        wait : false
    }

    handleLoginClick = () => {
        this.setState({ wait : true });
        this.props.login();
    }

    render(){
        let url = 'url(' + image + ')';
        return (
            <MDBContainer>
              <MDBRow>
                <MDBCol>
                  <MDBJumbotron style={{ padding: 0 }}>
                    <MDBCol className="text-white text-center py-5 px-4 my-5" style={{ backgroundImage: url }}>
                      <MDBCol className="py-5">
                        <MDBCardTitle className="h1-responsive pt-3 m-5 font-bold">
                            Bienvenido al sistema ResLab-UPVE
                        </MDBCardTitle>
                        <p className="mx-5 mb-5">
                            El sistema ResLab-UPVE es un sistema de reservacion de laboratorios de la universidad Pólitecnica del valle del
                            Évora, para continuar es necesario tener una cuenta de correo institucional y tener acceso a ella ya que podras acceder 
                            a traves de la autenticación de Google.
                        </p>
                        {!this.props.error ? 
                        <MDBBtn outline color="white" className="mb-5" onClick={this.handleLoginClick}>Iniciar Sesion</MDBBtn>
                        :
                        <div style={{width:60, height:60}} className="loaderLogin spinner-border" role="status">
                        </div>
                        }
                      </MDBCol>
                    </MDBCol>
                  </MDBJumbotron>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
        );
    }
}

export default Login;