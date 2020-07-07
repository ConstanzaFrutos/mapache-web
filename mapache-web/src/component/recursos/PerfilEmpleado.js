import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/PerfilEmpleado.css";

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { DatePicker } from "../general/DatePicker";
import { Dropdown } from "../general/Dropdown";

import Requester from "../../communication/Requester";

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class PerfilEmpleado extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleado: {},
            iniciales: "",
            fechaNacimientoFormateada: "",
            antiguedadFormateada: "",
            fechaNacimientoSeleccionada: new Date(),
            renderDropdownSeniority: false
        }

        this.formatearFecha = this.formatearFecha.bind(this);
        this.procesarInfo = this.procesarInfo.bind(this);
        
        this.handleDateChange = this.handleDateChange.bind(this);

        this.handleSeniorityChange = this.handleSeniorityChange.bind(this);
        this.handleContratoChange = this.handleContratoChange.bind(this);
        this.handleRolChange = this.handleRolChange.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state.modo === "info") {
            this.procesarInfo();
        } 
    }
    
    procesarInfo() {
        let legajo = this.props.match.params.legajo;
        console.log("Params: ", this.props);
        console.log(`Legajo: ${legajo}`);

        this.requester.get('/empleados/' + legajo)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log("Error al consultar empleado con legajo: ");
                }
            })
            .then(response => {
                console.log(response);
                let iniciales = response.nombre.charAt(0) + response.apellido.charAt(0);
                iniciales = iniciales.toUpperCase();
                let fechaNacimientoFormateada = this.formatearFecha(response.fechaNacimiento);
                console.log(fechaNacimientoFormateada);
                //let antiguedadFormateada = this.formatearFecha(response.antiguedad);
                if (response) {
                    this.setState({
                        empleado: response,
                        iniciales: iniciales,
                        fechaNacimientoFormateada: fechaNacimientoFormateada
                    });
                }
            });
    }

    formatearFecha(fecha) {
        let año = fecha[0];
        let mes = fecha[1];
        let dia = fecha[2];

        return `${dia}/${mes}/${año}`;
    }

    handleDateChange = (date) => {
        console.log(date);
        this.setState({
            fechaNacimientoSeleccionada: date
        });
    };

    handleSeniorityChange(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        empleado.seniority = event.target.value;
        this.setState({
            empleado: empleado
        });
    }

    handleRolChange(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        empleado.rol = event.target.value;
        let renderDropdownSeniority = rolesSeniority.includes(empleado.rol);
        console.log(renderDropdownSeniority);
        
        this.setState({
            empleado: empleado,
            renderDropdownSeniority: renderDropdownSeniority
        });
        console.log(this.state);
    }

    handleContratoChange(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        empleado.contrato = event.target.value;
        this.setState({
            empleado: empleado
        });
    }

    
    render() {
        
        let nombreYApellido = this.state.empleado.apellido + ", " + this.state.empleado.nombre;

        let data = null;
        console.log(this.props.location.state.modo);

        let avatar = null;

        let seniority = seniorities[0];
        if (this.state.empleado.seniority) {
            seniority = this.state.empleado.seniority;
        }

        let contrato = contratos[0];
        if (this.state.empleado.contrato) {
            contrato = this.state.empleado.contrato;
        }

        let rol = roles[0];
        if (this.state.empleado.rol) {
            rol = this.state.empleado.rol;
        }

        if (this.props.location.state.modo === "info") {
            avatar = <div className={"foto-y-nombre"}>
                        <Avatar className="avatar">
                            {this.state.iniciales}
                        </Avatar>
                        <p className={"nombre"}>
                            {nombreYApellido}
                        </p>
                    </div>

            data = <div className="informacion">
                        <p>Nombre y Apellido: { this.state.empleado.nombre + ", " + this.state.empleado.apellido }</p>
                        <p>DNI: { this.state.empleado.dni }</p>
                        <p>Fecha de nacimiento: { this.state.fechaNacimientoFormateada }</p>
                        <br></br>
                        <p>Legajo: { this.state.empleado.legajo }</p>
                        <br></br>
                        <p>Seniority: { this.state.empleado.seniority }</p>
                        <br></br>
                        <p>Contrato: { this.state.empleado.contrato }</p>
                        <br></br>
                        <p>Antigüedad: { this.state.empleado.antiguedad }</p>
                        <br></br>
                        <p>Rol: { this.state.empleado.rol }</p>
                    </div>
        } else if (this.props.location.state.modo === "add") {
            data = <div className="add">
                        <p><TextField required id="standard-required" label="Legajo" /></p>
                        <p><TextField required id="standard-required" label="Nombre y Apellido" /></p>
                        <p><TextField required id="standard-required" label="DNI" /></p>

                        <br></br>
                        <p className="fechas-paragraph">
                            <DatePicker label="Fecha de nacimiento"></DatePicker>
                            <DatePicker label="Antigüedad"></DatePicker>
                        </p>
                        <br></br>
                        <p className="dropdown-paragraph">
                            <Dropdown
                                renderDropdown={ true }
                                label="Rol"
                                value={ rol }
                                values={ roles }
                                handleChange={ this.handleRolChange }
                            >
                            </Dropdown>  
                            
                            <Dropdown
                                renderDropdown={ this.state.renderDropdownSeniority }
                                label="Seniority"
                                value={ seniority }
                                values={ seniorities }
                                handleChange={ this.handleSeniorityChange }
                            >
                            </Dropdown>  

                            <Dropdown
                                renderDropdown={ true }
                                label="Contrato"
                                value={ contrato }
                                values={ contratos }
                                handleChange={ this.handleContratoChange }
                            >
                            </Dropdown> 
                        </p>
                    </div>
        }


        return (
            <div className="perfil-empleado">
                    { avatar }
                <div className={ "perfil-empleado-body" }>
                    <Paper square className="paper-informacion">
                        { data }
                    </Paper>
                </div>
            </div>
        )
    }

}

export default withRouter(PerfilEmpleado);


const roles = [
    "UX",
    "QA",
    "Desarrollador",
    "Lider de Proyecto",
    "Arquitecto",
    "Producto"
]

const rolesSeniority = [
    "UX",
    "QA",
    "Desarrollador",
    "Arquitecto"
]

const seniorities = [
    "Junior",
    "Semi-Senior",
    "Senior"
]

const contratos = [
    "Full-time",
    "Part-time",
    "Soporte"
]