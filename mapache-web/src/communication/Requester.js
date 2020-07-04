class Requester {
    constructor(baseUrl){
        this.baseUrl = baseUrl;

        this.get = this.get.bind(this);
    }
    
    get (url, callback) {
        let response = fetch(this.baseUrl + url, {
                            method: 'GET',
                            headers: this.getHeaders()
                        })
        return response;
    }

    post (url, payload, callback) {
        let response = fetch(this.baseUrl + url, {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify(payload)
                        })
                        .then(resp =>{
                            console.log(resp);
                            return resp;
                        })
        return response;
    }

    put (url, payload, callback) {
        let response = fetch(this.baseUrl + url, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(payload)
        })
        return response;
    }

    delete (url, callback) {
        let response = fetch(this.baseUrl + url, {
            method: 'DELETE',
            headers: this.getHeaders()
        })
        return response;
    }

    getHeaders () {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
        
        return headers;
    }

}

export default Requester;