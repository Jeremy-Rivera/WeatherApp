export type Location = {
  latitude: number;
  longitude: number;
};

export type WeatherResponse = {
  name?: string;
  main?: {
    temp: number;
  };
  weather: {
    main: string;
  }[];
};

export type WeeklyWeatherResponse = {
  daily: Array<{
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
};

export const location: Location = {
  latitude: 27.964157,
  longitude: -82.452606,
};
//location for Tampa FL

export const APIKey = "d2fb9c478e73e2c885b0d6aaa2b2c422";
//I Have faith you all wont steal my API Key, this would obviously be in an ENV file if it was a PROD app

export const getForecastWeather = (
  location: Location,
  APIKey: string
): Promise<WeatherResponse> => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${APIKey}&units=imperial`
  ).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Error: ${res.status}`);
    }
  });
};

export const getWeeklyWeather = (
  location: Location,
  APIKey: string
): Promise<WeeklyWeatherResponse> => {
  return fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${location.latitude}&lon=${location.longitude}&exclude=current,minutely,hourly,alerts&appid=${APIKey}&units=imperial`
  ).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Error: ${res.status}`);
    }
  });
};
