import axios from 'axios';

export interface WeatherData {
    location: {
        name: string;
        country: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
        };
        humidity: number;
    };
}

const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
    const apiKey = process.env.WEATHER_API_KEY;

    const { data } = await axios.get<WeatherData>(BASE_URL, {
        params: {
            key: apiKey,
            q: city,
            lang: 'en' 
        }
    });

    return data;
}