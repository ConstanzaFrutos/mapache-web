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
import { Alerta } from "../component/general/Alerta";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class EmpleadosScreen extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleados: [],
            confirmarEliminacion: false,
            empleadoSeleccionado: null,
            mostrarAlerta: false,
            tipoAlerta: "",
            mensajeAlerta: ""
        }

        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleCancelar = this.handleCancelar.bind(this);
        this.handleAceptar = this.handleAceptar.bind(this);

        this.mostrarAlerta = this.mostrarAlerta.bind(this);
        this.handleCloseAlerta = this.handleCloseAlerta.bind(this);
    }

    handleAdd() {
        this.props.history.push({
            pathname: `/empleados/${0}`,
            state: {
                modo: "add",
                tab: "informacion"
            }
        });    
    }

    handleEdit(oldData) {
        // Esta funcion en el caso de los empleados 
        // se usa para redirigir el perfil
        
        this.props.history.push({
            pathname: `/empleados/${oldData.legajo}`,
            state: {
                modo: "info",
                tab: "informacion"
            }
        });
    }

    handleDelete(newData) {
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
                    this.mostrarAlerta(
                        "Error al consultar empleados",
                        error
                    );                
                }
            })
            .then(response => {
                if (response) {
                    this.setState({
                        empleados: response
                    });
                }
            });
    }

    mostrarAlerta(mensaje, tipo) {
        this.setState({
            mostrarAlerta: true,
            tipoAlerta: tipo,
            mensajeAlerta: mensaje
        });
    }

    handleCloseAlerta() {
        this.setState({
            mostrarAlerta: false
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
                this.mostrarAlerta(
                    `Empleado ${this.state.empleadoSeleccionado.legajo} fue eliminado de manera exitosa`,
                    success
                );
                console.log(`Empleado ${this.state.empleadoSeleccionado.legajo} fue eliminado de manera exitosa`);
            } else {
                this.mostrarAlerta(
                    `Error al eliminar al empleado ${this.state.empleadoSeleccionado.legajo}`,
                    error
                );
            }
        });
    }

    render() {
        let alerta = null;
        if (this.state.mostrarAlerta) {
            alerta = <Alerta
                        open={ true }
                        mensaje={ this.state.mensajeAlerta }
                        tipo={ this.state.tipoAlerta }
                        handleClose={ this.handleCloseAlerta }
                     >
                     </Alerta>
        }

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
                { alerta }
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
        editable: "never",
        defaultSort: "asc"
    },
    {
        title: "Nombre", 
        field: "nombre",
        editable: "never",
        cellStyle: {
            minWidth: '20em'
        }
    },
    {
        title: "Apellido", 
        field: "apellido",
        editable: "never",
        cellStyle: {
            minWidth: '20em'
        }
    },
    {
        title: "Rol", 
        field: "rol",
        editable: "never",
        cellStyle: {
            minWidth: '10em'
        },
        render: rowData => <div>{ roles.find((rol) => rol.value === rowData.rol).name }</div>
    }
];

const editIcon = InfoOutlined;

// Opciones alerta

const success = "success";
const error = "error";

const roles = [
    {
        'name': "No asignado",
        'value': "SIN_ROL"
    },
    {
        'name': "UX",
        'value': "UX"
    },
    {
        'name': "QA",
        'value': "QA"
    },
    {
        'name': "Desarrollador",
        'value': "DESARROLLADOR"
    },
    {
        'name': "Líder de Proyecto",
        'value': "LIDER_PROYECTO"
    },
    {
        'name': "Arquitecto",
        'value': "ARQUITECTO"
    },
    {
        'name': "Líder de RRHH",
        'value': "LIDER_RRHH"
    }
]