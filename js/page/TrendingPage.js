import React, {Component} from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  RefreshControl,
  Text,
  DeviceInfo,
  DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux'
import {createMaterialTopTabNavigator} from 'react-navigation'
import {createAppContainer} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


import NavigationUtil from '../navigator/NavigationUtil'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

/*emit event type*/
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
/*GitHub search URL*/
const URL = 'https://github-trending-api.now.sh/repositories?language=';
/*GitHub search URL sort by stars*/
/*create favoriteDao class with popular flag*/
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

type Props = {};
const pageSize = 10; //constant


class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preLanguages = [];
    this.state = {
      timeSpan: TimeSpans[0]
    }
  }

  /*generate top navigation bars dynamically*/
  _genTabs() {
    const tabs = {};
    const {languages,theme} = this.props;
    this.preLanguages = languages;
    languages.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          /*!!!!!important:arrow function is used to transport props*/
          screen: props => <TrendingTabPage
            {...props}
            timeSpan={this.state.timeSpan.searchText}
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

  renderTitleView() {
    return <View>
      <TouchableOpacity
        underlayColor='transparent'
        onPress={() => this.dialog.show()}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 18,
              color: '#FFFFFF',
              fontWeight: '400'
            }}
          >Trending {this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }

  onSelectTimeSpan(tab) {
    /*tab=TimeSpan{showText,searchText}*/
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab
    });
    /*emit event when time span changed*/
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }

  renderTrendingDialog() {
    /*ref: pass TrendingDialog component to this.dialog*/
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTimeSpan(tab)}
    />
  }

  _tabNav() {
    const {theme} = this.props;
    /*optimize: don't render topic tab bar when change time span*/
    if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preLanguages, this.props.languages)) {
      /*Top Tab navigation*/
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
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
          lazy:true//lazy load tabs
        }
      ));
    }
    return this.tabNav;
  }

  render() {
    const {languages,theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    /*page title & top status bar*/
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;
    const TabNavigator = languages.length ? this._tabNav() : null;

    return (
      /*fit full screen phones*/
      <View style={styles.container}>
        {/*status bar & trending page title*/}
        {navigationBar}
        {/*topic tab*/}
        {TabNavigator && <TabNavigator/>}
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  /*language reducer's keys*/
  languages: state.language.languages,
  theme: state.theme.theme,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(TrendingPage);

class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
    this.isFavoriteChanged = false;//detect if favorite changed in favorite page
  }

  componentDidMount() {
    this.loadData();
    /*initial listener*/
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      /* console.log('timespan',timeSpan)*/
      this.timeSpan = timeSpan;
      this.loadData();
    });
    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    })
  }

  /*remove listener*/
  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  /*if(loadMore) execute load more, or execute refresh*/
  loadData(loadMore, refreshFavorite) {
    const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('No more data...')
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
    }
    else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
    }

  }

  genFetchUrl(key) {
    /*console.log('url11111111111111',URL + key.toLowerCase() + '&' + this.timeSpan)*/
    return URL + key.toLowerCase() + '&' + this.timeSpan.searchText;
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.props;
    return <TrendingItem
      theme={theme}
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
    />
  }

  /*get data related to current page*/
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        item: [],
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
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.name)}
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
            console.log('-------onEndReached--------');

            console.log('-------this.canLoadMore--------');
            console.log(this.canLoadMore);
            /*setTimeout is used to solve the problem: if(this.canLoadMore){}execute before onMonentumScrollBegin and caused this.canLoadMore is undefined*/
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
                console.log('-------this.canLoadMore--------');
                console.log(this.canLoadMore)
              }
            }, 100)
          }}
          onEndReachedThreshold={.4}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;//fix init page call onEndReached function
            console.log('-------onMomentumScrollBegin--------');
            console.log('-------this.canLoadMore--------');
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
  trending: state.trending
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, item, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, item, favoriteDao, callBack)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

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
