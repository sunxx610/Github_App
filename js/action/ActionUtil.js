import Types from "./types";

export function handleData(actionType, dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data) {
    if(Array.isArray(data.data)){
      fixItems = data.data;
    }else if(Array.isArray(data.data.items)){
      fixItems = data.data.items;
    }
  }
  dispatch({
    type: actionType,
    items: fixItems,
    projectMode: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),//first application data
    storeName,
    pageIndex: 1
  })
}