import React, { useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebaseAuth, firestoreDB } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { SET_USER } from "../context/actions/useractions";
import logo from '../../assets/logo.png'; // Import the logo image here

const Splash = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(async (userCred) => {
            if (userCred?.uid) {
                try {
                    const docSnap = await getDoc(doc(firestoreDB, "user", userCred.uid));
                    if (docSnap.exists()) {
                        console.log("User Data :", docSnap.data());
                        dispatch(SET_USER(docSnap.data()));
                        navigation.replace("HomeScreen");
                    } else {
                        console.error("User data not found.");
                        navigation.replace("Login");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    navigation.replace("Login");
                }
            } else {
                navigation.replace("Login");
            }
        });

        return unsubscribe; // Cleanup function
    }, []);

    return (
        <View style={styles.container}>
            <Image source={logo} resizeMode='contain' />
            <ActivityIndicator size={"large"} color={"#43C651"} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Splash;
