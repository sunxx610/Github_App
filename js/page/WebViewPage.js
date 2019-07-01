import React, {Component} from 'react';
import {WebView, StyleSheet, TouchableOpacity, View, DeviceInfo} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";

type Props = {};
export default class WebViewPage extends Component<Props> {
  constructor(props) {
    super(props);
    /*get url and title from navigation*/
    this.params = this.props.navigation.state.params;
    const {title,url} = this.params;
    this.state = {
      title: title,
      url: url,
      canGoBack: false,//true: go back; false: go up level
    };
    /*!use arrow function avoid this.onBackPress() execute immediate*/
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
  }

  /*Android hardware back button*/

  /*add BackHandler listener */
  componentDidMount() {
    this.backPress.componentDidMount();
  }

  /*remove BackHandler listener */
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress() {
    this.onBack();
    return true;
  };

  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  /*detect url change*/
  onNavigationStateChange(navState) {
    //console.log('navState', navState);
    /*if can go back &get url*/
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }

  render() {
    const {theme} = this.params;
    /*if detail page title too long, add paddingRight*/
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      title={this.state.title}
      style={theme.styles.navBar}
    />;
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
});
