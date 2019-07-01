import React, {Component} from 'react';
import {FlatList, StyleSheet, ActivityIndicator, View, RefreshControl, Text, DeviceInfo} from 'react-native';
import {connect} from 'react-redux'
import {createMaterialTopTabNavigator} from 'react-navigation'
import {createAppContainer} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'

import NavigationUtil from '../navigator/NavigationUtil'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventTypes from "../util/EventTypes";

/*create favoriteDao class with popular flag*/
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

type Props = {};

class FavoritePage extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    /*tab title & status bar*/
    let navigationBar = <NavigationBar
      title={'Popular'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;

    /*Top Tab navigation*/
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
        'Popular': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme}/>,
          navigationOptions: {
            title: 'Popular'
          }
        },
        'Trending': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme}/>,
          navigationOptions: {
            title: 'Trending'
          }
        }
      },
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,//enable lower case letter
          style: {
            backgroundColor: theme.themeColor,//background color
            height: 30//fix enable scrollEnable caused tabBar flash oversize in first time load
          },
          indicatorStyle: styles.indicatorStyle,//indicator styles
          labelStyle: styles.labelStyle,//label styles
        }
      }
    ));
    return (
      /*fit full screen phones*/
      <View style={{flex: 1, marginTop: DeviceInfo.isIphoneX_deprecated ? 30 : 0}}>
        {navigationBar}
        <TabNavigator/>
      </View>
    );
  }
}
const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme,
});
export default connect(mapFavoriteStateToProps)(FavoritePage);

class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;//tab name
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      /*if to favorite page, refresh without show loading*/
      if (data.to === 2) {
        this.loadData(false)
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  /*if(loadMore) execute load more, or execute refresh*/
  loadData(isShowLoading) {
    /*this.props={navigation,onLoadMorePopular,onRefreshPopular,popular,screenProps,tabLabel}*/
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
    }
  }

  renderItem(data) {
    const {theme} = this.props;
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <Item
      theme={theme}
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: this.storeName,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />
  }

  /*get data related to current page*/
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        item: [],//all data
        isLoading: false,
        projectModels: [],//data need to be displayed
      }
    }
    return store
  }

  render() {
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}//display data
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.name)}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={theme.themeColor}
            />
          }
        />
        <Toast
          ref={'toast'}
          position={'center'}
        />
      </View>
    );
  }
}

/*link popular to props*/
const mapStateToProps = state => ({
  favorite: state.favorite
});
const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isLoading) => dispatch(actions.onLoadFavoriteData(storeName, isLoading))
});
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    //minWidth: 50,// fix minWidth cause lag in android
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});
