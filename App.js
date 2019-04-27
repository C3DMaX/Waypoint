import React from 'react';
import {Constants, Camera, FileSystem, Permissions} from 'expo';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Slider, Platform} from 'react-native';


const flash = {off:'torch',torch:'off'};
//todo: torch on/off icon logic and icon assets

export default class App extends React.Component {

  state = {
    //todo: camera prop defaults
    camPermission:false,
    ratios:[],
  }

//check for camera Permissions

  async componentWillMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({camPermission: status === 'granted'});
  }

//get supported viewfinder ratios

  getRatios = async => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  }

//todo: implement camera as function

  render() {
    return (

      //todo: check permission status and call camera function if permission is granted
      <View style={styles.container}>
        <Text>Welcome to Waypoint!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
