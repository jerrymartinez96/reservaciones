import React, {Component, Fragment} from "react";
import { MDBJumbotron, MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCardBody,  MDBCardTitle } from "mdbreact";
import NavBar from '../../NavBar';
import Agenda from './agenda';
import ModalReservacion from './ModalReservacion';
import TabsSections from '../../untils/TabsSections';
// import Notificaciones from '../../untils/Notificaciones';

class Reservaciones extends Component{
    state = {
        modalReserv : false
    }
    handleModalResShow = () => {
        this.setState({modalReserv: true});
    }

    handleModalResHide = () => {
        this.setState({modalReserv: false});
    }
    
    render(){
        return(
            <Fragment>
                <NavBar data={this.props.data} logout={this.props.logout} rol={this.props.data.userRol} active="reservaciones"/>
                <ModalReservacion 
                    modalShow={this.state.modalReserv} 
                    modalHide={this.handleModalResHide} 
                    rol={this.props.data.userRol} 
                    week={this.props.calendarData.week}
                    year={this.props.calendarData.year}
                    notification={this.props.notification}
                    laboratorio={this.props.laboratorio}
                />
                {/* <Notificaciones/> */}
                <MDBContainer className="mt-3 text-center" style={{maxWidth: "1250px",}}>
                    <MDBRow>
                        <MDBCol>
                            <MDBJumbotron style={{padding:0}}>
                                <MDBCardBody>
                                    <MDBCardTitle className="h2">
                                        {/* Rol usuario : {this.props.data.userRol} */}
                                        {/* <MDBBtn outline color="primary" className="waves-effect">LANIX</MDBBtn> */}
                                        <TabsSections laboratorio={this.props.laboratorio} setLaboratorio={this.props.setLaboratorio} />
                                    </MDBCardTitle>
                                    <hr className="my-1" />
                                    <div className="pt-2">
                                        <Agenda 
                                            calendarData={this.props.calendarData} 
                                            rol={this.props.data.userRol} 
                                            notification={this.props.notification}
                                            laboratorio={this.props.laboratorio}
                                        />
                                    </div>
                                    {this.props.data.userRol === "Administrador" ? 
                                        <div className="pt-1">
                                            <MDBBtn outline color="primary" className="waves-effect" onClick={this.handleModalResShow}>
                                            Agregar Reservación
                                            </MDBBtn>
                                        </div>
                                    :
                                    ""
                                        // <div className="pt-1">
                                        //     <MDBBtn outline color="primary" className="waves-effect" onClick={this.handleModalResShow}>
                                        //         Solicitar Reservación
                                        //     </MDBBtn>
                                        // </div>
                                    }
                                </MDBCardBody>
                            </MDBJumbotron>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </Fragment>
        );
    }
}

export default Reservaciones;
