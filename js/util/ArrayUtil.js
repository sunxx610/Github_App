export default class ArrayUtil {
  /**
   * update array. if item is in array, remove it, otherwise add it
   * @param array
   * @param item
   * */
  static updateArray(array, item) {
    for (let i = 0, len = array.length; i < len; i++) {
      let temp = array[i];
      if (item === temp) {
        array.splice(i, 1);
        return;
      }
    }
    array.push(item);
  }

  /**
   * remove element from array.
   * @param array
   * @param item item to remove
   * @param id attribute to compare, default is memory address
   * */
  static remove(array, item, id) {
    if (!array) return;
    for (let i = array.length - 1; i >= 0; i--) {
      const val = array[i];
      if (item === val || (val && val[id] && val[id] === item[id])) {
        array.splice(i, 1)
      }
    }
    return array;
  }

  /**
   * compare two arrays if equal
   * @return boolean true length equal and value equal
   * */
  static isEqual(arr1, arr2) {
    if (!(arr1 && arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    for (let i = 0, l = arr1.length; i < l; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  /**
   * clone array
   * @return Array new array
   * */
  static clone(from) {
    if (!from) return [];
    let newArray = [];
    for (let i = 0, l = from.length; i < l; i++) {
      newArray[i] = from[i]
    }
    return true;
  }
}