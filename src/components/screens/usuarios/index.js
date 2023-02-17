import React, { Component, Fragment } from 'react';
import { MDBJumbotron, MDBContainer, MDBRow, MDBCol, MDBCardBody,  MDBCardTitle, MDBBtn } from "mdbreact";
import NavBar from '../../NavBar';
import TablaUsuarios from './TablaUsuarios';
import ModalAgregar from './ModalAgregar';
import ModalEliminar from './ModalEliminar';
import ModalEditar from './ModalEditar';

class Usuarios extends Component{
    state = {
        modalAgregar: false,
        modalEliminar: false,
        modalEditar:false,
        usrActControl: "",
        editarData: {}
    } 

    handleBtnEditar = (data) => {
        this.setState({
            modalEditar: true,
            editarData: data
        });
    }

    handleBtnEliminar = (id) => {
        this.setState({
            modalEliminar: true,
            usrActControl: id
        });
    }

    handleAgregar = () => {
        this.setState({modalAgregar:true});
    }

    handleHideUsuario = () => {
        this.setState({modalAgregar:false});
    }

    handleHideDelUsr = () => {
        this.setState({modalEliminar:false});
    }

    handleHideEditUsr = () => {
        this.setState({modalEditar:false});
    }

    render(){
        let usuarios = this.props.usuarios;
        // console.log(usuarios);

        return(
            <Fragment>
                <NavBar data={this.props.data} logout={this.props.logout} rol={this.props.data.userRol} active="usuarios"/>
                {/* <ModalReservacion modalShow={this.state.modalReserv} modalHide={this.handleModalResHide}/> */}
                <ModalAgregar show={this.state.modalAgregar} hide={this.handleHideUsuario} uc={this.props.data.userData.correo}/>
                <ModalEliminar show={this.state.modalEliminar} hide={this.handleHideDelUsr} id={this.state.usrActControl}/>
                <ModalEditar show={this.state.modalEditar} hide={this.handleHideEditUsr} 
                id={this.state.editarData.id} data={this.state.editarData}
                />
                <MDBContainer className="mt-3 text-center">
                    <MDBRow>
                        <MDBCol>
                            <MDBJumbotron style={{padding:0}}>
                                <MDBCardBody>
                                    
                                    <MDBCardTitle className="h2">
                                        <div>Control de Usuarios</div>
                                        <MDBBtn style={{position: "absolute", top: 7, right: 28,}} 
                                        outline color="info"
                                        onClick={this.handleAgregar}
                                        >Agregar Usuario</MDBBtn>
                                    </MDBCardTitle>
                                    <hr className="my-1" />
                                    <div className="pt-2">
                                        <TablaUsuarios 
                                        usuarios={usuarios} 
                                        editar={this.handleBtnEditar}
                                        eliminar={this.handleBtnEliminar}
                                        correo={this.props.data.userData.correo}
                                        />
                                    </div>
                                    {/* <hr className="my-1" /> */}
                                </MDBCardBody>
                            </MDBJumbotron>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </Fragment>
        );
    }
}

export default Usuarios;