import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { TablaAdministracion } from "../component/general/TablaAdministracion";
import Add from '@material-ui/icons/Add'
import Requester from "../communication/Requester";

import "../assets/css/controller/ClientesScreen.css";

import InfoOutlined from '@material-ui/icons/InfoOutlined';

const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";
//const mapacheSoporteBaseUrl = "http://localhost:5000";

class ClientesScreen extends Component {

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
            if (response.ok){
                this.componentDidMount();
            } else {
                console.log("Error al borrar clientes");
            }
        });
    }

    componentDidMount() {
        this.requester.get('/clientes')
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                console.log("Error al consultar clientes");
            }
        })
        .then(response => {
            console.log(response);
            if (response) {
                this.setState({
                    clientes: response
                });
            }
        });
    }

    render() {
        return (
            <div className="clientes-screen-div">
                <TablaAdministracion 
                    title={ title }
                    columns={ columns }
                    data={ this.state.clientes }
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
                          tooltip: "Crear cliente",
                          position: "toolbar",
                          onClick: () => {
                              this.handleAdd()
                          }},
                        {
                            icon: editIcon,
                            tooltip: "Editar cliente",
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


export default withRouter(ClientesScreen);

const title = "Clientes";

const columns = [
    {
        title: "Razon Social", 
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
        title: "estado",
        field: "estado"
    }
]

const editIcon = InfoOutlined;