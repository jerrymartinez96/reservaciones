import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { eliminarUsuario } from '../../../services/firebase';

class ModalEliminar extends Component {
    handleBtnEliminar = () => {
        eliminarUsuario(this.props.id, (data) => {
            if(data.sussess){
                console.log("usuario eliminado");
            }else{
                console.log("error al eliminar usuario");
            }
        });
    }

    render() {
        return (
            <MDBContainer>
                <MDBModal isOpen={this.props.show} toggle={this.props.hide} backdrop={false}>
                    <MDBModalHeader toggle={this.props.hide}>Eliminar Usuario</MDBModalHeader>
                    <MDBModalBody style={{textAlign: "center"}}>
                        ¿Está seguro de eliminar este usuario?
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.props.hide}>Cancelar</MDBBtn>
                        <MDBBtn color="primary" onClick={this.handleBtnEliminar}>Eliminar</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default ModalEliminar;