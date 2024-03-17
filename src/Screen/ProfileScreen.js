import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../config/firebase";
import { useSelector } from "react-redux";
const ProfileScreen = ({ route, navigation }) => {
    const user = useSelector((state) => state.user);
    
    const dispatch = useDispatch();

    // Fetch user data when the component mounts
    useLayoutEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    const handleLogout = () => {
        auth
            .signOut()
            .then(() => {
                dispatch({ type: 'LOGOUT' }); // Dispatch logout action
                navigation.replace('Login'); // Navigate to login screen
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    };

    return (
        <View style={styles.container}>
            {user && (
                <>
                    <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                </>
            )}
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userEmail: {
       fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ProfileScreen;
