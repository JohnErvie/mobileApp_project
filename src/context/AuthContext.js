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
  var [pickerVal, setPickerVal] = useState(['Second']);
  var [lastAnomalyTime, setLastAnomalyTime] = useState();
  var [currentStatus, setCurrentStatus] = useState([]);
  var [getCurrentStatus, setGetCurrentStatus] = useState([]);
  var [RPI_ip_address, setRPI_IpAddress] = useState(null);

  //const [globalInfo, setGlobalInfo] = useState({});
  const [rpiInfo, setRpiInfo] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  var [ipAddress, setIpAddress] = useState('');

  const displayTime = option => {
    pickerVal[0] = option;

    setPickerVal(pickerVal);
    //console.log(pickerVal);
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

  const displayGraph = Val => {
    //console.log(pickerVal);
    if (Val == 'Second') {
      return getData_sec();
    } else if (Val == 'Minute') {
      return getData_min();
    } else if (Val == 'Hour') {
      return getData_hr();
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

  // getting data in second
  const getData_sec = () => {
    //console.log(rpiInfo.rpi_id);

    var InsertAPIURL = `${BASE_URL}/pc_data.php`;

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

        var dataPC = response[0].power_consumption;
        var dataTime = response[0].time;
        var status = response[0].status;

        if (dataPC.length > 0 || dataTime.length > 0) {
          var newData = [];

          for (let i = dataPC.length - 1; i >= 0; i--) {
            //newData.push(parseFloat(data[i][0].slice(0, -3))); no decimal
            newData.push(parseFloat(dataPC[i][0]));

            if (status[i][0] == 'Anomaly') {
              getCurrentStatus.push('Anomaly');
            } else {
              getCurrentStatus.push('Normal');
            }
          }
          setGetCurrentStatus(getCurrentStatus);

          pcInfo = newData;
          setPCInfo(pcInfo);
          //console.log(pcInfo);

          var newData = [];
          for (let i = 0; i < dataTime.length; i++) {
            newData.push(dataTime[i][0].slice(6, 8));
          }
          timeInfo = newData;
          setTimeInfo(timeInfo);
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

  // getting data in minutes
  const getData_min = () => {
    var InsertAPIURL = `${BASE_URL}/pc_data_min.php`;

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

        var dataPC = response[0].power_consumption;
        var dataTime = response[0].time;
        var status = response[0].status;
        //var message = response[0].Message;
        var curStatus = 0;

        if (dataPC.length > 0 || dataTime.length > 0) {
          var newDataPC = [];
          var newDataMin = [];

          var curMin = dataTime[0][0].slice(3, 5); //save the first value of Minute
          var curPC = 0;

          for (let i = 0; i < dataTime.length; i++) {
            if (dataTime[i][0].slice(3, 5) == curMin) {
              curPC += parseFloat(dataPC[i][0]);

              if (status[i][0] == 'Anomaly') {
                curStatus = 1;
              }

              if (i == dataTime.length - 1) {
                // save the remaining seconds
                newDataMin.push(curMin); // save the current minute before changing
                newDataPC.push(curPC);

                if (curStatus == 1) {
                  getCurrentStatus.push('Anomaly');
                } else {
                  getCurrentStatus.push('Normal');
                }
              }
            } else {
              //console.log(i);
              //reset

              if (curStatus == 1) {
                getCurrentStatus.push('Anomaly');
              } else {
                getCurrentStatus.push('Normal');
              }
              curStatus = 0;

              newDataMin.push(curMin); // save the current minute before changing
              newDataPC.push(curPC);
              curMin = dataTime[i][0].slice(3, 5);
              curPC = 0;
              curPC += parseFloat(dataPC[i][0]);
            }
          }
          setGetCurrentStatus(getCurrentStatus);

          pcInfo = newDataPC;
          setPCInfo(pcInfo);
          //console.log(pcInfo);

          timeInfo = newDataMin;
          setTimeInfo(timeInfo);
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

  // getting data in hours
  const getData_hr = () => {
    var InsertAPIURL = `${BASE_URL}/pc_data_hr.php`;

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

        var dataPC = response[0].power_consumption;
        var dataTime = response[0].time;
        var status = response[0].status;

        var curStatus = 0;

        if (dataPC.length > 0 || dataTime.length > 0) {
          var newDataPC = [];
          var newDataMin = [];

          var curHr = dataTime[0][0].slice(0, 2); //save the first value of Minute
          var curPC = 0;

          for (let i = 0; i < dataTime.length; i++) {
            if (dataTime[i][0].slice(0, 2) == curHr) {
              curPC += parseFloat(dataPC[i][0]);

              if (status[i][0] == 'Anomaly') {
                curStatus = 1;
              }

              if (i == dataTime.length - 1) {
                // save the remaining seconds
                newDataMin.push(curHr); // save the current minute before changing
                newDataPC.push(curPC);
              }

              if (curStatus == 1) {
                getCurrentStatus.push('Anomaly');
              } else {
                getCurrentStatus.push('Normal');
              }
            } else {
              //console.log(i);

              if (curStatus == 1) {
                getCurrentStatus.push('Anomaly');
              } else {
                getCurrentStatus.push('Normal');
              }
              curStatus = 0;

              newDataMin.push(curHr); // save the current minute before changing
              newDataPC.push(curPC);
              curHr = dataTime[i][0].slice(0, 2);
              curPC = 0;
              curPC += parseFloat(dataPC[i][0]);
            }
          }
          setGetCurrentStatus(getCurrentStatus);

          pcInfo = newDataPC;
          setPCInfo(pcInfo);
          //console.log(pcInfo);

          timeInfo = newDataMin;
          setTimeInfo(timeInfo);
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

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
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
    isLoggedIn();
    isConnectedIn();
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
        rpiInfo,
        ipAddress,
        lastAnomalyTime,
        currentStatus,
        RPI_ip_address,
        storeIp_address,
        logout,
        getData_sec,
        getData_min,
        getData_hr,
        displayTime,
        displayGraph,
        connectRpi,
        anomalyNotification,
        detectAnomaly,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
