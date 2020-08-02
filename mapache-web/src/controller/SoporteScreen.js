import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Add from '@material-ui/icons/Add'
import InfoOutlined from '@material-ui/icons/InfoOutlined';

import { TablaAdministracion } from "../component/general/TablaAdministracion";

import Requester from "../communication/Requester";

import "../assets/css/controller/SoporteScreen.css";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";
// const mapacheSoporteBaseUrl = "http://localhost:5000"

class SoporteScreen extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheSoporteBaseUrl);
        this.recursosRequester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            tickets: [],
            empleados: []
        }


        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleAdd() {
        this.props.history.push({
            pathname: `/soporte/tickets/nuevo`
        });
    }

    handleEdit(oldData) {
        // Esta funcion en el caso de los empleados
        // se usa para redirigir el perfil
        this.props.history.push({
            pathname: `/tickets/${oldData.id}`
        });
    }

    handleDelete(newData) {
        this.requester.delete('/tickets/' + newData.id)
        .then(response => {
            if (response.ok){
                this.componentDidMount();
            } else {
                console.log("Error al borrar tickets");
            }
        });
    }

    componentDidMount() {
        this.recursosRequester.get('/empleados/')
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Error al consultar empleados");
            }
        })
        .then((recursos) => {
            this.setState({ empleados: recursos })
            this.requester.get('/tickets')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Error al consultar tickets");
                }
            })
            .then(tickets => {
                if (tickets) {
                    tickets.forEach((ticket) => {
                        if (ticket.legajo_responsable === -1) {
                            ticket.responsable = "-";
                        } else {
                            let empleado = this.state.empleados.find((empleado) => parseInt(empleado.legajo) === ticket.legajo_responsable);
                            ticket.responsable = `${empleado.nombre} ${empleado.apellido}`;
                        }
                    });
                    this.setState({ tickets: tickets });
                }
            });
        });

    }

    render() {
        return (
            <div className="tickets-screen-div">

                <TablaAdministracion
                    title={ title }
                    columns={ columns }
                    data={ this.state.tickets }
                    handleAdd={ this.handleAdd }
                    handleEdit={ this.handleEdit }
                    //handleDelete={ this.handleDelete }
                    editIcon={ editIcon }
                    /*
                    editable={{
                        onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            resolve();

                            this.handleDelete(oldData);

                        }),
                    }}
                    */
                    editable = { null }
                    actions={[
                        {
                          icon: Add,
                          tooltip: "Create ticket",
                          position: "toolbar",
                          onClick: () => {
                              this.handleAdd()
                          }},
                        {
                            icon: editIcon,
                            tooltip: "Edit ticket",
                            onClick: (event, rowData) => {
                              this.handleEdit(rowData)
                              console.log(rowData)
                              console.log("PruebaEdit");
                            }
                          }
                      ]}

                ></TablaAdministracion>
            </div>
        )
    }
}


export default withRouter(SoporteScreen);

const title = "Tickets";

const columns = [
    {
        title: "Titulo",
        field: "nombre"
    },
    {
        title: "Tipo",
        field: "tipo"
    },
    {
        title: "Estado",
        field: "estado"
    },
    {
        title: "Severidad",
        field: "severidad"
    },
    {
        title: "Cliente",
        field: "cliente.razon_social"
    },
    {
        title: "Responsable",
        field: "responsable"
    }
]

const editIcon = InfoOutlined;