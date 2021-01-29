var key = require("../config.json").apikey;
import * as Location from 'expo-location';
Location.setGoogleApiKey(require("../config.json").google_apikey)

export function get_correction(string){
    return "http://api.weatherapi.com/v1/search.json?key=" + key + "&q=" + string;
}

export function get_forecast(location, days){
    return "http://api.weatherapi.com/v1/forecast.json?key=" + key + "&q=" + location + "&days=" + days;
}

export function get_location_from_coords(long, lat){
    
}

export function get_fetch(url){
    return fetch(url)
    .then((response) => response.json())
    .then((json) => {return json;})
    .catch((error) => {
      console.error(error);
    });
}