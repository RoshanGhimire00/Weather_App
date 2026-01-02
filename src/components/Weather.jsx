import React, { use, useEffect } from 'react';
import { toast } from 'react-hot-toast';


import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'



const Weather = () => {

  const inputRef = React.useRef();

  const [suggestions, setSuggestions] = React.useState([]);
  const [weatherData, setWeatherData] = React.useState(false);

  const allIcons = {
    "Old": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon
  }


  const search = async (city) => {
    if (city === "") {
      toast.error("Please enter a city name", { duration: 1000 });
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const res = await fetch(url);
      const data = await res.json();
      // console.log(data);

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        feelsLike: Math.floor(data.main.feels_like),
        icon: icon
      })

    }
    catch (error) {
      console.log("Error fetching the data")
    }
  }

  useEffect(() => {
    search("Kathmandu");
  }, []);



  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_APP_ID}`
      );
      const data = await res.json();


      const uniqueCities = [];
      const citySet = new Set();

      data.forEach((city) => {
        const key = `${city.name},${city.country}`;
        if (!citySet.has(key)) {
          citySet.add(key);
          uniqueCities.push(city);
        }
      });

      setSuggestions(uniqueCities);
    } catch (error) {
      console.log("Error fetching suggestions:", error);
    }
  };


  return (
    <div className="weather">
     
      <div className="search-bar" style={{ position: "relative" }}>
        <form onSubmit={(e) => {
          e.preventDefault();
          search(inputRef.current.value.trim());
          setSuggestions([]);
        }}>
          <input
            ref={inputRef}
            placeholder="Search city"
            onChange={(e) => fetchSuggestions(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search(inputRef.current.value);
                setSuggestions([]);
              }
            }}
          />
          <img
            src={search_icon}
            alt="Search"
            onClick={() => {
              search(inputRef.current.value);
              setSuggestions([]);
            }}
          />
        </form>

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((city, idx) => (
              <li
                key={idx}
                onClick={() => {
                  search(city.name);
                  inputRef.current.value = city.name;
                  setSuggestions([]);
                }}
              >
                {city.name}{city.state ? `, ${city.state}` : ""}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>


      <img src={weatherData?.icon} alt="Weather Icon" className="weather-icon" />
      <p className="temperature">{weatherData?.temperature}°C</p>
      <p className="location">{weatherData?.location}</p>

      <p className="feelsLike">Feels like {weatherData?.feelsLike}°C</p>

      <div className="weather-data">
        <div className="col">
          <img src={humidity_icon} alt="" />
          <div>
            <p>{weatherData?.humidity}%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col">
          <img src={wind_icon} alt="" />
          <div>
            <p>{weatherData?.windSpeed} Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather