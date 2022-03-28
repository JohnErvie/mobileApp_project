import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {BASE_URL} from '../config';
import { Alert } from "react-native";


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  var [timeInfo, setTimeInfo] = useState([""]);
  var [pcInfo, setPCInfo] = useState([0]); // pc = power consumption
  var [pickerVal, setPickerVal] = useState(["Second"]);

  //const [globalInfo, setGlobalInfo] = useState({});
  const [rpiInfo, setRpiInfo] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  var [ipAddress, setIpAddress] = useState("");

  const displayTime = (option) =>{
    pickerVal[0] = option;
    
    setPickerVal(pickerVal);
    //console.log(pickerVal);
  }

  const displayGraph = (Val) =>{
    //console.log(pickerVal);
    if(Val == "Second"){
      return getData_sec();
    }
    else if(Val == "Minute"){
      return getData_min();
    }
    else if(Val == "Hour"){
      return getData_hr();
    }
  }

  const register = (name, email, password) => {
    setIsLoading(true);

    if(name.length == null || email.length == null || password.length == null ){
      Alert.alert("Error","Missing Required Field!");
    }
    else{
      var InsertAPIURL = `${BASE_URL}/insert.php`;

      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      var Data={
        name: name,
        email: email,
        password: password
      };

      fetch(InsertAPIURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
      })
      .then((response)=>response.json())
      .then((response)=>
        {
          alert(response[0].Message);
          let userInfo = response[0].Data;
          setUserInfo(userInfo);
          AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          setIsLoading(false);
          console.log(userInfo.status);
          //getData();
        })
      .catch((error)=>{
        console.log(`register error ${error}`);
        setIsLoading(false);
        })
      
    }
  };

  const login = (email, password) => {
    setIsLoading(true);

    var InsertAPIURL = `${BASE_URL}/search.php`;

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    var Data={
      email: email,
      password: password
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data)
    })
    .then((response)=>response.json())
    .then((response)=>
      {
        alert(response[0].Message);
        console.log(response[0].Message);
        if(response[0].Data != null){
          let userInfo = response[0].Data;
          console.log(userInfo);
          setUserInfo(userInfo);
          AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          setIsLoading(false);
          //getData();            
        }
      })
    .catch((error)=>{
      console.log(`login error ${error}`);
      setIsLoading(false);
      })
      
    
  };

  const logout = () => {
    setIsLoading(true);

    
    var InsertAPIURL = `${BASE_URL}/logout.php`;

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    var Data={
      email: userInfo.email,
      password: userInfo.password
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
        console.log(response[0].Message);
        if(response[0].Data != null){
          console.log(response[0].Data);
          AsyncStorage.removeItem('userInfo');
          AsyncStorage.removeItem('rpiInfo');
          setUserInfo({});
          setRpiInfo({});
          setIsLoading(false);            
        }
      })
    .catch((error)=>{
      console.log(`logout error ${error}`);
      setIsLoading(false);
      })
  };

  // getting data in second
  const getData_sec = () => {
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
        
        if(dataPC.length > 0 || dataTime.length > 0){ 
          var newData = [];
          for (let i = dataPC.length - 1; i >= 0; i--) {
            //newData.push(parseFloat(data[i][0].slice(0, -3))); no decimal
            newData.push(parseFloat(dataPC[i][0]));
          }
          pcInfo = newData;
          setPCInfo(pcInfo);
          //console.log(pcInfo);  
          
          
          var newData = [];
          for (let i = 0; i < dataTime.length; i++) {
            newData.push(dataTime[i][0].slice(0,8));
          }
          timeInfo = newData;
          setTimeInfo(timeInfo);
          //console.log(timeInfo);
        }
        else{
          pcInfo = [0];
          setPCInfo(pcInfo);
          //console.log(pcInfo);

          timeInfo = [""];
          setTimeInfo(timeInfo);
          //console.log(timeInfo);
        }

        
      })
    .catch((error)=>{
      console.log(`getting data error ${error}`);
      })
  };

  // getting data in minutes
  const getData_min = () => {
    var InsertAPIURL = `${BASE_URL}/pc_data_min.php`;

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
        
        if(dataPC.length > 0 || dataTime.length > 0){ 
          var newDataPC = [];
          var newDataMin = [];
          

          var curMin = dataTime[0][0].slice(0,5); //save the first value of Minute
          var curPC = 0;

          for(let i = 0; i < dataTime.length; i++){
            if (dataTime[i][0].slice(0,5) == curMin){
              curPC += parseFloat(dataPC[i][0]);

              if (i == dataTime.length - 1){ // save the remaining seconds
                newDataMin.push(curMin); // save the current minute before changing
                newDataPC.push(curPC);
              }
              
            }
            else{
              //console.log(i);
              //reset
              newDataMin.push(curMin); // save the current minute before changing
              newDataPC.push(curPC);
              curMin = dataTime[i][0].slice(0,5);
              curPC = 0;
              curPC += parseFloat(dataPC[i][0]);
            }
          }
          

          pcInfo = newDataPC;
          setPCInfo(pcInfo);
          //console.log(pcInfo); 

          timeInfo = newDataMin;
          setTimeInfo(timeInfo);
          //console.log(timeInfo);
        }
        else{
          pcInfo = [0];
          setPCInfo(pcInfo);
          //console.log(pcInfo);

          timeInfo = [""];
          setTimeInfo(timeInfo);
          //console.log(timeInfo);
        }

        
      })
    .catch((error)=>{
      console.log(`getting data error ${error}`);
      })
  };

  // getting data in hours
  const getData_hr = () => {
    var InsertAPIURL = `${BASE_URL}/pc_data_hr.php`;

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
        if(dataPC.length > 0 || dataTime.length > 0){ 
          var newDataPC = [];
          var newDataMin = [];
          

          var curHr = dataTime[0][0].slice(0,2); //save the first value of Minute
          var curPC = 0;

          for(let i = 0; i < dataTime.length; i++){
            if (dataTime[i][0].slice(0,2) == curHr){
              curPC += parseFloat(dataPC[i][0]);
              
              if (i == dataTime.length - 1 ){ // save the remaining seconds
                newDataMin.push(curHr); // save the current minute before changing
                newDataPC.push(curPC);
              }

            }
            else{
              //console.log(i);
              newDataMin.push(curHr); // save the current minute before changing
              newDataPC.push(curPC);
              curHr = dataTime[i][0].slice(0,2);
              curPC = 0;
              curPC += parseFloat(dataPC[i][0]);
            }
          }
          

          pcInfo = newDataPC;
          setPCInfo(pcInfo);
          //console.log(pcInfo); 

          timeInfo = newDataMin;
          setTimeInfo(timeInfo);
          //console.log(timeInfo);
        }
        else{
          pcInfo = [0];
          setPCInfo(pcInfo);
          //console.log(pcInfo);

          timeInfo = [""];
          setTimeInfo(timeInfo);
          //console.log(timeInfo);
        }

        
      })
    .catch((error)=>{
      console.log(`getting data error ${error}`);
      })
  };

  const connectRpi = (ip_address, user_id) => {
    setIsLoading(true);

    ipAddress = ip_address;
    setIpAddress(ipAddress);
    console.log(ipAddress);

    var InsertAPIURL = `${BASE_URL}/connect_rpi.php`;

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    var Data={
      ip_address: ip_address,
      user_id: user_id,
    };

    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data)
    })
    .then((response)=>response.json())
    .then((response)=>
      {
        alert(response[0].Message);
        console.log(response[0].Message);
        if(response[0].Data != null){
          let rpiInfo = response[0].Data;
          console.log(rpiInfo);
          setRpiInfo(rpiInfo);
          AsyncStorage.setItem('rpiInfo', JSON.stringify(rpiInfo));
          setIsLoading(false);
          //getData();            
        }
      })
    .catch((error)=>{
      console.log(`connection error ${error}`);
      setIsLoading(false);
      })
      
    
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
        register,
        login,
        logout,
        getData_sec,
        getData_min,
        getData_hr,
        displayTime,
        displayGraph,
        connectRpi,
      }}>
      {children}
    </AuthContext.Provider>
  );
};