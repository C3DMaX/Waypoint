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
    ratio:'16:9',
    autoFocus:'on',
    type:'back',
  }

//check for camera Permissions

  async componentWillMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({camPermission: status === 'granted'});
  }

//get supported viewfinder ratios

  getRatios = async ()  => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };


//todo: implement camera as function

  renderCamera = () =>
    (
      <View style={{flex:1}}>
        <Camera ref={ref=> {this.camera =ref}}
          style={styles.camera}
          type={this.state.type}
          autoFocus={this.state.autoFocus}
          ratio={this.state.ratio}>
        </Camera>
      </View>
    )

    nopermissionreminder = () => <Text> No Permission to use camera!</Text>

  render() {
      const viewfinder = this.state.camPermission
        ? this.renderCamera()
        : this.nopermissionreminder();
      //todo: check permission status and call camera function if permission is granted
      return <View style={styles.container}>{viewfinder}</View>;


  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex:1,
    justifyContent:'space-between',
  }
});
