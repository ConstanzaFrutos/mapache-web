import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Add from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit';

import { TablaAdministracion } from "../component/general/TablaAdministracion";
import { Loader } from "../component/general/Loader.js";
import { Alerta } from "../component/general/Alerta.js";

import Requester from "../communication/Requester";

import "../assets/css/controller/ClientesScreen.css";


const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";
// const mapacheSoporteBaseUrl = "http://localhost:5000";

class ClientesScreen extends Component {
    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheSoporteBaseUrl);

        this.state = {
            tickets: [],
            notificacion: this.props.location.state,
            loading: true,
            alerta: {
                mostrar: false,
                tipo: "",
                mensaje: "",
                duracion: null
            }
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.mostrarAlerta = this.mostrarAlerta.bind(this);
        this.handleCloseAlerta = this.handleCloseAlerta.bind(this);
    }

    mostrarAlerta(mensaje, tipo, duracion = null) {
        this.setState({
            alerta: {
                mostrar: true,
                tipo: tipo,
                mensaje: mensaje,
                duracion: duracion
            }
        });
    }

    handleCloseAlerta() {
        this.setState({
            alerta: {
                mostrar: false
            }
        });
    }

    handleAdd() {
        this.props.history.push({
            pathname: `/clientes/nuevo`
        });
    }

    handleEdit(oldData) {
        // Esta funcion en el caso de los empleados
        // se usa para redirigir el perfil
        this.props.history.push({
            pathname: `/clientes/${oldData.id}`
        });
    }

    handleDelete(newData) {
        this.requester.delete('/clientes/' + newData.id)
            .then(response => {
                if (response.ok) {
                    this.componentDidMount();
                } else {
                    console.error("Error al borrar cliente");
                }
            });
    }

    componentDidMount() {
        if (this.state.notificacion) {
            this.mostrarAlerta(this.state.notificacion.mensaje, this.state.notificacion.tipo, 2000)
        }

        this.requester.get('/clientes')
            .then(response => {
                this.setState({
                    loading: false
                });
                if (response.ok) {
                    return response.json();
                } else {
                    this.mostrarAlerta("Ocurrió un error al consultar los clientes", "error");
                }
            })
            .then(response => {
                if (response) {
                    this.setState({
                        clientes: response
                    });
                }
            });
    }

    render() {
        let alerta = null;
        let contenido = null;

        if (this.state.alerta.mostrar) {
            alerta = <Alerta
                open={true}
                mensaje={this.state.alerta.mensaje}
                tipo={this.state.alerta.tipo}
                handleClose={this.handleCloseAlerta}
                duracion={this.state.alerta.duracion}
            >
            </Alerta>
        }

        if (this.state.loading) {
            contenido = <Loader></Loader>
        } else {
            contenido =
                <div className="clientes-screen-div">
                    <TablaAdministracion
                        title={title}
                        columns={columns}
                        filtering={true}
                        data={this.state.clientes}
                        handleAdd={this.handleAdd}
                        handleEdit={this.handleEdit}
                        //handleDelete={ this.handleDelete }
                        editIcon={editIcon}
                        /*
                        editable={{
                            onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                                resolve();

                                this.handleDelete(oldData);

                            }),
                        }}
                        */
                        editable={null}
                        actions={[
                            {
                                icon: Add,
                                tooltip: "Crear cliente",
                                position: "toolbar",
                                onClick: () => {
                                    this.handleAdd()
                                }
                            },
                            {
                                icon: editIcon,
                                tooltip: "Editar cliente",
                                onClick: (event, rowData) => {
                                    this.handleEdit(rowData)
                                    //   console.log(rowData)
                                    //   console.log("PruebaEdit");
                                }
                            }
                        ]}

                    ></TablaAdministracion>
                </div>
        }

        return (
            <div>
                {alerta}
                {contenido}
            </div>
        )
    }
}


export default withRouter(ClientesScreen);

const title = "Clientes";

const columns = [
    {
        title: "Razón Social",
        field: "razon_social"
    },
    {
        title: "CUIT",
        field: "CUIT"
    },
    {
        title: "Fecha de creación",
        field: "fecha_desde_que_es_cliente"
    },
    {
        title: "Estado",
        field: "estado",
        defaultFilter: ["activo"],
        lookup: {
            "activo": "Activo",
            "inactivo": "Inactivo"
        }
    }
]

const editIcon = EditIcon;
