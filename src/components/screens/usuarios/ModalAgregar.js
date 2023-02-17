import React, { Component } from 'react';
import InputText from '../../untils/InputText';
import SelectOutline from '../../untils/SelectOutline';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter} from 'mdbreact';
import { agregarUsuario } from '../../../services/firebase';

class ModalAgregar extends Component{
    state = {
        usuario: "",
        rol: "",
    }

    handlePrevent = () => {
        return false;
    }

    handleDataChange = (data) => {
        this.setState({[data.name]:data.val});
    }

    handleAgregarUsuario = () => {
        let data = { usuario:this.state.usuario, rol: this.state.rol };
        // this.props.uc
        agregarUsuario(data, (response) => {
            console.log(response);
            // if(response.susses){
            //     console.log("new user as created");
            // }else{
            //     console.log(response.error);
            // }
        });
    }

    render(){
        let btnEnable = this.state.usuario && this.state.rol ? false : true;
        // if(btnEnable){console.log("enable")}
        return(
            <MDBContainer>
                <MDBModal isOpen={this.props.show} toggle={() => {this.handlePrevent()}}>
                    <MDBModalHeader toggle={this.props.hide}>Agregar Usuario</MDBModalHeader>
                    <MDBModalBody>
                        <div className="text-center">
                            <InputText title="Usuario" name="usuario" callback={this.handleDataChange}/>
                            {/* <div style={this.handleInputError("solicitante", "100%")}></div> */}
                            <SelectOutline 
                                with="100%" 
                                callback={this.handleDataChange} 
                                disabled={true}
                                name="Rol" 
                                estado="rol"
                                items={[{val: 2,title:"Docente"},{val: 1,title:"Administrador"}]}
                            />
                        </div>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="dark" onClick={this.props.hide}>Cerrar</MDBBtn>
                        <MDBBtn color="primary" disabled={btnEnable} onClick={this.handleAgregarUsuario}>Guardar</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default ModalAgregar;