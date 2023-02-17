import {db} from './setup';
import firebase from 'firebase/app';
import moment from "moment";

export const credentialsData = (usr, callback) => {
    let usrSplit = usr.split("@");
    let ref = db.collection('usuarios').where("usuario", "==", usrSplit[0]);
    ref.onSnapshot((result) => {
        const data = result.docs.map(doc => doc.data());
        
        if(result.size) {
            callback({
                exists: true,
                error: false,
                data: data
            });
        }else{
            callback({
                exists: false,
                error: false,
                data: ""
            });
        }
    }, (error) => {
        callback({
            exists: false,
            error: true,
            data: error
        });
    });
}

export const obtenerReservaciones = (week,year,laboratorio,callback) => {
    let ref = db.collection('reservaciones')
    .where("semana", "==", week)
    .where("ciclo","==",year)
    .where("laboratorio","==",laboratorio);
    // .orderBy("fecha");

    ref.onSnapshot((result) => {
        // const data = result.docs.map(doc =>doc.data(),);
        const docs = [];
        // console.log(result);
        if(result.size) {
            result.forEach((doc) => {
                const data = doc.data();
                docs.push({...data,id:doc.id});
            });

            callback({
                exists: true,
                error: false,
                data: docs
            });
        }else{
            callback({
                exists: false,
                error: false,
                data: ""
            });
        }
    }, (error) => {
        callback({
            exists: false,
            error: true,
            data: error.message
        });
    });
}

export const obtenerReservacionesReportes = (date1, date2, callback) => {
    let timestamp1 = firebase.firestore.Timestamp.fromDate(new Date(date1))
    let timestamp2 = firebase.firestore.Timestamp.fromDate(new Date(date2));
    let ref = db.collection('reservaciones').orderBy("fecha").startAt(timestamp1).endAt(timestamp2);

    ref.onSnapshot((result) => {
        const docs = [];
        // console.log(result);
        if (result.size) {
            result.forEach((doc) => {
                const data = doc.data();
                let fechaC = data.fecha.toDate();
                let year = fechaC.getFullYear();
                let month = fechaC.getMonth();
                let day = fechaC.getDate();
                let mDate = ('0' + day).slice(-2) + "-" + ('0' + (month + 1)).slice(-2) + "-" + year;
                // console.log(mDate);
                docs.push({
                    asunto: data.asunto,
                    ciclo: data.ciclo,
                    fecha: mDate,
                    grupo: data.grupo,
                    horas: data.horas,
                    laboratorio: data.laboratorio,
                    programa: data.programa,
                    semana: data.semana,
                    solicitante: data.solicitante,
                    comentarios: data.comentarios
                });
                // docs.push({ ...data, id: doc.id });
            });
            callback({
                exists: true,
                error: false,
                data: docs
            });
        } else {
            callback({
                exists: false,
                error: false,
                data: []
            });
        }
    }, (error) => {
        callback({
            exists: false,
            error: true,
            data: error.message
        });
    });
}

export const validarReservaciones = (dd,mm,yy,callback) => {
    let date1 = firebase.firestore.Timestamp.fromDate(new Date("" + yy + "-" + mm + "-" + (parseInt(dd) - 1) + " 11:59"));
    let date2 = firebase.firestore.Timestamp.fromDate(new Date("" + yy + "-" + mm + "-" + parseInt(dd) + " 11:59"));

    

    let ref = db.collection('reservaciones')
    .where("fecha", ">", date1)
    .where("fecha", "<", date2);

    ref.onSnapshot((result) => {
        const docs = [];

        if(result.size) {
            result.forEach((doc) => {
                const data = doc.data();
                docs.push({...data,id:doc.id});
            });
            callback({
                exist:true,
                data:docs,
            });
        }else{
            callback({
                exists:false,
                error:false,
            });
        }
    }, (error) => {
        callback({
            exists:false,
            error:true,
            data:error,
        });
    });
}

export const obtenerUsuarios = (callback) => {
    // let ref = db.collection('usuarios');
    db.collection('usuarios').onSnapshot((result) => {
        const docs = [];
        if(result.size) {
            result.forEach((doc) => {
                const data = doc.data();
                docs.push({...data,id:doc.id});
            });
            callback({
                error: false,
                data: docs
            });
        }else{
            callback({
                error: false,
                data: ""
            });
        }
    }, (error) => {
        callback({
            error: true,
            data: error.message
        });
    });
}

export const agregarReservacion = (data,callback) => {
    db.collection("reservaciones").doc().set(data)
    .then(() => {callback({sussess:true,error:false});})
    .catch((e) => {callback({sussess:false,error:true,mensaje:e});});
}

export const agregarValidarReserva = (data, callback) => {
    const frt = `${data.fecha.year()}-${data.fecha.month() + 1}-${data.fecha.date()}T${data.fecha.hour()}:00`;
    const fechaIni = moment(frt, "YYYY-MM-DDTHH:ss");
    const fechaFin = moment(frt, "YYYY-MM-DDTHH:ss").add(data.horas, "h");
    let validationCheck = false;

    db.collection('reservaciones')
    .where("semana", "==", data.semana)
    .where("ciclo", "==", data.ciclo)
    .where("laboratorio", "==", data.laboratorio)
    .get()
    .then((result) => {
        if (result.size) {
            result.forEach((doc) => {
                const data = doc.data();
                for (let index = 0; index < data.horas; index++) {
                    let dateFormat = moment.unix(data.fecha.seconds);
                    dateFormat.add(index, "h");
                    dateFormat.add(5, "m");
                    let checkIteration = dateFormat.isBetween(fechaIni, fechaFin);
                    validationCheck = validationCheck ? true : checkIteration;
                }
            });
            
            if (!validationCheck) {
                data.fecha = firebase.firestore.Timestamp.fromDate(new Date(data.fecha.toString()));
                db.collection("reservaciones").doc().set(data)
                .then(() => { 
                    callback({
                        success: true,
                        check: true
                    });
                })
                .catch((e) => { 
                    callback({
                        success: false,
                        error: e
                    });
                });
            }else{
                callback({
                    success: true,
                    check: false,
                    data: "El laboratorio se encuentra ocupado"
                });
            }
        } else {
            data.fecha = firebase.firestore.Timestamp.fromDate(new Date(data.fecha.toString()));
            db.collection("reservaciones").doc().set(data)
            .then(() => {
                callback({
                    success: true,
                    check: true
                });
            })
            .catch((e) => {
                callback({
                    success: false,
                    error: e
                });
            });
        }
    })
    .catch((error) => {
        callback({
            success: false,
            error: error
        });
    });
}

export const editarReservacion = (id, data, callback) => {
    db.collection('reservaciones').doc(id).update(data)
        .then(() => {
            callback({ sussess: true });
        })
        .catch((e) => {
            callback({ sussess: false, error: e });
        });
}

export const eliminarReservacion= (id,callback) => {
    db.collection('reservaciones').doc(id).delete()
    .then(()=>{
        callback({sussess:true});
    })
    .catch((e)=>{
        callback({sussess:false,error:e});
    });
}

export const comentariosReservacion = (id, data, callback) => {
    db.collection('reservaciones').doc(id).set({
        comentarios: data
    }, { merge: true })
    .then(() => {
        callback({ sussess: true });
    })
    .catch((e) => {
        callback({ sussess: false, error: e });
    });
}

export const agregarSolicitud = (data , callback) => {
    db.collection("solicitudes").doc().set(data)
    .then(() => {callback({susses:true});})
    .catch((e) => {callback({susses:true,error:e});});
}

export const agregarUsuario = (data,callback) => {
    let check = [];
    let ref = db.collection('usuarios').where("usuario", "==", data.usuario);
    ref.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            check.push(doc.data());
        });
        if(check.length > 0){
            callback({sussess:false,error:false,mensaje:"El usuario ya existe"});
        }else{
            db.collection("usuarios").doc().set(data)
            .then(() => {callback({sussess:true,error:false,mensaje:"nuevo usuario agregado."});})
            .catch((e) => {callback({sussess:false,error:true,mensaje:e});});
        }
    })
    .catch(function(error) {
        callback({sussess:false,error:true,mensaje:error});
    });
}

export const editarUsuario = (id, data, callback) => {
    db.collection('usuarios').doc(id).update(data)
    .then(()=>{
        callback({sussess:true});
    })
    .catch((e)=>{
        callback({sussess:false,error:e});
    });
}

export const eliminarUsuario = (id,callback) => {
    db.collection('usuarios').doc(id).delete()
    .then(()=>{
        callback({sussess:true});
    })
    .catch((e)=>{
        callback({sussess:false,error:e});
    });
}
