import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/PerfilEmpleado.css";

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Save from '@material-ui/icons/Save'
import Clear from '@material-ui/icons/Clear'

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

        this.handleTextInput = this.handleTextInput.bind(this);

        this.handleSeniorityChange = this.handleSeniorityChange.bind(this);
        this.handleContratoChange = this.handleContratoChange.bind(this);
        this.handleRolChange = this.handleRolChange.bind(this);

        this.handleDateInput = this.handleDateInput.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleCancelSave = this.handleCancelSave.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state.modo === "info") {
            this.procesarInfo();
        } 
    }
    
    procesarInfo() {
        let legajo = this.props.match.params.legajo;
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

    handleSeniorityChange(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        empleado.seniority = event.target.value;
        this.setState({
            empleado: empleado
        });
        console.log(this.state.empleado);
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
        console.log(this.state.empleado);
    }

    handleContratoChange(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        empleado.contrato = event.target.value;
        console.log(event.target.value)
        this.setState({
            empleado: empleado
        });
        console.log(this.state.empleado);
    }

    handleDateInput(event, label) {
        console.log(event.target.value);
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        if (label === "Fecha de nacimiento") {
            empleado.fechaNacimiento = event.target.value;            
        } else if (label === "Antigüedad") {
            empleado.antiguedad = event.target.value;
        }
        this.setState({
            empleado: empleado
        });
        console.log(this.state.empleado);
    }

    handleTextInput(event, label) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        if (label === "Legajo") {
            empleado.legajo = event.target.value;            
        } else if (label === "Nombre") {
            empleado.nombre = event.target.value;
        } else if (label === "Apellido") {
            empleado.apellido = event.target.value;
        } else if (label === "DNI") {
            empleado.dni = event.target.value;
        }
        this.setState({
            empleado: empleado
        });
    }

    handleSave() {
        /*let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);*/
        let empleado = {
            activo: true,
            apellido: this.state.empleado.apellido,
            nombre: this.state.empleado.nombre,
            dni: this.state.empleado.dni,
            legajo: this.state.empleado.legajo,
            proyectos: [],
            rol: this.state.empleado.rol,
            seniority: this.state.empleado.seniority,
            contrato: this.state.empleado.contrato,
            fechaNacimiento: this.state.empleado.fechaNacimiento
        }            
        if (!empleado.seniority)
            empleado.seniority = 'Junior';
        console.log(empleado);
        this.requester.post('/empleados/', empleado)
            .then(response => {
                if (response.ok){
                    console.log(response.json());
                } else {
                    console.log("Error al agregar empleado");
                }
            });
    }

    handleCancelSave() {
        this.props.history.push({
            pathname: `/empleados`
        }); 
    }

    render() {
        let data = null;
        let avatar = null;

        let seniority = this.state.empleado.seniority ? this.state.empleado.seniority : seniorities[0].value;
        let contrato = this.state.empleado.contrato ? this.state.empleado.contrato : contratos[0].value;
        let rol = this.state.empleado.rol ? this.state.empleado.rol : roles[0].value;

        if (this.props.location.state.modo === "info") {
            let nombreYApellido = this.state.empleado.apellido + ", " + this.state.empleado.nombre;
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
                        <p>
                            <TextField 
                                required 
                                id="standard-required" 
                                label="Legajo" 
                                onChange={ (e) => this.handleTextInput(e, "Legajo") }
                            />
                        </p>
                        <p className="nombre-y-apellido">
                            <TextField 
                                required 
                                id="standard-required" 
                                label="Nombre" 
                                onChange={ (e) => this.handleTextInput(e, "Nombre") }
                            />
                            <TextField 
                                required 
                                id="standard-required" 
                                label="Apellido" 
                                onChange={ (e) => this.handleTextInput(e, "Apellido") }
                            />
                        </p>
                        <p>
                            <TextField 
                                required 
                                id="standard-required" 
                                label="DNI" 
                                onChange={ (e) => this.handleTextInput(e, "DNI") }
                            />
                        </p>

                        <br></br>
                        <p className="fechas-paragraph">
                            <DatePicker 
                                label="Fecha de nacimiento"
                                handleDateInput={ this.handleDateInput }
                            ></DatePicker>
                            <DatePicker 
                                label="Antigüedad"
                                handleDateInput={ this.handleDateInput }
                            ></DatePicker>
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
                        <div className="iconos-agregar-empleado">
                            <Save 
                                className="save-profile-icon" 
                                onClick={ this.handleSave }
                            ></Save>
                            <Clear 
                                className="clear-profile-icon" 
                                onClick={ this.handleCancelSave }
                            ></Clear>
                        </div>
                        <br></br>
                        
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

const rolesSeniority = [
    "UX",
    "QA",
    "DESARROLLADOR",
    "ARQUITECTO"
]

const seniorities = [
    {
        'name': "No asignada",
        'value': "SIN_SENIORITY"
    },
    {
        'name': "Junior",
        'value': "JUNIOR"
    },
    {
        'name': "Semi-Senior",
        'value': "SEMI_SENIOR"
    },
    {
        'name': "Senior",
        'value': "SENIOR"
    }
]

const contratos = [
    {
        'name': "No asignado",
        'value': "SIN_CONTRATO"   
    },
    {
        'name': "Full-Time",
        'value': "FULL_TIME"
    },
    {
        'name': "Part-Time",
        'value': "PART_TIME"
    }
]