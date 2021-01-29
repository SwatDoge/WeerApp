import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default class About extends React.Component { 
    render() { 
        return (
            <View style={styles.body}>
                <View style={styles.header}>
                    <View style={styles.icon}>
                        <Image source={require("../assets/icon.png")} style={styles.image}/>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>WeerApp</Text>
                        <Text style={styles.name}>Door: Tijdelijk</Text>
                    </View>
                </View>
                <View style={styles.line}>
                </View>
                <ScrollView style={styles.scrollarea}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Augue ut lectus arcu bibendum at varius vel pharetra. Et magnis dis parturient montes nascetur ridiculus mus mauris. Tristique senectus et netus et malesuada fames ac turpis. Gravida neque convallis a cras semper. Semper auctor neque vitae tempus quam pellentesque nec nam. Nisl vel pretium lectus quam id leo. Nunc id cursus metus aliquam eleifend. Morbi tristique senectus et netus. In hac habitasse platea dictumst quisque. Eget velit aliquet sagittis id consectetur purus ut faucibus pulvinar. Ullamcorper malesuada proin libero nunc consequat interdum varius sit. Ultrices mi tempus imperdiet nulla malesuada. Risus ultricies tristique nulla aliquet enim tortor at auctor urna. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Suspendisse in est ante in nibh mauris cursus mattis molestie. Malesuada fames ac turpis egestas integer eget aliquet nibh. Bibendum arcu vitae elementum curabitur. Nulla porttitor massa id neque aliquam vestibulum morbi. Donec et odio pellentesque diam.{"\n\n"}</Text>
                    <Text>Malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Aliquam purus sit amet luctus venenatis lectus. In mollis nunc sed id semper risus in hendrerit gravida. Sit amet commodo nulla facilisi nullam vehicula. Enim nec dui nunc mattis enim ut tellus elementum. Id neque aliquam vestibulum morbi blandit cursus risus at ultrices. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Maecenas volutpat blandit aliquam etiam erat velit scelerisque in. Eu consequat ac felis donec. Aliquet risus feugiat in ante metus. Gravida rutrum quisque non tellus orci ac auctor augue. Pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies. Leo duis ut diam quam nulla porttitor. Tristique sollicitudin nibh sit amet commodo. Morbi leo urna molestie at. Eget mi proin sed libero enim sed. Arcu non sodales neque sodales ut. Laoreet sit amet cursus sit amet. Consectetur libero id faucibus nisl tincidunt eget nullam non. Morbi leo urna molestie at elementum eu facilisis sed.</Text>
                </ScrollView>
                <View style={styles.line}>
                </View>
                <Text style={styles.copyright}>Severe amount of copyright</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    body: {
        width: "100%",
        height: "100%"
    },
    header: {
        height: 100,
        flexDirection: "row"
    },
    icon: {
        height: 100,
        width: 100
    },
    image: {
        width: 75,
        height: 75,
        left: 12,
        top: 12
    },
    textContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "column"
    },
    title: {
        color: "black",
        textAlign: "center",
        justifyContent: "flex-end",
        fontSize: 35,
        flex: 2
    },
    name: {
        textAlign: "center",
        justifyContent: "center",
        flex: 1
    },
    scrollarea: {
        margin: 20
    },
    line: {
        borderColor: "black",
        width: "100%",
        height: 1.5,
        backgroundColor: "darkgray"
    },
    copyright: {
        textAlign: "center",
        padding: 5
    }
});