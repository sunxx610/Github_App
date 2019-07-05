import React, {Component} from 'react';
import {Provider} from 'react-redux'
import AppNavigator from './navigator/AppNavigator'
import store from './store'
import {AppState} from 'react-native';

import {Auth, Analytics,awsconfig}from './util/AnalyticsUtil'

type Props = {};
export default class App extends Component<Props> {
  componentDidMount(){
    AppState.addEventListener('change',this.onAppStateChange);
  }
  onAppStateChange(appState){
    if(appState==='active'){
      console.log('tracking event: foreground');
      Analytics.record({
        name: 'applicantion foreground'
      })
    }
  }
  render() {
    /*pass store to AppNavigator component*/
    return <Provider store={store}>
      <AppNavigator/>
    </Provider>;
  }
}
