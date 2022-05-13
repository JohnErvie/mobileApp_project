import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

import {Picker} from '@react-native-picker/picker';

import PushNotification from 'react-native-push-notification';
//import Icon from 'react-native-vector-icons/FontAwesome';
import {AntDesign} from '@expo/vector-icons';
import RadioButtonRN from 'radio-buttons-react-native';
import {RadioButton} from 'react-native-paper';

import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {
  const {
    setIsLoading,
    timeInfo,
    pcInfo,

    pickerVal,
    displayTime,
    getDataRadio,
    radioValue,

    getAnomalyData,

    displayGraph,
    displayGraphRadio,

    detectAnomaly,
    rpiInfo,
    currentStatus,
    setCurrentStatus,
  } = useContext(AuthContext);

  const [data, setData] = React.useState([
    {
      label: 'Summary',
    },
    {
      label: 'Sensor 1',
    },
    {
      label: 'Sensor 2',
    },
    {
      label: 'Sensor 3',
    },
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let componentMounted = true;
      const fetchData = async () => {
        //you async action is here
        if (componentMounted) {
          displayGraphRadio(radioValue[0]);
          //detectAnomaly();
        }
      };
      fetchData();
      return () => {
        componentMounted = false;
      };
    }, 10000); //refresh in 10 second

    const intervalIdDetection = setInterval(() => {
      let componentMountedDetection = true;
      const fetchDataDetection = async () => {
        //you async action is here
        if (componentMountedDetection) {
          detectAnomaly();
        }
      };
      fetchDataDetection();
      return () => {
        componentMountedDetection = false;
      };
    }, 1000); //refresh in 10 second

    return () => {
      clearInterval(intervalId);
      clearInterval(intervalIdDetection);
    }; //This is important
  }, []);

  //for refreshing the page
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(0).then(() => {
      setRefreshing(false);
      displayGraphRadio(radioValue[0]);
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <Spinner visible={setIsLoading} />
          {/* <Text style={styles.welcome}>{rpiInfo.ip_address}</Text> */}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.welcome}>Power Consumption Data</Text>
          </View>
          <RadioButtonRN
            data={data}
            animationTypes={['shake']}
            initial={1}
            selectedBtn={e => {
              getDataRadio(e);
            }}
            circleSize={16}
            icon={<AntDesign name="checkcircle" size={22} color="black" />}
          />

          <Picker
            style={{height: 50, width: 150, color: '#000'}}
            dropdownIconColor="black"
            onValueChange={displayTime}
            selectedValue={pickerVal[0]}>
            <Picker.Item label="Minute" value="Minute" />
            <Picker.Item label="Hour" value="Hour" />
            <Picker.Item label="Month" value="Month" />
          </Picker>

          <LineChart
            data={{
              labels: timeInfo,
              datasets: [
                {
                  data: pcInfo,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
                  strokeWidth: 2, // optional
                },
              ],
              //legend: ["Rainy Days"] // optional
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            getDotColor={(dataPoint, dataPointIndex) => {
              //console.log(currentStatus);
              if (currentStatus[dataPointIndex] == 'Anomaly') return '#ff0000';
              // red
              else return '#00ff00'; // green
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    color: '#000',
  },
});

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
  propsForLabels: {
    fontFamily: 'MontserratBold',
    fontSize: 9,
  },
};

export default HomeScreen;
