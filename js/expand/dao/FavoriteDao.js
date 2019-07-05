import AsyncStorage from '@react-native-community/async-storage';

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }

  /*save Favorite item
  * @param key: item id
  * @param value: item
  * @param callback
  * */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, true);//update Favorite key
      }
    })
  }

  /*update favorite key
  * @param key: item id
  * @param isAdd: true->add false->remove
  * */
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {//if add key && key is not existed
          if (index === -1) favoriteKeys.push(key);
        } else {//if remove key && key is existed
          if (index !== -1) favoriteKeys.splice(index, 1);
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
      }
    })
  }

  /*get popular/trending keys
  * @return {Promise}
  * */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e)
          }
        } else {
          reject(error)
        }
      })
    })
  }

  /*remove favorite item
  * @param key: item id
  * */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, false)
      }
    })
  }

  /*get all favorite items
  * @return {Promise}
  * */
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys()
        .then(keys => {
          let items = [];
          if (keys) {
            AsyncStorage.multiGet(keys, (err, stores) => {
              try {
                stores.map((result, i, store) => {
                  //get at each store's key/value
                  let key = store[i][0];
                  let value = store[i][1];
                  if (value) items.push(JSON.parse(value))
                });
                resolve(items);
              } catch (e) {
                reject(e)
              }
            })
          } else {
            resolve(items)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
}