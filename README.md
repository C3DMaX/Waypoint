# Waypoint
AR Application that overlays a waypoint/marker in 3D space over your devices camera

### Feature Status
- **Location:** Waypoint fetches your Location for MapView and Navigation functionality
- **Heading:** Waypoint checks your Heading in Navigation mode to determine if you are walking in the right direction
- **AR & 3D Waypoint:** Waypoint does not currently display the Destination Waypoint in the Camera Screen, instead, Device Heading, Destination Heading and Distance to Destination are Displayed in Text form at the top of CameraView
## Running Waypoint:
Waypoint is built using [expo.io](https://expo.io). To run it, either clone this repository into a directory on a machine with the required software to use Expo and run 
```sh
npm install
expo start
```
along with a mobile device and the [Expo companion app](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) to run a live preview. 
Alternatively download the latest .apk file from the "Releases" and run directly on an Android Device.
