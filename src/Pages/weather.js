import React from "react";
import {Chart} from 'chart.js';
class Weather extends React.Component{
    constructor() {
        super();
        this.getLocation = this.getLocation.bind(this);
        this.getWeatherData = this.getWeatherData.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.addData = this.addData.bind(this);
        this.removeData = this.removeData.bind(this);
        this.canvasRef = React.createRef();
        this.dateLabels = [];
        this.temperatureData = [];
        this.chart = null;

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.dateLabels,
              datasets: [{
                label: 'Temperatures in ºC',
                data: this.temperatureData,
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
    }
/*
    componentDidMount(){
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.dateLabels,
              datasets: [{
                label: 'Temperatures in ºC',
                data: this.temperatureData,
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
          //this.updateChart(this.canvasRef.current);
    }
    */
    
    render(){
        return (
            <main id="weather">
                <section id="article">
                    <header>
                        <h2>Weather Prediction App</h2>
                        <p>By David Gianadda, 03/01/2023 at 20:00</p>
                    </header>
                </section>

                <p>
                    This page will use your browser geolocalisation capabilities to get your current latitude and longitude. It will then call{' '}
                    <a href="https://opencagedata.com/">opencagedata.com</a> to find a corresponding address and{' '}
                    <a href="https://api.open-meteo.com/">api.open-meteo.com</a> to get the temperature prediction for the next seven days.
                </p>
                <button onClick={this.getLocation()} id="weatherButton">
                    Try It
                </button>
                <p id="demo"></p>
                <div>
                    <canvas ref={this.canvasRef} id="myChart"></canvas>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/chart.js" />
            </main>
        );
    }
    
    getLocation() {
        let x = document.getElementById("demo");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        }

        else {
            x.innerHTML = "Geolocalisation is not supported by this browser.";
        }
    }
    showPosition(position) {
        let x = document.getElementById("demo");
        const api_key = '71abb4f156534c03a9237ae7eee73100';
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        this.getWeatherData(latitude, longitude);
        let api_url = 'https://api.opencagedata.com/geocode/v1/json';
        let request_url = api_url
            + '?'
            + 'key=' + api_key
            + '&q=' + encodeURIComponent(latitude + ',' + longitude)
            + '&pretty=1'
            + '&no_annotations=1';

        console.log(request_url);
        let request = new XMLHttpRequest();
        request.open('GET', request_url, true);

        request.onload = function () {
            // see full list of possible response codes:
            // https://opencagedata.com/api#codes
            if (request.status === 200) {
                // Success!
                let data = JSON.parse(request.responseText);
                x.innerHTML = data.results[0].formatted; // print the location

            } else if (request.status <= 500) {
                // We reached our target server, but it returned an error
                console.log("unable to geocode! Response code: " + request.status);
                let data = JSON.parse(request.responseText);
                console.log('error msg: ' + data.status.message);
            } else {
                console.log("server error");
            }
        };
        request.onerror = function () {
            // There was a connection error of some sort
            console.log("unable to connect to server");
        };
        request.send();
    }

    

    getWeatherData(latitude, longitude){
        
        let searchUrl = 'https://api.open-meteo.com/v1/forecast?latitude='
        + latitude
        + '&longitude='
        + longitude
        + '&hourly=temperature_2m';

        console.log(searchUrl);
        let request2 = new XMLHttpRequest();
        request2.open('GET', searchUrl, true);

        request2.onload = function() {
        if (request2.status === 200)
        {
            //let data = JSON.parse(request2.responseText);
            let jsonObject = JSON.parse(request2.responseText);
            this.dateLabels = jsonObject.hourly.time;
            this.temperatureData = jsonObject.hourly.temperature_2m;
            this.updateChart(this.canvas);
        }
        else if (request2.status <= 500)
        {
            // We reached our target server, but it returned an error
            console.log("unable to geocode! Response code: " + request2.status);
            let data = JSON.parse(request2.responseText);
            console.log('error msg: ' + data.status.message);
        } 
        else 
        {
            console.log("server error");
        }
        }
        request2.send(); 
    }

    updateChart(chart) {
        this.removeData(chart);
        for(let i = 0; i<this.temperatureData.length; i++){
            this.addData(chart,'Temperatures',this.temperatureData[i])
        }
        chart.data.labels = this.dateLabels;
        chart.update();
      }
    
    addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
    
    removeData(chart) {
        chart.data.labels.pop();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        chart.update();
    }
}

export default Weather;