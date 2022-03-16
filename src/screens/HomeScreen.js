import React, {useContext, useEffect} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import {BASE_URL} from '../config';

import {
  LineChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const {userInfo, setIsLoading, logout, timeInfo, pcInfo, getData} = useContext(AuthContext);
  /*
  useEffect(() => {
    const intervalId = setInterval(() => {
      getData();
    })
    // Update the document title using the browser API
    
  }, 1000);
*/
  useEffect(() => {
    const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
     getData();
    }, 1000);
  
    return () => clearInterval(intervalId); //This is important
   
  }, []);
  
  
  return (
    <View style={styles.container}>
      <Spinner visible={setIsLoading} />
      <Text style={styles.welcome}>Aggregated Data (by seconds)</Text>


      
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
      

      <Text style={styles.welcome}>Welcome {userInfo.name}</Text>
      
      <Button title="Logout" color="red" onPress={logout} />
    </View>
  ) ;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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