type Location = {
  latitude: number;
  longitude: number;
};

type WeatherResponse = {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    main: string;
  }[];
};

type WeatherData = {
  city: string;
  temperature: {
    F: string;
    C: string;
  };
  conditions: string;
} | null;

const location: Location = { latitude: 27.964157, longitude: -82.452606 }; //for Tampa Florida, my current residence

const APIKey = "d2fb9c478e73e2c885b0d6aaa2b2c422"; //would typically hide this in an ENV file but its a free API Key and I trust you guys

const getForecastWeather = (
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

const filterDataFromWeatherAPI = (res: WeatherResponse): WeatherData => {
  if (!res) {
    return null;
  }
  const weather: WeatherData = {
    city: res.name,
    temperature: {
      F: `${Math.round(res.main.temp)}`,
      C: `${Math.round(((res.main.temp - 32) * 5) / 9)}`,
    },
    conditions: res.weather[0].main,
  };
  return weather;
};

export { getForecastWeather, filterDataFromWeatherAPI, location, APIKey };
