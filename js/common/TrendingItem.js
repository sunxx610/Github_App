import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview'

export default class TrendingItem extends Component {
  render() {
    const {item} = this.props;
    if (!item) return null;
    let favoriteButton =
      <TouchableOpacity
        style={{padding: 6}}
        onPress={() => {
        }}
        underlayColor={'transparent'}
      >
        <FontAwesome
          name={'star-o'}
          size={26}
          style={{color: 'red'}}
        />
      </TouchableOpacity>;
        /*p tag is used to add styles in HTMLView*/
        let description = '<p>'+item.description+'</p>';
    return (
      <TouchableOpacity
        onPress={this.props.onSelect}
      >
        <View style={styles.cellContainer}>
          <Text style={styles.title}>{item.fullName}</Text>
          {/*display html in trending page*/}
          <HTMLView
           value={description}
           onLinkPress={url=>{}}
           stylesheet={{
             p:styles.description,
             a:styles.description
           }}
          />
          <Text style={styles.description}>{item.meta}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Contributors: </Text>
              {item.contributors.map((result, i, arr) => {
                return <Image
                  key={i}
                  style={{height: 22, width: 22, margin: 2}}
                  source={{uri: arr[i]}}
                />
              })}
            </View>
            {favoriteButton}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  cellContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: .5,
    borderRadius: 2,
    /*ios shadow*/
    shadowColor: 'gray',
    shadowOffset: {width: .5, height: .5},
    shadowOpacity: .4,
    shadowRadius: 1,
    /*android shadow*/
    elevation: 2
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121'
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575'
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  }
});