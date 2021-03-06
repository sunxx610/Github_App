import AsyncStorage from '@react-native-community/async-storage';
export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};

/*identify get data for popular or trending page*/
export default class DataStore {
  /*
  * get Data main function
  * get local data first. if no data, fetch data from net
  * @param url
  * @returns {Promise}
  * */
  fetchData(url) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then(wrapData => {
          if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData)
          }
          else {
            this.fetchNetData(url)
              .then(data => {
                resolve(this._wrapData(data))
              }).catch(error => {
              reject(error);
            })
          }
        })
        .catch(error => {
          this.fetchNetData(url)
            .then(data => {
              resolve(this._wrapData(data))
            })
            .catch(error => {
              reject(error)
            })
        })
    })
  }

  /*
  * get local data
  * @param url
  * @returns {Promise}
  * */
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            /*JSON.parse(): JSON to Object*/
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(error);
          console.error(error)
        }
      })
    })
  }

  /*
  * get Net Data
  * @param url
  * @returns {Promise}
  * */
  fetchNetData(url) {
      return new Promise((resolve, reject) => {
        fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network no response');
          })
          .then(responseData => {
            this.saveData(url, responseData);
            resolve(responseData)
          })
          .catch(error => {
            reject(error)
          })
      })
  }


  /*save data
  * @param url
  * @param data
  * @param callback
  * */
  saveData(url, data, callback) {
    if (!data || !url) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }

  /*timestamp,in the future get time from server*/
  _wrapData(data) {
    return {data: data, timestamp: new Date().getTime()}
  }

  /*check timestamp available
  * @param timestamp data update time
  * @return {boolean} true: no need update; false: need update
  * */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getFullYear() !== targetDate.getFullYear()) return false;
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    return true;
  }
}
