import React, {useContext} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';
import ConnectScreen from '../screens/ConnectScreen';
import {AuthContext} from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';

import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const DrawerNavigator = () => {
  const {userInfo} = useContext(AuthContext);
  return (
    <Drawer.Navigator initialRouteName='Home' drawerContent={props => {
      return (
        <DrawerContentScrollView {...props}>
          <View style={styles.viewStyle}>
            <Image 
              source={require('../images/user_icon.png')} 
              style={styles.imageStyle}
            />
            <View style={styles.textStyle}>
              <Text style={{fontSize: 16, fontWeight: "bold", color: 'black'}}>{userInfo.name}</Text>
              <Text style={{color: 'gray'}}>{userInfo.email}</Text>
            </View>
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )
    }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#ADD8E6',
    marginBottom: 20,
  },
  imageStyle: {
    width: 80,
    height: 80, 
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "green",
  },
  textStyle: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    textAlign: 'center',
    marginLeft: 10,
    fontFamily: "Cochin",
  },
});

const Navigation = () => {
  const {userInfo, rpiInfo, splashLoading} = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {splashLoading ? (
        <Stack.Screen
          name="Splash Screen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      ) : userInfo.status ? (
        rpiInfo.ip_address ? (
          <Stack.Screen 
          name="HomeStack" 
          component={DrawerNavigator} 
          options={{headerShown: false}}
          />
          ) : (
          <Stack.Screen
            name="Connect"
            component={ConnectScreen}
            options={{headerShown: false}}
          />
          )
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
/*
const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

const AboutStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}

export {Navigation, ProfileStackNavigator, HomeStackNavigator, AboutStackNavigator};
*/
export default Navigation;