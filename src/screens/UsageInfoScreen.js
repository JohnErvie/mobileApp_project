import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';

import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
const screenWidth = Dimensions.get('window').width;

import Svg, {G, Circle} from 'react-native-svg';

const UsageInfoScreen = ({navigation, route}) => {
  const time = route.params.time.time;
  const Percentage = route.params.item.Percentage;
  const id = route.params.item.id;
  const sensor = route.params.item.sensor;
  const Sensorname = route.params.item.sname;
  const total = String((parseFloat(route.params.item.Total) / 100).toFixed(2));
  const sum = String(
    (parseFloat(route.params.item['sum(power_consumption)']) / 100).toFixed(2),
  );
  const name = route.params.name;
  var selectedTime = '';
  var selectedDate = '';

  if (time == 'day') {
    selectedTime = 'Daily';
    selectedDate = 'Today';
  } else if (time == 'week') {
    selectedTime = 'Weekly';
    selectedDate = 'This Week';
  } else if (time == 'month') {
    selectedTime = 'Monthly';
    selectedDate = 'This Month';
  }

  var date = new Date().toLocaleString();

  // from AuthContext
  const {dotUsage, getDataInfoUsage, infoUsage, timeUsage} =
    useContext(AuthContext);

  // for donut chart
  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;

  const percentageStrokeDashoffset =
    circleCircumference - (circleCircumference * Percentage) / 100;

  const totalStrokeDashoffset =
    circleCircumference - (circleCircumference * 100) / 100;

  const percentageAngle = (sum / total) * 360;

  // for first reload of page
  //on first mount, fetch data.
  useEffect(() => {
    getDataInfoUsage(time, sensor);
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
      getDataInfoUsage(time, sensor);
    });
  }, []);

  return (
    <>
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.sensorText}>
            <Text style={styles.textBold}>{Sensorname}</Text>
            <Text style={{fontSize: 11, color: '#6b6c6e', marginLeft: 10}}>
              {date}
            </Text>
          </View>
          <View>
            <View style={styles.usageContainer}>
              <Text style={styles.usageText}>{sum + ' KW'}</Text>
              <Text style={{fontSize: 15, color: '#6b6c6e', marginTop: 10}}>
                {'/' + total + ' KW'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <View>
                <View style={styles.graphWrapper}>
                  <Svg height="100" width="100" viewBox="0 0 180 180">
                    <G rotation={-90} originX="90" originY="90">
                      {total === 0 ? (
                        <Circle
                          cx="50%"
                          cy="50%"
                          r={radius}
                          stroke="#F1F6F9"
                          fill="transparent"
                          strokeWidth="40"
                        />
                      ) : (
                        <>
                          <Circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            stroke="#717572"
                            fill="transparent"
                            strokeWidth="40"
                            strokeDasharray={circleCircumference}
                            strokeDashoffset={totalStrokeDashoffset}
                            rotation={360}
                            originX="90"
                            originY="90"
                            strokeLinecap="round"
                          />
                          <Circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            stroke="#F05454"
                            fill="transparent"
                            strokeWidth="40"
                            strokeDasharray={circleCircumference}
                            strokeDashoffset={percentageStrokeDashoffset}
                            rotation={0}
                            originX="90"
                            originY="90"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </G>
                  </Svg>
                  <Text style={styles.label}>{Percentage}%</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  marginLeft: 20,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#000',
                    fontSize: 15,
                  }}>
                  {Percentage + '%'}
                </Text>
                <Text style={{fontSize: 15, color: '#6b6c6e'}}>
                  {'of Total Power Usage ' + selectedDate}
                </Text>
              </View>
            </View>
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
                {'Power Usage ' + selectedDate}
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
          <View style={styles.graph}>
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
                  labels: timeUsage,
                  datasets: [
                    {
                      data: infoUsage,
                      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
                      strokeWidth: 2, // optional
                    },
                  ],
                  //legend: ["Rainy Days"] // optional
                }}
                yAxisSuffix={'KW'}
                verticalLabelRotation={360 - 30}
                width={screenWidth}
                height={280}
                chartConfig={chartConfig}
                getDotColor={(dataPoint, dataPointIndex) => {
                  //console.log(currentStatus);
                  if (dotUsage[dataPointIndex] == 'Anomaly') return '#ff0000';
                  // red
                  else return '#00ff00'; // green
                }}
                renderDotContent={({x, y, index}) => {
                  return (
                    <View
                      style={{
                        height: 12,
                        width: 24,
                        opacity: 0.5,
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: y - (12 + 4), // <--- relevant to height / width (
                        left: x - 12 / 2 - 2, // <--- width / 2
                      }}>
                      <Text
                        style={{
                          fontSize: 10,
                          color: 'black',
                          fontWeight: 'bold',
                        }}>
                        {infoUsage[index].toFixed(2)}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
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
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  graph: {
    marginTop: 5,
  },
  textBold: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 35,
  },
  sensorText: {
    justifyContent: 'flex-start',
    marginTop: 5,
    marginLeft: 20,
  },
  usageContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 20,
  },
  usageText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 25,
  },
  totalText: {
    color: '#000',
    fontSize: 25,
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

export default UsageInfoScreen;
