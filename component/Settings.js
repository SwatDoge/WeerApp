import React, {useState, useEffect} from "react";
import RadioForm from 'react-native-simple-radio-button';
import { View, Text, StyleSheet, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { get_correction, get_fetch } from "../api/methods"

var location_setting = [
    {label: 'Laatste locatie',  value: 0 },
    {label: 'Huidige locatie',  value: 1 },
    {label: 'Vaste locatie',    value: 2 }
];

var temprature_setting = [
    {label: 'Globale waarden', value: 0},
    {label: 'Americaanse waarden', value: 1}
];

export default function Settings(props) {
    let dec = JSON.parse(props.settings);
    const [getSuggestions, setSuggestions] = useState([{label: (dec.fetch.set_location), value: 0, hidden: true}]);
    let controller;
    if (props.orientation){
        return (
            <View style={styles.fbody}>
                <View style={styles.ftext}>
                    <Text style={styles.title}>Standaard locatie</Text>
                    <RadioForm
                        buttonColor={"#000"}
                        selectedButtonColor={"#000"}
                        radio_props={location_setting}
                        initial={dec.settings.location_type}
                        onPress={async(value) => {
                            let clone = dec;
                            clone.settings.location_type = value;
                            props.setSettings(JSON.stringify(clone));
                            await props.savesettings(JSON.stringify(clone));
                        }}
                    />
                    <DropDownPicker
                        items={getSuggestions}
                        containerStyle={{flexDirection: "row", marginLeft: 15, marginRight: 15, marginTop: 15}}
                        labelStyle={{color: "#000"}}
                        itemStyle={{justifyContent: "flex-start"}}
                        zIndex= {2}
                        defaultValue = {0}
                        searchable = {true}
                        disabled = {dec.settings.location_type != 2}
                        searchableError={() => <Text>Niets gevonden</Text>}
                        searchablePlaceholder= "Zoek een locatie"
                        controller={instance => controller = instance}
                        onSearch = {async(text) => {
                            let list = [];
                            let obj = {};
                            if (text.length > 1){
                                obj = await get_fetch(get_correction(text));
                                for (const locations of obj) list.push({label: locations.name, value: locations.url});
                                controller.close();
                                controller.open();
                            }
                            list.shift([{label: "epeh-lagos-nigeria", value: 0, hidden: true}]);
                            setSuggestions(list);
                        }}
                        
                        onChangeItem={async (item) => {
                            let clone = dec;
                            clone.fetch.set_location = item.value;

                            props.setSettings(JSON.stringify(clone));
                            await props.savesettings(JSON.stringify(clone));
                        }}
                    />
                </View>
                <View style={styles.ftext}>
                    <Text style={styles.title}>Waarden type</Text>
                    <RadioForm
                        buttonColor={"#000"}
                        selectedButtonColor={"#000"}
                        radio_props={temprature_setting}
                        initial={dec.settings.isFarenheit}
                        onPress={async(value) => {
                            let clone = dec;
                            clone.settings.isFarenheit = value;
                            props.setSettings(JSON.stringify(clone));
                            await props.savesettings(JSON.stringify(clone));
                        }}
                    />
                </View>
            </View>
        );
    }
    return (
        <View style={styles.body}>
            <Text style={styles.title}>Standaard locatie</Text>
            <RadioForm
                buttonColor={"#000"}
                selectedButtonColor={"#000"}
                radio_props={location_setting}
                initial={dec.settings.location_type}
                onPress={async (value) => {
                    let clone = dec;
                    clone.settings.location_type = value;
                    props.setSettings(JSON.stringify(clone));
                    await props.savesettings(JSON.stringify(clone));
                }}
            />
            <DropDownPicker
                items={getSuggestions}
                containerStyle={{flexDirection: "row", marginLeft: 15, marginRight: 15, marginTop: 15}}
                labelStyle={{color: "#000"}}
                itemStyle={{justifyContent: "flex-start"}}
                zIndex= {2}
                defaultValue = {0}
                searchable = {true}
                disabled = {dec.settings.location_type != 2}
                searchableError={() => <Text>Niets gevonden</Text>}
                searchablePlaceholder= "Zoek een locatie"
                controller={instance => controller = instance}
                onSearch = {async(text) => {
                    let list = [];
                    let obj = {};
                    if (text.length > 1){
                        obj = await get_fetch(get_correction(text));
                        for (const locations of obj) list.push({label: locations.name, value: locations.url});
                        controller.close();
                        controller.open();
                    }
                    list.shift([{label: "epeh-lagos-nigeria", value: 0, hidden: true}]);
                    setSuggestions(list);
                }}
                
                onChangeItem={async (item) => {
                    let clone = dec;
                    clone.fetch.set_location = item.value;

                    props.setSettings(JSON.stringify(clone));
                    await props.savesettings(JSON.stringify(clone));
                }}
            />

            <Text style={styles.title}>Graden type</Text>
            <RadioForm
                buttonColor={"#000"}
                selectedButtonColor={"#000"}
                radio_props={temprature_setting}
                initial={dec.settings.isFarenheit}
                onPress={async (value) => {
                    let clone = dec;
                    clone.settings.isFarenheit = value;
                    props.setSettings(JSON.stringify(clone));
                    await props.savesettings(JSON.stringify(clone));
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    ftext:{
        flex: 1,
    },
    fbody:{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        padding: 10
    },
    body: {
        width: "100%",
        height: "100%",
        padding: 10,
    },
    title:{
        fontSize: 25
    },
});