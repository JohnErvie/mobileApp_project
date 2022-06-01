import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';

import {AntDesign, Entypo} from '@expo/vector-icons';

const AboutAppScreen = ({navigation}) => {
  const {logout, rpiInfo} = useContext(AuthContext);
  return (
    <>
      <View style={styles.center}>
        <View>
          <Image
            style={styles.image}
            source={require('../images/app_banner.png')}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: -500,
          marginLeft: 10,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'justify',
            color: '#000',
            fontFamily: 'sans-serif-light',
            fontSize: 16,
          }}>
          {'\t\t\t'}The Android Application created specifically for the Anomaly
          detection was developed using the React Native. The Android
          application is used for the display of logs, alerting the user for any
          anomalous consumption detected and a way that the user would be able
          to monitor the consumption that the household consumes.
        </Text>
        <Text>{}</Text>
        <Text
          style={{
            textAlign: 'justify',
            color: '#000',
            fontFamily: 'sans-serif-light',
            fontSize: 16,
          }}>
          {'\t\t\t'}EleCorrect is headquartered in Metro Manila, Philippines,
          and its solution focuses on Power Anomaly Detection by offering a
          monitoring system that alerts the user and displays the real
          electricity utilized. The affiliation between the Computer Engineers
          Giovanni G. Raper, Joshua Paolo S. Quiros, and Ervie John Villareal
          was founded by 2021-2022.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    //flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -500,
  },

  image: {
    flex: 1,
    width: 350,
    height: null,
    resizeMode: 'contain',
    //position: 'absolute',
  },
});

export default AboutAppScreen;
