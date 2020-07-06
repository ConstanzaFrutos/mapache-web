import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { TablaAdministracion } from "../component/general/TablaAdministracion";
import Add from '@material-ui/icons/Add'
import Requester from "../communication/Requester";

import "../assets/css/controller/SoporteScreen.css";

import InfoOutlined from '@material-ui/icons/InfoOutlined';

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheSoporteBaseUrl = "http://localhost:5000";

class SoporteScreen extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheSoporteBaseUrl);

        this.state = {
            tickets: []
        }


        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleAdd() {
        console.log('PruebaADD')

        this.props.history.push({
            pathname: `/soporte/tickets/nuevo`
        });

        /*
        this.requester.post('/tickets', ticket)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log("Error al consultar empleados");
                }
            });
*/
    }

    handleEdit(newData, oldData) {
        console.log("En edit");
        /*this.requester.put('/empleados/' + oldData.legajo)
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                console.log("Error al consultar empleados");
            }
        });*/
    }

    handleDelete(newData) {
        console.log("En delete");
        this.requester.delete('/tickets/' + newData.id)
        .then(response => {
            if (response.ok){
                console.log(`Ticket ${newData.id} fue eliminado de manera exitosa`);
            } else {
                console.log("Error al consultar tickets");
            }
        });
    }

    componentDidMount() {
        this.requester.get('/tickets')
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                console.log("Error al consultar empleados");
            }
        })
        .then(response => {
            console.log(response.tickets);
            if (response.tickets) {
                this.setState({
                    tickets: response.tickets
                });
            }
        });
    }

    render() {
        return (
            <div className="soporte-screen-div">

                <TablaAdministracion 
                    title={ title }
                    columns={ columns }
                    data={ this.state.tickets }
                    handleAdd={ this.handleAdd }
                    handleEdit={ this.handleEdit }
                    handleDelete={ this.handleDelete }
                    editIcon={ editIcon }
                    editable={{
                        onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            resolve();
                            this.props.handleDelete(oldData);
                        }),
                    }}
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
                              console.log(rowData)
                              console.log("Prueba");
                            }
                          }
                      ]}

                ></TablaAdministracion>
            </div>
        )	      
    }
}


export default withRouter(SoporteScreen);

const title = "Ticket";

const columns = [
    {
        title: "id", 
        field: "id"
    },
    {
        title: "Nombre", 
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
    }
]

const editIcon = InfoOutlined;