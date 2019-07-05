import React, {Component} from 'react'
import {ViewPropTypes, Text, StatusBar, StyleSheet, View, Platform,DeviceInfo} from 'react-native'
import {PropTypes} from 'prop-types'

const NAV_BAR_HEIGHT_IOS = 44;//ios nav bar height
const NAV_BAR_HEIGHT_ANDROID = 50;//android nav bar height
const STATUS_BAR_HEIGHT = DeviceInfo.isIphoneX_deprecated ? 0 : 20;//status bar height


20;//ios status bar height. android has default height
const StatusBarShape = {//set status bar's attribute
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string
};

export default class NavigationBar extends Component {
  //types check
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element
  };
  //set default props
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false
    }
  };

  render() {
    let statusBar = !this.props.statusBar.hidden ?
      <View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar} />
      </View> : null;

    let titleView = this.props.titleView ? this.props.titleView :
      /*elaipsizeMode: set ... if content to long*/
      <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>;

    let content = this.props.hide ? null :
      <View style={styles.navBar}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>;
    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    )
  }

  getButtonElement(data) {
    return (
      <View style={styles.navBarButton}>
        {data ? data : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#2196f3',
      zIndex:2
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID
    },
    navBarTitleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 40,
      right: 40,
      top: 0,
      bottom: 0
    },
    navBarButton: {
      alignItems: 'center'
    },
    title: {
      fontSize: 20,
      color: 'white'
    },
    statusBar: {
      height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0
    }
  })
;