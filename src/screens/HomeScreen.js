import React, {useContext, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

import {Picker} from '@react-native-picker/picker';


import {
  LineChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
  const {userInfo, setIsLoading, logout, 
    timeInfo, pcInfo, getData_sec, getData_min, 
    getData_hr, pickerVal, displayTime, displayGraph} = useContext(AuthContext);

  useEffect(() => {
    const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
      //console.log(pickerVal[0]);
      displayGraph(pickerVal[0]);
      
    }, 1000); //refresh in 1.5 second
     
    return () => clearInterval(intervalId); //This is important
   
  }, []);

 
  
  return (
    <View style={styles.container}>
      <Spinner visible={setIsLoading} />
      <Text style={styles.welcome}>Aggregated Data (by {pickerVal[0]})</Text>

      <Picker style={{ height: 50, width: 150 }}
        onValueChange = {displayTime}
        selectedValue = {pickerVal[0]}
        >
        <Picker.Item label="Second" value="Second" />
        <Picker.Item label="Minute" value="Minute" />
        <Picker.Item label="Hour" value="Hour" />
      </Picker>
      
      <LineChart
        data={{
          labels: timeInfo,
          datasets: [
            {
              data: pcInfo,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
              strokeWidth: 2 // optional
            }
          ],
          //legend: ["Rainy Days"] // optional
        }}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
    </View>
  ) ;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'flex-start',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
});

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
  propsForLabels:{
    fontFamily:'MontserratBold',
    fontSize: 9,
    },
};

export default HomeScreen;