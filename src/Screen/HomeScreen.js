import React, { useLayoutEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import logo from '../../assets/logo.png';
import { SafeAreaView } from "react-native";
import { QuerySnapshot, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import ProfileScreen from "./ProfileScreen";

const HomeScreen = (props) => {
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const[chats,setChats]=useState(null)
    console.log("logged user:", user);
    useLayoutEffect(()=>{
        const chatQuery=query(collection(firestoreDB,"chats"),orderBy("_id","desc"))
        const unsubcribe=onSnapshot(chatQuery,(QuerySnapshot)=>{
            const chatRooms=QuerySnapshot.docs.map(doc=>doc.data())
            setChats(chatRooms)
            setIsLoading(false)
        })
    },[])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center',backgroundColor:'green',height:'15%',width:'100%' }}>
                <Image 
                    source={logo} 
                    style={{ height: 50, width: 70,top:20 }} 
                    resizeMode="contain"
                    accessibilityLabel="Logo" 
                />
              <TouchableOpacity style={{ position: 'absolute', right: 20, top: 50 }} onPress={()=>props.navigation.navigate("ProfileScreen")}>
    <Image 
        source={{ uri: user.profilePic }} 
        resizeMode="cover"  
        style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#77AB59' }} 
    />
</TouchableOpacity>

            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Messages</Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 20, top: 0 }} onPress={() => props.navigation.navigate("AddToChatScreen")}>
    <Ionicons name="chatbox" size={28} color="#555" />
</TouchableOpacity>

                    </View>
                    {/* Conditional rendering of loading indicator */}
                    {isLoading ? (
                        <View style={{ alignSelf: 'center', marginTop: 20 }}>
                            <ActivityIndicator size="large" color="#43C651" />
                        </View>
                    ) : (
                        <>
                       {chats && chats?.length > 0 ? (
    <>
        {chats?.map(room => (
            <MessageCard key={room._id} room={room} /> 
        ))}
    </>
) : (
    <></>
)}

                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const MessageCard = ({ room }) => { // Destructure room from props
    const navigation=useNavigation()
    return (
        <TouchableOpacity onPress={()=>navigation.navigate("ChatScreen",{room:room})} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
            {/* image of user */}
            <View style={{
                width: 60,
                height: 60,
                borderRadius: 5,
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                borderWidth: 3,
                borderColor: 'green',
            }}>
                <FontAwesome name="users" size={24} color="#555" />
            </View>
            {/* content */}
            <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{room.ChatName}</Text>
                <Text style={{ marginRight: 20 }}>Lorem is the message that is displaying. Lorem ipsum dolor sit amet, consectetur.....</Text>
            </View>
            {/* time of message */}
            <Text style={{ color: 'green', fontWeight: 'bold' }}>25 min</Text>
        </TouchableOpacity>
    );
};

export default HomeScreen;
