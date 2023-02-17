import React, {Component} from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

class TablaUsuarios extends Component{
  render(){
    let usuarios = this.props.usuarios;
    let rowsData = [];
    // console.log(usuarios);

    if(usuarios){
      let correoSplit = this.props.correo.split("@");
      let userActive = correoSplit[0];
      
      usuarios.map((usr) => {
        let activeButtons = userActive === usr.usuario ? true : false;
        rowsData.push({
          usuario: usr.usuario, 
          rol:usr.rol === 1 ? "Administrador" : "Docente", 
          action: 
          // <div style={{display: activeButtons ? "none" : "block"}}>
          <div>
            <MDBBtn color="info" size="sm" onClick={()=>{this.props.editar({id:usr.id,usr:usr.usuario,rol:usr.rol})}} disabled={activeButtons}
            style={{marginTop: 0,marginBottom: 0,}}
            >Editar</MDBBtn>
            <MDBBtn color="danger" size="sm" onClick={()=>{this.props.eliminar(usr.id)}} disabled={activeButtons}
            style={{marginTop: 0,marginBottom: 0,}}
            >Eliminar</MDBBtn>
          </div>
        });
        return true;
      });
    }

    let data = {
      columns: [
        {label: 'Usuario', field: 'usuario', sort: 'asc', width: 150},
        {label: 'Rol', field: 'rol', sort: 'asc', width: 150},
        {label: '', field: 'action', width: 150},
      ],
      rows: rowsData
    };
    // console.log(usuarios);
  
    return (
    <MDBDataTable 
      style={{backgroundColor: 'white'}} 
      data={data}
      bordered
      hover 
      small 
      responsive
      noBottomColumns 
      infoLabel={["Mostrar", "-", "de", "registros"]}
      entriesLabel="Registros por pagina"
      paginationLabel={["<",">"]}
      searchLabel="Buscar"
      noRecordsFoundLabel="No hay datos"
      theadColor="grey lighten-4"
      entriesOptions={[5,10]}
      entries={5}
      // sortRows={["usuario","rol"]}
    />
    );
  }
}


export default TablaUsuarios;





