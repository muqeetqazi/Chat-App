import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import react from "react";
import { Text,View, } from "react-native";
const Stack=createNativeStackNavigator();
import Splash from "../Screen/Splash";
import Signup from "../Screen/Signup";
import Login from "../Screen/Login";
import HomeScreen from "../Screen/HomeScreen";
import {Provider} from "react-redux"
import store from "../context/store";
import ProfileScreen from "../Screen/ProfileScreen";
import { AddToChatScreen, ChatScreen } from "../Screen";
import ForgetPassword from "../Screen/ForgetScreen";

const AppNavigator=()=>{
    return(
        <NavigationContainer>
           <Provider store={store}>
            <Stack.Navigator>
                <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
                <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}}/>
                <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown:false}}/>
                <Stack.Screen name="AddToChatScreen" component={AddToChatScreen} options={{headerShown:false}}/>
                <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown:false}}/>
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown:false}}/>
                <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{headerShown:false}}/>
            </Stack.Navigator>
            </Provider>
            
        </NavigationContainer>
    );

};
export default AppNavigator;