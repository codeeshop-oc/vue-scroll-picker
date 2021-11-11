'use strict';function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}// import "./picker.scss"
function debounce(handle, delay) {
  var timeout = null;
  return function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    var self = this;
    var args = arguments;
    timeout = setTimeout(function () {
      return handle.apply(self, args);
    }, delay);
  };
}

function getClientCenterY(elem) {
  var _elem$getBoundingClie = elem.getBoundingClientRect(),
      top = _elem$getBoundingClie.top,
      bottom = _elem$getBoundingClie.bottom;

  return (top + bottom) / 2;
}

function normalizeOptions(options) {
  return options.map(function (option) {
    switch (_typeof(option)) {
      case 'string':
        {
          return {
            value: option,
            name: option
          };
        }

      case 'number':
      case 'boolean':
        {
          return {
            value: option,
            name: "".concat(option)
          };
        }
    }

    return option;
  });
}

function isTouchEvent(event) {
  return event.changedTouches || event.touches;
}

function getEventXY(event) {
  if (isTouchEvent(event)) {
    return event.changedTouches[0] || event.touches[0];
  }

  return event;
}

var ScrollPicker = {
  props: {
    value: null,
    options: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    dragSensitivity: {
      type: Number,
      default: 1.7
    },
    touchSensitivity: {
      type: Number,
      default: 1.7
    },
    scrollSensitivity: {
      type: Number,
      default: 1
    },
    empty: {
      type: String,
      default: 'No Items'
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  data: function data() {
    var _this = this;

    var normalizedOptions = normalizeOptions(this.options);
    var innerIndex = normalizedOptions.findIndex(function (option) {
      return option.value == _this.value;
    });

    if (innerIndex === -1 && !this.placeholder && this.options.length > 0) {
      innerIndex = 0;
    }

    var innerValue = normalizedOptions[innerIndex] && normalizedOptions[innerIndex].value || null;
    return {
      normalizedOptions: normalizedOptions,
      innerIndex: innerIndex,
      innerValue: innerValue,
      top: null,
      pivots: [],
      pivotMin: 0,
      pivotMax: 0,
      transitioning: false,
      transitionTO: null,
      start: null,
      isMouseDown: false,
      isDragging: false,
      scrollOffsetTop: 0,
      scrollMin: 0,
      scrollMax: 0
    };
  },
  mounted: function mounted() {
    this.calculatePivots();
    this.top = this.findScrollByIndex(this.innerIndex);

    if (this.innerValue !== this.value) {
      this.$emit('input', this.innerValue);
    }

    this.$el.addEventListener('touchstart', this.onStart);
    this.$el.addEventListener('touchmove', this.onMove);
    this.$el.addEventListener('touchend', this.onEnd);
    this.$el.addEventListener('touchcancel', this.onCancel);
    this.$el.addEventListener('mousewheel', this.onScroll);
    this.$el.addEventListener('DOMMouseScroll', this.onScroll);
    this.$el.addEventListener('wheel', this.onScroll);
    this.$el.addEventListener('mousedown', this.onStart);
    this.$el.addEventListener('mousemove', this.onMove);
    this.$el.addEventListener('mouseup', this.onEnd);
    this.$el.addEventListener('mouseleave', this.onCancel);
  },
  destroyed: function destroyed() {
    this.$el.removeEventListener('touchstart', this.onStart);
    this.$el.removeEventListener('touchmove', this.onMove);
    this.$el.removeEventListener('touchend', this.onEnd);
    this.$el.removeEventListener('touchcancel', this.onCancel);
    this.$el.removeEventListener('mousewheel', this.onScroll);
    this.$el.removeEventListener('DOMMouseScroll', this.onScroll);
    this.$el.removeEventListener('wheel', this.onScroll);
    this.$el.removeEventListener('mousedown', this.onStart);
    this.$el.removeEventListener('mousemove', this.onMove);
    this.$el.removeEventListener('mouseup', this.onEnd);
    this.$el.removeEventListener('mouseleave', this.onCancel);
  },
  watch: {
    value: function value(_value) {
      if ((_value === null || _value === undefined) && this.placeholder) {
        this.correction(-1);
        return;
      }

      var nextInnerIndex = this.normalizedOptions.findIndex(function (option) {
        return option.value == _value;
      });

      if (nextInnerIndex === -1) {
        this.$emit('input', this.innerValue);
        return;
      }

      if (this.innerIndex !== nextInnerIndex) {
        this.correction(nextInnerIndex);
      }
    },
    options: function options(_options) {
      var _this2 = this;

      var normalizedOptions = this.normalizedOptions = normalizeOptions(_options);
      var internalIndex = normalizedOptions.findIndex(function (option) {
        return option.value == _this2.value;
      });

      if (internalIndex === -1 && !this.placeholder && this.options.length > 0) {
        internalIndex = 0;
      }

      var innerValue = normalizedOptions[internalIndex] && normalizedOptions[internalIndex].value || null;
      this.$nextTick(function () {
        _this2.calculatePivots();

        _this2.top = _this2.findScrollByIndex(internalIndex);
        _this2.innerIndex = internalIndex;

        if (_this2.innerValue !== innerValue) {
          _this2.$emit('input', _this2.innerValue = innerValue);
        }
      });
    }
  },
  methods: {
    resize: function resize() {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.calculatePivots();

        _this3.top = _this3.findScrollByIndex(_this3.innerIndex);
      });
    },
    calculatePivots: function calculatePivots() {
      var rotatorTop = this.$refs.list.getBoundingClientRect().top;
      this.pivots = (this.$refs.items || []).map(function (item) {
        return getClientCenterY(item) - rotatorTop;
      }).sort(function (a, b) {
        return a - b;
      });
      this.pivotMin = Math.min.apply(Math, _toConsumableArray(this.pivots));
      this.pivotMax = Math.max.apply(Math, _toConsumableArray(this.pivots));
      this.scrollOffsetTop = this.$refs.selection.offsetTop + this.$refs.selection.offsetHeight / 2;
      this.scrollMin = this.scrollOffsetTop - this.pivotMin;
      this.scrollMax = this.scrollOffsetTop - this.pivotMax;
    },
    sanitizeInternalIndex: function sanitizeInternalIndex(index) {
      return Math.min(Math.max(index, this.placeholder ? -1 : 0), this.normalizedOptions.length - 1);
    },
    findIndexFromScroll: function findIndexFromScroll(scroll) {
      var _this4 = this;

      var prevDiff = null;
      var pivotIndex = 0;
      this.pivots.forEach(function (pivot, i) {
        var diff = pivot + scroll - _this4.scrollOffsetTop;

        if (prevDiff === null || Math.abs(prevDiff) > Math.abs(diff)) {
          pivotIndex = i;
          prevDiff = diff;
        }
      });

      if (this.placeholder || this.options.length === 0) {
        return pivotIndex - 1;
      }

      return pivotIndex;
    },
    findScrollByIndex: function findScrollByIndex(index) {
      var pivotIndex = index;

      if (this.placeholder || this.options.length === 0) {
        pivotIndex++;
      }

      if (index > -1 && pivotIndex in this.pivots) {
        return this.scrollOffsetTop - this.pivots[pivotIndex];
      }

      if (index >= this.pivots.length) {
        return this.scrollOffsetTop - this.pivotMax;
      }

      return this.scrollOffsetTop - this.pivotMin;
    },
    onScroll: function onScroll(e) {
      if (this.top >= this.scrollMin && e.deltaY < 0) return;
      if (this.top <= this.scrollMax && e.deltaY > 0) return;
      if (this.pivots.length === 1) return;
      e.preventDefault();
      var nextDirInnerIndex = this.sanitizeInternalIndex(this.innerIndex + (e.deltaY > 0 ? 1 : -1));
      var deltaMax = e.deltaY > 0 ? this.findScrollByIndex(nextDirInnerIndex - 1) - this.findScrollByIndex(nextDirInnerIndex) : this.findScrollByIndex(nextDirInnerIndex) - this.findScrollByIndex(nextDirInnerIndex + 1);
      var deltaY = Math.max(Math.min(e.deltaY, deltaMax), deltaMax * -1);
      this.top = Math.min(Math.max(this.top - deltaY * this.scrollSensitivity, this.scrollMax), this.scrollMin);
      var nextInnerIndex = this.sanitizeInternalIndex(this.findIndexFromScroll(this.top));
      var nextInnerValue = this.normalizedOptions[nextInnerIndex] && this.normalizedOptions[nextInnerIndex].value || null;
      this.innerIndex = nextInnerIndex;

      if (this.innerValue !== nextInnerValue) {
        this.$emit('input', this.innerValue = nextInnerValue);
      }

      this.onAfterWheel();
    },
    onAfterWheel: debounce(function () {
      this.correction(this.findIndexFromScroll(this.top));
    }, 200),
    onStart: function onStart(event) {
      if (event.cancelable) {
        event.preventDefault();
      }

      var _getEventXY = getEventXY(event),
          clientY = _getEventXY.clientY;

      this.start = [this.top, clientY];

      if (!isTouchEvent(event)) {
        this.isMouseDown = true;
      }

      this.isDragging = false;
    },
    onMove: function onMove(e) {
      if (e.cancelable) {
        e.preventDefault();
      }

      if (!this.start) {
        return;
      }

      var _getEventXY2 = getEventXY(e),
          clientY = _getEventXY2.clientY;

      var diff = clientY - this.start[1];

      if (Math.abs(diff) > 1.5) {
        this.isDragging = true;
      }

      this.top = this.start[0] + diff * (isTouchEvent(e) ? this.touchSensitivity : this.dragSensitivity);
    },
    onEnd: function onEnd(e) {
      if (e.cancelable) {
        e.preventDefault();
      }

      if (this.isDragging) {
        this.correction(this.findIndexFromScroll(this.top));
      } else {
        this.handleClick(e);
      }

      this.start = null;
      this.isDragging = false;
      this.isMouseDown = false;
    },
    onCancel: function onCancel(e) {
      if (e.cancelable) {
        e.preventDefault();
      }

      this.correction(this.findIndexFromScroll(this.top));
      this.start = null;
      this.isMouseDown = false;
      this.isDragging = false;
    },
    handleClick: function handleClick(e) {
      var touchInfo = getEventXY(e);
      var x = touchInfo.clientX;
      var y = touchInfo.clientY;
      var topRect = this.$refs.top.getBoundingClientRect();
      var bottomRect = this.$refs.bottom.getBoundingClientRect();

      if (topRect.left <= x && x <= topRect.right && topRect.top <= y && y <= topRect.bottom) {
        this.correction(this.innerIndex - 1);
      } else if (bottomRect.left <= x && x <= bottomRect.right && bottomRect.top <= y && y <= bottomRect.bottom) {
        this.correction(this.innerIndex + 1);
      }
    },
    correction: function correction(index) {
      var _this5 = this;

      var nextInnerIndex = this.sanitizeInternalIndex(index);
      var nextInnerValue = this.normalizedOptions[nextInnerIndex] && this.normalizedOptions[nextInnerIndex].value || null;
      this.top = this.findScrollByIndex(nextInnerIndex);
      this.transitioning = true;

      if (this.transitionTO) {
        clearTimeout(this.transitionTO);
        this.transitionTO = null;
      }

      this.transitionTO = setTimeout(function () {
        _this5.transitioning = false;
        _this5.transitionTO = null;
        _this5.innerIndex = nextInnerIndex;

        if (_this5.innerValue !== nextInnerValue) {
          _this5.innerValue = nextInnerValue;

          _this5.$emit('input', _this5.innerValue);
        }
      }, 100);
    }
  },
  render: function render(h) {
    var _this6 = this;

    var items = [];

    if (this.placeholder) {
      items.push(h("div", {
        class: {
          "vue-scroll-picker-item": true,
          "-placeholder": true,
          "-selected": this.innerIndex == -1
        },
        ref: "items",
        refInFor: true,
        domProps: {
          innerHTML: this.placeholder
        }
      }));
    } else if (this.normalizedOptions.length === 0 && this.placeholder === null) {
      items.push(h("div", {
        class: ["vue-scroll-picker-item", "-empty", "-selected"],
        ref: "items",
        refInFor: true,
        domProps: {
          innerHTML: this.empty
        }
      }));
    }

    items = items.concat(this.normalizedOptions.map(function (option, index) {
      return h("div", {
        class: {
          "vue-scroll-picker-item": true,
          "-selected": _this6.innerIndex == index
        },
        key: option.value,
        ref: "items",
        refInFor: true,
        domProps: {
          innerHTML: option.name
        }
      });
    }));
    return h("div", {
      class: ["vue-scroll-picker"]
    }, [h("div", {
      class: ["vue-scroll-picker-list"]
    }, [h("div", {
      ref: 'list',
      class: {
        "vue-scroll-picker-list-rotator": true,
        "-transition": this.transitioning
      },
      style: this.top !== null ? {
        top: "".concat(this.top, "px")
      } : {}
    }, items)]), h("div", {
      class: ["vue-scroll-picker-layer"]
    }, [h("div", {
      class: ["top"],
      ref: "top"
    }), h("div", {
      class: ["middle"],
      ref: "selection"
    }), h("div", {
      class: ["bottom"],
      ref: "bottom"
    })])]);
  }
};// import "./picker-group.scss"
var ScrollPickerGroup = {
  render: function render(h) {
    return h("div", {
      class: ["vue-scroll-picker-group"]
    }, _toConsumableArray(this.$slots.default));
  }
};// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var component = /*#__PURE__*/(function () {
  // Get component instance
  var installable = ScrollPicker; // Attach install function executed by Vue.use()

  installable.install = function (Vue) {
    Vue.component("ScrollPicker", ScrollPicker);
    Vue.component("ScrollPickerGroup", ScrollPickerGroup);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,ScrollPicker:ScrollPicker,ScrollPickerGroup:ScrollPickerGroup,'default':component});// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      exportName = _ref2[0],
      exported = _ref2[1];

  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;