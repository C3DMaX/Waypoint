import React from 'react';
import {Constants, Camera, FileSystem, Permissions} from 'expo';
import {StyleSheet, Text, View, Alert, TouchableOpacity, Slider, Platform, Button} from 'react-native';
import {createStackNavigator, createAppContainer} from "react-navigation";


const flash = {off:'torch',torch:'off'};
//todo: torch on/off icon logic and icon assets

  class CamScreen extends React.Component {

    static navigationOptions = {
      header: null,
    };

  state = {
    //todo: camera prop defaults
    camPermission: null,
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

  renderCamera = () =>
    (
      <Camera style={styles.camera} type={this.state.type} ratio={this.state.ratio} autoFocus={this.state.autoFocus}>
        <View style={styles.buttoncontainer}><Button onPress={() => this.props.navigation.navigate('menu')} title="Menu"></Button></View>
      </Camera>
    )

  nopermissionreminder = () => <Text> No Permission to use camera! </Text>

  render() {
      const {navigate} = this.props.navigation;
      const viewfinder = this.state.camPermission
        ? this.renderCamera()
        : this.nopermissionreminder();
      //todo: create no permission screen or message!
      return <View style={styles.container}>{viewfinder}</View>;


  }
}

//************************** MENU SCREEN ***********************************

class WaypointMenu extends React.Component {
  static navigationOptions = {
    title: 'Waypoint Menu',
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Waypoint Menu</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    cam: CamScreen,
    menu: WaypointMenu
  },
  {
    initialRouteName: "cam"
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    backgroundColor: '#fff'
  },
  camera: {
    flex:1,
  },
  buttoncontainer: {
    position:'absolute',
    bottom:5,
    right:5,
    margin:5,
  },
});

export default createAppContainer(AppNavigator);
