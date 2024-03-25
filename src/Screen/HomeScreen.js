import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import logo from '../../assets/logo.png';
import { SafeAreaView } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import { formatDistanceToNow } from 'date-fns';

// Define the HomeScreen component
const HomeScreen = ({ navigation, route }) => {
    const user = useSelector((state) => state.user);

    const [isLoading, setIsLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChats, setFilteredChats] = useState([]);
    const [groupImage, setGroupImage] = useState(null); // State to hold the selected group image

    // Fetch chats from Firestore on component mount
    useLayoutEffect(() => {
        const chatQuery = query(collection(firestoreDB, "chats"), orderBy("_id", "desc"));
        const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
            const chatRooms = snapshot.docs.map(doc => doc.data());
            setChats(chatRooms);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Filter chats based on search query
    useLayoutEffect(() => {
        if (searchQuery.trim() === '') {
            // No search query, display all chats
            setFilteredChats(chats);
        } else {
            // Filter chats based on search query
            const filtered = chats.filter(room => room.ChatName.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredChats(filtered);
        }
    }, [searchQuery, chats]);

    // Handle search input change
    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    // Function to open image picker
    const selectImageFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setGroupImage(result.uri); // Set the selected group image
        }
    };

    // Render the component
   // Render the component
return (
    <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'green', height: '15%', width: '100%' }}>
            <Image
                source={logo}
                style={{ height: 50, width: 70, top: 20 }}
                resizeMode="contain"
                accessibilityLabel="Logo"
            />
            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 50 }} onPress={() => navigation.navigate("ProfileScreen")}>
                <Image
                    source={{ uri: user.profilePic }}
                    resizeMode="cover"
                    style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#77AB59' }}
                />
            </TouchableOpacity>
        </View>
        {/* Search bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 20 }}>
            <TextInput
                style={{ flex: 1, height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 }}
                placeholder="Search Chats"
                value={searchQuery}
                onChangeText={handleSearch}
            />
        </View>
        {/* Chat list */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View>
                {/* Title */}
                <View style={{ marginTop: 20, marginLeft: 20 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>Messages</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 20, top: 0 }} onPress={() => navigation.navigate("AddToChatScreen")}>
                        <Ionicons name="chatbox" size={28} color="#555" />
                    </TouchableOpacity>
                </View>
                {/* Loading indicator */}
                {isLoading ? (
                    <View style={{ alignSelf: 'center', marginTop: 20 }}>
                        <ActivityIndicator size="large" color="#43C651" />
                    </View>
                ) : (
                    <>
                        {/* Chat list */}
                        {filteredChats && filteredChats.length > 0 ? (
                            filteredChats
                                .slice() // Create a copy to avoid mutating the original array
                                .sort((a, b) => {
                                    const lastMessageTimeA = a.lastMessageTime || 0;
                                    const lastMessageTimeB = b.lastMessageTime || 0;
                                    return lastMessageTimeB - lastMessageTimeA;
                                })
                                .map(room => (
                                    <MessageCard key={room._id} room={room} groupImage={groupImage} reverseSort={true} />

                                ))
                        ) : (
                            <Text style={{ alignSelf: 'center', marginTop: 20 }}>No chats found</Text>
                        )}
                    </>
                )}
            </View>
        </ScrollView>
    </SafeAreaView>
);

};
// Define the MessageCard component
const MessageCard = ({ room, groupImage, reverseSort }) => {
    const navigation = useNavigation();
    const [lastMessageTime, setLastMessageTime] = useState(null); // State to hold the last message time
    const [lastMessageText, setLastMessageText] = useState(null); // State to hold the last message text
    const sortOrder = reverseSort ? 1 : -1;

    useEffect(() => {
        let unsubscribe;
        const fetchLastMessageTime = async () => {
            unsubscribe = onSnapshot(collection(firestoreDB, `chats/${room._id}/messages`), {
                orderBy: 'timeStamp',
                limit: 1
            }, (snapshot) => {
                let latestMessageTimestamp = null;
                let latestMessageText = null;
                snapshot.forEach(doc => {
                    const lastMessageData = doc.data();
                    if (lastMessageData.timeStamp) {
                        const lastMessageTimestamp = lastMessageData.timeStamp.toDate();
                        if (!latestMessageTimestamp || lastMessageTimestamp > latestMessageTimestamp) {
                            latestMessageTimestamp = lastMessageTimestamp;
                            latestMessageText = lastMessageData.message;
                        }
                    }
                });
                setLastMessageTime(latestMessageTimestamp);
                setLastMessageText(latestMessageText);
            });
        };

        // Fetch initial last message time
        fetchLastMessageTime();

        // Setup timer for continuous updates
        const interval = setInterval(fetchLastMessageTime, 10000); // Update every 10 seconds (adjust as needed)

        // Cleanup function
        return () => {
            clearInterval(interval);
            unsubscribe(); // Corrected typo: unsubscribe should be called as a function
        };
    }, [room._id]);

    // Render the component
    return (
        <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", { room: room })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
            {/* Display the selected picture if available, otherwise display the default icon */}
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
                {groupImage ? (
                    <Image source={{ uri: groupImage }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                ) : (
                    <FontAwesome name="instagram" size={24} color="#555" />
                )}
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{room.ChatName}</Text>
                {/* Display the last message */}
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginRight: 20 }}>{lastMessageText ? lastMessageText : 'No message'}</Text>
            </View>
            {/* Display the last message time */}
            <Text style={{ color: 'green', fontWeight: 'bold' }}>{lastMessageTime ? formatDistanceToNow(lastMessageTime) : 'N/A'}</Text>
        </TouchableOpacity>
    );
};
export default HomeScreen