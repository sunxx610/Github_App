import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

import {_projectModels,handleData}  from '../ActionUtil'


/*action creator*/

/**get popular data async action
* @param storeName: android,ios,react
* @param url
* @param pageSize: how many lists of data/page
* */
export function onRefreshTrending(storeName, url, pageSize,favoriteDao) {
  return dispatch => {
    dispatch({
      type: Types.TRENDING_REFRESH,
      storeName: storeName
    });
    let dataStore = new DataStore();
    dataStore.fetchData(url)//async data fetch
      .then(data => {
        handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize,favoriteDao,Types.TRENDING_LOAD_MORE_FAIL)
      })
      .catch(error => {
        console.error(error);
        dispatch({
          type: Types.TRENDING_REFRESH_FAIL,
          storeName,
          error
        })
      })
  }
}

/**get more popular data async action
* @param storeName: android,ios,react
* @param pageIndex: page number
* @param pageSize: how many lists of data/page
* @param dataArray: original data
* @param callBack: Unusual information, no more data
* @param favoriteDao:
* */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao,callBack) {
  return dispatch => {
    setTimeout(() => {//simulate web application
      if ((pageIndex - 1) * pageSize >= dataArray.length) {//have loaded all data
        if (typeof callBack === 'function') {
          callBack('No more data.')
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          error: 'No more data',
          storeName: storeName,
          pageIndex: --pageIndex,
          projectModels: dataArray
        })
      } else {
        //how many lists of data can be loaded
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max),favoriteDao,projectModels=>{
          dispatch({
            type: Types.TRENDING_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: projectModels
          })
        })
      }
    }, 500)
  }
}

/**refresh favorite status
* @param storeName
* @param pageIndex: current page number
* @param pageSize: how many pieces data per page
* @param dataArray: original data
* @param favoriteDao
* @returns {function(*)}
* */

export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray=[], favoriteDao) {
  return dispatch => {
    let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
      dispatch({
        type: Types.TRENDING_FLUSH_FAVORITE,
        storeName,
        pageIndex,
        projectModels: projectModels
      })
    })
  }
}