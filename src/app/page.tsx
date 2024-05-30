"use client";

import { useEffect, useState } from "react";
import {
  getForecastWeather,
  getWeeklyWeather,
  location,
  APIKey,
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

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (error) {
    return (
      <div className="text-red-600 font-bold text-center">Error: {error}</div>
    );
  }

  if (!todayWeather || !weeklyWeather) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Weather in {todayWeather.city}
        </h1>
        <p className="text-lg text-gray-500">
          Updated on {formatDate(Date.now() / 1000)}
        </p>
      </div>

      <div className="bg-blue-100 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Today&apos;s Weather</h2>
        <p className="text-lg">
          Temperature: {todayWeather.temperature.F}°F /{" "}
          {todayWeather.temperature.C}°C
        </p>
        <p className="text-lg">Conditions: {todayWeather.conditions}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          7-Day Forecast
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {weeklyWeather.daily.map((day) => (
            <li
              key={day.dt}
              className="bg-slate-400	 p-4 rounded-lg shadow-lg text-center"
            >
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
                className="mx-auto mb-2 bg-gray "
              />
              <p className="text-lg font-semibold">{formatDate(day.dt)}</p>
              <p className="text-lg">Temp: {day.temp.day}°F</p>
              <p className="text-lg">
                {capitalizeFirstLetter(day.weather[0].description)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
