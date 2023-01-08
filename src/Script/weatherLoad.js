import { myChart } from '../Pages/weather';
import Chart from '../Pages/weather';

let x = document.getElementById("demo");
const ctx = document.getElementById('myChart');
let dateLabels;
let temperatureData;

export default function getLocation() {
    if (navigator.geolocation) 
    {
      navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else 
    { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {

    const api_key = '71abb4f156534c03a9237ae7eee73100';
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeatherData(latitude, longitude);

    let api_url = 'https://api.opencagedata.com/geocode/v1/json'

    let request_url = api_url
        + '?'
        + 'key=' + api_key
        + '&q=' + encodeURIComponent(latitude + ',' + longitude)
        + '&pretty=1'
        + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  console.log(request_url);
  let request = new XMLHttpRequest();
  request.open('GET', request_url, true);


  request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes

    if (request.status === 200){
      // Success!
      let data = JSON.parse(request.responseText);
      x.innerHTML = data.results[0].formatted; // print the location

    } else if (request.status <= 500){
      // We reached our target server, but it returned an error

      console.log("unable to geocode! Response code: " + request.status);
      let data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }  
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");
  };

  request.send();  // make the request
}
const searchUrlBase = 'https://api.open-meteo.com/v1/forecast?latitude=';

function getWeatherData(latitude, longitude){
    let searchUrl = searchUrlBase
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
        let data = JSON.parse(request2.responseText);
        let jsonObject = JSON.parse(request2.responseText);
        dateLabels = jsonObject.hourly.time;
        temperatureData = jsonObject.hourly.temperature_2m;
        updateChart(myChart);
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

 myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dateLabels,
      datasets: [{
        label: 'Temperatures in ºC',
        data: temperatureData,
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
  function updateChart(chart) {
    removeData(chart);
    for(let i = 0; i<temperatureData.length; i++){
        addData(chart,'Temperatures',temperatureData[i])
    }
    chart.data.labels = dateLabels;
    chart.update();
  }
  function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
