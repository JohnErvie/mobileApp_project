import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {BASE_URL} from '../config';
import {Alert} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {useToast} from 'react-native-toast-notifications';

//import getWeekOfMonth from 'date-fns/getWeekOfMonth';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  var [timeInfo, setTimeInfo] = useState(['']);
  var [pcInfo, setPCInfo] = useState([0]); // pc = power consumption
  var [lastAnomalyTime, setLastAnomalyTime] = useState();
  var [currentStatus, setCurrentStatus] = useState([]);
  var [getCurrentStatus, setGetCurrentStatus] = useState([]);
  var [RPI_ip_address, setRPI_IpAddress] = useState(null);
  var [pickerVal, setPickerVal] = useState(['Minute']);

  //const [globalInfo, setGlobalInfo] = useState({});
  const [rpiInfo, setRpiInfo] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  var [ipAddress, setIpAddress] = useState('');

  var [radioValue, setRadioValue] = useState([]);

  var [anomalyData, setAnomalyData] = useState([]);

  // getting data usage
  var [todayUsage, setTodayUsage] = useState(['']);
  var [weekUsage, setWeekUsage] = useState(['']);
  var [monthUsage, setMonthUsage] = useState(['']);

  var [infoUsage, setInfoUsage] = useState([0]);
  var [timeUsage, setTimeUsage] = useState(['']);
  var [dotUsage, setDotUsage] = useState(['']);

  // For checking the number of data
  var [s1Status, setS1Status] = useState(null);
  var [s2Status, setS2Status] = useState(null);
  //var [s3Status, setS3Status] = useState(null);
  var [s4Status, setS4Status] = useState(null);
  var [dataProgressStatus, setDataProgressStatus] = useState(null);

  // for toast notification
  const toast = useToast();

  //for sensors
  const [sensorInfo, setSensorInfo] = useState({});

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

  function dayNameConvert(date) {
    //var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(date);
    //var dayName = days[d.getDay()];

    var dayName = d.toString().split(' ')[0];

    return dayName;
  }

  //get the week number of month
  function weekOfTheMonth(date) {
    var dated = new Date(date);
    const day = dated.getDate();
    let week = Math.ceil(day / 7);

    const ordinal = ['1st', '2nd', '3rd', '4th', 'Last'];

    return `${ordinal[week - 1]}`;
  }

  const displayTime = option => {
    pickerVal[0] = option;
    setPickerVal(pickerVal);
    displayGraphRadio(radioValue[0]);
    //console.log(pickerVal);
    //console.log('LOOP??' + pickerVal);
  };

  const getDataRadio = value => {
    radioValue[0] = value['label'];
    setRadioValue(radioValue);
    displayGraphRadio(radioValue[0]);
    //console.log(radioValue);
  };

  //store the ip_address
  const storeIp_address = ip_address => {
    RPI_ip_address = ip_address;
    setRPI_IpAddress(RPI_ip_address);

    var InsertAPIURL = `${BASE_URL}/check_ip.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      ip_address: RPI_ip_address,
    };

    return fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].Message);
        //console.log(response[0].Message);
        if (response[0].Data != null) {
          //console.log(response[0].Message);
        }
        return response;
      })
      .catch(error => {
        console.log(`Store IP Address error ${error}`);
        throw error;
      });
    //navigation.navigate('Password');
  };

  const displayGraph = (Val, rpi, sensor) => {
    //console.log(pickerVal);
    if (Val == 'Minute') {
      return getData(rpi, sensor, 'minute(datetime)');
    } else if (Val == 'Hour') {
      return getData(rpi, sensor, 'hour(datetime)');
    } else if (Val == 'Week') {
      return getData(rpi, sensor, 'week(datetime)');
    } else if (Val == 'Month') {
      return getData(rpi, sensor, 'month(datetime)');
    }
  };

  const displayGraphRadio = radioVal => {
    if (radioVal == 'Summary') {
      displayGraph(pickerVal[0], rpiInfo.rpi_id, '0');
      //console.log(rpiInfo.rpi_id);
    } else if (radioVal == sensorInfo.sensor1) {
      displayGraph(pickerVal[0], '0', 'Sensor 1');
    } else if (radioVal == sensorInfo.sensor2) {
      displayGraph(pickerVal[0], '0', 'Sensor 2');
    } else if (radioVal == sensorInfo.sensor3) {
      displayGraph(pickerVal[0], '0', 'Sensor 3');
    } else if (radioVal == sensorInfo.sensor4) {
      displayGraph(pickerVal[0], '0', 'Sensor 4');
    }
  };

  const logout = () => {
    setIsLoading(true);

    var InsertAPIURL = `${BASE_URL}/logout.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpiInfo.rpi_id,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].Message);
        console.log(response[0].Message);
        if (response[0].Data != null) {
          console.log(response[0].Data);
          AsyncStorage.removeItem('rpiInfo');
          setRpiInfo({});
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log(`logout error ${error}`);
        setIsLoading(false);
      });
  };

  const getData = (rpi, sensor, time) => {
    //console.log(rpiInfo.rpi_id);

    var InsertAPIURL = `${BASE_URL}/pc_data.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpi, //rpiInfo.rpi_id
      sensor_no: sensor,
      time: time,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].power_consumption);
        console.log(response[0].power_consumption);

        var dataPC = [];
        var dataTime = [];
        var status = [];
        //console.log(response[0].Message);

        for (let x = response[0].power_consumption.length - 1; x >= 0; x--) {
          let datetime =
            response[0].power_consumption[x]['datetime'].split(' ');
          let dateOnly = datetime[0];

          let timeOnly = datetime[1].slice(0, 8);

          if (time == 'minute(datetime)') {
            dataPC.push(
              String(
                parseFloat(
                  response[0].power_consumption[x]['sum(power_consumption)'],
                ) / 1000,
              ),
            );

            //converting to minutes
            let converted = tConvert(timeOnly);
            let splitConverted = converted.split(':');
            let modifiedTime =
              splitConverted[0] +
              ':' +
              splitConverted[1] +
              converted.slice(-2, converted.length); //ex. 3AM

            dataTime.push(modifiedTime);
          } else if (time == 'hour(datetime)') {
            dataPC.push(
              String(
                parseFloat(
                  response[0].power_consumption[x]['sum(power_consumption)'],
                ) / 1000,
              ),
            );

            //converting to hours
            let converted = tConvert(timeOnly);
            let splitConverted = converted.split(':');
            let modifiedTime =
              splitConverted[0] + converted.slice(-2, converted.length); //ex. 3AM
            dataTime.push(modifiedTime);
          } else if (time == 'week(datetime)') {
            dataPC.push(
              String(
                parseFloat(
                  response[0].power_consumption[x]['sum(power_consumption)'],
                ) / 1000,
              ),
            );

            //converting to weeks
            let converted = dayNameConvert(dateOnly); //ex. mon
            dataTime.push(converted);
          } else if (time == 'month(datetime)') {
            dataPC.push(
              String(
                parseFloat(
                  response[0].power_consumption[x]['sum(power_consumption)'],
                ) / 1000,
              ),
            );

            //converting to month
            var objDate = new Date(dateOnly);
            var strDate = objDate.toLocaleString('en', {month: 'short'}); // {month:'long'}
            let splitedDate = strDate.split(' ');
            //console.log(splitedDate[1]);
            dataTime.push(splitedDate[1]);
          }

          status.push(
            response[0].power_consumption[x][
              'sum(power_consumption_anomaly_score)'
            ],
          );
        }

        //console.log(status);

        if (dataPC.length > 0 || dataTime.length > 0) {
          var newData = [];

          for (let i = 0; i < dataPC.length; i++) {
            //newData.push(parseFloat(data[i][0].slice(0, -3))); no decimal
            newData.push(parseFloat(dataPC[i]));

            if (parseInt(status[i]) != 0) {
              getCurrentStatus.push('Anomaly');
            } else {
              getCurrentStatus.push('Normal');
            }
          }
          setGetCurrentStatus(getCurrentStatus);

          pcInfo = newData;
          setPCInfo(pcInfo);
          //console.log(pcInfo);

          timeInfo = dataTime;
          setTimeInfo(timeInfo);

          //console.log(pcInfo);
          //console.log(timeInfo);
        } else {
          pcInfo = [0];
          setPCInfo(pcInfo);
          //console.log(pcInfo);

          timeInfo = [''];
          setTimeInfo(timeInfo);
          //console.log(timeInfo);
        }

        currentStatus = getCurrentStatus;
        setCurrentStatus(currentStatus);

        getCurrentStatus = [];
        setGetCurrentStatus(getCurrentStatus);
      })
      .catch(error => {
        toast.show('Network Connection Error.', {
          type: 'normal',
          placement: 'bottom',
          duration: 2000,
          offset: 30,
          animationType: 'slide-in | zoom-in',
        });
        console.log(`getting data error ${error}`);
      });
  };

  const getDataUsage = time => {
    //console.log(rpiInfo.rpi_id);

    var InsertAPIURL = `${BASE_URL}/get_data_usage.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpiInfo.rpi_id, //
      time: time,
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
        console.log(response[0].Summary.length);
        //console.log(response[0].Usage[0]);
        if (response[0].Summary.length <= 0) {
          var dataUsage = null;

          //console.log(dataUsage);
          if (time == 'day') {
            todayUsage = dataUsage;
            setTodayUsage(todayUsage);
            //return todayUsage;
          } else if (time == 'week') {
            weekUsage = dataUsage;
            setWeekUsage(weekUsage);

            //return weekUsage;
          } else if (time == 'month') {
            monthUsage = dataUsage;
            setMonthUsage(monthUsage);

            //return monthUsage;
          }
        } else {
          var Summary = parseFloat(
            response[0].Summary[0]['sum(power_consumption)'],
          );
          var dataUsage = response[0].Usage;

          var usagelength = dataUsage.length;

          for (let x = 0; x < usagelength; x++) {
            dataUsage[x]['Percentage'] = String(
              (
                (parseFloat(dataUsage[x]['sum(power_consumption)']) / Summary) *
                100
              ).toFixed(2),
            ); //adding the usage percentage
            dataUsage[x]['Total'] = String(Summary);
            dataUsage[x]['id'] = String(x);
          }

          //console.log(dataUsage);
          if (time == 'day') {
            todayUsage = dataUsage;
            setTodayUsage(todayUsage);
            //return todayUsage;
          } else if (time == 'week') {
            weekUsage = dataUsage;
            setWeekUsage(weekUsage);

            //return weekUsage;
          } else if (time == 'month') {
            monthUsage = dataUsage;
            setMonthUsage(monthUsage);

            //return monthUsage;
          }
          //console.log(todayUsage);
        }
      })
      .catch(error => {
        console.log(`getting data error ${error}`);
      });
  };

  const getDataInfoUsage = (time, sensor) => {
    //console.log(rpiInfo.rpi_id);

    var InsertAPIURL = `${BASE_URL}/get_info_usage.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      sensor: sensor, //
      time: time,
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

          if (time == 'day') {
            dataInfoUsage.push(
              parseFloat(dataUsage[x]['sum(power_consumption)']) / 1000,
            );

            let converted = tConvert(timeOnly);
            let splitConverted = converted.split(':');
            let modifiedTime =
              splitConverted[0] + converted.slice(-2, converted.length); //ex. 3AM
            dataTimeUsage.push(modifiedTime);
            //console.log(modifiedTime);
          } else if (time == 'week') {
            dataInfoUsage.push(
              parseFloat(dataUsage[x]['sum(power_consumption)']) / 1000,
            );

            let converted = dayNameConvert(dateOnly); //ex. mon
            dataTimeUsage.push(converted);
            //console.log(modifiedTime);
          } else if (time == 'month') {
            dataInfoUsage.push(
              parseFloat(dataUsage[x]['sum(power_consumption)']) / 1000,
            );
            dataTimeUsage.push(weekOfTheMonth(dateOnly));
            //console.log(weekOfTheMonth(dateOnly));
          }

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

  const getAnomalyData = (sort, date, rows, sensor) => {
    //console.log(rpiInfo.rpi_id);

    var InsertAPIURL = `${BASE_URL}/anomaly_list.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpiInfo.rpi_id, //rpiInfo.rpi_id
      sort: sort,
      date: date,
      rows: rows,
      sensor: sensor,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].power_consumption);
        //console.log(response[0]);
        if (response[0].Anomaly.length <= 0) {
          //change this to <=
          anomalyData = null;
          setAnomalyData(anomalyData);
        } else {
          anomalyData = response[0].Anomaly;
          setAnomalyData(anomalyData);
        }

        //console.log('running?');
        //return anomalyData;
      })
      .catch(error => {
        console.log(`getting data error ${error}`);
      });
  };

  const connectRpi = password => {
    setIsLoading(true);

    //console.log(password);

    var InsertAPIURL = `${BASE_URL}/connect_rpi.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      ip_address: RPI_ip_address,
      password: password,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].Message);
        //console.log(response[0].Message);
        if (response[0].Data != null) {
          let rpiInfo = response[0].Data;
          //console.log(rpiInfo);
          setRpiInfo(rpiInfo);
          AsyncStorage.setItem('rpiInfo', JSON.stringify(rpiInfo));
          setIsLoading(false);
          //getData();
        }
      })
      .catch(error => {
        console.log(`connection error ${error}`);
        setIsLoading(false);
      });
  };

  //const sensorName = (rpi_id, s1, s2, s3, s4) => {
  const sensorName = (rpi_id, s1, s2, s4) => {
    setIsLoading(true);

    //console.log(password);

    var InsertAPIURL = `${BASE_URL}/sensor_names.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpi_id,
      sensor1: s1,
      sensor2: s2,
      //sensor3: s3,
      sensor4: s4,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].Message);
        //console.log(response[0].Message);
        if (response[0].Data != null) {
          let sensorInfo = response[0].Data;
          //console.log(sensorInfo);
          setSensorInfo(sensorInfo);
          AsyncStorage.setItem('sensorInfo', JSON.stringify(sensorInfo));
          setIsLoading(false);
          //getData();
        }
      })
      .catch(error => {
        console.log(`connection error ${error}`);
        setIsLoading(false);
      });
  };

  const checkingData = rpi_id => {
    setIsLoading(true);

    //console.log(password);

    var InsertAPIURL = `${BASE_URL}/check_data.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpi_id,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].Message);
        //console.log(response[0].Message);
        //console.log(response[0].Sensor4);
        /*
        if(response[0].Message.Sensor1 == "Active"){

        }
        */
        var dataNeeded = 18000;
        if (
          parseInt(response[0].Sensor1) >= dataNeeded &&
          parseInt(response[0].Sensor2) >= dataNeeded &&
          //parseInt(response[0].Sensor3) >= dataNeeded &&
          parseInt(response[0].Sensor4) >= dataNeeded
        ) {
          let dataProgressStatus = true;
          //console.log(dataProgressStatus);
          setDataProgressStatus(dataProgressStatus);
          AsyncStorage.setItem(
            'dataProgressStatus',
            JSON.stringify(dataProgressStatus),
          );
          setIsLoading(false);

          //dataProgressStatus = true;
          //setDataProgressStatus(dataProgressStatus);
        } else {
          s1Status = (parseFloat(response[0].Sensor1) / dataNeeded).toFixed(2);
          setS1Status(s1Status);
          s2Status = (parseFloat(response[0].Sensor2) / dataNeeded).toFixed(2);
          setS2Status(s2Status);
          //s3Status = (parseFloat(response[0].Sensor3)/ dataNeeded).toFixed(2);
          s4Status = (parseFloat(response[0].Sensor4) / dataNeeded).toFixed(2);
          setS4Status(s4Status);
        }
        //console.log(s1Status);
        //console.log(s2Status);
        //console.log(s3Status);
        //console.log(s4Status);
      })
      .catch(error => {
        console.log(`connection error ${error}`);
        setIsLoading(false);
      });
  };

  const isConnectedIn = async () => {
    try {
      setSplashLoading(true);

      let rpiInfo = await AsyncStorage.getItem('rpiInfo');
      rpiInfo = JSON.parse(rpiInfo);

      if (rpiInfo) {
        setRpiInfo(rpiInfo);
      }

      let sensorInfo = await AsyncStorage.getItem('sensorInfo');
      sensorInfo = JSON.parse(sensorInfo);

      if (sensorInfo) {
        setSensorInfo(sensorInfo);
      }

      let dataProgressStatus = await AsyncStorage.getItem('dataProgressStatus');
      dataProgressStatus = JSON.parse(dataProgressStatus);

      if (dataProgressStatus) {
        setDataProgressStatus(dataProgressStatus);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is rpi connection in error ${e}`);
    }
  };

  // getting data in second
  const detectAnomaly = () => {
    var InsertAPIURL = `${BASE_URL}/collect_data.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpiInfo.rpi_id,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].Message);
        //console.log(response[0].Message);

        var data = response[0].data;

        if (data.length > 0) {
          if (data[0][2] == 'Anomaly') {
            if (lastAnomalyTime != data[0][0].slice(0, 19)) {
              anomalyNotification(data[0][1], data[0][0].slice(0, 19));
              lastAnomalyTime = data[0][0].slice(0, 19);
              setLastAnomalyTime(lastAnomalyTime);
              console.log('Anomaly Detected');
            }
          }
        }
      })
      .catch(error => {
        console.log(`getting data error ${error}`);
      });
  };

  const anomalyNotification = (pc, time) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.

      /* iOS and Android properties */
      //id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: 'Anomaly Detected', // (optional)
      message: `With the power comsumption of ${pc} at ${time}`, // (required)
    });
  };

  useEffect(() => {
    //isLoggedIn();
    isConnectedIn();
    //displayGraphRadio(radioValue[0]);
    //detectAnomaly();
    //getData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        timeInfo,
        pcInfo,

        splashLoading,
        pickerVal,
        radioValue,

        rpiInfo,
        ipAddress,
        lastAnomalyTime,
        currentStatus,
        RPI_ip_address,

        anomalyData,

        todayUsage,
        weekUsage,
        monthUsage,

        infoUsage,
        timeUsage,
        dotUsage,

        sensorInfo,

        dataProgressStatus,
        s1Status,
        s2Status,
        //s3Status,
        s4Status,

        storeIp_address,
        logout,
        getData,
        getDataUsage,
        getAnomalyData,
        getDataInfoUsage,

        displayTime,
        getDataRadio,

        displayGraph,
        displayGraphRadio,

        connectRpi,
        anomalyNotification,
        detectAnomaly,

        sensorName,

        checkingData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
