import React, {useContext, useEffect, useState, useRef} from 'react';
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
import {AntDesign, Feather, Entypo} from '@expo/vector-icons';
import RadioButtonRN from 'radio-buttons-react-native';
import {RadioButton} from 'react-native-paper';

import {LineChart, ProgressChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

import Svg, {G, Circle} from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

//Global Vars

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
    getDataInfoUsage,

    timeUsage,
    infoUsage,

    sensorInfo,
    todayUsage,
    checkingData,

    getDataUsage,
    progressChartData,
  } = useContext(AuthContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let componentMounted = true;
      const fetchData = async () => {
        //you async action is here
        if (componentMounted) {
          displayGraphRadio(radioValue[0]);
          getDataUsage('day');
          //detectAnomaly();
        }
      };
      fetchData();
      return () => {
        componentMounted = false;
      };
    }, 15000); //refresh in 15 second

    const intervalIdDetection = setInterval(() => {
      let componentMountedDetection = true;
      const fetchDataDetection = async () => {
        //you async action is here
        if (componentMountedDetection) {
          //detectAnomaly(); // notification when anomaly detected
          //getDataInfoUsage('day', 'Sensor 1');
          //console.log(timeUsage, infoUsage);
        }
      };
      fetchDataDetection();
      return () => {
        componentMountedDetection = false;
      };
    }, 1000); //refresh in 1 second

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
      getDataUsage('day');
    });
  }, []);

  const dataProgressChart = {
    labels: ['Laravel', 'PHP', 'html', 'javascript'], // optional
    data: [0.4, 0.7, 0.8, 0.4],
  };

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
          <View>
            <RadioButtonRN
              data={[
                {
                  label: 'Summary',
                },
                {
                  label: sensorInfo.sensor1,
                },
                {
                  label: sensorInfo.sensor2,
                },
                /*{
                  label: sensorInfo.sensor3,
                },*/
                {
                  label: sensorInfo.sensor4,
                },
              ]}
              animationTypes={['shake']}
              initial={1}
              selectedBtn={e => {
                getDataRadio(e);
              }}
              circleSize={16}
              icon={<AntDesign name="checkcircle" size={22} color="black" />}
            />
          </View>

          <Picker
            style={{height: 50, width: 150, color: '#000'}}
            dropdownIconColor="black"
            onValueChange={displayTime}
            selectedValue={pickerVal[0]}>
            <Picker.Item label="Minute" value="Minute" />
            <Picker.Item label="Hour" value="Hour" />
            <Picker.Item label="Week" value="Week" />
            <Picker.Item label="Month" value="Month" />
          </Picker>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              flexDirection: 'row',
            }}>
            <View style={[styles.dot, {backgroundColor: '#0ffc03'}]}></View>
            <Text
              style={{
                textAlign: 'center',
                color: '#000',
                fontWeight: 'bold',
                marginRight: 50,
                marginLeft: 5,
              }}>
              {'Normal'}
            </Text>
            <View style={[styles.dot, {backgroundColor: '#fc0303'}]}></View>
            <Text
              style={{
                textAlign: 'center',
                color: '#000',
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              {'Anomaly'}
            </Text>
          </View>
          <View>
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
              yAxisSuffix={'KW'}
              verticalLabelRotation={360 - 30}
              //horizontalLabelRotation={180}
              width={screenWidth}
              height={280}
              chartConfig={
                pickerVal[0] === 'Minute' ? chartConfig2 : chartConfig
              }
              getDotColor={(dataPoint, dataPointIndex) => {
                //console.log(currentStatus);
                if (currentStatus[dataPointIndex] == 'Anomaly')
                  return '#ff0000';
                // red
                else return '#00ff00'; // green
              }}
            />
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <View
              style={{
                flex: 1,
                height: 2,
                backgroundColor: '#6b6c6e',
                marginLeft: 20,
                marginRight: 10,
              }}
            />
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#6b6c6e',
                  fontWeight: 'bold',
                }}>
                {'Power Usage Today'}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 2,
                backgroundColor: '#6b6c6e',
                marginLeft: 10,
                marginRight: 20,
              }}
            />
          </View>

          <View style={styles.mainbox}>
            <ProgressChart
              data={progressChartData}
              width={340}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={{
                backgroundColor: '#218838',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#e2e2e2',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(13, 136, 56, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0,0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#218838',
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              hideLegend={false}
            />
          </View>
          {/**/}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
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
  mainbox: {
    textAlign: 'center',
    justifyContent: 'space-between',
  },
});

const chartConfig = {
  backgroundColor: '#fff000',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#fffffa',
  color: (opacity = 1) => `rgba(105, 105, 105, ${opacity})`,
  decimalPlaces: 2,
  linejoinType: 'round',
  scrollableDotFill: '#fff',
  scrollableDotRadius: 6,
  scrollableDotStrokeColor: 'tomato',
  scrollableDotStrokeWidth: 3,
  scrollableInfoViewStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#121212',
    borderRadius: 2,
  },
  scrollableInfoTextStyle: {
    fontSize: 10,
    color: '#C4C4C4',
    marginHorizontal: 2,
    flex: 1,
    textAlign: 'center',
  },
  scrollableInfoSize: {width: 30, height: 30},
  scrollableInfoOffset: 15,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  color: (opacity = 1) => `rgb(78, 135, 210, ${opacity})`,
  style: {
    borderRadius: 16,
    borderLeftWidth: 50,
    borderStyle: 'solid',
  },
  propsForLabels: {
    fontFamily: 'MontserratBold',
    fontSize: 9,
    fontWeight: 'bold',
    strokeDasharray: '', // solid background lines with no dashes
    strokeDashoffset: 15,
  },
};

const chartConfig2 = {
  backgroundColor: '#fff000',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#fffffa',
  color: (opacity = 1) => `rgba(105, 105, 105, ${opacity})`,
  decimalPlaces: 2,
  linejoinType: 'round',
  scrollableDotFill: '#fff',
  scrollableDotRadius: 6,
  scrollableDotStrokeColor: 'tomato',
  scrollableDotStrokeWidth: 3,
  scrollableInfoViewStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#121212',
    borderRadius: 2,
  },
  scrollableInfoTextStyle: {
    fontSize: 10,
    color: '#C4C4C4',
    marginHorizontal: 2,
    flex: 1,
    textAlign: 'center',
  },
  scrollableInfoSize: {width: 30, height: 30},
  scrollableInfoOffset: 15,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  color: (opacity = 1) => `rgb(78, 135, 210, ${opacity})`,
  style: {
    borderRadius: 16,
    borderLeftWidth: 50,
    borderStyle: 'solid',
  },
  propsForLabels: {
    fontFamily: 'MontserratBold',
    fontSize: 7,
    fontWeight: 'bold',
    strokeDasharray: '', // solid background lines with no dashes
    strokeDashoffset: 15,
  },
};

export default HomeScreen;
