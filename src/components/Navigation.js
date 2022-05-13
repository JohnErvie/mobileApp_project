import React, {useContext} from 'react';
import {View, Text, Image, StyleSheet, useWindowDimensions} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LogScreen from '../screens/LogScreen';
import AboutScreen from '../screens/AboutScreen';
import ConnectScreen from '../screens/ConnectScreen';
import ScanScreen from '../screens/ScanScreen';
import {AuthContext} from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';

//icons
import {Entypo, AntDesign} from '@expo/vector-icons';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';

//import {TabView, SceneMap} from 'react-native-tab-view';

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const DrawerNavigator = () => {
  const {userInfo} = useContext(AuthContext);
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => {
        return (
          <DrawerContentScrollView {...props}>
            <View style={styles.viewStyle}>
              <Image
                source={require('../images/user_icon.png')}
                style={styles.imageStyle}
              />
              <View style={styles.textStyle}>
                <Text
                  style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
                  {userInfo.name}
                </Text>
                <Text style={{color: 'gray'}}>{userInfo.email}</Text>
              </View>
            </View>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        );
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: '#000000',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'HOME',
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Anomaly Logs"
        component={LogScreen}
        options={{
          tabBarLabel: 'ANOMALY LOGS',
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <Entypo name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: 'ABOUT',
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <Entypo name="info-with-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

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
    borderColor: 'green',
  },
  textStyle: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    textAlign: 'center',
    marginLeft: 10,
    fontFamily: 'Cochin',
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
      ) : rpiInfo.ip_address ? (
        /*
        <Stack.Screen
          name="HomeStack"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        */
        <Stack.Screen
          name="HomeStack"
          component={TabNavigator}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="QRScanner"
            component={ScanScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Connect"
            component={ConnectScreen}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
