import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View, TextInput, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import logo from '../../assets/logo.png';
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase";
import * as ImagePicker from 'expo-image-picker';
import { formatDistanceToNow } from 'date-fns';

const HomeScreen = () => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user);

    const [isLoading, setIsLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChats, setFilteredChats] = useState([]);
    const [groupImage, setGroupImage] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(firestoreDB, "chats"), orderBy("_id", "desc")), (snapshot) => {
            const chatRooms = snapshot.docs.map(doc => doc.data());
            setChats(chatRooms);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredChats(chats);
        } else {
            const filtered = chats.filter(room => room.ChatName.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredChats(filtered);
        }
    }, [searchQuery, chats]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const selectImageFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setGroupImage(result.uri);
        }
    };

    const deleteGroup = async (roomId) => {
        try {
            await deleteDoc(doc(firestoreDB, 'chats', roomId));
            console.log('Group deleted successfully');
        } catch (error) {
            console.error('Error deleting group: ', error);
        }
    };

    const editGroupName = async (roomId, newName) => {
        try {
            await updateDoc(doc(firestoreDB, 'chats', roomId), {
                ChatName: newName
            });
            console.log('Group name updated successfully');
        } catch (error) {
            console.error('Error updating group name: ', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#36802d', height: 100, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold', flex: 1 }}>ConnectHub</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")} style={{ marginLeft: 20 }}>
                    <Image
                        source={{ uri: user.profilePic }}
                        resizeMode="cover"
                        style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#77AB59' }}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 20 }}>
                <TextInput
                    style={{ flex: 1, height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, backgroundColor: '#f2f2f2' }}
                    placeholder="Search Chats"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>Messages</Text>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#43C651" />
                    ) : (
                        <>
                            {filteredChats && filteredChats.length > 0 ? (
                                filteredChats.map(room => (
                                    <MessageCard key={room._id} room={room} groupImage={groupImage} onDelete={() => deleteGroup(room._id)} onEdit={(newName) => editGroupName(room._id, newName)} />
                                ))
                            ) : (
                                <Text>No chats found</Text>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
            <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#43C651', borderRadius: 50, padding: 10 }} onPress={() => navigation.navigate("AddToChatScreen")}>
                <Ionicons name="chatbox" size={28} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const MessageCard = ({ room, groupImage, onDelete, onEdit }) => {
    const navigation = useNavigation();
    const [lastMessageTime, setLastMessageTime] = useState(null);
    const [lastMessageText, setLastMessageText] = useState(null);
    const [editedGroupName, setEditedGroupName] = useState(room.ChatName);
    const [isEditing, setIsEditing] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);

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

        fetchLastMessageTime();

        const interval = setInterval(fetchLastMessageTime, 10000);

        return () => {
            clearInterval(interval);
            unsubscribe();
        };
    }, [room._id]);

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const handleChangeGroupName = (text) => {
        setEditedGroupName(text);
    };

    const handleUpdateGroupName = () => {
        onEdit(editedGroupName);
        toggleEditMode();
    };

    const toggleOptionsVisibility = () => {
        setIsOptionsVisible(!isOptionsVisible);
    };

    return (
        <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", { room: room })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 10 }}>
            <TouchableOpacity onPress={toggleOptionsVisibility}>
                <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 2,
                    borderColor: '#43C651',
                }}>
                    {groupImage ? (
                        <Image source={{ uri: groupImage }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                    ) : (
                        <FontAwesome name={room.groupLogo || "instagram"} size={24} color="#555" />
                    )}
                </View>
            </TouchableOpacity>
            <View style={{ marginLeft: 10, flex: 1 }}>
                {isEditing ? (
                    <TextInput
                        style={{ fontWeight: 'bold', marginBottom: 5 }}
                        value={editedGroupName}
                        onChangeText={handleChangeGroupName}
                    />
                ) : (
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{room.ChatName}</Text>
                )}
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginRight: 20, color: '#777' }}>{lastMessageText ? lastMessageText : 'No message'}</Text>
            </View>
            <Text style={{ color: 'green', fontWeight: 'bold' }}>{lastMessageTime ? formatDistanceToNow(lastMessageTime) : 'N/A'}</Text>
            {isOptionsVisible && (
                <View style={{ flexDirection: 'row' }}>
                    {isEditing ? (
                        <TouchableOpacity onPress={handleUpdateGroupName} style={{ marginLeft: 10 }}>
                            <Ionicons name="checkmark" size={24} color="#43C651" />
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity onPress={toggleEditMode} style={{ marginLeft: 10 }}>
                                <Ionicons name="create-outline" size={24} color="#43C651" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onDelete()} style={{ marginLeft: 10 }}>
                                <Ionicons name="trash-bin-outline" size={24} color="#FF6347" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default HomeScreen;
