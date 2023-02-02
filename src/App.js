import React, {Component} from "react";
import {Button} from 'react-bootstrap';
import './App.css';
import { Amplify, PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { MqttOverWSProvider } from "@aws-amplify/pubsub/lib/Providers";
import { CONNECTION_STATE_CHANGE, ConnectionState } from '@aws-amplify/pubsub';
import { Hub } from 'aws-amplify';
import awsconfig from './aws-exports';


Amplify.configure({
  Auth: {
    identityPoolId: "us-west-2:18954031-af59-4a4b-bc93-d696f281f81c",
    region: "us-west-2",
    userPoolId: "us-west-2_eUimgA7jM",
    userPoolWebClientId: "1i8165ohvip3gjcql01cv4dvut"
  }
});

/*Amplify.addPluggable(new MqttOverWSProvider({
  //aws_pubsub_region: "us--west-2",
  aws_pubsub_endpoint: "wss://a387vttjfd7bvs-ats.iot.us-west-2.amazonaws.com/mqtt",
}));*/

Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: 'us-west-2',
  aws_pubsub_endpoint: 'a387vttjfd7bvs-ats.iot.us-west-2.amazonaws.com/mqtt',
}));


export default function App() {
  PubSub.configure();

  Hub.listen('pubsub', data => {
    const { payload } = data;
    if (payload.event === CONNECTION_STATE_CHANGE) {
      const connectionState = payload.data.connectionState;
      console.log(connectionState);
    }
  });

  const fetchRecentData = () => {
    // Retrieve recent data from some sort of data storage service
  };
  
  let priorConnectionState = ConnectionState;
  
  Hub.listen("pubsub", data => {
    const { payload } = data;
    if (
      payload.event === CONNECTION_STATE_CHANGE
    ) {
     
      if (priorConnectionState === ConnectionState.Connecting && payload.data.connectionState === ConnectionState.Connected) {
        fetchRecentData();
      }
      priorConnectionState = payload.data.connectionState;
    }
  });
  
  PubSub.subscribe('test').subscribe({
    next: data => console.log('Message received', data)
  });

  /*const sub1 = PubSub.subscribe('test').subscribe({
    next: data => console.log('Message received', data),
    error: error => console.error(error),
    close: () => console.log('Done'),
  });

  sub1.unsubscribe();

  PubSub.publish('test', { msg: 'Hello to all subscribers!' });*/
  
  const handleSubmit = async () => {
    console.log("before")
    await PubSub.publish('/test', { msg: 'Hello to all subscribers!' });
    console.log("after")
  };

  return (
    <div className="App">
      <Button onClick={handleSubmit}>Click to send messgae</Button>
    </div>
  );
}

/*function clickMe() {
  alert("Clicked!")
}

const AWS = require('aws-sdk');
const AWSIoTData = require('aws-iot-device-sdk');

let awsConfig = {
  identityPoolId: "us-west-2:18954031-af59-4a4b-bc93-d696f281f81c",
  mqttEndpoint: "a387vttjfd7bvs-ats.iot.us-west-2.amazonaws.com",
  region: "us--west-2",
  clientId: "1i8165ohvip3gjcql01cv4dvut",
  userPoolId: "us-west-2_eUimgA7jM"
};

const mqttClient = AWSIoTData.device({
  region: awsConfig.region,
  host: awsConfig.mqttEndpoint,
  clientId: awsConfig.clientId,
  protocol: 'https',
  maximumReconnectTimeMs: 8000,
  debug: false,
  accessKeyId: '',
  secretKey: '',
  sessionToken: ''
});

AWS.config.region = awsConfig.region;

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsConfig.identityPoolId
});

AWS.config.credentials.get((err) => {
    if (err) {
        console.log(AWS.config.credentials);
        throw err;
    } else {
        mqttClient.updateWebSocketCredentials(
            AWS.config.credentials.accessKeyId,
            AWS.config.credentials.secretAccessKey,
            AWS.config.credentials.sessionToken
        );
    }
});

mqttClient.on('connect', () => {
  console.log('mqttClient connected')
  mqttClient.subscribe('test')
});

mqttClient.on('error', (err) => {
  console.log('mqttClient error:', err)
});

mqttClient.on('message', (topic, payload) => {
  const msg = JSON.parse(payload.toString());
  console.log('mqttClient message: ', msg);
});

function App() {
  return (
    <div>
      <Button onClick={clickMe}>Button</Button>
    </div>
)
}*/
