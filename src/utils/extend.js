/* eslint-disable no-extend-native */
(function () {
  Object.defineProperty(String.prototype, 'trimMultiLine', {
    enumerable: false,
    value: function () {
      return this.replace(/ *[\r|\n] */gm, '')
    }
  })
})()