import React, { Component, Fragment } from 'react';
import './agenda.css';
import * as moment from 'moment';
import { MDBBtn } from "mdbreact";
import { obtenerReservaciones, eliminarReservacion } from '../../../services/firebase';
import ModalEvent from './ModalEvent';
// import firebase from 'firebase/app';

moment.locale('es');

class Agenda extends Component{
  constructor(props) {
    super(props);
    this._isMounted = false;
  } 

  state = {
    eventsDay1: [],
    eventsDay2: [],
    eventsDay3: [],
    eventsDay4: [],
    eventsDay5: [],
    showDialogEvent: false,
    idEventSelect: "",
  }

  componentDidMount(){
    this._isMounted = true;
    if(this.props.calendarData.week !== 0){
      this._isMounted && this.handleObtenerReservaciones();
    }
  }
  
  componentWillUnmount(){
    this._isMounted = false;
  }

  handleNextWeek = () => {
    this.props.calendarData.next();
  }

  handleBackWeek = () => {
    this.props.calendarData.back();
  }

  handleObtenerReservaciones = () => {
    let laboratorio = "";
    laboratorio = this.props.laboratorio === 0 ? "ED1-CC1" : laboratorio;
    laboratorio = this.props.laboratorio === 1 ? "ED1-CC2" : laboratorio;
    laboratorio = this.props.laboratorio === 2 ? "ED1-CC3" : laboratorio;
    laboratorio = this.props.laboratorio === 3 ? "ED1-REDES" : laboratorio;
    laboratorio = this.props.laboratorio === 4 ? "ED1-HARDWARE" : laboratorio;
    laboratorio = this.props.laboratorio === 5 ? "AI1" : laboratorio;
    laboratorio = this.props.laboratorio === 6 ? "AI2" : laboratorio;

    obtenerReservaciones(this.props.calendarData.week,this.props.calendarData.year,laboratorio,(data) => {
      let dateCollection =[0,1,2,3,4];
      let tempStateDay = [[],[],[],[],[]];

      if(data.exists){
        dateCollection.map((d) => {
          data.data.map((e) => {
            var dayTemp = moment.unix(e.fecha.seconds);
            if((d + 1) === dayTemp.day()){
              tempStateDay[d].push(e);
            }
            return true;
          });
          return true;
        });
        this._isMounted && this.setState({
          eventsDay1: tempStateDay[0],
          eventsDay2: tempStateDay[1],
          eventsDay3: tempStateDay[2],
          eventsDay4: tempStateDay[3],
          eventsDay5: tempStateDay[4],
        });
      }
    });
  }

  handleEliminarReservacion = (id) => {
    eliminarReservacion(id.id, (resp) => {
      if(resp.sussess){
        this.setState({showDialogEvent: false});
        this.props.notification("success","Datos Eliminados.");
      }else{
        this.props.notification("error","Error al Elimiar los datos.");
      }
    });
  }

  handleViewEvent = (data) => {
    if (this.props.rol === "Administrador"){
      this.setState({
        showDialogEvent: true,
        idEventSelect: data,
      });
    }
    
  }

  render(){
    let wd = moment().week(this.props.calendarData.week);
    let month = wd.format("MMMM");
    let year = wd.format("YYYY");
    let today = month.substr(0,1).toUpperCase() + month.substr(1,month.length).toLowerCase() + " " + year;

    let week = [
      '07:00 - 08:00',
      '08:00 - 09:00',
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '12:00 - 13:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00'
    ];

    let itemsSprints = [1,2,3,4,5];
    let itemsCollection = [];

    let st1 = this.state.eventsDay1.length > 0 ? true : false;
    let st2 = this.state.eventsDay2.length > 0 ? true : false;
    let st3 = this.state.eventsDay3.length > 0 ? true : false;
    let st4 = this.state.eventsDay4.length > 0 ? true : false;
    let st5 = this.state.eventsDay5.length > 0 ? true : false;

    if(st1 || st2 || st3 || st4 || st5){
    //-------------------------------------------------------
      itemsSprints.map((weekDay) => {
        let tempArrayEventsNull = [
          "eventNull",
          "eventNull",
          "eventNull",
          "eventNull",
          "eventNull",
          "eventNull",
          "eventNull",
          "eventNull",
          "eventNull",
        ];
        let tempArrayEvents = [];

        let arrayEventDay = this.state["eventsDay" + weekDay];

        if(arrayEventDay.length > 0){

          for (let i = 7; i < 16; i++) {
            let eTemp = false;

            for (let ii = 0; ii < arrayEventDay.length; ii++) {
              const e = arrayEventDay[ii];
              let dateEvent = moment.unix(e.fecha.seconds);
              let hourEvent = dateEvent.hour();
              if(hourEvent === i){
                eTemp = true;
                if(e.horas === 2){
                  tempArrayEvents.push(e);
                  i += 1;
                  break;
                }else if(e.horas === 3){
                  tempArrayEvents.push(e);
                  i += 2;
                  break;
                }else if(e.horas === 4){
                  tempArrayEvents.push(e);
                  i += 3;
                  break;
                }else if(e.horas === 5){
                  tempArrayEvents.push(e);
                  i += 4;
                  break;
                } else if (e.horas === 6) {
                  tempArrayEvents.push(e);
                  i += 5;
                  break;
                } else if (e.horas === 7) {
                  tempArrayEvents.push(e);
                  i += 6;
                  break;
                } else if (e.horas === 8) {
                  tempArrayEvents.push(e);
                  i += 7;
                  break;
                }else{
                  tempArrayEvents.push(e);
                  break;
                }
              }
            }

            if(!eTemp){
              tempArrayEvents.push("eventNull");
            }
          }
          
          itemsCollection.push(tempArrayEvents);
        }else{
          itemsCollection.push(tempArrayEventsNull);
          
        }
        return true;
      });
    //-------------------------------------------------------
    }

    return(
      <Fragment>
        <ModalEvent 
          modalShow={this.state.showDialogEvent} 
          modalHide={() => {this.setState({showDialogEvent:false});}}
          notification={this.props.notification}
          idEvent={this.state.idEventSelect}
          callbackDelete={this.handleEliminarReservacion}
          rol={this.props.rol}
        />
        <div className="table-responsive" >
          <table className="table table-sm table-striped table-hover table-condensed tablaHorario" style={{minWidth: "1150px",}}>
            <thead>
              <tr className="">
                <td className="" style={{padding:0,}} colSpan="6">
                  <div style={{float:"left",width: "100%",}}>
                    <div style={{float:"left",width:"20%"}}>
                      {this.props.rol === "Administrador" ? 
                        <MDBBtn outline color="info" style={{float:"left",marginLeft: 0}} 
                        onClick={this.handleBackWeek}>Anterior</MDBBtn>
                      :
                        <MDBBtn outline color="info" style={{float:"left",marginLeft: 0}} 
                        onClick={this.handleBackWeek}
                        disabled={moment().week() + 1> this.props.calendarData.week  ? true : false}>Anterior</MDBBtn>
                      }
                      
                    </div>
                    <div style={{float:"left",width:"60%",paddingTop:10}}>
                      <h2 style={{width:"100%",textAlign:"center",color: "#5f5f5f"}}>{today}</h2>
                    </div>
                    <div style={{float:"left",width:"20%"}}>
                      <MDBBtn outline color="info" style={{float:"right",marginRight: 0,}} onClick={this.handleNextWeek}>Siguiente</MDBBtn>
                    </div>
                    
                  </div>
                </td>
              </tr>
              <tr className="tabCellHorario">
                <td className="tabCellHorario" style={{width: '12%'}}></td>
                <td className="tabCellHorario" style={{width: '12%'}}>{wd.day(1).format("DD/MM/YYYY")}</td>
                <td className="tabCellHorario" style={{width: '12%'}}>{wd.day(2).format("DD/MM/YYYY")}</td>
                <td className="tabCellHorario" style={{width: '12%'}}>{wd.day(3).format("DD/MM/YYYY")}</td>
                <td className="tabCellHorario" style={{width: '12%'}}>{wd.day(4).format("DD/MM/YYYY")}</td>
                <td className="tabCellHorario" style={{width: '12%'}}>{wd.day(5).format("DD/MM/YYYY")}</td>
              </tr>
              <tr className="tabCellHorario">
                <td className="tabCellHorario" style={{width: '12%'}}>Hora</td>
                <td className="tabCellHorario" style={{width: '16%'}}>Lunes</td>
                <td className="tabCellHorario" style={{width: '16%'}}>Martes</td>
                <td className="tabCellHorario" style={{width: '16%'}}>Miercoles</td>
                <td className="tabCellHorario" style={{width: '16%'}}>Jueves</td>
                <td className="tabCellHorario" style={{width: '16%'}}>viernes</td>
              </tr>
            </thead>
            <tbody>
            <tr className="">
              <td className="tabCellHorario" style={{padding:0}}>
                  {
                      week.map((hour,id) => {
                        let borderHidden = {};
                        borderHidden = id === 0 ? {borderTop: "hidden"} : borderHidden;
                        borderHidden = id === week.length - 1 ? {borderBottom: "hidden"} : borderHidden;
                        return(
                        <div className="tabCellHorariochild" style={borderHidden} key={id}>{hour}</div>
                        );
                      })
                    }
              </td>

                { 
                  itemsSprints.map((index) => {
                    return(
                      <td className="tabCellHorario" style={{ padding: 0 }} key={ Math.random() * (73) + index }>
                        {
                        itemsCollection[index-1] && itemsCollection[index-1].map((event, id) => {
                          if (event === "eventNull") {
                            return (
                              <div className="tabCellHorariochildres1" key={id}>
                                <div className="tabCellHorariochildrescontnull"></div>
                              </div>
                            );
                          } else {
                            if (event.horas === 1) {
                              return (
                                <div className="tabCellHorariochildres1" key={id}>
                                  <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                                </div>
                              );
                            }
                            if (event.horas === 2) {
                              return (
                                <div className="tabCellHorariochildres2" key={id}>
                                  <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                                </div>
                              );
                            }
                            if (event.horas === 3) {
                              return (
                                <div className="tabCellHorariochildres3" key={id}>
                                  <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                                </div>
                              );
                            }

                            if (event.horas === 4) {
                              return (
                                <div className="tabCellHorariochildres4" key={id}>
                                  <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                                </div>
                              );
                            }

                            if (event.horas === 5) {
                              return (
                                <div className="tabCellHorariochildres5" key={id}>
                                  <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                                </div>
                              );
                            }

                            if (event.horas === 6) {
                              return (
                                <div className="tabCellHorariochildres6" key={id}>
                                  <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                                </div>
                              );
                            }

                            if (event.horas === 7) {
                              return (
                                <div className="tabCellHorariochildres7" key={id}>
                                  <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                                </div>
                              );
                            }

                            if (event.horas === 8) {
                              return (
                                <div className="tabCellHorariochildres8" key={id}>
                                  <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                                </div>
                              );
                            }

                            return (
                              <div className="tabCellHorariochildres1" key={id}>
                                <div className="tabCellHorariochildrescont" onClick={() => { this.handleViewEvent(event) }}>{event.solicitante}</div>
                              </div>
                            );
                          }
                        })
                      }
                    </td>
                    )
                  })
                }
            </tr>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default Agenda;

