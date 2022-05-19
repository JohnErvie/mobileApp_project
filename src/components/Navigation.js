import React, {useContext} from 'react';
import {View, Text, Image, StyleSheet, useWindowDimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AnomalyRecordScreen from '../screens/AnomalyRecordScreen';
import UsageTodayScreen from '../screens/UsageTodayScreen';
import UsageWeekScreen from '../screens/UsageWeekScreen';
import UsageMonthScreen from '../screens/UsageMonthScreen';
import UsageInfoScreen from '../screens/UsageInfoScreen';
import ConnectScreen from '../screens/ConnectScreen';
import ScanScreen from '../screens/ScanScreen';
import AddSensorScreen from '../screens/AddSensorScreen';
import {AuthContext} from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';

//icons
import {Entypo, AntDesign, MaterialIcons} from '@expo/vector-icons';

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
    </Drawer.Navigator>
  );
};

const UsageTab = createMaterialTopTabNavigator();

const UsageTabNavigator = () => {
  return (
    <UsageTab.Navigator
      initialRouteName="Today"
      screenOptions={{
        tabBarInactiveTintColor: '#000000',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: 'powderblue'},
      }}
      barStyle={{
        backgroundColor: '#694fad', //Color of your choice
        borderBottomColor: '#50d3a7',
        borderBottomWidth: 2,
      }}>
      <UsageTab.Screen
        name="Today"
        component={UsageTodayScreen}
        options={{
          tabBarLabel: 'Today',
          /*
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <Entypo name="home" size={size} color={color} />
          ),*/
        }}
      />
      <UsageTab.Screen
        name="Week"
        component={UsageWeekScreen}
        options={{
          tabBarLabel: 'This week',
          /*
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <Entypo name="home" size={size} color={color} />
          ),*/
        }}
      />
      <UsageTab.Screen
        name="Month"
        component={UsageMonthScreen}
        options={{
          tabBarLabel: 'This month',
          /*
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <Entypo name="home" size={size} color={color} />
          ),*/
        }}
      />
    </UsageTab.Navigator>
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
        name="Anomaly Records"
        component={AnomalyRecordScreen}
        options={{
          tabBarLabel: 'ANOMALY RECORD',
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <Entypo name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Power Usage"
        component={UsageTabNavigator}
        options={{
          tabBarLabel: 'POWER USAGE',
          tabBarOptions: {
            showIcon: true,
          },
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="data-usage" size={size} color={color} />
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
  const {rpiInfo, splashLoading, sensorInfo} = useContext(AuthContext);

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
        sensorInfo.sensor1 ? (
          <>
            <Stack.Screen
              name="HomeStack"
              component={TabNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UsageInfo"
              component={UsageInfoScreen}
              //options={{headerShown: true}}
              options={({route}) => ({title: route.params.name})}
            />
          </>
        ) : (
          <Stack.Screen
            name="AddSensorName"
            component={AddSensorScreen}
            options={{headerShown: false}}
          />
        )
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
