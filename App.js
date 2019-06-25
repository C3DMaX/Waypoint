import React from 'react';
import {Constants, Camera, FileSystem, Permissions, Location, MapView} from 'expo';
import {StyleSheet, Text, View, Alert, TouchableOpacity, Slider, Platform, Button, TextInput} from 'react-native';
import {createStackNavigator, createAppContainer, withNavigationFocus, withNavigation} from "react-navigation";
import { getDistance } from 'geolib';

const GEOLOCATION_OPTIONS = { Accuracy: 6, timeInterval: 5000, distanceInterval: 1};
const flash = {off:'torch',torch:'off'};
var loc_global = {coords: { latitude: 37.78825, longitude: -122.4324}};
var waypoint_global = null;
var dist_global = null;
var nav_mode = false;

//************************** CAMERA SCREEN ***********************************

  class CamScreen extends React.Component {

    static navigationOptions = {
      header: null,
    };

  state = {
    Permissions: null,
    ratios:[],
    ratio:'16:9',
    autoFocus:'on',
    type:'back',
    distance:'',
    nav_mode_loc: false,
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
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      if(dist_global != null) {
        var dist_local = "Distance to Waypoint: " + dist_global + "m";
      };
      if(this.state.nav_mode_loc !== nav_mode) {
        this.setState(prevState => ({nav_mode_loc: !prevState.nav_mode_loc}));
        this.setUpNav();
      }
    });
  }

  async setUpNav() {
    const location_sub = await Location.watchPositionAsync(GEOLOCATION_OPTIONS, new_loc => {this.userMoved(new_loc);});

    if(nav_mode == false) {
      location_sub.remove();
      console.log("navigation stopped");
      this.setState( {distance: null});
    }
    else {
      console.log('navigation started');
      var dist_local = "Distance to Waypoint: " + dist_global + "m";
      this.setState( {distance: dist_local});
    }
  }

  userMoved(new_loc) {
    loc_global = new_loc;
    dist_global = getDistance(loc_global.coords,waypoint_global);
    var dist_local = "Distance to Waypoint: " + dist_global + "m";
    this.setState( {distance: dist_local});
    console.log('User moved');
  }

  renderCamera = () =>
    (
      <Camera style={styles.camera} type={this.state.type} ratio={this.state.ratio} autoFocus={this.state.autoFocus}>
        <View style={styles.buttoncontainer}><Button onPress={() => this.props.navigation.navigate('menu')} title="Menu"></Button></View>
        <View style={styles.distancecontainer}><Text style={styles.distancetext}>{this.state.distance}</Text></View>
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
      return <View style={styles.container}>{viewfinder}</View>;
  }

}

//************************** MENU SCREEN ***********************************

class WaypointMenu extends React.Component {
  static navigationOptions = {
    title: 'Waypoint Menu',
  };

  state = {
      markers: [],
      nav_mode_loc: false,
      nav_button_text:'Start Navigation',
      showNavButton: false,
  }

  _getLocationAsync = async () => {
    loc_global = await Location.getCurrentPositionAsync({});
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      if(waypoint_global != null) {
        this.createMarker();
      };
      if(this.state.nav_mode_loc !== nav_mode) {
        this.setState(prevState => ({nav_mode_loc: !prevState.nav_mode_loc}));
        this.updateButtonText();
      }
    });
  }

  updateButtonText() {
    const buttontext = nav_mode
      ? this.setState({nav_button_text : 'Stop Navigation'})
      : this.setState({nav_button_text : 'Start Navigation'});
  }

  setMarker(e) {
    waypoint_global = e.nativeEvent.coordinate;
    this.createMarker();
  }

  createMarker() {
    dist_global = getDistance(loc_global.coords,waypoint_global);
    var dist_local = "Distance: " + dist_global + "m";
    this.setState( { markers: [ {coordinate:waypoint_global, title: "Waypoint", description: dist_local  } ] } );
    this.setState( { showNavButton: true} );
  }

  toggleNavigation() {
    nav_mode = !nav_mode;
    this.setState(prevState => ({nav_mode_loc : !prevState.nav_mode_loc}));
    this.updateButtonText();
    this.props.navigation.navigate('cam');
  }

  async adressToWaypoint(e) {
    var adress = e.nativeEvent.text;
    gc  = await Location.geocodeAsync(adress);
    if(gc.length != 0)
    {
      gc = gc[0];
      delete gc.accuracy;
      delete gc.altitude;
      waypoint_global = gc;
      this.createMarker();
      this.map.animateToCoordinate( { latitude: waypoint_global.latitude, longitude: waypoint_global.longitude }, 1500 );
    }
    else {
      {
        console.log('invalid adress');
      }
    }
  }

  render() {
    const navbutton = this.state.showNavButton
      ? <Button onPress={() => this.toggleNavigation()} title={this.state.nav_button_text}></Button>
      :  <View></View>;
    return (
      <View style={styles.map}>
        <MapView  ref={ref => { this.map = ref; }} style={styles.map} onPress={e => this.setMarker(e)} showsMyLocationButton={true} loadingEnabled={true} showsUserLocation={true}
          initialRegion={ { latitude: loc_global.coords.latitude, longitude: loc_global.coords.longitude, latitudeDelta: 0.002, longitudeDelta: 0.005 } } >
          {this.state.markers.map((marker, index) => { return (<MapView.Marker key={index} {...marker}/>) } ) }
        </MapView>
        <View style={styles.buttoncontainer}>{navbutton}</View>
        <View style={styles.searchboxcontainer}><TextInput onSubmitEditing={e => this.adressToWaypoint(e)} underlineColorAndroid={'lightgray'} style={styles.searchbox} placeholder={'Search'}></TextInput></View>
      </View>

    );
  }

}

//************************** NAVIGATION & STYLES ***********************************

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
  distancecontainer: {
    position:'absolute',
    left:'25%',
    top:'3%',
    width:'50%',
  },
  distancetext: {
    color: 'white',
    fontSize:20,
    textAlign:'center',
    textShadowColor:'black',
    textShadowRadius: 10,
    textShadowOffset: { width: 1, height: 1 },
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchboxcontainer: {
    position:'absolute',
    left:'5%',
    top:'3%',
    width:'90%',
    borderRadius: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4, },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 5,
  },
  searchbox: {
    backgroundColor:'white',
    borderColor:'transparent',
    borderWidth: 5,
    fontSize: 20,
    paddingLeft: 5,
  }
});

export default createAppContainer(AppNavigator);
