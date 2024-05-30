"use client";

import { useEffect, useState } from "react";
import {
  getForecastWeather,
  filterDataFromWeatherAPI,
  location,
  APIKey,
} from "./utils/weatherService";

type WeatherData = {
  city: string;
  temperature: {
    F: string;
    C: string;
  };
  conditions: string;
} | null;

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getForecastWeather(location, APIKey)
      .then(filterDataFromWeatherAPI)
      .then(setWeatherData)
      .catch(setError);
  }, []);

  const getFormattedDate = (): string => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Weather in {weatherData.city}</h1>
      <p>
        Temperature: {weatherData.temperature.F}°F / {weatherData.temperature.C}
        °C
      </p>
      <p>Conditions: {weatherData.conditions}</p>
      <p>Date: {getFormattedDate()}</p>
    </div>
  );
};

export default Home;
