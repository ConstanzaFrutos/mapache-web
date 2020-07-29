import Requester from "./Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";

class RequesterHoras {
    constructor(){
        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.obtenerHorasCargadas = this.obtenerHorasCargadas.bind(this);
    }

    async obtenerHorasCargadas(legajo){
        let horasCargadas = await this.requester.get(`/empleados/${legajo}/horas`)
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                alert.log(`Error al consultar horas del empleado ${legajo}`);
            }
        }).then(response => {
            console.log("response ",response);
            if (response) {
                return response;
            }
        });
        return horasCargadas;
    }

}

export default RequesterHoras;