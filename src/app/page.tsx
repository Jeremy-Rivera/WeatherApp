"use client";

import { useEffect, useState } from "react";
import {
  getForecastWeather,
  getWeeklyWeather,
  location,
  APIKey,
  WeatherResponse,
  WeeklyWeatherResponse,
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
  const [todayWeather, setTodayWeather] = useState<WeatherData>(null);
  const [weeklyWeather, setWeeklyWeather] =
    useState<WeeklyWeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getForecastWeather(location, APIKey)
      .then((res) => {
        const weather: WeatherData = {
          city: res.name || "Unknown",
          temperature: {
            F: `${Math.round(res.main?.temp || 0)}`,
            C: `${Math.round((((res.main?.temp || 0) - 32) * 5) / 9)}`,
          },
          conditions: res.weather[0].main,
        };
        setTodayWeather(weather);
      })
      .catch(setError);
  }, []);

  useEffect(() => {
    getWeeklyWeather(location, APIKey).then(setWeeklyWeather).catch(setError);
  }, []);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!todayWeather || !weeklyWeather) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>Weather in {todayWeather.city}</h1>
      </div>
      <div>
        <h2>7-Day Forecast</h2>
        <ul style={{ display: "flex", listStyle: "none" }}>
          {weeklyWeather.daily.map((day) => (
            <li key={day.dt}>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
              />

              <p>Date: {formatDate(day.dt)}</p>
              <p>Temperature: {day.temp.day}°F</p>
              <p>Conditions: {day.weather[0].description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Weather Today</h2>
        <p>
          Temperature: {todayWeather.temperature.F}°F /{" "}
          {todayWeather.temperature.C}°C
        </p>
        <p>Conditions: {todayWeather.conditions}</p>

        <p>Date: {formatDate(Date.now() / 1000)}</p>
      </div>
    </>
  );
};

export default Home;
