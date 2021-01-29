//imports
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Dimensions, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
process.nextTick = setImmediate

//views
import Home from "./component/Home";
import Settings from "./component/Settings";
import About from "./component/About";

//consts
const Tab = createBottomTabNavigator();
const gainLandscape = () => {return Dimensions.get("screen").width >  Dimensions.get("screen").height}

export default function App() {
    const [getSettings, setSettings] = useState(null);
    const [isLandscape, setIsLandscape] = useState(false);

    const save_settings = async(obj) => {
        await AsyncStorage.setItem("settings", obj);
    }

    let getLocationAsync = async (obj) => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        let location_ = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Low});
        let clone = JSON.parse(obj);

        clone.fetch.current_location = {
            long: location_.coords.longitude,
            lat: location_.coords.latitude,
            permission: (status == "granted")
        }
        setSettings(JSON.stringify(clone));
        return
    };

    const default_settings = async() => {
        let result;
        //await AsyncStorage.setItem("settings", null);
        try {result = await AsyncStorage.getItem("settings")}
        catch (e){
            result = JSON.stringify(require("./json/default.json"))
            await AsyncStorage.setItem("settings", result);
        }
        if (result == null){
            result = JSON.stringify(require("./json/default.json"));
            await AsyncStorage.setItem("settings", result);
        }
        result = JSON.parse(result);
        result.fetch.data = require("./json/fetch.json");
        result = JSON.stringify(result);

        setSettings(result);
        return result;
    }

    useEffect(() => {
        async function x(){
            let t = await default_settings();
            await getLocationAsync(t);
        }
        x();
    }, [])
    
    Dimensions.addEventListener("change", () => {setIsLandscape(gainLandscape());});
    
    if (getSettings != null){
        return (
            <NavigationContainer>
                <StatusBar translucent={false}/>
                <Tab.Navigator 
                    initialRouteName="Weer"
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({focused, color, size}) => {
                            let icon;
                            switch (route.name) {
                                case "Weer": icon = (focused ? "partly-sunny" : "partly-sunny-outline")
                                break;
                                case "Instellingen": icon = (focused ? "ios-settings" : "ios-settings-outline") 
                                break;
                                case "Info": icon = (focused ? "ios-information-circle" : "ios-information-circle-outline")
                                break;
                            }
                            return <Icon name={icon} size={size} color={color} type="ionicon"/>;
                        }
                    })}
                    tabBarOptions={{
                        activeTintColor: "black",
                        inactiveTintColor: "black",
                    }}
                >
                    <Tab.Screen name="Weer"         options={{headerShown: false}} initialParams={{orientation: gainLandscape(), settings: getSettings}} children={()=><Home orientation={isLandscape} settings={getSettings} setSettings={setSettings} savesettings={save_settings}></Home>}/>
                    <Tab.Screen name="Instellingen" options={{headerShown: false}} initialParams={{orientation: gainLandscape(), settings: getSettings}} children={()=><Settings orientation={isLandscape} settings={getSettings} setSettings={setSettings} savesettings={save_settings}></Settings>}/>
                    <Tab.Screen name="Info"         component={About} options={{headerShown: false}}/>
                </Tab.Navigator>
            </NavigationContainer>
        );
    } else {
        return (
            <View style={{justifyContent: "center", flex: 1, alignItems: "center"}}>
                <Text>Laden..</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
});
