import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { TablaAdministracion } from "../component/general/TablaAdministracion";

import Requester from "../communication/Requester";

import "../assets/css/controller/EmpleadosScreen.css";

// Icono para enviar a la tabla
import InfoOutlined from '@material-ui/icons/InfoOutlined';

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class EmpleadosScreen extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleados: []
        }

        
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleAdd(newData) {
        console.log(newData);
        /*let empleado = {
            "activo": true,
            "apellido": newData.apellido,
            "contrato": newData.contrato,
            "dni": "",
            "fechaNacimiento": "1990-06-02",
            "legajo": newData.legajo,
            "nombre": newData.nombre,
            "proyectos": [
              
            ],
            "rol": "DESARROLLADOR",
            "seniority": newData.seniority
        }

        this.requester.post('/empleados/', empleado)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log("Error al consultar empleados");
                }
            });*/
        this.props.history.push({
            pathname: `/empleados/${newData.legajo}`,
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
        this.requester.delete('/empleados/' + newData.legajo)
        .then(response => {
            if (response.ok){
                console.log(`Empleado ${newData.legajo} fue eliminado de manera exitosa`);
            } else {
                console.log("Error al consultar empleados");
            }
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

    render() {
        return (
            <div className="empleados-screen-div">
                <TablaAdministracion 
                    title={ title }
                    columns={ columns }
                    data={ this.state.empleados }
                    handleAdd={ this.handleAdd }
                    handleEdit={ this.handleEdit }
                    handleDelete={ this.handleDelete } 
                    editIcon={ editIcon }
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


