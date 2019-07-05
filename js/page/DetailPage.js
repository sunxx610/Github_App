import React, {Component} from 'react';
import {WebView, StyleSheet, TouchableOpacity, View, DeviceInfo} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";
import ShareUtil from "../util/ShareUtil";

const TRENDING_URL = 'https://github.com';
type Props = {};
export default class DetailPage extends Component<Props> {
  constructor(props) {
    super(props);
    /*get url and title from navigation*/
    //console.log('projectModels',this.props.navigation.state.params)
    //console.log('detail page props', this.props)
    this.params = this.props.navigation.state.params;
    const {projectModel, flag} = this.params;//flag:identify popular or trending
    this.favoriteDao = new FavoriteDao(flag);
    this.url = projectModel.item.html_url || projectModel.item.url || TRENDING_URL + projectModel.item.name;
    const title = projectModel.item.full_name || projectModel.item.name;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,//true: go back; false: go up level
      isFavorite: projectModel.isFavorite
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

  onFavoriteButtonClick() {
    const {projectModel, callback} = this.params;
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
    /*callback by click PopularItem or TrendingItem
    * execute when FavoriteButton was clicked
    * (isFavorite)=>{ this.setFavoriteState(isFavorite)}
    * */
    callback(isFavorite);
    this.setState({
      isFavorite: isFavorite
    });
    let key = projectModel.item.id ? projectModel.item.id.toString() : projectModel.item.name + '-' + projectModel.item.author;
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
    } else {
      this.favoriteDao.removeFavoriteItem(key)
    }
  }


  renderRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => this.onFavoriteButtonClick()}
        >
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{color: 'white', marginRight: 10}}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => this.shareUtil.onOpen())}
      </View>
    )
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
      titleLayoutStyle={titleLayoutStyle}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />;
    return (
      <SafeAreaViewPlus
        topColor={theme.themeColor}
      >
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
        <ShareUtil
          ref={shareUtil => this.shareUtil = shareUtil}
        />
      </SafeAreaViewPlus>
    );
  }
}
