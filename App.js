import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import Navigation from './src/components/Navigation';
//import DrawerNavigator from './src/components/DrawerNavigator';
import { NavigationContainer } from "@react-navigation/native";
import {AuthProvider} from './src/context/AuthContext';
import 'react-native-gesture-handler';

import { LogBox } from 'react-native';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#06bcee" />

      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
      
    </AuthProvider>
  );
};

export default App;

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);
