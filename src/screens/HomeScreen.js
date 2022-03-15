import React, {useContext, useState} from 'react';
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
  var timeInfo = [""];
  var pcInfo = [0];

  const refresh = () => {
    var InsertAPIURL = `${BASE_URL}/pc_data.php`;

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    var Data={
      user_id: userInfo.user_id,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data)
    })
    .then((response)=>response.json())
    .then((response)=>
      {
        //alert(response[0].Message);
        //console.log(response[0].Message);

        var dataPC = response[0].power_consumption;
        var dataTime = response[0].time;
        if(dataPC != null || dataTime != null){
          var newData = [];
          for (let i = dataPC.length - 1; i >= 0; i--) {
            //newData.push(parseFloat(data[i][0].slice(0, -3))); no decimal
            newData.push(parseFloat(dataPC[i][0]));
          }
          pcInfo = newData;
          
          console.log(pcInfo);  
          
          
          var newData = [];
          for (let i = 0; i < dataTime.length; i++) {
            newData.push(dataTime[i][0].slice(0,8));
          }
          timeInfo = newData;
          
          console.log(timeInfo);
        }
        else{
          pcInfo = [0];
          
          console.log(pcInfo);

          timeInfo = [""];
          
          console.log(timeInfo);
        }

        
      })
    .catch((error)=>{
      console.log(`getting data error ${error}`);
      })
  };
*/

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
      
      <Button title="Refresh" color="blue" onPress={getData} />
      <Button title="Logout" color="red" onPress={logout} />
    </View>
  );
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