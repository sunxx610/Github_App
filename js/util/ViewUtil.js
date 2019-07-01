import React from 'react'
import {TouchableOpacity, View, Text,StyleSheet} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {
  /**items for setting page
   * @param callBack: click item trigger callback
   * @param text
   * @param color
   * @param Icons: react-native-vector-icons component
   * @param icon: icon name
   * @param expandableIcon: right side icon
   * @return {XML}
   * */
  static getSettingItem(callBack, text, color, Icons, icon, expandableIcon) {
    return (
      <TouchableOpacity
        onPress={callBack}
        style={styles.settling_item_container}
      >
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          {Icons && icon ?
            <Icons
              name={icon}
              size={16}
              style={{color: color, marginRight: 10}}
            /> : <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>//if icon not existed, empty Placeholder
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
          size={16}
          style={{marginRight: 10, alignSelf: 'center', color: color || 'black'}}
        />
      </TouchableOpacity>
    )
  }

  /**items for menu page
   * @param callBack: click item trigger callback
   * @param menu @MORE_MENUE
   * @param color
   * @param expandableIcon: right side icon
   * @return {XML}
   * */
  static getMenuItem(callBack, menu, color, expandableIcon) {
    return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIcon)
  }

  /**get left back button
   * @param callBack
   * @return {XML}
   * */
  static getLeftBackButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8, paddingLeft: 12}}
      onPress={callBack}
    >
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color: 'white'}}
      />
    </TouchableOpacity>
  }


  /**
   * get right text button
   * @param title
   * @param callBack
   * @returns {XML}
   * */
  static getRightButton(title,callBack){
    return <TouchableOpacity
      style={{alignItems:'center'}}
      onPress={callBack}
    >
      <Text style={{fontSize:20,color:'#FFFFFF',marginRight:10}}>{title}</Text>
    </TouchableOpacity>
  }


  /**get share button
   * @param callBack
   * @return {XML}
   * */
  static getShareButton(callBack) {
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={callBack}
    >
      <Ionicons
        name={'md-share'}
        size={26}
        style={{opacity: .9, marginRight: 10, color: 'white'}}
      />
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  settling_item_container: {
    backgroundColor: 'white',
    paddingRight: 10,
    paddingLeft:20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});