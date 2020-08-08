import React, { Component, useEffect } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabEstadisticas.css";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { Fecha } from "./TabHorasCargadas";
import { Dropdown } from "../general/Dropdown";
import { DatePicker } from "../general/DatePicker";
import { Alerta } from "../general/Alerta";

import RequesterHoras from "../../communication/RequesterHoras";

am4core.useTheme(am4themes_animated);

class TabEstadisticas extends Component {

    constructor(props) {
        super(props);

        this.fechaHoy = new Fecha(new Date());

        this.state = {
            legajo: '',
            contrato: '',
            data: [],
            horasDia: 0,
            frecuencia: frecuencias[0].value,
            fechaSeleccionada: this.fechaHoy.fechaProcesadaGuion
        }

        this.requesterHoras = new RequesterHoras();

        this.handleFrecuenciaChange = this.handleFrecuenciaChange.bind(this);
        this.handleDateInput = this.handleDateInput.bind(this);
        
        this.obtenerHorasDia = this.obtenerHorasDia.bind(this);
        this.obtenerHorasSemana = this.obtenerHorasSemana.bind(this);
        this.obtenerHorasMes = this.obtenerHorasMes.bind(this);
        this.obtenerHorasAnio = this.obtenerHorasAnio.bind(this);
    }

    async componentDidMount() {
        let legajo = this.props.match.params.legajo;
        let contrato = this.props.contrato;
        const horasDia = this.props.contrato === "FULL_TIME" ? 9 : 4;
        let horas = [];
        
        if (this.state.frecuencia === 0) {
            horas = await this.requesterHoras.obtenerHorasCargadasEnUnDia(
                legajo, 
                this.state.fechaSeleccionada, 
                this.props.mostrarAlerta
            );
            console.log("Horas", horas);
        } 
        
        console.log("Horas cargadas ", horas);
        this.setState({
            legajo: legajo,
            contrato: contrato,
            data: horas,
            horasDia: horasDia
        })
    }

    handleFrecuenciaChange(event) {
        this.setState({
            frecuencia: event.target.value
        });
    }

    handleDateInput(event) {
        console.log("Nueva fecha seleccionada ", event.target.value)
        this.setState({
            fechaSeleccionada: event.target.value
        });
    }

    async obtenerHorasDia() {
        const horasCargadas = await this.requesterHoras.obtenerHorasCargadasEnUnDia(
            this.props.match.params.legajo, 
            this.state.fechaSeleccionada, 
            this.props.mostrarAlerta
        );
        return horasCargadas;
    }

    async obtenerHorasSemana() {
        const fecha = this.state.fechaSeleccionada ? new Date(this.state.fechaSeleccionada) : new Date();
        const horasCargadas = await this.requesterHoras.obtenerHorasCargadasSemana(
            this.props.match.params.legajo, 
            fecha,
            this.props.mostrarAlerta
        );
        return horasCargadas;
    }

    async obtenerHorasMes() {
        const fecha = this.state.fechaSeleccionada ? new Date(this.state.fechaSeleccionada) : new Date();
        const horasCargadas = await this.requesterHoras.obtenerHorasCargadasMes(
            this.props.match.params.legajo, 
            fecha,
            this.props.mostrarAlerta
        );
        return horasCargadas;
    }

    async obtenerHorasAnio() {
        const fecha = this.state.fechaSeleccionada ? new Date(this.state.fechaSeleccionada) : new Date();
        const horasCargadas = await this.requesterHoras.obtenerHorasCargadasAnio(
            this.props.match.params.legajo, 
            fecha,
            this.props.mostrarAlerta
        );
        return horasCargadas;
    }

    render() {

        const fechaHoy = new Fecha(new Date());
        let fecha = this.state.fechaSeleccionada 
                        ? this.state.fechaSeleccionada : 
                        fechaHoy.fechaProcesadaGuion;
        let fechaFormatoDate = this.state.fechaSeleccionada ? 
                new Date(this.state.fechaSeleccionada) : new Date();
        
        let chart = null;
        let label = '';

        if (this.state.frecuencia === 0) {
            chart = <ChartDiario
                        fechaSeleccionada={ fecha }
                        obtenerHorasDia={ this.obtenerHorasDia }
                        horasDia={ this.state.horasDia }
                    ></ChartDiario>
            label = `Ocupación del empleado en el día ${ fecha }`;
        } else if (this.state.frecuencia === 1) {
            chart = <ChartSemanal
                        fechaSeleccionada={ this.state.fechaSeleccionada }
                        obtenerHorasSemana={ this.obtenerHorasSemana }
                        horasDia={ this.state.horasDia }
                    ></ChartSemanal>
            label = `Ocupación del empleado en la semana ${ fecha }`;
        } else if (this.state.frecuencia === 2) {
            chart = <ChartMensual
                        mesSeleccionado={ fechaFormatoDate.getMonth() + 1 }
                        obtenerHorasMes={ this.obtenerHorasMes }
                    ></ChartMensual>
            label = `Ocupación del empleado en el mes ${ fechaFormatoDate.getMonth() + 1 }`;
        } else if (this.state.frecuencia === 3) {
            chart = <ChartAnual
                        fechaSeleccionada={ this.state.fechaSeleccionada }
                        obtenerHorasAnio={ this.obtenerHorasAnio }
                    ></ChartAnual>
            label = `Ocupación del empleado en el año ${ fechaFormatoDate.getFullYear() }`;
        }

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

        const contrato = this.state.contrato === "FULL_TIME" ? "Full-Time" : "Part-Time";
        const horasContrato = this.state.contrato === "FULL_TIME" ? "40" : "20";

        return (
            <div className="tab-estadisticas-div">
                <Paper square> 
                    <div className="header-div">
                        <Typography variant="h6">
                            Disponibilidad: { contrato } ({ horasContrato } hs semanales)
                        </Typography>                        
                        <DatePicker 
                            label="Fecha"
                            handleDateInput={ this.handleDateInput }
                        ></DatePicker>
                        <Dropdown
                            renderDropdown={ true }
                            label="Frecuencia"
                            value={ this.state.frecuencia }
                            values={ frecuencias }
                            handleChange={ this.handleFrecuenciaChange }
                        >
                        </Dropdown> 
                    </div>
                    <div className="chart-div">
                        { chart }
                    </div>
                    <div className="footer-div">
                        <Typography variant="subtitle1" align="center">
                            { label }
                        </Typography>      
                    </div>
                </Paper>
                { alerta }
            </div>
        )
    }

}

export default withRouter(TabEstadisticas);

const frecuencias = [
    {
        name: "Diaria",
        value: 0
    },
    {
        name: "Semanal",
        value: 1
    },
    {
        name: "Mensual",
        value: 2
    },
    {
        name: "Anual",
        value: 3
    }
]

function ChartDiario(props) {
    function procesarDataDiaria(data, totalHorasDia) {
        let horasOcupadas = 0;
        
        data.forEach((data) => {
            horasOcupadas += data.cantidadHoras;
        });

        let horasNoOcupadas = totalHorasDia - horasOcupadas;

        return [
            { "actividad": "Ocupado", "size": horasOcupadas },
            { "actividad": "No ocupado", "size": horasNoOcupadas }
        ];
    }

    const obtenerChart = async () => {
        let chart = am4core.create("chart-diario", am4charts.PieChart);

        let data = await props.obtenerHorasDia();
        console.log("data", data);
        // Add data
        chart.data = procesarDataDiaria(data, props.horasDia);
        
        // Add label
        chart.innerRadius = 100;
        let label = chart.seriesContainer.createChild(am4core.Label);
        label.text = props.fechaSeleccionada;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 30;
        
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "size";
        pieSeries.dataFields.category = "actividad";

        return chart;
    }

    useEffect(() => {
        obtenerChart();
    });

    return (
        <div className="chart-diario"></div>
    );
}

function ChartSemanal(props) {
    function procesarDataSemanal(data, totalHorasDia) {

        let horasVacaciones = 0;
        let horasEnfermedad = 0;
        let horasDiaDeEstudio = 0;
        let horasTarea = 0;
        let horasNoOcupadas = totalHorasDia * 5;
        
        data.forEach((data) => {
            if (data.actividad === "VACACIONES"){
                horasVacaciones += data.cantidadHoras;
            } else if (data.actividad === "ENFERMEDAD"){
                horasEnfermedad += data.cantidadHoras;
            } else if (data.actividad === "DIA_DE_ESTUDIO"){
                horasDiaDeEstudio += data.cantidadHoras;
            } else if (data.actividad === "TAREA"){
                horasTarea += data.cantidadHoras;
            } else {
                horasNoOcupadas -= data.cantidadHoras;
            }
        });

        return [
            { "actividad": "Vacaciones", "size": horasVacaciones },
            { "actividad": "Enfermedad", "size": horasEnfermedad },
            { "actividad": "Día de estudio", "size": horasDiaDeEstudio },
            { "actividad": "Tarea", "size": horasTarea },
            { "actividad": "No ocupado", "size": horasNoOcupadas }
        ];
    }

    const obtenerChart = async () => {
        let chart = am4core.create("chart-semanal", am4charts.PieChart);

        let data = await props.obtenerHorasSemana();
        // Add data
        chart.data = procesarDataSemanal(data, props.horasDia);
        
        // Add label
        chart.innerRadius = 90;
        let label = chart.seriesContainer.createChild(am4core.Label);
        
        let fechaSeleccionada = props.fechaSeleccionada;
        // TODO mostrar inicio y fin semana
        console.log("Horas ", props.horasCargadas)

        label.text = fechaSeleccionada;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 30;
        
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "size";
        pieSeries.dataFields.category = "actividad";
        
        return chart;
    }

    useEffect(() => {
        obtenerChart();
    });

    return (
        <div className="chart-semanal"></div>
    );
}

function ChartMensual(props) {

    function procesarDataMensual(data, totalHorasDia) {
        let horasVacaciones = 0;
        let horasEnfermedad = 0;
        let horasDiaDeEstudio = 0;
        let horasTarea = 0;
        let horasNoOcupadas = totalHorasDia * 21;
        
        data.forEach((data) => {
            if (data.actividad === "VACACIONES"){
                horasVacaciones += data.cantidadHoras;
            } else if (data.actividad === "ENFERMEDAD"){
                horasEnfermedad += data.cantidadHoras;
            } else if (data.actividad === "DIA_DE_ESTUDIO"){
                horasDiaDeEstudio += data.cantidadHoras;
            } else if (data.actividad === "TAREA"){
                horasTarea += data.cantidadHoras;
            } else {
                horasNoOcupadas -= data.cantidadHoras;
            }
        });

        return [
            { "actividad": "Vacaciones", "size": horasVacaciones },
            { "actividad": "Enfermedad", "size": horasEnfermedad },
            { "actividad": "Día de estudio", "size": horasDiaDeEstudio },
            { "actividad": "Tarea", "size": horasTarea },
            { "actividad": "No ocupado", "size": horasNoOcupadas }
        ];
    }

    const obtenerChart = async () => {
        let chart = am4core.create("chart-mensual", am4charts.PieChart);

        let data = await props.obtenerHorasMes();
        
        // Add data
        chart.data = procesarDataMensual(data, props.horasDia);
        
        // Add label
        chart.innerRadius = 90;
        let label = chart.seriesContainer.createChild(am4core.Label);
        
        let mesSeleccionado = props.mesSeleccionado;

        label.text = mesSeleccionado;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 30;
        
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "size";
        pieSeries.dataFields.category = "actividad";
        
        return chart;
    }

    useEffect(() => {
        obtenerChart();
    });

    return (
        <div className="chart-mensual"></div>
    );
}

function ChartAnual(props) {

    function procesarDataAnual(data) {
        let enero = 0;
        let febrero = 0;
        let marzo = 0;
        let abril = 0;
        let mayo = 0;
        let junio = 0;
        let julio = 0;
        let agosto = 0;
        let septiembre = 0;
        let octubre = 0;
        let noviembre = 0;
        let diciembre = 0;

        data.forEach((d) => {
            if (d.fecha[1] === 0) {
                enero += d.cantidadHoras;
            } else if (d.fecha[1] === 1) {
                febrero += d.cantidadHoras;
            } else if (d.fecha[1] === 2) {
                marzo += d.cantidadHoras;
            } else if (d.fecha[1] === 3) {
                abril += d.cantidadHoras;
            } else if (d.fecha[1] === 4) {
                mayo += d.cantidadHoras;
            } else if (d.fecha[1] === 5) {
                junio += d.cantidadHoras;
            } else if (d.fecha[1] === 6) {
                julio += d.cantidadHoras;
            } else if (d.fecha[1] === 7) {
                agosto += d.cantidadHoras;
            } else if (d.fecha[1] === 8) {
                septiembre += d.cantidadHoras;
            } else if (d.fecha[1] === 9) {
                octubre += d.cantidadHoras;
            } else if (d.fecha[1] === 10) {
                noviembre += d.cantidadHoras;
            } else if (d.fecha[1] === 11) {
                diciembre += d.cantidadHoras;
            }
        });

        return [
            {"mes": "Enero", "value": enero}, 
            {"mes": "Febrero", "value": febrero}, 
            {"mes": "Marzo", "value": marzo}, 
            {"mes": "Abril", "value": abril}, 
            {"mes": "Mayo", "value": mayo}, 
            {"mes": "Junio", "value": junio}, 
            {"mes": "Julio","value": julio}, 
            {"mes": "Agosto","value": agosto}, 
            {"mes": "Septiembre","value": septiembre}, 
            {"mes": "Octubre", "value": octubre}, 
            {"mes": "Noviembre","value": noviembre}, 
            {"mes": "Diciembre","value": diciembre}
        ]
    }

    const obtenerChart = async () => {
        let chart = am4core.create("chart-anual", am4charts.XYChart);

        let data = await props.obtenerHorasAnio();
        // Add data
        chart.data = procesarDataAnual(data);

        // Populate data
        for (var i = 0; i < (chart.data.length - 1); i++) {
            chart.data[i].valueNext = chart.data[i + 1].value;
        }

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "mes";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "mes";

        // Add series for showing variance arrows
        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "valueNext";
        series2.dataFields.openValueY = "value";
        series2.dataFields.categoryX = "mes";
        series2.columns.template.width = 1;
        series2.fill = am4core.color("#555");
        series2.stroke = am4core.color("#555");

        // Add a triangle for arrow tip
        let arrow = series2.bullets.push(new am4core.Triangle());
        arrow.width = 10;
        arrow.height = 10;
        arrow.horizontalCenter = "middle";
        arrow.verticalCenter = "top";
        arrow.dy = -1;

        // Set up a rotation adapter which would rotate the triangle if its a negative change
        arrow.adapter.add("rotation", function(rotation, target) {
            return getVariancePercent(target.dataItem) < 0 ? 180 : rotation;
        });

        // Set up a rotation adapter which adjusts Y position
        arrow.adapter.add("dy", function(dy, target) {
            return getVariancePercent(target.dataItem) < 0 ? 1 : dy;
        });

        // Add a label
        var label = series2.bullets.push(new am4core.Label());
        label.padding(10, 10, 10, 10);
        label.text = "";
        label.fill = am4core.color("#0c0");
        label.strokeWidth = 0;
        label.horizontalCenter = "middle";
        label.verticalCenter = "bottom";
        label.fontWeight = "bolder";

        // Adapter for label text which calculates change in percent
        label.adapter.add("textOutput", function(text, target) {
        let percent = getVariancePercent(target.dataItem);
            return percent ? percent + "%" : text;
        });

        // Adapter which shifts the label if it's below the variance column
        label.adapter.add("verticalCenter", function(center, target) {
            return getVariancePercent(target.dataItem) < 0 ? "top" : center;
        });

        // Adapter which changes color of label to red
        label.adapter.add("fill", function(fill, target) {
            return getVariancePercent(target.dataItem) < 0 ? am4core.color("#c00") : fill;
        });

        function getVariancePercent(dataItem) {
            if (dataItem) {
                let value = dataItem.valueY;
                let openValue = dataItem.openValueY;
                let change = value - openValue;
                return Math.round(change / openValue * 100);
            }
            return 0;
        }

    }

    useEffect(() => {
        obtenerChart();
    });

    return (
        <div className="chart-anual"></div>
    );

}
