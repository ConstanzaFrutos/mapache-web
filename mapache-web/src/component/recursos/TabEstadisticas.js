import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabEstadisticas.css";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { Fecha } from "./TabHorasCargadas";
import { Dropdown } from "../general/Dropdown";
import { DatePicker } from "../general/DatePicker";

import RequesterHoras from "../../communication/RequesterHoras";

am4core.useTheme(am4themes_animated);

class TabEstadisticas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            frecuencia: frecuencias[0].value,
            fechaSeleccionada: null
        }

        this.requesterHoras = new RequesterHoras();

        this.handleFrecuenciaChange = this.handleFrecuenciaChange.bind(this);
        this.handleDateInput = this.handleDateInput.bind(this);
        
        this.obtenerHorasSemana = this.obtenerHorasSemana.bind(this);
    }

    handleFrecuenciaChange(event) {
        this.setState({
            frecuencia: event.target.value
        });
    }

    handleDateInput(event) {
        this.setState({
            fechaSeleccionada: event.target.value
        });
    }

    async obtenerHorasSemana() {
        const fecha = this.state.fechaSeleccionada ? this.state.fechaSeleccionada : new Date();
        const horasCargadas = await this.requesterHoras.obtenerHorasCargadasSemana(
            this.props.match.params.legajo, 
            fecha
        );
        return horasCargadas;
    }

    render() {

        const fechaHoy = new Fecha(new Date());
        let fecha = this.state.fechaSeleccionada 
                        ? this.state.fechaSeleccionada : 
                        fechaHoy.fechaProcesadaGuion;
        
        let chart = <ChartDiario></ChartDiario>
        if (this.state.frecuencia === 0) {
            chart = <ChartDiario
                        fechaSeleccionada={ fecha }
                    ></ChartDiario>
        } else if (this.state.frecuencia === 1) {
            chart = <ChartSemanal
                        fechaSeleccionada={ this.state.fechaSeleccionada }
                        horasCargadas={ this.obtenerHorasSemana() }
                    ></ChartSemanal>
        } else if (this.state.frecuencia === 2) {
            chart = <ChartMensual
                        fechaSeleccionada={ this.state.fechaSeleccionada }
                    ></ChartMensual>
        }

        return (
            <div className="tab-estadisticas-div">
                <div className="header-div">
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

class ChartDiario extends Component {
    
    componentDidUpdate() {
        let chart = am4core.create("chart-diario", am4charts.PieChart);

        // Add data
        chart.data = [
            { "actividad": "Ocupado", "size": 7 },
            { "actividad": "Disponible", "size": 2 }
        ];
        
        // Add label
        chart.innerRadius = 100;
        let label = chart.seriesContainer.createChild(am4core.Label);
        label.text = this.props.fechaSeleccionada;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 30;
        
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "size";
        pieSeries.dataFields.category = "actividad";
  
        this.chart = chart;
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
    
    render() {
        return (
            <div className="chart-diario"></div>
        );
    }
    
}

class ChartSemanal extends Component {
    
    componentDidMount() {
        let chart = am4core.create("chart-semanal", am4charts.PieChart);

        // Add data
        chart.data = [
            { "actividad": "Vacaciones", "size": 9 },
            { "actividad": "Enfermedad", "size": 0 },
            { "actividad": "Día de estudio", "size": 0 },
            { "actividad": "Tarea", "size": 8 },
            { "actividad": "Ocio", "size": 1 },
            { "actividad": "Disponible", "size": 1 }
        ];
        
        // Add label
        chart.innerRadius = 100;
        let label = chart.seriesContainer.createChild(am4core.Label);
        
        let fechaSeleccionada = this.props.fechaSeleccionada;
        console.log("Horas ", this.props.horasCargadas)

        label.text = fechaSeleccionada;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 30;
        
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "size";
        pieSeries.dataFields.category = "actividad";
  
        this.chart = chart;
    }
    /*componentDidMount() {
        let chart = am4core.create("chart-semanal", am4charts.XYChart);

        // Add data
        chart.data = [{
            "year": "2016",
            "europe": 2.5,
            "namerica": 2.5,
            "asia": 2.1,
            "lamerica": 0.3,
            "meast": 0.2,
            "africa": 0.1
        }, {
            "year": "2017",
            "europe": 2.6,
            "namerica": 2.7,
            "asia": 2.2,
            "lamerica": 0.3,
            "meast": 0.3,
            "africa": 0.1
        }, {
            "year": "2018",
            "europe": 2.8,
            "namerica": 2.9,
            "asia": 2.4,
            "lamerica": 0.3,
            "meast": 0.3,
            "africa": 0.1
        }];
        
        chart.legend = new am4charts.Legend();
        chart.legend.position = "right";
        
        // Create axes
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.opacity = 0;
        
        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.renderer.grid.template.opacity = 0;
        valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
        valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
        valueAxis.renderer.ticks.template.length = 10;
        valueAxis.renderer.line.strokeOpacity = 0.5;
        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.minGridDistance = 40;
        
        // Create series
        function createSeries(field, name) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = field;
            series.dataFields.categoryY = "year";
            series.stacked = true;
            series.name = name;
            
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.locationX = 0.5;
            labelBullet.label.text = "{valueX}";
            labelBullet.label.fill = am4core.color("#fff");
        }
        
        createSeries("europe", "Europe");
        createSeries("namerica", "North America");
        createSeries("asia", "Asia");
        createSeries("lamerica", "Latin America");
        createSeries("meast", "Middle East");
        createSeries("africa", "Africa");

        this.chart = chart;
    }*/

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
    
    render() {
        return (
            <div className="chart-semanal"></div>
        );
    }
    
}

class ChartMensual extends Component {

    componentDidMount() {
        let chart = am4core.create("chart-mensual", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.data = [
            {
                category: "One",
                Vacaciones: 0,
                Enfermedad: 0,
                DíaDeEstudio: 9,
                Tarea: 29,
                NoOcupado: 2
            },
            {
                category: "Two",
                Vacaciones: 18,
                Enfermedad: 0,
                DíaDeEstudio: 0,
                Tarea: 2,
                NoOcupado: 2
            },
            {
                category: "Three",
                Vacaciones: 0,
                Enfermedad: 0,
                DíaDeEstudio: 0,
                Tarea: 40,
                NoOcupado: 0
            },
            {
                category: "Four",
                Vacaciones: 0,
                Enfermedad: 9,
                DíaDeEstudio: 0,
                Tarea: 30,
                NoOcupado: 1
            }
        ];

        chart.colors.step = 2;
        chart.padding(30, 30, 10, 30);
        chart.legend = new am4charts.Legend();

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = 100;
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;
        valueAxis.renderer.minWidth = 50;


        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.width = am4core.percent(80);
        series1.columns.template.tooltipText =
        "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
        series1.name = "Vacaciones";
        series1.dataFields.categoryX = "category";
        series1.dataFields.valueY = "Vacaciones";
        series1.dataFields.valueYShow = "totalPercent";
        series1.dataItems.template.locations.categoryX = 0.5;
        series1.stacked = true;
        series1.tooltip.pointerOrientation = "vertical";

        var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
        bullet1.interactionsEnabled = false;
        bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
        bullet1.label.fill = am4core.color("#ffffff");
        bullet1.locationY = 0.5;

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.columns.template.width = am4core.percent(80);
        series2.columns.template.tooltipText =
        "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
        series2.name = "Enfermedad";
        series2.dataFields.categoryX = "category";
        series2.dataFields.valueY = "Enfermedad";
        series2.dataFields.valueYShow = "totalPercent";
        series2.dataItems.template.locations.categoryX = 0.5;
        series2.stacked = true;
        series2.tooltip.pointerOrientation = "vertical";

        var bullet2 = series2.bullets.push(new am4charts.LabelBullet());
        bullet2.interactionsEnabled = false;
        bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
        bullet2.locationY = 0.5;
        bullet2.label.fill = am4core.color("#ffffff");

        var series3 = chart.series.push(new am4charts.ColumnSeries());
        series3.columns.template.width = am4core.percent(80);
        series3.columns.template.tooltipText =
        "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
        series3.name = "Día de estudio";
        series3.dataFields.categoryX = "category";
        series3.dataFields.valueY = "DíaDeEstudio";
        series3.dataFields.valueYShow = "totalPercent";
        series3.dataItems.template.locations.categoryX = 0.5;
        series3.stacked = true;
        series3.tooltip.pointerOrientation = "vertical";

        var bullet3 = series3.bullets.push(new am4charts.LabelBullet());
        bullet3.interactionsEnabled = false;
        bullet3.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
        bullet3.locationY = 0.5;
        bullet3.label.fill = am4core.color("#ffffff");

        var series4 = chart.series.push(new am4charts.ColumnSeries());
        series4.columns.template.width = am4core.percent(80);
        series4.columns.template.tooltipText =
        "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
        series4.name = "Tarea";
        series4.dataFields.categoryX = "category";
        series4.dataFields.valueY = "Tarea";
        series4.dataFields.valueYShow = "totalPercent";
        series4.dataItems.template.locations.categoryX = 0.5;
        series4.stacked = true;
        series4.tooltip.pointerOrientation = "vertical";

        var bullet4 = series4.bullets.push(new am4charts.LabelBullet());
        bullet4.interactionsEnabled = false;
        bullet4.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
        bullet4.locationY = 0.5;
        bullet4.label.fill = am4core.color("#ffffff");

        var series5 = chart.series.push(new am4charts.ColumnSeries());
        series5.columns.template.width = am4core.percent(80);
        series5.columns.template.tooltipText =
        "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
        series5.name = "No Ocupado";
        series5.dataFields.categoryX = "category";
        series5.dataFields.valueY = "NoOcupado";
        series5.dataFields.valueYShow = "totalPercent";
        series5.dataItems.template.locations.categoryX = 0.5;
        series5.stacked = true;
        series5.tooltip.pointerOrientation = "vertical";

        var bullet5 = series5.bullets.push(new am4charts.LabelBullet());
        bullet5.interactionsEnabled = false;
        bullet5.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
        bullet5.locationY = 0.5;
        bullet5.label.fill = am4core.color("#ffffff");

        chart.scrollbarX = new am4core.Scrollbar();

        this.chart = chart;
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
    
    render() {
        return (
            <div className="chart-mensual"></div>
        );
    }
    
}