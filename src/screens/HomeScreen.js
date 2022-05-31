import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Platform,
  Dimensions,
  TouchableOpacity,
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

import Svg, {G, Circle} from 'react-native-svg';

//for date picker
//import {DatePicker} from 'react-native-wheel-pick';
//import DatePicker from 'react-native-date-picker';

import DateTimePicker from '@react-native-community/datetimepicker';

import AsyncStorage from '@react-native-async-storage/async-storage';

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

    progressChartData,

    tmpDateTime,
    setTmpDateTime,

    getDataUsageHome,
  } = useContext(AuthContext);

  const [resetToCurTime, setResetToCurTime] = useState('1'); //for date and time

  useEffect(() => {
    const intervalId = setInterval(() => {
      let componentMounted = true;
      const fetchData = async () => {
        //you async action is here
        if (componentMounted) {
          getResetCurDTime();
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
          detectAnomaly(); // notification when anomaly detected
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

      //displayGraphRadio(radioValue[0]);
      getResetCurDTime();
    });
  }, []);

  //for date picker
  const [curDate, setCurDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  var splitDate = curDate.toLocaleString().split(' ');
  splitDate = splitDate.filter(v => v !== '');
  const [selectedDateTime, setSelectedDateTime] = useState('');

  const [titleDate, setTitleDate] = useState(
    splitDate[1] +
      ' ' +
      splitDate[2] +
      ', ' +
      splitDate[4] +
      ' ' +
      splitDate[3],
  );

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);

    let tempDate = new Date(currentDate);

    var monthName = tempDate.toLocaleString().split(' ');

    monthName = monthName.filter(v => v !== '');

    //console.log(monthName);
    setTitleDate(
      monthName[1] +
        ' ' +
        tempDate.getDate() +
        ', ' +
        tempDate.getFullYear() +
        ' ' +
        monthName[3],
    );

    let selectedDateTime = gettingDateTime(currentDate);
    //console.log(selectedDateTime);
    setSelectedDateTime(selectedDateTime);
    AsyncStorage.setItem('selectedDateTime', selectedDateTime);

    let resetToCurTime = '0';
    setResetToCurTime(resetToCurTime);
    AsyncStorage.setItem('resetToCurTime', resetToCurTime);

    getSelectedDateTime();
    //console.log(titleDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const gettingDateTime = currentDate => {
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getFullYear() +
      '-' +
      String(parseInt(tempDate.getMonth()) + 1) +
      '-' +
      tempDate.getDate();
    let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
    return fDate + ' ' + fTime;
  };

  const getSelectedDateTime = async () => {
    try {
      let selectedDateTime = await AsyncStorage.getItem('selectedDateTime');

      if (selectedDateTime) {
        setSelectedDateTime(selectedDateTime);
        console.log(selectedDateTime);
        AsyncStorage.setItem('dateNtime', String(selectedDateTime));
        displayGraphRadio(radioValue[0], String(selectedDateTime));

        getDataUsageHome('day', String(selectedDateTime));
      }
    } catch (e) {
      console.log(`error ${e}`);
    }
  };

  const getResetCurDTime = async () => {
    try {
      let resetToCurTime = await AsyncStorage.getItem('resetToCurTime');

      setResetToCurTime(resetToCurTime);
      //console.log(resetToCurTime);
      if (resetToCurTime == '1') {
        let newDate = new Date();
        //console.log(newDate.getMonth());
        let dateNtime = gettingDateTime(newDate);
        //console.log(dateNtime);

        AsyncStorage.setItem('dateNtime', String(dateNtime));

        displayGraphRadio(radioValue[0], String(dateNtime));
        getDataUsageHome('day', String(dateNtime));
      } else {
        //console.log('selected time', selectedDateTime);
        getSelectedDateTime();
      }
    } catch (e) {
      console.log(`error ${e}`);
    }
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
            {/*radio button for specific location of sensor*/}
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

          {/*drop down menu, minutes, hour, week, month*/}
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

          <View style={{marginBottom: 20}}>
            <TouchableOpacity
              onPress={() => {
                showMode('date');
              }}>
              <View style={styles.button}>
                <View style={{marginRight: 10, marginLeft: 10}}>
                  <AntDesign name="edit" size={24} color="black" />
                </View>
                <Text style={styles.buttonText}>{'Date'}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 20}}>
            <TouchableOpacity
              onPress={() => {
                showMode('time');
              }}>
              <View style={styles.button}>
                <View style={{marginRight: 10, marginLeft: 10}}>
                  <AntDesign name="edit" size={24} color="black" />
                </View>
                <Text style={styles.buttonText}>{'Time'}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 20}}>
            <TouchableOpacity
              onPress={() => {
                let resetToCurTime = '1';
                setResetToCurTime(resetToCurTime);
                AsyncStorage.setItem('resetToCurTime', resetToCurTime);
              }}>
              <View style={styles.button}>
                <View style={{marginRight: 10, marginLeft: 10}}>
                  <AntDesign name="edit" size={24} color="black" />
                </View>
                <Text style={styles.buttonText}>
                  {'Reset To Current Date and Time'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              onChange={onChange}
            />
          )}

          {/*line title date*/}
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
                  marginBottom: 5,
                }}>
                {titleDate}
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

          {/*For normal dot and anomaly dot*/}
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
          {/*line title total power usage*/}
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
                  marginBottom: 5,
                }}>
                {'Total Power Usage'}
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
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <View style={styles.graphWrapper}>
            <Svg height="160" width="160" viewBox="0 0 180 180">
              <G rotation={-90} originX="90" originY="90">
                {progressChartData['total'] === 0 ? (
                  <Circle
                    cx="50%"
                    cy="50%"
                    r={progressChartData['radius']}
                    stroke="#F1F6F9"
                    fill="transparent"
                    strokeWidth="40"
                  />
                ) : (
                  <>
                    <Circle
                      cx="50%"
                      cy="50%"
                      r={progressChartData['radius']}
                      stroke="#f05454"
                      fill="transparent"
                      strokeWidth="40"
                      strokeDasharray={progressChartData['circleCircumference']}
                      strokeDashoffset={
                        progressChartData['sensorsStrokeDashoffset'][0]
                      }
                      rotation={0}
                      originX="90"
                      originY="90"
                      strokeLinecap="round"
                    />
                    <Circle
                      cx="50%"
                      cy="50%"
                      r={progressChartData['radius']}
                      stroke="#49854f"
                      fill="transparent"
                      strokeWidth="40"
                      strokeDasharray={progressChartData['circleCircumference']}
                      strokeDashoffset={
                        progressChartData['sensorsStrokeDashoffset'][1]
                      }
                      rotation={progressChartData['sensorsAngle'][0]}
                      originX="90"
                      originY="90"
                      strokeLinecap="round"
                    />
                    <Circle
                      cx="50%"
                      cy="50%"
                      r={progressChartData['radius']}
                      stroke="#133e80"
                      fill="transparent"
                      strokeWidth="40"
                      strokeDasharray={progressChartData['circleCircumference']}
                      strokeDashoffset={
                        progressChartData['sensorsStrokeDashoffset'][2]
                      }
                      rotation={progressChartData['sensorsAngle'][2]}
                      originX="90"
                      originY="90"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </G>
            </Svg>
            <Text style={styles.label}>
              {(progressChartData.total / 1000000).toFixed(2) + ' MW'}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'column',
              marginLeft: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  styles.dot,
                  {backgroundColor: '#f05454', marginTop: 5},
                ]}></View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000',
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                {progressChartData['sensorName'][0] +
                  ' ' +
                  progressChartData['Percentage'][0] +
                  '%'}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  styles.dot,
                  {backgroundColor: '#49854f', marginTop: 5},
                ]}></View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000',
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                {progressChartData['sensorName'][1] +
                  ' ' +
                  progressChartData['Percentage'][1] +
                  '%'}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  styles.dot,
                  {backgroundColor: '#133e80', marginTop: 5},
                ]}></View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000',
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                {progressChartData['sensorName'][2] +
                  ' ' +
                  progressChartData['Percentage'][2] +
                  '%'}
              </Text>
            </View>
          </View>
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
  graphWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
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
