import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  RefreshControl,
  Text,
  DeviceInfo,
  TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux'
import {createMaterialTopTabNavigator} from 'react-navigation'
import {createAppContainer} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationUtil from '../navigator/NavigationUtil'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

/*GitHub search URL*/
const URL = 'https://api.github.com/search/repositories?q=';
/*GitHub search URL sort by stars*/
const QUERY_STR = '&sort=stars';
/*create favoriteDao class with popular flag*/
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

type Props = {};
const pageSize = 10;//constant

class PopularPage extends Component<Props> {
  constructor(props) {
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }

  /*generate top navigation bars dynamically*/
  _genTabs() {
    const tabs = {};
    const {keys, theme} = this.props;
    /*this.props={navigation,screenpProps:undefined}*/
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          /*!!!!!important:arrow function is used to transport props*/
          screen: props => <PopularTabPage
            {...props}
            tabLabel={item.name}
            theme={theme}
          />,
          navigationOptions: {
            title: item.name
          }
        }
      }
    });
    return tabs;
  }

  renderRightButton() {
    const {theme} = this.props;
    return <TouchableOpacity
      onPress={() => {
        NavigationUtil.goPage({theme}, 'SearchPage')
      }}
    >
      <View style={{padding: 5, marginRight: 8}}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white',
          }}/>
      </View>
    </TouchableOpacity>
  }

  render() {
    const {keys, theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    /*tab title & status bar*/
    let navigationBar = <NavigationBar
      title={'Popular'}
      statusBar={statusBar}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />;

    /*Top Tab navigation*/
    const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,//enable lower case letter
          scrollEnabled: true,//enable scroll
          style: {
            backgroundColor: theme.themeColor,//background color
            height: 30//fix enable scrollEnable caused tabBar flash oversize in first time load
          },
          indicatorStyle: styles.indicatorStyle,//indicator styles
          labelStyle: styles.labelStyle,//label styles
        },
        lazy: true//lazy load tabs
      }
    )) : null;
    return (
      /*fit full screen phones*/
      <View style={styles.container}>
        {navigationBar}
        {TabNavigator && <TabNavigator/>}
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  /*language reducer's keys*/
  keys: state.language.keys,
  theme: state.theme.theme
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);

class PopularTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;//tab name
    this.isFavoriteChanged = false;//detect if favorite changed in favorite page
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  /*if(loadMore) execute load more, or execute refresh*/
  loadData(loadMore, refreshFavorite) {
    /*this.props={navigation,onLoadMorePopular,onRefreshPopular,popular,screenProps,tabLabel}*/
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props;
    const store = this._store();//popular[storeName]
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('No more data...')
      })
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
    }
    else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }

  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.props;
    return <PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />
  }

  /*get data related to current page*/
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        item: [],//all data
        isLoading: false,
        projectModels: [],//data need to be displayed
        hideLoadingMore: true
      }
    }
    return store
  }

  genIndicator() {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>Loading more...</Text>
      </View>
  }

  render() {
    const {theme} = this.props;
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}//display data
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.item.id}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            /*solve loading multiple times problem*/
            console.log('-------onEndReached--------')

            console.log('-------this.canLoadMore--------')
            console.log(this.canLoadMore)
            /*setTimeout is used to solve the problem: if(this.canLoadMore){}execute before onMonentumScrollBegin and caused this.canLoadMore is undefined*/
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
                console.log('-------this.canLoadMore--------')
                console.log(this.canLoadMore)
              }
            }, 100)
          }}
          onEndReachedThreshold={.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;//fix init page call onEndReached function
            console.log('-------onMomentumScrollBegin--------')
            console.log('-------this.canLoadMore--------')
            console.log(this.canLoadMore)
          }}
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
  popular: state.popular,
});
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, item, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, item, favoriteDao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

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
