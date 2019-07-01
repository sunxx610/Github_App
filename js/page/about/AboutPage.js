import React, {Component} from 'react';
import {View, Linking} from 'react-native';

import {MORE_MENU} from "../../common/MORE_MENU";
import ViewUtil from "../../util/ViewUtil";
import NavigationUtil from "../../navigator/NavigationUtil";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import config from "../../res/data/config"
import GlobalStyles from "../../res/styles/GlobalStyles";

type Props = {};

export default class AboutPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about,
    }, data => this.setState({...data}));
    this.state = {
      data: config,
    };
  };

  onClick(menu) {
    const {theme} = this.params;
    let RouteName, params = {theme};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = 'Tutorial';
        params.url = 'http://rushisun.com';
        break;
      case MORE_MENU.Feedback:
        /*feedback target email*/
        const url = 'mailto://sunxx610@gmail.com';
        /*detect if user device can open eMail app
        * url: boolean*/
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log('Can\'t handle url: ' + url);
            } else {
              Linking.openURL(url);
            }
          })
          .catch(e => {
              console.error('An error occurred: ', e)
            }
          );
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }

  getItem(menu) {
    const {theme} = this.params;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
  }

  render() {
    const content = <View>
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.Feedback)}
    </View>;
    return this.aboutCommon.render(content, this.state.data.app);
  }
}

