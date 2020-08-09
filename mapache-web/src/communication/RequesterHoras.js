import Requester from "./Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";

class RequesterHoras {
    constructor(){
        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.obtenerHorasCargadas = this.obtenerHorasCargadas.bind(this);
        this.obtenerHorasCargadasEnUnDia = this.obtenerHorasCargadasEnUnDia.bind(this);
        this.obtenerHorasCargadasSemana = this.obtenerHorasCargadasSemana.bind(this);
        this.obtenerHorasCargadasMes = this.obtenerHorasCargadasMes.bind(this);

        this.obtenerHorasCargadasEnTarea = this.obtenerHorasCargadasEnTarea.bind(this);
    }

    async obtenerHorasCargadas(legajo, mostrarAlerta){
        let horasCargadas = await this.requester.get(`/empleados/${legajo}/horas`)
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                mostrarAlerta(
                    `Error al consultar horas del empleado ${legajo}`,
                    "error"
                )
            }
        }).then(response => {
            console.log("response ",response);
            if (response) {
                return response;
            }
        });
        return horasCargadas;
    }

    async obtenerHorasCargadasEnUnDia(legajo, dia, mostrarAlerta){
        const uri = `/empleados/${legajo}/horas?fechaFin=${dia}&fechaInicio=${dia}`;
        let horasCargadas = await this.requester.get(uri)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    mostrarAlerta(
                        `Error al consultar horas del empleado ${legajo}`,
                        "error"
                    )
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });
        return horasCargadas;
    }

    procesarFecha(fecha) {
        let mes = fecha.getMonth() + 1;
        if (mes <= 9) {
            mes = `0${mes}`;
        }
        let dia = fecha.getDate();
        if (dia <= 9) {
            dia = `0${dia}`;
        }
        return `${fecha.getFullYear()}-${mes}-${dia}`;
    }

    async obtenerHorasCargadasSemana(legajo, fechaFin, mostrarAlerta){
        let fechaInicio = new Date(fechaFin);
        const nuevoDia = fechaFin.getDate() - 7;
        fechaInicio.setDate(nuevoDia);

        const fechaIniFormateada = this.procesarFecha(fechaInicio);
        const fechaFinFormateada = this.procesarFecha(fechaFin);
        
        let horasCargadas = await this.requester.get(`/empleados/${legajo}/horas?fechaFin=${fechaFinFormateada}&fechaInicio=${fechaIniFormateada}`)
        .then(response => {
            if (response.ok){
                return response.json();
            } else {                
                mostrarAlerta(
                    `Error al consultar horas del empleado ${legajo}`,
                    "error"
                )
            }
        }).then(response => {            
            if (response) {
                return response;
            }
        });
        return horasCargadas;
    }

    async obtenerHorasCargadasMes(legajo, fecha, mostrarAlerta){
        let primerDia = this.procesarFecha(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
        let ultimoDia = this.procesarFecha(new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0));
        
        const uri = `/empleados/${legajo}/horas?fechaFin=${ultimoDia}&fechaInicio=${primerDia}`;
        let horasCargadas = await this.requester.get(uri)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {                
                    mostrarAlerta(
                        `Error al consultar horas del empleado ${legajo}`,
                        "error"
                    )
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });

        return horasCargadas;
    }

    async obtenerHorasCargadasAnio(legajo, fecha, mostrarAlerta){
        let primerDia = this.procesarFecha(new Date(fecha.getFullYear(), 0, 1));
        let ultimoDia = this.procesarFecha(new Date(fecha.getFullYear(), 11, 31));
        
        const uri = `/empleados/${legajo}/horas?fechaFin=${ultimoDia}&fechaInicio=${primerDia}`;
        let horasCargadas = await this.requester.get(uri)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {                
                    mostrarAlerta(
                        `Error al consultar horas del empleado ${legajo}`,
                        "error"
                    )
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });

        return horasCargadas;
    }

    async obtenerHorasCargadasEnTarea(legajo, codigoProyecto, codigoTarea, mostrarAlerta) {
        const uri = `/empleados/${legajo}/proyectos/${codigoProyecto}/tareas/${codigoTarea}/horas`;
        let horasCargadas = await this.requester.get(uri)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    mostrarAlerta(
                        `Error al consultar horas cargadas del empleado ${legajo}`,
                        "error"
                    )
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });
        return horasCargadas;
    }
}

export default RequesterHoras;