import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {BASE_URL} from '../config';
import {Alert} from 'react-native';
import PushNotification from 'react-native-push-notification';

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
        console.log(`logout error ${error}`);
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
    } else if (Val == 'Month') {
      return getData(rpi, sensor, 'month(datetime)');
    }
  };

  const displayGraphRadio = radioVal => {
    if (radioVal == 'Summary') {
      displayGraph(pickerVal[0], rpiInfo.rpi_id, '0');
      //console.log(rpiInfo.rpi_id);
    } else if (radioVal == 'Sensor 1') {
      displayGraph(pickerVal[0], '0', 'Sensor 1');
    } else if (radioVal == 'Sensor 2') {
      displayGraph(pickerVal[0], '0', 'Sensor 2');
    } else if (radioVal == 'Sensor 3') {
      displayGraph(pickerVal[0], '0', 'Sensor 3');
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
        //console.log(response[0].power_consumption.length);

        var dataPC = [];
        var dataTime = [];
        var status = [];
        //console.log(response[0].Message);
        for (let x = response[0].power_consumption.length - 1; x >= 0; x--) {
          dataPC.push(
            response[0].power_consumption[x]['sum(power_consumption)'],
          );
          dataTime.push(response[0].power_consumption[x][time]);
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
        //console.log(response[0].Usage[0]);

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
        } else if (time == 'week') {
          weekUsage = dataUsage;
          setWeekUsage(weekUsage);
        } else if (time == 'month') {
          monthUsage = dataUsage;
          setMonthUsage(monthUsage);
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
        console.log(response[0].Usage[0]);

        /*
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
        } else if (time == 'week') {
          weekUsage = dataUsage;
          setWeekUsage(weekUsage);
        } else if (time == 'month') {
          monthUsage = dataUsage;
          setMonthUsage(monthUsage);
        }
        */
      })
      .catch(error => {
        console.log(`getting data error ${error}`);
      });
  };

  const getAnomalyData = () => {
    //console.log(rpiInfo.rpi_id);

    var InsertAPIURL = `${BASE_URL}/anomaly_list.php`;

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var Data = {
      rpi_id: rpiInfo.rpi_id, //rpiInfo.rpi_id
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        //alert(response[0].power_consumption);
        //console.log(response[0].Anomaly[0]);
        anomalyData = response[0].Anomaly;
        setAnomalyData(anomalyData);
        //console.log('running?');
        //return anomalyData;
      })
      .catch(error => {
        console.log(`getting data error ${error}`);
      });
  };

  const connectRpi = password => {
    setIsLoading(true);

    console.log(password);

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
        alert(response[0].Message);
        console.log(response[0].Message);
        if (response[0].Data != null) {
          let rpiInfo = response[0].Data;
          console.log(rpiInfo);
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

  const isConnectedIn = async () => {
    try {
      setSplashLoading(true);

      let rpiInfo = await AsyncStorage.getItem('rpiInfo');
      rpiInfo = JSON.parse(rpiInfo);

      if (rpiInfo) {
        setRpiInfo(rpiInfo);
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
        console.log(`2hellogetting data error ${error}`);
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
    displayGraphRadio(radioValue[0]);
    detectAnomaly();
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
      }}>
      {children}
    </AuthContext.Provider>
  );
};
