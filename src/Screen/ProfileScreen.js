import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../config/firebase";
import { useSelector } from "react-redux";

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
            {userData && (
                <>
                    <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userData.name}</Text>
                        <Text style={styles.userEmail}>{userData.email}</Text>
                        {/* Add more user information here */}
                    </View>
                </>
            )}
            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            {/* Add more options/buttons here */}
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
        fontSize: 18,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ProfileScreen;
