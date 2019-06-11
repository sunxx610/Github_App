import React, {Component} from 'react';
import {Provider} from 'react-redux'
import AppNavigator from './navigator/AppNavigator'
import store from './store'

type Props = {};
export default class App extends Component<Props> {
  render() {
    /*pass store to AppNavigator component*/
    return <Provider store={store}>
      <AppNavigator/>
    </Provider>;
  }
}
