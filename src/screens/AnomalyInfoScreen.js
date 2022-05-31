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

import {BASE_URL} from '../config';

import Svg, {G, Circle} from 'react-native-svg';

const AnomalyInfoScreen = ({navigation, route}) => {
  const {rpiInfo} = useContext(AuthContext);

  var origDateTime = route.params.item.datetime;

  var splitDate = origDateTime.split(' ');
  var date = splitDate[0] + 'T' + splitDate[1];
  const datetime = new Date(date).toLocaleString();
  var splitedDateTime = datetime.split(' ');
  const power = route.params.item.power_consumption;

  const Sensorname = route.params.item.sname;

  // for donut chart
  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;

  const [total, setTotal] = useState(null);
  const [percentageStrokeDashoffset, setPercentageStrokeDashoffset] =
    useState(null);
  const [totalStrokeDashoffset, setTotalStrokeDashoffset] = useState(null);
  const [percentageAngle, setPercentageAngle] = useState(null);

  const [Percentage, setPercentage] = useState(null);

  //for graph data
  var [infoUsage, setInfoUsage] = useState([0]);
  var [timeUsage, setTimeUsage] = useState(['']);
  var [dotUsage, setDotUsage] = useState(['']);

  // for first reload of page
  //on first mount, fetch data.
  useEffect(() => {
    getDataUsageHome(Sensorname, origDateTime);
    getDataInfoUsage(Sensorname, origDateTime);
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
      getDataUsageHome(Sensorname, origDateTime);
      getDataInfoUsage(Sensorname, origDateTime);
    });
  }, []);

  const getDataUsageHome = (sensorname, datetime) => {
    //console.log(rpiInfo.rpi_id);

    var InsertAPIURL = `${BASE_URL}/get_anomaly_usage.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpiInfo.rpi_id, //
      sensorname: sensorname,
      datetime: datetime,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //console.log(response[0].Summary[0]['sum(power_consumption)']);
        let total = parseFloat(
          response[0].Summary[0]['sum(power_consumption)'],
        );
        setTotal(total);

        var data;
        //console.log(response[0].Usage.length);

        for (let x = 0; x < response[0].Usage.length; x++) {
          if (response[0].Usage[x]['sname'] == Sensorname) {
            data = parseFloat(response[0].Usage[x]['sum(power_consumption)']);
          }
        }

        let Percentage = parseFloat(data / total);
        setPercentage(Percentage);

        let percentageStrokeDashoffset =
          circleCircumference - (circleCircumference * Percentage) / 100;

        setPercentageStrokeDashoffset(percentageStrokeDashoffset);

        let totalStrokeDashoffset =
          circleCircumference - (circleCircumference * 100) / 100;

        setTotalStrokeDashoffset(totalStrokeDashoffset);

        let percentageAngle = (data / total) * 360;

        setPercentageAngle(percentageAngle);
      })
      .catch(error => {
        console.log(`getting data error ${error}`);
      });
  };

  //function to convert from 24 hr to 12 hr format
  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  const getDataInfoUsage = (sensorname, datetime) => {
    //console.log(rpiInfo.rpi_id);

    var InsertAPIURL = `${BASE_URL}/get_anomaly_info_usage.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      sensorname: sensorname, //
      datetime: datetime,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].power_consumption);
        //console.log(response[0].Summary);
        //console.log(response[0].Usage);

        var dataUsage = response[0].Usage;

        var usagelength = dataUsage.length;

        var dataInfoUsage = [];
        var dataTimeUsage = [];

        var getDotUsage = [];

        for (let x = usagelength - 1; x >= 0; x--) {
          let datetime = dataUsage[x]['datetime'].split(' ');
          let dateOnly = datetime[0];

          let timeOnly = datetime[1].slice(0, 8);

          dataInfoUsage.push(
            parseFloat(dataUsage[x]['sum(power_consumption)']) / 1000,
          );

          let converted = tConvert(timeOnly);
          let splitConverted = converted.split(':');
          let modifiedTime =
            splitConverted[0] + converted.slice(-2, converted.length); //ex. 3AM
          dataTimeUsage.push(modifiedTime);

          if (
            parseInt(dataUsage[x]['sum(power_consumption_anomaly_score)']) != 0
          ) {
            getDotUsage.push('Anomaly');
          } else {
            getDotUsage.push('Normal');
          }
        }

        dotUsage = getDotUsage;
        setDotUsage(dotUsage);

        infoUsage = dataInfoUsage;
        setInfoUsage(infoUsage);

        timeUsage = dataTimeUsage;
        setTimeUsage(timeUsage);

        //console.log(infoUsage);
        //console.log(timeUsage);
        //console.log(dotUsage);

        getDotUsage = []; //to clear
      })
      .catch(error => {
        console.log(`getting data error ${error}`);
      });
  };

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
              {datetime}
            </Text>
          </View>

          <View style={styles.usageContainer}>
            <Text style={[styles.usageText, {color: 'red'}]}>
              <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>
                {'At Power Consumption '}
              </Text>
              {power + ' W'}
            </Text>
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 40}}>
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
                {splitedDateTime[0] +
                  ' ' +
                  splitedDateTime[1] +
                  ' ' +
                  splitedDateTime[2] +
                  ' ' +
                  splitedDateTime[4]}
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

          <View>
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
                  <Text style={styles.label}>
                    {parseFloat(Percentage * 100).toFixed(2)}%
                  </Text>
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
                  {parseFloat(Percentage * 100).toFixed(2) + '%'}
                </Text>
                <Text style={{fontSize: 15, color: '#6b6c6e'}}>
                  {'of Total Power Usage '}
                </Text>
                <Text style={{fontSize: 15, color: '#6b6c6e'}}>
                  {splitedDateTime[1] +
                    ' ' +
                    splitedDateTime[2] +
                    ' ' +
                    splitedDateTime[4]}
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
                {'Power Usage ' +
                  splitedDateTime[1] +
                  ' ' +
                  splitedDateTime[2] +
                  ' ' +
                  splitedDateTime[4]}
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

export default AnomalyInfoScreen;
