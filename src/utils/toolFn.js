const toolFn = {
  scrollToAnchor(anchorName, needFocus) {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName)
      if (anchorElement) {
        anchorElement.scrollIntoView({
          behavior: "smooth"
        })
      }
      if (needFocus) { anchorElement.focus() }
    }
  },
  debounce: function (func, wait, immediate) {
    var timeout,
      args,
      context,
      timestamp,
      result

    var later = function () {
      var last = Date.now() - timestamp

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) {
            context = args = null
          }
        }
      }
    }

    return function () {
      context = this
      args = arguments
      timestamp = Date.now()
      var callNow = immediate && !timeout
      if (!timeout) {
        timeout = setTimeout(later, wait)
      }
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }

      return result
    }
  },
  throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function () {
      var now = new Date().getTime();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
    };
    return throttled;
  },
  onMouseOverPic: function (value, e) {
    e.stopPropagation();
    const { target } = e
    const { left, right, top, bottom, height } = target.getBoundingClientRect()
    const positionLeft = window.innerWidth - right <= 300 ? left - 320 : right + 20
    const positionTop = window.innerHeight - bottom <= 300 ? top - 250 : bottom <= 300 ? top : top - height / 2
    toolFn.removeHoverImg()
    const body = document.body
    const div = document.createElement("img");
    div.setAttribute("id", "magnify__pic");
    div.setAttribute("src", value);
    div.setAttribute("style", `position:absolute;left:${positionLeft}px;top:${positionTop}px;z-index:1234;width: 300px;height: 300px;background: transparent;`);
    body.append(div)
  },
  onMouseLeavePic: function () {
    toolFn.removeHoverImg()
  },
  removeHoverImg: function () {
    const body = document.body
    const node = document.getElementById('magnify__pic')
    node && body.removeChild(node)
  },
  timeStampFormatter: function (ts) {
    if (!ts) { return '' }
    if (typeof ts === 'string') { return ts }
    const d = new Date(ts)
    const ydm = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(el => String(el).padStart(2, 0)).join('-')
    const hms = [d.getHours(), d.getMinutes(), d.getSeconds()].map(el => String(el).padStart(2, 0)).join(':')
    return ydm + ' ' + hms
  },
  toMap: function (arr, key, val) {
    let map = {}
    for (var i = 0, len = arr.length; i < len; i++) {
      var item = arr[i]
      map[item[key]] = item[val]
    }
    return map
  }
}

export default toolFn