import React from "react";
import { getLocation} from "../Script/weatherLoad.js";

const Weather = () => {
    return(
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
            <button onClick={() => getLocation()} id="weatherButton">
                Try It
            </button>
            <p id="demo"></p>
            <div>
                <canvas id="myChart"></canvas>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"/>
        </main>
    )
}
export default Weather;