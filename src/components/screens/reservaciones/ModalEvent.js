import React, { Component } from 'react';
import './modalRes.css'
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter} from 'mdbreact';
import moment from "moment";
import "moment/locale/es";
import DateFnsUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';

import { 
    comentariosReservacion, 
    editarReservacion,
    agregarValidarReserva
} from '../../../services/firebase';
import firebase from 'firebase/app';
import InputEdit from '../../untils/inputEdit';
import SelectEdit from '../../untils/SelectEdit';
import TextArea from '../../untils/TextArea';
import SelectOutline from '../../untils/SelectOutline';

import { laboratorios } from '../../untils/DataStore';

moment.locale("es");

class ModalEvent extends Component {
    _isMounted = false;
    _isUpdate = false;

    state = {
        sending: false,
        display: 1,
        id: "",
        solicitante: "",
        asunto: "",
        grupo: "",
        programa: "",
        laboratorio: "",
        laboratorioChange: "",
        fecha: null,
        fechaEditar: null,
        ciclo: 0,
        semana: 0,
        horas: 0,
        comentarios: ""
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate() {
        if (this._isMounted) {
            if (this.props.modalShow) {
                if (!this._isUpdate){
                    if (this._isMounted) {
                        let data = this.props.idEvent;
                        this.setState({
                            id: data.id,
                            solicitante: data.solicitante,
                            asunto: data.asunto,
                            grupo: data.grupo,
                            programa: data.programa,
                            laboratorio: data.laboratorio,
                            laboratorioChange: data.laboratorio,
                            comentarios: data.comentarios ? data.comentarios : "",
                            ciclo: data.ciclo,
                            semana: data.semana,
                            horas: data.horas
                        });
                    }
                }
                
                this.handleSuggestDate();
                this._isUpdate = true;
            }else{
                this._isUpdate = false;
            }
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handlePrevent = () => {
        return false;
    }

    handleTogle = () => {
        this.setState({ 
            display: 1
        });
        this.props.modalHide()
    }

    handleDataChange = (data) => {
        if(this._isMounted){
            this.setState({[data.name]:data.val});
        }
    }

    handleDateChange = date => {
        if(this._isMounted){
            this.setState({fecha: date});
        }
    }

    handleDateEditChange = date => {
        if (this._isMounted) {
            this.setState({ fechaEditar: date });
        }
    }

    handleRepeatChange = () => {
        if(this._isMounted){
            this.setState({repetir: !this.state.repetir});
            if(this.state.repetir){this.setState({semanas:0});}
        }
    }

    handleResetState = () => {
        if(this._isMounted){
            this.setState({
                fecha: null,
            });
        }
    }

    handleInputError = (inputState, size, float="") => {
        let inputVal = this.state[inputState];
        if(this.state.check){
            if(inputVal){
                return({width: size,});
            }else{
                if(float === "left"){
                    return({
                        width: size,
                        height: 1,
                        background: "red",
                        float: "left"
                    });
                }
                if(float === "right"){
                    return({
                        width: size,
                        height: 1,
                        background: "red",
                        float: "right"
                    });
                }
                return({
                    width: size,
                    height: 1,
                    background: "red",
                    marginTop: 5,
                });
            }
            
        }else{
            return({width: size,});
        }
    }

    handleSuggestDate = () => {
        var dayTempEdit = moment.unix(this.props.idEvent.fecha.seconds);
        var dayTemp = moment.unix(this.props.idEvent.fecha.seconds);
        dayTemp.add(7, 'days');
        if(!this._isUpdate){
            this.setState({ 
                fecha: dayTemp,
                fechaEditar: dayTempEdit
            });
            this._isUpdate = true;
        }
    }

    handleCloneDay = () => {
        if (this._isMounted) {
            let data = {
                solicitante: this.props.idEvent.solicitante,
                asunto: this.props.idEvent.asunto,
                grupo: this.props.idEvent.grupo,
                programa: this.props.idEvent.programa,
                fecha: this.state.fecha,
                horas: this.props.idEvent.horas,
                semana: this.state.fecha.week(),
                ciclo: this.state.fecha.year(),
                comentarios: this.state.comentarios,
                laboratorio: this.props.idEvent.laboratorio
            }

            agregarValidarReserva(data, (resp) => {
                if (resp.success) {//se agrego exitosamente
                    if (resp.check){
                        this.props.modalHide();
                        this.props.notification("success", "se agrego una nueva reservacion");
                        this.handleResetState();
                    }else{
                        this.props.notification("warning", "El laboratorio esta ocupado");
                    }
                } else {//error
                    this.props.modalHide();
                    this.props.notification("error", "Error al registrar los datos: code-32");
                    this.handleResetState();
                }
            });
        }
    }

    handleChangeView = (view) => {
        this.setState({ display: view});
    }

    handleCancelEdit = () => {
        this.props.modalHide();
        this.setState({ display: 1 });
    }

    handleDataChange = (data) => {
        if (this._isMounted) {
            this.setState({ [data.name]: data.val });
        }
    }

    handleInputError = (inputState, size, float = "") => {
        let inputVal = this.state[inputState];
        if (this.state.check) {
            if (inputVal) {
                return ({ width: size, });
            } else {
                if (float === "left") {
                    return ({
                        width: size,
                        height: 1,
                        background: "red",
                        float: "left"
                    });
                }
                if (float === "right") {
                    return ({
                        width: size,
                        height: 1,
                        background: "red",
                        float: "right"
                    });
                }
                return ({
                    width: size,
                    height: 1,
                    background: "red",
                    marginTop: 5,
                });
            }

        } else {
            return ({ width: size, });
        }
    } 

    handleUpdateResBtn = () => {
        if (this._isMounted) {
            this.setState({ sending: true });
            let horaInt = parseInt(this.state.fechaEditar.format("HH"));


            let data = {
                solicitante: this.state.solicitante,
                asunto: this.state.asunto,
                grupo: this.state.grupo,
                programa: this.state.programa,
                fecha: firebase.firestore.Timestamp.fromDate(new Date(this.state.fechaEditar.toString())),
                horas: this.state.horas,
                semana: this.state.fechaEditar.week(),
                ciclo: this.state.fechaEditar.year(),
                laboratorio: this.state.laboratorio
            }

            if (horaInt >= 7) {
                if (horaInt <= 15) {
                    if (this.props.rol === "Administrador") {
                        editarReservacion(this.state.id, data, (resp) => {
                            if (resp.sussess) {//se agrego exitosamente
                                this.props.modalHide();
                                this.props.notification("success", "se agrego una nueva reservacion");
                            } else {//error
                                this.props.modalHide();
                                this.props.notification("error", "Error al registrar los datos: code-32");
                            }
                        });
                    }else {
                        this.props.notification("warning", "Accion no autorizada.");
                    }
                } else {
                    this.props.notification("warning", "No se puede reservar despues de las 3:00 pm");
                }
            } else {
                this.props.notification("warning", "No se puede reservar antes de las 7:00 am");
            }
            this.setState({ sending: false });
        }
    }

    handleCheckingCancel = () => {
        this.setState({ 
            display: 1,
            comentarios: ""
        });
        this.props.modalHide();
    }

    handleCheckingSave = () => {
        comentariosReservacion(this.state.id, this.state.comentarios, (resp) => {
            if (resp.sussess) {//se agrego exitosamente
                this.props.modalHide();
                this.setState({
                    display: 1,
                    comentarios: ""
                });
                this.props.notification("success", "Se agregaron comentarios a la reservacion");
            } else {//error
                this.props.modalHide();
                this.setState({
                    display: 1,
                    comentarios: ""
                });
                this.props.notification("error", "Error al registrar los datos: code-32");
            }
        });
    }

    handleChangePlace = () => {
        console.log(this.state.laboratorioChange)
    }

    render(){
        let itemsPrograma = [
            { val: "ISC", title: "Ingenieria en Sistemas Computacionales" },
            { val: "IAT", title: "Ingenieria en Agrotecnologia" },
            { val: "IRN", title: "Ingenieria en Manejo de Recursos Naturales" },
            { val: "AYG", title: "Licenciatura en Administracion y Gestion Empresarial" }
        ];
        let itemsHoras = [];
        let itemsHoras9 = [
            { title: "1", val: 1 }, { title: "2", val: 2 }, { title: "3", val: 3 }, { title: "4", val: 4 }, { title: "5", val: 5 },
            { title: "6", val: 6 }, { title: "7", val: 7 }, { title: "8", val: 8 }, { title: "9", val: 9 }
        ];
        let itemsHoras8 = [{
            title: "1", val: 1
        }, { title: "2", val: 2 }, { title: "3", val: 3 }, { title: "4", val: 4 },
        { title: "5", val: 5 }, { title: "6", val: 6 }, { title: "7", val: 7 }, { title: "8", val: 8 }
        ];
        let itemsHoras7 = [
            { title: "1", val: 1 }, { title: "2", val: 2 }, { title: "3", val: 3 },
            { title: "4", val: 4 }, { title: "5", val: 5 }, { title: "6", val: 6 }, { title: "7", val: 7 }
        ];
        let itemsHoras6 = [{ title: "1", val: 1 }, { title: "2", val: 2 }, { title: "3", val: 3 }, { title: "4", val: 4 }, { title: "5", val: 5 }, { title: "6", val: 6 }];
        let itemsHoras5 = [{ title: "1", val: 1 }, { title: "2", val: 2 }, { title: "3", val: 3 }, { title: "4", val: 4 }, { title: "5", val: 5 }];
        let itemsHoras4 = [{ title: "1", val: 1 }, { title: "2", val: 2 }, { title: "3", val: 3 }, { title: "4", val: 4 }];
        let itemsHoras3 = [{ title: "1", val: 1 }, { title: "2", val: 2 }, { title: "3", val: 3 }];
        let itemsHoras2 = [{ title: "1", val: 1 }, { title: "2", val: 2 }];
        let itemsHoras1 = [{ title: "1", val: 1 }];

        if (this.state.fecha !== null) {
            let horaEvent = parseInt(this.state.fecha.format("HH"));

            itemsHoras = horaEvent === 7 ? itemsHoras9 : itemsHoras;
            itemsHoras = horaEvent === 8 ? itemsHoras8 : itemsHoras;
            itemsHoras = horaEvent === 9 ? itemsHoras7 : itemsHoras;
            itemsHoras = horaEvent === 10 ? itemsHoras6 : itemsHoras;
            itemsHoras = horaEvent === 11 ? itemsHoras5 : itemsHoras;
            itemsHoras = horaEvent === 12 ? itemsHoras4 : itemsHoras;
            itemsHoras = horaEvent === 13 ? itemsHoras3 : itemsHoras;
            itemsHoras = horaEvent === 14 ? itemsHoras2 : itemsHoras;
            itemsHoras = horaEvent === 15 ? itemsHoras1 : itemsHoras;
        }

        let elementAlert = "";
        let styAlert = { margin: 5, textAlign: 'center' };
        let alertT = "alert alert-warning";
        let permHoras = false;

        if (this.state.fecha !== null) {
            let horaE = parseInt(this.state.fecha.format("HH"));
            if (horaE < 7) {
                elementAlert = <div className={alertT} role="alert" style={styAlert}>No se puede reservar antes de las 7:00 am</div>;
                permHoras = false;
            } else {
                if (horaE > 15) {
                    elementAlert = <div className={alertT} role="alert" style={styAlert}>No se puede reservar despues de las 3:00 pm</div>;
                    permHoras = false;
                } else {
                    elementAlert = "";
                    permHoras = true;
                }
            }
        } else {
            elementAlert = "";
            permHoras = false;
        }

        return (
            <MDBContainer>
                <MDBModal isOpen={this.props.modalShow} toggle={() => {this.handlePrevent()}}>
                    <MDBModalHeader toggle={this.handleTogle}></MDBModalHeader>
                    <MDBModalBody>
                        <div style={{display: this.state.display === 1 ? "" : "none"}}>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th style={{ fontWeight: "bold", backgroundColor: "#efefef" }}>Solicitante</th>
                                        <td>{this.props.idEvent.solicitante}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ fontWeight: "bold", backgroundColor: "#efefef" }}>Grupo</th>
                                        <td>{this.props.idEvent.grupo}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ fontWeight: "bold", backgroundColor: "#efefef" }}>Programa</th>
                                        <td>{this.props.idEvent.programa}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ fontWeight: "bold", backgroundColor: "#efefef" }}>Laboratorio</th>
                                        <td>{this.props.idEvent.laboratorio}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#efefef" }}>Asunto</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">{this.props.idEvent.asunto}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{padding: "15px", border: "1px solid #dddddd" }}>
                                <h5 style={{ fontWeight: "bold"}}>Seleccionar fecha para duplicar reservación</h5>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDateTimePicker
                                        clearable
                                        format="DD/MM/Y hh:mm a"
                                        label="Fecha"
                                        inputVariant="outlined"
                                        minutesStep={10}
                                        ampm={false}
                                        // disablePast={this.props.rol === "Administrador" ? false : true}
                                        margin="normal"
                                        value={this.state.fecha}
                                        onChange={this.handleDateChange}
                                        style={{ width: '98%' }}
                                    />
                                </MuiPickersUtilsProvider>
                                <MDBBtn
                                    color="primary"
                                    style={{ with: '90%' }}
                                    onClick={() => {this.handleCloneDay(true)}}
                                    disabled={this.state.fecha ? false : true}
                                >Clonar</MDBBtn>
                            </div>
                        </div>
                        <div style={{ display: this.state.display === 2 ? "" : "none" }}>
                            <div className="text-center">
                                <InputEdit title="Solicitante" name="solicitante" callback={this.handleDataChange} value={this.state.solicitante}/>
                                <div style={this.handleInputError("solicitante", "100%")}></div>
                                <InputEdit title="Materia / Asunto" name="asunto" callback={this.handleDataChange} value={this.state.asunto} />
                                <div style={this.handleInputError("asunto", "100%")}></div>
                                <InputEdit title="Grupo" name="grupo" callback={this.handleDataChange} value={this.state.grupo} />
                                <SelectEdit
                                    with="100%"
                                    callback={this.handleDataChange}
                                    disabled={true}
                                    name="Programa Academico"
                                    estado="programa"
                                    items={itemsPrograma}
                                    check={true}
                                    value={this.state.programa}
                                />
                                {/* DatePicker seccion */}
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDateTimePicker
                                        clearable
                                        format="DD/MM/Y hh:mm a"
                                        label="Fecha"
                                        inputVariant="outlined"
                                        minutesStep={10}
                                        ampm={false}
                                        margin="normal"
                                        value={this.state.fechaEditar}
                                        onChange={this.handleDateEditChange}
                                        style={{ float: 'left', width: '60%' }}
                                    />
                                </MuiPickersUtilsProvider>

                                {permHoras ?
                                    <SelectEdit
                                        with="37%"
                                        callback={this.handleDataChange}
                                        disabled={true}
                                        name="Horas"
                                        estado="horas"
                                        items={itemsHoras}
                                        check={this.state.check}
                                        value={this.state.horas}
                                    />
                                    :
                                    <SelectEdit
                                        with="37%"
                                        callback={this.handleDataChange}
                                        disabled={false}
                                        name="Horas"
                                        estado="horas"
                                        items={itemsHoras}
                                        check={this.state.check}
                                        value={this.state.horas}
                                    />
                                }
                            </div>
                        </div>
                        <div style={{ display: this.state.display === 3 ? "" : "none" }}>
                            <h4>¿Desea agregar algun comentario antes de guardar?</h4>
                            <TextArea 
                                label="Comentarios"
                                callback={this.handleDataChange}
                                name="comentarios"
                                value={this.state.comentarios}
                            />
                        </div>
                        <div style={{ display: this.state.display === 4 ? "" : "none" }}>
                            <h3>Favor de seleccionar el nuevo lugar</h3>
                            <SelectOutline 
                                with="100%" 
                                callback={this.handleDataChange} 
                                disabled={true}
                                name="" 
                                value={this.state.laboratorioChange}
                                estado="laboratorioChange"
                                items={ laboratorios.map((i) => {return {val: i,title:i}}) }
                                // check={this.state.check}
                            />
                        </div>
                    </MDBModalBody>
                    {elementAlert}
                    <MDBModalFooter style={{display: 'block'}}>
                        <div style={{ display: this.state.display === 1 ? "" : "none" }}>
                            <MDBBtn 
                                color="red" 
                                onClick={() => {this.props.callbackDelete(this.props.idEvent)}}
                                style={{color: 'white', float: 'left'}}
                            >
                                {/* Eliminar */}
                                <i className="fas fa-trash"></i>
                            </MDBBtn>
                            <MDBBtn
                                color="dark"
                                style={{ float: 'left' }}
                                onClick={this.props.modalHide}
                            >
                                {/* Cerrar */}
                                <i className="fas fa-times"></i>
                            </MDBBtn>
                            <MDBBtn
                                color="blue"
                                onClick={() => { this.handleChangeView(3) }}
                                style={{ color: 'white', float: 'right' }}
                            >
                                {/* Check */}
                                <i className="fas fa-check"></i>
                            </MDBBtn>
                            <MDBBtn
                                color="gray"
                                onClick={() => { this.handleChangeView(4) }}
                                style={{
                                        background: '#495057',
                                        color: 'white', 
                                        float: 'right' 
                                    }}
                            >
                                {/* Cambiar lavoratorio */}
                                <i className="fas fa-random"></i>
                            </MDBBtn>
                            <MDBBtn
                                color="purple"
                                onClick={() => { this.handleChangeView(2) }}
                                style={{ color: 'white', float: 'right' }}
                            >
                                {/* Editar */}
                                <i className="fas fa-pen"></i>
                            </MDBBtn>
                        </div>
                        <div style={{ display: this.state.display === 2 ? "" : "none" }}>
                            <MDBBtn
                                color="blue"
                                style={{ color: 'white', float: 'right' }}
                                onClick={() => { this.handleUpdateResBtn() }}
                                disabled={this.state.sending}
                            >
                                {/* Guardar */}
                                <i className="fas fa-save"></i>
                            </MDBBtn>
                            <MDBBtn
                                color="red"
                                style={{ color: 'white', float: 'right' }}
                                onClick={() => { this.handleCancelEdit() }}
                            >
                                {/* Cancelar */}
                                <i className="fas fa-times"></i>
                            </MDBBtn>
                        </div>
                        <div style={{ display: this.state.display === 3 ? "" : "none" }}>
                            <MDBBtn
                                color="blue"
                                style={{ color: 'white', float: 'right' }}
                                onClick={() => { this.handleCheckingSave() }}
                                disabled={this.state.sending}
                            >
                                {/* Guardar */}
                                <i className="fas fa-save"></i>
                            </MDBBtn>
                            <MDBBtn
                                color="red"
                                style={{ color: 'white', float: 'right' }}
                                onClick={() => { this.handleCheckingCancel() }}
                            >
                                {/* Cancelar */}
                                <i className="fas fa-times"></i>
                            </MDBBtn>
                        </div>
                        <div style={{ display: this.state.display === 4 ? "" : "none" }}> 
                            <MDBBtn
                                color="blue"
                                style={{ color: 'white', float: 'right' }}
                                onClick={() => { this.handleChangePlace() }}
                                disabled={ this.state.laboratorio === this.state.laboratorioChange }
                            >
                                {/* Guardar */}
                                <i className="fas fa-save"></i>
                            </MDBBtn>
                            <MDBBtn
                                color="red"
                                style={{ color: 'white', float: 'right' }}
                                onClick={() => { this.setState({ display: 1 }) }}
                            >
                                {/* Cancelar */}
                                <i className="fas fa-times"></i>
                            </MDBBtn>
                        </div>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default ModalEvent;