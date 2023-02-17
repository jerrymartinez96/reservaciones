import React, { Component, Fragment } from 'react';
import {
    MDBJumbotron,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCardTitle,
    MDBCardBody,
    MDBDataTable
} from "mdbreact";
import NavBar from '../../NavBar';
import { obtenerReservacionesReportes } from '../../../services/firebase';
import DateFnsUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CsvDownload from 'react-json-to-csv';

class Reportes extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        fecha1: new Date(),
        fecha2: new Date(),
        rowsData: []
    }

    handleObtenerReservaciones = () => {
        obtenerReservacionesReportes(this.state.fecha1, this.state.fecha2, (data) => {
            console.log(data);
            this.setState({ rowsData: data.data});
        });
    }

    handleBuscar = () => {
        this.handleObtenerReservaciones();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleDateChange1 = date => {
            this.setState({ fecha1: date });
    }

    handleDateChange2 = date => {
        this.setState({ fecha2: date });
    }

    render() {
        let data = {
            // asunto
            // ciclo
            // fecha
            // grupo
            // horas
            // laboratorio
            // programa
            // semana
            // solicitante
            columns: [
                { label: 'Asunto', field: 'asunto', width: 100 },
                { label: 'Fecha', field: 'fecha', width: 100 },
                { label: 'Grupo', field: 'grupo', width: 100 },
                { label: 'Laboratorio', field: 'laboratorio', width: 100 },
            ],
            rows: this.state.rowsData
        };

        return (
            <Fragment>
                <NavBar data={this.props.data} logout={this.props.logout} rol={this.props.data.userRol} active="reportes" />
                <MDBContainer className="mt-5 text-center">
                    <MDBRow>
                        <MDBCol>
                            <MDBJumbotron className="text-center">
                            <MDBCardTitle className="card-title h2 pb-2">
                                    <strong>Reportes</strong>
                            </MDBCardTitle>
                            <hr className="my-2" />
                            <MDBCardTitle className="card-title h2 pb-0">
                                    <MDBRow>
                                        <MDBCol md="4">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    autoOk
                                                    format="DD/MM/Y"
                                                    inputVariant="outlined" 
                                                    label="Fecha Inicio"
                                                    margin="normal"
                                                    name="fecha1"
                                                    value={this.state.fecha1}
                                                    onChange={date => this.handleDateChange1(date)}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </MDBCol>
                                        <MDBCol md="4">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    autoOk
                                                    clearable
                                                    inputVariant="outlined" 
                                                    format="DD/MM/Y"
                                                    label="Fecha Fin"
                                                    margin="normal"
                                                    value={this.state.fecha2}
                                                    onChange={date => this.handleDateChange2(date)}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </MDBCol>
                                        <MDBCol md="4">
                                            <button 
                                                type="button" 
                                                className="btn btn-info btn-lg btn-block"
                                                style={{marginTop: 14}}
                                                onClick={this.handleBuscar}
                                            >Buscar</button>
                                        </MDBCol>
                                    </MDBRow>
                            </MDBCardTitle>
                            <hr className="my-2" />
                            <MDBCardBody>
                                    <MDBDataTable
                                        style={{ backgroundColor: 'white' }}
                                        data={data}
                                        bordered
                                        hover
                                        small
                                        responsive
                                        noBottomColumns
                                        exportToCSV
                                        infoLabel={["Mostrar", "-", "de", "registros"]}
                                        entriesLabel="Registros por pagina"
                                        paginationLabel={["<", ">"]}
                                        searchLabel="Buscar"
                                        noRecordsFoundLabel="No hay datos"
                                        theadColor="grey lighten-4"
                                        entriesOptions={[5, 10]}
                                        entries={5}
                                    // sortRows={["usuario","rol"]}
                                    />
                            </MDBCardBody>
                            <MDBCardTitle>
                                    <CsvDownload 
                                        data={this.state.rowsData} 
                                        filename="Reporte_Reservaciones.csv"
                                        style={{ 
                                            backgroundColor: "#33b5e5",
                                            borderRadius: ".3rem",
                                            border: "1px solid ##17a2b8",
                                            cursor: "pointer",
                                            padding: "6px 24px",
                                        }}
                                    >
                                        Descargar Reporte
                                    </CsvDownload>
                            </MDBCardTitle>
                        </MDBJumbotron>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </Fragment>
        );
    }
}

export default Reportes;

/*
<div>Reportes</div>

<MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardDatePicker 
        autoOk
        format="DD/MM/Y"
        label="FechaIni"
        inputVariant="outlined"
        margin="normal"
        style={{ float: 'left', width: '60%' }}
        value={this.state.fecha}
        onChange={this.handleDateChange}
    />
</MuiPickersUtilsProvider>


<MDBBtn
    outline color="info"
    onClick={this.handleAgregar}
>Generar reportes</MDBBtn>
*/ 