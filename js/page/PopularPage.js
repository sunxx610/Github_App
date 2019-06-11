import React, {Component} from 'react';
import {FlatList, Platform, StyleSheet, ActivityIndicator, View, RefreshControl, Text,DeviceInfo} from 'react-native';
import {connect} from 'react-redux'
import {createMaterialTopTabNavigator} from 'react-navigation'
import {createAppContainer} from 'react-navigation'
import Toast from 'react-native-easy-toast'

import NavigationUtil from '../navigator/NavigationUtil'
import DataStore from '../expand/dao/DataStore'
import actions from '../action/index'
import {onRefreshPopular} from "../action/popular"
import PopularItem from '../common/PopularItem'
import NavigationBar from '../common/NavigationBar'

/*GitHub search URL*/
const URL = 'https://api.github.com/search/repositories?q=';
/*GitHub search URL sort by stars*/
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';


type Props = {};
const pageSize = 10;//constant

export default class PopularPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'ios', 'React', 'React Native', 'PHP'];
  }

  /*generate top navigation bars dynamically*/
  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        /*!!!!!important:arrow function is used to transport props*/
        screen: props => <PopularTabPage
          {...props}
          tabLabel={item}
        />,
        navigationOptions: {
          title: item
        }
      }
    });
    return tabs;
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'Popular'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />;

    /*Top Tab navigation*/
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,//enable lower case letter
          scrollEnabled: true,//enable scroll
          style: {
            backgroundColor: THEME_COLOR,//background color
            height:30//fix enable scrollEnable caused tabBar flash oversize in first time load
          },
          indicatorStyle: styles.indicatorStyle,//indicator styles
          labelStyle: styles.labelStyle,//label styles
        }
      }
    ));
    return (
      /*fit full screen phones*/
      <View style={{flex: 1, marginTop: DeviceInfo.isIphoneX_deprecated? 30 : 0}}>
        {navigationBar}
        <TabNavigator/>
      </View>
    );
  }
}

class PopularTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
  }

  /*if(loadMore) execute load more, or execute refresh*/
  loadData(loadMore) {
    const {onRefreshPopular, onLoadMorePopular} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
        this.refs.toast.show('No more data...')
      })
    } else {
      onRefreshPopular(this.storeName, url, pageSize)
    }

  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item
    return <PopularItem
      item={item}
      onSelect={() => {
      }}
    />
  }

  /*get data related to current page*/
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        item: [],
        isLoading: false,
        projectMode: [],//data need to be displayed
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
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectMode}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.id}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
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
          onEndReachedThreshold={.4}
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
  popular: state.popular
});
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize) => dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, item, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, item, callBack))
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
