import {BackHandler} from 'react-native'
/*Android hardware back button compatibility*/
export default class BackPressComponent {
  constructor(props) {
    this._hardwareBackPress = this.onHardwareBackPress.bind(this);
    this.props = props;
  }
  componentDidMount() {
    /*add listener 'hardwareBackPress' to listen hardware back button*/
    if (this.props.backPress) BackHandler.addEventListener('hardwareBackPress',this._hardwareBackPress)
  }

  componentWillUnmount() {
    /*remove listener 'hardwareBackPress'*/
    if (this.props.backPress) BackHandler.removeEventListener('hardwareBackPress',this._hardwareBackPress)
  }

  onHardwareBackPress(e) {
    return this.props.backPress(e);
  }
}