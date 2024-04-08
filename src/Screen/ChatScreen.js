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
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
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
            message: inputMessage,
            user: user
        };
        setInputMessage("");
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
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }
        })
        return unsubcribe
    },[])

    const handleEmojiSelected = (emoji) => {
        setInputMessage(prevMessage => prevMessage + emoji);
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

            <View style={styles.header}>
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

            <View style={styles.chatContainer}>
                <ScrollView
                    style={{ flex: 1 }}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#43C651" style={styles.loadingIndicator} />
                    ) : (
                        messages?.map((msg, i) =>
                            <View
                                key={`${msg._id}_${i}`}
                                style={[
                                    styles.messageContainer,
                                    {
                                        alignSelf: msg.user.providerData.email === user.providerData.email ? 'flex-end' : 'flex-start',
                                        
                                    }
                                    
                                ]}
                            >
                                {msg.user.providerData.email !== user.providerData.email && (
                                    <View style={styles.avatarContainer}>
                                        <Image
                                            source={{ uri: msg?.user?.profilePic }}
                                            resizeMode="cover"
                                            style={styles.avatar}
                                        />
                                    </View>
                                )}
                            <View style={[
        styles.messageContent,
        msg.user.providerData.email === user.providerData.email
            ? styles.senderMessageContent
            : styles.receiverMessageContent
    ]}>
        <Text style={styles.senderName}>
    {msg.user.providerData.email === user.providerData.email
        ? "You"
        : msg.user.name
    }
</Text>
                                    <Text style={styles.messageText}>{msg.message}</Text>
                                    <Text style={styles.timestampText}>
                                        {msg?.timeStamp?.seconds && (
                                            new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })
                                        )}
                                    </Text>
                                </View>
                            </View>
                        )
                    )}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.emojiButton} onPress={toggleEmojiPicker}>
                    <Entypo name="emoji-happy" size={24} color="#555" />
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
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#36802d',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    userIcon: {
        borderRadius: 50,
        marginTop:20,
        marginLeft:20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: 'white',
    },
    userInfo: {
        marginLeft: 20,
        marginTop:20
    },
    userName: {
        fontSize: 20,
        color: 'white',
    },
    userStatus: {
        fontSize: 10,
        color: 'white',
    },
    senderMessageContent: {
        backgroundColor: 'green',
        borderRadius: 8,
        padding: 10,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    receiverMessageContent: {
        backgroundColor: 'grey',
        borderRadius: 8,
        padding: 10,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        
        marginTop:30,
        
    },
    senderName: {
        marginBottom: 4,
        color: 'black',
        fontWeight: 'bold',
        
    },
    iconButton: {
        marginLeft: 10,
    },
    chatContainer: {
        flex: 1,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: '#FAF9F6',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 10,
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    messageContent: {
        backgroundColor: '#43C651',
        borderRadius: 8,
        padding: 10,
        marginLeft: 10,
        alignSelf: 'flex-start', // Align to the start of the container
        maxWidth: '80%', // Set maximum width to 80%
        minWidth: 100, // Set minimum width
    },
    messageText: {
        color: 'white',
        maxWidth: '100%', // Allow text to wrap within the container
    },
    timestampText: {
        color: 'white',
        fontSize: 10,
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    loadingIndicator: {
        marginTop: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAF9F6',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    emojiButton: {
        marginRight: 10,
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
});

export default ChatScreen;