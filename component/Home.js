import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-elements";
import { get_correction, get_fetch, get_forecast } from "../api/methods"

export default function Home(props) {
    let dec = JSON.parse(props.settings);
    let na;
    switch (dec.settings.location_type) {
        case 0: na = dec.fetch.last_location; break;
        case 1: na = "Huidige locatie"; break;
        case 2: na = dec.fetch.set_location; break;
    }

    var def = {
        hidden: true, 
        label: na, 
        value: 0, 
        icon: (dec.settings.location_type != 1 ? () => <Icon name="navigation" size={18} color="#000" /> : () => <Icon name="pin" size={18} color="#000" type="ionicon" />)
    }

    const [getSuggestions, setSuggestions] = useState([def]);
    const [getDate, setDate] = useState(new Date().toLocaleString());
    const [getForecast, setForecast] = useState(null);
    const [getSelected, setSelected] = useState(false)
    let controller;

    async function update_settings_object(clone, day, hour, cast){
        let new_data = cast;
        clone.fetch.data.temp           = clone.settings.isFarenheit == 1 ? new_data.forecast.forecastday[day].hour[hour].temp_f + "°F" : new_data.forecast.forecastday[day].hour[hour].temp_c + "°C";
        clone.fetch.data.mintemp        = clone.settings.isFarenheit == 1 ? new_data.forecast.forecastday[day].day.mintemp_f + "°F": new_data.forecast.forecastday[day].day.mintemp_c + "°C";
        clone.fetch.data.maxtemp        = clone.settings.isFarenheit == 1 ? new_data.forecast.forecastday[day].day.maxtemp_f + "°F": new_data.forecast.forecastday[day].day.maxtemp_c + "°C";
        clone.fetch.data.wind_speed     = clone.settings.isFarenheit == 1 ? new_data.forecast.forecastday[day].hour[hour].wind_mph + " mph" : new_data.forecast.forecastday[day].hour[hour].wind_kph + " km/h";

        clone.fetch.data.weatherstatus  = weather_icon(new_data.forecast.forecastday[day].hour[hour].condition.text);
        clone.fetch.data.dir            = ["Noord", "Noord/Oost", "Oost", "Zuid/Oost", "Zuid", "Zuid/West", "West", "Noord West"][Math.round((8/360) * new_data.forecast.forecastday[day].hour[hour].wind_degree)];
        clone.fetch.data.air_pressure   = clone.settings.isFarenheit == 1 ? new_data.current.pressure_mb + " inch" : new_data.current.pressure_in + " mb";
        clone.fetch.data.dropdown       = clone.settings.isFarenheit == 1 ? new_data.forecast.forecastday[day].day.totalprecip_in + " inch" : new_data.forecast.forecastday[day].day.totalprecip_mm + " mm";
        clone.fetch.data.sunrise        = new_data.forecast.forecastday[day].astro.sunrise;
        clone.fetch.data.sunset         = new_data.forecast.forecastday[day].astro.sunset;
        clone.fetch.data.feels_like     = clone.settings.isFarenheit == 1 ? new_data.forecast.forecastday[day].hour[hour].feelslike_f + "°F" : new_data.forecast.forecastday[day].hour[hour].feelslike_c + "°C";
    
        return clone;
    }

    function weather_icon(string){
        let types = [{name:"sun", icon:"sunny"}, {name:"cloud", icon:"cloud"}, {name:"overcast", icon:"cloudy"}, {name:"mist", icon:"cloudy-night"}, {name:"rain", icon:"rainy"}, {name:"snow", icon:"snow"}, {name:"sleet", icon:"snow"}, {name:"freez", icon:"snow"}, {name:"thund", icon:"flash"}, {name:"blizzard", icon:"snow"}, {name:"ice", icon:"snow"}]
        for (const type of types) if (string.includes(type.name)) return type.icon;
        return "sunny"
    }

    function forecast_to_items(forecast){
        if (forecast == null) return [{label: "Vandaag", value: 0, hidden: true, icon: () => <Icon name="time" size={18} color="#000" type="ionicon" />}]
        else {
            let list = [];
            let i = 0;
            for (const day of forecast.forecast.forecastday) {
                list.push({label: (i > 0 ? ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"][new Date(day.date_epoch * 1000).getDay()] : "Vandaag"), value: i});
                i++;
            }
            return list;
        }
    }

    useEffect(() => {
        let a;
        switch (dec.settings.location_type) {
            case 0: 
            a = async() => {
                setSelected(true);
                let forecast = await get_fetch(get_forecast(dec.location.selected, 7));
                setForecast(forecast);
                props.setSettings(JSON.stringify(await update_settings_object(dec, 0, new Date().getHours(), forecast)));
            }
            a();
            break;

            case 1:
                a = async() => {
                    setSelected(true);
                    let forecast = await get_fetch(get_forecast(dec.fetch.current_location.lat + "," + dec.fetch.current_location.long, 7));
                    setForecast(forecast);
                    props.setSettings(JSON.stringify(await update_settings_object(dec, 0, new Date().getHours(), forecast)));
                }
                a();
            break;
            
            case 2:
                a = async() => {
                    setSelected(true);
                    let forecast = await get_fetch(get_forecast(dec.fetch.set_location, 7));
                    setForecast(forecast);
                    props.setSettings(JSON.stringify(await update_settings_object(dec, 0, new Date().getHours(), forecast)));
                }
                a();
            break;
        }
    }, [])

    
    if (arguments[0].orientation) return(<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}></View>);

    return (
        <View style={{flex: 1,}}>
            <View style={{zIndex: 2}}>

                <DropDownPicker
                    items={getSuggestions}
                    containerStyle={{flexDirection: "row", marginLeft: 15, marginRight: 15, marginTop: 15}}
                    labelStyle={{color: "#000"}}
                    itemStyle={{justifyContent: "flex-start"}}
                    zIndex= {2}
                    defaultValue = {0}
                    searchable = {true}
                    controller={instance => controller = instance}
                    searchableError={() => <Text>Niets gevonden</Text>}
                    searchablePlaceholder= "Zoek een locatie"
                    onSearch = {async(text) => {
                        let list = [];
                        let obj = {};
                        if (text.length > 1){
                            obj = await get_fetch(get_correction(text));

                            setDate(new Date().toLocaleString())

                            for (const locations of obj) list.push({label: locations.name, value: locations.url, icon: ()=> <Icon name="flag" size={18} color="#000"/>});
                            controller.close();
                            controller.open();
                        }
                        list.shift(def);
                        setSuggestions(list);
                    }}
                    
                    onChangeItem={async (item) => {
                        let clone = dec;
                        setSelected(true);
                        clone.location.selected = item.value;
                        clone.fetch.last_location = item.value;

                        let forecast = await get_fetch(get_forecast(item.value, 7));
                        setForecast(forecast);
                        clone = await update_settings_object(clone, 0, new Date().getHours(), forecast);
                        props.setSettings(JSON.stringify(clone));
                        await props.savesettings(JSON.stringify(clone));
                    }}
                />
                <View style={{flexDirection: "row"}}>
                    <View style={{flex: 1, zIndex: 1}}>
                        <DropDownPicker
                            items={forecast_to_items(getForecast)}
                            containerStyle={{flexDirection: "row", marginLeft: 15, marginTop: 15, zIndex: 1}}
                            labelStyle={{color: "#000"}}
                            itemStyle={{justifyContent: "flex-start", zIndex: 1}}
                            zIndex= {1}
                            disabled= {!getSelected}
                            onChangeItem={async item => {
                                let clone = dec;
                                clone = await update_settings_object(clone, item.value, new Date().getHours(), getForecast);
                                props.setSettings(JSON.stringify(clone));
                            }}
                            defaultValue={0}
                        /> 
                    </View>
                    <View style={styles.dateStyle}>
                        <Text>{getDate}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.line}/>
            <View style={styles.portrait_small_info}>
                <View style={{flex: 2}}>
                    <View style={{flex: 2, flexDirection: "column", justifyContent: "center"}}>
                        <Text style={{textAlign: "center", fontSize: 25}}>
                            {dec.fetch.data.temp == null ? "?" : dec.fetch.data.temp}
                        </Text>
                    </View>
                    <View style={{flex: 1, flexDirection: "column"}}>
                        <Text style={{textAlign: "center", fontSize: 12.5}}>
                            {dec.fetch.data.mintemp == null ? "?" : dec.fetch.data.mintemp}/{dec.fetch.data.maxtemp == null ? "?" : dec.fetch.data.maxtemp}
                        </Text>
                    </View>
                </View>
                <View style={{flex: 2, justifyContent: "center",}}>
                    <Icon name={dec.fetch.data.weatherstatus} type="ionicon" size={55}/>
                </View>
                <View style={{flex: 3}}>
                    <Icon name="ios-compass" type="ionicon" size={45}/>
                    <Text style={{alignSelf: "center"}}>{dec.fetch.data.dir == null ? "?" : dec.fetch.data.dir}</Text>
                    <Text style={{alignSelf: "center"}}>{dec.fetch.data.wind_speed == null ? "?" : dec.fetch.data.wind_speed}</Text>
                </View>
            </View>
            <View style={styles.line}/>
            <View style={{flex: 14}}>
                <View style={{flex: 14, margin: 15}}>
                    <View style={{flex: 1}}>

                        <View style={{flexDirection: "row", flex: 1}}>
                            <View style={{justifyContent:"center", paddingLeft: 5, paddingRight: 5}}><Icon name="speedometer" type="ionicon" size={55}/></View>
                            <View style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: "flex-end"}}>
                                    <Text style={{fontWeight: "bold"}}>Luchtdruk</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>{dec.fetch.data.air_pressure == null ? "?" : dec.fetch.data.air_pressure}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{flexDirection: "row",flex: 1}}>
                            <View style={{justifyContent:"center", paddingLeft: 5, paddingRight: 5}}><Icon name="water" type="ionicon" size={55}/></View>
                            <View style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: "flex-end"}}>
                                    <Text style={{fontWeight: "bold"}}>Neerslag</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>{dec.fetch.data.dropdown == null ? "?" :dec.fetch.data.dropdown}</Text>
                                </View>
                            </View>
                        </View>
                        
                        <View style={{flexDirection: "row", flex: 1}}>
                            <View style={{justifyContent:"center", paddingLeft: 5, paddingRight: 5}}><Icon name="sunny" type="ionicon" size={55}/></View>
                            <View style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: "flex-end"}}>
                                    <Text style={{fontWeight: "bold"}}>Zonsopkomst</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>Opkomst - {dec.fetch.data.sunrise == null ? "?" : dec.fetch.data.sunrise}</Text>
                                    <Text>Ondergang - {dec.fetch.data.sunset == null ? "?" :dec.fetch.data.sunset}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{flexDirection: "row", flex: 1}}>
                            <View style={{justifyContent:"center", paddingLeft: 5, paddingRight: 5}}><Icon name="finger-print" type="ionicon" size={55}/></View>
                            <View style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: "flex-end"}}>
                                    <Text style={{fontWeight: "bold"}}>Voelt als</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>{dec.fetch.data.feels_like == null ? "?" :dec.fetch.data.feels_like}</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </View>         
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dateStyle:{
        paddingTop: 15,
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    portrait_small_info: {
        flex: 3,
        flexDirection: "row",
        zIndex: 0,
        padding: 10
    },
    line: {
        marginTop: 10,
        marginBottom: 10,
        borderColor: "black",
        width: "100%",
        height: 2,
        backgroundColor: "darkgray"
    },
});