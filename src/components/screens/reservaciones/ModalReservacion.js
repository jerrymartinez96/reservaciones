import React, { Component } from 'react';
import './modalRes.css'
import { 
    MDBContainer, 
    MDBBtn, 
    MDBModal, 
    MDBModalBody, 
    MDBModalHeader, 
    MDBModalFooter 
} from 'mdbreact';
import InputText from '../../untils/InputText';
import moment from "moment";
import "moment/locale/es";
import DateFnsUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import SelectOutline from '../../untils/SelectOutline';
import {agregarSolicitud, agregarValidarReserva} from '../../../services/firebase';

moment.locale("es");

class ModalReservacion extends Component {
    _isMounted = false;

    state = {
        solicitante: "",
        asunto: "",
        grupo: "",
        programa: "",
        fecha: null,
        horas: 0,
        repetir: false,
        semanas : 0,
        check:false,
        valForm: false,
        sending: false,
        validation : false

    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handlePrevent = () => {
        return false;
    }

    handleDataChange = (data) => {
        if(this._isMounted){
            this.setState({[data.name]:data.val});
        }
    }

    handleDateChange = date => {
        if(this._isMounted){
            // console.log();
            this.setState({fecha: date});
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
                solicitante: "",
                asunto: "",
                grupo: "",
                programa: "",
                fecha: null,
                horas: 0,
                repetir: false,
                semanas : 0,
                check:false,
                valForm: false,
                sending: false
            });
        }
    }

    handleCloseModal = () => {
        this.props.modalHide();
        this.setState({fecha:null});
    }

    handleSaveBtn = () => {
        if(this._isMounted){
            // this.setState({sending: true});

            let horaInt = parseInt(this.state.fecha.format("HH"));
            let laboratorio = "";

            laboratorio = this.props.laboratorio === 0 ? "ED1-CC1" : laboratorio;
            laboratorio = this.props.laboratorio === 1 ? "ED1-CC2" : laboratorio;
            laboratorio = this.props.laboratorio === 2 ? "ED1-CC3" : laboratorio;
            laboratorio = this.props.laboratorio === 3 ? "ED1-REDES" : laboratorio;
            laboratorio = this.props.laboratorio === 4 ? "ED1-HARDWARE" : laboratorio;
            laboratorio = this.props.laboratorio === 5 ? "AI1" : laboratorio;
            laboratorio = this.props.laboratorio === 6 ? "AI2" : laboratorio;

            let data = {
                solicitante: this.state.solicitante,
                asunto:  this.state.asunto,
                grupo:  this.state.grupo,
                programa:  this.state.programa,
                fecha: this.state.fecha,
                horas:  this.state.horas,
                semana: this.state.fecha.week(),
                ciclo: this.state.fecha.year(),
                laboratorio: laboratorio
            }

            if (horaInt >= 7) {
                if(horaInt <= 15){
                    if(this.props.rol === "Administrador"){
                        agregarValidarReserva(data, (resp) => {
                            if (resp.success) {//se agrego exitosamente
                                if (resp.check) {
                                    this.props.modalHide();
                                    this.props.notification("success", "se agrego una nueva reservacion");
                                    this.handleResetState();
                                } else {
                                    this.setState({ validation: true });
                                }
                            } else {//error
                                this.props.modalHide();
                                this.props.notification("error", "Error al registrar los datos: code-32");
                                this.handleResetState();
                            }
                        });
                    }
                    else{
                        agregarSolicitud(data, (resp) => {
                            if(resp.susses){
                                this.handleResetState();
                                console.log("se agrego una nueva solicitud");
                                this.props.modalHide();
                            }else{
                                this.handleResetState();
                                console.log(resp.error);
                                this.props.modalHide();
                            }
                        });
                    }
                }else{
                    this.props.notification("warning","No se puede reservar despues de las 3:00 pm");
                }
            }else{
                this.props.notification("warning","No se puede reservar antes de las 7:00 am");
            } 
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

    render(){

        let styleD = {
            width: "100%", 
            marginTop: 5, 
            height: "1px",
            background: "#c3c3c3",
            float: "left",
        };
        
        let itemsHoras = [];

        let itemsHoras9 = [
            {title: "1",val:1},{title: "2",val:2},{title: "3",val:3},{title: "4",val:4},{title: "5",val:5},
            {title: "6",val:6},{title: "7",val:7},{title: "8",val:8},{title: "9",val:9}
        ];
        let itemsHoras8 = [{
            title: "1",val:1},{title: "2",val:2},{title: "3",val:3},{title: "4",val:4},
            {title: "5",val:5},{title: "6",val:6},{title: "7",val:7},{title: "8",val:8}
        ];
        let itemsHoras7 = [
            {title: "1",val:1},{title: "2",val:2},{title: "3",val:3},
            {title: "4",val:4},{title: "5",val:5},{title: "6",val:6},{title: "7",val:7}
        ];
        let itemsHoras6 = [{title: "1",val:1},{title: "2",val:2},{title: "3",val:3},{title: "4",val:4},{title: "5",val:5},{title: "6",val:6}];
        let itemsHoras5 = [{title: "1",val:1},{title: "2",val:2},{title: "3",val:3},{title: "4",val:4},{title: "5",val:5}];
        let itemsHoras4 = [{title: "1",val:1},{title: "2",val:2},{title: "3",val:3},{title: "4",val:4}];
        let itemsHoras3 = [{title: "1",val:1},{title: "2",val:2},{title: "3",val:3}];
        let itemsHoras2 = [{title: "1",val:1},{title: "2",val:2}];
        let itemsHoras1 = [{title: "1",val:1}];

        if(this.state.fecha !== null){
            let horaEvent = parseInt(this.state.fecha.format("HH")); 

            itemsHoras = horaEvent === 7  ? itemsHoras9 : itemsHoras;
            itemsHoras = horaEvent === 8  ? itemsHoras8 : itemsHoras;
            itemsHoras = horaEvent === 9  ? itemsHoras7 : itemsHoras;
            itemsHoras = horaEvent === 10 ? itemsHoras6 : itemsHoras;
            itemsHoras = horaEvent === 11 ? itemsHoras5 : itemsHoras;
            itemsHoras = horaEvent === 12 ? itemsHoras4 : itemsHoras;
            itemsHoras = horaEvent === 13 ? itemsHoras3 : itemsHoras;
            itemsHoras = horaEvent === 14 ? itemsHoras2 : itemsHoras;
            itemsHoras = horaEvent === 15 ? itemsHoras1 : itemsHoras;
        }

        let itemsPrograma = [
            {val: "ISC",title:"Ingenieria en Sistemas Computacionales"},
            {val: "IAT",title:"Ingenieria en Agrotecnologia"},
            {val: "IRN",title:"Ingenieria en Manejo de Recursos Naturales"},
            {val: "AYG",title:"Licenciatura en Administracion y Gestion Empresarial"}
        ];

        let sl = this.state.solicitante
        let as = this.state.asunto
        let fh = this.state.fecha
        let hr = this.state.horas
        let displayRol = this.props.rol==="Administrador" ? "Reservación" : "Solicitud";

        let elementAlert = "";
        let styAlert = {margin:5,textAlign:'center'};
        let alertT = "alert alert-warning";
        let permHoras = false;

        if(this.state.fecha !== null){
            let horaE = parseInt(this.state.fecha.format("HH"));
            if(horaE < 7){
                elementAlert = <div className={alertT} role="alert" style={styAlert}>No se puede reservar antes de las 7:00 am</div>;
                permHoras = false;
            }else{
                if(horaE > 15){
                    elementAlert = <div className={alertT} role="alert" style={styAlert}>No se puede reservar despues de las 3:00 pm</div>;
                    permHoras = false;
                }else{
                    elementAlert = "";
                    permHoras = true;
                }
            }
        }else{
            elementAlert = "";
            permHoras = false;
        }
        
        return (
            <MDBContainer>
                <MDBModal isOpen={this.props.modalShow} toggle={() => {this.handlePrevent()}}>
                    <MDBModalHeader toggle={this.handleCloseModal}>Agregar {displayRol}</MDBModalHeader>
                    <MDBModalBody>
                        <div className="text-center">
                            <InputText title="Solicitante" name="solicitante" callback={this.handleDataChange}/>
                            <div style={this.handleInputError("solicitante", "100%")}></div>
                            <InputText title="Materia / Asunto" name="asunto" callback={this.handleDataChange}/>
                            <div style={this.handleInputError("asunto", "100%")}></div>
                            <InputText title="Grupo" name="grupo" callback={this.handleDataChange}/>
                            <SelectOutline 
                                with="100%" 
                                callback={this.handleDataChange} 
                                disabled={true}
                                name="Programa Academico" 
                                estado="programa"
                                items={itemsPrograma}
                                check={this.state.check}
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                    clearable
                                    format="DD/MM/Y hh:mm a"
                                    label="Fecha" 
                                    inputVariant="outlined" 
                                    minutesStep={10}
                                    ampm={true}
                                    disablePast={this.props.rol === "Administrador" ?false:true}
                                    margin="normal"
                                    value={this.state.fecha}
                                    onChange={this.handleDateChange}
                                    style={{float: 'left',width: '60%'}}
                                />
                            </MuiPickersUtilsProvider>
                            {permHoras ? 
                            <SelectOutline 
                                with="37%" 
                                callback={this.handleDataChange} 
                                disabled={true}
                                name="Horas" 
                                estado="horas"
                                items={itemsHoras}
                                check={this.state.check}
                            />
                            :
                            <SelectOutline 
                                with="37%" 
                                callback={this.handleDataChange} 
                                disabled={false}
                                name="Horas" 
                                estado="horas"
                                items={itemsHoras}
                                check={this.state.check}
                            />
                            }
                            
                            <div style={this.handleInputError("fecha", "60%","left")}></div>
                            <div style={this.handleInputError("horas", "37%","right")}></div>
                            <div style={styleD}></div>
                        </div>
                        
                    </MDBModalBody>
                    {elementAlert}
                    {
                        this.state.validation ? 
                            <div className={alertT} role="alert" style={styAlert}>
                                El laboratorio se encuentra ocupado en la fecha y hora especificada
                            </div>
                        : ""
                    }
                    <MDBModalFooter>
                        
                        <MDBBtn color="dark" onClick={this.handleCloseModal}>Cerrar</MDBBtn>
                        {sl && as && fh && hr ? 
                            <MDBBtn color="primary" onClick={this.handleSaveBtn} disabled={this.state.sending || !permHoras ? true : false}>Guardar</MDBBtn>
                        :
                            <MDBBtn color="primary" onClick={this.handleSaveBtn} disabled={true}>Guardar</MDBBtn>
                        }
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default ModalReservacion;