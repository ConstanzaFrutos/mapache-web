import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { TablaAdministracion } from "../component/general/TablaAdministracion";

import Requester from "../communication/Requester";

import "../assets/css/controller/EmpleadosScreen.css";

// Icono para enviar a la tabla
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';

import { Confirmation } from "../component/general/Confirmation";

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class EmpleadosScreen extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleados: [],
            confirmarEliminacion: false,
            empleadoSeleccionado: null
        }

        
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleCancelar = this.handleCancelar.bind(this);
        this.handleAceptar = this.handleAceptar.bind(this);
    }

    handleAdd() {
        this.props.history.push({
            pathname: `/empleados/${0}`,
            state: {
                modo: "add"
            }
        });    
    }

    handleEdit(oldData) {
        // Esta funcion en el caso de los empleados 
        // se usa para redirigir el perfil
        console.log("En edit");
        console.log(oldData);
        
        this.props.history.push({
            pathname: `/empleados/${oldData.legajo}`,
            state: {
                modo: "info"
            }
        });
    }

    handleDelete(newData) {
        console.log("En delete");
        this.setState({
            confirmarEliminacion: true,
            empleadoSeleccionado: newData
        });
    }

    componentDidMount() {
        this.requester.get('/empleados/')
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                console.log("Error al consultar empleados");
            }
        })
        .then(response => {
            console.log(response);
            if (response) {
                this.setState({
                    empleados: response
                });
            }
        });
    }

    handleCancelar() {
        console.log("Cancela");
        this.setState({
            confirmarEliminacion: false
        });
    }

    handleAceptar() {
        console.log("Acepta");
        this.setState({
            confirmarEliminacion: false
        });
        this.requester.delete('/empleados/' + this.state.empleadoSeleccionado.legajo)
        .then(response => {
            if (response.ok){
                console.log(`Empleado ${this.state.empleadoSeleccionado.legajo} fue eliminado de manera exitosa`);
            } else {
                console.log("Error al consultar empleados");
            }
        });
    }

    render() {
        return (
            <div className="empleados-screen-div">
                <Confirmation 
                    open={ this.state.confirmarEliminacion } 
                    title="Confirmar eliminación empleado"
                    message="¿Esta seguro que desea eliminar al empleado?"
                    handleCancelar={ this.handleCancelar }
                    handleAceptar={ this.handleAceptar }
                ></Confirmation>
                <TablaAdministracion 
                    title={ title }
                    columns={ columns }
                    data={ this.state.empleados }
                    handleAdd={ this.handleAdd }
                    handleEdit={ this.handleEdit }
                    handleDelete={ this.handleDelete } 
                    editIcon={ editIcon }
                    editable = { null }
                    actions={[
                        {
                            icon: Add,
                            tooltip: "Agregar empleado",
                            position: "toolbar",
                            onClick: () => {
                                this.handleAdd()
                            }
                        },
                        {
                            icon: editIcon,
                            tooltip: "Consultar perfil de empleado",
                            onClick: (event, rowData) => {
                                this.handleEdit(rowData)  
                                console.log(rowData)
                            }
                        },
                        {
                            icon: Delete,
                            tooltip: "Eliminar empleado",
                            onClick: (event, rowData) => {
                                this.handleDelete(rowData)  
                                console.log(rowData)
                            }
                        }
                      ]}
                ></TablaAdministracion>
            </div>
        )
    }

}

export default withRouter(EmpleadosScreen);

const title = "Empleados";

const columns = [
    {
        title: "Legajo", 
        field: "legajo",
        editable: "never"
    },
    {
        title: "Nombre", 
        field: "nombre",
        editable: "never"
    },
    {
        title: "Apellido", 
        field: "apellido",
        editable: "never"
    },
    {
        title: "Rol", 
        field: "rol",
        editable: "never"
    }
];

const editIcon = InfoOutlined;


