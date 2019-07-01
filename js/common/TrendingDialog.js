import React, {Component} from 'react'
import {Modal, TouchableOpacity, StyleSheet, View, Text, DeviceInfo} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import TimeSpan from '../model/TimeSpan'

/*trending page time span const*/
export const TimeSpans = [new TimeSpan('today', 'since=daily'), new TimeSpan('this week', 'since=weekly'), new TimeSpan('this month', 'since=monthly')];

export default class TrendingDialog extends Component {
  /*initial state method 1*/
  /* constructor(props) {
     super(props);
     this.state = {
       visible: false,
     }
   }*/
  /*initial state method 2*/
  state = {
    visible: false
  };

  show() {
    this.setState({
      visible: true
    })
  }

  dismiss() {
    this.setState({
      visible: false
    })
  }

  render() {
    const {onClose, onSelect} = this.props;
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => onClose}
      >
        {/*mask for touch to close*/}
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.dismiss()}
        >
          {/*modal arrow up*/}
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />
          <View style={styles.content}>
            {TimeSpans.map((result, i) => {
              return <TouchableOpacity
                onPress={() => onSelect(result)}
                underlayColor='transparent'
                key={i}
              >
                <View style={styles.text_container}>
                  <Text style={styles.text}>{result.showText}</Text>
                </View>
                {/*if not last option, add underline*/}
                {i !== TimeSpans.length - 1 ? <View style={styles.line}/> : null}
              </TouchableOpacity>
            })}
          </View>
        </TouchableOpacity>
      </Modal>)
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.6)',
    flex: 1,
    alignItems: 'center',
    paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3
  },
  text_container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26
  },
  line: {
    height: .3,
    backgroundColor: 'darkgray'
  }
});