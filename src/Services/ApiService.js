import Json from './sensor.json';

const urlBase = 'http://localhost:8080/api'

const consomeApi = (url = '', parametro = '', method = 'GET', body) => {


    // fetch(`${urlBase}/${url}${parametro}`).then(function (response) {
    //     if (response.ok) {
    //         console.log(response);
    //
    //     } else {
    //         console.log('Network response was not ok.');
    //     }
    // })
    //     .catch(function (error) {
    //         console.log('There has been a problem with your fetch operation: ' + error.message);
    //     });

    return fetch(`${urlBase}/${url}${parametro}`, {
        method,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(res => ApiService.TrataErros(res))
        .then(res => res.json())
        .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
}

const loadJson = () => {
    return Json;
}

const populateDB = () => {
    loadJson().measurements.forEach(measurement => {
        let obj = {
            'temperature': measurement.temperature,
            'date_hour': measurement.date_hour
        };
        ApiService.createMeasurement(obj)
    })
}


const ApiService = {
    loadTemperatures: () => loadJson(),
    createMeasurement: measurement => consomeApi('temperatura', '', 'POST', measurement),
    populateDB: () => populateDB(),
    getMeasurement: () => consomeApi('temperatura'),


    TrataErros: res => {
        if (!res.ok) {
            throw Error(res.responseText)
        }
        return res
    }
}
export default ApiService
