import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../config/firebase";
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo

const ProfileScreen = ({ navigation }) => {
    const user = useSelector((state) => state.user);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Set user data when the component mounts
        if (user) {
            setUserData(user);
        }
    }, [user]);

    const dispatch = useDispatch();

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

    const handleEditProfile = () => {
        // Navigate to the edit profile screen
        navigation.navigate('EditProfile', { userData: userData });
    };

    return (
        <View style={styles.container}>
            {/* Back button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.content}>
                {userData && (
                    <>
                        <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{userData.name}</Text>
                            <Text style={styles.userEmail}>{userData.email}</Text>
                        </View>
                    </>
                )}
                <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleEditProfile}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 999, // Ensure the button is above other elements
    },
    content: {
        alignItems: 'center',
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    userEmail: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 150,
        alignItems: 'center',
    },
    greenButton: {
        backgroundColor: 'green',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ProfileScreen;
