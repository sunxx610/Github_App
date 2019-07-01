export default class Utils {
  /**
   * check if item has been added to favorite
   * @param item
   * @param keys: favorite item's keys(id or name-author)
   * */
  static checkFavorite(item, keys = []) {
    if (!keys) return false;
    for (let i = 0, len = keys.length; i < len; i++) {
      let id = item.id ? item.id.toString() : item.name + '-' + item.author;
      if (id === keys[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * check if key is in keys
   * @param keys
   * @param key
   */
  static checkKeyIsExist(keys, key) {
    for (let i = 0, l = keys.length; i < l; i++) {
      console.log(key.toLowerCase(),keys[i].name.toLowerCase())
      if (key.toLowerCase() === keys[i].name.toLowerCase()) return true;
    }
    return false;
  }
}

