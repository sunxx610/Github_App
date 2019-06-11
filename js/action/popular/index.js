import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'


import {handleData} from '../ActionUtil'
/*action creator*/

/*get popular data async action
* @param storeName: android,ios,react
* @param url
* @param pageSize: how many lists of data/page
* */
export function onRefreshPopular(storeName, url, pageSize) {
  return dispatch => {
    dispatch({
      type: Types.POPULAR_REFRESH,
      storeName: storeName
    });
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORAGE.flag_popular)//async data fetch
      .then(data => {
        handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize)
      })
      .catch(error => {
        console.error(error);
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
          storeName,
          error
        })
      })
  }
}

/*get more popular data async action
* @param storeName: android,ios,react
* @param pageIndex: page number
* @param pageSize: how many lists of data/page
* @param dataArray: original data
* @param callBack: Unusual information, no more data
* */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callBack) {
  return dispatch => {
    setTimeout(() => {//simulate web application
      if ((pageIndex - 1) * pageSize >= dataArray.length) {//have loaded all data
        if (typeof callBack === 'function') {
          callBack('No more data.')
        }
        dispatch({
          type: Types.POPULAR_LOAD_MORE_FAIL,
          error: 'No more data',
          storeName: storeName,
          pageIndex: --pageIndex,
          projectMode: dataArray
        })
      } else {
        //how many lists of data can be loaded
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        dispatch({
          type: Types.POPULAR_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectMode: dataArray.slice(0, max)
        })
      }
    }, 500)
  }
}
