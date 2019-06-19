import React from 'react';
import {Constants, Camera, FileSystem, Permissions, Location, MapView, Marker} from 'expo';
import {StyleSheet, Text, View, Alert, TouchableOpacity, Slider, Platform, Button} from 'react-native';
import {createStackNavigator, createAppContainer} from "react-navigation";

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

const flash = {off:'torch',torch:'off'};
var loc_global = {coords: { latitude: 37.78825, longitude: -122.4324}};
//todo: torch on/off icon logic and icon assets

  class CamScreen extends React.Component {

    static navigationOptions = {
      header: null,
    };

  state = {
    //todo: camera prop defaults
    Permissions: null,
    ratios:[],
    ratio:'16:9',
    autoFocus:'on',
    type:'back',
  }

  _getLocationAsync = async () => {
    loc_global = await Location.getCurrentPositionAsync({});
  };

  async componentWillMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA, Permissions.LOCATION);
    this.setState({Permissions: status === 'granted'});
  }

  componentDidMount() {
    this._getLocationAsync();
  }

  renderCamera = () =>
    (
      <Camera style={styles.camera} type={this.state.type} ratio={this.state.ratio} autoFocus={this.state.autoFocus}>
        <View style={styles.buttoncontainer}><Button onPress={() => this.props.navigation.navigate('menu')} title="Menu"></Button></View>
      </Camera>
    )

  nopermissionreminder = () =>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Camera and/or Location Permission missing</Text>
    </View>

  render() {
      const viewfinder = this.state.Permissions
        ? this.renderCamera()
        : this.nopermissionreminder();
      //todo: style no permission screen or message!
      return <View style={styles.container}>{viewfinder}</View>;


  }
}

//************************** MENU SCREEN ***********************************

class WaypointMenu extends React.Component {
  static navigationOptions = {
    title: 'Waypoint Menu',
  };

  state = {
  };

  _getLocationAsync = async () => {
    loc_global = await Location.getCurrentPositionAsync({});
 };

 async componentWillMount() {
   //this._getLocationAsync();
 }


  render() {
    return (
      <MapView style={styles.map} onPress={e => console.log(e.nativeEvent)} showsMyLocationButton={true} loadingEnabled={true} showsUserLocation={true} region={
            {
              latitude: loc_global.coords.latitude,
              longitude: loc_global.coords.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.005,
            }
          }
        />
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
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default createAppContainer(AppNavigator);
