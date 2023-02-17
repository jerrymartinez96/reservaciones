import React, { Component } from 'react';
import InputEdit from '../../untils/inputEdit';
import SelectEdit from '../../untils/SelectEdit';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter} from 'mdbreact';
import { editarUsuario } from '../../../services/firebase';


class ModalEditar extends Component{
    state = {
        usuario: "",
        rol: "",
        active: false,
        change_usuario: false,
        change_rol: false
    }

    handlePrevent = () => {
        return false;
    }

    handleDataChange = (data) => {
        this.setState({
            [data.name]:data.val,
            ["change_" + data.name]: true,
        });
    }

    handleEditarUsuario = () => {
        let userState = this.state.usuario;
        let userProps = this.props.data.usr;
        let rolState = this.state.rol;
        let rolProps = this.props.data.rol;
        let userId = this.props.data.id;

        let data = { usuario: userState !== "" ? userState : userProps, rol: rolState !== "" ? rolState : rolProps };
        // this.props.uc
        editarUsuario(userId,data, (response) => {
            console.log(response);
            // if(response.susses){
            //     console.log("new user as created");
            // }else{
            //     console.log(response.error);
            // }
        });
    }


    render(){
        let usr1 = this.props.data.usr;
        let rol1 = this.props.data.rol;
        let usr2 = this.state.usuario;
        let rol2 = this.state.rol;
        let rolS = this.state.change_rol;
        let usrS = this.state.change_usuario;

        let btnEnable = true;

        if((usrS && usr2 !== "" && usr2 !== " "  && usr2 !== "  ")){
            if(usr1 !== usr2){
                btnEnable = false;
            }else{
                if(rolS && rol1 !== rol2){
                    btnEnable = false;
                }
            }
        }else{
            if(!usrS && rolS){
                btnEnable = false;
            }
        }


        return(
            <MDBContainer>
                <MDBModal isOpen={this.props.show} toggle={() => {this.handlePrevent()}}>
                    <MDBModalHeader toggle={this.props.hide}>Agregar Usuario</MDBModalHeader>
                    <MDBModalBody>
                        <div className="text-center">
                            <InputEdit title="Usuario" name="usuario" callback={this.handleDataChange} value={this.props.data.usr}/>
                            {/* <div style={this.handleInputError("solicitante", "100%")}></div> */}
                            <SelectEdit 
                                with="100%" 
                                callback={this.handleDataChange} 
                                disabled={true}
                                name="Rol" 
                                estado="rol"
                                items={[{val: 2,title:"Docente"},{val: 1,title:"Administrador"}]}
                                value={this.props.data.rol}
                            />
                        </div>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="dark" onClick={this.props.hide}>Cerrar</MDBBtn>
                        <MDBBtn color="primary" disabled={btnEnable} onClick={this.handleEditarUsuario}>Guardar</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default ModalEditar;