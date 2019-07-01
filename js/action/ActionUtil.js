import Types from "./types";
import ProjectModel from "../model/ProjectModel";
import Utils from "../util/Utils";

/**
 *
 * @param actionType
 * @param dispatch
 * @param storeName which tab
 * @param data original data
 * @param pageSize
 * @param favoriteDao
 * @param failedActionType used to hide load-more icon when there is no enough data in first loading
 * @param params other params want to transfer
 */
export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao, failedActionType, params) {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }
  }
  //first loading data
  let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModels: projectModels,
      storeName,
      pageIndex: 1,
      ...params
    })
  })
    .then(() => {
      if (pageSize >= fixItems.length) {//have loaded all data
        dispatch({
          type: failedActionType,
          storeName: storeName,
          pageIndex: 1,
        })
      }
    })
}

/**
 * add isFavorite or not attribute to each item
 * @param showItems display data(10/page)
 * @param favoriteDao
 * @param callback
 * @return {Promise<void>}
 * @private
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = [];
  try {
    keys = await favoriteDao.getFavoriteKeys();
  } catch (e) {
    console.log(e)
  }
  let projectModels = [];
  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)))
  }
  doCallBack(callback, projectModels);
}

export const doCallBack = (callBack, object) => {
  if (typeof callBack === 'function') {
    callBack(object);
  }
};