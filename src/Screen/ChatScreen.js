import React, { useLayoutEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TextInput, Platform, ScrollView, ActivityIndicator, Image } from "react-native";
import { FontAwesome5, Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import EmojiSelector from 'react-native-emoji-selector';
import { doc, setDoc, addDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

import { firestoreDB } from "../config/firebase";
const ChatScreen = ({ route, navigation }) => {
    const user = useSelector((state) => state.user);
    const [inputMessage, setInputMessage] = useState(''); // State for input message
    const [messages, setMessages] = useState([]); // State for messages from Firestore
    const [isLoading, setIsLoading] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { room } = route.params;

    const scrollViewRef = useRef();

    const sendMessage = async () => {
        const timeStamp = serverTimestamp();
        const id = `${Date.now()}`;
        const _doc = {
            _id: id,
            roomId: room._id,
            timeStamp: timeStamp,
            message: inputMessage, // Use inputMessage instead of message
            user: user
        };
        setInputMessage(""); // Clear the input message after sending
        try {
            await addDoc(collection(doc(firestoreDB, "chats", room._id), "messages"), _doc);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Error sending message. Please try again.");
        }
    };
    
    
    useLayoutEffect(()=>{
        const msgQuery=query(
            collection(firestoreDB,"chats",room?._id,"messages"),
            orderBy("timeStamp","asc")
        )
        const unsubcribe=onSnapshot(msgQuery,(querySnap)=>{
            const upMsg=querySnap.docs.map(doc=>doc.data())
            setMessages(upMsg)
            setIsLoading(false)
            // Scroll to the bottom when new messages are loaded
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }
        })
        return unsubcribe
    },[])

    const handleEmojiSelected = (emoji) => {
        setMessages(messages + emoji);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => {
    try {
        navigation.goBack();
    } catch (error) {
        console.error('Error navigating back:', error);
    }
}}>
    <MaterialIcons name="chevron-left" size={32} color={'white'} />
</TouchableOpacity>

            {/* Middle */}
            <View style={styles.middleContainer}>
                <View style={styles.userIcon}>
                    <FontAwesome5 name="users" size={24} color="#fbfbfb" />
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{room.ChatName.length > 13 ? `${room.ChatName.slice(0, 12)}..` : room.ChatName}</Text>
                    <Text style={styles.userStatus}>Online</Text>
                </View>
                <View style={styles.iconRow}>
                    <TouchableOpacity style={styles.iconButton}>
                        <FontAwesome5 name="video" size={18} color="#fbfbfb" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <FontAwesome5 name="phone" size={18} color="#fbfbfb" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Entypo name="dots-three-vertical" size={18} color="#fbfbfb" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.maincomponent}>
                <View>
                <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={160}>
                        <ScrollView
                            style={{ marginTop: 40 }}
                            ref={scrollViewRef}
                            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        >
                            {isLoading ? (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#43C651" />
                                </View>
                            ) : (
                                messages?.map((msg, i) =>
                                    msg.user.providerData.email === user.providerData.email ? (
                                        <View
                                            style={{
                                                alignSelf: 'flex-end',
                                                padding: 8,
                                                paddingLeft: 16,
                                                paddingRight: 16,
                                                borderRadius: 5,
                                                margin: 10,
                                                borderTopRightRadius: 22,
                                                borderBottomLeftRadius: 22,
                                                backgroundColor: 'green',
                                                maxWidth: '80%', // Limit message width
                                                position: 'relative',
                                            }}
                                            key={`${msg._id}_${i}`} // Use unique key combining _id and index
                                        >
                                            <Text>{msg.message}</Text>
                                            <View style={{ alignSelf: 'flex-end', marginTop: 4 }}>
                                                {msg?.timeStamp?.seconds && (
                                                    <Text style={styles.timestampText}>
                                                        {new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            hour12: true,
                                                        })}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    ) : (
                                        <View
                                            key={`${msg._id}_${i}`}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start', // Align items to the start to prevent overlapping
                                                marginVertical: 5,
                                            }}
                                        >
                                            <Image
                                                source={{ uri: msg?.user?.profilePic }}
                                                resizeMode="cover"
                                                style={{ margin:5,width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#77AB59' }}
                                            />
                                            <View
                                                style={{
                                                    alignSelf: 'flex-start',
                                                    padding: 8,
                                                    paddingLeft: 16,
                                                    paddingRight: 16,
                                                    borderRadius: 5,
                                                    marginHorizontal: 5,
                                                    borderTopRightRadius: 22,
                                                    borderBottomLeftRadius: 22,
                                                    backgroundColor: 'gray',
                                                    maxWidth: '80%', // Limit message width
                                                    position: 'relative',
                                                }}
                                            >
                                                <Text>{msg.message}</Text>
                                                <View style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                                                    {msg?.timeStamp?.seconds && (
                                                        <Text style={styles.timestampText}>
                                                            {new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                hour12: true,
                                                            })}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    )
                                )
                            )}
                        </ScrollView>
                    </KeyboardAvoidingView>

                </View>
            </View>
            <View>
                <View style={styles.containers}>
                    <TouchableOpacity style={{marginRight: 5}} onPress={toggleEmojiPicker}>
                        <Entypo name="emoji-happy" size={24} color="#555"/>
                    </TouchableOpacity>
                    {showEmojiPicker && (
                        <EmojiSelector
                            onEmojiSelected={handleEmojiSelected}
                            columns={8}
                            showSearchBar={false}
                            showSectionTitles={false}
                            showTabs={false}
                        />
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        value={inputMessage} // Use inputMessage instead of message
                        onChangeText={setInputMessage} // Use setInputMessage to update inputMessage state
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage} >
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#36802d',
    },
    ownMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    senderMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    timestampText: {
        color: 'white',
        fontSize: 10,
      },
    ownMessage: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 10,
    },
    senderMessage: {
        backgroundColor: 'lightgreen',
        padding: 10,
        borderRadius: 10,
    },
    ownMessageText: {
        color: 'black',
    },
    senderMessageText: {
        color: 'black',
    },  
    containers: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAF9F6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#FAF9F6',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    sendButton: {
        backgroundColor: '#36802d',
        borderRadius: 20,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    backButton: {
        top: 50,
        left: 10,
    },
    middleContainer: {
        flexDirection: 'row',
       
    },
    userIcon: {
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: 'white',
        left:40,
        top:10
    },
    userInfo: {
        top: 10,
      
    },
    userName: {
        fontSize: 20,
        left:50
    },
    userStatus: {
        fontSize: 10,
        left:50
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
        
    },
    iconButton: {
        left:80,
        margin:10
    },
    maincomponent: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: '#FAF9F6',
        flex: 1,
        marginTop: 25,
    },
});

export default ChatScreen;