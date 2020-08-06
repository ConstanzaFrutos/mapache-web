import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabInformacion.css";

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit'
import Save from '@material-ui/icons/Save'
import Clear from '@material-ui/icons/Clear'

import { DatePicker } from "../general/DatePicker";
import { Dropdown } from "../general/Dropdown";
import { Alerta } from "../general/Alerta";

import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class Tabinformacion extends Component {
    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleado: {},
            empleadoFormateado: {},
            iniciales: "",
            fechaNacimientoSeleccionada: new Date(),
            renderDropdownSeniority: false,
            mostrarAlerta: false,
            tipoAlerta: "",
            mensajeAlerta: ""
        }

        this.formatearEmpleado = this.formatearEmpleado.bind(this);

        this.formatearFecha = this.formatearFecha.bind(this);
        this.procesarAntiguedad = this.procesarAntiguedad.bind(this);
        this.procesarInfo = this.procesarInfo.bind(this);

        this.handleTextInput = this.handleTextInput.bind(this);

        this.handleSeniorityChange = this.handleSeniorityChange.bind(this);
        this.handleContratoChange = this.handleContratoChange.bind(this);
        this.handleRolChange = this.handleRolChange.bind(this);

        this.handleDateInput = this.handleDateInput.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleCancelSave = this.handleCancelSave.bind(this);

        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancelEdit = this.handleCancelEdit.bind(this);

        this.mostrarAlerta = this.mostrarAlerta.bind(this);
        this.handleCloseAlerta = this.handleCloseAlerta.bind(this);
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
                
                let empleadoFormateado = this.formatearEmpleado(response);

                if (response) {
                    this.setState({
                        empleado: response,
                        empleadoFormateado: empleadoFormateado,
                        iniciales: iniciales
                    });
                }
            });
    }

    formatearEmpleado(empleado) {
        let fechaNacimientoFormateada = this.formatearFecha(empleado.fechaNacimiento);
        let antiguedad = this.procesarAntiguedad(empleado.fechaIngreso);
        let rol = roles.find(rol => rol.value === empleado.rol).name;
        let seniority = seniorities.find(seniority => seniority.value === empleado.seniority).name;
        let contrato = contratos.find(contrato => contrato.value === empleado.contrato).name;

        let empleadoFormateado = {
            activo: empleado.activo,
            apellido: empleado.apellido,
            nombre: empleado.nombre,
            dni: empleado.dni,
            legajo: empleado.legajo,
            rol: rol,
            seniority: seniority,
            contrato: contrato, 
            fechaNacimiento: fechaNacimientoFormateada,
            antiguedad: antiguedad
        };

        return empleadoFormateado;
    }

    formatearFecha(fecha) {
        let año = fecha[0];
        let mes = fecha[1];
        let dia = fecha[2];

        return `${dia}/${mes}/${año}`;
    }

    formatearFechaDatePicker(fecha) {
        let año = fecha[0];
        let mes = fecha[1];
        let dia = fecha[2];

        return `${año}-${mes}-${dia}`;
    }

    procesarAntiguedad(fechaIngreso) {
        let fechaActual = new Date();

        let años = fechaActual.getFullYear() - fechaIngreso[0];
        let meses = fechaActual.getMonth() - fechaIngreso[1] + 1;
        console.log("mes actual ", fechaActual.getMonth());
        console.log("meses ", meses);

        return (años > 0) ? `${años} años y ${meses} meses` : 
               (meses > 0) ? `${meses} meses` : "Ingreso este mes";
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
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        if (label === "Fecha de nacimiento") {
            empleado.fechaNacimiento = event.target.value;            
        } else if (label === "Fecha de Ingreso") {
            empleado.fechaIngreso = event.target.value;
        }
        this.setState({
            empleado: empleado
        });
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
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        empleado.activo = true;
                  
        if (!empleado.seniority)
            empleado.seniority = seniorities[0].value;
        
        console.log(empleado);
        this.requester.post('/empleados/', empleado)
            .then(response => {
                if (response.ok){
                    console.log(response.json());
                } else {
                    this.mostrarAlerta(
                        `Error al ingresar al empleado`,
                        error
                    );
                }
            });
        this.props.history.push({
            pathname: `/empleados`
        }); 
    }

    handleCancelSave() {
        this.props.history.push({
            pathname: `/empleados`
        }); 
    }

    handleEdit() {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        empleado.activo = true;
        console.log("Empleado a actualizar ", empleado);
                  
        if (!empleado.seniority)
            empleado.seniority = seniorities[0].value;
        
        console.log("Empleado editado ", empleado);
        this.requester.put(`/empleados/${empleado.legajo}`, empleado)
            .then(response => {
                if (response.ok){
                    console.log("ok");
                } else {
                    this.mostrarAlerta(
                        `Error al editar al empleado ${this.state.empleado.legajo}`,
                        error
                    );
                }
            });
        this.props.history.push({
            pathname: `/empleados/${empleado.legajo}`,
            state: {
                modo: "info",
                tab: "informacion"
            }
        }); 
    }

    handleCancelEdit() {
        this.props.history.push({
            pathname: `/empleados/${this.state.empleado.legajo}`,
            state: {
                modo: "info",
                tab: "informacion"
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

    render() {
        let data = null;
        let avatar = null;

        let seniority = this.state.empleado.seniority ? this.state.empleado.seniority : seniorities[0].value;
        let contrato = this.state.empleado.contrato ? this.state.empleado.contrato : contratos[0].value;
        let rol = this.state.empleado.rol ? this.state.empleado.rol : roles[0].value;

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
        console.log("EN TAB INFORMACION ", this.props.modo);
        if (this.props.modo === "info") {
            console.log("En info");
            let nombreYApellido = this.state.empleado.apellido + ", " + this.state.empleado.nombre;
            avatar = <div className={"foto-y-nombre"}>
                        <Avatar className="avatar">
                            {this.state.iniciales}
                        </Avatar>
                        <p className={"nombre"}>
                            {nombreYApellido}
                        </p>
                    </div>

            let seniorityInfo = null;
            if (this.state.empleadoFormateado.seniority !== "No asignada") {
                seniorityInfo = <div>
                                    <br></br>
                                    <p>Seniority: { this.state.empleadoFormateado.seniority }</p>
                                </div>
            }

            data = <div className="informacion">
                        <p>Nombre y Apellido: { this.state.empleado.nombre + ", " + this.state.empleado.apellido }</p>
                        <p>DNI: { this.state.empleado.dni }</p>
                        <p>Fecha de nacimiento: { this.state.empleadoFormateado.fechaNacimiento }</p>
                        <br></br>
                        <p>Legajo: { this.state.empleadoFormateado.legajo }</p>
                        { seniorityInfo }
                        <br></br>
                        <p>Contrato: { this.state.empleadoFormateado.contrato }</p>
                        <br></br>
                        <p>Antigüedad: { this.state.empleadoFormateado.antiguedad }</p>
                        <br></br>
                        <p>Rol: { this.state.empleadoFormateado.rol }</p>
                        <div className="iconos-informacion-empleado">
                            <Edit 
                                className="edit-profile-icon" 
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: `/empleados/${this.state.empleado.legajo}`,
                                        state: {
                                            modo: "edit",
                                            tab: "informacion"
                                        }
                                    });
                                }}
                            ></Edit>
                        </div>
                        <br></br>
                    </div>
        } else if (this.props.modo === "add") {
            data = <div className="add">
                        { alerta }
                        <p>
                            <TextField 
                                required 
                                id="standard-required" 
                                autoComplete="off"
                                label="Legajo" 
                                onChange={ (e) => this.handleTextInput(e, "Legajo") }
                            />
                        </p>
                        <p className="nombre-y-apellido">
                            <TextField 
                                required 
                                id="standard-required" 
                                autoComplete="off"
                                label="Nombre" 
                                onChange={ (e) => this.handleTextInput(e, "Nombre") }
                            />
                            <TextField 
                                required 
                                id="standard-required" 
                                autoComplete="off"
                                label="Apellido" 
                                onChange={ (e) => this.handleTextInput(e, "Apellido") }
                            />
                        </p>
                        <p>
                            <TextField 
                                required 
                                id="standard-required" 
                                label="DNI" 
                                autoComplete="off"
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
                                label="Fecha de Ingreso"
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
        } else if (this.props.modo === "edit") {
            data = <div className="edit">
                        { alerta }
                        <p>
                            <TextField 
                                id="standard-read-only-input"
                                label="Legajo"
                                defaultValue={ this.state.empleado.legajo }
                                InputProps={{
                                  readOnly: true,
                                }}
                            />
                        </p>
                        <p className="nombre-y-apellido">
                            <TextField 
                                id="standard-required" 
                                label="Nombre" 
                                autoComplete="off"
                                defaultValue={ this.state.empleado.nombre }
                                onChange={ (e) => this.handleTextInput(e, "Nombre") }
                            />
                            <TextField 
                                id="standard-required" 
                                label="Apellido" 
                                autoComplete="off"
                                defaultValue={ this.state.empleado.apellido }
                                onChange={ (e) => this.handleTextInput(e, "Apellido") }
                            />
                        </p>
                        <p>
                            <TextField 
                                id="standard-required" 
                                label="DNI" 
                                autoComplete="off"
                                defaultValue={ this.state.empleado.dni }
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
                                label="Fecha de Ingreso"
                                handleDateInput={ this.handleDateInput }
                            ></DatePicker>
                        </p>
                        <br></br>
                        <p className="dropdown-paragraph">
                            <Dropdown
                                renderDropdown={ true }
                                label="Rol"
                                value={ this.state.empleado.rol }
                                values={ roles }
                                handleChange={ this.handleRolChange }
                            >
                            </Dropdown>  
                            
                            <Dropdown
                                renderDropdown={ this.state.renderDropdownSeniority }
                                label="Seniority"
                                value={ this.state.empleado.seniority }
                                values={ seniorities }
                                handleChange={ this.handleSeniorityChange }
                            >
                            </Dropdown>  

                            <Dropdown
                                renderDropdown={ true }
                                label="Contrato"
                                value={ this.state.empleado.contrato }
                                values={ contratos }
                                handleChange={ this.handleContratoChange }
                            >
                            </Dropdown> 
                        </p>
                        <div className="iconos-agregar-empleado">
                            <Save 
                                className="save-profile-icon" 
                                onClick={ this.handleEdit }
                            ></Save>
                            <Clear 
                                className="clear-profile-icon" 
                                onClick={ this.handleCancelEdit }
                            ></Clear>
                        </div>
                        <br></br>
                        
                    </div>
        }

        return(
            <div className="tab-informacion-div">
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

export default withRouter(Tabinformacion);

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

// Opciones alerta
const error = "error";