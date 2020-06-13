
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
  'use strict';

  // Configuration options
  var Module = ['surfaceFire', // Surface Fire, Fire Ellipse, Scorch Height, Tree Mortality, Fire Containment, Surface Spotting, Crown Fire, Crown Spotting
  'fireEllipse', // Fire Ellipse, Scorch Height, Tree Mortality, Fire Containment
  'scorchHeight', // Scorch height, Tree Mortality
  'treeMortality', // Tree Mortality
  'fireContainment', // Fire Containment
  'surfaceSpotting', // Surface Fire Spotting
  'crownFire', // Crown Fire, Crown Fire Spotting
  'crownSpotting', // Crown Fire Spotting
  'spottingDistance', // Burning Pile Spotting, Torching Trees Spotting
  'ignitionProbability']; // bp6 #11 Surface > Input  > Chaparral > Total load is: [specified, est]

  var ChaparralTotalLoad = [// .header('Chaparral total fuel load is')
  'input', // 'entered as input', true)
  'estimated' // 'estimated from Chaparral depth');
  ]; // bp6 #2 - Surface > Input  > Moisture > Herb Curing: [est, inp]

  var CuredHerbFraction = [// .header('Behave fuel model cured herb fraction is')
  'input', // 'entered as input', true)
  'estimated' // 'estimated from live fuel moisture');
  ]; // bp6 #1 Surface > Input  > Fuel:
  // [key, std, exp, harm, arith, pg, wa, ch]
  // Bpx splits bp6 config #1 into two configs; primary.fuel and secondary.fuel

  var PrimaryFuel = [// .header('Primary fuels are specified by entering')
  'catalog', // 'a fuel model catalog key', true)
  'behave', // 'standard BehavePlus fuel parameters')
  'chaparral', // 'chaparral dynamic fuel parameters')
  'palmettoGallberry', // 'palmetto-gallberry dynamic fuel parameters')
  'westernAspen' // 'western aspen dynamic fuel models');
  ]; // bp6 #1 Surface > Input  > Fuel:
  // [key, std, exp, harm, arith, pg, wa, ch]
  // Bpx splits bp6 config #1 into two configs; primary.fuel and secondary.fuel

  var SecondaryFuel = [// .header('Secondary fuels are specified by entering')
  'none', // 'there are no secondary fuels', true);
  'catalog', // 'a fuel model catalog key')
  'behave', // 'standard BehavePlus fuel parameters')
  'chaparral', // 'chaparral dynamic fuel parameters')
  'palmettoGallberry', // 'palmetto-gallberry dynamic fuel parameters')
  'westernAspen' // 'western aspen dynamic fuel models')
  ]; // bp6 #3 - Surface > Input  > Moisture > Fuel Moisture:
  // [ind, cat, mixed, scen]

  var MoistureContent = [// .header('Fuel moistures are specified by entering')
  'individual', // 'the 3 dead and 2 live fuel moistures', true)
  'liveCategory', // 'the 3 dead moistures and a singe live category moisture')
  'category', // 'the dead and live category moistures only')
  'catalog' // 'a fuel moisture catalog key');
  ]; // bp6 #4 Surface > Input  > Wind Speed > Entered at:
  // [mid, 20-wafInp, 20-wafEst, 10-wafInp, 10-wafEst]
  // Bpx slipts Bp6 config #4 into 2 configs, fuel.waf and wind.speed

  var WindSpeedAdjustmentFactor = [// .header('Midflame wind speed adjustment factor is')
  'input', // 'entered as input', true)
  'estimated' // 'estimated from canopy and fuel parameters');
  ]; // bp6 #7 Surface > Input  > Slope > Slope is [percent, degrees]
  // bp6 #8 Surface > Input  > Slope > Slope is [input, map]
  // BPX combined Bp6 configs #7 and #8

  var SlopeSteepness = [// .header('Slope steepness is')
  'ratio', // 'entered as ratio of vertical rise to horizontal reach', true)
  'degrees', // 'entered as degrees of angle above the horizontal plane')
  'map' // 'estimated from map measurements');
  ]; // bp6 #5 Surface > Input  > Wind Speed > Wind is:
  // [always upslope, specified]

  var WindDirection = [// .header('Wind direction is')
  'sourceFromNorth', // 'the direction FROM which the wind is blowing (degrees from NORTH)')
  'headingFromUpslope', // 'the direcion TOWARDS which the wind is blowing (degrees from UPSLOPE)', true)
  'upslope' // 'assumed to be blowing upslope');
  ]; // bp6 #4 Surface > Input  > Wind Speed > Entered at:
  // [mid, 20-wafInp, 20-wafEst, 10-wafInp, 10-wafEst]
  // Bpx slipts Bp6 config #4 into 2 configs, fuel.waf and wind.speed

  var WindSpeed = [// .header('Wind speed is entered for')
  'at10m', // '10-m height')
  'at20ft', // '20-ft height', true)
  'atMidflame' // 'midflame height');
  ];
  var FirelineIntensity = [// .header('The fireline intensity is')
  'firelineIntensity', // 'entered as input', true)
  'flameLength' // 'estimated from the flame length input');
  ];
  var FireLengthToWidthRatio = [// .header('The fire ellipse length-to-width ratio is')
  'lengthToWidthRatio', // 'entered as input', true)
  'effectiveWindSpeed' // 'estimated from the effective wind speed input');
  ]; // bp6 #6 Surface > Input  > Wind Speed > Impose max wind speed limit?

  var EffectiveWindSpeedLimit = [// .header('The effective wind speed limit is')
  'applied', // 'applied', true)
  'ignored' // 'ignored');
  ]; // New to BPX

  var FireWeightingMethod = [// .header('Maximum fire spread rate of 2 surface fuel types is based on')
  'arithmetic', // 'arithmetic mean spread rate')
  'expected', // 'expected value spread rate')
  'harmonic' // 'harmonic mean spread rate', true);
  ]; // bp6 #10 Surface > Input  > Directions > Wind & Fire Dir: [wrt upslope, wrt north]

  var FireVector = [// .header('Fire vector direction inputs are')
  'fromHead', // 'degrees clockwise from direction of maximum spread', true)
  'fromUpslope', // 'degrees clockwise from upslope')
  'fromNorth' // 'degrees clockwise from north');
  ]; // bp6 #9 Surface > Input  > Directions > Spread is [head, back, flank, psi, beta]
  // BPX implements all spread direction options at any time instead of selecting just one
  // bp6 #12 - Crown > Input  > Use [roth, s&r]
  // BPX - May not be necessary: S&R is applied only if passive ouputs requested
  // export const CrownFireMethod_UNUSED = [
  //   // .header('Crown fire is estimated via')
  //   'rothermel', // 'Rothermel')
  //   'scottReinhardt' // 'Scott and Reinhardt (wind must blow upslope)', true);
  // ]
  // bp6 #13 - Crown > Input  > FLI [fl, fli]
  // BPX- Required only in STANDALONE mode
  // const CrownFireFli_UNUSED = [
  //   // .header('The Crown Module is')
  //   'surface', // 'linked to the Surface Module', true)
  //   'flameLength', // 'run stand-alone using flame length input')
  //   'firelineIntensity' // 'run stand-alone using fireline intensity input');
  // ]
  // bp6 # 14 - Contain > Input  > resources [single, multiple]
  // const ContainResources_UNUSED = [
  //   // .header('Contain module allows')
  //   'singleResource', // 'a single firefighting resource')
  //   'multipleResources' // 'multiple firefighting resources', true);
  // ]

  var ConfigDefault = [['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]], ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][0]], ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]], ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][0]], ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][0]], ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]], ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]], ['configure.fuel.curedHerbFraction', ['input', 'estimated'][0]], ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]], ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]], ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]], ['configure.module', Module[0]], ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]], ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]], ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][0]]];
  var ConfigMinimalInput = [['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]], ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][0]], ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]], ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][0]], ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][0]], ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]], ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]], ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][2]], ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]], ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]], ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]], ['configure.module', Module[0]], ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]], ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][2]], ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][2]]];
  var ConfigFm010Fm124Config = [['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]], ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]], ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]], ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][2]], ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][2]], ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]], ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]], ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]], ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]], ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][1]], ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]], ['configure.module', Module[0]], ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]], ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]], ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][2]]];
  var ConfigFm010Fm124Input = [['site.fire.time.sinceIgnition', [60]], ['site.fire.vector.fromNorth', [45]], ['site.map.scale', [24000]], ['site.moisture.dead.tl1h', [0.05]], ['site.moisture.dead.tl10h', [0.07]], ['site.moisture.dead.tl100h', [0.09]], ['site.moisture.dead.category', [0.05]], ['site.moisture.live.herb', [0.5]], ['site.moisture.live.stem', [1.5]], ['site.moisture.live.category', [1.5]], ['site.slope.direction.aspect', [180]], ['site.slope.steepness.ratio', [0.25]], ['site.temperature.air', [95]], ['site.terrain.spotSourceLocation', ['ridgeTop']], ['site.terrain.ridgeValleyDistance', [5000]], ['site.terrain.ridgeValleyElevation', [1000]], ['site.wind.direction.source.fromNorth', [270]], ['site.windSpeedAdjustmentFactor', [0.5]], ['site.wind.speed.atMidflame', [880]], ['surface.primary.fuel.model.catalogKey', ['10']], ['surface.secondary.fuel.model.catalogKey', ['124']], ['surface.weighted.fire.primaryCover', [0.6]]];

  function _typeof(obj) {
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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function () {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
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
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
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
  }

  /**
   * @file class AbstractVariant
   * @copyright 2020 Systems for Environmental Management
   * @author Collin D. Bevins, <cbevins@montana.com>
   * @license OSL-3.0 Open Software License v. 3.0
   * @version 0.1.0
   * #coverage-20200506
   */

  /**
   * AbstractVariant is the abstract base class of all other, more specialized, Variants.
   *
   * A Variant is a *specification* for a Node value.
   * Variant does not actually hold a value itself, rather specifications for:
   * - the *type* of value held by a Node,
   * - all input filters, validators, and validation specs to be applied to a Node's value, and
   * - all display transformers, converters, and decorators for a Node's value.
   */
  var AbstractVariant = /*#__PURE__*/function () {
    function AbstractVariant() {
      var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, AbstractVariant);

      this._display = {};
      this._specs = {
        _defaultValue: defaultValue
      };
      this._validator = [];
    }

    _createClass(AbstractVariant, [{
      key: "defaultValue",
      value: function defaultValue() {
        return this._specs._defaultValue;
      }
    }, {
      key: "displayString",
      value: function displayString(value) {
        return value;
      }
    }, {
      key: "isValid",
      value: function isValid(value) {
        for (var _i = 0, _Object$entries = Object.entries(this._validator); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              key = _Object$entries$_i[0],
              func = _Object$entries$_i[1];

          if (!func(value)) {
            return {
              pass: false,
              value: value,
              fails: key
            };
          }
        }

        return {
          pass: true,
          value: value,
          fails: 'none'
        };
      }
    }]);

    return AbstractVariant;
  }();

  /**
   * Blob is an Variant whose value is a generic Javascript Object.
   *
   * Blob should be treated as an abstract class: derived classes
   * should be developed for Nodes with a specific value object structure.
   */

  var Blob = /*#__PURE__*/function (_AbstractVariant) {
    _inherits(Blob, _AbstractVariant);

    var _super = _createSuper(Blob);

    function Blob() {
      var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Blob);

      if (_typeof(defaultValue) !== 'object') {
        throw new Error("new Variant.Blob(".concat(JSON.stringify(defaultValue), ") requires an the 'defaultValue' argument to be an 'object'"));
      }

      return _super.call(this, defaultValue);
    }

    _createClass(Blob, [{
      key: "displayString",
      value: function displayString(value) {
        return JSON.stringify(value);
      }
    }]);

    return Blob;
  }(AbstractVariant);

  /**
   * Bool is a Variant whose value is a Javascript boolean primitive,
   * and whose display may be decorated with strings representing its
   * 'true' and 'false' state.
   */

  var Bool = /*#__PURE__*/function (_AbstractVariant) {
    _inherits(Bool, _AbstractVariant);

    var _super = _createSuper(Bool);

    function Bool() {
      var _this;

      var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var trueString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'true';
      var falseString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'false';

      _classCallCheck(this, Bool);

      if (typeof defaultValue !== 'boolean') {
        throw new Error("new Variant.Bool(".concat(defaultValue, ") requires the 'defaultValue' argument to be a 'boolean'"));
      } else if (typeof trueString !== 'string') {
        throw new Error("new Variant.Bool(".concat(defaultValue, ", trueString) requires the 'trueString' argument to be a 'string'"));
      } else if (typeof falseString !== 'string') {
        throw new Error("new Variant.Bool(".concat(defaultValue, ", trueString, falseString) requires the 'falseString' argument to be a 'string'"));
      }

      _this = _super.call(this, defaultValue);
      _this._specs._trueString = trueString;
      _this._specs._falseString = falseString;

      _this._validator.isBool = function (value) {
        return typeof value === 'boolean';
      };

      return _this;
    }

    _createClass(Bool, [{
      key: "displayString",
      value: function displayString(value) {
        return value ? this._specs._trueString : this._specs._falseString;
      }
    }]);

    return Bool;
  }(AbstractVariant);

  /**
   * Option is a Variant whose value is a Javascript string primitive
   * and a member of a predefined set of strings.
   */

  var Option = /*#__PURE__*/function (_AbstractVariant) {
    _inherits(Option, _AbstractVariant);

    var _super = _createSuper(Option);

    function Option(validOptionsArray) {
      var _this;

      var defaultOptionIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, Option);

      if (!(validOptionsArray instanceof Array)) {
        throw new Error("new Variant.Option(".concat(validOptionsArray, ") options array is not an array"));
      } else if (defaultOptionIndex < 0 || defaultOptionIndex >= validOptionsArray.length) {
        throw new Error("new Variant.Option(".concat(validOptionsArray, ", ").concat(defaultOptionIndex, ") defaultOptionIndex is invalid"));
      }

      _this = _super.call(this, validOptionsArray[defaultOptionIndex]);
      _this._specs._options = validOptionsArray;

      _this._validator.isString = function (value) {
        return typeof value === 'string';
      };

      _this._validator.isMember = function (value) {
        return _this.has(value);
      };

      return _this;
    }

    _createClass(Option, [{
      key: "displayString",
      value: function displayString(option) {
        this.ensure(option); // @todo Check for translation table

        return option;
      }
    }, {
      key: "ensure",
      value: function ensure(option) {
        if (!this.has(option)) {
          throw new Error("Invalid Option '".concat(option, "'"));
        }

        return true;
      }
    }, {
      key: "has",
      value: function has(option) {
        return this._specs._options.includes(option);
      }
    }, {
      key: "options",
      value: function options() {
        return this._specs._options;
      }
    }]);

    return Option;
  }(AbstractVariant);

  /**
   * Config is an Option Variant whose sole purpose is to define
   * Dag configuration optionswith its own specialized 'instanceof'==='Config'
   */

  var Config = /*#__PURE__*/function (_Option) {
    _inherits(Config, _Option);

    var _super = _createSuper(Config);

    function Config() {
      _classCallCheck(this, Config);

      return _super.apply(this, arguments);
    }

    return Config;
  }(Option);

  /**
   * Numeric is a Variant whose value is a Javascript number primitive
   * and whose filters ensure a numeric value.
   */

  var Numeric = /*#__PURE__*/function (_AbstractVariant) {
    _inherits(Numeric, _AbstractVariant);

    var _super = _createSuper(Numeric);

    function Numeric() {
      var _this;

      var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var minValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1 - Number.MAX_VALUE;
      var maxValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.MAX_VALUE;

      _classCallCheck(this, Numeric);

      if (typeof defaultValue !== 'number') {
        throw new Error("new Variant.Numeric(".concat(defaultValue, ") requires the 'defaultValue' argument to be a 'number'"));
      } else if (typeof minValue !== 'number') {
        throw new Error("new Variant.Numeric(".concat(defaultValue, ", ").concat(minValue, ") requires the 'minValue' argument to be a 'number'"));
      } else if (typeof maxValue !== 'number') {
        throw new Error("new Variant.Numeric(".concat(defaultValue, ", ").concat(minValue, ", ").concat(maxValue, ") requires an 'maxValue' argument to be a 'number'"));
      } else if (minValue > maxValue) {
        throw new Error("new Variant.Numeric(".concat(defaultValue, ", ").concat(minValue, ", ").concat(maxValue, ") minValue exceeds maxValue"));
      } else if (defaultValue < minValue) {
        throw new Error("new Variant.Numeric(".concat(defaultValue, ", ").concat(minValue, ", ").concat(maxValue, ") defaultValue is less than minValue"));
      } else if (defaultValue > maxValue) {
        throw new Error("new Variant.Numeric(".concat(defaultValue, ", ").concat(minValue, ", ").concat(maxValue, ") defaultValue exceeds maxValue"));
      }

      _this = _super.call(this, defaultValue);
      _this._specs._minimumValue = minValue;
      _this._specs._maximumValue = maxValue;

      _this._validator.isNumeric = function (value) {
        return typeof value === 'number';
      };

      _this._validator.minimumValue = function (value) {
        return value >= _this._specs._minimumValue;
      };

      _this._validator.maximumValue = function (value) {
        return value <= _this._specs._maximumValue;
      };

      return _this;
    }

    return Numeric;
  }(AbstractVariant);

  /**
   * Integer is a Numeric Variant whose value is an integer.
   */

  var Integer = /*#__PURE__*/function (_Numeric) {
    _inherits(Integer, _Numeric);

    var _super = _createSuper(Integer);

    function Integer() {
      var _this;

      var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var minValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1 - Number.MAX_VALUE;
      var maxValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.MAX_VALUE;

      _classCallCheck(this, Integer);

      if (typeof defaultValue !== 'number' || Number.isInteger(defaultValue) === false) {
        throw new Error("new Variant.Integer(".concat(defaultValue, ") requires the 'defaultValue' argument to be an integer 'number'"));
      } else if (typeof minValue !== 'number' || Number.isInteger(minValue) === false) {
        throw new Error("new Variant.Integer(".concat(defaultValue, ", ").concat(minValue, ") requires the 'minValue' argument to be an integer 'number'"));
      } else if (typeof maxValue !== 'number' || Number.isInteger(maxValue) === false) {
        throw new Error("new Variant.Integer(".concat(defaultValue, ", ").concat(minValue, ", ").concat(maxValue, ") requires an 'maxValue' argument to be an integer 'number'"));
      }

      _this = _super.call(this, defaultValue, minValue, maxValue);

      _this._validator.isInteger = function (value) {
        return Number.isInteger(value);
      };

      return _this;
    }

    return Integer;
  }(Numeric);

  /**
   * Count is an Integer Variant whose minimum value is 0.
   */

  var Count = /*#__PURE__*/function (_Integer) {
    _inherits(Count, _Integer);

    var _super = _createSuper(Count);

    function Count() {
      var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var maxValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;

      _classCallCheck(this, Count);

      return _super.call(this, defaultValue, 0, maxValue);
    }

    return Count;
  }(Integer);
  /**
   * Index is an Count Variant whose maximum value is size-1.
   */

  var Index = /*#__PURE__*/function (_Count) {
    _inherits(Index, _Count);

    var _super2 = _createSuper(Index);

    function Index() {
      var _this;

      var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _classCallCheck(this, Index);

      _this = _super2.call(this, 0, maxSize - 1);
      _this._specs._maxSize = maxSize;
      return _this;
    }

    return Index;
  }(Count);

  /**
   * Float is a Numeric Variant whose value may be a floating point or integer number,
   * and whose display value may be
   * - a fixed number of decimals,
   * - a fixed precision, or
   * - an exponential number with a fixed number of decimal digits.
   */

  var Float = /*#__PURE__*/function (_Numeric) {
    _inherits(Float, _Numeric);

    var _super = _createSuper(Float);

    function Float() {
      var _this;

      var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var minValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1 - Number.MAX_VALUE;
      var maxValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.MAX_VALUE;

      _classCallCheck(this, Float);

      _this = _super.call(this, defaultValue, minValue, maxValue);
      _this._display._mode = 'fixed';
      _this._display._decimals = 2;
      return _this;
    }

    _createClass(Float, [{
      key: "setDisplayExponential",
      value: function setDisplayExponential(decimals) {
        this._display._mode = 'exponential';
        this._display._decimals = decimals;
      }
    }, {
      key: "setDisplayFixed",
      value: function setDisplayFixed(decimals) {
        this._display._mode = 'fixed';
        this._display._decimals = decimals;
      }
    }, {
      key: "setDisplayPrecision",
      value: function setDisplayPrecision(decimals) {
        this._display._mode = 'precision';
        this._display._decimals = decimals;
      }
    }, {
      key: "displayString",
      value: function displayString(value) {
        return this.displayValue(value);
      }
    }, {
      key: "displayValue",
      value: function displayValue(value) {
        if (this._display._mode === 'precision') {
          return value.toPrecision(this._display._decimals);
        }

        if (this._display._mode === 'exponential') {
          return value.toExponential(this._display._decimals);
        }

        return value.toFixed(this._display._decimals);
      }
    }]);

    return Float;
  }(Numeric);

  // ------------------------------------------------------------------------------
  // Dimensionless Units of Measure (can be a rtio or a percent)
  // ------------------------------------------------------------------------------
  var Fraction = {
    name: 'Fraction',
    base: 'ratio',
    fromBaseInto: {
      ratio: 1,
      percent: 100
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Fraction.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Fraction.fromBaseInto[fromUom];
    }
  };
  var Ratio = {
    name: 'Ratio',
    base: 'ratio',
    fromBaseInto: {
      ratio: 1,
      percent: 100
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Ratio.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Ratio.fromBaseInto[fromUom];
    }
  };

  function constrain(degrees) {
    while (degrees >= 90) {
      degrees -= 90;
    }

    while (degrees < 0) {
      degrees += 90;
    }

    return degrees;
  }

  function degrees(radians) {
    return radians * 180 / Math.PI;
  }

  function radians(degrees) {
    return degrees * Math.PI / 180;
  }

  function slopeDegrees(ratio) {
    var radians = Math.atan(ratio);
    return degrees(radians);
  }

  function slopeRatio(degrees) {
    var rad = radians(constrain(degrees));
    return Math.tan(rad);
  } // ------------------------------------------------------------------------------
  // ARC
  // ------------------------------------------------------------------------------


  var Arc = {
    name: 'Arc',
    base: 'ratio',
    fromBaseInto: {
      ratio: 1,
      percent: 100,
      deg: 1
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return asUom === 'deg' ? slopeDegrees(baseAmount) : baseAmount * Fraction.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromUom === 'deg' ? slopeRatio(fromAmount) : fromAmount / Fraction.fromBaseInto[fromUom];
    }
  };

  function uomParse(uomStr, parts) {
    var uomArray = uomStr.split('/');

    if (uomArray.length !== parts) {
      throw new Error("Expected a 2-dimensional Uom name, but got '".concat(uomStr, "'"));
    }

    return uomArray;
  } // Helper function that converts a 2-dimensional base amount into some other units-of-measure


  function baseAsUom2(baseAmount, asUom, numType, denType) {
    var uom = uomParse(asUom, 2);
    var factor = numType.fromBaseInto[uom[0]] / denType.fromBaseInto[uom[1]];
    return baseAmount * factor;
  } // Helper function that converts a 2-dimensional units-of-measure into the base amount

  function baseFromUom2(fromAmount, asUom, numType, denType) {
    var uom = uomParse(asUom, 2);
    var factor = 1 / (numType.fromBaseInto[uom[0]] / denType.fromBaseInto[uom[1]]);
    return fromAmount * factor;
  } // Helper function that converts a 3-dimensional base amount into some other units-of-measure

  function baseAsUom3(baseAmount, asUom, numType, den1Type, den2Type) {
    var uom = uomParse(asUom, 3);
    var factor = numType.fromBaseInto[uom[0]] / den1Type.fromBaseInto[uom[1]] / den2Type.fromBaseInto[uom[2]];
    return baseAmount * factor;
  } // Helper function that converts a 3-dimensional units-of-measure into the base unbits-of-measure

  function baseFromUom3(baseAmount, asUom, numType, den1Type, den2Type) {
    var uom = uomParse(asUom, 3);
    var factor = 1 / (numType.fromBaseInto[uom[0]] / den1Type.fromBaseInto[uom[1]] / den2Type.fromBaseInto[uom[2]]);
    return baseAmount * factor;
  }

  // ------------------------------------------------------------------------------
  // TIME and its derivatives
  // ------------------------------------------------------------------------------
  var Time = {
    name: 'Time',
    base: 'min',
    fromBaseInto: {
      min: 1,
      s: 60,
      h: 1 / 60,
      d: 1 / (60 * 24),
      y: 1 / (60 * 24 * 365)
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Time.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Time.fromBaseInto[fromUom];
    }
  };
  var Hertz = {
    name: 'Hertz',
    base: '1/min',
    fromBaseInto: {
      '1/min': 1,
      '1/s': 60
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Hertz.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Hertz.fromBaseInto[fromUom];
    }
  };
  var Years = {
    name: 'Years',
    base: 'y',
    fromBaseInto: {
      y: 1
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Years.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Years.fromBaseInto[fromUom];
    }
  };

  var Distance = {
    name: 'Distance',
    base: 'ft',
    fromBaseInto: {
      ft: 1,
      // based on [ft_us}, NOT [ft_i]]
      ch: 1 / 66,
      in: 12,
      mi: 1 / 5280,
      yd: 1 / 3,
      m: 0.3048,
      cm: 30.48,
      km: 0.0003048
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Distance.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Distance.fromBaseInto[fromUom];
    }
  };
  var DistanceSquared = {
    name: 'Distance^2',
    base: 'ft2',
    fromBaseInto: {
      ft2: 1,
      in2: 144,
      ac: 1 / 43560,
      m2: 0.3048 * 0.3048,
      cm2: 30.48 * 30.48,
      ha: 1 / 107639
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Area.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Area.fromBaseInto[fromUom];
    }
  };
  var DistanceCubed = {
    name: 'Distance^3',
    base: 'ft3',
    fromBaseInto: {
      ft3: 1,
      in3: 144 * 12,
      m3: 0.3048 * 0.3048 * 0.3048,
      cm3: 30.48 * 30.48 * 30.48
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Volume.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Volume.fromBaseInto[fromUom];
    }
  };
  var DistancePerUnitTime = {
    name: 'Distance/Time',
    base: 'ft/min',
    fromBaseInto: {
      'ft/min': true,
      'ft/s': true,
      'ft/h': true,
      'ch/min': true,
      'ch/h': true,
      'mi/h': true,
      'm/min': true,
      'm/s': true,
      'm/h': true,
      'km/h': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAsUom2(baseAmount, asUom, Distance, Time);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return baseFromUom2(fromAmount, fromUom, Distance, Time);
    }
  }; // Specialized...

  var Area = _objectSpread2({}, DistanceSquared);
  var Velocity = _objectSpread2({}, DistancePerUnitTime);
  var Volume = _objectSpread2({}, DistanceCubed);
  var AreaPerUnitVolume = {
    name: 'Area/Volume',
    base: 'ft2/ft3',
    fromBaseInto: {
      'ft2/ft3': true,
      'm2/m3': true,
      'cm2/cm3': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAsUom2(baseAmount, asUom, Area, Volume);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return baseFromUom2(fromAmount, fromUom, Area, Volume);
    }
  };
  var Savr = _objectSpread2({}, AreaPerUnitVolume);

  var Mass = {
    name: 'Mass',
    base: 'lb',
    fromBaseInto: {
      lb: 1,
      oz: 16,
      ton: 1 / 2000,
      kg: 0.45359237,
      g: 453.59237,
      T: 0.00045359237 // 1 / 2204.622621848776

    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Mass.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Mass.fromBaseInto[fromUom];
    }
  };
  var MassPerUnitArea = {
    name: 'Mass/Area',
    base: 'lb/ft2',
    fromBaseInto: {
      'lb/ft2': true,
      'ton/ac': true,
      'kg/m2': true,
      'T/ha': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAsUom2(baseAmount, asUom, Mass, Area);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return baseFromUom2(fromAmount, fromUom, Mass, Area);
    }
  };
  var MassPerUnitVolume = {
    name: 'Mass/Volume',
    base: 'lb/ft3',
    fromBaseInto: {
      'lb/ft3': true,
      'kg/m3': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAsUom2(baseAmount, asUom, Mass, Volume);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return baseFromUom2(fromAmount, fromUom, Mass, Volume);
    }
  }; // Specializations

  var Density = _objectSpread2({}, MassPerUnitVolume);
  var Load = _objectSpread2({}, MassPerUnitArea);

  var Energy = {
    name: 'Energy',
    base: 'btu',
    fromBaseInto: {
      btu: 1,
      // [Btu_IT]
      J: 1055.05585262,
      // btu_IT:
      // J: 1.05967, // btu_39:
      // J: 1.0548, // btu_59:
      // J: 1.05468,  // btu_60:
      // J: 1.05587,  // btu_m:
      // J: 1.05435,  // btu_th:
      kJ: 1.05505585262,
      // btu_IT:
      'ft-lb': 1055.05585262 / 1.3558179483314004,
      // 1 ft-lb = 1.3558179483314004 J
      'kw-m': 3.46414
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAmount * Energy.fromBaseInto[asUom];
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromAmount / Energy.fromBaseInto[fromUom];
    }
  };
  var EnergyPerUnitArea = {
    name: 'Energy/Area',
    base: 'btu/ft2',
    fromBaseInto: {
      'btu/ft2': true,
      'J/m2': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAsUom2(baseAmount, asUom, Energy, Area);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return baseFromUom2(fromAmount, fromUom, Energy, Area);
    }
  };
  var EnergyPerUnitAreaPerUnitTime = {
    name: 'Energy/Area/Time',
    base: 'btu/ft2/min',
    fromBaseInto: {
      'btu/ft2/min': true,
      'J/m2/min': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAsUom3(baseAmount, asUom, Energy, Area, Time);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return baseFromUom3(fromAmount, fromUom, Energy, Area, Time);
    }
  };
  var EnergyPerUnitDistancePerUnitTime = {
    name: 'Energy/Distance/Time',
    base: 'btu/ft/s',
    fromBaseInto: {
      'btu/ft/s': true,
      'J/m/s': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      // Because the base Time is 's' instead of 'min', multiply by 60
      return 60 * baseAsUom3(baseAmount, asUom, Energy, Distance, Time);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      // Because the base Time is 's' instead of 'min', divide by 60
      return baseFromUom3(fromAmount, fromUom, Energy, Distance, Time) / 60;
    }
  };
  var EnergyPerUnitMass = {
    name: 'Energy/Mass',
    base: 'btu/lb',
    fromBaseInto: {
      'btu/lb': true,
      'J/kg': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAsUom2(baseAmount, asUom, Energy, Mass);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return baseFromUom2(fromAmount, fromUom, Energy, Mass);
    }
  };
  var EnergyPerUnitTime = {
    name: 'EnergyPerUnitTime',
    base: 'btu/min',
    fromBaseInto: {
      'J/s': true,
      'J/min': true,
      'btu/s': true,
      'btu/min': true,
      W: 17.5725,
      'ft-lb/s': 17.5725 / 1.35581795 // 1 ft-lb/s == 1.35581795 watts

    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return asUom === 'W' // asUom.indexOf('/') < 0
      ? baseAmount * this.fromBaseInto[asUom] : baseAsUom2(baseAmount, asUom, Energy, Time);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return fromUom === 'W' // asUom.indexOf('/') < 0
      ? fromAmount / this.fromBaseInto[fromUom] : baseFromUom2(fromAmount, fromUom, Energy, Time);
    }
  };
  var EnergyPerUnitVolume = {
    name: 'Energy/Volume',
    base: 'btu/ft3',
    fromBaseInto: {
      'btu/ft3': true,
      'J/m3': true
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      return baseAsUom2(baseAmount, asUom, Energy, Volume);
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      return baseFromUom2(fromAmount, fromUom, Energy, Volume);
    }
  }; // Specialized ...
  // HeatContent is Btu/lb used by [HeatOfCombustion, HeatOfPreignition]

  var HeatContent = EnergyPerUnitMass; // HeatDensity (Btu/ft3) used by [HeatSink]

  var HeatDensity = _objectSpread2({}, EnergyPerUnitVolume); // HeatFlux is Btu/ft2/min used by [ReactionIntensity, PropagatingFlux]

  var HeatFlux = _objectSpread2({}, EnergyPerUnitAreaPerUnitTime); // HeatIntensity is Btu/ft/s used by [FirelineIntensity]

  var HeatIntensity = _objectSpread2({}, EnergyPerUnitDistancePerUnitTime); // HeatLoad is Btu/ft2 used by [HeatPerUnitArea]

  var HeatLoad = _objectSpread2({}, EnergyPerUnitArea);
  var Power = _objectSpread2({}, EnergyPerUnitTime);

  // ------------------------------------------------------------------------------
  // TEMPERATURE and its derivatives
  // ------------------------------------------------------------------------------
  var Temperature = {
    name: 'Temperature',
    base: 'F',
    fromBaseInto: {
      F: 1,
      C: 5 / 9,
      K: 5 / 9
    },
    baseAsUom: function baseAsUom(baseAmount, asUom) {
      if (asUom === 'C') return (baseAmount - 32) * 5 / 9;
      if (asUom === 'K') return 459.67 + (baseAmount - 32) * 5 / 9;
      return baseAmount; // else asUom === 'F'
    },
    baseFromUom: function baseFromUom(fromAmount, fromUom) {
      if (fromUom === 'C') return 32 + fromAmount * 1.8;
      if (fromUom === 'K') return 32 + (fromAmount - 459.67) * 1.8;
      return fromAmount; // if (fromUom === 'F')
    }
  };

  /**
   * Quantity if a Float Variant class with a minimum value of 0 and a units-of-measure.
   *
   * In addition to a 'base' units-of-measure, a Quantity has a current display
   * units-of-measure; calling displayString() transforms the base amount to the display amount.
   *
   * Quantity is able to convert between a base units-of-measure and other defined
   * units-of-measure.
   */

  var Quantity = /*#__PURE__*/function (_Float) {
    _inherits(Quantity, _Float);

    var _super = _createSuper(Quantity);

    function Quantity(uom) {
      var _this;

      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var maxValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.MAX_VALUE;

      _classCallCheck(this, Quantity);

      if (_typeof(uom) !== 'object' || !uom.hasOwnProperty('fromBaseInto')) {
        throw new Error("new Variant.Quantity(".concat(uom, ") uom argument is not a Uom object"));
      }

      _this = _super.call(this, defaultValue, 0, maxValue);
      _this._specs._uom = uom;
      _this._display._units = uom.base; // We want Ratio and Fraction to have Quantity-like uom semantics (ratio v percent)

      if (uom === Fraction) {
        _this._specs._maximumValue = 1;
      }

      return _this;
    }

    _createClass(Quantity, [{
      key: "baseAsDisplay",
      value: function baseAsDisplay(amount) {
        var units = this.ensure(this._display._units);
        return this.uom().baseAsUom(amount, units);
      }
    }, {
      key: "baseAsUom",
      value: function baseAsUom(amount, intoUom) {
        var units = this.ensure(intoUom);
        return this.uom().baseAsUom(amount, units);
      }
    }, {
      key: "baseFromUom",
      value: function baseFromUom(amount, fromUom) {
        var units = this.ensure(fromUom);
        return this.uom().baseFromUom(amount, units);
      }
    }, {
      key: "convert",
      value: function convert(amount, fromUom, intoUom) {
        return this.baseAsUom(this.baseFromUom(amount, fromUom), intoUom);
      }
      /**
       * Returns a numeric amount that is converted from base value to display value
       * and then transformed with the current fixed/exponential/precision settings.
       * @param {*} baseAmount
       */

    }, {
      key: "displayAmount",
      value: function displayAmount(baseAmount) {
        return this.displayValue(this.baseAsDisplay(baseAmount));
      }
    }, {
      key: "displayString",
      value: function displayString(baseAmount) {
        return "".concat(this.displayAmount(baseAmount), " ").concat(this._display._units);
      }
    }, {
      key: "ensure",
      value: function ensure(units) {
        var u = units === 'base' || units === '' ? this.uomBase() : units; // if (!this.uom().hasOwnProperty('fromBaseInto')) {
        //   throw new Error(`Quantity '${this.uomName()}' has no 'fromBaseInto'`)
        // }

        if (!this.uom().fromBaseInto.hasOwnProperty(u)) {
          throw new Error("Quantity '".concat(this.uomName(), "' has no units-of-measure '").concat(units, "'"));
        }

        return u;
      }
    }, {
      key: "setDisplayUnits",
      value: function setDisplayUnits(units) {
        this.ensure(units);
        this._display._units = units;
      }
    }, {
      key: "uom",
      value: function uom() {
        return this._specs._uom;
      }
    }, {
      key: "uomBase",
      value: function uomBase() {
        return this._specs._uom.base;
      }
    }, {
      key: "uomKeys",
      value: function uomKeys() {
        return Object.keys(this._specs._uom.fromBaseInto);
      }
    }, {
      key: "uomName",
      value: function uomName() {
        return this._specs._uom.name;
      }
    }]);

    return Quantity;
  }(Float);

  /**
   * Text is a Variant whose value is a Javascript string primitive.
   */

  var Text = /*#__PURE__*/function (_AbstractVariant) {
    _inherits(Text, _AbstractVariant);

    var _super = _createSuper(Text);

    function Text() {
      var _this;

      var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var minLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var maxLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 999999;

      _classCallCheck(this, Text);

      if (typeof defaultValue !== 'string') {
        throw new Error("new Variant.Text(".concat(defaultValue, ") requires the 'defaultValue' argument to be a 'string'"));
      } else if (typeof minLength !== 'number') {
        throw new Error("new Variant.Text(".concat(defaultValue, ", ").concat(minLength, ") requires the 'minLength' argument to be a 'number', but received a ").concat(_typeof(minLength)));
      } else if (typeof maxLength !== 'number') {
        throw new Error("new Variant.Text(".concat(defaultValue, ", ").concat(minLength, ", ").concat(maxLength, ") requires an 'maxLength' argument to be a 'number'"));
      } else if (minLength > maxLength) {
        throw new Error("new Variant.Text(".concat(defaultValue, ", ").concat(minLength, ", ").concat(maxLength, ") minLength exceeds maxLength"));
      } else if (defaultValue.length < minLength) {
        throw new Error("new Variant.Text(".concat(defaultValue, ", ").concat(minLength, ", ").concat(maxLength, ") defaultValue length is less than minLength"));
      } else if (defaultValue.length > maxLength) {
        throw new Error("new Variant.Text(".concat(defaultValue, ", ").concat(minLength, ", ").concat(maxLength, ") defaultValue length exceeds maxLength"));
      }

      _this = _super.call(this, defaultValue);
      _this._specs._minimumLength = minLength;
      _this._specs._maximumLength = maxLength;

      _this._validator.isString = function (value) {
        return typeof value === 'string';
      };

      _this._validator.minimumLength = function (value) {
        return value.length >= _this._specs._minimumLength;
      };

      _this._validator.maximumLength = function (value) {
        return value.length <= _this._specs._maximumLength;
      };

      return _this;
    }

    return Text;
  }(AbstractVariant);

  var VariantArray = [['Blob', new Blob()], ['Bool', new Bool()], ['Config', new Config(['configA', 'configB'])], ['Count', new Count()], ['Float', new Float()], ['Index', new Index()], ['Integer', new Integer()], ['Numeric', new Numeric()], ['Option', new Option(['optionA', 'optionB'])], ['Text', new Text()], // @todo Put all 'Quantity' Uoms here
  ['Arc', new Quantity(Arc)], ['Distance', new Quantity(Distance)], ['Energy', new Quantity(Energy)], ['Mass', new Quantity(Mass)], ['Temperature', new Quantity(Temperature)], ['Time', new Quantity(Time)], ['Area', new Quantity(Area)], // ft2
  ['Hertz', new Quantity(Hertz)], // 1/min
  ['Fraction', new Quantity(Fraction)], ['Ratio', new Quantity(Ratio)], ['Volume', new Quantity(Volume)], // ft3
  ['Years', new Quantity(Years)], ['Density', new Quantity(Density)], // lb/ft3
  ['HeatContent', new Quantity(HeatContent)], // btu/lb
  ['HeatDensity', new Quantity(HeatDensity)], // btu/ft3
  ['HeatLoad', new Quantity(HeatLoad)], // btu/ft2
  ['Load', new Quantity(Load)], // lb/ft2
  ['Power', new Quantity(Power)], // btu/min
  ['Savr', new Quantity(Savr)], // ft2/ft3
  ['Velocity', new Quantity(Velocity)] // ft/min
  ];

  /**
   * Updater class hold data for a single configuration-method pair for a Node.
   * Nodes may have one or more Updater.  When the DAG is reconfigured,
   * each Node's updater array is examined for its first Updater whose specs are true,
   * and that Updater's associated method is then applied to the Node.
   * @class
   */

  var Updater = function Updater() {
    _classCallCheck(this, Updater);

    this.config = {
      // properties relating to when this Updater is applied to its Node
      key: null,
      // string key of the specification Config Node (or null)
      op: null,
      // string key of the specification operation ('equals', 'includes')
      value: null,
      // specification value
      ref: null // reference to the specification Config Node

    };
    this.method = {
      key: null,
      // key string for the Update method for this specification
      parms: [],
      // array of parameters required by the method
      ref: null // reference to the specification updater method

    };
  };
  /**
   * Node class holds data for a single DAG Node.
   * @class
   */

  var Node = /*#__PURE__*/function () {
    function Node(nodeKey, variantKey, updaterArray) {
      _classCallCheck(this, Node);

      this.dag = {
        // properties relating to the directed acyclical graph
        consumers: [],
        // references to all Nodes that required *this* Node
        depth: 0,
        // topological depth
        providers: [] // references to all Nodes that are required by *this* Node

      };
      this.variant = {
        // properties relating to the Node's value type and representation
        key: variantKey,
        // key string for *this* Node's value type Variant class
        ref: null // reference to *this* Node's shared Variant instance

      };
      this.input = {
        // properties relating to alternate input values
        values: [],
        // array of input values to be iterated
        cases: [] // temporary copy of input.values when in 'casewise' mode

      };
      this.method = {
        // properties relating to the Node's current updater method
        key: null,
        // key string for *this* Node's current updater method
        parms: [],
        // array of parameters describing arguments to be passed to updater method
        ref: null // reference to *this* Node's current updater method

      };
      this.node = {
        // properties relating to the Node's identification
        key: nodeKey // string key identifier that is unique across the DAG

      };
      this.status = {
        // properties relating to the Node's status
        isEnabled: true,
        // TRUE if *this* Node is enabled within the DAG
        isRequired: false,
        // TRUE if *this* Node is required to update the current set of selected Nodes
        isSelected: false // TRUE if *this* Node is selected as output

      };
      this.updaters = updaterArray; // An array of all possible updater methods for *this* Node

      this.value = {
        // properties relating to the Node's value
        current: null,
        // *this* Node's current (most recently updated) value
        default: null,
        // *this* Node's default value
        run: [] // if isSelected, an array of *this* Node's values for each run iteration

      };
    }

    _createClass(Node, [{
      key: "displayAmount",
      value: function displayAmount() {
        return this.variant.ref.displayAmount(this.value.current);
      }
    }, {
      key: "displayString",
      value: function displayString() {
        return this.variant.ref.displayString(this.value.current);
      }
    }, {
      key: "displayRunAmount",
      value: function displayRunAmount(idx) {
        return this.variant.ref.displayAmount(this.value.run[idx]);
      }
    }, {
      key: "displayRunString",
      value: function displayRunString(idx) {
        return this.variant.ref.displayString(this.value.run[idx]);
      }
    }, {
      key: "isNumeric",
      value: function isNumeric() {
        return this.variant.ref instanceof Numeric;
      }
    }, {
      key: "isOption",
      value: function isOption() {
        return this.variant.ref instanceof Option;
      }
    }, {
      key: "isQuantity",
      value: function isQuantity() {
        return this.variant.ref instanceof Quantity;
      }
      /**
       * @returns True if, under the current DAG configuration,
       * this Node is must be provided by the client as input.
       */

    }, {
      key: "isInput",
      value: function isInput() {
        return this.method.key === 'Dag.input' || this.method.key === 'Dag.dangler';
      }
    }, {
      key: "options",
      value: function options() {
        return this.isOption() ? this.variant.ref.options : null;
      }
      /**
       * Called only by DagPrivate.updateRecursive() to update *this* Node's current vlaue.
       * @return The Node.value.current
       */

    }, {
      key: "updateValue",
      value: function updateValue() {
        // If the Node has a fixed value, just assign the fixed value
        if (this.method.key === 'Dag.fixed') {
          return this.value.current = this.method.parms[0];
        } // If the Node is a Config, no need to do anything


        if (this.method.key === 'Dag.config') {
          return this.value.current;
        } // If the Node is bound, set this Node's value from the bound Nodes's value


        if (this.method.key === 'Dag.bind') {
          return this.value.current = this.method.parms[0].value.current;
        } // If the Node is an input, DagPrivate.updateRecursive() handles value iteration
        // so the following block should never be entered


        if (this.method.key === 'Dag.input' || this.method.key === 'Dag.dangler') {
          // The following statement should never be executed
          return this.current.value;
        } // Otherwise lookup the updater method, evaluate its parms, and invoke it it


        var args = [];
        this.method.parms.forEach(function (parm) {
          var arg = parm; // assume the parm is a literal primitive or object arg

          if (parm instanceof Node) {
            // if the parm is a Node reference, use its value as the arg
            arg = parm.value.current;
          }

          args.push(arg);
        }); // Call the method with the args and return its value
        // DagPrivate.clone() should have caught all invalid method refs, but still...

        if (typeof this.method.ref === 'undefined') {
          // The following statement should never be executed
          throw new Error("undefined method ref for '".concat(this.method.key, "'"));
        }

        return this.value.current = this.method.ref.apply(null, args);
      }
    }]);

    return Node;
  }();

  /**
   * Returns a Node reference for the Node key string.
   *
   * This is a convenience function that allows clients to use
   * either direct Node references or Node.node.key strings as function args.
   * @param {Dag} dag
   * @param {string|Node} nodeKeyOrRef Either a Node reference or a Node.node.key string
   * @return A Node reference
   */

  function asNodeRef(dag, nodeKeyOrRef) {
    if (nodeKeyOrRef instanceof Node) {
      return nodeKeyOrRef;
    } else if (typeof nodeKeyOrRef === 'string') {
      if (dag.node.map.has(nodeKeyOrRef)) {
        return dag.node.map.get(nodeKeyOrRef);
      }
    }

    throw new Error("asNodeRef() arg is neither a Node reference nor a Node key string:\n".concat(nodeKeyOrRef));
  } // Clones new Nodes into the Dag from the genomeArray

  /**
   * Creates a new Dag.node.map from the genomeArray
   * with all Node, Variant, and method references resolved.
   *
   * @param {Dag} dag
   * @param {Array} genomeArray Dag definition genome composed of string keys.
   */

  function clone(dag, genomeArray) {
    // Step 1 - Add just Dag Nodes to the dag.node.map
    genomeArray.forEach(function (genome) {
      var my = createNode(genome);

      if (dag.node.map.has(my.node.key)) {
        throw new Error("GenomeArray Node '".concat(my.node.key, "' was previously defined"));
      }

      if (!dag.variant.map.has(my.variant.key)) {
        throw new Error("GenomeArray Node '".concat(my.node.key, "' has unknown variant '").concat(my.variant.key, "'"));
      }

      my.variant.ref = dag.variant.map.get(my.variant.key);
      my.value.default = my.variant.ref.defaultValue();
      my.value.current = my.value.default;
      dag.node.map.set(my.node.key, my);
    }); // Step 2 - validate configKeys and methodKeys

    dag.node.map.forEach(function (my) {
      // Ensure all updater method names are valid
      my.updaters.forEach(function (updater, idx) {
        // Ensure the configKey is valid
        if (updater.config.key !== null) {
          if (!dag.node.map.has(updater.config.key)) {
            throw new Error("GenomeArray Node '".concat(my.node.key, "' updater ").concat(idx, " has unknown config Node '").concat(updater.config.key, "'"));
          }

          var config = dag.node.map.get(updater.config.key);
          my.updaters[idx].config.ref = config; // Ensure the config test value is valid

          var configValues = Array.isArray(updater.config.value) ? updater.config.value : [updater.config.value];
          configValues.forEach(function (configValue) {
            if (!config.variant.ref.has(configValue)) {
              throw new Error("GenomeArray Node '".concat(my.node.key, "' updater ").concat(idx, " config Node '").concat(updater.config.key, "' references invalid value '").concat(configValue, "'\nOptions are: ").concat(config.variant.ref.options()));
            }
          });
        } // Ensure the methodKey is valid


        if (!dag.method.map.has(updater.method.key)) {
          throw new Error("GenomeArray Node '".concat(my.node.key, "' updater ").concat(idx, " has unknown method '").concat(updater.method.key, "'"));
        }

        my.updaters[idx].method.ref = dag.method.map.get(updater.method.key);
      });
    });
  }
  /**
   * clone() helper function that decodes a single GenomeArray element
   * into a single Node instance
   * @param {Array} genome
   * @return A new Node instance
   */

  function createNode(genome) {
    var _genome = _slicedToArray(genome, 2),
        nodeKey = _genome[0],
        info = _genome[1]; // Variant information


    var variantArray = info[0];
    var variantString = variantArray[0]; // Variant strings look like 'Variant.SomeVariant'

    var variantKey = variantString.substring(8); // Updater information

    var updaterArray = info[1];
    var updaters = [];
    var foundFinally = false;
    updaterArray.forEach(function (option, idx) {
      var updater = new Updater();

      var _option = _toArray(option),
          condition = _option[0],
          conditionArgs = _option.slice(1);

      if (condition === 'when') {
        var _conditionArgs = _toArray(conditionArgs),
            configKey = _conditionArgs[0],
            op = _conditionArgs[1],
            value = _conditionArgs[2],
            methodKey = _conditionArgs[3],
            methodParms = _conditionArgs.slice(4);

        updater.config = {
          key: configKey,
          op: op,
          value: value,
          ref: null
        };
        updater.method = {
          key: methodKey,
          parms: methodParms,
          ref: null
        };
      } else if (condition === 'finally') {
        foundFinally = true;

        var _conditionArgs2 = _toArray(conditionArgs),
            _methodKey = _conditionArgs2[0],
            _methodParms = _conditionArgs2.slice(1);

        updater.method = {
          key: _methodKey,
          parms: _methodParms,
          ref: null
        };
      } else {
        throw new Error("GenomeArray Node '".concat(nodeKey, "' updater ").concat(idx, " has invalid condition '").concat(condition, "'"));
      }

      updaters.push(updater);
    });

    if (!updaters.length) {
      throw new Error("GenomeArray Node '".concat(nodeKey, "' has no updater method options"));
    }

    if (!foundFinally) {
      throw new Error("GenomeArray Node '".concat(nodeKey, "' has no 'finally' condition"));
    }

    return new Node(nodeKey, variantKey, updaters);
  }

  function generateArray(start, stop, step) {
    if (start === stop) {
      return [start];
    }

    if (step === 0) {
      return [start, stop];
    }

    step = Math.abs(step);
    var ar = [];
    var end = start < stop ? stop + step / 2 : stop - step / 2;

    if (start < stop) {
      for (var v = start; v <= end; v += step) {
        ar.push(v);
      }
    } else {
      // if (start > stop) {
      for (var _v = start; _v >= end; _v -= step) {
        ar.push(_v);
      }
    }

    return ar;
  }
  /**
   * Determines all the Dag's Nodes' applicable updater method
   * by iterating through all updater options until it finds one that meets the conditions.
   * If no condition is found, or the condition requires a method parm that is disabled,
   * its method becomes 'Dag.dangler'
   *
   * @param {Dag} dag
   */

  function resetMethods(dag) {
    dag.node.map.forEach(function (node) {
      if (node.status.isEnabled) {
        resetNodeMethods(dag, node);
      }
    });
  }
  /**
   * resetMethods() helper function the determine's a single Node's updater method
   * based upon current Dag configuration and the Node's definition.
   * @param {Dag} dag
   * @param {*} my
   */

  function resetNodeMethods(dag, node) {
    // const trackNode =
    //   'surface.primary.fuel.bed.dead.particle.class1.moistureContent'
    // const track = node.node.key === trackNode
    // let str = ''
    // if (track) str += `Tracking Node '${trackNode}'...\n`
    // Step 1 - find an Updater that meets current configuration
    var found = false;
    var len = node.updaters.length;

    for (var i = 0; i < len; i += 1) {
      var _node$updaters$i = node.updaters[i],
          config = _node$updaters$i.config,
          method = _node$updaters$i.method; // Always apply an Updater with a null config.key, and therefore a 'finally' condition

      if (config.key === null) {
        node.method = _objectSpread2({}, method);
        found = true;
        break;
      } else if (config.ref.status.isEnabled) {
        if (config.op === 'equals' && config.ref.value.current === config.value || config.op === 'includes' && config.value.includes(config.ref.value.current)) {
          node.method = _objectSpread2({}, method);
          found = true;
          break;
        }
      }
    } // DagPrivate.clone() should have caught the following error case, but still...


    if (!found) {
      // The following statement should never be executed
      throw new Error("Unable to find an Updater for Node '".concat(node.node.key, "'"));
    } // Step 2 - if an Updater was found, transform its parameters


    node.method.parms.forEach(function (parm, idx) {
      // Replace any nodeKey parms with their Node reference
      var parmNode = null;

      if (parm instanceof Node) {
        parmNode = parm;
      } else if (typeof parm === 'string' && dag.node.map.has(parm)) {
        parmNode = dag.node.map.get(parm);
      }

      if (parmNode) {
        // parm is a Node Key, so store its reference as the actual parameter
        if (!parmNode.status.isEnabled) {
          // can't use this updater since it requires a disabled Node value
          node.method = {
            key: 'Dag.dangler',
            parms: [],
            ref: dag.method.map.get('Dag.dangler')
          };
        } else {
          node.method.parms[idx] = parmNode;
        }
      } else {
        // parm is some other string, numeric, boolean, or object, so use it as a fixed parameter
        node.method.parms[idx] = parm;
      }
    });
  } // Determines the DAG topology given current Node enabled/disabled status,
  // configured updater methods, and providers/consumers.
  // Its OK to reset topology for disabled Nodes


  function resetTopology(dag) {
    dag.node.map.forEach(function (node) {
      return node.dag = {
        consumers: [],
        depth: 0,
        providers: []
      };
    });
    dag.node.map.forEach(function (node) {
      return resetNodeProviders(node);
    });
    dag.sorted.nodes = resetNodeDepths(dag); // \todo Determine if there are separate, independent DAGs present,
    // and put them in their own stack
    // const keyMap = Pathways.keyMap(dag)
    // const nPathways = keyMap.size
  }
  /**
   * resetTopology() helper function that determines all the Node's
   * provider Nodes, and assigns itself to its provider Node's as a consumer Node.
   *
   * Note: the node.method.parms property is a *mixed* array of Node references, Node keys,
   * function references, and/or literal objects and primitives passed to the node.method.
   * Its OK to determine providers of disabled Nodes
   *
   * @param {Node} node
   */

  function resetNodeProviders(node) {
    node.method.parms.forEach(function (parm) {
      if (parm instanceof Node) {
        node.dag.providers.push(parm);
        parm.dag.consumers.push(node);
      }
    });
  }
  /**
   * A resetTopology() helper function that returns a topologically sorted array
   * of the Dag Nodes, but with:
   *  - *input* Nodes deferred to the greatest depth allowed by their consumers (out edges)
   *  - *fixed* Nodes are run first and just once
   * Its OK to determine depths of disabled Nodes
   */


  function resetNodeDepths(dag) {
    // Step 1 - determine consumer-chain depth of each Node
    var maxDepth = 0;
    dag.node.map.forEach(function (node, key) {
      maxDepth = Math.max(maxDepth, consumerDepth(node, [key]));
    }); // Step 2 - ensure input Nodes are processed after all other Nodes at their depth
    // - non-input Nodes have an odd numbered level = 2 * depth - 1
    // - input Nodes have an even numbered level = 2 * depth

    var sorted = [];
    dag.node.map.forEach(function (node) {
      node.dag.depth = node.isInput() ? 2 * node.dag.depth - 1 : 2 * node.dag.depth;
      sorted.push(node);
    }); // Step 3 - topologically sort the Node array

    sorted.sort(function (n1, n2) {
      return n2.dag.depth - n1.dag.depth;
    });
    return sorted;
  }
  /**
   * A resetNodeDepths() helper function (and therefore, also a resetTopology() helper function)
   * that returns the Node's depth, calculating it first, if necessary
   * (Its OK to determine depths of disabled Nodes)
   * @param {Node} node
   * @param {bool} visited
   */


  function consumerDepth(node, visited) {
    // If this Node doesn't yet have a depth, derive it
    if (!node.dag.depth) {
      var maxDepth = 0;
      node.dag.consumers.forEach(function (consumer) {
        if (visited.includes(consumer.node.key)) {
          visited.push(consumer.node.key);
          throw new Error("Cyclical dependency detected:\n".concat(visited.join(' required by ->\n')));
        }

        visited.push(consumer.node.key);
        var depth = consumerDepth(consumer, visited);
        visited.pop();
        maxDepth = Math.max(depth, maxDepth);
      });
      node.dag.depth = maxDepth + 1;
    }

    return node.dag.depth;
  }
  /**
   * Sets the status.isRequired flag of all Nodes required by the status.isSelected Nodes,
   * and then sets Dag.sorted.required as an array of the currently isRequired Nodes
   * in topological order.
   * @param {Dag} dag
   */


  function resetStatusRequired(dag) {
    // Reset all status.isRequired flags to false
    dag.node.map.forEach(function (node) {
      return node.status.isRequired = false;
    }); // Recursively set status.isRequired from each node.status.isSelected

    dag.node.map.forEach(function (node) {
      if (node.status.isSelected && node.status.isEnabled) {
        resetStatusRequiredRecursive(node);
      }
    }); // Store the topologically-ordered required Nodes in the Dag

    dag.sorted.required = dag.sorted.nodes.filter(function (node) {
      return node.status.isEnabled && node.status.isRequired;
    });
  }
  /**
   * A resetStatusRequired() helper recursive function
   * that first sets node.status.isRequired,
   * then recursively ensures its providers are also set to isRequired
   * @param {Node} node
   */

  function resetStatusRequiredRecursive(node) {
    if (node.status.isEnabled) {
      if (!node.status.isRequired) {
        node.status.isRequired = true; // Set isRequired for every Config Node used by this Node

        node.updaters.forEach(function (updater) {
          if (updater.config.ref !== null && updater.config.ref.status.isEnabled) {
            updater.config.ref.status.isRequired = true; // Should we push non-redundnant consumers onto the config's consumer array??
          }
        });
        node.dag.providers.forEach(function (provider) {
          return resetStatusRequiredRecursive(provider);
        });
      }
    }
  }

  function update(dag) {
    resetStatusRequired(dag);
    updateInit(dag);
    return dag.result.mode === 'orthogonal' ? updateOrthogonal(dag) : updateCasewise(dag);
  } // Called privately by batchUpdate() and caseUpdate()

  function updateInit(dag) {
    // Include all input Nodes and all selected Nodes in the results
    dag.result.nodes = [].concat(_toConsumableArray(dag.requiredInputNodes()), _toConsumableArray(dag.selectedNodes())); // Clear the result values of every Dag Node

    dag.sorted.nodes.forEach(function (node) {
      node.value.run = [];
    }); // Ensure every input Node has at least 1 input value

    dag.requiredInputNodes().forEach(function (node) {
      if (!node.input.values.length) {
        node.input.values = [node.value.current];
      }
    });
  }
  /**
   * Generates a set of case-wise results for the current Node.input.values
   *
   * Results are stored for all the required input Nodes and all the
   * selected Nodes in their individual Node.value.run[] array.
   *
   * Dag.result.nodes is an array of references to all the result Nodes.
   *
   * The number of case results is determined by the input Node with
   * the largest number of case values.  If an input Node has fewer
   * case values than the number of cases, its last case value is applied.
   *
   * For example, if fuel model has 2 input values, 1-h dead moisture has 3 input values,
   * and wind speed has 4 input values, then 4 results are generated.
   *
   * @param {Dag} dag
   */


  function updateCasewise(dag) {
    // Store the current input values in the cases[] array
    var inputNodes = dag.requiredInputNodes();
    inputNodes.forEach(function (node) {
      return node.input.cases = _toConsumableArray(node.input.values);
    }); // Determine the maximum number of cases

    var cases = inputNodes.reduce(function (acc, node) {
      return Math.max(acc, node.input.values.length);
    }, 0); // Move each case into the input values

    var _loop = function _loop(i) {
      inputNodes.forEach(function (node) {
        var idx = Math.min(i, node.input.cases.length - 1);
        node.input.values = [node.input.cases[idx]];
      });
      updateRecursive(dag, 0);
    };

    for (var i = 0; i < cases; i += 1) {
      _loop(i);
    } // Restore the input values


    inputNodes.forEach(function (node) {
      return node.input.values = _toConsumableArray(node.input.cases);
    });
  }
  /**
   * Generates a set of result values for all combinations of input values.
   *
   * For example, if fuel model has 2 input values, 1-h dead moisture has 3 input values,
   * and wind speed has 4 input values, then 2 x 3 x 4 = 24 results are generated.
   *
   * Results are stored for all the required input Nodes and all the
   * selected Nodes in their individual Node.value.run[] array.
   *
   * Dag.result.nodes is an array of references to all the result Nodes.
   *
   * @param {Dag} dag
   */

  function updateOrthogonal(dag) {
    updateRecursive(dag, 0);
  }

  function updateRecursive(dag, idx) {
    if (idx === dag.sorted.required.length) {
      dag.result.nodes.forEach(function (node) {
        return node.value.run.push(node.value.current);
      });
      return;
    }

    var node = dag.sorted.required[idx];

    if (node.isInput()) {
      node.input.values.forEach(function (value) {
        node.value.current = value;
        updateRecursive(dag, idx + 1);
      });
    } else {
      node.updateValue();
      updateRecursive(dag, idx + 1);
    }
  }

  /**
   * Root class contains shared data for multiple Dags.
   */

  var Root = /*#__PURE__*/function () {
    function Root(genomeArray, variantMapConstructor, methodMap) {
      var translationMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      _classCallCheck(this, Root);

      this.shared = {
        genomeArray: genomeArray,
        variantMapConstructor: variantMapConstructor,
        methodMap: methodMap,
        translationMap: translationMap
      };
      this.dag = {};
    }

    _createClass(Root, [{
      key: "addDag",
      value: function addDag(dagKey) {
        this.dag[dagKey] = new Dag(this, dagKey, this.shared.genomeArray, new this.shared.variantMapConstructor(), this.shared.methodMap, this.shared.translationMap);
        return this.dag[dagKey];
      }
    }]);

    return Root;
  }();
  /**
   * A class defining all the Dag data structures
   * and its client-accessible (public) methods.
   *
   * Note: all non-public methods are in DagPrivate.js
   */

  var Dag = /*#__PURE__*/function () {
    function Dag(root, dagKey, genomeArray, variantMap, methodMap) {
      var translationMap = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

      _classCallCheck(this, Dag);

      this.id = {
        root: root,
        self: dagKey
      };
      this.method = {
        map: methodMap
      };
      this.node = {
        map: new Map()
      };
      this.result = {
        mode: 'orthogonal',
        nodes: []
      };
      this.sorted = {
        nodes: [],
        // includes disabled Nodes
        required: [] // includes only required && enabled Nodes

      };
      this.translation = {
        map: translationMap
      };
      this.variant = {
        map: variantMap
      };
      clone(this, genomeArray); // Generate the sorted node list

      this.runConfigs([]);
    }
    /**
     * Sets all Node.status.isSelected flags to false.
     */


    _createClass(Dag, [{
      key: "clearSelected",
      value: function clearSelected() {
        var update = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this.node.map.forEach(function (node) {
          return node.status.isSelected = false;
        });

        if (update) {
          resetStatusRequired(this);
          updateOrthogonal(this);
        }
      }
    }, {
      key: "danglerNodes",
      value: function danglerNodes() {
        var ar = [];
        this.node.map.forEach(function (node) {
          if (node.method.key === 'Dag.dangler') {
            ar.push(node);
          }
        });
        return ar;
      }
      /**
       * @return An array of all enabled (or disabled) Nodes in topological order.
       */

    }, {
      key: "enabledNodes",
      value: function enabledNodes() {
        var isEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var ar = [];
        this.node.map.forEach(function (node) {
          if (node.status.isEnabled === isEnabled) {
            ar.push(node);
          }
        });
        return ar;
      }
      /**
       * @param {string} nodeKey
       * @return A reference to the Node with the Node.node.key matching `nodeKey`
       */

    }, {
      key: "get",
      value: function get(nodeKey) {
        if (!this.node.map.has(nodeKey)) {
          throw new Error("Dag.get('".concat(nodeKey, ") has no such Node"));
        }

        return this.node.map.get(nodeKey);
      }
      /**
       * @return An array of all required Config Nodes in topological order.
       */

    }, {
      key: "requiredConfigNodes",
      value: function requiredConfigNodes() {
        return this.sorted.required.filter(function (node) {
          return node.method.key === 'Dag.config';
        });
      }
      /**
       * @return An array of all required input Nodes in topological order.
       */

    }, {
      key: "requiredInputNodes",
      value: function requiredInputNodes() {
        return this.sorted.required.filter(function (node) {
          return ['Dag.input', 'Dag.dangler'].includes(node.method.key);
        });
      }
      /**
       * @return An array of all required (including selected and Config) Nodes in topological order.
       */

    }, {
      key: "requiredNodes",
      value: function requiredNodes() {
        return this.sorted.required;
      }
      /**
       * @returns An array of all required, updatable (non-Config) Node references in topological order.
       */

    }, {
      key: "requiredUpdateNodes",
      value: function requiredUpdateNodes() {
        return this.sorted.required.filter(function (node) {
          return node.method.key !== 'Dag.config';
        });
      }
      /**
       * Sets the current value of zero or more Config Nodes and updates the Dag.
       * @param {Array} keyValuePairs An array of Config Node keyOrRef-value pairs
       * @param {bool} update If true, the Dag is reconfigured, a new topology is determined,
       *  and updateOrthogonal() is called to update all Node values.
       */

    }, {
      key: "runConfigs",
      value: function runConfigs(keyValuePairs) {
        this.setConfigs(keyValuePairs);
        update(this);
      }
    }, {
      key: "runEnabled",
      value: function runEnabled(keyPrefix, isEnabled) {
        this.setEnabled(keyPrefix, isEnabled);
        update(this);
      }
      /**
       * Returns an array of result run indices that satisfy the input-value pair specs
       * @param {*} inputValues An array of input nodeKey => value specifications
       * @param {*} possible Null on client invocation
       */

    }, {
      key: "runIndices",
      value: function runIndices(inputValues) {
        var node = asNodeRef(this, inputValues[0][0]);
        var possible = node.value.run.map(function (val, idx) {
          return idx;
        });
        return possible.length ? this.runIndicesRecursive(inputValues, possible) : [];
      }
    }, {
      key: "runIndicesRecursive",
      value: function runIndicesRecursive(inputValues, possible) {
        var _inputValues$shift = inputValues.shift(),
            _inputValues$shift2 = _slicedToArray(_inputValues$shift, 2),
            nodeKeyOrRef = _inputValues$shift2[0],
            specValue = _inputValues$shift2[1];

        var node = asNodeRef(this, nodeKeyOrRef);
        var remaining = possible.filter(function (idx) {
          return node.value.run[idx] === specValue;
        });
        return inputValues.length && remaining.length ? this.runIndicesRecursive(inputValues, remaining) : remaining;
      }
      /**
       * Sets the inputs values of zero or more input Nodes AND updates the Dag.
       * @param {Array} keyValuePairs An array of input Node keyOrRef-valueArray pairs
       * @param {bool} update If true, updateOrthogonal() is called to update all Node values.
       */

    }, {
      key: "runInputs",
      value: function runInputs(keyValuePairs) {
        this.setInputs(keyValuePairs);
        update(this);
      }
      /**
       * Sets the Node.status.isSelected flags of zero or more Nodes AND updates the Dag.
       * @param {Array} keyValuePairs An array of Node keyOrRef-isSelected pairs
       */

    }, {
      key: "runSelected",
      value: function runSelected(keyValuePairs) {
        this.setSelected(keyValuePairs);
        update(this);
      }
    }, {
      key: "setEnabled",
      value: function setEnabled(keyPrefix, isEnabled) {
        this.node.map.forEach(function (node, nodeKey) {
          if (nodeKey.startsWith(keyPrefix)) {
            node.status.isEnabled = isEnabled;
          }
        });
        resetMethods(this);
        resetTopology(this);
      }
    }, {
      key: "setModeCasewise",
      value: function setModeCasewise() {
        this.result.mode = 'casewise';
      }
    }, {
      key: "setModeOrthogonal",
      value: function setModeOrthogonal() {
        this.result.mode = 'orthogonal';
      }
      /**
       *  @return An array of all selected Nodes in topological order.
       */

    }, {
      key: "selectedNodes",
      value: function selectedNodes() {
        return this.sorted.required.filter(function (node) {
          return node.status.isSelected;
        });
      }
      /**
       * Sets the current value of zero or more Config Nodes WITHOUT updating the Dag.
       * @param {Array} keyValuePairs An array of Config Node keyOrRef-value pairs
       */

    }, {
      key: "setConfigs",
      value: function setConfigs(keyValuePairs) {
        var _this = this;

        keyValuePairs.forEach(function (pair) {
          var _pair = _slicedToArray(pair, 2),
              nodeKeyOrRef = _pair[0],
              value = _pair[1];

          var node = asNodeRef(_this, nodeKeyOrRef);

          if (node.status.isEnabled) {
            node.value.current = value;
          }
        });
        resetMethods(this);
        resetTopology(this);
      }
      /**
       * Sets the inputs values of zero or more input Nodes WITHOUT updating the Dag.
       * @param {Array} keyValuePairs An array of input Node keyOrRef-valueArray pairs
       */

    }, {
      key: "setInputs",
      value: function setInputs(keyValuePairs) {
        var _this2 = this;

        keyValuePairs.forEach(function (pair) {
          var _pair2 = _slicedToArray(pair, 2),
              nodeKeyOrRef = _pair2[0],
              value = _pair2[1];

          var node = asNodeRef(_this2, nodeKeyOrRef);

          if (node.status.isEnabled) {
            node.input.values = Array.isArray(value) ? value : [value];
          }
        });
      }
      /**
       * Sets the Node.status.isSelected flags of zero or more Nodes WITHOUT updating the Dag.
       * @param {Array} keyValuePairs An array of Node keyOrRef-isSelected pairs
       */

    }, {
      key: "setSelected",
      value: function setSelected(keyValuePairs) {
        var _this3 = this;

        keyValuePairs.forEach(function (pair) {
          var _pair3 = _slicedToArray(pair, 2),
              nodeKeyOrRef = _pair3[0],
              isSelected = _pair3[1];

          var node = asNodeRef(_this3, nodeKeyOrRef);

          if (node.status.isEnabled) {
            node.status.isSelected = isSelected;
          }
        });
      }
      /**
       * @return An array of all Nodes in topological order.
       */

    }, {
      key: "sortedNodes",
      value: function sortedNodes() {
        return this.sorted.nodes;
      }
      /**
       * String translation utility.
       *
       * @param {string} key Translation table lookup key
       * @param {string} lang Language string, such as 'en_US'
       * @return If the translation Map has translation key <key>.<lang>,
       * the translation key's value is returned.  If not,
       * the 'dflt' argument string is returned, unless it is null,
       * in which case the 'key' string argument is returned.
       */

    }, {
      key: "tr",
      value: function tr(key, lang) {
        var dflt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var trKey = key + '@' + lang;

        if (this.translation.map.has(trKey)) {
          return this.translation.map.get(trKey);
        }

        return dflt === null ? key : dflt;
      }
    }]);

    return Dag;
  }();

  /**
   * Returns a Map containing each of the independent pathways through the Dag,
   * which depends upon the current set of selected Nodes.
   *
   * This function first creates the provider pathway of each selected Dag Node,
   * then merges together those pathways with common provider Nodes.
   *
   * The returned Map has one entry for each independent pathway.
   * The map entry key is one of the selected Node keys,
   * and the entry value is an object containing:
   *  - an array of the selected Nodes that share this common pathway, and
   *  - an array of all the provider Nodes for this pathway, in topological order
   *
   * A DAG batch processor can step through the Map, running each pathway
   * independently, so that no unnecessary iteration occurs.
   *
   * Consider the case where a DAG has two independent pathways.
   * The first independent pathway has a selected Node at level 2, and its only other
   * required Node is its immediate provider input Node at level 1.
   *
   * The second pathway is more lengthy and complex (a typical surface fire DAG
   * would have 500 required Nodes with 10 inputs going as deep as 80 levels)
   *
   * If the first pathway's sole input has, for example, 1000 input values,
   * and the second pathways has 4 inputs with 10 values each,
   * the entire DAG could be iterated 1000 * (10 * 10 * 10 * 10) = 10,000,000 times,
   * when it could be run sequentially 1000 + (10 * 10 * 10 * 10) = 11,000 times.
   *
   * @param {*} dag
   * @return {Map} A map with 1 entry per independent pathway:
   * {
   *    key: one of this path's selected Node keys
   *    value: {
   *      providers: [],  // an array of this pathway's provider Node keys (or references) in topological order
   *      selected: [],   // an array of keys (or references) to the selected Nodes using this path
   *    }
   * }
   */
  function keyMap(dag) {
    // Construct a Map with a key for each required Node in the Dag
    // and whose value is an array of booleans, one for each of the Dag's selected Node.
    // The boolean is set TRUE if the required Node (key) is a provider of the selected Node.
    var selectedNodes = dag.selectedNodes();
    var usedByTemplate = Array(selectedNodes.length).fill(false);
    var requiredMap = new Map();
    dag.requiredUpdateNodes().forEach(function (node) {
      requiredMap.set(node.node.key, _toConsumableArray(usedByTemplate));
    }); // Walk each selected Node's provider pathway, mapping its provider Nodes

    selectedNodes.forEach(function (node, selectIdx) {
      mapProviders(requiredMap, node, selectIdx);
    }); // Merge selected Node pathways that share common required Nodes

    var mergedMap = new Map(); // Map of merged selected Node pathway sets

    requiredMap.forEach(function (usedByArray) {
      // Get the indices of all its user selected Node
      var users = [];
      usedByArray.forEach(function (isUsed, idx) {
        if (isUsed) users.push(idx);
      });

      if (users.length > 1) {
        // If this Node is a provider to more than 1 selected Node,
        mergeLineages(requiredMap, users); // merge them

        var targetKey = selectedNodes[users[0]].node.key; // Keep track of where selected Nodes are merged

        if (!mergedMap.has(targetKey)) {
          mergedMap.set(targetKey, new Set());
        }

        var set = mergedMap.get(targetKey);
        users.forEach(function (idx) {
          set.add(selectedNodes[idx].node.key);
        });
      }
    }); // Transform into a Map of selected Node Keys and their provider Node keys

    var selectedMap = new Map();
    selectedNodes.forEach(function (node) {
      selectedMap.set(node.node.key, {
        providers: [],
        selected: []
      });
    });
    requiredMap.forEach(function (usedByArray, key) {
      usedByArray.forEach(function (isUsed, idx) {
        if (isUsed) {
          selectedMap.get(selectedNodes[idx].node.key).providers.push(key);
        }
      });
    }); // Remove empty lineages

    var empty = [];
    selectedMap.forEach(function (data, key) {
      if (!data.providers.length) empty.push(key);
    });
    empty.forEach(function (key) {
      selectedMap.delete(key);
    }); // Add merged selections

    selectedMap.forEach(function (data, key) {
      data.selected = mergedMap.has(key) ? Array.from(mergedMap.get(key)) : [key];
    }); // Return the disjoint sets

    return selectedMap;
  }
  /**
   * Same as keyMap() but all provider and selected Nodes are Node references instead of key strings
   *
   * @param {} dag
   */

  function nodeMap(dag) {
    var map = keyMap(dag);
    map.forEach(function (path) {
      path.providers = path.providers.map(function (key) {
        return dag.get(key);
      });
      path.selected = path.selected.map(function (key) {
        return dag.get(key);
      });
    });
    return map;
  }
  /**
   *
   * @param {*} map The Map of [required Node keys => selected Node array]
   * @param {*} node The Node being added to the Map
   * @param {*} selectIdx The index of the selected Node for which this Node is a provider
   */

  function mapProviders(map, node, selectIdx) {
    var values = map.get(node.node.key);
    values[selectIdx] = true;
    node.dag.providers.forEach(function (provider) {
      mapProviders(map, provider, selectIdx);
    });
  }
  /**
   * Combines two or more common lineages into the first lineage.
   *
   * The passed Map is mutated inplace.
   *
   * @param {*} map The Map of [required Node keys => selected Node array]
   * @param {*} users An array of the selected Node indices to be merged
   */


  function mergeLineages(requiredMap, users) {
    // Merge the common pathways into the first pathway
    var target = users[0]; // Examine every required Node in the Map

    requiredMap.forEach(function (usedByArray) {
      // Examine each of the selected Nodes to be merged
      users.forEach(function (idx) {
        // If this required Node is a provider to this selected Node
        if (usedByArray[idx]) {
          // Merge this selected Node's pathway with the first selected Node
          usedByArray[target] = true;
          usedByArray[idx] = false;
        }
      });
    });
  }

  var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Dag: Dag,
    Root: Root,
    generateArray: generateArray,
    keyMap: keyMap,
    nodeMap: nodeMap
  });

  var genome = [['configure.fuel.primary', [['Variant.ConfigPrimaryFuels'], [['finally', 'Dag.config']]]], ['configure.fuel.secondary', [['Variant.ConfigSecondaryFuels'], [['finally', 'Dag.config']]]], ['configure.fuel.moisture', [['Variant.ConfigMoistureContents'], [['finally', 'Dag.config']]]], ['configure.fuel.windSpeedAdjustmentFactor', [['Variant.ConfigWindSpeedAdjustmentFactor'], [['finally', 'Dag.config']]]], ['configure.fuel.curedHerbFraction', [['Variant.ConfigCuredHerbFraction'], [['finally', 'Dag.config']]]], ['configure.fuel.chaparralTotalLoad', [['Variant.ConfigChaparralTotalLoad'], [['finally', 'Dag.config']]]], // end 'configure.fuel'
  ['configure.module', [['Variant.ConfigModule'], [['finally', 'Dag.config']]]], ['configure.slope.steepness', [['Variant.ConfigSlopeSteepness'], [['finally', 'Dag.config']]]], // end 'configure.slope'
  ['configure.wind.direction', [['Variant.ConfigWindDirection'], [['finally', 'Dag.config']]]], ['configure.wind.speed', [['Variant.ConfigWindSpeed'], [['finally', 'Dag.config']]]], // end 'configure.wind'
  ['configure.fire.firelineIntensity', [['Variant.ConfigFirelineIntensity'], [['finally', 'Dag.config']]]], ['configure.fire.lengthToWidthRatio', [['Variant.ConfigFireLengthToWidthRatio'], [['finally', 'Dag.config']]]], ['configure.fire.effectiveWindSpeedLimit', [['Variant.ConfigEffectiveWindSpeedLimit'], [['finally', 'Dag.config']]]], ['configure.fire.weightingMethod', [['Variant.ConfigFireWeightingMethod'], [['finally', 'Dag.config']]]], ['configure.fire.vector', [['Variant.ConfigFireVector'], [['finally', 'Dag.config']]]] // end 'configure.fire'
  // end 'configure.crown'
  // end 'configs'
  ];

  function extinctionMoistureContent(prefix, life) {
    if (life === 'dead') {
      return prefix === 'crown.canopy.fuel' ? ['crown.canopy.fuel.bed.dead.extinction.moistureContent', [['Variant.FuelMoistureContent'], [['finally', 'Dag.fixed', 0.25]]]] : ["".concat(prefix, ".bed.").concat(life, ".extinction.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.").concat(life, ".extinction.moistureContent"), 0.3, 0.4, 0.25]]]];
    }

    return ["".concat(prefix, ".bed.live.extinction.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelBed.extinctionMoistureContent', "".concat(prefix, ".bed.live.extinction.moistureContentFactor"), "".concat(prefix, ".bed.dead.effectiveFuel.moistureContent"), "".concat(prefix, ".bed.dead.extinction.moistureContent")]]]];
  }
  function genome$1(prefix, life) {
    return [["".concat(prefix, ".bed.").concat(life, ".surfaceArea"), [['Variant.FuelSurfaceArea'], [['finally', 'Calc.sum', "".concat(prefix, ".bed.").concat(life, ".particle.class1.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.surfaceArea")]]]], ["".concat(prefix, ".bed.").concat(life, ".surfaceArea.weightingFactor"), [['Variant.WeightingFactor'], [['finally', 'Calc.divide', "".concat(prefix, ".bed.").concat(life, ".surfaceArea"), "".concat(prefix, ".bed.surfaceArea")]]]], ["".concat(prefix, ".bed.").concat(life, ".mineralDamping"), [['Variant.FireDampingCoefficient'], [['finally', 'FuelBed.mineralDamping', "".concat(prefix, ".bed.").concat(life, ".effective.mineralContent")]]]], ["".concat(prefix, ".bed.").concat(life, ".moistureDamping"), [['Variant.FireDampingCoefficient'], [['finally', 'FuelBed.moistureDamping', "".concat(prefix, ".bed.").concat(life, ".moistureContent"), "".concat(prefix, ".bed.").concat(life, ".extinction.moistureContent")]]]], ["".concat(prefix, ".bed.").concat(life, ".heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Calc.sumOfProducts', "".concat(prefix, ".bed.").concat(life, ".particle.class1.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class1.heatOfCombustion"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.heatOfCombustion"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.heatOfCombustion"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.heatOfCombustion"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.heatOfCombustion")]]]], ["".concat(prefix, ".bed.").concat(life, ".ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Calc.sum', "".concat(prefix, ".bed.").concat(life, ".particle.class1.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.ovendryLoad")]]]], ["".concat(prefix, ".bed.").concat(life, ".effectiveFuel.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Calc.sum', "".concat(prefix, ".bed.").concat(life, ".particle.class1.effectiveFuel.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.effectiveFuel.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.effectiveFuel.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.effectiveFuel.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.effectiveFuel.ovendryLoad")]]]], ["".concat(prefix, ".bed.").concat(life, ".effectiveFuel.waterLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Calc.sum', "".concat(prefix, ".bed.").concat(life, ".particle.class1.effectiveFuel.waterLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.effectiveFuel.waterLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.effectiveFuel.waterLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.effectiveFuel.waterLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.effectiveFuel.waterLoad")]]]], // Dead and Live categories have different methods and args...
    extinctionMoistureContent(prefix, life), // only actually used by the 'live' fuel category, but included here for simplicity...
    ["".concat(prefix, ".bed.").concat(life, ".extinction.moistureContentFactor"), [['Variant.Float'], [['finally', 'FuelBed.extinctionMoistureContentFactor', "".concat(prefix, ".bed.dead.effectiveFuel.ovendryLoad"), "".concat(prefix, ".bed.live.effectiveFuel.ovendryLoad")]]]], ["".concat(prefix, ".bed.").concat(life, ".moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Calc.sumOfProducts', "".concat(prefix, ".bed.").concat(life, ".particle.class1.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class1.moistureContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.moistureContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.moistureContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.moistureContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.moistureContent")]]]], ["".concat(prefix, ".bed.").concat(life, ".effectiveFuel.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Calc.divide', "".concat(prefix, ".bed.").concat(life, ".effectiveFuel.waterLoad"), "".concat(prefix, ".bed.").concat(life, ".effectiveFuel.ovendryLoad")]]]], ["".concat(prefix, ".bed.").concat(life, ".volume"), [['Variant.FuelBedDepth'], [['finally', 'Calc.sum', "".concat(prefix, ".bed.").concat(life, ".particle.class1.volume"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.volume"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.volume"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.volume"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.volume")]]]], ["".concat(prefix, ".bed.").concat(life, ".heatOfPreignition"), [['Variant.FuelHeatOfPreignition'], [['finally', 'Calc.sumOfProducts', "".concat(prefix, ".bed.").concat(life, ".particle.class1.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class1.heatOfPreignition"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.heatOfPreignition"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.heatOfPreignition"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.heatOfPreignition"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.heatOfPreignition")]]]], ["".concat(prefix, ".bed.").concat(life, ".reactionIntensity"), [['Variant.FireReactionIntensity'], [['finally', 'Calc.multiply', "".concat(prefix, ".bed.").concat(life, ".reactionIntensityDry"), "".concat(prefix, ".bed.").concat(life, ".moistureDamping")]]]], ["".concat(prefix, ".bed.").concat(life, ".reactionIntensityDry"), [['Variant.FireReactionIntensity'], [['finally', 'FuelBed.reactionIntensityDry', "".concat(prefix, ".bed.reactionVelocityOptimum"), "".concat(prefix, ".bed.").concat(life, ".net.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".heatOfCombustion"), "".concat(prefix, ".bed.").concat(life, ".mineralDamping")]]]], ["".concat(prefix, ".bed.").concat(life, ".surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Calc.sumOfProducts', "".concat(prefix, ".bed.").concat(life, ".particle.class1.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class1.surfaceAreaToVolumeRatio"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.surfaceAreaToVolumeRatio"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.surfaceAreaToVolumeRatio"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.surfaceAreaToVolumeRatio"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.").concat(life, ".effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Calc.sumOfProducts', "".concat(prefix, ".bed.").concat(life, ".particle.class1.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class1.effective.mineralContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.effective.mineralContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.effective.mineralContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.effective.mineralContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.effective.mineralContent")]]]], ["".concat(prefix, ".bed.").concat(life, ".sizeClass.weightingFactor"), [['Variant.WeightingFactor'], [['finally', 'FuelBed.sizeClassWeightingFactorArray', "".concat(prefix, ".bed.").concat(life, ".particle.class1.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class1.sizeClass"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.sizeClass"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.sizeClass"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.sizeClass"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.sizeClass")]]]], ["".concat(prefix, ".bed.").concat(life, ".net.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Calc.sumOfProducts', "".concat(prefix, ".bed.").concat(life, ".particle.class1.sizeClass.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.sizeClass.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.sizeClass.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.sizeClass.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.sizeClass.weightingFactor"), "".concat(prefix, ".bed.").concat(life, ".particle.class1.net.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class2.net.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class3.net.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class4.net.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class5.net.ovendryLoad")]]]]];
  }

  function derived(prefix, life, idx) {
    var dead = [["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".effectiveFuel.waterLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.effectiveFuelWaterLoad', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".effectiveFuel.ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".moistureContent")]]]]];
    var both = [// [`${prefix}.bed.${life}.particle.class${idx}.cylindricalDiameter`,
    // [[`Variant.FuelCylindricalDiameter`], [
    //   [`finally`, `FuelParticle.cylindricalDiameter`,
    //     `${prefix}.bed.${life}.particle.class${idx}.surfaceAreaToVolumeRatio`]
    // ]]],
    ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".effectiveFuel.heatingNumber"), [['Variant.FuelEffectiveHeatingNumber'], [['finally', 'FuelParticle.effectiveHeatingNumber', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".effectiveFuel.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.effectiveFuelLoad', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".surfaceAreaToVolumeRatio"), "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".ovendryLoad"), "".concat(life)]]]], ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".heatOfPreignition"), [['Variant.FuelHeatOfPreignition'], [['finally', 'FuelParticle.heatOfPreignition', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".moistureContent"), "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".effectiveFuel.heatingNumber")]]]], ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".net.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.netOvendryLoad', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".total.mineralContent")]]]], ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".sizeClass"), [['Variant.FuelSizeClassIndex'], [['finally', 'FuelParticle.sizeClass', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".sizeClass.weightingFactor"), [['Variant.WeightingFactor'], [['finally', 'FuelParticle.sizeClassWeightingFactor', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".sizeClass"), "".concat(prefix, ".bed.").concat(life, ".sizeClass.weightingFactor")]]]], ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".surfaceArea"), [['Variant.FuelSurfaceArea'], [['finally', 'FuelParticle.surfaceArea', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".surfaceAreaToVolumeRatio"), "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".fiberDensity")]]]], ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".surfaceArea.weightingFactor"), [['Variant.WeightingFactor'], [['finally', 'FuelParticle.surfaceAreaWeightingFactor', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".surfaceArea"), "".concat(prefix, ".bed.").concat(life, ".surfaceArea")]]]], ["".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".volume"), [['Variant.FuelVolume'], [['finally', 'FuelParticle.volume', "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".ovendryLoad"), "".concat(prefix, ".bed.").concat(life, ".particle.class").concat(idx, ".fiberDensity")]]]]];
    return life === 'dead' ? [].concat(both, dead) : both;
  }
  function dead1(prefix) {
    return [["".concat(prefix, ".bed.dead.particle.class1.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 46, 30, 32]]]], ["".concat(prefix, ".bed.dead.particle.class1.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.dead.heatOfCombustion"), 8000, 8300, 8000]]]], // [`${prefix}.bed.dead.particle.class1.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `Dead 1-h time-lag (0 to 0.25 inch diameter) branch wood`,
    //     `Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood`,
    //     `Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood`,
    //     `Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.dead.particle.class1.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.dead.tl1h.ovendryLoad"), "".concat(prefix, ".model.chaparral.derived.deadFineLoad"), "".concat(prefix, ".model.palmettoGallberry.derived.deadFineLoad"), "".concat(prefix, ".model.westernAspen.derived.dead.fine.ovendryLoad")]]]], ["".concat(prefix, ".bed.dead.particle.class1.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 'site.moisture.dead.tl1h', 'site.moisture.dead.tl1h', 'site.moisture.dead.tl1h', 'site.moisture.dead.tl1h']]]], ["".concat(prefix, ".bed.dead.particle.class1.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.dead.tl1h.surfaceAreaToVolumeRatio"), 640, 350, "".concat(prefix, ".model.westernAspen.derived.dead.fine.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.dead.particle.class1.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.015, 0.01, 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class1.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }
  function dead2(prefix) {
    return [["".concat(prefix, ".bed.dead.particle.class2.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 46, 30, 32]]]], ["".concat(prefix, ".bed.dead.particle.class2.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.dead.heatOfCombustion"), 8000, 8300, 8000]]]], // [`${prefix}.bed.dead.particle.class2.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `Dead 10-h time-lag (0.25 to 1 inch diameter) branch wood`,
    //     `Dead small 10-h time-lag (0.25 to 0.5 inch diameter) stem wood`,
    //     `Dead 10-h time-lag (0.25 to 1 inch diameter) stem wood`,
    //     `Dead 10-h time-lag (0.25 to 1 inch diameter) stem wood`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.dead.particle.class2.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.dead.tl10h.ovendryLoad"), "".concat(prefix, ".model.chaparral.derived.deadSmallLoad"), "".concat(prefix, ".model.palmettoGallberry.derived.deadSmallLoad"), "".concat(prefix, ".model.westernAspen.derived.dead.small.ovendryLoad")]]]], ["".concat(prefix, ".bed.dead.particle.class2.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 'site.moisture.dead.tl10h', 'site.moisture.dead.tl10h', 'site.moisture.dead.tl10h', 'site.moisture.dead.tl10h']]]], ["".concat(prefix, ".bed.dead.particle.class2.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 109, 127, 140, 109]]]], ["".concat(prefix, ".bed.dead.particle.class2.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.015, 0.01, 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class2.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }
  function dead3(prefix) {
    return [["".concat(prefix, ".bed.dead.particle.class3.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 46, 30, 32]]]], ["".concat(prefix, ".bed.dead.particle.class3.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.dead.heatOfCombustion"), 8000, 8300, 8000]]]], // [`${prefix}.bed.dead.particle.class3.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `Dead 100-h time-lag (1 to 3 inch diameter) branch wood`,
    //     `Dead medium 10-h time-lag (0.5 to 1 inch diameter) stem wood`,
    //     `Dead foliage`,
    //     `unused`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.dead.particle.class3.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.dead.tl100h.ovendryLoad"), "".concat(prefix, ".model.chaparral.derived.deadMediumLoad"), "".concat(prefix, ".model.palmettoGallberry.derived.deadFoliageLoad"), 0]]]], ["".concat(prefix, ".bed.dead.particle.class3.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 'site.moisture.dead.tl100h', 'site.moisture.dead.tl10h', 'site.moisture.dead.tl1h', 5]]]], ["".concat(prefix, ".bed.dead.particle.class3.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 30, 61, 2000, 1]]]], ["".concat(prefix, ".bed.dead.particle.class3.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.015, 0.01, 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class3.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }
  function dead4(prefix) {
    return [["".concat(prefix, ".bed.dead.particle.class4.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 46, 30, 32]]]], ["".concat(prefix, ".bed.dead.particle.class4.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.dead.heatOfCombustion"), 8000, 8300, 8000]]]], // [`${prefix}.bed.dead.particle.class4.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `Dead herb`,
    //     `Dead 100-h time-lag (1 to 3 inch diameter) stem wood`,
    //     `Litter layer`,
    //     `unused`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.dead.particle.class4.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.derived.dead.herb.ovendryLoad"), "".concat(prefix, ".model.chaparral.derived.deadLargeLoad"), "".concat(prefix, ".model.palmettoGallberry.derived.deadLitterLoad"), 0]]]], ["".concat(prefix, ".bed.dead.particle.class4.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 'site.moisture.dead.tl1h', 'site.moisture.dead.tl100h', 'site.moisture.dead.tl100h', 5]]]], ["".concat(prefix, ".bed.dead.particle.class4.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.herb.surfaceAreaToVolumeRatio"), 27, 2000, 1]]]], ["".concat(prefix, ".bed.dead.particle.class4.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.015, 0.01, 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class4.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }
  function dead5(prefix) {
    return [["".concat(prefix, ".bed.dead.particle.class5.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.dead.particle.class5.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.dead.particle.class5.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `Dag.fixed`, `unused`],
    // ]]],
    ["".concat(prefix, ".bed.dead.particle.class5.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".bed.dead.particle.class5.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.fixed', 5]]]], ["".concat(prefix, ".bed.dead.particle.class5.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 1]]]], ["".concat(prefix, ".bed.dead.particle.class5.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class5.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]]];
  }
  function live1(prefix) {
    return [["".concat(prefix, ".bed.live.particle.class1.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 46, 46, 32]]]], ["".concat(prefix, ".bed.live.particle.class1.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.heatOfCombustion"), 10500, 8300, 8000]]]], // [`${prefix}.bed.live.particle.class1.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `Live herb`,
    //     `Live fine (0 to 0.25 inch diameter) stem wood`,
    //     `Live 0 to 0.25 inch diameter stem wood`,
    //     `Live herb`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.live.particle.class1.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.derived.live.herb.ovendryLoad"), "".concat(prefix, ".model.chaparral.derived.liveFineLoad"), "".concat(prefix, ".model.palmettoGallberry.derived.liveFineLoad"), "".concat(prefix, ".model.westernAspen.derived.live.herb.ovendryLoad")]]]], ["".concat(prefix, ".bed.live.particle.class1.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 'site.moisture.live.herb', 'site.moisture.live.stem', 'site.moisture.live.stem', 'site.moisture.live.herb']]]], ["".concat(prefix, ".bed.live.particle.class1.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.herb.surfaceAreaToVolumeRatio"), 640, 350, 2800]]]], ["".concat(prefix, ".bed.live.particle.class1.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.015, 0.015, 0.01]]]], ["".concat(prefix, ".bed.live.particle.class1.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }
  function live2(prefix) {
    return [["".concat(prefix, ".bed.live.particle.class2.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 46, 46, 32]]]], ["".concat(prefix, ".bed.live.particle.class2.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.heatOfCombustion"), 9550, 8300, 8000]]]], // [`${prefix}.bed.live.particle.class2.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `Live stem wood`,
    //     `Live small (0.25 to 0.5 inch diameter) stem wood`,
    //     `Live 0.25 to 1 inch diameter stem wood`,
    //     `Live woody`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.live.particle.class2.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.stem.ovendryLoad"), "".concat(prefix, ".model.chaparral.derived.liveSmallLoad"), "".concat(prefix, ".model.palmettoGallberry.derived.liveSmallLoad"), "".concat(prefix, ".model.westernAspen.derived.live.stem.ovendryLoad")]]]], ["".concat(prefix, ".bed.live.particle.class2.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 'site.moisture.live.stem', 'site.moisture.live.stem', 'site.moisture.live.stem', 'site.moisture.live.stem']]]], ["".concat(prefix, ".bed.live.particle.class2.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.stem.surfaceAreaToVolumeRatio"), 127, 140, "".concat(prefix, ".model.westernAspen.derived.live.stem.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.live.particle.class2.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.015, 0.015, 0.01]]]], ["".concat(prefix, ".bed.live.particle.class2.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }
  function live3(prefix) {
    return [["".concat(prefix, ".bed.live.particle.class3.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 46, 46, 32]]]], ["".concat(prefix, ".bed.live.particle.class3.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.heatOfCombustion"), 9550, 8300, 8000]]]], // [`${prefix}.bed.live.particle.class3.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `unused`,
    //     `Live medium (0.5 to 1 inch diameter) stem wood`,
    //     `Live foliage`,
    //     `unused`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.live.particle.class3.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0, "".concat(prefix, ".model.chaparral.derived.liveMediumLoad"), "".concat(prefix, ".model.palmettoGallberry.derived.liveFoliageLoad"), 0]]]], ["".concat(prefix, ".bed.live.particle.class3.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 5, 'site.moisture.live.stem', 'site.moisture.live.stem', 5]]]], ["".concat(prefix, ".bed.live.particle.class3.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 1, 61, 2000, 1]]]], ["".concat(prefix, ".bed.live.particle.class3.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.015, 0.015, 0.01]]]], ["".concat(prefix, ".bed.live.particle.class3.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }
  function live4(prefix) {
    return [["".concat(prefix, ".bed.live.particle.class4.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 46, 46, 32]]]], ["".concat(prefix, ".bed.live.particle.class4.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.heatOfCombustion"), 9550, 8300, 8000]]]], // [`${prefix}.bed.live.particle.class4.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `unused`,
    //     `Live large (1 to 3 inch diameter) stem wood`,
    //     `unused`,
    //     `unused`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.live.particle.class4.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0, "".concat(prefix, ".model.chaparral.derived.liveLargeLoad"), 0, 0]]]], ["".concat(prefix, ".bed.live.particle.class4.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 5, 'site.moisture.live.stem', 5, 5]]]], ["".concat(prefix, ".bed.live.particle.class4.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 1, 27, 1, 1]]]], ["".concat(prefix, ".bed.live.particle.class4.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.015, 0.015, 0.01]]]], ["".concat(prefix, ".bed.live.particle.class4.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }
  function live5(prefix) {
    return [["".concat(prefix, ".bed.live.particle.class5.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 32, 32, 46, 32]]]], ["".concat(prefix, ".bed.live.particle.class5.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.live.heatOfCombustion"), 10500, 8300, 8000]]]], // [`${prefix}.bed.live.particle.class5.label`, [[`Variant.FuelLabelText`], [
    //   [`finally`, `FuelParticle.selectByDomain`,
    //     `${prefix}.model.domain`,
    //     `unused`,
    //     `Live leaves`,
    //     `unused`,
    //     `unused`,
    //   ]
    // ]]],
    ["".concat(prefix, ".bed.live.particle.class5.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0, "".concat(prefix, ".model.chaparral.derived.liveLeafLoad"), 0, 0]]]], ["".concat(prefix, ".bed.live.particle.class5.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 5, 'site.moisture.live.herb', 5, 5]]]], ["".concat(prefix, ".bed.live.particle.class5.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 1, 2200, 1, 1]]]], ["".concat(prefix, ".bed.live.particle.class5.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.01, 0.035, 0.015, 0.01]]]], ["".concat(prefix, ".bed.live.particle.class5.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), 0.0555, 0.055, 0.03, 0.055]]]]];
  }

  function genome$2(prefix) {
    return [].concat(_toConsumableArray(dead1(prefix)), _toConsumableArray(derived(prefix, 'dead', '1')), _toConsumableArray(dead2(prefix)), _toConsumableArray(derived(prefix, 'dead', '2')), _toConsumableArray(dead3(prefix)), _toConsumableArray(derived(prefix, 'dead', '3')), _toConsumableArray(dead4(prefix)), _toConsumableArray(derived(prefix, 'dead', '4')), _toConsumableArray(dead5(prefix)), _toConsumableArray(derived(prefix, 'dead', '5')), _toConsumableArray(live1(prefix)), _toConsumableArray(derived(prefix, 'live', '1')), _toConsumableArray(live2(prefix)), _toConsumableArray(derived(prefix, 'live', '2')), _toConsumableArray(live3(prefix)), _toConsumableArray(derived(prefix, 'live', '3')), _toConsumableArray(live4(prefix)), _toConsumableArray(derived(prefix, 'live', '4')), _toConsumableArray(live5(prefix)), _toConsumableArray(derived(prefix, 'live', '5')), _toConsumableArray(genome$1(prefix, 'dead')), _toConsumableArray(genome$1(prefix, 'live')), _toConsumableArray(bed(prefix)));
  }
  function bedFuelDepth(prefix) {
    return prefix === 'crown.canopy.fuel' ? ['crown.canopy.fuel.bed.depth', [['Variant.FuelBedDepth'], [['finally', 'Dag.fixed', 1]]]] : ["".concat(prefix, ".bed.depth"), [['Variant.FuelBedDepth'], [['finally', 'FuelParticle.selectByDomain', "".concat(prefix, ".model.domain"), "".concat(prefix, ".model.behave.parms.depth"), "".concat(prefix, ".model.chaparral.parms.observed.depth"), "".concat(prefix, ".model.palmettoGallberry.derived.depth"), "".concat(prefix, ".model.westernAspen.derived.depth")]]]];
  }
  function bed(prefix) {
    return [bedFuelDepth(prefix), ["".concat(prefix, ".bed.bulkDensity"), [['Variant.FuelBedBulkDensity'], [['finally', 'Calc.divide', "".concat(prefix, ".bed.ovendryLoad"), "".concat(prefix, ".bed.depth")]]]], ["".concat(prefix, ".bed.heatOfPreignition"), [['Variant.FuelBedHeatOfPreignition'], [['finally', 'Calc.sumOfProducts', "".concat(prefix, ".bed.dead.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.live.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.dead.heatOfPreignition"), "".concat(prefix, ".bed.live.heatOfPreignition")]]]], ["".concat(prefix, ".bed.heatSink"), [['Variant.FuelHeatSink'], [['finally', 'FuelBed.heatSink', "".concat(prefix, ".bed.heatOfPreignition"), "".concat(prefix, ".bed.bulkDensity")]]]], ["".concat(prefix, ".bed.noWindNoSlope.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'FuelBed.noWindNoSlopeSpreadRate', "".concat(prefix, ".bed.reactionIntensity"), "".concat(prefix, ".bed.propagatingFluxRatio"), "".concat(prefix, ".bed.heatSink")]]]], ["".concat(prefix, ".bed.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Calc.sum', "".concat(prefix, ".bed.dead.ovendryLoad"), "".concat(prefix, ".bed.live.ovendryLoad")]]]], ["".concat(prefix, ".bed.open.windSpeedAdjustmentFactor"), [['Variant.WindSpeedAdjustmentFraction'], [['finally', 'FuelBed.openWindSpeedAdjustmentFactor', "".concat(prefix, ".bed.depth")]]]], ["".concat(prefix, ".bed.packingRatio"), [['Variant.FuelBedPackingRatio'], [['finally', 'FuelBed.packingRatio', "".concat(prefix, ".bed.dead.volume"), "".concat(prefix, ".bed.live.volume"), "".concat(prefix, ".bed.depth")]]]], ["".concat(prefix, ".bed.packingRatio.optimum"), [['Variant.FuelBedPackingRatio'], [['finally', 'FuelBed.optimumPackingRatio', "".concat(prefix, ".bed.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.packingRatio.ratio"), [['Variant.FuelBedPackingRatio'], [['finally', 'Calc.divide', "".concat(prefix, ".bed.packingRatio"), "".concat(prefix, ".bed.packingRatio.optimum")]]]], ["".concat(prefix, ".bed.propagatingFluxRatio"), [['Variant.FirePropagatingFluxRatio'], [['finally', 'FuelBed.propagatingFluxRatio', "".concat(prefix, ".bed.surfaceAreaToVolumeRatio"), "".concat(prefix, ".bed.packingRatio")]]]], ["".concat(prefix, ".bed.reactionIntensity"), [['Variant.FireReactionIntensity'], [['finally', 'Calc.sum', "".concat(prefix, ".bed.dead.reactionIntensity"), "".concat(prefix, ".bed.live.reactionIntensity")]]]], ["".concat(prefix, ".bed.reactionVelocityExponent"), [['Variant.Float'], [['finally', 'FuelBed.reactionVelocityExponent', "".concat(prefix, ".bed.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.reactionVelocityMaximum"), [['Variant.FireReactionVelocity'], [['finally', 'FuelBed.reactionVelocityMaximum', "".concat(prefix, ".bed.savr15")]]]], ["".concat(prefix, ".bed.reactionVelocityOptimum"), [['Variant.FireReactionVelocity'], [['finally', 'FuelBed.reactionVelocityOptimum', "".concat(prefix, ".bed.packingRatio.ratio"), "".concat(prefix, ".bed.reactionVelocityMaximum"), "".concat(prefix, ".bed.reactionVelocityExponent")]]]], ["".concat(prefix, ".bed.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Calc.sumOfProducts', "".concat(prefix, ".bed.dead.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.live.surfaceArea.weightingFactor"), "".concat(prefix, ".bed.dead.surfaceAreaToVolumeRatio"), "".concat(prefix, ".bed.live.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.savr15"), [['Variant.Float'], [['finally', 'FuelBed.savr15', "".concat(prefix, ".bed.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".bed.surfaceArea"), [['Variant.FuelSurfaceArea'], [['finally', 'Calc.sum', "".concat(prefix, ".bed.dead.surfaceArea"), "".concat(prefix, ".bed.live.surfaceArea")]]]]];
  }

  function slopeRatio$1(prefix) {
    return prefix === 'crown.canopy.fuel' ? ["".concat(prefix, ".fire.slope.ratio"), [['Variant.SlopeSteepness'], [['finally', 'Dag.fixed', 0]]]] : ["".concat(prefix, ".fire.slope.ratio"), [['Variant.SlopeSteepness'], [['finally', 'Dag.bind', 'site.slope.steepness.ratio']]]];
  }
  function windHeadingFromUpslope(prefix) {
    return prefix === 'crown.canopy.fuel' ? ["".concat(prefix, ".fire.wind.heading.fromUpslope"), [['Variant.CompassAzimuth'], [['finally', 'Dag.fixed', 0]]]] : ["".concat(prefix, ".fire.wind.heading.fromUpslope"), [['Variant.CompassAzimuth'], [['finally', 'Dag.bind', 'site.wind.direction.heading.fromUpslope']]]];
  }
  function windSpeedAdjustmentFactor(prefix) {
    return prefix === 'crown.canopy.fuel' ? ["".concat(prefix, ".fire.windSpeedAdjustmentFactor"), [['Variant.WindSpeedAdjustmentFraction'], [['finally', 'Dag.fixed', 0.4]]]] : ["".concat(prefix, ".fire.windSpeedAdjustmentFactor"), [['Variant.WindSpeedAdjustmentFraction'], [['when', 'configure.fuel.windSpeedAdjustmentFactor', 'equals', 'input', 'Dag.bind', 'site.windSpeedAdjustmentFactor'], ['finally', 'SurfaceFire.windSpeedAdjustmentFactor', 'site.canopy.fuel.isSheltered', 'site.canopy.sheltered.windSpeedAdjustmentFactor', "".concat(prefix, ".bed.open.windSpeedAdjustmentFactor")]]]];
  }
  function genome$3(prefix) {
    return [["".concat(prefix, ".fire.maximumDirection.slope.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'SurfaceFire.maximumDirectionSlopeSpreadRate', "".concat(prefix, ".fire.noWindNoSlope.spreadRate"), "".concat(prefix, ".fire.slope.phi")]]]], ["".concat(prefix, ".fire.maximumDirection.wind.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'SurfaceFire.maximumDirectionWindSpreadRate', "".concat(prefix, ".fire.noWindNoSlope.spreadRate"), "".concat(prefix, ".fire.wind.phi")]]]], windHeadingFromUpslope(prefix), ["".concat(prefix, ".fire.maximumDirection.xComponent"), [['Variant.Float'], [['finally', 'SurfaceFire.maximumDirectionXComponent', "".concat(prefix, ".fire.maximumDirection.wind.spreadRate"), "".concat(prefix, ".fire.maximumDirection.slope.spreadRate"), "".concat(prefix, ".fire.wind.heading.fromUpslope")]]]], ["".concat(prefix, ".fire.maximumDirection.yComponent"), [['Variant.Float'], [['finally', 'SurfaceFire.maximumDirectionYComponent', "".concat(prefix, ".fire.maximumDirection.wind.spreadRate"), "".concat(prefix, ".fire.wind.heading.fromUpslope")]]]], ["".concat(prefix, ".fire.maximumDirection.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'SurfaceFire.maximumDirectionSpreadRate', "".concat(prefix, ".fire.maximumDirection.xComponent"), "".concat(prefix, ".fire.maximumDirection.yComponent")]]]], // end `${prefix}.fire.maximumDirection`
    ["".concat(prefix, ".fire.limit.effectiveWindSpeed.exceeded"), [['Variant.Bool'], [['finally', 'Calc.greaterThan', "".concat(prefix, ".fire.spread.step2.effectiveWindSpeed"), "".concat(prefix, ".fire.limit.effectiveWindSpeed")]]]], ["".concat(prefix, ".fire.limit.spreadRate.exceeded"), [['Variant.Bool'], [['finally', 'Calc.greaterThan', "".concat(prefix, ".fire.spread.step2.spreadRate"), "".concat(prefix, ".fire.spread.step3b.spreadRate")]]]], // end `${prefix}.fire.exceeded`
    ["".concat(prefix, ".fire.limit.effectiveWindSpeed"), [['Variant.WindSpeed'], [['finally', 'SurfaceFire.effectiveWindSpeedLimit', "".concat(prefix, ".fire.reactionIntensity")]]]], ["".concat(prefix, ".fire.limit.windSlopeSpreadRateCoefficient"), [['Variant.Float'], [['finally', 'SurfaceFire.windSlopeSpreadRateCoefficientLimit', "".concat(prefix, ".fire.limit.effectiveWindSpeed"), "".concat(prefix, ".fire.wind.factor.b"), "".concat(prefix, ".fire.wind.factor.k")]]]], ["".concat(prefix, ".fire.limit.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'SurfaceFire.maximumSpreadRate', "".concat(prefix, ".fire.noWindNoSlope.spreadRate"), "".concat(prefix, ".fire.limit.windSlopeSpreadRateCoefficient")]]]], // end `${prefix}.fire.limit`
    slopeRatio$1(prefix), ["".concat(prefix, ".fire.slope.k"), [['Variant.Float'], [['finally', 'FuelBed.slopeK', "".concat(prefix, ".bed.packingRatio")]]]], ["".concat(prefix, ".fire.slope.phi"), [['Variant.Float'], [['finally', 'SurfaceFire.phiSlope', "".concat(prefix, ".fire.slope.ratio"), "".concat(prefix, ".fire.slope.k")]]]], // end `${prefix}.fire.slope`
    ["".concat(prefix, ".fire.spread.step1.effectiveWindSpeed"), [['Variant.WindSpeed'], [['finally', 'SurfaceFire.effectiveWindSpeed', "".concat(prefix, ".fire.spread.step1.phiEffectiveWind"), "".concat(prefix, ".fire.wind.factor.b"), "".concat(prefix, ".fire.wind.factor.i")]]]], ["".concat(prefix, ".fire.spread.step1.phiEffectiveWind"), [['Variant.Float'], [['finally', 'SurfaceFire.phiEffectiveWind', "".concat(prefix, ".fire.wind.phi"), "".concat(prefix, ".fire.slope.phi")]]]], ["".concat(prefix, ".fire.spread.step1.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'SurfaceFire.maximumSpreadRate', "".concat(prefix, ".fire.noWindNoSlope.spreadRate"), "".concat(prefix, ".fire.spread.step1.phiEffectiveWind")]]]], // end `${prefix}.fire.spread.step1`
    ["".concat(prefix, ".fire.spread.step2.effectiveWindSpeed"), [['Variant.WindSpeed'], [['finally', 'SurfaceFire.effectiveWindSpeed', "".concat(prefix, ".fire.spread.step2.phiEffectiveWind"), "".concat(prefix, ".fire.wind.factor.b"), "".concat(prefix, ".fire.wind.factor.i")]]]], ["".concat(prefix, ".fire.spread.step2.phiEffectiveWind"), [['Variant.Float'], [['finally', 'SurfaceFire.phiEffectiveWindInferred', "".concat(prefix, ".fire.noWindNoSlope.spreadRate"), "".concat(prefix, ".fire.spread.step2.spreadRate")]]]], ["".concat(prefix, ".fire.spread.step2.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'SurfaceFire.spreadRateWithCrossSlopeWind', "".concat(prefix, ".fire.noWindNoSlope.spreadRate"), "".concat(prefix, ".fire.maximumDirection.spreadRate")]]]], // end `${prefix}.fire.spread.step2`
    ["".concat(prefix, ".fire.spread.step3a.effectiveWindSpeed"), [['Variant.WindSpeed'], [['finally', 'Math.min', "".concat(prefix, ".fire.spread.step2.effectiveWindSpeed"), "".concat(prefix, ".fire.limit.effectiveWindSpeed")]]]], ["".concat(prefix, ".fire.spread.step3a.phiEffectiveWind"), [['Variant.Float'], [['finally', 'Math.min', "".concat(prefix, ".fire.spread.step2.phiEffectiveWind"), "".concat(prefix, ".fire.limit.windSlopeSpreadRateCoefficient")]]]], ["".concat(prefix, ".fire.spread.step3a.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'Math.min', "".concat(prefix, ".fire.spread.step2.spreadRate"), "".concat(prefix, ".fire.limit.spreadRate")]]]], // end `${prefix}.fire.spread.step3a`
    ["".concat(prefix, ".fire.spread.step3b.effectiveWindSpeed"), [['Variant.WindSpeed'], [['finally', 'SurfaceFire.effectiveWindSpeed', "".concat(prefix, ".fire.spread.step3b.phiEffectiveWind"), "".concat(prefix, ".fire.wind.factor.b"), "".concat(prefix, ".fire.wind.factor.i")]]]], ["".concat(prefix, ".fire.spread.step3b.phiEffectiveWind"), [['Variant.Float'], [['finally', 'SurfaceFire.phiEffectiveWindInferred', "".concat(prefix, ".fire.noWindNoSlope.spreadRate"), "".concat(prefix, ".fire.spread.step3b.spreadRate")]]]], ["".concat(prefix, ".fire.spread.step3b.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'SurfaceFire.spreadRateWithRosLimitApplied', "".concat(prefix, ".fire.spread.step2.spreadRate"), "".concat(prefix, ".fire.spread.step2.effectiveWindSpeed")]]]], // end `${prefix}.fire.spread.step3b`
    ["".concat(prefix, ".fire.spread.step4.effectiveWindSpeed"), [['Variant.WindSpeed'], [['finally', 'SurfaceFire.effectiveWindSpeed', "".concat(prefix, ".fire.spread.step4.phiEffectiveWind"), "".concat(prefix, ".fire.wind.factor.b"), "".concat(prefix, ".fire.wind.factor.i")]]]], ["".concat(prefix, ".fire.spread.step4.phiEffectiveWind"), [['Variant.Float'], [['finally', 'SurfaceFire.phiEffectiveWindInferred', "".concat(prefix, ".fire.noWindNoSlope.spreadRate"), "".concat(prefix, ".fire.spread.step4.spreadRate")]]]], ["".concat(prefix, ".fire.spread.step4.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'SurfaceFire.spreadRateWithRosLimitApplied', "".concat(prefix, ".fire.spread.step3a.spreadRate"), "".concat(prefix, ".fire.spread.step3a.effectiveWindSpeed")]]]], // end `${prefix}.fire.spread.step4`
    // end `${prefix}.fire.spread`
    windSpeedAdjustmentFactor(prefix), ["".concat(prefix, ".fire.wind.speed.atMidflame"), [['Variant.WindSpeed'], [['when', 'configure.wind.speed', 'equals', 'atMidflame', 'Dag.bind', 'site.wind.speed.atMidflame'], ['finally', 'Wind.speedAtMidflame', 'site.wind.speed.at20ft', "".concat(prefix, ".fire.windSpeedAdjustmentFactor")]]]], ["".concat(prefix, ".fire.wind.factor.b"), [['Variant.Float'], [['finally', 'FuelBed.windB', "".concat(prefix, ".bed.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".fire.wind.factor.c"), [['Variant.Float'], [['finally', 'FuelBed.windC', "".concat(prefix, ".bed.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".fire.wind.factor.e"), [['Variant.Float'], [['finally', 'FuelBed.windE', "".concat(prefix, ".bed.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".fire.wind.factor.k"), [['Variant.Float'], [['finally', 'FuelBed.windK', "".concat(prefix, ".bed.packingRatio.ratio"), "".concat(prefix, ".fire.wind.factor.e"), "".concat(prefix, ".fire.wind.factor.c")]]]], ["".concat(prefix, ".fire.wind.factor.i"), [['Variant.Float'], [['finally', 'FuelBed.windI', "".concat(prefix, ".bed.packingRatio.ratio"), "".concat(prefix, ".fire.wind.factor.e"), "".concat(prefix, ".fire.wind.factor.c")]]]], ["".concat(prefix, ".fire.wind.phi"), [['Variant.Float'], [['finally', 'SurfaceFire.phiWind', "".concat(prefix, ".fire.wind.speed.atMidflame"), "".concat(prefix, ".fire.wind.factor.b"), "".concat(prefix, ".fire.wind.factor.k")]]]], // end `${prefix}.fire.wind`
    ["".concat(prefix, ".fire.effectiveWindSpeed"), [['Variant.WindSpeed'], [['when', 'configure.fire.effectiveWindSpeedLimit', 'equals', 'applied', 'Dag.bind', "".concat(prefix, ".fire.spread.step4.effectiveWindSpeed")], ['finally', 'Dag.bind', "".concat(prefix, ".fire.spread.step3b.effectiveWindSpeed")]]]], ["".concat(prefix, ".fire.firelineIntensity"), [['Variant.FireFirelineIntensity'], [['finally', 'SurfaceFire.firelineIntensity', "".concat(prefix, ".fire.spreadRate"), "".concat(prefix, ".fire.reactionIntensity"), "".concat(prefix, ".fire.flameResidenceTime")]]]], ["".concat(prefix, ".fire.flameLength"), [['Variant.FireFlameLength'], [['finally', 'SurfaceFire.flameLength', "".concat(prefix, ".fire.firelineIntensity")]]]], ["".concat(prefix, ".fire.flameResidenceTime"), [['Variant.FireResidenceTime'], [['finally', 'FuelBed.taur', "".concat(prefix, ".bed.surfaceAreaToVolumeRatio")]]]], ["".concat(prefix, ".fire.heading.fromUpslope"), [['Variant.CompassAzimuth'], [['finally', 'SurfaceFire.spreadDirectionFromUpslope', "".concat(prefix, ".fire.maximumDirection.xComponent"), "".concat(prefix, ".fire.maximumDirection.yComponent"), "".concat(prefix, ".fire.maximumDirection.spreadRate")]]]], ["".concat(prefix, ".fire.heading.fromNorth"), [['Variant.CompassAzimuth'], [['finally', 'Compass.sum', 'site.slope.direction.upslope', "".concat(prefix, ".fire.heading.fromUpslope")]]]], ["".concat(prefix, ".fire.heatPerUnitArea"), [['Variant.FireHeatPerUnitArea'], [['finally', 'FuelBed.heatPerUnitArea', "".concat(prefix, ".fire.reactionIntensity"), "".concat(prefix, ".fire.flameResidenceTime")]]]], ["".concat(prefix, ".fire.lengthToWidthRatio"), [['Variant.FireLengthToWidthRatio'], [['finally', 'SurfaceFire.lengthToWidthRatio', "".concat(prefix, ".fire.effectiveWindSpeed")]]]], ["".concat(prefix, ".fire.phiEffectiveWind"), [['Variant.Float'], [['when', 'configure.fire.effectiveWindSpeedLimit', 'equals', 'applied', 'Dag.bind', "".concat(prefix, ".fire.spread.step4.phiEffectiveWind")], ['finally', 'Dag.bind', "".concat(prefix, ".fire.spread.step3b.phiEffectiveWind")]]]], ["".concat(prefix, ".fire.reactionIntensity"), [['Variant.FireReactionIntensity'], [['finally', 'Dag.bind', "".concat(prefix, ".bed.reactionIntensity")]]]], ["".concat(prefix, ".fire.scorchHeight"), [['Variant.FireScorchHeight'], [['finally', 'FireEllipse.scorchHeight', "".concat(prefix, ".fire.firelineIntensity"), "".concat(prefix, ".fire.wind.speed.atMidflame"), 'site.temperature.air']]]], ["".concat(prefix, ".fire.spreadRate"), [['Variant.FireSpreadRate'], [['when', 'configure.fire.effectiveWindSpeedLimit', 'equals', 'applied', 'Dag.bind', "".concat(prefix, ".fire.spread.step4.spreadRate")], ['finally', 'Dag.bind', "".concat(prefix, ".fire.spread.step3b.spreadRate")]]]], ["".concat(prefix, ".fire.noWindNoSlope.spreadRate"), [['Variant.FireSpreadRate'], [['finally', 'Dag.bind', "".concat(prefix, ".bed.noWindNoSlope.spreadRate")]]]] // end `${prefix}.fire`
    ];
  }

  var prefix = 'crown.canopy.fuel';
  var canopyParticles = [["".concat(prefix, ".bed.dead.particle.class1.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.dead.particle.class1.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.dead.particle.class1.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `Dead 1-h time-lag (0 to 0.25 inch diameter) branch wood`]
  // ]]],
  ["".concat(prefix, ".bed.dead.particle.class1.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0.138]]]], ["".concat(prefix, ".bed.dead.particle.class1.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.bind', 'site.moisture.dead.tl1h']]]], ["".concat(prefix, ".bed.dead.particle.class1.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 2000]]]], ["".concat(prefix, ".bed.dead.particle.class1.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class1.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.dead.particle.class1`
  ["".concat(prefix, ".bed.dead.particle.class2.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.dead.particle.class2.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.dead.particle.class2.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `Dead 10-h time-lag (0.25 to 1 inch diameter) branch wood`]
  // ]]],
  ["".concat(prefix, ".bed.dead.particle.class2.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0.092]]]], ["".concat(prefix, ".bed.dead.particle.class2.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.bind', 'site.moisture.dead.tl10h']]]], ["".concat(prefix, ".bed.dead.particle.class2.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 109]]]], ["".concat(prefix, ".bed.dead.particle.class2.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class2.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.dead.particle.class2`
  ["".concat(prefix, ".bed.dead.particle.class3.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.dead.particle.class3.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.dead.particle.class3.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `Dead 100-h time-lag (1 to 3 inch diameter) branch wood`]
  // ]]],
  ["".concat(prefix, ".bed.dead.particle.class3.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0.23]]]], ["".concat(prefix, ".bed.dead.particle.class3.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.bind', 'site.moisture.dead.tl100h']]]], ["".concat(prefix, ".bed.dead.particle.class3.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 30]]]], ["".concat(prefix, ".bed.dead.particle.class3.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class3.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.dead.particle.class3`
  ["".concat(prefix, ".bed.dead.particle.class4.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.dead.particle.class4.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.dead.particle.class4.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `Dead herb`]
  // ]]],
  ["".concat(prefix, ".bed.dead.particle.class4.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".bed.dead.particle.class4.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.bind', 'site.moisture.dead.tl1h']]]], ["".concat(prefix, ".bed.dead.particle.class4.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 1500]]]], ["".concat(prefix, ".bed.dead.particle.class4.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class4.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.dead.particle.class4`
  ["".concat(prefix, ".bed.dead.particle.class5.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.dead.particle.class5.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.dead.particle.class5.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `unused`],
  // ]]],
  ["".concat(prefix, ".bed.dead.particle.class5.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".bed.dead.particle.class5.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.fixed', 5]]]], ["".concat(prefix, ".bed.dead.particle.class5.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 1]]]], ["".concat(prefix, ".bed.dead.particle.class5.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.dead.particle.class5.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.dead.particle.class5`
  // end `${prefix}.bed.dead.particle`
  ["".concat(prefix, ".bed.live.particle.class1.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.live.particle.class1.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.live.particle.class1.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `Live herb`]
  // ]]],
  ["".concat(prefix, ".bed.live.particle.class1.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".bed.live.particle.class1.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.bind', 'site.moisture.live.herb']]]], ["".concat(prefix, ".bed.live.particle.class1.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 1500]]]], ["".concat(prefix, ".bed.live.particle.class1.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.live.particle.class1.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.live.particle.class1`
  ["".concat(prefix, ".bed.live.particle.class2.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.live.particle.class2.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.live.particle.class2.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `Live stem wood`]
  // ]]],
  ["".concat(prefix, ".bed.live.particle.class2.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0.092]]]], ["".concat(prefix, ".bed.live.particle.class2.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.bind', 'site.moisture.live.stem']]]], ["".concat(prefix, ".bed.live.particle.class2.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 1500]]]], ["".concat(prefix, ".bed.live.particle.class2.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.live.particle.class2.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.live.particle.class2`
  ["".concat(prefix, ".bed.live.particle.class3.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.live.particle.class3.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.live.particle.class3.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `unused`],
  // ]]],
  ["".concat(prefix, ".bed.live.particle.class3.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".bed.live.particle.class3.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.fixed', 5]]]], ["".concat(prefix, ".bed.live.particle.class3.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 1]]]], ["".concat(prefix, ".bed.live.particle.class3.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.live.particle.class3.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.live.particle.class3`
  ["".concat(prefix, ".bed.live.particle.class4.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.live.particle.class4.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.live.particle.class4.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `unused`]
  // ]]],
  ["".concat(prefix, ".bed.live.particle.class4.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".bed.live.particle.class4.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.fixed', 5]]]], ["".concat(prefix, ".bed.live.particle.class4.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 1]]]], ["".concat(prefix, ".bed.live.particle.class4.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.live.particle.class4.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]], // end `${prefix}.bed.live.particle.class4`
  ["".concat(prefix, ".bed.live.particle.class5.fiberDensity"), [['Variant.FuelParticleFiberDensity'], [['finally', 'Dag.fixed', 32]]]], ["".concat(prefix, ".bed.live.particle.class5.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], // [`${prefix}.bed.live.particle.class5.label`, [[`Variant.FuelLabelText`], [
  //   [`finally`, `Dag.fixed`, `unused`]
  // ]]],
  ["".concat(prefix, ".bed.live.particle.class5.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".bed.live.particle.class5.moistureContent"), [['Variant.FuelMoistureContent'], [['finally', 'Dag.fixed', 5]]]], ["".concat(prefix, ".bed.live.particle.class5.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['finally', 'Dag.fixed', 1]]]], ["".concat(prefix, ".bed.live.particle.class5.effective.mineralContent"), [['Variant.FuelEffectiveMineralContent'], [['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".bed.live.particle.class5.total.mineralContent"), [['Variant.FuelTotalMineralContent'], [['finally', 'Dag.fixed', 0.0555]]]] // end `${prefix}.bed.live.particle.class5`
  ];
  var crownFire = [['crown.fire.active.size.area', [['Variant.FireArea'], [['finally', 'CrownFire.area', 'crown.fire.active.size.length', 'crown.fire.active.lengthToWidthRatio']]]], ['crown.fire.active.size.length', [['Variant.FireSpreadDistance'], [['finally', 'CrownFire.spreadDistance', 'crown.fire.active.spreadRate', 'site.fire.time.sinceIgnition']]]], ['crown.fire.active.size.perimeter', [['Variant.FireSpreadDistance'], [['finally', 'CrownFire.perimeter', 'crown.fire.active.size.length', 'crown.fire.active.lengthToWidthRatio']]]], ['crown.fire.active.size.width', [['Variant.FireSpreadDistance'], [['finally', 'Calc.divide', 'crown.fire.active.size.length', 'crown.fire.active.lengthToWidthRatio']]]], // end 'crown.fire.active.size'
  ['crown.fire.active.map.area', [['Variant.MapArea'], [['finally', 'CrownFire.mapArea', 'crown.fire.active.size.area', 'site.map.scale']]]], ['crown.fire.active.map.length', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'crown.fire.active.size.length', 'site.map.scale']]]], ['crown.fire.active.map.perimeter', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'crown.fire.active.size.perimeter', 'site.map.scale']]]], ['crown.fire.active.map.width', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'crown.fire.active.size.width', 'site.map.scale']]]], // end 'crown.fire.active.map'
  ['crown.fire.active.lengthToWidthRatio', [['Variant.FireLengthToWidthRatio'], [['finally', 'CrownFire.lengthToWidthRatio', 'site.wind.speed.at20ft']]]], ['crown.fire.active.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'CrownFire.rActive', 'crown.canopy.fuel.fire.spreadRate']]]], ['crown.fire.active.firelineIntensity', [['Variant.FireFirelineIntensity'], [['finally', 'CrownFire.fliActive', 'crown.fire.active.heatPerUnitArea', 'crown.fire.active.spreadRate']]]], ['crown.fire.active.flameLength', [['Variant.FireFlameLength'], [['finally', 'CrownFire.flameLengthThomas', 'crown.fire.active.firelineIntensity']]]], ['crown.fire.active.heatPerUnitArea', [['Variant.FireHeatPerUnitArea'], [['finally', 'CrownFire.hpuaActive', 'site.canopy.fire.heatPerUnitArea', 'crown.fire.surface.heatPerUnitArea']]]], ['crown.fire.active.powerOfTheFire', [['Variant.FirePower'], [['finally', 'CrownFire.powerOfTheFire', 'crown.fire.active.firelineIntensity']]]], ['crown.fire.active.powerOfTheWind', [['Variant.FirePower'], [['finally', 'CrownFire.powerOfTheWind', 'site.wind.speed.at20ft', 'crown.fire.active.spreadRate']]]], ['crown.fire.active.powerRatio', [['Variant.FirePowerRatio'], [['finally', 'Calc.divide', 'crown.fire.active.powerOfTheFire', 'crown.fire.active.powerOfTheWind']]]], ['crown.fire.active.isPlumeDominated', [['Variant.Bool'], [['finally', 'CrownFire.isPlumeDominated', 'crown.fire.active.powerRatio']]]], ['crown.fire.active.isWindDriven', [['Variant.Bool'], [['finally', 'CrownFire.isWindDriven', 'crown.fire.active.powerRatio']]]], // end 'crown.fire.active'
  ['crown.fire.final.size.area', [['Variant.FireArea'], [['finally', 'CrownFire.area', 'crown.fire.final.size.length', 'crown.fire.active.lengthToWidthRatio']]]], ['crown.fire.final.size.length', [['Variant.FireSpreadDistance'], [['finally', 'CrownFire.spreadDistance', 'crown.fire.final.spreadRate', 'site.fire.time.sinceIgnition']]]], ['crown.fire.final.size.perimeter', [['Variant.FireSpreadDistance'], [['finally', 'CrownFire.perimeter', 'crown.fire.final.size.length', 'crown.fire.active.lengthToWidthRatio']]]], ['crown.fire.final.size.width', [['Variant.FireSpreadDistance'], [['finally', 'Calc.divide', 'crown.fire.final.size.length', 'crown.fire.active.lengthToWidthRatio']]]], // end 'crown.fire.final.size'
  ['crown.fire.final.map.area', [['Variant.MapArea'], [['finally', 'CrownFire.mapArea', 'crown.fire.final.size.area', 'site.map.scale']]]], ['crown.fire.final.map.length', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'crown.fire.final.size.length', 'site.map.scale']]]], ['crown.fire.final.map.perimeter', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'crown.fire.final.size.perimeter', 'site.map.scale']]]], ['crown.fire.final.map.width', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'crown.fire.final.size.width', 'site.map.scale']]]], // end 'crown.fire.final.map'
  ['crown.fire.final.rSa', [['Variant.FireSpreadRate'], [['finally', 'CrownFire.rSa', 'crown.fire.initiation.oActive', 'surface.primary.fuel.bed.noWindNoSlope.spreadRate', 'surface.primary.fuel.fire.windSpeedAdjustmentFactor', 'surface.primary.fuel.fire.wind.factor.b', 'surface.primary.fuel.fire.wind.factor.k', 'surface.primary.fuel.fire.slope.phi']]]], ['crown.fire.final.crownFractionBurned', [['Variant.CrownFireBurnedFraction'], [['finally', 'CrownFire.crownFractionBurned', 'surface.primary.fuel.fire.spreadRate', 'crown.fire.initiation.spreadRate', 'crown.fire.final.rSa']]]], ['crown.fire.final.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'CrownFire.rFinal', 'surface.primary.fuel.fire.spreadRate', 'crown.fire.active.spreadRate', 'crown.fire.final.crownFractionBurned']]]], ['crown.fire.final.firelineIntensity', [['Variant.FireFirelineIntensity'], [['finally', 'CrownFire.fliFinal', 'crown.fire.final.spreadRate', 'crown.fire.final.crownFractionBurned', 'site.canopy.fire.heatPerUnitArea', 'crown.fire.surface.heatPerUnitArea']]]], ['crown.fire.final.flameLength', [['Variant.FireFirelineIntensity'], [['finally', 'CrownFire.flameLengthThomas', 'crown.fire.final.firelineIntensity']]]], // end 'crown.fire.final'
  ['crown.fire.initiation.firelineIntensity', [['Variant.FireFirelineIntensity'], [['finally', 'CrownFire.fliInit', 'site.canopy.fuel.foliar.moistureContent', 'site.canopy.crown.baseHeight']]]], ['crown.fire.initiation.flameLength', [['Variant.FireFlameLength'], [['finally', 'CrownFire.flameLength', 'crown.fire.initiation.firelineIntensity']]]], ['crown.fire.initiation.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'CrownFire.rInit', 'crown.fire.initiation.firelineIntensity', 'crown.fire.surface.heatPerUnitArea']]]], ['crown.fire.initiation.rPrime', [['Variant.FireSpreadRate'], [['finally', 'CrownFire.rPrimeActive', 'site.canopy.fuel.bulkDensity']]]], ['crown.fire.initiation.transitionRatio', [['Variant.CrownTransitionRatio'], [['finally', 'CrownFire.transitionRatio', 'crown.fire.surface.firelineIntensity', 'crown.fire.initiation.firelineIntensity']]]], ['crown.fire.initiation.canTransition', [['Variant.Bool'], [['finally', 'CrownFire.canTransition', 'crown.fire.initiation.transitionRatio']]]], ['crown.fire.initiation.activeRatio', [['Variant.CrownFireActiveRatio'], [['finally', 'CrownFire.activeRatio', 'crown.fire.active.spreadRate', 'crown.fire.initiation.rPrime']]]], ['crown.fire.initiation.type', [['Variant.CrownFireInitiationTypeOption'], [['finally', 'CrownFire.type', 'crown.fire.initiation.transitionRatio', 'crown.fire.initiation.activeRatio']]]], ['crown.fire.initiation.isActiveCrownFire', [['Variant.Bool'], [['finally', 'CrownFire.isActive', 'crown.fire.initiation.transitionRatio', 'crown.fire.initiation.activeRatio']]]], ['crown.fire.initiation.isCrownFire', [['Variant.Bool'], [['finally', 'CrownFire.isCrown', 'crown.fire.initiation.transitionRatio', 'crown.fire.initiation.activeRatio']]]], ['crown.fire.initiation.isPassiveCrownFire', [['Variant.Bool'], [['finally', 'CrownFire.isPassive', 'crown.fire.initiation.transitionRatio', 'crown.fire.initiation.activeRatio']]]], ['crown.fire.initiation.isConditionalCrownFire', [['Variant.Bool'], [['finally', 'CrownFire.isConditional', 'crown.fire.initiation.transitionRatio', 'crown.fire.initiation.activeRatio']]]], ['crown.fire.initiation.isSurfaceFire', [['Variant.Bool'], [['finally', 'CrownFire.isSurface', 'crown.fire.initiation.transitionRatio', 'crown.fire.initiation.activeRatio']]]], ['crown.fire.initiation.oActive', [['Variant.WindSpeed'], [['finally', 'CrownFire.oActive', 'site.canopy.fuel.bulkDensity', 'crown.canopy.fuel.fire.reactionIntensity', 'crown.canopy.fuel.bed.heatSink', 'crown.canopy.fuel.fire.slope.phi']]]], ['crown.fire.initiation.crowningIndex', [['Variant.Float'], [['finally', 'CrownFire.crowningIndex', 'crown.fire.initiation.oActive']]]], // end 'crown.fire.initiation'
  ['crown.fire.surface.firelineIntensity', [['Variant.FireFirelineIntensity'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.firelineIntensity'], ['finally', 'Dag.bind', 'site.fire.observed.firelineIntensity']]]], ['crown.fire.surface.flameLength', [['Variant.FireFlameLength'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.flameLength'], ['finally', 'Dag.bind', 'site.fire.observed.flameLength']]]], ['crown.fire.surface.heatPerUnitArea', [['Variant.FireHeatPerUnitArea'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.heatPerUnitArea'], ['finally', 'Dag.bind', 'site.fire.observed.heatPerUnitArea']]]] // end 'crown.fire.surface'
  // end 'crown.fire'
  // end 'crown'
  ];
  var genome$4 = [].concat(canopyParticles, _toConsumableArray(derived(prefix, 'dead', '1')), _toConsumableArray(derived(prefix, 'dead', '2')), _toConsumableArray(derived(prefix, 'dead', '3')), _toConsumableArray(derived(prefix, 'dead', '4')), _toConsumableArray(derived(prefix, 'dead', '5')), _toConsumableArray(derived(prefix, 'live', '1')), _toConsumableArray(derived(prefix, 'live', '2')), _toConsumableArray(derived(prefix, 'live', '3')), _toConsumableArray(derived(prefix, 'live', '4')), _toConsumableArray(derived(prefix, 'live', '5')), _toConsumableArray(genome$1(prefix, 'dead')), _toConsumableArray(genome$1(prefix, 'live')), _toConsumableArray(bed(prefix)), _toConsumableArray(genome$3(prefix)), crownFire);

  var genome$5 = [['docs.run.mainTitle', [['Variant.Documentation'], [['finally', 'Dag.input']]]], ['docs.run.subTitle', [['Variant.Documentation'], [['finally', 'Dag.input']]]], ['docs.run.description', [['Variant.Documentation'], [['finally', 'Dag.input']]]], ['docs.run.userName', [['Variant.Documentation'], [['finally', 'Dag.input']]]] // end 'docs'
  ];

  var genome$6 = [['ignition.firebrand.probability', [['Variant.Fraction'], [['finally', 'IgnitionProbability.firebrand', 'site.temperature.fuel', 'site.moisture.dead.tl1h']]]], ['ignition.lightningStrike.charge', [['Variant.IgnitionLightningChargeOption'], [['finally', 'Dag.input']]]], ['ignition.lightningStrike.fuel.depth', [['Variant.IgnitionFuelDepth'], [['finally', 'Dag.input']]]], ['ignition.lightningStrike.fuel.type', [['Variant.IgnitionFuelTypeOption'], [['finally', 'Dag.input']]]], ['ignition.lightningStrike.probability', [['Variant.Fraction'], [['finally', 'IgnitionProbability.lightningStrike', 'ignition.lightningStrike.fuel.type', 'ignition.lightningStrike.fuel.depth', 'site.moisture.dead.tl100h', 'ignition.lightningStrike.charge']]]]];

  var genome$7 = [['mortality.scorchHeight', [['Variant.FireScorchHeight'], [// If stand-alone scorch height, calculate scorchHeight
  ['when', 'configure.module', 'equals', 'scorchHeight', 'FireEllipse.scorchHeight', 'site.fire.observed.firelineIntensity', 'site.wind.speed.atMidflame', 'site.temperature.air'], // If stand-alone treeMortality, input the observed scorch height
  ['when', 'configure.module', 'equals', 'treeMortality', 'Dag.bind', 'site.fire.observed.scorchHeight'], // otherwise link to fireEllipse (or surfaceFire)
  ['finally', 'Dag.bind', 'surface.fire.ellipse.head.scorchHeight']]]], ['mortality.rate', [['Variant.Fraction'], [['finally', 'TreeMortality.mortality', 'site.canopy.tree.species.fofem6.code', 'site.canopy.tree.dbh', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'mortality.scorchHeight']]]], ['mortality.crownLengthScorched', [['Variant.Fraction'], [['finally', 'TreeMortality.crownLengthScorched', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'mortality.scorchHeight']]]], ['mortality.crownVolumeScorched', [['Variant.Fraction'], [['finally', 'TreeMortality.crownVolumeScorched', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'mortality.scorchHeight']]]]];

  var genome$8 = [['site.canopy.cover', [['Variant.FuelCoverFraction'], [['finally', 'Dag.input']]]], ['site.canopy.crown.baseHeight', [['Variant.TreeHeight'], [['finally', 'Dag.input']]]], ['site.canopy.crown.fill', [['Variant.CrownFillFraction'], [['finally', 'Canopy.crownFill', 'site.canopy.cover', 'site.canopy.crown.ratio']]]], ['site.canopy.crown.length', [['Variant.TreeHeight'], [['finally', 'Canopy.crownLength', 'site.canopy.crown.baseHeight', 'site.canopy.crown.totalHeight']]]], ['site.canopy.crown.ratio', [['Variant.CrownRatioFraction'], [['finally', 'Canopy.crownRatio', 'site.canopy.crown.length', 'site.canopy.crown.totalHeight']]]], ['site.canopy.crown.totalHeight', [['Variant.TreeHeight'], [['finally', 'Dag.input']]]], // end site.canopy.crown
  ['site.canopy.fire.heatPerUnitArea', [['Variant.FireHeatPerUnitArea'], [['finally', 'Canopy.heatPerUnitArea', 'site.canopy.fuel.ovendryLoad', 'site.canopy.fuel.heatOfCombustion']]]], ['site.canopy.fuel.bulkDensity', [['Variant.FuelBedBulkDensity'], [['finally', 'Dag.input']]]], ['site.canopy.fuel.foliar.moistureContent', [['Variant.FuelMoistureContent'], [['finally', 'Dag.input']]]], ['site.canopy.fuel.heatOfCombustion', [['Variant.FuelHeatOfCombustion'], [['finally', 'Dag.fixed', 8000]]]], ['site.canopy.fuel.isSheltered', [['Variant.Bool'], [['finally', 'Canopy.sheltersFuel', 'site.canopy.cover', 'site.canopy.crown.totalHeight', 'site.canopy.crown.fill']]]], ['site.canopy.fuel.ovendryLoad', [['Variant.FuelOvendryLoad'], [['finally', 'Canopy.fuelLoad', 'site.canopy.fuel.bulkDensity', 'site.canopy.crown.length']]]], ['site.canopy.fuel.shading', [['Variant.Fraction'], [// used by IgnitionProbability
  ['finally', 'Dag.input']]]], // end site.canopy.fuel
  ['site.canopy.sheltered.windSpeedAdjustmentFactor', [['Variant.WindSpeedAdjustmentFraction'], [['finally', 'Canopy.windSpeedAdjustmentFactor', 'site.canopy.cover', 'site.canopy.crown.totalHeight', 'site.canopy.crown.fill']]]], // end 'site.canopy.sheltered'
  ['site.canopy.downwind.height', [['Variant.TreeHeight'], [['finally', 'Dag.input']]]], ['site.canopy.downwind.isOpen', [['Variant.Bool'], [['finally', 'Dag.input']]]], ['site.canopy.downwind.appliedHeight', [['Variant.TreeHeight'], [['finally', 'Spotting.appliedDownWindCoverHeight', 'site.canopy.downwind.height', 'site.canopy.downwind.isOpen']]]], // end 'site.canopy.downwind'
  ['site.canopy.tree.barkThickness', [['Variant.TreeBarkThickness'], [['finally', 'TreeMortality.barkThickness', 'site.canopy.tree.species.fofem6.code', 'site.canopy.tree.dbh']]]], ['site.canopy.tree.dbh', [['Variant.TreeDbh'], [['finally', 'Dag.input']]]], ['site.canopy.tree.species.fofem6.code', [['Variant.TreeSpeciesFofem6Option'], [['finally', 'Dag.input']]]] // end 'site.canopy.tree'
  ];

  var genome$9 = [// used by 'site.fire.observed.flameLength', 'site.fire.observed.scorchHeight',
  // 'spotting.surfaceFire.firebrand.height', 'crown.fire.surface.firelineIntensity', and
  // 'surface.fire.ellipse.head.firelineIntensity' when configs.fire.ellipse === 'standAlone'
  ['site.fire.observed.effectiveWindSpeed', [['Variant.WindSpeed'], [['when', 'configure.fire.lengthToWidthRatio', 'equals', 'lengthToWidthRatio', 'SurfaceFire.effectiveWindSpeedFromLwr', 'site.fire.observed.lengthToWidthRatio'], ['finally', 'Dag.input']]]], ['site.fire.observed.firelineIntensity', [['Variant.FireFirelineIntensity'], [['when', 'configure.fire.firelineIntensity', 'equals', 'flameLength', 'SurfaceFire.firelineIntensityFromFlameLength', 'site.fire.observed.flameLength'], ['finally', 'Dag.input']]]], // used only by 'crown.fire.surface.flameLength'
  ['site.fire.observed.flameLength', [['Variant.FireFlameLength'], [['when', 'configure.fire.firelineIntensity', 'equals', 'firelineIntensity', 'SurfaceFire.flameLength', 'site.fire.observed.firelineIntensity'], ['finally', 'Dag.input']]]], // used only by 'surface.fire.ellipse.heading.fromUpslope' when configs.fire.ellipse === 'standAlone'
  ['site.fire.observed.heading.fromUpslope', [['Variant.CompassAzimuth'], [['when', 'configure.wind.direction', 'equals', 'headingFromUpslope', 'Dag.input'], ['when', 'configure.wind.direction', 'equals', 'upslope', 'Dag.input'], ['finally', 'Compass.diff', 'site.fire.observed.heading.fromNorth', 'site.slope.direction.upslope']]]], // used only by 'site.fire.observed.heading.fromUpslope' when 'configure.wind.direction' === 'sourceFromNorth'
  ['site.fire.observed.heading.fromNorth', [['Variant.CompassAzimuth'], [['when', 'configure.wind.direction', 'equals', 'sourceFromNorth', 'Dag.input'], ['finally', 'Compass.sum', 'site.slope.direction.upslope', 'site.fire.observed.heading.fromUpslope']]]], // used by 'crown.fire.surface.heatPerUnitArea'
  ['site.fire.observed.heatPerUnitArea', [['Variant.FireHeatPerUnitArea'], [['finally', 'Dag.input']]]], // used by 'surface.fire.ellipse.axis.lengthToWidthRatio' when configs.fire.ellipse === 'standAlone'
  ['site.fire.observed.lengthToWidthRatio', [['Variant.FireLengthToWidthRatio'], [['when', 'configure.fire.lengthToWidthRatio', 'equals', 'effectiveWindSpeed', 'SurfaceFire.lengthToWidthRatio', 'site.fire.observed.effectiveWindSpeed'], ['finally', 'Dag.input']]]], // used by 'surface.fire.ellipse.head.spreadRate' when configs.fire.ellipse === 'standAlone'
  ['site.fire.observed.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'Dag.input']]]], // used by stand-alone mortality model
  ['site.fire.observed.scorchHeight', [['Variant.FireScorchHeight'], [['finally', 'Dag.input']]]], ['site.fire.crown.flameLength', [['Variant.FireFlameLength'], [['finally', 'Dag.input']]]], // end 'site.fire.crown'
  ['site.fire.time.sinceIgnition', [['Variant.FireElapsedTime'], [['finally', 'Dag.input']]]], // end 'site.fire.time'
  ['site.fire.vector.fromHead', [['Variant.CompassAzimuth'], [['finally', 'Dag.input']]]], ['site.fire.vector.fromNorth', [['Variant.CompassAzimuth'], [['finally', 'Dag.input']]]], ['site.fire.vector.fromUpslope', [['Variant.CompassAzimuth'], [['finally', 'Dag.input']]]]];

  var genome$a = [['site.map.scale', [['Variant.Float'], [['finally', 'Dag.input']]]], ['site.map.contours', [['Variant.MapContoursCount'], [['finally', 'Dag.input']]]], ['site.map.distance', [['Variant.FireSpreadDistance'], [['finally', 'Dag.input']]]], ['site.map.factor', [['Variant.Float'], [['finally', 'Calc.divide', 1, 'site.map.scale']]]], ['site.map.interval', [['Variant.FireSpreadDistance'], [['finally', 'Dag.input']]]], ['site.map.reach', [['Variant.FireSpreadDistance'], [['finally', 'Calc.multiply', 'site.map.scale', 'site.map.distance']]]], ['site.map.rise', [['Variant.FireSpreadDistance'], [['finally', 'Calc.multiply', 'site.map.interval', 'site.map.contours']]]], ['site.map.slope.ratio', [['Variant.SlopeSteepness'], [['finally', 'Compass.slopeRatioMap', 'site.map.scale', 'site.map.interval', 'site.map.contours', 'site.map.distance']]]], ['site.map.slope.degrees', [['Variant.SlopeSteepness'], [['finally', 'Compass.slopeDegreesMap', 'site.map.scale', 'site.map.interval', 'site.map.contours', 'site.map.distance']]]]];

  var genome$b = [['site.moisture.dead.tl1h', [['Variant.FuelMoistureContent'], [['when', 'configure.fuel.moisture', 'equals', 'category', 'Dag.bind', 'site.moisture.dead.category'], ['finally', 'Dag.input']]]], ['site.moisture.dead.tl10h', [['Variant.FuelMoistureContent'], [['when', 'configure.fuel.moisture', 'equals', 'category', 'Dag.bind', 'site.moisture.dead.category'], ['finally', 'Dag.input']]]], ['site.moisture.dead.tl100h', [['Variant.FuelMoistureContent'], [['when', 'configure.fuel.moisture', 'equals', 'category', 'Dag.bind', 'site.moisture.dead.category'], ['finally', 'Dag.input']]]], ['site.moisture.dead.category', [['Variant.FuelMoistureContent'], [['finally', 'Dag.input']]]], // end 'site.moisture.dead'
  ['site.moisture.live.herb', [['Variant.FuelMoistureContent'], [['when', 'configure.fuel.moisture', 'equals', 'category', 'Dag.bind', 'site.moisture.live.category'], ['when', 'configure.fuel.moisture', 'equals', 'liveCategory', 'Dag.bind', 'site.moisture.live.category'], ['finally', 'Dag.input']]]], ['site.moisture.live.stem', [['Variant.FuelMoistureContent'], [['when', 'configure.fuel.moisture', 'equals', 'category', 'Dag.bind', 'site.moisture.live.category'], ['when', 'configure.fuel.moisture', 'equals', 'liveCategory', 'Dag.bind', 'site.moisture.live.category'], ['finally', 'Dag.input']]]], ['site.moisture.live.category', [['Variant.FuelMoistureContent'], [['finally', 'Dag.input']]]] // end 'site.moisture.live'
  // end 'site.moisture'
  ];

  var genome$c = [['site.slope.direction.aspect', [['Variant.CompassAzimuth'], [['finally', 'Dag.input']]]], ['site.slope.direction.upslope', [['Variant.CompassAzimuth'], [['finally', 'Compass.opposite', 'site.slope.direction.aspect']]]], // end 'site.slope.direction'
  ['site.slope.steepness.degrees', [['Variant.SlopeSteepness'], [['when', 'configure.slope.steepness', 'equals', 'degrees', 'Dag.input'], ['when', 'configure.slope.steepness', 'equals', 'map', 'Dag.bind', 'site.map.slope.degrees'], ['finally', 'Compass.slopeDegrees', 'site.slope.steepness.ratio']]]], ['site.slope.steepness.ratio', [['Variant.SlopeSteepness'], [['when', 'configure.slope.steepness', 'equals', 'degrees', 'Compass.slopeRatio', 'site.slope.steepness.degrees'], ['when', 'configure.slope.steepness', 'equals', 'map', 'Dag.bind', 'site.map.slope.ratio'], ['finally', 'Dag.input']]]] // end 'site.slope.steepness'
  // end 'site.slope'
  ];

  var genome$d = [['site.temperature.air', [['Variant.AirTemperature'], [['finally', 'Dag.input']]]], ['site.temperature.fuel', [['Variant.AirTemperature'], [['finally', 'IgnitionProbability.fuelTemperature', 'site.temperature.air', 'site.canopy.fuel.shading']]]], ['site.wind.direction.heading.fromUpslope', [['Variant.CompassAzimuth'], [['when', 'configure.wind.direction', 'equals', 'headingFromUpslope', 'Dag.input'], ['when', 'configure.wind.direction', 'equals', 'sourceFromNorth', 'Compass.diff', 'site.wind.direction.heading.fromNorth', 'site.slope.direction.upslope'], ['when', 'configure.wind.direction', 'equals', 'upslope', 'Dag.fixed', 0], ['finally', 'Dag.fixed', 0]]]], ['site.wind.direction.source.fromUpslope', [['Variant.CompassAzimuth'], [['finally', 'Compass.opposite', 'site.wind.direction.heading.fromUpslope']]]], ['site.wind.direction.source.fromNorth', [['Variant.CompassAzimuth'], [['when', 'configure.wind.direction', 'equals', 'headingFromUpslope', 'Compass.opposite', 'site.wind.direction.heading.fromNorth'], ['when', 'configure.wind.direction', 'equals', 'sourceFromNorth', 'Dag.input'], ['when', 'configure.wind.direction', 'equals', 'upslope', 'Compass.opposite', 'site.slope.direction.upslope'], ['finally', 'Compass.opposite', 'site.slope.direction.upslope']]]], ['site.wind.direction.heading.fromNorth', [['Variant.CompassAzimuth'], [['when', 'configure.wind.direction', 'equals', 'headingFromUpslope', 'Compass.sum', 'site.wind.direction.heading.fromUpslope', 'site.slope.direction.upslope'], ['when', 'configure.wind.direction', 'equals', 'sourceFromNorth', 'Compass.opposite', 'site.wind.direction.source.fromNorth'], ['when', 'configure.wind.direction', 'equals', 'upslope', 'Dag.bind', 'site.slope.direction.upslope'], ['finally', 'Dag.bind', 'site.slope.direction.upslope']]]], // end 'site.wind.direction'
  ['site.wind.speed.at10m', [['Variant.WindSpeed'], [['when', 'configure.wind.speed', 'equals', 'at10m', 'Dag.input'], ['finally', 'Wind.speedAt10m', 'site.wind.speed.at20ft']]]], ['site.wind.speed.at20ft', [['Variant.WindSpeed'], [['when', 'configure.wind.speed', 'equals', 'at20ft', 'Dag.input'], ['when', 'configure.wind.speed', 'equals', 'at10m', 'Wind.speedAt20ft', 'site.wind.speed.at10m'], ['finally', 'Wind.speedAt20ftFromMidflame', 'site.wind.speed.atMidflame', 'site.windSpeedAdjustmentFactor']]]], ['site.wind.speed.atMidflame', [['Variant.WindSpeed'], [['when', 'configure.wind.speed', 'equals', 'atMidflame', 'Dag.input'], ['finally', 'Wind.speedAtMidflame', 'site.wind.speed.at20ft', 'site.windSpeedAdjustmentFactor']]]], ['site.windSpeedAdjustmentFactor', [['Variant.Float'], [['finally', 'Dag.input']]]] // end 'site.wind.speed'
  // end 'site.wind'
  // end 'site'
  ];

  var genome$e = [].concat(_toConsumableArray(genome$8), _toConsumableArray(genome$9), _toConsumableArray(genome$a), _toConsumableArray(genome$b), _toConsumableArray(genome$c), _toConsumableArray(genome$d));

  var genome$f = [['site.terrain.spotSourceLocation', [['Variant.SpottingSourceLocationOption'], [['finally', 'Dag.input']]]], ['site.terrain.ridgeValleyDistance', [['Variant.FireSpotDistance'], [['finally', 'Dag.input']]]], ['site.terrain.ridgeValleyElevation', [['Variant.FireSpreadDistance'], [['finally', 'Dag.input']]]], // end 'site.terrain'
  ['spotting.burningPile.firebrand.criticalCoverHeight', [['Variant.TreeHeight'], [['finally', 'Spotting.criticalCoverHeight', 'spotting.burningPile.firebrand.height', 'site.canopy.downwind.appliedHeight']]]], ['spotting.burningPile.firebrand.height', [['Variant.TreeHeight'], [['finally', 'Spotting.burningPileFirebrandHeight', 'spotting.burningPile.flameHeight']]]], ['spotting.burningPile.firebrand.drift', [['Variant.FireSpotDistance'], [['finally', 'Dag.fixed', 0]]]], // end 'spotting.burningPile.firebrand'
  ['spotting.burningPile.spotDistance.flatTerrain', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceFlatTerrain', 'spotting.burningPile.firebrand.height', 'spotting.burningPile.firebrand.criticalCoverHeight', 'site.wind.speed.at20ft']]]], ['spotting.burningPile.spotDistance.flatTerrainWithDrift', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceFlatTerrainWithDrift', 'spotting.burningPile.spotDistance.flatTerrain', 'spotting.burningPile.firebrand.drift']]]], ['spotting.burningPile.spotDistance.mountainTerrain', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceMountainTerrain', 'spotting.burningPile.spotDistance.flatTerrainWithDrift', 'site.terrain.spotSourceLocation', 'site.terrain.ridgeValleyDistance', 'site.terrain.ridgeValleyElevation']]]], // end 'spotting.burningPile.spotDistance'
  ['spotting.burningPile.flameHeight', [['Variant.FireFlameLength'], [['finally', 'Dag.input']]]], // end 'spotting.burningPile'
  ['spotting.crownFire.firebrand.criticalCoverHeight', [['Variant.TreeHeight'], [['finally', 'Dag.fixed', 0]]]], ['spotting.crownFire.firebrand.height', [['Variant.TreeHeight'], [['finally', 'CrownSpotting.zdrop', 'spotting.crownFire.firebrandObject']]]], ['spotting.crownFire.firebrand.drift', [['Variant.FireSpotDistance'], [['finally', 'CrownSpotting.xdrift', 'spotting.crownFire.firebrandObject']]]], // end 'spotting.crownFire.firebrand'
  ['spotting.crownFire.spotDistance.flatTerrain', [['Variant.FireSpotDistance'], [['finally', 'CrownSpotting.xdrop', 'spotting.crownFire.firebrandObject']]]], ['spotting.crownFire.spotDistance.flatTerrainWithDrift', [['Variant.FireSpotDistance'], [['finally', 'CrownSpotting.xspot', 'spotting.crownFire.firebrandObject']]]], ['spotting.crownFire.spotDistance.mountainTerrain', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceMountainTerrain', 'spotting.crownFire.spotDistance.flatTerrainWithDrift', 'site.terrain.spotSourceLocation', 'site.terrain.ridgeValleyDistance', 'site.terrain.ridgeValleyElevation']]]], // end 'spotting.crownFire.spotDistance'
  ['spotting.crownFire.firelineIntensity', [['Variant.FireFirelineIntensity'], [['when', 'configure.module', 'includes', ['crownFire', 'surfaceFire'], 'Dag.bind', 'crown.fire.active.firelineIntensity'], ['finally', 'CrownSpotting.firelineIntensityThomas', 'site.fire.crown.flameLength']]]], ['spotting.crownFire.firebrandObject', [['Variant.SpottingFirebrandObject'], [['finally', 'CrownSpotting.flatDistance', 'site.canopy.crown.totalHeight', 'site.wind.speed.at20ft', 'spotting.crownFire.firelineIntensity']]]], // end 'spotting.crownFire'
  ['spotting.surfaceFire.firebrand.criticalCoverHeight', [['Variant.TreeHeight'], [['finally', 'Spotting.criticalCoverHeight', 'spotting.surfaceFire.firebrand.height', 'site.canopy.downwind.appliedHeight']]]], ['spotting.surfaceFire.firelineIntensity', [['Variant.FireFirelineIntensity'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.firelineIntensity'], ['finally', 'Dag.bind', 'site.fire.observed.firelineIntensity']]]], ['spotting.surfaceFire.firebrand.height', [['Variant.TreeHeight'], [['finally', 'Spotting.surfaceFireFirebrandHeight', 'spotting.surfaceFire.firelineIntensity', 'site.wind.speed.at20ft']]]], ['spotting.surfaceFire.firebrand.drift', [['Variant.FireSpotDistance'], [['finally', 'Spotting.surfaceFireFirebrandDrift', 'spotting.surfaceFire.firebrand.height', 'site.wind.speed.at20ft']]]], // end 'spotting.surfaceFire.firebrand'
  ['spotting.surfaceFire.spotDistance.flatTerrain', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceFlatTerrain', 'spotting.surfaceFire.firebrand.height', 'spotting.surfaceFire.firebrand.criticalCoverHeight', 'site.wind.speed.at20ft']]]], ['spotting.surfaceFire.spotDistance.flatTerrainWithDrift', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceFlatTerrainWithDrift', 'spotting.surfaceFire.spotDistance.flatTerrain', 'spotting.surfaceFire.firebrand.drift']]]], ['spotting.surfaceFire.spotDistance.mountainTerrain', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceMountainTerrain', 'spotting.surfaceFire.spotDistance.flatTerrainWithDrift', 'site.terrain.spotSourceLocation', 'site.terrain.ridgeValleyDistance', 'site.terrain.ridgeValleyElevation']]]], // end 'spotting.surfaceFire.spotDistance'
  // end 'spotting.surfaceFire'
  ['spotting.torchingTrees.firebrand.criticalCoverHeight', [['Variant.TreeHeight'], [['finally', 'Spotting.criticalCoverHeight', 'spotting.torchingTrees.firebrand.height', 'site.canopy.downwind.appliedHeight']]]], ['spotting.torchingTrees.firebrand.height', [['Variant.TreeHeight'], [['finally', 'Spotting.torchingTreesFirebrandHeight', 'spotting.torchingTrees.height', 'spotting.torchingTrees.flameHeight', 'spotting.torchingTrees.flameDuration']]]], ['spotting.torchingTrees.firebrand.drift', [['Variant.FireSpotDistance'], [['finally', 'Dag.fixed', 0]]]], // end 'spotting.torchingTrees.firebrand'
  ['spotting.torchingTrees.spotDistance.flatTerrain', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceFlatTerrain', 'spotting.torchingTrees.firebrand.height', 'spotting.torchingTrees.firebrand.criticalCoverHeight', 'site.wind.speed.at20ft']]]], ['spotting.torchingTrees.spotDistance.flatTerrainWithDrift', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceFlatTerrainWithDrift', 'spotting.torchingTrees.spotDistance.flatTerrain', 'spotting.torchingTrees.firebrand.drift']]]], ['spotting.torchingTrees.spotDistance.mountainTerrain', [['Variant.FireSpotDistance'], [['finally', 'Spotting.spotDistanceMountainTerrain', 'spotting.torchingTrees.spotDistance.flatTerrainWithDrift', 'site.terrain.spotSourceLocation', 'site.terrain.ridgeValleyDistance', 'site.terrain.ridgeValleyElevation']]]], // end 'spotting.torchingTrees.spotDistance'
  ['spotting.torchingTrees.species', [['Variant.TorchingTreeSpeciesOption'], [['finally', 'Dag.input']]]], ['spotting.torchingTrees.height', [['Variant.TreeHeight'], [['finally', 'Dag.input']]]], ['spotting.torchingTrees.dbh', [['Variant.TreeDbh'], [['finally', 'Dag.input']]]], ['spotting.torchingTrees.count', [['Variant.TreeCount'], [['finally', 'Dag.input']]]], ['spotting.torchingTrees.flameHeight', [['Variant.FireFlameLength'], [['finally', 'Spotting.torchingTreesSteadyFlameHeight', 'spotting.torchingTrees.species', 'spotting.torchingTrees.dbh', 'spotting.torchingTrees.count']]]], ['spotting.torchingTrees.flameDuration', [['Variant.FireFlameDuration'], [['finally', 'Spotting.torchingTreesSteadyFlameDuration', 'spotting.torchingTrees.species', 'spotting.torchingTrees.dbh', 'spotting.torchingTrees.count']]]] // end 'spotting.torchingTrees'
  // end 'spotting'
  ];

  var genome$g = [['surface.fire.ellipse.axis.eccentricity', [['Variant.FireLengthToWidthRatio'], [['finally', 'FireEllipse.eccentricity', 'surface.fire.ellipse.axis.lengthToWidthRatio']]]], ['surface.fire.ellipse.axis.effectiveWindSpeed', [['Variant.WindSpeed'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.effectiveWindSpeed'], ['finally', 'Dag.bind', 'site.fire.observed.effectiveWindSpeed']]]], ['surface.fire.ellipse.axis.lengthToWidthRatio', [['Variant.FireLengthToWidthRatio'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.lengthToWidthRatio'], ['finally', 'Dag.bind', 'site.fire.observed.lengthToWidthRatio']]]], ['surface.fire.ellipse.axis.major.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.majorSpreadRate', 'surface.fire.ellipse.head.spreadRate', 'surface.fire.ellipse.back.spreadRate']]]], ['surface.fire.ellipse.axis.minor.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.minorSpreadRate', 'surface.fire.ellipse.axis.major.spreadRate', 'surface.fire.ellipse.axis.lengthToWidthRatio']]]], ['surface.fire.ellipse.axis.f.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.fSpreadRate', 'surface.fire.ellipse.axis.major.spreadRate']]]], ['surface.fire.ellipse.axis.g.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.gSpreadRate', 'surface.fire.ellipse.axis.major.spreadRate', 'surface.fire.ellipse.back.spreadRate']]]], ['surface.fire.ellipse.axis.h.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.hSpreadRate', 'surface.fire.ellipse.axis.minor.spreadRate']]]], // end 'surface.fire.ellipse.axis'
  ['surface.fire.ellipse.vector.fromHead', [['Variant.CompassAzimuth'], [['when', 'configure.fire.vector', 'equals', 'fromHead', 'Dag.bind', 'site.fire.vector.fromHead'], ['when', 'configure.fire.vector', 'equals', 'fromUpslope', 'Compass.diff', 'surface.fire.ellipse.vector.fromUpslope', 'surface.fire.ellipse.heading.fromUpslope'], ['when', 'configure.fire.vector', 'equals', 'fromNorth', 'Compass.diff', 'surface.fire.ellipse.vector.fromNorth', 'surface.fire.ellipse.heading.fromNorth'], ['finally', 'Compass.diff', 'surface.fire.ellipse.vector.fromNorth', 'surface.fire.ellipse.heading.fromNorth']]]], ['surface.fire.ellipse.vector.fromNorth', [['Variant.CompassAzimuth'], [['when', 'configure.fire.vector', 'equals', 'fromNorth', 'Dag.bind', 'site.fire.vector.fromNorth'], ['when', 'configure.fire.vector', 'equals', 'fromHead', 'Compass.sum', 'surface.fire.ellipse.vector.fromHead', 'surface.fire.ellipse.heading.fromNorth'], ['when', 'configure.fire.vector', 'equals', 'fromUpslope', 'Compass.sum', 'surface.fire.ellipse.vector.fromUpslope', 'site.slope.direction.upslope'], ['finally', 'Compass.sum', 'surface.fire.ellipse.vector.fromUpslope', 'site.slope.direction.upslope']]]], ['surface.fire.ellipse.vector.fromUpslope', [['Variant.CompassAzimuth'], [['when', 'configure.fire.vector', 'equals', 'fromUpslope', 'Dag.bind', 'site.fire.vector.fromUpslope'], ['when', 'configure.fire.vector', 'equals', 'fromHead', 'Compass.sum', 'surface.fire.ellipse.vector.fromHead', 'surface.fire.ellipse.heading.fromUpslope'], ['when', 'configure.fire.vector', 'equals', 'fromNorth', 'Compass.diff', 'surface.fire.ellipse.vector.fromNorth', 'site.slope.direction.upslope'], ['finally', 'Compass.diff', 'surface.fire.ellipse.vector.fromNorth', 'site.slope.direction.upslope']]]], // end 'surface.fire.ellipse.vector'
  ['surface.fire.ellipse.size.area', [['Variant.FireArea'], [['finally', 'FireEllipse.area', 'surface.fire.ellipse.size.length', 'surface.fire.ellipse.axis.lengthToWidthRatio']]]], ['surface.fire.ellipse.size.length', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.spreadDistance', 'surface.fire.ellipse.axis.major.spreadRate', 'site.fire.time.sinceIgnition']]]], ['surface.fire.ellipse.size.perimeter', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.perimeter', 'surface.fire.ellipse.size.length', 'surface.fire.ellipse.size.width']]]], ['surface.fire.ellipse.size.width', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.spreadDistance', 'surface.fire.ellipse.axis.minor.spreadRate', 'site.fire.time.sinceIgnition']]]], // end 'surface.fire.ellipse.size'
  ['surface.fire.ellipse.map.area', [['Variant.MapArea'], [['finally', 'FireEllipse.mapArea', 'surface.fire.ellipse.size.area', 'site.map.scale']]]], ['surface.fire.ellipse.map.length', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.size.length', 'site.map.scale']]]], ['surface.fire.ellipse.map.perimeter', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.size.perimeter', 'site.map.scale']]]], ['surface.fire.ellipse.map.width', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.size.width', 'site.map.scale']]]], // end 'surface.fire.ellipse.map'
  ['surface.fire.ellipse.back.spreadDistance', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.spreadDistance', 'surface.fire.ellipse.back.spreadRate', 'site.fire.time.sinceIgnition']]]], ['surface.fire.ellipse.back.firelineIntensity', [['Variant.FireFirelineIntensity'], [['finally', 'FireEllipse.fliAtAzimuth', 'surface.fire.ellipse.head.firelineIntensity', 'surface.fire.ellipse.head.spreadRate', 'surface.fire.ellipse.back.spreadRate']]]], ['surface.fire.ellipse.back.flameLength', [['Variant.FireFlameLength'], [['finally', 'FireEllipse.flameLength', 'surface.fire.ellipse.back.firelineIntensity']]]], ['surface.fire.ellipse.back.mapDistance', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.back.spreadDistance', 'site.map.scale']]]], ['surface.fire.ellipse.back.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.backingSpreadRate', 'surface.fire.ellipse.head.spreadRate', 'surface.fire.ellipse.axis.eccentricity']]]], ['surface.fire.ellipse.back.scorchHeight', [['Variant.FireScorchHeight'], [['finally', 'FireEllipse.scorchHeight', 'surface.fire.ellipse.back.firelineIntensity', 'surface.fire.ellipse.wind.speed.atMidflame', 'site.temperature.air']]]], ['surface.fire.ellipse.back.treeMortality', [['Variant.Fraction'], [['finally', 'TreeMortality.mortality', 'site.canopy.tree.species.fofem6.code', 'site.canopy.tree.dbh', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'surface.fire.ellipse.back.scorchHeight']]]], // end 'surface.fire.ellipse.back'
  ['surface.fire.ellipse.flank.spreadDistance', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.spreadDistance', 'surface.fire.ellipse.flank.spreadRate', 'site.fire.time.sinceIgnition']]]], ['surface.fire.ellipse.flank.firelineIntensity', [['Variant.FireFirelineIntensity'], [['finally', 'FireEllipse.fliAtAzimuth', 'surface.fire.ellipse.head.firelineIntensity', 'surface.fire.ellipse.head.spreadRate', 'surface.fire.ellipse.flank.spreadRate']]]], ['surface.fire.ellipse.flank.flameLength', [['Variant.FireFlameLength'], [['finally', 'FireEllipse.flameLength', 'surface.fire.ellipse.flank.firelineIntensity']]]], ['surface.fire.ellipse.flank.mapDistance', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.flank.spreadDistance', 'site.map.scale']]]], ['surface.fire.ellipse.flank.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.flankingSpreadRate', 'surface.fire.ellipse.axis.minor.spreadRate']]]], ['surface.fire.ellipse.flank.scorchHeight', [['Variant.FireScorchHeight'], [['finally', 'FireEllipse.scorchHeight', 'surface.fire.ellipse.flank.firelineIntensity', 'surface.fire.ellipse.wind.speed.atMidflame', 'site.temperature.air']]]], ['surface.fire.ellipse.flank.treeMortality', [['Variant.Fraction'], [['finally', 'TreeMortality.mortality', 'site.canopy.tree.species.fofem6.code', 'site.canopy.tree.dbh', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'surface.fire.ellipse.flank.scorchHeight']]]], // end 'surface.fire.ellipse.flank'
  ['surface.fire.ellipse.head.spreadDistance', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.spreadDistance', 'surface.fire.ellipse.head.spreadRate', 'site.fire.time.sinceIgnition']]]], ['surface.fire.ellipse.head.firelineIntensity', [['Variant.FireFirelineIntensity'], [// If surfaceFire Module is active, bind to surface fire weighted fireline intensity
  ['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.firelineIntensity'], // Otherwise, bind to the input site.fire.observed.firelineIntensity
  ['finally', 'Dag.bind', 'site.fire.observed.firelineIntensity']]]], ['surface.fire.ellipse.head.flameLength', [['Variant.FireFlameLength'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.flameLength'], ['finally', 'Dag.bind', 'site.fire.observed.flameLength']]]], ['surface.fire.ellipse.head.mapDistance', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.head.spreadDistance', 'site.map.scale']]]], ['surface.fire.ellipse.head.spreadRate', [['Variant.FireSpreadRate'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.spreadRate'], ['finally', 'Dag.bind', 'site.fire.observed.spreadRate']]]], ['surface.fire.ellipse.head.scorchHeight', [['Variant.FireScorchHeight'], [['finally', 'FireEllipse.scorchHeight', 'surface.fire.ellipse.head.firelineIntensity', 'surface.fire.ellipse.wind.speed.atMidflame', 'site.temperature.air']]]], ['surface.fire.ellipse.head.treeMortality', [['Variant.Fraction'], [['finally', 'TreeMortality.mortality', 'site.canopy.tree.species.fofem6.code', 'site.canopy.tree.dbh', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'surface.fire.ellipse.head.scorchHeight']]]], // end 'surface.fire.ellipse.head'
  ['surface.fire.ellipse.psi.spreadDistance', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.spreadDistance', 'surface.fire.ellipse.psi.spreadRate', 'site.fire.time.sinceIgnition']]]], ['surface.fire.ellipse.psi.firelineIntensity', [['Variant.FireFirelineIntensity'], [['finally', 'FireEllipse.fliAtAzimuth', 'surface.fire.ellipse.head.firelineIntensity', 'surface.fire.ellipse.head.spreadRate', 'surface.fire.ellipse.psi.spreadRate']]]], ['surface.fire.ellipse.psi.flameLength', [['Variant.FireFlameLength'], [['finally', 'FireEllipse.flameLength', 'surface.fire.ellipse.psi.firelineIntensity']]]], ['surface.fire.ellipse.psi.mapDistance', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.psi.spreadDistance', 'site.map.scale']]]], ['surface.fire.ellipse.psi.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.psiSpreadRate', 'surface.fire.ellipse.vector.fromHead', 'surface.fire.ellipse.axis.f.spreadRate', 'surface.fire.ellipse.axis.g.spreadRate', 'surface.fire.ellipse.axis.h.spreadRate']]]], ['surface.fire.ellipse.psi.scorchHeight', [['Variant.FireScorchHeight'], [['finally', 'FireEllipse.scorchHeight', 'surface.fire.ellipse.psi.firelineIntensity', 'surface.fire.ellipse.wind.speed.atMidflame', 'site.temperature.air']]]], ['surface.fire.ellipse.psi.treeMortality', [['Variant.Fraction'], [['finally', 'TreeMortality.mortality', 'site.canopy.tree.species.fofem6.code', 'site.canopy.tree.dbh', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'surface.fire.ellipse.psi.scorchHeight']]]], // end 'surface.fire.ellipse.psi'
  ['surface.fire.ellipse.beta5.spreadDistance', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.spreadDistance', 'surface.fire.ellipse.beta5.spreadRate', 'site.fire.time.sinceIgnition']]]], ['surface.fire.ellipse.beta5.firelineIntensity', [['Variant.FireFirelineIntensity'], [['finally', 'FireEllipse.fliAtAzimuth', 'surface.fire.ellipse.head.firelineIntensity', 'surface.fire.ellipse.head.spreadRate', 'surface.fire.ellipse.beta.spreadRate']]]], ['surface.fire.ellipse.beta5.flameLength', [['Variant.FireFlameLength'], [['finally', 'FireEllipse.flameLength', 'surface.fire.ellipse.beta5.firelineIntensity']]]], ['surface.fire.ellipse.beta5.mapDistance', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.beta5.spreadDistance', 'site.map.scale']]]], ['surface.fire.ellipse.beta5.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'Dag.bind', 'surface.fire.ellipse.beta.spreadRate']]]], ['surface.fire.ellipse.beta5.scorchHeight', [['Variant.FireScorchHeight'], [['finally', 'FireEllipse.scorchHeight', 'surface.fire.ellipse.beta5.firelineIntensity', 'surface.fire.ellipse.wind.speed.atMidflame', 'site.temperature.air']]]], ['surface.fire.ellipse.beta5.treeMortality', [['Variant.Fraction'], [['finally', 'TreeMortality.mortality', 'site.canopy.tree.species.fofem6.code', 'site.canopy.tree.dbh', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'surface.fire.ellipse.beta5.scorchHeight']]]], // end 'surface.fire.ellipse.beta5'
  ['surface.fire.ellipse.beta.spreadDistance', [['Variant.FireSpreadDistance'], [['finally', 'FireEllipse.spreadDistance', 'surface.fire.ellipse.beta.spreadRate', 'site.fire.time.sinceIgnition']]]], ['surface.fire.ellipse.beta.firelineIntensity', [['Variant.FireFirelineIntensity'], [['finally', 'FireEllipse.fliAtAzimuth', 'surface.fire.ellipse.head.firelineIntensity', 'surface.fire.ellipse.head.spreadRate', 'surface.fire.ellipse.beta.psiSpreadRate']]]], ['surface.fire.ellipse.beta.flameLength', [['Variant.FireFlameLength'], [['finally', 'FireEllipse.flameLength', 'surface.fire.ellipse.beta.firelineIntensity']]]], ['surface.fire.ellipse.beta.mapDistance', [['Variant.MapDistance'], [['finally', 'Calc.divide', 'surface.fire.ellipse.beta.spreadDistance', 'site.map.scale']]]], ['surface.fire.ellipse.beta.spreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.betaSpreadRate', 'surface.fire.ellipse.vector.fromHead', 'surface.fire.ellipse.head.spreadRate', 'surface.fire.ellipse.axis.eccentricity']]]], ['surface.fire.ellipse.beta.scorchHeight', [['Variant.FireScorchHeight'], [['finally', 'FireEllipse.scorchHeight', 'surface.fire.ellipse.beta.firelineIntensity', 'surface.fire.ellipse.wind.speed.atMidflame', 'site.temperature.air']]]], ['surface.fire.ellipse.beta.treeMortality', [['Variant.Fraction'], [['finally', 'TreeMortality.mortality', 'site.canopy.tree.species.fofem6.code', 'site.canopy.tree.dbh', 'site.canopy.crown.totalHeight', 'site.canopy.crown.baseHeight', 'surface.fire.ellipse.beta.scorchHeight']]]], ['surface.fire.ellipse.beta.theta', [['Variant.CompassAzimuth'], [['finally', 'FireEllipse.thetaFromBeta', 'surface.fire.ellipse.vector.fromHead', 'surface.fire.ellipse.axis.f.spreadRate', 'surface.fire.ellipse.axis.g.spreadRate', 'surface.fire.ellipse.axis.h.spreadRate']]]], ['surface.fire.ellipse.beta.psi', [['Variant.CompassAzimuth'], [['finally', 'FireEllipse.psiFromTheta', 'surface.fire.ellipse.beta.theta', 'surface.fire.ellipse.axis.f.spreadRate', 'surface.fire.ellipse.axis.h.spreadRate']]]], ['surface.fire.ellipse.beta.psiSpreadRate', [['Variant.FireSpreadRate'], [['finally', 'FireEllipse.psiSpreadRate', 'surface.fire.ellipse.beta.psi', 'surface.fire.ellipse.axis.f.spreadRate', 'surface.fire.ellipse.axis.g.spreadRate', 'surface.fire.ellipse.axis.h.spreadRate']]]], // end 'surface.fire.ellipse.beta'
  ['surface.fire.ellipse.heading.fromUpslope', [['Variant.CompassAzimuth'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.heading.fromUpslope'], ['finally', 'Dag.bind', 'site.fire.observed.heading.fromUpslope']]]], ['surface.fire.ellipse.heading.fromNorth', [['Variant.CompassAzimuth'], [['finally', 'Compass.sum', 'site.slope.direction.upslope', 'surface.fire.ellipse.heading.fromUpslope']]]], ['surface.fire.ellipse.wind.speed.atMidflame', [['Variant.WindSpeed'], [['when', 'configure.module', 'equals', 'surfaceFire', 'Dag.bind', 'surface.weighted.fire.wind.speed.atMidflame'], ['finally', 'Dag.bind', 'site.wind.speed.atMidflame']]]] // end 'surface.fire.ellipse'
  ];

  function genome$h(prefix, fuel) {
    return [["".concat(prefix, ".model.behave.domain"), [['Variant.FuelModelDomainOption'], [['finally', 'Dag.fixed', 'behave']]]], ["".concat(prefix, ".model.behave.parms.cured.herb.fraction"), [['Variant.FuelDeadFraction'], [['when', 'configure.fuel.curedHerbFraction', 'equals', 'estimated', 'Behave.curedHerbFraction', 'site.moisture.live.herb'], ['finally', 'Dag.input']]]], ["".concat(prefix, ".model.behave.parms.depth"), [['Variant.FuelBedDepth'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveDepth', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".model.behave.parms.dead.extinction.moistureContent"), [['Variant.FuelMoistureContent'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveDeadMext', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 0.25]]]], ["".concat(prefix, ".model.behave.parms.total.herb.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveTotalHerbLoad', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.behave.parms.dead.tl1h.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveDead1Load', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.behave.parms.dead.tl10h.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveDead10Load', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.behave.parms.dead.tl100h.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveDead100Load', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.behave.parms.live.stem.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveLiveStemLoad', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.behave.parms.dead.tl1h.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveDead1Savr', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.behave.parms.live.herb.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveLiveHerbSavr', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 1]]]], ["".concat(prefix, ".model.behave.parms.live.stem.surfaceAreaToVolumeRatio"), [['Variant.FuelSurfaceAreaToVolumeRatio'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveLiveStemSavr', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 1]]]], ["".concat(prefix, ".model.behave.parms.dead.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveDeadHeat', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 8000]]]], ["".concat(prefix, ".model.behave.parms.live.heatOfCombustion"), [['Variant.FuelHeatOfCombustion'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.behaveLiveHeat', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.input'], ['finally', 'Dag.fixed', 8000]]]], // end `${prefix}.model.behave.parms`
    ["".concat(prefix, ".model.behave.derived.dead.herb.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Behave.deadHerbLoad', "".concat(prefix, ".model.behave.parms.total.herb.ovendryLoad"), "".concat(prefix, ".model.behave.parms.cured.herb.fraction")]]]], ["".concat(prefix, ".model.behave.derived.live.herb.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Behave.liveHerbLoad', "".concat(prefix, ".model.behave.parms.total.herb.ovendryLoad"), "".concat(prefix, ".model.behave.parms.cured.herb.fraction")]]]] // end `${prefix}.model.behave.derived`
    ];
  }

  function genome$i(prefix, fuel) {
    return [["".concat(prefix, ".model.chaparral.domain"), [['Variant.FuelModelDomainOption'], [['finally', 'Dag.fixed', 'chaparral']]]], ["".concat(prefix, ".model.chaparral.parms.chaparralType"), [['Variant.ChaparralTypeOption'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.chaparralFuelType', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'chaparral', 'Dag.input'], ['finally', 'Dag.fixed', 'chamise']]]], ["".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction"), [['Variant.FuelDeadFraction'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.chaparralDeadFraction', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'chaparral', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.chaparral.parms.observed.depth"), [['Variant.FuelBedDepth'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.chaparralDepth', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'chaparral', 'Dag.input'], ['finally', 'Dag.fixed', 0.01]]]], ["".concat(prefix, ".model.chaparral.parms.observed.totalLoad"), [['Variant.FuelOvendryLoad'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.chaparralTotalLoad', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'chaparral', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), [['Variant.FuelOvendryLoad'], [['when', 'configure.fuel.chaparralTotalLoad', 'equals', 'estimated', 'Dag.bind', "".concat(prefix, ".model.chaparral.derived.totalLoad")], ['finally', 'Dag.bind', "".concat(prefix, ".model.chaparral.parms.observed.totalLoad")]]]], // end `${prefix}.model.chaparral.parms`
    ["".concat(prefix, ".model.chaparral.derived.age"), [['Variant.FuelAge'], [['finally', 'Chaparral.age', "".concat(prefix, ".model.chaparral.parms.observed.depth"), "".concat(prefix, ".model.chaparral.parms.chaparralType")]]]], ["".concat(prefix, ".model.chaparral.derived.averageMortality"), [['Variant.MortalityFraction'], [['finally', 'Chaparral.deadFractionAverageMortality', "".concat(prefix, ".model.chaparral.derived.age")]]]], ["".concat(prefix, ".model.chaparral.derived.severeMortality"), [['Variant.MortalityFraction'], [['finally', 'Chaparral.deadFractionSevereMortality', "".concat(prefix, ".model.chaparral.derived.age")]]]], ["".concat(prefix, ".model.chaparral.derived.depth"), [['Variant.FuelBedDepth'], [['finally', 'Chaparral.fuelDepth', "".concat(prefix, ".model.chaparral.derived.age"), "".concat(prefix, ".model.chaparral.parms.chaparralType")]]]], ["".concat(prefix, ".model.chaparral.derived.totalLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.totalLoad', "".concat(prefix, ".model.chaparral.derived.age"), "".concat(prefix, ".model.chaparral.parms.chaparralType")]]]], ["".concat(prefix, ".model.chaparral.derived.deadLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.deadLoad', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.deadFineLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.deadClass1Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.deadSmallLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.deadClass2Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.deadMediumLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.deadClass3Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.deadLargeLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.deadClass4Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.liveLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.liveLoad', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.liveFineLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.liveClass1Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.liveSmallLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.liveClass2Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.liveMediumLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.liveClass3Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.liveLargeLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.liveClass4Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]], ["".concat(prefix, ".model.chaparral.derived.liveLeafLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'Chaparral.liveClass5Load', "".concat(prefix, ".model.chaparral.parms.applied.totalLoad"), "".concat(prefix, ".model.chaparral.parms.observed.deadFuelFraction")]]]] // end `${prefix}.model.chaparral.derived`
    ];
  }

  function genome$j(prefix, fuel) {
    return [["".concat(prefix, ".model.palmettoGallberry.domain"), [['Variant.FuelModelDomainOption'], [['finally', 'Dag.fixed', 'palmettoGallberry']]]], ["".concat(prefix, ".model.palmettoGallberry.parms.age"), [['Variant.FuelAge'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.palmettoGallberrylAge', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'palmettoGallberry', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.palmettoGallberry.parms.basalArea"), [['Variant.FuelBasalArea'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.palmettoGallberrylBasalArea', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'palmettoGallberry', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.palmettoGallberry.parms.cover"), [['Variant.FuelCoverFraction'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.palmettoGallberrylCover', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'palmettoGallberry', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], ["".concat(prefix, ".model.palmettoGallberry.parms.height"), [['Variant.FuelBedDepth'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.palmettoGallberrylHeight', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'palmettoGallberry', 'Dag.input'], ['finally', 'Dag.fixed', 0.01]]]], // end `${prefix}.model.palmettoGallberry.parms`
    ["".concat(prefix, ".model.palmettoGallberry.derived.depth"), [['Variant.FuelBedDepth'], [['finally', 'PalmettoGallberry.fuelDepth', "".concat(prefix, ".model.palmettoGallberry.parms.height")]]]], ["".concat(prefix, ".model.palmettoGallberry.derived.deadFineLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'PalmettoGallberry.deadFineLoad', "".concat(prefix, ".model.palmettoGallberry.parms.age"), "".concat(prefix, ".model.palmettoGallberry.parms.height")]]]], ["".concat(prefix, ".model.palmettoGallberry.derived.deadSmallLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'PalmettoGallberry.deadSmallLoad', "".concat(prefix, ".model.palmettoGallberry.parms.age"), "".concat(prefix, ".model.palmettoGallberry.parms.cover")]]]], ["".concat(prefix, ".model.palmettoGallberry.derived.deadFoliageLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'PalmettoGallberry.deadFoliageLoad', "".concat(prefix, ".model.palmettoGallberry.parms.age"), "".concat(prefix, ".model.palmettoGallberry.parms.cover")]]]], ["".concat(prefix, ".model.palmettoGallberry.derived.deadLitterLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'PalmettoGallberry.deadLitterLoad', "".concat(prefix, ".model.palmettoGallberry.parms.age"), "".concat(prefix, ".model.palmettoGallberry.parms.basalArea")]]]], ["".concat(prefix, ".model.palmettoGallberry.derived.liveFineLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'PalmettoGallberry.liveFineLoad', "".concat(prefix, ".model.palmettoGallberry.parms.age"), "".concat(prefix, ".model.palmettoGallberry.parms.height")]]]], ["".concat(prefix, ".model.palmettoGallberry.derived.liveSmallLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'PalmettoGallberry.liveSmallLoad', "".concat(prefix, ".model.palmettoGallberry.parms.age"), "".concat(prefix, ".model.palmettoGallberry.parms.height")]]]], ["".concat(prefix, ".model.palmettoGallberry.derived.liveFoliageLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'PalmettoGallberry.liveFoliageLoad', "".concat(prefix, ".model.palmettoGallberry.parms.age"), "".concat(prefix, ".model.palmettoGallberry.parms.cover"), "".concat(prefix, ".model.palmettoGallberry.parms.height")]]]] // end `${prefix}.model.palmettoGallberry.derived`
    ];
  }

  function genome$k(prefix, fuel) {
    return [["".concat(prefix, ".model.westernAspen.domain"), [['Variant.FuelModelDomainOption'], [['finally', 'Dag.fixed', 'westernAspen']]]], ["".concat(prefix, ".model.westernAspen.parms.aspenType"), [['Variant.WesternAspenTypeOption'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.westernAspenFuelType', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'westernAspen', 'Dag.input'], ['finally', 'Dag.fixed', 'aspenShrub']]]], ["".concat(prefix, ".model.westernAspen.parms.curingLevel"), [['Variant.FuelDeadFraction'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.westernAspenCuringLevel', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'westernAspen', 'Dag.input'], ['finally', 'Dag.fixed', 0]]]], // end `${prefix}.model.westernAspen.parms`
    ["".concat(prefix, ".model.westernAspen.derived.depth"), [['Variant.FuelBedDepth'], [['finally', 'WesternAspen.depth', "".concat(prefix, ".model.westernAspen.parms.aspenType")]]]], ["".concat(prefix, ".model.westernAspen.derived.dead.fine.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'WesternAspen.deadFineLoad', "".concat(prefix, ".model.westernAspen.parms.aspenType"), "".concat(prefix, ".model.westernAspen.parms.curingLevel")]]]], ["".concat(prefix, ".model.westernAspen.derived.dead.small.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'WesternAspen.deadSmallLoad', "".concat(prefix, ".model.westernAspen.parms.aspenType")]]]], ["".concat(prefix, ".model.westernAspen.derived.dead.fine.surfaceAreaToVolumeRatio"), [['Variant.FuelOvendryLoad'], [['finally', 'WesternAspen.deadFineSavr', "".concat(prefix, ".model.westernAspen.parms.aspenType"), "".concat(prefix, ".model.westernAspen.parms.curingLevel")]]]], ["".concat(prefix, ".model.westernAspen.derived.live.herb.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'WesternAspen.liveHerbLoad', "".concat(prefix, ".model.westernAspen.parms.aspenType"), "".concat(prefix, ".model.westernAspen.parms.curingLevel")]]]], ["".concat(prefix, ".model.westernAspen.derived.live.stem.ovendryLoad"), [['Variant.FuelOvendryLoad'], [['finally', 'WesternAspen.liveStemLoad', "".concat(prefix, ".model.westernAspen.parms.aspenType"), "".concat(prefix, ".model.westernAspen.parms.curingLevel")]]]], ["".concat(prefix, ".model.westernAspen.derived.live.stem.surfaceAreaToVolumeRatio"), [['Variant.FuelOvendryLoad'], [['finally', 'WesternAspen.liveStemSavr', "".concat(prefix, ".model.westernAspen.parms.aspenType"), "".concat(prefix, ".model.westernAspen.parms.curingLevel")]]]] // end `${prefix}.model.westernAspen.derived`
    ];
  }

  function FuelModelGenome(prefix, fuel) {
    return [["".concat(prefix, ".model.domain"), [['Variant.FuelModelDomainOption'], [['when', "configure.fuel.".concat(fuel), 'equals', 'catalog', 'FuelCatalog.domain', "".concat(prefix, ".model.catalogKey")], ['when', "configure.fuel.".concat(fuel), 'equals', 'behave', 'Dag.fixed', 'behave'], ['when', "configure.fuel.".concat(fuel), 'equals', 'chaparral', 'Dag.fixed', 'chaparral'], ['when', "configure.fuel.".concat(fuel), 'equals', 'palmettoGallberry', 'Dag.fixed', 'palmettoGallberry'], ['when', "configure.fuel.".concat(fuel), 'equals', 'westernAspen', 'Dag.fixed', 'westernAspen'], ['finally', 'Dag.fixed', 'none']]]], ["".concat(prefix, ".model.catalogKey"), [['Variant.FuelModelKeyOption'], [['finally', 'Dag.input']]]]];
  }
  function genome$l(prefix) {
    var fuel = prefix === 'surface.secondary.fuel' ? 'secondary' : 'primary';
    return [].concat(_toConsumableArray(FuelModelGenome(prefix, fuel)), _toConsumableArray(genome$h(prefix, fuel)), _toConsumableArray(genome$i(prefix, fuel)), _toConsumableArray(genome$j(prefix, fuel)), _toConsumableArray(genome$k(prefix, fuel)));
  }

  function genome$m(prefix) {
    return [].concat(_toConsumableArray(genome$2(prefix)), _toConsumableArray(genome$3(prefix)), _toConsumableArray(genome$l(prefix)));
  }

  var genome$n = [['surface.weighted.fire.primaryCover', [['Variant.FuelCoverFraction'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.fixed', 1], ['finally', 'Dag.input']]]], // These are all bound to the primary surface fuel
  ['surface.weighted.fire.effectiveWindSpeed', [['Variant.WindSpeed'], [['finally', 'Dag.bind', 'surface.primary.fuel.fire.effectiveWindSpeed']]]], ['surface.weighted.fire.heading.fromUpslope', [['Variant.CompassAzimuth'], [['finally', 'Dag.bind', 'surface.primary.fuel.fire.heading.fromUpslope']]]], ['surface.weighted.fire.heading.fromNorth', [['Variant.CompassAzimuth'], [['finally', 'Dag.bind', 'surface.primary.fuel.fire.heading.fromNorth']]]], ['surface.weighted.fire.lengthToWidthRatio', [['Variant.FireLengthToWidthRatio'], [['finally', 'Dag.bind', 'surface.primary.fuel.fire.lengthToWidthRatio']]]], ['surface.weighted.fire.wind.speed.atMidflame', [['Variant.WindSpeed'], [['finally', 'Dag.bind', 'surface.primary.fuel.fire.wind.speed.atMidflame']]]], ['surface.weighted.fire.windSpeedAdjustmentFactor', [['Variant.WindSpeedAdjustmentFraction'], [['finally', 'Dag.bind', 'surface.primary.fuel.fire.windSpeedAdjustmentFactor']]]], // These use the maximum of the primary or secondary fuel
  ['surface.weighted.fire.firelineIntensity', [['Variant.FireFirelineIntensity'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.firelineIntensity'], ['finally', 'Math.max', 'surface.primary.fuel.fire.firelineIntensity', 'surface.secondary.fuel.fire.firelineIntensity']]]], ['surface.weighted.fire.flameLength', [['Variant.FireFlameLength'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.flameLength'], ['finally', 'Math.max', 'surface.primary.fuel.fire.flameLength', 'surface.secondary.fuel.fire.flameLength']]]], ['surface.weighted.fire.heatPerUnitArea', [['Variant.FireHeatPerUnitArea'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.heatPerUnitArea'], ['finally', 'Math.max', 'surface.primary.fuel.fire.heatPerUnitArea', 'surface.secondary.fuel.fire.heatPerUnitArea']]]], ['surface.weighted.fire.reactionIntensity', [['Variant.FireReactionIntensity'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.reactionIntensity'], ['finally', 'Math.max', 'surface.primary.fuel.fire.reactionIntensity', 'surface.secondary.fuel.fire.reactionIntensity']]]], ['surface.weighted.fire.scorchHeight', [['Variant.FireScorchHeight'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.scorchHeight'], ['finally', 'Math.max', 'surface.primary.fuel.fire.scorchHeight', 'surface.secondary.fuel.fire.scorchHeight']]]], // If either limit is execeeded
  ['surface.weighted.fire.limit.effectiveWindSpeed.exceeded', [['Variant.Bool'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.limit.effectiveWindSpeed.exceeded'], ['finally', 'Calc.or', 'surface.primary.fuel.fire.limit.effectiveWindSpeed.exceeded', 'surface.secondary.fuel.fire.limit.effectiveWindSpeed.exceeded']]]], // This uses the minimum of the primary or secondary fuel
  ['surface.weighted.fire.limit.effectiveWindSpeed', [['Variant.WindSpeed'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.limit.effectiveWindSpeed'], ['finally', 'Math.min', 'surface.primary.fuel.fire.limit.effectiveWindSpeed', 'surface.secondary.fuel.fire.limit.effectiveWindSpeed']]]], // Weighted spread rates
  ['surface.weighted.fire.spreadRate', [['Variant.FireSpreadRate'], [['when', 'configure.fire.weightingMethod', 'equals', 'expected', 'Dag.bind', 'surface.weighted.fire.expectedValue.spreadRate'], ['when', 'configure.fire.weightingMethod', 'equals', 'harmonic', 'Dag.bind', 'surface.weighted.fire.harmonicMean.spreadRate'], ['finally', 'Dag.bind', 'surface.weighted.fire.arithmeticMean.spreadRate']]]], ['surface.weighted.fire.arithmeticMean.spreadRate', [['Variant.FireSpreadRate'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.spreadRate'], ['finally', 'FireWeighting.arithmeticMeanSpreadRate', 'surface.weighted.fire.primaryCover', 'surface.primary.fuel.fire.spreadRate', 'surface.secondary.fuel.fire.spreadRate']]]], ['surface.weighted.fire.expectedValue.spreadRate', [['Variant.FireSpreadRate'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.spreadRate'], ['finally', 'FireWeighting.expectedValueSpreadRate', 'surface.weighted.fire.primaryCover', 'surface.primary.fuel.fire.spreadRate', 'surface.secondary.fuel.fire.spreadRate']]]], ['surface.weighted.fire.harmonicMean.spreadRate', [['Variant.FireSpreadRate'], [['when', 'configure.fuel.secondary', 'equals', 'none', 'Dag.bind', 'surface.primary.fuel.fire.spreadRate'], ['finally', 'FireWeighting.harmonicMeanSpreadRate', 'surface.weighted.fire.primaryCover', 'surface.primary.fuel.fire.spreadRate', 'surface.secondary.fuel.fire.spreadRate']]]]];

  var genome$o = [].concat(_toConsumableArray(genome$m('surface.primary.fuel')), _toConsumableArray(genome$m('surface.secondary.fuel')), _toConsumableArray(genome$n), _toConsumableArray(genome$g));

  var BpxGenome = [].concat(_toConsumableArray(genome), _toConsumableArray(genome$5), _toConsumableArray(genome$6), _toConsumableArray(genome$e), _toConsumableArray(genome$o), _toConsumableArray(genome$f), _toConsumableArray(genome$7), _toConsumableArray(genome$4));

  var BpxTranslationMap = new Map([['site.moisture.dead.tl1h/label@en_US', 'Site Fuel Moisture Dead 1-h'], ['site.moisture.dead.tl1h/headers@en_US', ['Dead 1-h', 'Fuel Mois']], ['configure.fuel.primary/label@en_US', 'Primary fuels are specified by entering'], ['configure.fuel.primary/value.catalog@en_US', 'a fuel catalog key'], ['configure.fuel.primary/value.behave@en_US', 'Behave fuel parameters'], ['configure.fuel.primary/value.chaparral@en_US', 'chaparral dynamic stand parameters'], ['configure.fuel.primary/value.palmettoGallberry@en_US', 'palmetto-gallberry dynamic stand parameters'], ['configure.fuel.primary/value.westernAspen@en_US', 'western aspen dynamic stand parameters']]);

  /**
   * @file Exported WFSP math functions.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */
  var divide = function divide() {
    for (var _len = arguments.length, numbers = new Array(_len), _key = 0; _key < _len; _key++) {
      numbers[_key] = arguments[_key];
    }

    return numbers.reduce(function (a, b) {
      return b === 0 ? 0 : a / b;
    }, numbers[0] * numbers[0]);
  };
  var fraction = function fraction(number) {
    return Math.max(0, Math.min(1, number));
  };
  var greaterThan = function greaterThan(a, b) {
    return a > b;
  };
  var multiply = function multiply() {
    for (var _len2 = arguments.length, numbers = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      numbers[_key2] = arguments[_key2];
    }

    return numbers.reduce(function (a, b) {
      return a * b;
    }, 1);
  };
  var or = function or(a, b) {
    return a || b;
  };
  var positive = function positive(number) {
    return Math.max(0, number);
  };
  var subtract = function subtract() {
    for (var _len3 = arguments.length, numbers = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      numbers[_key3] = arguments[_key3];
    }

    return numbers.reduce(function (a, b) {
      return a - b;
    }, 2 * numbers[0]);
  };
  var sum = function sum() {
    for (var _len4 = arguments.length, numbers = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      numbers[_key4] = arguments[_key4];
    }

    return numbers.reduce(function (a, b) {
      return a + b;
    }, 0);
  };
  var sumOfProducts = function sumOfProducts() {
    for (var _len5 = arguments.length, numbers = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      numbers[_key5] = arguments[_key5];
    }

    var mid = Math.floor(numbers.length / 2);
    var a1 = numbers.slice(0, mid);
    return a1.reduce(function (acc, number, idx) {
      return acc + a1[idx] * numbers[mid + idx];
    }, 0);
  };

  var Calc = /*#__PURE__*/Object.freeze({
    __proto__: null,
    divide: divide,
    fraction: fraction,
    greaterThan: greaterThan,
    multiply: multiply,
    or: or,
    positive: positive,
    subtract: subtract,
    sum: sum,
    sumOfProducts: sumOfProducts
  });

  /**
   * @file Exported WFSP standard Behave fuel model equations as implemented by BehavePlus v6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins
   * @license MIT
   */
  function curedHerbFraction(liveHerbMc) {
    var fraction$1 = 1.333 - 1.11 * liveHerbMc;
    return fraction(fraction$1);
  }
  function deadHerbLoad(totalHerbLoad, curedHerbFraction) {
    return totalHerbLoad * curedHerbFraction;
  }
  function liveHerbLoad(totalHerbLoad, curedHerbFraction) {
    return totalHerbLoad * (1 - curedHerbFraction);
  }

  var BehaveFuel = /*#__PURE__*/Object.freeze({
    __proto__: null,
    curedHerbFraction: curedHerbFraction,
    deadHerbLoad: deadHerbLoad,
    liveHerbLoad: liveHerbLoad
  });

  /**
   * @file Exported WFSP canopy functions as implemented by BehavePlus v6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */
  // is filled with tree crowns (division by 3 assumes conical crown shapes).

  function crownFill(cover, cratio) {
    return fraction(cratio) * fraction(cover) / 3;
  } // Crown length

  function crownLength(baseHt, ht) {
    return positive(ht - baseHt);
  } // // Crown length from crown ratio and canopy height
  // export function crownLengthFromRatio(crownRatio, ht) {
  //   return crownRatio * ht
  // }
  // Crown ratio

  function crownRatio(length, ht) {
    return fraction(divide(length, ht));
  } // Canopy fuel load

  function fuelLoad(bulk, length) {
    return positive(bulk * length);
  } // Canopy heat per unit area

  function heatPerUnitArea(load, heat) {
    return positive(load * heat);
  } // Returns true if canopy effectively shelters the fuel from wind

  function sheltersFuelFromWind(cover, ht, fill) {
    return cover >= 0.01 && fill >= 0.05 && ht >= 6;
  } // Canopy induced midflame windspeed adjustment factor

  function windSpeedAdjustmentFactor$1(cover, ht, fill) {
    var waf = 1;

    if (sheltersFuelFromWind(cover, ht, fill)) {
      waf = 0.555 / (Math.sqrt(fill * ht) * Math.log((20 + 0.36 * ht) / (0.13 * ht)));
    }

    return fraction(waf);
  }

  var Canopy = /*#__PURE__*/Object.freeze({
    __proto__: null,
    crownFill: crownFill,
    crownLength: crownLength,
    crownRatio: crownRatio,
    fuelLoad: fuelLoad,
    heatPerUnitArea: heatPerUnitArea,
    sheltersFuelFromWind: sheltersFuelFromWind,
    windSpeedAdjustmentFactor: windSpeedAdjustmentFactor$1
  });

  /**
   * @file Exported WFSP chaparral dynamic fuel equations
   * as described by Rothermel and Philpot (1973)
   * and as implemented by BehavePlus V6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins
   * @license MIT
   */
  var TypeChamise = 'chamise';
  var TypeMixedBrush = 'mixedBrush';
  var Types = [TypeChamise, TypeMixedBrush];
  /**
   * Estimates the chaparral age (years since last burned)
   * from the chaparral fuel depth and fuel type.
   *
   *  @param {number} depth - Chaparral fuel depth (ft+1)
   *  @param {string} type -  Chaparral fuel type ['chamise' | 'mixedBrush']
   *  @returns {number} Estimated chaparral age (years since last burned).
   */

  function age(depth, type) {
    if (type === TypeChamise) {
      return Math.exp(3.912023 * Math.sqrt(depth / 7.5));
    }

    if (type === TypeMixedBrush) {
      return Math.exp(3.912023 * Math.sqrt(depth / 10));
    }

    return 0;
  }
  /**
   * Estimates the chaparral fuel depth from its age and type.
   *
   * @param {number} age
   * @param {string} type  One of 'chamise' or 'mixedBrush'
   * @returns {number} Estimated fuel bed depth (ft+1)
   */

  function fuelDepth(age, type) {
    // Prevent values of age < 1 from increasing the depth!
    var x = Math.log(Math.max(age, 1.1)) / 3.912023;
    return type === TypeChamise ? 7.5 * x * x : 10 * x * x; // type === TypeMixedBrush
  }
  /**
   * @returns {string[]} Array of valid chaparral fuel types.
   */

  function fuelTypes() {
    return Types;
  }
  /**
   *  Estimates the total chaparral fuel load from age and type.
   *
   * NOTE - Rothermel & Philpot (1973) used a factor of 0.0315 for chamise age,
   * while Cohen used 0.0347 in FIRECAST.  According to Faith Ann Heinsch:
   * <i>We are going to use Cohen’s calculation from FIRECAST. The change has to do
   * with the fact that we are creating a proxy age from fuel bed depth rather than
   * using an entered age. He had to make some corrections for that assumption.</i>
   *
   *  @param {number} age - Chaparral age (years since last burned)
   *  @param {string} type -  Chaparral fuel type ['chamise' | 'mixedBrush']
   *  @returns {number} Total fuel load (lb+1 ft-2)
   */

  function totalLoad(age, type) {
    // Total load in tons per acre
    var tpa = 0;

    if (type === TypeChamise) {
      // const chamise1 = 0.0315   // Chamise load factor from Rothermel & Philpot (1973)
      var chamise2 = 0.0347; // Chamise load factor from Cohen's FIRECAST code

      tpa = age / (1.4459 + chamise2 * age);
    } else if (type === TypeMixedBrush) {
      tpa = age / (0.4849 + 0.017 * age);
    } // Return total load in lb/ft2


    return tpa * 2000 / 43560;
  }
  /**
   * @returns {number} The dead fuel moisture content of extinction (fraction)
   * as used in BehavePlus V6.
   */

  function deadExtinctionMoisture() {
    return 0.3;
  }
  /**
   * Dead fuel fraction from age for AVERAGE mortality level
   *
   * @param {number} age - Chaparral age (years since last burned)
   * @returns {number} Dead fuel fraction assuming avereage mortality.
   */

  function deadFractionAverageMortality(age) {
    return fraction(0.0694 * Math.exp(0.0402 * age));
  }
  /**
   * Dead fuel fraction from age for SEVERE mortality level
   *
   * @param {number} age - Chaparral age (years since last burned)
   * @returns {number} Dead fuel fraction assuming severe mortality.
   */

  function deadFractionSevereMortality(age) {
    return fraction(0.1094 * Math.exp(0.0385 * age));
  }
  /**
   *  Estimates chaparral dead fuel load.
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} Chaparral dead fuel load (lb+1 ft-2)
   */

  function deadLoad(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * deadFuelFraction);
  }
  /**
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the dead fine (0 to 0.25 inch diameter) chaparral stem wood
   * as per Rothermel and Philpot 1973 Figure 1.
   */

  function deadClass1Load(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * 0.347 * deadFuelFraction);
  }
  /**
   *  Estimates chaparral small (0.25-0.5 inch diameter) dead fuel load.
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the dead small (0.25 to 0.5 inch diameter) chaparral stem wood
   * as per Rothermel and Philpot 1973 Figure 1.
   */

  function deadClass2Load(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * 0.364 * deadFuelFraction);
  }
  /**
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the dead medium (0.5 to 1 inch diameter) chaparral stem wood
   * as per Rothermel and Philpot (1973) Figure 1.
   */

  function deadClass3Load(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * 0.207 * deadFuelFraction);
  }
  /**
   * Estimates chaparral large (1 to 3 inch diameter) dead fuel load.
   *
   * Note that the factor of 0.082 varies from the Rothermel & Philpot
   * Figure 1 value of .085, because their factors totaled 1.03 instead of 1.
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the dead large (1 to 3 inch diameter) chaparral stem wood
   * as per Rothermel and Philpot (1973) Figure 1.
   */

  function deadClass4Load(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * 0.082 * deadFuelFraction);
  }
  /**
   *  Estimates chaparral live fuel load.
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} Chaparral live fuel load (lb+1 ft-2)
   */

  function liveLoad(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * (1 - deadFuelFraction));
  }
  /**
   *  Estimates live fine (0 to 0.25 inch diameter) chaparral stem wood fuel load.
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the live fine (0 to 0.25 inch diameter) chaparral stem wood
   * as per Rothermel and Philpot (1973) Figure 1.
   */

  function liveClass1Load(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * (0.2416 - 0.256 * deadFuelFraction));
  }
  /**
   *  Estimates live small (0.25 to 0.5 inch diameter) chaparral stem wood fuel load.
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the live small (0.25 t0 0.5 inch diameter) chaparral stem wood
   * as per Rothermel and Philpot (1973) Figure 1.
   */

  function liveClass2Load(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * (0.1918 - 0.256 * deadFuelFraction));
  }
  /**
   *  Estimates live medium (0.5 to 1 inch diameter) chaparral stem wood fuel load.
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the live medium (0.5 to 1 inch diameter) chaparral stem wood
   * as per Rothermel and Philpot (1973) Figure 1.
   */

  function liveClass3Load(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * (0.2648 - 0.05 * deadFuelFraction));
  }
  /**
   *  Estimates live large (1 to 3 inch diameter) chaparral stem wood fuel load.
   *
   * Modified so that thisLoad = live load - (liveLeaf + liveFine + liveSmall + liveMedium)
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the live large (1 to 3 inch diameter) chaparral stem wood
   * as per Rothermel and Philpot (1973) Figure 1.
   */

  function liveClass4Load(totalFuelLoad, deadFuelFraction) {
    var liveLoad = totalFuelLoad * (1 - deadFuelFraction);
    var l1 = liveClass1Load(totalFuelLoad, deadFuelFraction);
    var l2 = liveClass2Load(totalFuelLoad, deadFuelFraction);
    var l3 = liveClass3Load(totalFuelLoad, deadFuelFraction);
    var l5 = liveClass5Load(totalFuelLoad, deadFuelFraction);
    return positive(liveLoad - l1 - l2 - l3 - l5); // return Calc.positive(totalFuelLoad * (0.1036 - 0.114 * deadFuelFraction))
  }
  /**
   *  Estimates live chaparral leaf fuel load.
   *
   * @param {number} totalFuelLoad Total chaparral fuel load (lb+1 ft-2)
   * @param {*} deadFuelFraction Dead fuel fraction (fraction)
   * @returns {number} The load (lb+1 ft-2)
   * of the live chaparral leaf
   * as per Rothermel and Philpot (1973) Figure 1.
   */

  function liveClass5Load(totalFuelLoad, deadFuelFraction) {
    return positive(totalFuelLoad * (0.1957 - 0.305 * deadFuelFraction));
  }

  var ChaparralFuel = /*#__PURE__*/Object.freeze({
    __proto__: null,
    TypeChamise: TypeChamise,
    TypeMixedBrush: TypeMixedBrush,
    Types: Types,
    age: age,
    fuelDepth: fuelDepth,
    fuelTypes: fuelTypes,
    totalLoad: totalLoad,
    deadExtinctionMoisture: deadExtinctionMoisture,
    deadFractionAverageMortality: deadFractionAverageMortality,
    deadFractionSevereMortality: deadFractionSevereMortality,
    deadLoad: deadLoad,
    deadClass1Load: deadClass1Load,
    deadClass2Load: deadClass2Load,
    deadClass3Load: deadClass3Load,
    deadClass4Load: deadClass4Load,
    liveLoad: liveLoad,
    liveClass1Load: liveClass1Load,
    liveClass2Load: liveClass2Load,
    liveClass3Load: liveClass3Load,
    liveClass4Load: liveClass4Load,
    liveClass5Load: liveClass5Load
  });

  /**
   * @file Exported WFSP compass functions as implemented by BehavePlus v6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */

  /**
   * Constrain compass degrees to the azimuth range [0 <= degrees < 360].
   *
   * @param float degrees The compass azimuth (degrees).
   *
   * @return float The compass azimuth constrained to the range [0 <= azimuth < 360] degrees.
   */
  function constrain$1(degrees) {
    while (degrees >= 360) {
      degrees -= 360;
    }

    while (degrees < 0) {
      degrees += 360;
    }

    return degrees;
  }
  /**
   * Calculate compass degrees (azimuth, clockwise from north) from radians.
   *
   * @param float radians Compass azimuth expressed in radians.
   *
   * @return float Compass azimuth expressed in degrees.
   */

  function degrees$1(radians) {
    return radians * 180 / Math.PI;
  }
  function diff(x, y) {
    return constrain$1(x - y);
  }
  /**
   * Get the opposite azimuth from degrees.
   *
   * @param float deg A compass azimuth (degrees).
   *
   * @return float The opposite compass azimuth from dgrees.
   */

  function opposite(degrees) {
    return constrain$1(degrees - 180);
  }
  /**
   * Calculate the radians of the compass azimuth (clockwise from north).
   *
   * @param float degrees  Compass azimuth (degrees clockwise from north).
   *
   * @return float The compass azimuth expressed in radians.
   */

  function radians$1(degrees) {
    return degrees * Math.PI / 180;
  }
  /**
   * Calculate the slope steepness in degrees from the slope vertical rise / horizontal reach ratio.
   *
   * @param float $ratio Ratio of the slope vertical rise / horizontal reach (fraction).
   *
   * @return float Slope steepness expressed in degrees.
   */

  function slopeDegrees$1(ratio) {
    var radians = Math.atan(ratio);
    return degrees$1(radians);
  }
  /**
   * Calculate slope steepness degrees from map measurements.
   *
   * @param float $mapScale Map sacle factor (Greater than 1, i.e., 24000)
   * @param float $contourInterval Map contour interval (in same units-of-measure as $distance)
   * @param float $contours Number of contours crossed in the measurement
   * @param float $mapDistance Map distance covered in the measurement
   *
   * @return float Slope steepness degrees
   */

  function slopeDegreesMap(mapScale, contourInterval, contours, mapDistance) {
    var ratio = slopeRatioMap(mapScale, contourInterval, contours, mapDistance);
    return slopeDegrees$1(ratio);
  }
  /**
   * Calculate the slope vertical rise / horizontal reach ratio from its steepness in degrees.
   *
   * @param float $degrees  Slope steepness in degrees.
   *
   * @return float Slope vertical rise / horizontal reach ratio (fraction).
   */

  function slopeRatio$2(degrees) {
    var rad = radians$1(constrain$1(degrees));
    return Math.tan(rad);
  }
  /**
   * Calculate slope steepness ratio from map measurements.
   *
   * @param float $mapScale Map sacle factor (Greater than 1, i.e., 24000)
   * @param float $contourInterval Map contour interval (in same units-of-measure as $distance)
   * @param float $contours Number of contours crossed in the measurement
   * @param float $mapDistance Map distance covered in the measurement
   *
   * @return float Slope steepness ratio
   */

  function slopeRatioMap(mapScale, contourInterval, contours, mapDistance) {
    var reach = mapScale * mapDistance;
    var rise = contours * contourInterval;
    return reach <= 0 ? 0 : rise / reach;
  }
  function sum$1(x, y) {
    return constrain$1(x + y);
  }

  var Compass = /*#__PURE__*/Object.freeze({
    __proto__: null,
    constrain: constrain$1,
    degrees: degrees$1,
    diff: diff,
    opposite: opposite,
    radians: radians$1,
    slopeDegrees: slopeDegrees$1,
    slopeDegreesMap: slopeDegreesMap,
    slopeRatio: slopeRatio$2,
    slopeRatioMap: slopeRatioMap,
    sum: sum$1
  });

  /**
   * @file Exported WFSP crown fire functions
   * @version 0.1.0
   * as described by Rothermel () and by Scott & Reinhardt ()
   * and as implemented by BehavePlus v6.
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */
  var ACTIVE = 'Active';
  var CONDITIONAL = 'Conditional';
  var PASSIVE = 'Passive';
  var SURFACE = 'Surface';
  var InitiationTypes = [ACTIVE, CONDITIONAL, PASSIVE, SURFACE];
  /**
   * Calculate the crown fire active ratio.
   *
   * @param rActive Actual active crown fire spread rate (ft+1 min-1)
   * @param rPrime Crown spread rate required to maintain active crowning (ft+1 min-1)
   * @return Scott & Reinhardt's active crowning ratio.
   */

  function activeRatio(rActive, rPrime) {
    return rPrime <= 0 ? 0 : rActive / rPrime;
  }
  /**
   * Crown fire area per Rothermel (1991) equation 11 (p 16)
   *
   * @param dist Crown fire spread distance (ft+1)
   * @param lwr Crown fire length-to-width ratio
   * @return Crown fire area (ft+2)
   */

  function area(dist, lwr) {
    return Math.PI * dist * dist / (4 * lwr);
  }
  function canTransition(transRatio) {
    return transRatio >= 1;
  }
  /**
   * Calculates the crown fraction burned as per Scott & Reinhardt (2001).
   *
   * @param rSurface Actual surface fire spread rate [Rsurface] (ft+1 min-1).
   * @param rInit Surface fire spread rate required to
   *  initiate torching/crowning [R'initiation] (ft+1 min-1).
   * @param rSa Surface fire spread rate [R'sa] (ft+1 min-1)
   *   at which the active crown fire spread rate is fully achieved
   *   and the crown fraction burned is 1.
   * @return The crown fraction burned (fraction).
   */

  function crownFractionBurned(rSurface, rInit, rSa) {
    var numer = rSurface - rInit; // Rsurface - R'init

    var denom = rSa - rInit; // R'sa - R'init

    return fraction(divide(numer, denom));
  }
  /**
   * Calculate the Scott & Reinhardt 'crowning index' (O'active),
   * the 20-ft wind speed at which the crown canopy becomes fully available
   * for active fire spread (and the crown fraction burned approaches 1).
   *
   * @param oActive Open wind speed sufficient for active xcrown fire (ft+1 min-1)
   * @return The Scott & Reinhardt Crowning Index (km+1 h-1).
   */

  function crowningIndex(oActive) {
    return oActive / 54.680665; // CI in km/h
  }
  /**
   *
   * @param crownHpua Crown fire (surface plus canopy fuel) heat per unit area (Btu+1 ft-2)
   * @param rActive Active crown fire spread rate (ft+1 min-1)
   * @return Active crown fire fireline intensity (BTU+1 ft-1 s-1)
   */

  function fliActive(crownHpua, rActive) {
    return rActive / 60 * crownHpua;
  }
  function fliFinal(rFinal, cfb, cpyHpua, surfHpua) {
    return rFinal * (surfHpua + cfb * cpyHpua) / 60;
  }
  /**
   * Calculate the critical surface fire intensity (I'initiation)
   * sufficient to drive off canopy foliar moisture and initiate a
   * passive or active crown fire.
   *
   * This is Scott & Reinhardt (2001) equation 11 (p 13).
   *
   * @param folMois Canopy foliar moisture content (ratio).
   * @param cpyBase Crown canopy base height (ft+1).
   * @return The critical surface fireline intensity (btu+1 ft-1 s-1)
   *  required to initiate a passive or active crown fire.
   */

  function fliInit(folMois, cpyBase) {
    var fmc = Math.max(30, 100 * folMois); // convert to percent with 30% min

    var cbh = Math.max(0.1, 0.3048 * cpyBase); // convert to meters with 10 cm min

    var kwm = Math.pow(0.01 * cbh * (460 + 25.9 * fmc), 1.5); // (kW/m)

    return kwm * 0.288672; // return as Btu/ft/s
  }
  /**
   * Calculate Thomas's (1963) flame length (ft+1) given a fireline intensity.
   *
   * @param fli Fireline intensity (Btu+1 ft-1 s-1).
   * @return Thomas' (1963) flame length (ft+1).
   */

  function flameLengthThomas(fli) {
    return fli <= 0 ? 0 : 0.2 * Math.pow(fli, 2 / 3);
  } // Active crown fire heat per unit area,
  // sum of the surface fire HPUA and the entire active canopy HPUA
  // (i.e., the canopy load * canopy heat content,
  // and NOT the canopy fuel model 10 HPUA)

  function hpuaActive(surfHpua, cpyHpua) {
    return surfHpua + cpyHpua;
  }
  function isActive(transRatio, activeRatio) {
    return type(transRatio, activeRatio) === ACTIVE;
  }
  function isCrown(transRatio, activeRatio) {
    var fireType = type(transRatio, activeRatio);
    return fireType === ACTIVE || fireType === PASSIVE;
  }
  function isConditional(transRatio, activeRatio) {
    return type(transRatio, activeRatio) === CONDITIONAL;
  }
  function isPassive(transRatio, activeRatio) {
    return type(transRatio, activeRatio) === PASSIVE;
  }
  function isSurface(transRatio, activeRatio) {
    return type(transRatio, activeRatio) === SURFACE;
  }
  function isPlumeDominated(powerRatio) {
    return powerRatio >= 1;
  }
  function isWindDriven(powerRatio) {
    return powerRatio < 1;
  }
  /**
   * Calculate the crown fire length-to-width ratio given the 20-ft
   * wind speed (Rothermel 1991, Equation 10, p16).
   *
   * @param wspd20 Wind speed at 20-ft (ft+1 min-1).
   * @return The crown fire length-to-width ratio (ratio).
   */

  function lengthToWidthRatio(wspd20) {
    return 1 + 0.125 * (wspd20 / 88); // Wind speed must be in miles per hour
  }
  /**
   * Calculate the Scott & Reinhardt 'crowning index' (O'active),
   * the 20-ft wind speed at which the crown canopy becomes fully available
   * for active fire spread (and the crown fraction burned approaches 1).
   *
   * @param cpyBulk Crown canopy bulk density (btu+1 ft-3).
   * @param crownRxi Crown fire (fuel model 10) reaction intensity (btu+1 ft-2 min-1).
   * @param crownSink Crown fire (fuel model 10) heat sink (btu+1 ft-3).
   * @param phis Slope coefficient (0 for crown fire)
   * @return The O`active wind speed (ft+1 min-1).
   */

  function oActive(cpyBulk, crownRxi, crownSink, phis) {
    // In native units
    var cbd = 16.0185 * cpyBulk; // Convert from lb/ft3 to kg/m3

    var ractive = 3.28084 * (3 / cbd); // R'active, ft/min

    var r10 = ractive / 3.34; // R'active = 3.324 * r10

    var pflux = 0.048317062998571636; // Fuel model 10 actual propagating flux ratio

    var ros0 = crownRxi * pflux / crownSink;
    var windB = 1.4308256324729873; // Fuel model 10 actual wind factor B

    var windBInv = 1 / windB; // Fuel model 10 actual inverse of wind factor B

    var windK = 0.0016102128596515481; // Fuel model 10 actual K = C*pow((beta/betOpt),-E)

    var a = (r10 / ros0 - 1 - phis) / windK;
    var uMid = Math.pow(a, windBInv);
    var u20 = uMid / 0.4;
    return u20;
  }
  /**
   * Crown fire perimeter per Rothermel (1991) equation 13 (p 16).
   *
   * @param dist Crown fire spread distance (ft+1)
   * @param lwr Crown fire length-to-width ratio
   * @return Crown fire perimeter (ft+1)
   */

  function perimeter(dist, lwr) {
    return 0.5 * Math.PI * dist * (1 + 1 / lwr);
  }
  /**
   * Calculate the crown fire power-of-the-fire(ft+11 lb+1 ft-2 s-1).
   *
   * @param fliActive Crown fire active fireline intensity (Btu+1 ft-1 s-1).
   * @return Rothermel's power of the fire (ft+1 lb+1 ft-2 s-1).
   */

  function powerOfTheFire(fliActive) {
    return fliActive / 129;
  }
  /**
   * Calculate the crown fire power-of-the-wind (ft+1 lb+1 ft-2 s-1).
   *
   * See Rothermel (1991) equations 6 & 7 (p 14).
   *
   * @param wspd20 Wind speed at 20-ft (ft+1 min-1).
   * @param rActive Actiuve crown fire spread rate (ft+1 min-1).
   * @return Rothermel's power of the wind (ft+1 lb+1 ft-2 s-1).
   */

  function powerOfTheWind(wspd20, rActive) {
    // Difference must be in ft+1 s-1
    var diff = positive((wspd20 - rActive) / 60);
    return 0.00106 * diff * diff * diff;
  }
  /**
   * Calculate the active crown fire spread rate at head [Ractive] (ft+1 min-1)
   * given the corresponding standard fuel model 10 spread rate at head.
   *
   * This is the crown fire spread rate per Rothermel (1991), and which
   * Scott & Reinhardt term `Ractive`
   *
   * @param fm10Ros Standard fuel model 10 spread rate at head (ft+1 min-1).
   *
   * @return The spread rate at head (ft+1 min-1) of the active crown fire.
   */

  function rActive(fm10ros) {
    return 3.34 * fm10ros;
  }
  /**
   * Scott & Reinhardt (2005) final spread rate based on FAH.
   *
   * @param rSurface
   * @param rActive
   * @param cfb Crown fraction burned (fraction).
   * @return float Final crown fire spread rate (ft+1 min-1)
   */

  function rFinal(rSurface, rActive, cfb) {
    return rSurface + cfb * positive(rActive - rSurface);
  }
  /**
   * Calculate the critical surface fire spread rate (R'initiation)
   * sufficient to initiate a passive or active crown fire.
   *
   * This is Scott & Reinhardt (2001) equation 12 (p 13).
   *
   * @param critSurfFli Critical surface fireline intensity (btu_1 ft-1 s-1).
   * @param surfHpua Surface fire heat per unit area (Btu+1 ft-2).
   * @return Scott & Reinhardt's critical surface fire spread rate
   *  [R'initiation] (ft+1 min-1)
   */

  function rInit(critSurfFli, surfHpua) {
    return surfHpua <= 0 ? 1.0e12 : 60 * critSurfFli / surfHpua;
  }
  /**
   * Calculate R'active, the critical crown (minimum) rate of spread for active crowning.
   *
   * Scott & Reinhardt (2001) equation 14, p 14.
   *
   * @param cpyBulk Crown canopy bulk density (lb+1 ft-3).
   * @return The critical crown fire spread rate (ft+1 min-1).
   */

  function rPrimeActive(cpyBulk) {
    var cbdSi = 16.0184663678 * cpyBulk; // convert to Kg/m3

    var rosSi = cbdSi <= 0 ? 0 : 3 / cbdSi; // m/min

    var rosFpm = rosSi * 3.2808399; // return as ft/min

    return rosFpm;
  }
  /**
   * Scott & Reinhardt (2001) R'sa, the theoretical surface fire spread rate
   * when the 20-ft wind speed equals O'active
   *
   * @param oActive Critical open wind speed (ft+1 min-1) for sustaining fully active crown fire
   * @param surfRos0 Surface fire no-wind no-slope spread rate (ft+1 min-1)
   * @param surfWaf Surface fuel's wind speed adjustment factor to apply to oActive
   * @param surfWindB Surface fuel's wind factor B
   * @param surfWindK Surface fuel's wind factor K
   * @param surfPhiS Surface fuel's slope coefficient
   * @return R'sa The theoretical surface fire spread rate
   * when the 20-ft wind speed equals O'active
   */

  function rSa(oActive, surfRos0, surfWaf, surfWindB, surfWindK, surfPhiS) {
    var mwspd = surfWaf * oActive;
    var surfPhiW = mwspd <= 0 ? 0 : surfWindK * Math.pow(mwspd, surfWindB);
    return surfRos0 * (1 + surfPhiW + surfPhiS);
  }
  /**
   * Calculate the crown fire transition ratio.
   *
   * @param surfFli Actual surface fire fireline intensity (Btu+1 ft-1 s-1).
   * @param iInit Critical surface fire fireline intensity [I'initiation]
   * required to initiate active or passive crowning (Btu+1 ft-1 s-1).
   * @return Rothermel's crown fire transition ratio.
   */

  function transitionRatio(surfFli, fliInit) {
    return fliInit <= 0 ? 0 : surfFli / fliInit;
  }
  /**
   * Calculate the final fire type.
   *
   *  <table>
   *    <tr>
   *      <td> Transition </td>
   *        <td colspan='2'> Active Ratio </td>
   *    </tr>
   *    <tr>
   *        <td> Ratio </td>
   *        <td> &lt 1 </td>
   *        <td> &gt = 1 </td>
   *    </tr>
   *    <tr>
   *        <td> &lt 1 </td>
   *        <td> 0 : Surface Fire </td>
   *        <td> 2 : Conditional Active Crown Fire </td>
   *    </tr>
   *    <tr>
   *        <td> &gt = 1 </td>
   *        <td> 1 : Passive Crown Fire </td>
   *        <td> 3 : Active Crown Fire </td>
   *    </tr>
   *  </table>
   *
   * @param transRatio The ratio of the surface fireline intensity to the
   * critical surface fireline intensity.
   * @param activeRatio The ratio of the active crown fire spread rate to the
   * critical crown fire spread rate
   * @return One of the following codes:
   *  - 'surface fire' indicates a surface fire with no torching or crowning
   *      (transition ratio < 1 && active ratio < 1)
   * - 'passive crown fire' indicates a passive/torching crown fire
   *      (transition ratio >= 1 && active ratio < 1)
   * - 'conditional surface fire' indicates a surface fire that could conditionally
   *      transition to an active crown fire
   *      (transition ratio < 1 && active ratio >= 1)
   * - 'active crown fire' indicates an active crown fire
   *      (transition ratio >= 1 && active ratio >= 1)
   */

  function type(transRatio, activeRatio) {
    if (transRatio < 1) {
      return activeRatio < 1 ? SURFACE : CONDITIONAL;
    } else {
      // ( transRatio >= 1.0 )
      return activeRatio < 1 ? PASSIVE : ACTIVE;
    }
  }

  var CrownFire = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ACTIVE: ACTIVE,
    CONDITIONAL: CONDITIONAL,
    PASSIVE: PASSIVE,
    SURFACE: SURFACE,
    InitiationTypes: InitiationTypes,
    activeRatio: activeRatio,
    area: area,
    canTransition: canTransition,
    crownFractionBurned: crownFractionBurned,
    crowningIndex: crowningIndex,
    fliActive: fliActive,
    fliFinal: fliFinal,
    fliInit: fliInit,
    flameLengthThomas: flameLengthThomas,
    hpuaActive: hpuaActive,
    isActive: isActive,
    isCrown: isCrown,
    isConditional: isConditional,
    isPassive: isPassive,
    isSurface: isSurface,
    isPlumeDominated: isPlumeDominated,
    isWindDriven: isWindDriven,
    lengthToWidthRatio: lengthToWidthRatio,
    oActive: oActive,
    perimeter: perimeter,
    powerOfTheFire: powerOfTheFire,
    powerOfTheWind: powerOfTheWind,
    rActive: rActive,
    rFinal: rFinal,
    rInit: rInit,
    rPrimeActive: rPrimeActive,
    rSa: rSa,
    transitionRatio: transitionRatio,
    type: type
  });

  /**
   * @file Exported WFSP crown fire spotting distance functions
   * as described by Albini (1998) and
   * as implemented by BehavePlus v6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */

  /**
   * \brief Javascript implementation of "Program for predicting spotting distance
   * from an active crown fire in uniformly forested flat terrain", November 1998,
   * by Frank Albini.
   *
   * The following Javascript implementation was adopted from the MS FORTRAN source
   * code cited above and my 'dist2a.for' derivative (which is also the basis of the
   * C++ version in BehavePlus V6).
   */
  function firebrandObjectPrototype() {
    return {
      zdrop: 0,
      xdrop: 0,
      xdrift: 0,
      xspot: 0,
      layer: 0
    };
  }
  /**
   * Calculates crown firebrand dropout altitude and distance,
   * drift distance, and total flat terrain spot distance.
   *
   * Thin wrapper around dist() that performs input/output
   * units conversions native to BPX.
   *
   * @param {real} canopyHt Average crown top height of forest cover (ft)
   * @param {real} crownFli Fire intensity (Btu/ft/s)
   * @param {real} ws20 Wind speed at canopy top, (ft/min)
   *
   * @return {object}
   *  zdrop: firebrand dropout plume coordinate height (ft)
   *  xdrop: firebrand dropout plume coordinate horizontal distance (ft)
   *  xdrift: firebrand down-wind drift horizontal distance (ft)
   *  xspot:  firebrand down-wind spotting distance on flat terrain (ft)
   *  layer: plume profile layer where dropout occurs
   */

  function flatDistance(canopyHt, ws20, crownFli) {
    var fpm = 3.2808;
    var htop = canopyHt / fpm;
    var fikwpm = 3.46414 * crownFli; // Anemometer wind speed must be km/h

    var uan = 1.60934 * ws20 / 88; // Anemometer height (m)

    var anem = 6.096; // utop is wind speed in m/s

    var utop = windSpeedAtCanopyTop(htop, uan, anem);
    var diam = 1;

    var _dist = dist(htop, fikwpm, utop, diam),
        _dist2 = _slicedToArray(_dist, 5),
        z = _dist2[0],
        x = _dist2[1],
        drift = _dist2[2],
        spot = _dist2[3],
        layer = _dist2[4];

    return {
      zdrop: fpm * z,
      xdrop: fpm * x,
      xdrift: fpm * drift,
      xspot: fpm * spot,
      layer: layer
    };
  }
  /**
   * Simply returns the 'layer' property from the 'firebrand' object.
   *
   * @param {real} firebrandObj Object returned by flatDistance().
   * @return {int} Plume profile layer where dropout occurs
   */

  function layer(firebrandObj) {
    return firebrandObj.layer;
  }
  /**
   * Simply returns the 'drift' property from the 'firebrand' object.
   *
   * @param {real} firebrandObj Object returned by flatDistance().
   * @return {real} Firebrand down-wind drift horizontal distance (ft)
   */

  function xdrift(firebrandObj) {
    return firebrandObj.xdrift;
  }
  /**
   * Simply returns the 'xdrop' property from the 'firebrand' object.
   *
   * @param {real} firebrandObj Object returned by flatDistance().
   * @return {real} Firebrand dropout plume coordinate horizontal distance (ft)
   */

  function xdrop(firebrandObj) {
    return firebrandObj.xdrop;
  }
  /**
   * Simply returns the 'spot' property from the 'firebrand' object.
   *
   * @param {real} firebrandObj Object returned by flatDistance().
   * @return {real} Firebrand down-wind spotting distance on flat terrain (ft)
   */

  function xspot(firebrandObj) {
    return firebrandObj.xspot;
  }
  /**
   * Simply returns the 'zdrop' property from the 'firebrand' object.
   *
   * @param {real} firebrandObj Object returned by flatDistance().
   * @return {real} Firebrand dropout plume coordinate height (ft)
   */

  function zdrop(firebrandObj) {
    return firebrandObj.zdrop;
  }
  /**
   * Adapted from Albini's MS FORTRAN PROGRAM DIST().
   *
   * @param {real} htop Average crown top height of forest cover (m)
   * @param {real} fikwpm Fire intensity (kW/m) (must be > 1000 kW/m)
   * @param {real} utop Wind speed at canopy top, (m/s)
   * @param {real} diam Firebrand diameter when it reaches the surface (mm)
   *
   * @return {array} [fbHeight, fbDist, fbDrift, flatSpotDist, layer], where
   *  dbHeight is the firebrand dropout plume coordinate height (m)
   *  dbDist is the firebrand dropout plume coordinate distance (m)
   *  dbDrift is the firebrand down-wind drift distance (m)
   *  flatSpotDist is the firebrand down-wind spotting distance on flat terrain (m)
   *  layer is the plume profile layer
   */

  function dist(htop, fikwpm, utop, diam) {
    // flame = flame height above the canopy top (m)
    var flame = flameHeightAlbini(fikwpm, utop, htop);

    if (flame <= 0) {
      return [0, 0, 0, 0, 0];
    } // if (ido===2) fikwpm = fireIntensityAlbini(flame, utop, htop)
    // hf = normalized flame height above the canopy top (dl)


    var hf = htop > 0 ? flame / htop : 0; // uc = normalized wind speed at the crown top

    var g = 9.82; // Acceleration of gravity, m / s^2

    var wn = Math.sqrt(g * htop);
    var uc = wn > 0 ? utop / wn : 0; // dlosmm = ember diameter loss from the top of the plume till it hits the surface

    var dlosmm = 0.064 * htop; // Display inputs and intermediates derived so far:
    // console.log('Mean height of forest (htop)', htop, '(m)')
    // console.log('Mean wind speed at anemometer height', uan, '(km/h)')
    // console.log('Mean height of flame above tops', flame, '(m)')
    // console.log('Fire intensity [input or calculated]', fikwpm, '(kW/m)')
    // console.log('Anemometer height', anem, '(m)')
    // console.log('hf (flame ht / canopy ht)', hf, '(dl)')
    // console.log('utop (wind speed at crown top)', utop, '(dl)')
    // console.log('uc (normalized wind at crown top)', uc, '(dl)')
    // console.log('wn (sqrt( g * htop ))', wn)
    // console.log('Firebrand alighting diameter', diam, '(mm)')
    // console.log('dlosmm (Ember diam loss=0.064 * htop)', dlosmm, '(mm)')
    // dhitmm = ember diameter when it hits the ground (mm)

    var dhitmm = diam; // dtopmm = ember diameter when it reaches the top of the plume (mm)

    var dtopmm = dhitmm + dlosmm; // eta = 'safety factor' for firebrand diameter on impact (eta > 1.)

    var eta = dtopmm / dlosmm; // Determine firebrand dropout location within the plume.  Outputs are:
    //  zdrop = normalized vertical firebrand dropout altitude (dl) (m / htop)
    //  xdrop = corresponding dropout normalized distance down wind (dl) (m / htop)
    //  layer = plume layer where dropout occurs

    var _dropout = dropout(hf, uc, eta),
        _dropout2 = _slicedToArray(_dropout, 3),
        zdrop = _dropout2[0],
        xdrop = _dropout2[1],
        layer = _dropout2[2]; // xdrift = normalized down wind drift distance (dl) (m / htop)


    var xdrift = drift(zdrop, eta, uc); // xspot = normalized total spotting distance on flat terrain (m / htop)

    var xspot = xdrop + xdrift; // Convert normalized distances to m

    var fbHeight = zdrop * htop;
    var fbDist = xdrop * htop;
    var fbDrift = xdrift * htop;
    var flatSpotDist = xspot * htop; // console.log('Plume Drop-out Layer', layer)
    // console.log('Normalized dropout altitude', zdrop, '(m / htop)')
    // console.log('Normalized dropout distance', xdrop, '(m / htop)')
    // console.log('Normalized drift distance', xdrift, '(m / htop)')
    // console.log('Firebrand Height', fbHeight, '(m)')
    // console.log('Firebrand Distance', fbDist, '(m)')
    // console.log('Firebrand Drift', fbDrift, '(m)')
    // console.log('Flat spot distance',  flatSpotDist, '(m)')

    return [fbHeight, fbDist, fbDrift, flatSpotDist, layer];
  }
  /**
   * According to Albini:
   * "Calculates normalized down wind drift distance, 'delx',
   * for a firebrand particle injected into log profile wind field at
   * normalized altitude 'zdrop' and entering the canopy with diameter
   * equal to 'eta' times that necessary to reach the surface."
   *
   * Adapted from Frank Albini's 'drift.for' FORTRAN source, SUBROUTINE DRIFT()
   *
   * @param {real} zdrop Normalized firebrand drop-out altitude (dl) (m / htop)
   * @param {real} eta Safety factor (eta>1)
   * @param {real} uc Normalized horizontal wind speed at crown top (dl)
   *
   * @return {real} Normalized down wind firebrand drift distance (m / htop)
   */

  function drift(zdrop, eta, uc) {
    var f0 = 1 + 2.94 * zdrop;
    var f1 = Math.sqrt(eta / (eta + zdrop));
    var f2 = eta > 0.34 ? Math.sqrt(eta / (eta - 0.34)) : 0;
    var f3 = f1 > 0 ? f2 / f1 : 0;
    var f2log = f2 > 1 ? Math.log((f2 + 1) / (f2 - 1)) : 0;
    var f3log = f3 > 1 ? Math.log((f3 + 1) / (f3 - 1)) : 0;
    var F = f3 > 0 ? 1 + Math.log(f0) - f1 + (f3log - f2log) / f3 : 0;
    var xdrift = 10.9 * F * uc * Math.sqrt(zdrop + eta);
    return xdrift;
  }
  /**
   * Calculates firebrand drop-out altitude and distance
   *
   * @param {real} hf  Normalized flame height above the canopy top (dl)
   * @param {real} uc Normalized horizontal wind speed at crown top (dl)
   * @param {real} eta Safety factor (eta>1)
   *
   * @returns {array} [zdrop, xdrop, layer], where
   *  zdrop = normalized vertical firebrand dropout altitude (dl) (m / htop)
   *  xdrop = corresponding dropout normalized distance down wind (dl) (m / htop)
   *  layer = plume layer where dropout occurs
   */

  function dropout(hf, uc, eta) {
    // Delta x-z iteration factor
    var ds = 0.2; // qfac = constant used to determine sufficient qreq at each layer

    var qfac = uc > 0 ? 0.00838 / (uc * uc) : 0; // Albini's tip()

    var rfc = 1 + 2.94 * hf;
    var fm = 0.468 * rfc * Math.log(rfc);
    var fmuf = 1.3765 * (hf + rfc * Math.pow(Math.log(rfc), 2));
    var uf = fmuf / fm;
    var ctn2f = rfc - 1 + rfc * Math.pow(Math.log(rfc), 2);
    var tang = 1.4 * hf / (uc * Math.sqrt(ctn2f));
    var ang = Math.atan(tang);
    var wf = tang * uf;
    var vf = Math.sqrt(uf * uf + wf * wf);
    var rhof = 0.6;
    var bf = fm / (rhof * vf); // end tip()

    var sing = Math.sin(ang);
    var cosg = Math.cos(ang);
    var delx = 0.5 * bf * sing;
    var delz = 0.5 * bf * cosg;
    var zc2 = hf;
    var xc2 = hf / Math.tan(ang);
    var fmf = fm;
    var tratf = 2 * fmf / 3;
    var fmadd = fm > 0 ? 0.2735 * fm : 0;
    var hfarg = 1 + 2.94 * hf;
    var fmuadd = 0.3765 * (hf + hfarg * Math.pow(Math.log(hfarg), 2));
    var fmw = fm * wf;
    var dmwfac = uc > 0 ? 2 * fmf / (3 * uc * uc) : 0;
    var w = wf;
    var V = vf;
    var z = hf;
    var x = xc2; // Level 1

    var q = 0.5 * rhof * wf * wf;
    var xb = delx;
    var zb = 0; // Level 2

    q = 0.5 * rhof * wf * wf;
    xb = xc2 + delx;
    zb = zc2 - delz;
    var zp = zb;
    var xp = xb;
    var layer = 2;
    var qreq = qfac * (zb + eta);

    if (q <= qreq) {
      // plume cannot lift a particle large enough to provide the 'eta' saftey factor
      return [0, 0, 0];
    }

    while (true) {
      layer += 1;
      var dx = ds * cosg;
      var dz = ds * sing;
      x = x + dx;
      z = z + dz;
      var zarg = 1 + 2.94 * z;
      fm = 0.34 * zarg * Math.log(zarg) + fmadd;
      var fmu = z + 0.34 * zarg * Math.pow(Math.log(zarg), 2) + fmuadd;
      var trat = 1 + tratf / fm;
      var u = fmu / fm;
      fmw = fmw + dmwfac / V * dz;
      w = fmw / fm;
      V = Math.sqrt(u * u + w * w);
      var b = fm * trat / V;
      sing = w / V;
      cosg = u / V;
      delx = 0.5 * b * sing;
      delz = 0.5 * b * cosg;
      xb = x + delx;
      zb = z - delz;
      q = 0.5 * w * w / trat;
      qreq = qfac * (zb + eta); // Compare with dist2a_plume.csv
      // console.log(k, q[k], xb[k], zb[k], ang, dx, dz, x, z, zarg)
      // fm, fmu, trat, u, fmw, w, V, b, sing, cosg, delx, delz)

      if (q < qreq) {
        return [zp, xp, layer - 1];
      }

      zp = zb; // store as previous layer value

      xp = xb; // store as previous layer value

      if (layer > 20000) {
        throw new Error('prof() exceeded 20000 layers');
      }
    }
  }
  /**
   * Calculates crown fire intensity from average flame HEIGHT above canopy top
   * as per Albini's MS FORTRAN FUNCTION FINT().
   *
   * @param {real} flame  Average flame height above canopy top (m)
   * @param {real} utop Mean wind speed at canopy top height (m/s)
   * @param {real} htop Canopy top height (m)
   * @return {real} fint Fire intensity (kW/m)
   */

  function fireIntensityAlbini(flame, utop, htop) {
    var y = htop > 0 ? 1 + 2.94 * flame / htop : 0;
    var con = y * Math.log(y);
    return con * utop * htop / 7.791e-3;
  }
  /**
   * Calculates crown fire intensity from crown fire flame length
   * using Thomas equation.
   *
   * @param {real} flameLength Crown fire flame length (ft)
   * @return {real} Crown fire intensity (btu/ft/s)
   *  (multiply by 3.46414 to obtain kW/m)
   */

  function firelineIntensityThomas(flameLength) {
    return flameLength <= 0 ? 0 : Math.pow(5 * flameLength, 3 / 2);
  }
  /**
   * Estimates crown fire average flame HEIGHT (not length) above canopy top (m)
   *
   * Adapted from Albini's MS FORTRAN FUNCTION HEIGHT().
   *
   * @param {real} fikwpm Fire intensity (kW/m) (must be > 1000 kW/m)
   * @param {real} utop  Mean wind speed at canopy top (m/s)
   * @param {real} htop Average crown top height of forest cover (m)
   * @return {real} Average height of flame above canopy top (m)
   */

  function flameHeightAlbini(fikwpm, utop, htop) {
    if (htop * utop <= 0) return 0;
    var con = 7.791e-3 * fikwpm / (utop * htop);
    var ylow = 1;
    var yhigh = Math.exp(con); // console.log('Start flame(): con='+con+' yhigh='+yhigh)

    var loop = 1;

    while (true) {
      var y = 0.5 * (ylow + yhigh);
      var test = y * Math.log(y);

      if (Math.abs(test - con) <= 1e-6) {
        var height = htop * (y - 1) / 2.94;
        return height;
      }

      loop = loop + 1;

      if (loop > 10000) {
        throw new Error('flameHeight() endless loop');
      }

      if (test >= con) yhigh = y;
      if (test < con) ylow = y;
    }
  }
  /**
   * Calculate crown fire flame length from crown fire intensity
   * using Thomas' equation.
   *
   * @param {real} fli Crown fire intensity (btu/ft/s)
   * @result {real} Crown fire flame length (ft)
   */

  function flameLengthThomas$1(fli) {
    return fli <= 0 ? 0 : 0.2 * Math.pow(fli, 2 / 3);
  }
  /**
   * Estimates the mean wind speed at canopy top (m/s)
   *
   * Adapted from Albini's MS FORTRAN PROGRAM DIST() around statements 45 to 50
   *
   * @param {real} htop Average crown top height of forest cover (m)
   * @param {real} uan Measured wind speed at anemometer height (km/h)
   * @param {real} anem Height of measured wind speed (m)
   * @return {real} utop Mean wind speed at canopy top (m/s)
   */

  function windSpeedAtCanopyTop(htop, uan, anem) {
    var zonh = htop > 0 ? anem / htop : 0;
    var fact = 1 + Math.log(1 + 2.94 * zonh);
    var utop = uan / (3.6 * fact);
    return utop;
  }

  var CrownSpotting = /*#__PURE__*/Object.freeze({
    __proto__: null,
    firebrandObjectPrototype: firebrandObjectPrototype,
    flatDistance: flatDistance,
    layer: layer,
    xdrift: xdrift,
    xdrop: xdrop,
    xspot: xspot,
    zdrop: zdrop,
    dist: dist,
    drift: drift,
    dropout: dropout,
    fireIntensityAlbini: fireIntensityAlbini,
    firelineIntensityThomas: firelineIntensityThomas,
    flameHeightAlbini: flameHeightAlbini,
    flameLengthThomas: flameLengthThomas$1,
    windSpeedAtCanopyTop: windSpeedAtCanopyTop
  });

  /**
   * @file Exported WFSP fire ellipse functions
   * as described by Albini (1998) and
   * as implemented by BehavePlus v6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */
  /**
   * Calculate the fire ellipse area given its major axis length and
   * length-to-width ratio as per Rothermel (1991) equation 11 on page 16
   * (which ignores backing distance).
   *
   * @param len Total fire ellipse length (arbitrary distance unbits-of-measure).
   * @param lwr Fire ellipse length-to-width ratio (ratio).
   * @return Fire ellipse area (in same distance unitsof-measure as length squared).
   */

  function area$1(len, lwr) {
    return divide(Math.PI * len * len, 4 * lwr);
  }
  /**
   *  Calculate the fire spread rate (ft+1 min-1) at the ellipse back
   *  given the fire spread rate at ellipse head and fire ellipse length-to-width ratio.
   *
   *  NOTE this differs from FireSpread::spreadRateAtBack() which takes the
   *  length-to-width ratio as the second parameter, rather than ellipse eccentricity.
   *
   * @param spreadRateAtHead Fire spread rate at ellipse head (ft+1 min-1).
   * @param eccentricity Fire ellipse eccentricity (ratio).
   *
   * @return float The fire spread rate at the ellipse back (ft+1 min-1).
   */

  function backingSpreadRate(rosHead, eccent) {
    return rosHead * divide(1 - eccent, 1 + eccent);
  }
  /**
   * Calculate the fire spread rate at 'beta' degrees from the fire ignition point-to-head vector.
   *
   * This calculates the fire spread rate at `beta` degrees from its *point of ignition*,
   * which *is not* the fire rate at `psi` degrees from the center of the ellipse.
   *
   * NOTE this differs from FireSPread::spreadRateATBeta(), which takes the ellipse
   * length-to-width ratio as its second argument.
   *
   * @param betaHead Fire spread vector of interest (degrees clockwise from heading direction).
   * @param rosHead Fire spread rate at the head (ft+1 min-1).
   * @param eccent Fire ellipse eccentricity (ratio).
   *
   * @return float The fire spread rate along the specified vector (ft+1 min-1).
   */

  function betaSpreadRate(betaHead, rosHead, eccent) {
    var rosBeta = rosHead; // Calculate the fire spread rate in this azimuth
    // if it deviates more than a tenth degree from the maximum azimuth

    if (Math.abs(betaHead) > 0) {
      var rad = radians$1(betaHead);
      rosBeta = rosHead * (1 - eccent) / (1 - eccent * Math.cos(rad));
    }

    return rosBeta;
  }
  /**
   * Calculate the fire ellipse eccentricity.
   *
   * @param float lwr Fire ellipse length-to-width ratio.
   * @return float The fire ellipse eccentricity (ratio).
   */

  function eccentricity(lwr) {
    var x = lwr * lwr - 1;
    return x <= 0 || lwr <= 0 ? 0 : Math.sqrt(x) / lwr;
  }
  /**
   * Calculate the fire ellipse expansion rate at the flank.
   *
   * NOTE this differs from backingSpreadRate(), which takes two arguments,
   * the spread rate at head and the ellipse length-to-width ratio.
   *
   * @param rosMinor Fire ellipse expansion rate at its widest point
   * (in arbitrary velocity units-of-measure).
   *
   * @return The fire ellipse spread rate at the flank
   *  (in the same arbitrary velocity units-of-measure as minorAxisExpansionRate).
   */

  function flankingSpreadRate(rosMinor) {
    return 0.5 * rosMinor;
  }
  /**
   * Calculate the fire ellipse distance or rate at `F`.
   *
   * @param rosMajor Fire ellipse major axis spread rate or length
   *  (in arbitrary distance or velocity units-of-measure).
   * @return Fire ellipse `F` used to determine spread rates at arbitrary psi.
   */

  function fSpreadRate(rosMajor) {
    return 0.5 * rosMajor;
  }
  /**
   * Calculate the fire ellipse distance or rate at `G`.
   *
   * @param rosMajor Fire ellipse major axis spread rate or length
   *  (in arbitrary distance or velcoity units-of-measure).
   *
   * @param rosBack Portion of the total major axis rate or distance
   *  attributable to the backing rate or distance (in the same atbitrary
   *  distance or velcoity units-of-measure as majorAxisRateOrDistance).
   *
   * @return Fire ellipse `G` used to determine spread rates at arbitrary psi.
   */

  function gSpreadRate(rosMajor, rosBack) {
    return 0.5 * rosMajor - rosBack;
  }
  /**
   * Calculate the fire ellipse distance or rate at `H`.
   *
   * @param rosMinor Fire ellipse minor axis spread rate or length
   *  (in arbitrary distance or velcoity units-of-measure).
   *
   * @return Fire ellipse `H` used to determine spread rates at arbitrary psi.
   */

  function hSpreadRate(rosMinor) {
    return 0.5 * rosMinor;
  }
  /*! \brief Caluclate the fireline intensity at some azimuth.
   */

  function fliAtAzimuth(fliHead, rosHead, rosAz) {
    return positive(divide(fliHead * rosAz, rosHead));
  }
  /**
   * Calculate the fire ellipse expansion rate along its major axis.
   *
   * @param rosHead Fire spread rate at the head of the ellipse
   *  (in arbitrary velocity units-of-measure).
   *
   * @param rosBack Fire spread rate at the back of the ellipse
   *  (in the same velocity units-of-measure as spreadRateAtHead).
   *
   * @return The fire ellipse expansion rate along its major axis
   *  (in the same velocity units-of-measure as spreadRateAtHead).
   */

  function majorSpreadRate(rosHead, rosBack) {
    return rosHead + rosBack;
  }
  /**
   * Calculate the fire ellipse expansion rate along its minor axis.
   *
   * @param majorAxisRos Fire ellipse expansion rate along its major axis
   * (in arbitrary velocity units-of-measure).
   *
   * @param lwr The fire ellipse length-to-width ratio.
   *
   * @return The fire ellipse expansion rate along its mino axis
   * (in the same arbitrary velocity units-of-measure as majorAxisExpansionRate).
   */

  function minorSpreadRate(rosMajor, lwr) {
    return positive(divide(rosMajor, lwr));
  } // Map area

  function mapArea(area, mapScale) {
    return positive(divide(area, mapScale * mapScale));
  }
  /**
   *  Calculate the fire ellipse perimeter from its length and width.
   *
   * @param len Fire ellipse length (arbitrary distance units-of-measure).
   * @param wid Fire ellipse width (arbitrary distance units-of-measure).
   *
   * @return float The fire ellipse perimeter (in same distance units-of-measure as length).
   */

  function perimeter$1(len, wid) {
    var a = 0.5 * len;
    var b = 0.5 * wid;
    var xm = a + b <= 0 ? 0 : (a - b) / (a + b);
    var xk = 1 + xm * xm / 4 + xm * xm * xm * xm / 64;
    return Math.PI * (a + b) * xk;
  }
  function psiFromTheta(thetaFromHead, rosF, rosH) {
    if (rosF <= 0 || rosH <= 0 || thetaFromHead <= 0) {
      return 0;
    }

    var thetaRadians = radians$1(thetaFromHead);
    var tanPsiRadians = Math.tan(thetaRadians) * rosF / rosH;
    var psiRadians = Math.atan(tanPsiRadians); // psiRadians += ( psiRadians < 0) ? pi : 0
    // psiradians += ( thetaRadians > pi) ? pi : 0
    // Quadrant adjustment

    if (thetaRadians <= 0.5 * Math.PI) ; else if (thetaRadians > 0.5 * Math.PI && thetaRadians <= 1.5 * Math.PI) {
      psiRadians += Math.PI;
    } else if (thetaRadians > 1.5 * Math.PI) {
      psiRadians += 2 * Math.PI;
    } // Convert psi radians to degrees


    return degrees$1(psiRadians);
  }
  /**
   * Calculate the fire spread rate at 'psi' degrees from the fire ellipse center-to-head vector.
   *
   * This calculates the fire spread rate at `psi` degrees from its *ellipse center* to the ellipse head,
   * which *is not* the fire rate at `beta` degrees from the point of ignition.
   *
   * @param psiHead The fire spread vector of interest (degrees clockwise from heading direction).
   * @param rosF Fire ellipse expansion rate (ft+1 min-1) at ellipse point F.
   * @param rosG Fire ellipse expansion rate (ft+1 min-1) at ellipse point G.
   * @param rosH Fire ellipse expansion rate (ft+1 min-1) at ellipse point H.
   *
   *  @return The fire spread rate along the specified vector (ft+1 min-1).
   */

  function psiSpreadRate(psiHead, rosF, rosG, rosH) {
    var rosPsi = 0;

    if (rosF * rosG * rosH > 0) {
      var radians = radians$1(psiHead);
      var cosPsi = Math.cos(radians);
      var cos2Psi = cosPsi * cosPsi;
      var sin2Psi = 1 - cos2Psi;
      var term1 = rosG * cosPsi;
      var term2 = rosF * rosF * cos2Psi;
      var term3 = rosH * rosH * sin2Psi;
      rosPsi = term1 + Math.sqrt(term2 + term3);
    }

    return rosPsi;
  }
  /**
   * Calculate the distance given the velocity and elapsed time.
   *
   * @param rate Velocity
   * @param time Elapsed time
   * @return Distance traveled
   */

  function spreadDistance(rate, time) {
    return rate * time;
  }
  function thetaFromBeta(betaHead, rosF, rosG, rosH) {
    if (rosF <= 0 || rosH <= 0) {
      return 0;
    }

    var betaRadians = radians$1(betaHead);
    var cosBeta = Math.cos(betaRadians);
    var cos2Beta = cosBeta * cosBeta;
    var sin2Beta = 1 - cos2Beta;
    var f2 = rosF * rosF;
    var g2 = rosG * rosG;
    var h2 = rosH * rosH;
    var term = Math.sqrt(h2 * cos2Beta + (f2 - g2) * sin2Beta);
    var num = rosH * cosBeta * term - rosF * rosG * sin2Beta;
    var denom = h2 * cos2Beta + f2 * sin2Beta;
    var cosThetaRadians = num / denom;
    var thetaRadians = Math.acos(cosThetaRadians); // Quadrant adjustment

    if (betaRadians < Math.PI) ; else if (betaRadians >= Math.PI) {
      thetaRadians = 2 * Math.PI - thetaRadians;
    } // Convert theta radians to degrees


    var thetaHead = degrees$1(thetaRadians);

    if (betaHead > 180) {
      thetaHead = 360 - thetaHead;
    }

    return thetaHead;
  } // //--------------------------------------------------------------------------
  // /** \brief Updates beta wrt head from theta.
  //  *
  //  * Calculate the degrees from the fire ignition point given the degrees
  //  * from the ellipse center and some ellipse paramaters.
  //  *
  //  * @param theta Azimuth from the ellipse center wrt the fire head
  //  * @param rosF spread rate at F
  //  * @param rosG spread rate at G
  //  * @param rosH spread rate at H
  //  * @returns The azimuth from the fire ignition point.
  //  */
  // export function betaFromTheta( theta, rosF, rosG, rosH) {
  //   const thetaRadians = Compass.radians(theta)
  //   const num = rosH * Math.sin( thetaRadians)
  //   const denom = rosG + rosF* Math.cos(thetaRadians)
  //   let betaRadians = ( denom <= 0 ) ? 0 : Math.atan( num / denom )
  //   // Quandrant adjustment
  //   const boundary1 = 150
  //   const boundary2 = 210
  //   if (theta <= boundary1) {
  //     // no adjustment required
  //   } else if (theta > boundary1 && theta <= boundary2) {
  //     betaRadians += Math.PI
  //   } else if (theta > boundary2) {
  //     betaRadians += 2.0 * Math.PI
  //   }
  //   // Convert beta radians to degrees
  //   return Compass.degrees(betaRadians)
  // }
  // export function thetaFromPsi( psiHead, rosF, rosH ) {
  //   if ( rosF <= 0 ) {
  //     return 0.0
  //   }
  //   const tanThetaRadians = Math.tan( psiHead ) * rosH / rosF
  //   let thetaRadians = Math.atan( tanThetaRadians )
  //   // Quadrant adjustment
  //   if ( psiRadians <= 0.5 * Math.PI ) {
  //     // no adjustment
  //   } else if ( psiRadians > 0.5 * Math.PI && psiRadians <= 1.5 * Math.PI ) {
  //     thetaRadians += Math.PI
  //   } else if ( psiRadians > 1.5 * Math.PI ) {
  //     thetaRadians += 2 * Math.PI
  //   }
  //   //thetaRadians += ( thetaRadians < 0. || psiradians > pi ) ? pi : 0.
  //   // Convert theta radians to degrees
  //   thetaDegrees = Compass.degrees( thetaRadians )
  //   return thetaRadians
  // }

  var FireEllipse = /*#__PURE__*/Object.freeze({
    __proto__: null,
    area: area$1,
    backingSpreadRate: backingSpreadRate,
    betaSpreadRate: betaSpreadRate,
    eccentricity: eccentricity,
    flankingSpreadRate: flankingSpreadRate,
    fSpreadRate: fSpreadRate,
    gSpreadRate: gSpreadRate,
    hSpreadRate: hSpreadRate,
    fliAtAzimuth: fliAtAzimuth,
    majorSpreadRate: majorSpreadRate,
    minorSpreadRate: minorSpreadRate,
    mapArea: mapArea,
    perimeter: perimeter$1,
    psiFromTheta: psiFromTheta,
    psiSpreadRate: psiSpreadRate,
    spreadDistance: spreadDistance,
    thetaFromBeta: thetaFromBeta
  });

  /**
   * @file Exported WFSP fuel bed equations
   * as described by Rothermel (1972) and as implemented by BehavePlus V6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins
   * @license MIT
   */
  /**
   * Calculate the 'live' fuel category moisture content of extinction.
   *
   * @param real mextk The 'live' fuel category moisture content of extinction factor (ratio).
   * @param real dfmc The 'dead' fuel category fine moisture content (ratio).
   * @param real dmext The 'dead' category moisture content of extinction (ratio).
   * @return real The 'live' fuel category  moisture content of extinction (ratio).
   */

  function extinctionMoistureContent$1(mextk, dfmc, dmext) {
    var dry = 1 - divide(dfmc, dmext);
    var lmext = mextk * dry - 0.226;
    return Math.max(lmext, dmext);
  }
  /**
   * Calculate the 'live' fuel category moisture content of extinction factor.
   *
   * This factor is constant for a fuel bed, and represents the ratio
   * of dead-to-live fuel mass that must be raised to ignition.  It
   * is the method described by Rothermel (1972) on page 35 that was
   * subsequently refined in BEHAVE and BehavePlus to use the
   * effective fuel load and effective heating number to determine
   * the ratio of fine dead to fine live fuels.
   *
   * See Rothermel (1972) eq 88 on page 35.
   *
   * @param float defl The 'dead' fuel catagory total fine fuel load (lb+1 ft-2).
   * @param float lefl The 'live' fuel catagory total fine fuel load (lb+1 ft-2).
   *
   * @return float The 'live' fuel category moisture content of extinction factor.
   */

  function extinctionMoistureContentFactor(defl, lefl) {
    return 2.9 * divide(defl, lefl);
  }
  /**
   * Calculate the fire heat per unit area.
   *
   * @param real rxi Fire reaction intensity (btu+1 ft-2 min-1).
   * @param real taur The fire/flame residence time (min+1).
   * @return The heat per unit area (btu+1 ft-2).
   */

  function heatPerUnitArea$1(rxi, taur) {
    return rxi * taur;
  }
  /**
   *
   * @param float qig Fuel bed heat of pre-ignition (btu+1 lb-1)
   * @param float bulk Fuel bed bulk density (lb+1 ft-3)
   * @return float Fuel bed heat sink (btu+1 ft-3)
   */

  function heatSink(qig, bulk) {
    return qig * bulk;
  }
  /**
   * Calculate the dead or live category mineral damping coefficient.
   *
   * @param float lifeCategoryEffectiveMineralContent
   * @return float Dead or live fuel category mineral damping coefficient.
   */

  function mineralDamping(seff) {
    var etas = seff <= 0 ? 1 : 0.174 / Math.pow(seff, 0.19);
    return fraction(etas);
  }
  /**
   * Calculate the dead or live life category moisture damping coefficient.
   *
   * @param mois Life fuel category moisture content (ratio).
   * @param mext Life fuel category moisture content of extinction (ratio).
   * @return The life fuel category moisture damping coefficient (fraction).
   */

  function moistureDamping(mois, mext) {
    var r = divide(mois, mext);
    return fraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r);
  }
  /**
   * Calculate the no-wind no-slope fire spread rate.
   *
   * @param real rxi The total fire reaction intensity (btu+1 ft-2 min-1).
   * @param real pflx The fuel bed propagating flux ratio (ratio).
   * @param real sink The fuel bed heat sink (btu+1 ft-3).
   * @return The no-wind no-slope fire spread rate (ft+1 min-1).
   */

  function noWindNoSlopeSpreadRate(rxi, pflx, sink) {
    return positive(divide(pflx * rxi, sink));
  }
  /**
   * Calculate the open-canopy midflame wind speed adjustment factor.
   *
   * @param fuelDepth Fuel bed depth (ft+1)
   * @return Wind speed adjustment factor
   */

  function openWindSpeedAdjustmentFactor(fuelDepth) {
    var f = Math.min(6, Math.max(fuelDepth, 0.1));
    return 1.83 / Math.log((20 + 0.36 * f) / (0.13 * f));
  }
  /**
   * Calculate the fuel bed optimum packing ratio (fraction).
   *
   * See Rothermel (1972) eq 37 (p 19, 26) and eq 69 (p32).
   *
   * @param float bedSavr Fuel bed surface area-to-volume ratio (ft-1).
   * @return float The fuel bed optimum packing ratio (fraction).
   */

  function optimumPackingRatio(savr) {
    return savr <= 0 ? 0 : 3.348 / Math.pow(savr, 0.8189);
  }
  function packingRatio(deadPprc, livePprc, depth) {
    return divide(deadPprc + livePprc, depth);
  }
  /**
   * Calculate the no-wind propagating flux ratio (ratio).
   *
   * The propagating flux is the numerator of the Rothermel (1972) spread
   * rate equation 1 and has units of heat per unit area per unit time.
   *
   * See Rothermel (1972) eq 42 (p 20, 26) and eq 76 (p32).
   *
   * @param float savr The fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @param float beta The fuel bed packing ratio (ratio).
   * @return float The fuel bed no-wind propagating flux ratio (ratio).
   */

  function propagatingFluxRatio(savr, beta) {
    return savr <= 0 ? 0 : Math.exp((0.792 + 0.681 * Math.sqrt(savr)) * (beta + 0.1)) / (192 + 0.2595 * savr);
  }
  /**
   * Calculate the life fuel category reaction intensity without moisture damping.
   *
   * @param float rxvo Fuel bed optimum reaction velocity (min-1).
   * @param float wnet Life fuel category net ovendry fuel load (lb+1 ft-2).
   * @param float heat Life fuel category heat of combustion (btu+1 lb-1).
   * @param float etas Life fuel category mineral damping coefficient (fraction).
   * @return float The life fuel category reaction intensity (btu+1 ft-2 min-1)
   *      without moisture damping.
   */

  function reactionIntensityDry(rxvo, wnet, heat, etas) {
    return rxvo * wnet * heat * etas;
  }
  /**
   * Calculate the fuel bed reaction velocity exponent 'A'.
   *
   * This is an arbitrary variable 'A'  used to derive the
   * fuel bed optimum reaction velocity.
   * See Rothermel (1972) eq 39 (p19, 26) and 67 (p 31).
   *
   * @param float savr Fuel bed surface area-to-volume ratio (ft-1).
   * @return float Fuel bed reaction velocity exponent 'A' (ratio).
   */

  function reactionVelocityExponent(savr) {
    return savr <= 0 ? 0 : 133 / Math.pow(savr, 0.7913);
  }
  /**
   * Calculate the fuel bed maximum reaction velocity (min-1).
   *
   * See Rothermel (1972) eq 36 (p 19, 26) and 68 (p 32).
   *
   * @param float bedSavr Fuel bed surface area-to-volume ratio (ft-1).
   * @return float Fuel bed maximum reaction velocity (min-1).
   */

  function reactionVelocityMaximum(sv15) {
    return sv15 <= 0 ? 0 : sv15 / (495 + 0.0594 * sv15);
  }
  /**
   * Calculate the fuel bed optimum reaction velocity (min-1).
   *
   * See Rothermel (1972) eq 38 (p 19, 26) and eq 67 (p 31).
   *
   * @param float betr Fuel bed packing ratio ratio (ratio).
   * @param float rxvm Fuel bed maximum reaction velocity (min-1).
   * @param float rxve Fuel bed reaction velocity exponent 'A' (ratio).
   * @return float Fuel bed optimum reaction velocity (min-1).
   */

  function reactionVelocityOptimum(betr, rxvm, rxve) {
    return betr <= 0 || betr === 1 ? 0 : rxvm * Math.pow(betr, rxve) * Math.exp(rxve * (1 - betr));
  } // DEPRECATED - The size class surface area calculations are now done inside swtg()
  // Accumulate fuel particle surface area by size class
  // for fuel particles with size class idx
  // export function scArea(idx, s1, a1, s2, a2, s3, a3, s4, a4, s5, a5) {
  //   let area = 0
  //   area += (idx === s1) ? a1 : 0
  //   area += (idx === s2) ? a2 : 0
  //   area += (idx === s3) ? a3 : 0
  //   area += (idx === s4) ? a4 : 0
  //   area += (idx === s5) ? a5 : 0
  //   return area
  // }

  /**
   * Calculate the often-used intermediate parameter of the fuel bed's
   * characteristics surface area-to-volume ratio raised to the 1.5 power.
   *
   * @param float savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @return float Fuel bed parameter (ratio).
   */

  function savr15(savr) {
    return Math.pow(savr, 1.5);
  }
  /**
   * Calculate the fuel bed slope coeffient `phiS` slope factor.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and used to determine the fire spread slope coefficient `phiS`.
   *
   * See Rothermel (1972) eq 51 (p 24, 26) and eq 80 (p 33).
   *
   * @param float packingRatio Fuel bed packing ratio (ratio).
   * @return float Factor used to derive the slope coefficient `phiS' (ratio).
   */

  function slopeK(beta) {
    return beta <= 0 ? 0 : 5.275 * Math.pow(beta, -0.3);
  } // Returns an array of 6 size class area weighting factors

  function sizeClassWeightingFactorArray(a1, s1, a2, s2, a3, s3, a4, s4, a5, s5) {
    var a = [a1, a2, a3, a4, a5];
    var s = [s1, s2, s3, s4, s5];
    var tarea = 0.0;
    var scar = [0, 0, 0, 0, 0, 0];

    for (var idx = 0; idx < 5; idx += 1) {
      scar[s[idx]] += a[idx];
      tarea += a[idx];
    }

    var scwt = [0, 0, 0, 0, 0, 0];

    if (tarea > 0.0) {
      for (var _idx = 0; _idx < 6; _idx += 1) {
        scwt[_idx] = scar[_idx] / tarea;
      }
    }

    return scwt;
  }
  /**
   * Calculate the fuel bed flame residence time.
   *
   * \TODO find reference
   *
   * @param float savr Fuel bed surface area-to-volume ratio (ft-1).
   * @return float Fuel bed flame residence time (min+1).
   */

  function taur(savr) {
    return savr <= 0 ? 0 : 384 / savr;
  }
  /**
   * Calculate the fuel bed wind coefficient `phiW` correlation factor `B`.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and is used to derive the fire spread wind coefficient `phiW`.
   *
   * See Rothermel (1972) eq 49 (p 23, 26) and eq 83 (p 33).
   *
   * @param float savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @return float Wind coefficient `phiW` correlation parameter `B` (ratio).
   */

  function windB(savr) {
    return 0.02526 * Math.pow(savr, 0.54);
  }
  /**
   * Calculate the fuel bed wind coefficient `phiW` correlation factor `C`.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and is used to derive the fire spread wind coefficient `phiW`.
   *
   * See Rothermel (1972) eq 48 (p 23, 26) and eq 82 (p 33).
   *
   * @param float savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @return float Wind coefficient `phiW` correlation parameter `C` (ratio).
   */

  function windC(savr) {
    return 7.47 * Math.exp(-0.133 * Math.pow(savr, 0.55));
  }
  /**
   * Calculate the fuel bed wind coefficient `phiW` correlation factor `E`.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and is used to derive the fire spread wind coefficient `phiW`.
   *
   * See Rothermel (1972) eq 50 (p 23, 26) and eq 82 (p 33).
   *
   * @param float savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
   * @return float Wind coefficient `phiW` correlation parameter `E` (ratio).
   */

  function windE(savr) {
    return 0.715 * Math.exp(-0.000359 * savr);
  }
  /**
   * Calculate the fuel bed wind coeffient `phiW` wind factor.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and used to determine the fire spread wind coefficient `phiW`.
   *
   * See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
   *
   * @param float betr Fuel bed packing ratio (ratio).
   * @param float wnde The fuel bed wind coefficient `phiW` correlation factor `E`.
   * @param float wndc The fuel bed wind coefficient `phiW` correlation factor `C`.
   * @return float Factor used to derive the wind coefficient `phiW' (ratio).
   */

  function windK(betr, wnde, wndc) {
    return betr <= 0 ? 0 : wndc * Math.pow(betr, -wnde);
  }
  /**
   * Calculate the fuel bed wind coeffient `phiW` inverse K wind factor.
   *
   * This factor is an intermediate parameter that is constant for a fuel bed,
   * and used to determine the fire spread wind coefficient `phiW`.
   *
   * It is the inverse of the wind factor 'K', and is used to re-derive
   * effective wind speeds within the BEHAVE fire spread computations.
   *
   * See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
   *
   * @param float betr Fuel bed packing ratio ratio (ratio).
   * @param float wnde The fuel bed wind coefficient `phiW` correlation factor `E`.
   * @param float wndc The fuel bed wind coefficient `phiW` correlation factor `C`.
   * @return float Factor used to derive the wind coefficient `phiW' (ratio).
   */

  function windI(betr, wnde, wndc) {
    return betr <= 0.0 || wndc <= 0 ? 0 : Math.pow(betr, wnde) / wndc;
  }
  function windSpeedAdjustmentFactor$2(fuelSheltered, shelteredWaf, openWaf) {
    return fuelSheltered ? Math.min(shelteredWaf, openWaf) : openWaf;
  }

  var FuelBed = /*#__PURE__*/Object.freeze({
    __proto__: null,
    extinctionMoistureContent: extinctionMoistureContent$1,
    extinctionMoistureContentFactor: extinctionMoistureContentFactor,
    heatPerUnitArea: heatPerUnitArea$1,
    heatSink: heatSink,
    mineralDamping: mineralDamping,
    moistureDamping: moistureDamping,
    noWindNoSlopeSpreadRate: noWindNoSlopeSpreadRate,
    openWindSpeedAdjustmentFactor: openWindSpeedAdjustmentFactor,
    optimumPackingRatio: optimumPackingRatio,
    packingRatio: packingRatio,
    propagatingFluxRatio: propagatingFluxRatio,
    reactionIntensityDry: reactionIntensityDry,
    reactionVelocityExponent: reactionVelocityExponent,
    reactionVelocityMaximum: reactionVelocityMaximum,
    reactionVelocityOptimum: reactionVelocityOptimum,
    savr15: savr15,
    slopeK: slopeK,
    sizeClassWeightingFactorArray: sizeClassWeightingFactorArray,
    taur: taur,
    windB: windB,
    windC: windC,
    windE: windE,
    windK: windK,
    windI: windI,
    windSpeedAdjustmentFactor: windSpeedAdjustmentFactor$2
  });

  /**
   * @file Exported BehavePlus fuel catalog accessors.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins
   * @license MIT
   */
  var Domains = ['behave', 'chaparral', 'palmettoGallberry', 'westernAspen'];
  /**
   * Map of fuel model aliases
   */

  var Alias = new Map([['0', '0'], [0, '0'], ['none', '0'], ['rock', '0'], ['water', '0'], ['1', '1'], [1, '1'], ['2', '2'], [2, '2'], ['3', '3'], [3, '3'], ['4', '4'], [4, '4'], ['5', '5'], [5, '5'], ['6', '6'], [6, '6'], ['7', '7'], [7, '7'], ['8', '8'], [8, '8'], ['9', '9'], [9, '9'], ['10', '10'], [10, '10'], ['11', '11'], [11, '11'], ['12', '12'], [12, '12'], ['13', '13'], [13, '13'], ['101', '101'], [101, '101'], ['gr1', '101'], ['102', '102'], [102, '102'], ['gr2', '102'], ['103', '103'], [103, '103'], ['gr3', '103'], ['104', '104'], [104, '104'], ['gr4', '104'], ['105', '105'], [105, '105'], ['gr5', '105'], ['106', '106'], [106, '106'], ['gr6', '106'], ['107', '107'], [107, '107'], ['gr7', '107'], ['108', '108'], [108, '108'], ['gr8', '108'], ['109', '109'], [109, '109'], ['gr9', '109'], ['121', '121'], [121, '121'], ['gs1', '121'], ['122', '122'], [122, '122'], ['gs2', '122'], ['123', '123'], [123, '123'], ['gs3', '123'], ['124', '124'], [124, '124'], ['gs4', '124'], ['141', '141'], [141, '141'], ['sh1', '141'], ['142', '142'], [142, '142'], ['sh2', '142'], ['143', '143'], [143, '143'], ['sh3', '143'], ['144', '144'], [144, '144'], ['sh4', '144'], ['145', '145'], [145, '145'], ['sh5', '145'], ['146', '146'], [146, '146'], ['sh6', '146'], ['147', '147'], [147, '147'], ['sh7', '147'], ['148', '148'], [148, '148'], ['sh8', '148'], ['149', '149'], [149, '149'], ['sh9', '149'], ['161', '161'], [161, '161'], ['tu1', '161'], ['162', '162'], [162, '162'], ['tu2', '162'], ['163', '163'], [163, '163'], ['tu3', '163'], ['164', '164'], [164, '164'], ['tu4', '164'], ['165', '165'], [165, '165'], ['tu5', '165'], ['181', '181'], [181, '181'], ['tl1', '181'], ['182', '182'], [182, '182'], ['tl2', '182'], ['183', '183'], [183, '183'], ['tl3', '183'], ['184', '184'], [184, '184'], ['tl4', '184'], ['185', '185'], [185, '185'], ['tl5', '185'], ['186', '186'], [186, '186'], ['tl6', '186'], ['187', '187'], [187, '187'], ['tl7', '187'], ['188', '188'], [188, '188'], ['tl8', '188'], ['189', '189'], [189, '189'], ['tl9', '189'], ['201', '201'], [201, '201'], ['sb1', '201'], ['202', '202'], [202, '202'], ['sb2', '202'], ['203', '203'], [203, '203'], ['sb3', '203'], ['204', '204'], [204, '204'], ['sb4', '204'], ['301', '301'], [301, '301'], ['chaparral/type=chamise/depth=6/deadFraction=0.5', '301'], ['401', '401'], [401, '401'], ['pg/age=20/basal=120/cover=.8/height=5', '401'], ['501', '501'], [501, '501'], ['aspenShrub50', '501']]);
  /**
   * Map of standard fuel models
   * where the map key is the model number as a text string
   */

  var Model = new Map([// Example special case dynamic fuel models:
  ['301', {
    domain: 'chaparral',
    label: 'chaparral, type=chamise, depth=6, deadFraction=0.5',
    number: 301,
    code: 'chaparral/type=chamise/depth=6/deadFraction=0.5',
    depth: 6,
    // the observed.depth
    totalLoad: 1,
    // the observed.totalLoad
    deadFraction: 0.5,
    // the observed.deadFuelFraction
    fuelType: 'chamise'
  }], ['401', {
    domain: 'palmettoGallberry',
    label: 'pg, age=20, basal=120, cover=.8, height=5',
    number: 401,
    code: 'pg/age=20/basal=120/cover=.8/height=5',
    age: 20,
    basalArea: 120,
    cover: 0.8,
    height: 5
  }], ['501', {
    domain: 'westernAspen',
    label: 'Aspen-shrub 50%',
    number: 501,
    code: 'aspenShrub50',
    curingLevel: 0.5,
    fuelType: 'aspenShrub'
  }], [// Standard BehavePlus Fuel Models
  '0', {
    domain: 'behave',
    label: 'No Fuel',
    number: 0,
    code: 'none',
    depth: 0,
    deadMext: 0,
    dead1Load: 0,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 0,
    liveHerbSavr: 0,
    liveStemSavr: 0,
    deadHeat: 0,
    liveHeat: 0
  }], ['1', {
    domain: 'behave',
    label: 'Short grass',
    number: 1,
    code: '1',
    depth: 1,
    deadMext: 0.12,
    dead1Load: 0.034,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 3500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['2', {
    domain: 'behave',
    label: 'Timber grass and understory',
    number: 2,
    code: '2',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.092,
    dead10Load: 0.046,
    dead100Load: 0.023,
    totalHerbLoad: 0.023,
    liveStemLoad: 0,
    dead1Savr: 3000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['3', {
    domain: 'behave',
    label: 'Tall grass',
    number: 3,
    code: '3',
    depth: 2.5,
    deadMext: 0.25,
    dead1Load: 0.138,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['4', {
    domain: 'behave',
    label: 'Chaparral',
    number: 4,
    code: '4',
    depth: 6,
    deadMext: 0.2,
    dead1Load: 0.23,
    dead10Load: 0.184,
    dead100Load: 0.092,
    totalHerbLoad: 0,
    liveStemLoad: 0.23,
    dead1Savr: 2000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['5', {
    domain: 'behave',
    label: 'Brush',
    number: 5,
    code: '5',
    depth: 2,
    deadMext: 0.2,
    dead1Load: 0.046,
    dead10Load: 0.023,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.092,
    dead1Savr: 2000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['6', {
    domain: 'behave',
    label: 'Dormant brush, hardwood slash',
    number: 6,
    code: '6',
    depth: 2.5,
    deadMext: 0.25,
    dead1Load: 0.069,
    dead10Load: 0.115,
    dead100Load: 0.092,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1750,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['7', {
    domain: 'behave',
    label: 'Southern rough',
    number: 7,
    code: '7',
    depth: 2.5,
    deadMext: 0.4,
    dead1Load: 0.052,
    dead10Load: 0.086,
    dead100Load: 0.069,
    totalHerbLoad: 0,
    liveStemLoad: 0.017,
    dead1Savr: 1750,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['8', {
    domain: 'behave',
    label: 'Short needle litter',
    number: 8,
    code: '8',
    depth: 0.2,
    deadMext: 0.3,
    dead1Load: 0.069,
    dead10Load: 0.046,
    dead100Load: 0.115,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['9', {
    domain: 'behave',
    label: 'Long needle or hardwood litter',
    number: 9,
    code: '9',
    depth: 0.2,
    deadMext: 0.25,
    dead1Load: 0.134,
    dead10Load: 0.019,
    dead100Load: 0.007,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['10', {
    domain: 'behave',
    label: 'Timber litter & understory',
    number: 10,
    code: '10',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.138,
    dead10Load: 0.092,
    dead100Load: 0.23,
    totalHerbLoad: 0,
    liveStemLoad: 0.092,
    dead1Savr: 2000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['11', {
    domain: 'behave',
    label: 'Light logging slash',
    number: 11,
    code: '11',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.069,
    dead10Load: 0.207,
    dead100Load: 0.253,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['12', {
    domain: 'behave',
    label: 'Medium logging slash',
    number: 12,
    code: '12',
    depth: 2.3,
    deadMext: 0.2,
    dead1Load: 0.184,
    dead10Load: 0.644,
    dead100Load: 0.759,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['13', {
    domain: 'behave',
    label: 'Heavy logging slash',
    number: 13,
    code: '13',
    depth: 3,
    deadMext: 0.25,
    dead1Load: 0.322,
    dead10Load: 1.058,
    dead100Load: 1.288,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['101', {
    domain: 'behave',
    label: 'Short, sparse, dry climate grass',
    number: 101,
    code: 'gr1',
    depth: 0.4,
    deadMext: 0.15,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.013774104683195591,
    liveStemLoad: 0,
    dead1Savr: 2200,
    liveHerbSavr: 2000,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['102', {
    domain: 'behave',
    label: 'Low load, dry climate grass',
    number: 102,
    code: 'gr2',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.04591368227731864,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['103', {
    domain: 'behave',
    label: 'Low load, very coarse, humid climate grass',
    number: 103,
    code: 'gr3',
    depth: 2,
    deadMext: 0.3,
    dead1Load: 0.004591368227731864,
    dead10Load: 0.018365472910927456,
    dead100Load: 0,
    totalHerbLoad: 0.06887052341597796,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1300,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['104', {
    domain: 'behave',
    label: 'Moderate load, dry climate grass',
    number: 104,
    code: 'gr4',
    depth: 2,
    deadMext: 0.15,
    dead1Load: 0.01147842056932966,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.0872359963269054,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['105', {
    domain: 'behave',
    label: 'Low load, humid climate grass',
    number: 105,
    code: 'gr5',
    depth: 1.5,
    deadMext: 0.4,
    dead1Load: 0.018365472910927456,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.11478420569329659,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['106', {
    domain: 'behave',
    label: 'Moderate load, humid climate grass',
    number: 106,
    code: 'gr6',
    depth: 1.5,
    deadMext: 0.4,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.15610651974288337,
    liveStemLoad: 0,
    dead1Savr: 2200,
    liveHerbSavr: 2000,
    liveStemSavr: 1500,
    deadHeat: 9000,
    liveHeat: 9000
  }], ['107', {
    domain: 'behave',
    label: 'High load, dry climate grass',
    number: 107,
    code: 'gr7',
    depth: 3,
    deadMext: 0.15,
    dead1Load: 0.04591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.24793388429752067,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['108', {
    domain: 'behave',
    label: 'High load, very coarse, humid climate grass',
    number: 108,
    code: 'gr8',
    depth: 4,
    deadMext: 0.3,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.0459139,
    dead100Load: 0,
    totalHerbLoad: 0.33516988062442604,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1300,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['109', {
    domain: 'behave',
    label: 'Very high load, humid climate grass',
    number: 109,
    code: 'gr9',
    depth: 5,
    deadMext: 0.4,
    dead1Load: 0.04591368227731864,
    dead10Load: 0.04591368227731864,
    dead100Load: 0,
    totalHerbLoad: 0.4132231404958677,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['121', {
    domain: 'behave',
    label: 'Low load, dry climate grass-shrub',
    number: 121,
    code: 'gs1',
    depth: 0.9,
    deadMext: 0.15,
    dead1Load: 0.009182736455463728,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.02295684113865932,
    liveStemLoad: 0.02984403,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1800,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['122', {
    domain: 'behave',
    label: 'Moderate load, dry climate grass-shrub',
    number: 122,
    code: 'gs2',
    depth: 1.5,
    deadMext: 0.15,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.02295684113865932,
    dead100Load: 0,
    totalHerbLoad: 0.027548209366391182,
    liveStemLoad: 0.04591368227731864,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1800,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['123', {
    domain: 'behave',
    label: 'Moderate load, humid climate grass-shrub',
    number: 123,
    code: 'gs3',
    depth: 1.8,
    deadMext: 0.4,
    dead1Load: 0.013774104683195591,
    dead10Load: 0.01147842056932966,
    dead100Load: 0,
    totalHerbLoad: 0.06657483930211203,
    liveStemLoad: 0.057392102846648294,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['124', {
    domain: 'behave',
    label: 'High load, humid climate grass-shrub',
    number: 124,
    code: 'gs4',
    depth: 2.1,
    deadMext: 0.4,
    dead1Load: 0.0872359963269054,
    dead10Load: 0.013774104683195591,
    dead100Load: 0.004591368227731864,
    totalHerbLoad: 0.15610651974288337,
    liveStemLoad: 0.3259871441689623,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['141', {
    domain: 'behave',
    label: 'Low load, dry climate shrub',
    number: 141,
    code: 'sh1',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.01147842056932966,
    dead10Load: 0.01147842056932966,
    dead100Load: 0,
    totalHerbLoad: 0.0068870523415977955,
    liveStemLoad: 0.05968778696051423,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['142', {
    domain: 'behave',
    label: 'Moderate load, dry climate shrub',
    number: 142,
    code: 'sh2',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.06198347107438017,
    dead10Load: 0.11019283746556473,
    dead100Load: 0.03443526170798898,
    totalHerbLoad: 0,
    liveStemLoad: 0.17676767676767677,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['143', {
    domain: 'behave',
    label: 'Moderate load, humid climate shrub',
    number: 143,
    code: 'sh3',
    depth: 2.4,
    deadMext: 0.4,
    dead1Load: 0.02066115702479339,
    dead10Load: 0.13774104683195593,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.28466483011937554,
    dead1Savr: 1600,
    liveHerbSavr: 1800,
    liveStemSavr: 1400,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['144', {
    domain: 'behave',
    label: 'Low load, humid climate timber-shrub',
    number: 144,
    code: 'sh4',
    depth: 3,
    deadMext: 0.3,
    dead1Load: 0.03902662993572084,
    dead10Load: 0.05280073461891643,
    dead100Load: 0.009182736455463728,
    totalHerbLoad: 0,
    liveStemLoad: 0.11707988980716252,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['145', {
    domain: 'behave',
    label: 'High load, dry climate shrub',
    number: 145,
    code: 'sh5',
    depth: 6,
    deadMext: 0.15,
    dead1Load: 0.1652892561983471,
    dead10Load: 0.09641873278236915,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.13314967860422405,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['146', {
    domain: 'behave',
    label: 'Low load, humid climate shrub',
    number: 146,
    code: 'sh6',
    depth: 2,
    deadMext: 0.3,
    dead1Load: 0.13314967860422405,
    dead10Load: 0.06657483930211203,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.06427915518824609,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['147', {
    domain: 'behave',
    label: 'Very high load, dry climate shrub',
    number: 147,
    code: 'sh7',
    depth: 6,
    deadMext: 0.15,
    dead1Load: 0.16069788797061524,
    dead10Load: 0.24334251606978877,
    dead100Load: 0.10101010101010101,
    totalHerbLoad: 0,
    liveStemLoad: 0.15610651974288337,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['148', {
    domain: 'behave',
    label: 'High load, humid climate shrub',
    number: 148,
    code: 'sh8',
    depth: 3,
    deadMext: 0.4,
    dead1Load: 0.0941230486685032,
    dead10Load: 0.15610651974288337,
    dead100Load: 0.03902662993572084,
    totalHerbLoad: 0,
    liveStemLoad: 0.19972451790633605,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['149', {
    domain: 'behave',
    label: 'Very high load, humid climate shrub',
    number: 149,
    code: 'sh9',
    depth: 4.4,
    deadMext: 0.4,
    dead1Load: 0.20661157024793386,
    dead10Load: 0.11248852157943066,
    dead100Load: 0,
    totalHerbLoad: 0.07116620752984389,
    liveStemLoad: 0.3213957759412305,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['161', {
    domain: 'behave',
    label: 'Light load, dry climate timber-grass-shrub',
    number: 161,
    code: 'tu1',
    depth: 0.6,
    deadMext: 0.2,
    dead1Load: 0.009182736455463728,
    dead10Load: 0.04132231404958678,
    dead100Load: 0.06887052341597796,
    totalHerbLoad: 0.009182736455463728,
    liveStemLoad: 0.04132231404958678,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['162', {
    domain: 'behave',
    label: 'Moderate load, humid climate timber-shrub',
    number: 162,
    code: 'tu2',
    depth: 1,
    deadMext: 0.3,
    dead1Load: 0.0436179981634527,
    dead10Load: 0.08264462809917356,
    dead100Load: 0.057392102846648294,
    totalHerbLoad: 0,
    liveStemLoad: 0.009182736455463728,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['163', {
    domain: 'behave',
    label: 'Moderate load, humid climate timber-grass-shrub',
    number: 163,
    code: 'tu4',
    depth: 1.3,
    deadMext: 0.3,
    dead1Load: 0.050505050505050504,
    dead10Load: 0.0068870523415977955,
    dead100Load: 0.01147842056932966,
    totalHerbLoad: 0.029843893480257115,
    liveStemLoad: 0.050505050505050504,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1400,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['164', {
    domain: 'behave',
    label: 'Dwarf conifer understory',
    number: 164,
    code: 'tu4',
    depth: 0.5,
    deadMext: 0.12,
    dead1Load: 0.20661157024793386,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.09182736455463728,
    dead1Savr: 2300,
    liveHerbSavr: 1800,
    liveStemSavr: 2000,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['165', {
    domain: 'behave',
    label: 'Very high load, dry climate timber-shrub',
    number: 165,
    code: 'tu5',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.18365472910927455,
    dead10Load: 0.18365472910927455,
    dead100Load: 0.13774104683195593,
    totalHerbLoad: 0,
    liveStemLoad: 0.13774104683195593,
    dead1Savr: 1500,
    liveHerbSavr: 1800,
    liveStemSavr: 750,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['181', {
    domain: 'behave',
    label: 'Low load, compact conifer litter',
    number: 181,
    code: 'tl1',
    depth: 0.2,
    deadMext: 0.3,
    dead1Load: 0.04591368227731864,
    dead10Load: 0.10101010101010101,
    dead100Load: 0.1652892561983471,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['182', {
    domain: 'behave',
    label: 'Low load broadleaf litter',
    number: 182,
    code: 'tl2',
    depth: 0.2,
    deadMext: 0.25,
    dead1Load: 0.06427915518824609,
    dead10Load: 0.10560146923783285,
    dead100Load: 0.10101010101010101,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['183', {
    domain: 'behave',
    label: 'Moderate load conifer litter',
    number: 183,
    code: 'tl3',
    depth: 0.3,
    deadMext: 0.2,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.10101010101010101,
    dead100Load: 0.12855831037649218,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['184', {
    domain: 'behave',
    label: 'Small downed logs',
    number: 184,
    code: 'tl4',
    depth: 0.4,
    deadMext: 0.25,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.06887052341597796,
    dead100Load: 0.1928374655647383,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['185', {
    domain: 'behave',
    label: 'High load conifer litter',
    number: 185,
    code: 'tl5',
    depth: 0.6,
    deadMext: 0.25,
    dead1Load: 0.05280073461891643,
    dead10Load: 0.11478420569329659,
    dead100Load: 0.20202020202020202,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['186', {
    domain: 'behave',
    label: 'High load broadleaf litter',
    number: 186,
    code: 'tl6',
    depth: 0.3,
    deadMext: 0.25,
    dead1Load: 0.11019283746556473,
    dead10Load: 0.055096418732782364,
    dead100Load: 0.055096418732782364,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['187', {
    domain: 'behave',
    label: 'Large downed logs',
    number: 187,
    code: 'tl7',
    depth: 0.4,
    deadMext: 0.25,
    dead1Load: 0.013774104683195591,
    dead10Load: 0.06427915518824609,
    dead100Load: 0.371900826446281,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['188', {
    domain: 'behave',
    label: 'Long-needle litter',
    number: 188,
    code: 'tl8',
    depth: 0.3,
    deadMext: 0.35,
    dead1Load: 0.2662993572084481,
    dead10Load: 0.06427915518824609,
    dead100Load: 0.050505050505050504,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['189', {
    domain: 'behave',
    label: 'Very high load broadleaf litter',
    number: 189,
    code: 'tl9',
    depth: 0.6,
    deadMext: 0.35,
    dead1Load: 0.305325987144169,
    dead10Load: 0.1515151515151515,
    dead100Load: 0.19054178145087236,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['201', {
    domain: 'behave',
    label: 'Low load activity fuel',
    number: 201,
    code: 'sb1',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.06887052341597796,
    dead10Load: 0.13774104683195593,
    dead100Load: 0.505050505050505,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['202', {
    domain: 'behave',
    label: 'Moderate load activity or low load blowdown',
    number: 202,
    code: 'sb2',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.20661157024793386,
    dead10Load: 0.1951331496786042,
    dead100Load: 0.18365472910927455,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['203', {
    domain: 'behave',
    label: 'High load activity fuel or moderate load blowdown',
    number: 203,
    code: 'sb3',
    depth: 1.2,
    deadMext: 0.25,
    dead1Load: 0.2525252525252525,
    dead10Load: 0.12626262626262624,
    dead100Load: 0.13774104683195593,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }], ['204', {
    domain: 'behave',
    label: 'High load blowdown',
    number: 204,
    code: 'sb4',
    depth: 2.7,
    deadMext: 0.25,
    dead1Load: 0.24104683195592286,
    dead10Load: 0.16069788797061524,
    dead100Load: 0.24104683195592286,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000
  }]]);

  /**
   * @file Exported BehavePlus fuel catalog accessors.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins
   * @license MIT
   */
  /**
   * @return A sorted array of all the fuel model alias Map key strings.
   */

  function aliases() {
    return Array.from(Alias.keys()).sort();
  }
  function code(alias) {
    return model(alias).code;
  }
  function domain(alias) {
    return model(alias).domain;
  }
  /**
   * @param {string} alias The Fuel.Alias map key string
   */

  function hasAlias(alias) {
    return Alias.has(alias);
  }
  /**
   * @param {string} key The Fuel.Model map key string
   */

  function hasKey(key) {
    return Model.has(key);
  }
  /**
   * @return A sorted array of all the fuel catalog model Map key strings.
   */

  function keys() {
    return Array.from(Model.keys()).sort();
  }
  /**
   * @return A sorted array of fuel catalog model [number, code, label]
   */

  function list() {
    return Array.from(Model.keys()).sort().map(function (key) {
      return [number(key), code(key), label(key)];
    });
  }
  function label(alias) {
    return model(alias).label;
  }
  /**
   * @param {string} alias Alias map key string
   * @return Reference to the Fuel.Model with the 'alias',
   * or throws an Error if the alias does not exist.
   */

  function model(alias) {
    if (!Alias.has(alias)) {
      throw new Error("Fuel catalog does not have fuel model key or alias '".concat(alias, "'"));
    }

    return Model.get(Alias.get(alias));
  }
  /**
   * @return An array of all the fuel catalog model objects.
   */

  function models() {
    return Array.from(Model.values());
  }
  function number(alias) {
    return model(alias).number;
  }
  function behaveDead1Load(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.dead1Load : 0;
  }
  function behaveDead1Savr(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.dead1Savr : 1;
  }
  function behaveDead10Load(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.dead10Load : 0;
  }
  function behaveDead100Load(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.dead100Load : 0;
  }
  function behaveDeadHeat(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.deadHeat : 0;
  }
  function behaveDeadMext(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.deadMext : 0.01;
  }
  function behaveDepth(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.depth : 0.01;
  }
  function behaveLiveHeat(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.liveHeat : 0;
  }
  function behaveLiveHerbSavr(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.liveHerbSavr : 1;
  }
  function behaveLiveStemLoad(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.liveStemLoad : 0;
  }
  function behaveLiveStemSavr(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.liveStemSavr : 1;
  }
  function behaveTotalHerbLoad(alias) {
    var fuel = model(alias);
    return fuel.domain === 'behave' ? fuel.totalHerbLoad : 0;
  }
  function chaparralDeadFraction(alias) {
    var fuel = model(alias);
    return fuel.domain === 'chaparral' ? fuel.deadFraction : 0;
  }
  function chaparralDepth(alias) {
    var fuel = model(alias);
    return fuel.domain === 'chaparral' ? fuel.depth : 0.01;
  }
  function chaparralFuelType(alias) {
    var fuel = model(alias);
    return fuel.domain === 'chaparral' ? fuel.fuelType : 'none';
  }
  function chaparralTotalLoad(alias) {
    var fuel = model(alias);
    return fuel.domain === 'chaparral' ? fuel.totalLoad : 0;
  }
  function pgAge(alias) {
    var fuel = model(alias);
    return fuel.domain === 'palmettoGallberry' ? fuel.age : 0;
  }
  function pgBasalArea(alias) {
    var fuel = model(alias);
    return fuel.domain === 'palmettoGallberry' ? fuel.basalArea : 0;
  }
  function pgCover(alias) {
    var fuel = model(alias);
    return fuel.domain === 'palmettoGallberry' ? fuel.cover : 'none';
  }
  function pgHeight(alias) {
    var fuel = model(alias);
    return fuel.domain === 'palmettoGallberry' ? fuel.height : 0;
  }
  function westernAspenCuringLevel(alias) {
    var fuel = model(alias);
    return fuel.domain === 'westernAspen' ? fuel.curingLevel : 0;
  }
  function westernAspenFuelType(alias) {
    var fuel = model(alias);
    return fuel.domain === 'westernAspen' ? fuel.fuelType : 'none';
  }

  var FuelCatalog = /*#__PURE__*/Object.freeze({
    __proto__: null,
    aliases: aliases,
    code: code,
    domain: domain,
    hasAlias: hasAlias,
    hasKey: hasKey,
    keys: keys,
    list: list,
    label: label,
    model: model,
    models: models,
    number: number,
    behaveDead1Load: behaveDead1Load,
    behaveDead1Savr: behaveDead1Savr,
    behaveDead10Load: behaveDead10Load,
    behaveDead100Load: behaveDead100Load,
    behaveDeadHeat: behaveDeadHeat,
    behaveDeadMext: behaveDeadMext,
    behaveDepth: behaveDepth,
    behaveLiveHeat: behaveLiveHeat,
    behaveLiveHerbSavr: behaveLiveHerbSavr,
    behaveLiveStemLoad: behaveLiveStemLoad,
    behaveLiveStemSavr: behaveLiveStemSavr,
    behaveTotalHerbLoad: behaveTotalHerbLoad,
    chaparralDeadFraction: chaparralDeadFraction,
    chaparralDepth: chaparralDepth,
    chaparralFuelType: chaparralFuelType,
    chaparralTotalLoad: chaparralTotalLoad,
    pgAge: pgAge,
    pgBasalArea: pgBasalArea,
    pgCover: pgCover,
    pgHeight: pgHeight,
    westernAspenCuringLevel: westernAspenCuringLevel,
    westernAspenFuelType: westernAspenFuelType,
    Domains: Domains
  });

  /**
   * @file Exported WFSP fuel particle equations as implemented by BehavePlus v6.
   * @copyright Systems for Environmental Management 2019
   * @author Collin D. Bevins
   * @version 0.1.0
   */
  /**
   * Calculate and return a fuel particle diameter (ft+1)
   * from a surface area-to-volume ratio (ft-1).
   *
   * The diameter is derived using Rothermel (1972) equation 32 (p 14).
   *
   * @param float savr Fuel particle surface area-to-volume ratio (ft-1).
   *
   * @return float Fuel particle diameter (ft+1).
   */

  function cylindricalDiameter(savr) {
    return divide(4, savr);
  }
  /**
   * Calculate and return the length (ft+1) of a hypothetical cylindrical
   * fuel particle given its diameter (ft+1) and volume (ft+3).
   *
   * @param float diam Fuel particle diameter (ft+1).
   * @param float volm Fuel particle volume (ft+3).
   *
   * @return float Fuel particle length (ft+1).
   */

  function cylindricalLength(diam, volm) {
    var radius = diam / 2;
    var area = Math.PI * radius * radius;
    return divide(volm, area);
  }
  /**
   * Calculate and return a fuel particle effective heating number (fraction)
   * from a surface area-to-volume ratio (ft-1).
   *
   * The effective heating number is derived from Rothermel (1972) equation 14
   * (p 8, 26) and 77 (p 32).
   *
   * @param float savr Fuel particle surface area-to-volume ratio (ft-1).
   *
   * @return float Fuel particle effective heating number (fraction).
   */

  function effectiveHeatingNumber(savr) {
    return savr <= 0 ? 0 : Math.exp(-138 / savr);
  }
  /**
   * Calculate and return the dead fuel particle `fine fuel load`.
   *
   * The `fine fuel load` is the portion of the fuel particle
   * load used to determine the life category fine fuel,
   * which in turn is used to determine the live category
   * moisture content of extinction.
   *
   * See Rothermel (1972) equation 88 on page 35.
   *
   * @param string life The fuel particle life category: 'dead' or 'live'.
   * @param real savr The fuel particle surface area-to-volume ratio (ft-1).
   * @param real load The fuel particle load (lb/ft2).
   *
   * @return real Fuel particle ignition fuel load (lb/ft2).
   */

  function effectiveFuelLoad(savr, load, life) {
    return life === 'dead' ? effectiveFuelLoadDead(savr, load) : effectiveFuelLoadLive(savr, load);
  }
  function effectiveFuelLoadDead(savr, load) {
    return savr <= 0 ? 0 : load * Math.exp(-138 / savr);
  } // Calculate and return the live fuel particle `fine fuel load`.

  function effectiveFuelLoadLive(savr, load) {
    return savr <= 0 ? 0 : load * Math.exp(-500 / savr);
  } // Calculate and return the ignition fuel water load (lb water + 1 lb fuel -1)

  function effectiveFuelWaterLoad(effectiveFuelOvendryLoad, moistureContent) {
    return effectiveFuelOvendryLoad * moistureContent;
  }
  /**
   * Calculate the fuel particle heat of pre-ignition.
   * @return real The fuel particle heat of pre-ignition (btu+1 lb-1).
   */

  function heatOfPreignition(mc, efhn) {
    var qig = 250.0 + 1116.0 * mc;
    return qig * efhn;
  }
  function netOvendryLoad(ovendryFuelLoad, totalMineralContent) {
    return (1 - totalMineralContent) * ovendryFuelLoad;
  }
  function selectByDomain(domain, behave, chaparral, palmetto, waspen) {
    if (domain === 'behave') {
      return behave;
    } else if (domain === 'chaparral') {
      return chaparral;
    } else if (domain === 'palmettoGallberry') {
      return palmetto;
    } else if (domain === 'westernAspen') {
      return waspen;
    }

    throw new Error("Unknown domain '".concat(domain, "'"));
  }
  /**
   * Calculate and return the fuel particle size class [0-5]
   * given its surface area-to-volume ratio (ft-1).
   *
   * The Rothermel fire spread model groups dead and down fuel particles into
   * one of 6 size classes based upon its diameter (or surface area-to-volume ratio)
   * as follows:
   *
   *<table>
   *<tr><td>Size Class</td><td>Diameter (in)</td><td>Surface Area-to-Vol</td><td>Time-lag</td></tr>
   *  <tr><td>0</td><td>0.00 - 0.04</td><td>&gt 1200</td><td>1</td></tr>
   *  <tr><td>1</td><td>0.04 - 0.25</td><td>192 - 1200</td><td>1</td></tr>
   *  <tr><td>2</td><td>0.25 - 0.50</td><td>96 - 192</td><td>10</td></tr>
   *  <tr><td>3</td><td>0.50 - 1.00</td><td>48 - 96</td><td>10</td></tr>
   *  <tr><td>4</td><td>1.00 - 3.00</td><td>16 - 48</td><td>100</td></tr>
   *  <tr><td>5</td><td>&gt 3.00</td><td>&lt 16</td><td>1000</td></tr>
   * </table>
   *
   * @param {number} savr Fuel particle surface area-to-volume ratio (ft-1).
   *
   * @return {integer} Fuel particle size class [0..5].
   */

  function sizeClass(savr) {
    var size = 5; // 3.00+ "

    if (savr >= 1200.0) {
      // 0.00 - 0.04"
      size = 0;
    } else if (savr >= 192.0) {
      // 0.04 - 0.25"
      size = 1;
    } else if (savr >= 96.0) {
      // 0.25 - 0.50"
      size = 2;
    } else if (savr >= 48.0) {
      // 0.50 - 1.00"
      size = 3;
    } else if (savr >= 16.0) {
      // 1.00 - 3.00"
      size = 4;
    }

    return size;
  }
  function sizeClassWeightingFactor(size, swtgArray) {
    return swtgArray[size];
  }
  /**
   * Calculate and return the fuel particle surface area (ft+2)
   * given its load (lb+1 ft-2), surface area-to-volume ratio (ft-1),
   * and fiber density (lb+1 ft-3).
   *
   * @param float load Fuel particle load (lb+1 ft-2).
   * @param float savr Fuel particle surface area-to-volume ratio (ft-1).
   * @param float density Fuel particle fiber density (lb+1 ft-3).
   *
   * @return float Fuel particle surface area (ft+2).
   */

  function surfaceArea(load, savr, dens) {
    return divide(load * savr, dens);
  }
  function surfaceAreaWeightingFactor(area, catArea) {
    return fraction(divide(area, catArea));
  }
  /**
   * Calculate and return the fuel particle volume (ft3/ft2)
   * given its a load (lb/ft2) and fiber density (lb/ft3).
   *
   * @param {number} load Fuel particle ovendry load (lb/ft2).
   * @param {number} dens Fuel particle fiber density (lb/ft3).
   *
   * @return float Fuel particle volume per square foot of fuel bed (ft3/ft2).
   */

  function volume(load, dens) {
    return divide(load, dens);
  }

  var FuelParticle = /*#__PURE__*/Object.freeze({
    __proto__: null,
    cylindricalDiameter: cylindricalDiameter,
    cylindricalLength: cylindricalLength,
    effectiveHeatingNumber: effectiveHeatingNumber,
    effectiveFuelLoad: effectiveFuelLoad,
    effectiveFuelLoadDead: effectiveFuelLoadDead,
    effectiveFuelLoadLive: effectiveFuelLoadLive,
    effectiveFuelWaterLoad: effectiveFuelWaterLoad,
    heatOfPreignition: heatOfPreignition,
    netOvendryLoad: netOvendryLoad,
    selectByDomain: selectByDomain,
    sizeClass: sizeClass,
    sizeClassWeightingFactor: sizeClassWeightingFactor,
    surfaceArea: surfaceArea,
    surfaceAreaWeightingFactor: surfaceAreaWeightingFactor,
    volume: volume
  });

  /**
   * @file Exported WFSP surface fire and lightning strike ignition probability equations
   * as described by Latham () as described by Albini (1998) and
   * as implemented by BehavePlus v6.
   * @copyright Systems for Environmental Management 2019
   * @author Collin D. Bevins <cbevins@montana.com>
   * @version 0.1.0
   */
  /**
   * Calculates the probability of a surface fire firebrand starting a fire.
   *
   * @param {number} fuelTemperature  Dead surface fuel temperature (oF).
   * @param {number} fuelMoisture     Dead 1-hour time-lag surface fuel moisture content (lb/lb).
   * @return Probability of a firebrand starting a fire [0..1].
   */

  function firebrand(fuelTemperature, fuelMoisture) {
    var c = (fuelTemperature - 32) * 5 / 9;
    var qign = Math.min(144.51 - 0.266 * c - 0.00058 * c * c - c * fuelMoisture + 18.54 * (1 - Math.exp(-15.1 * fuelMoisture)) + 640 * fuelMoisture, 400);
    var x = 0.1 * (400 - qign);
    return fraction(0.000048 * Math.pow(x, 4.3) / 50);
  }
  /**
   * Calculates the fuel temperature using the BEHAVE FIRE2 subroutine CAIGN() algorithm.
   *
   *  @param airTemp        Air temperature (oF).
   *  @param shadeFraction  Fraction of sun shaded from the fuel.
   *  @return Fuel temperature (oF).
   */

  function fuelTemperature(airTemp, shadeFraction) {
    var xincr = 25 - 20 * shadeFraction;
    return airTemp + xincr;
  } // Probability of a continuing current by charge type (Latham)

  var ccNeg = 0.2;
  var ccPos = 0.9;
  var lightningData = {
    ponderosaPineLitter: {
      label: 'Ponderosa pine litter',
      positive: function positive(arg) {
        return ccPos * (0.92 * Math.exp(-0.087 * arg.moisture));
      },
      negative: function negative(arg) {
        return ccNeg * (1.04 * Math.exp(-0.054 * arg.moisture));
      }
    },
    punkyWoodRottenChunky: {
      label: 'Punky wood, rotten, chunky',
      positive: function positive(arg) {
        return ccPos * (0.44 * Math.exp(-0.11 * arg.moisture));
      },
      negative: function negative(arg) {
        return ccNeg * (0.59 * Math.exp(-0.094 * arg.moisture));
      }
    },
    punkyWoodPowderDeep: {
      label: 'Punky wood powder, deep (4.8 cm)',
      positive: function positive(arg) {
        return ccPos * (0.86 * Math.exp(-0.06 * arg.moisture));
      },
      negative: function negative(arg) {
        return ccNeg * (0.9 * Math.exp(-0.056 * arg.moisture));
      }
    },
    punkyWoodPowderShallow: {
      label: 'Punk wood powder, shallow (2.4 cm)',
      positive: function positive(arg) {
        return ccPos * (0.6 - 0.011 * arg.moisture);
      },
      negative: function negative(arg) {
        return ccNeg * (0.73 - 0.011 * arg.moisture);
      }
    },
    lodgepolePineDuff: {
      label: 'Lodgepole pine duff',
      positive: function positive(arg) {
        return ccPos * (1 / (1 + Math.exp(5.13 - 0.68 * arg.depth)));
      },
      negative: function negative(arg) {
        return ccNeg * (1 / (1 + Math.exp(3.84 - 0.6 * arg.depth)));
      }
    },
    douglasFirDuff: {
      label: 'Douglas-fir duff',
      positive: function positive(arg) {
        return ccPos * (1 / (1 + Math.exp(6.69 - 1.39 * arg.depth)));
      },
      negative: function negative(arg) {
        return ccNeg * (1 / (1 + Math.exp(5.48 - 1.28 * arg.depth)));
      }
    },
    highAltitudeMixed: {
      label: 'High altitude mixed (mainly Engelmann spruce)',
      positive: function positive(arg) {
        return ccPos * (0.62 * Math.exp(-0.05 * arg.moisture));
      },
      negative: function negative(arg) {
        return ccNeg * (0.8 - 0.014 * arg.moisture);
      }
    },
    peatMoss: {
      label: 'Peat moss (commercial)',
      positive: function positive(arg) {
        return ccPos * (0.71 * Math.exp(-0.07 * arg.moisture));
      },
      negative: function negative(arg) {
        return ccNeg * (0.84 * Math.exp(-0.06 * arg.moisture));
      }
    }
  };
  var LightningCharges = ['negative', 'positive', 'unknown'];
  var LightningFuels = Object.keys(lightningData);
  /**
   * Calculates the probability of a lightning strike starting a fire.
   *
   *  @param fuelType Ignition fuel bed type:
   *  @param depth    Ignition fuel (duff & litter) bed depth (inches).
   *  @param duffMoisture Ignition fuel (duff & litter 100-h) moisture content (lb/lb).
   *  @param chargeType Lightning charge, one of 'positive', 'negative', or 'unknown'
   *  @return Probability of the lightning strike starting a fire [0..1].
   *
   *  \note  The following assumptions are made by Latham:
   *  - 20% of negative flashes have continuing current
   *  - 90% of positive flashes have continuing current
   *  - Latham and Schlieter found a relative frequency of
   *    0.723 negative and 0.277 positive strikes
   *  - Unknown strikes are therefore p = 0.1446 neg + 0.2493 pos
   */

  function lightningStrike(fuelType, depth, moisture, chargeType) {
    // Convert duff depth to cm and restrict to maximum of 10 cm.
    // Convert duff moisture to percent and restrict to maximum of 40%.
    var args = {
      depth: Math.min(30.48 * depth, 10),
      moisture: Math.min(100 * moisture, 40)
    }; // If 'positive' or 'negative'...

    if (chargeType === 'positive' || chargeType === 'negative') {
      return fraction(lightningData[fuelType][chargeType](args));
    } // Otherwise, return a positive/negative frequency-weighted value using
    // Latham and Schlieter's relative frequency of a continuing current by charge type


    var freqNeg = 0.723;
    var freqPos = 0.277;
    var pos = fraction(lightningData[fuelType].positive(args));
    var neg = fraction(lightningData[fuelType].negative(args));
    return fraction(freqPos * pos + freqNeg * neg);
  }

  var IgnitionProbability = /*#__PURE__*/Object.freeze({
    __proto__: null,
    firebrand: firebrand,
    fuelTemperature: fuelTemperature,
    lightningData: lightningData,
    LightningCharges: LightningCharges,
    LightningFuels: LightningFuels,
    lightningStrike: lightningStrike
  });

  /**
   * @file Exported WFSP palmetto-gallberry dynamic fuel model equations
   * as described by Hough and Albini (1978) and as implemented by BehavePlus V6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */

  function deadFineLoad(age, ht) {
    return positive(-0.00121 + 0.00379 * Math.log(age) + 0.00118 * ht * ht);
  } // dead 0.25 to 1 inch

  function deadSmallLoad(age, cover) {
    return positive(-0.00775 + 0.00021 * cover + 0.00007 * age * age);
  } // dead foliage

  function deadFoliageLoad(age, cover) {
    return 0.00221 * Math.pow(age, 0.51263) * Math.exp(0.02482 * cover);
  } // L layer

  function deadLitterLoad(age, basalArea) {
    return (0.03632 + 0.0005336 * basalArea) * (1.0 - Math.pow(0.25, age));
  }
  function fuelDepth$1(ht) {
    return Math.max(0.01, 2.0 * ht / 3.0);
  } // live 0 to 0.25 inch

  function liveFineLoad(age, ht) {
    return positive(0.00546 + 0.00092 * age + 0.00212 * ht * ht);
  } // live 0.25 to 1 inch

  function liveSmallLoad(age, ht) {
    return positive(-0.02128 + 0.00014 * age * age + 0.00314 * ht * ht);
  } // live foliage

  function liveFoliageLoad(age, cover, ht) {
    return positive(-0.0036 + 0.00253 * age + 0.00049 * cover + 0.00282 * ht * ht);
  }

  var PalmettoGallberryFuel = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deadFineLoad: deadFineLoad,
    deadSmallLoad: deadSmallLoad,
    deadFoliageLoad: deadFoliageLoad,
    deadLitterLoad: deadLitterLoad,
    fuelDepth: fuelDepth$1,
    liveFineLoad: liveFineLoad,
    liveSmallLoad: liveSmallLoad,
    liveFoliageLoad: liveFoliageLoad
  });

  /**
   * @file Exported WFSP equations for spotting distance from a burning pile,
   * torching trees, and surface fire as implemented by BehavePlus V6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins
   * @license MIT
   */
  // Spot distance terrain location parameters
  var Location = {
    midslopeWindward: {
      factor: 0,
      label: 'Midslope, Windward'
    },
    valleyBottom: {
      factor: 1,
      label: 'Valley Bottom'
    },
    midslopeLeeward: {
      factor: 2,
      label: 'Midslope, Leeward'
    },
    ridgeTop: {
      factor: 3,
      label: 'Ridge Top'
    }
  };
  var locations = function locations() {
    return Object.keys(Location);
  };
  /**
   * Torching tree spotting distance supported species parameters
   *
   * The primary key is the 4-5 character FOFEM5 genus-species code.
   * The tree species properties are:
   * - common: common name,
   * - scientific: scientific name,
   * - height: flame height computation parameter,
   * - duration: flame duration computation parameter,
   */

  var TorchingTreeSpecies = ['ABBA', 'ABGR', 'ABLA', 'PICO', 'PIEC2', 'PIEL', 'PIEN', 'PIMO3', 'PIPA2', 'PIPO', 'PISE', 'PITA', 'PSME', 'TSHE', 'LAOC', 'THPL'];
  var TorchingSteadyFlame = {
    ABBA: {
      common: 'balsam fir',
      scientific: 'Abies balsamea',
      height: [16.5, 0.515],
      duration: [10.7, -0.278]
    },
    ABGR: {
      common: 'grand fir',
      scientific: 'Abies grandis',
      height: [16.5, 0.515],
      duration: [10.7, -0.278]
    },
    ABLA: {
      common: 'subalpine fir',
      scientific: 'Abies lasiocarpa',
      height: [15.7, 0.451],
      duration: [10.7, -0.278]
    },
    PICO: {
      common: 'lodgepole pine',
      scientific: 'Pinus contorta',
      height: [12.9, 0.453],
      duration: [12.6, -0.256]
    },
    PIEC2: {
      common: 'shortleaf pine',
      scientific: 'Pinus echinata',
      height: [2.71, 1.0],
      duration: [7.91, -0.344]
    },
    PIEL: {
      common: 'slash pine',
      scientific: 'Pinus elliottii',
      height: [2.71, 1.0],
      duration: [11.9, -0.389]
    },
    PIEN: {
      common: 'Engelmann spruce',
      scientific: 'Picea engelmannii',
      height: [15.7, 0.451],
      duration: [12.6, -0.256]
    },
    PIMO3: {
      common: 'western white pine',
      scientific: 'Pinus monticola',
      height: [12.9, 0.453],
      duration: [10.7, -0.278]
    },
    PIPA2: {
      common: 'longleaf pine',
      scientific: 'Pinus palustrus',
      height: [2.71, 1.0],
      duration: [11.9, -0.389]
    },
    PIPO: {
      common: 'ponderosa pine',
      scientific: 'Pinus ponderosa',
      height: [12.9, 0.453],
      duration: [12.6, -0.256]
    },
    PISE: {
      common: 'pond pine',
      scientific: 'Pinus serotina',
      height: [2.71, 1.0],
      duration: [7.91, -0.344]
    },
    PITA: {
      common: 'loblolly pine',
      scientific: 'Pinus taeda',
      height: [2.71, 1.0],
      duration: [13.5, -0.544]
    },
    PSME: {
      common: 'Douglas-fir',
      scientific: 'Pseudotsuga menziesii',
      height: [15.7, 0.451],
      duration: [10.7, -0.278]
    },
    TSHE: {
      common: 'western hemlock',
      scientific: 'Tsuga heterophylla',
      height: [15.7, 0.451],
      duration: [6.3, -0.249]
    },
    // This is an estimated guess,
    // using the height parms used by PICO, PIPO, and PIMO3
    // and the duration parms used by TSHE
    LAOC: {
      common: 'western larch',
      scientific: '"Larix occidentalis (guess)',
      height: [12.9, 0.453],
      duration: [6.3, -0.249]
    },
    // This is an estimated guess,
    // using the height parms used by ABLA, PIEN, PSME, and TSHE
    // and the duration parms used by PICO, PIEN, and PIPO
    THPL: {
      scientific: 'Thuja plicata',
      common: 'western red cedar (guess)',
      height: [15.7, 0.451],
      duration: [12.6, -0.256]
    }
  };
  /**
   * Adjusts down-wind canopy height based upon down-wind canopy cover
   * Added in BP6 by Issue #028FAH - Downwind Canopy Open/Closed
   *
   * @param {real} downWindCoverHt (ft+1)
   * @param {real} downWindCanopyIsOpen TRUE if down-wind canopy is open
   */

  function appliedDownWindCoverHt(downWindCoverHt, downWindCanopyIsOpen) {
    return downWindCanopyIsOpen ? 0.5 * downWindCoverHt : downWindCoverHt;
  }
  /**
   * \brief Calculates maximum firebrand height (ft+1)
   * from a burning pile
   *
   * \param flameHt Flame height (ft+1) from the burning pile
   * \return Maximum firebrand height (ft+1) from a burning pile
   */

  function burningPileFirebrandHt(flameHt) {
    return Math.max(0.0, 12.2 * flameHt);
  }
  /**
   * \brief Calculates minimum value of cover height
   * used in calculation of flat terrain spotting distance
   * using logarithmic variation with height.
   *
   * Used for burning pile and surface fire spotting distances.
   *
   * \param firebrandHt Maximum firebrand height (ft+1)
   * \param appliedDownWindCoverHt Adjusted down-wind canopy height
   *   based upon down-wind canopy cover (ft+1)
   * \return Minimum value of cover ht (ft+1) used in calculation
   * of flat terrain spotting distance.
   */

  function criticalCoverHt(firebrandHt, appliedDownWindCoverHt) {
    var criticalHt = firebrandHt > 0 ? 2.2 * Math.pow(firebrandHt, 0.337) - 4 : 0;
    return Math.max(appliedDownWindCoverHt, criticalHt);
  }
  /**
   * \brief Calculates maximum spotting distance over flat terrain
   * for burning piles, torching trees, and surface fires.
   *
   * \param firebrandHt Maximum firebrand height (ft+1)
   * \param criticalCoverHt Downwind tree/vegetation cover height (ft)
   * \param u20 Wind speed at 20 ft (ft+1 min-1)
   *
   * \return Maximum spotting distance (ft+1) over flat terrain
   */

  function distanceFlatTerrain(firebrandHt, criticalCoverHt, u20) {
    // Wind speed must be converted to mi/h
    return criticalCoverHt <= 0 ? 0 : 5280 * 0.000718 * (u20 / 88) * Math.sqrt(criticalCoverHt) * (0.362 + Math.sqrt(firebrandHt / criticalCoverHt) / 2 * Math.log(firebrandHt / criticalCoverHt));
  }
  function distanceFlatTerrainWithDrift(flatDistance, drift) {
    return flatDistance + drift;
  }
  /*
   * \brief Calculates maximum spotting distance adjusted for mountain terrain.
   *
   * \param flatDistFt Maximum spotting distance over flat terrain (ft+1).
   * \param locationKey location property name
   *  ('midslopeWindward', 'valleyBottom', 'midslopeLeeward', 'ridgetop').
   * \param rvDist Horizontal distance from ridge top to valley bottom (ft+1).
   * \param rvElev Vertical distance from ridge top to valley bottom (ft+1).
   *
   * \return Maximum spotting distance (ft+1) over mountainous terrain
   */

  function distanceMountainTerrain(flatDistFt, locationKey, rvDistFt, rvElev) {
    var flatDist = flatDistFt / 5280;
    var rvDist = rvDistFt / 5280;
    var mtnDist = flatDist;

    if (rvElev > 0 && rvDist > 0) {
      var a1 = flatDist / rvDist;
      var b1 = rvElev / (10 * Math.PI) / 1000;
      var factor = Location[locationKey].factor;
      var x = a1;

      for (var i = 0; i < 6; i++) {
        x = a1 - b1 * (Math.cos(Math.PI * x - factor * Math.PI / 2) - Math.cos(factor * Math.PI / 2));
      }

      mtnDist = x * rvDist;
    }

    return mtnDist * 5280;
  }
  /**
   * \brief Calculates critical down-wind cover height (ft+1)
   * for a surface fire.
   *
   * \param firebrandHt Maximum firebrand height (ft+1)
   * \param appliedDownWindCoverHt Adjusted down-wind canopy height
   *   based upon down-wind canopy cover (ft+1)
   * \return Critical down-wind cover height (ft+1)
   */

  function surfaceFireCriticalCoverHt(firebrandHt, appliedDownWindCoverHt) {
    return criticalCoverHt(firebrandHt, appliedDownWindCoverHt);
  }
  /**
   * Calculates surface fire firebrand down-wind drift distance (ft+1).
   * @param {real} firebrandHt  Firebrand loft hight (ft+1)
   * @param {real} u20 Wind speed at 20-ft (ft+1 min-1).
   */

  function surfaceFireFirebrandDrift(firebrandHt, u20) {
    return firebrandHt <= 0 ? 0 : 5280 * 0.000278 * (u20 / 88) * Math.pow(firebrandHt, 0.643);
  }
  /**
   * \brief Calculates maximum firebrand height (ft+1) from a surface fire
   *
   * \param firelineIntensity Surface fireline intensity (btu+1 ft-1 s-1)
   * \param u20 Wind speed at 20-ft (ft+1 min-1)
   *
   * \return Maximum firebrand height (ft+1)
   */

  function surfaceFireFirebrandHt(firelineIntensity, u20) {
    if (u20 > 0 && firelineIntensity > 0) {
      // f is a function relating thermal energy to windspeed.
      var f = 322 * Math.pow(0.474 * (u20 / 88), -1.01); // Initial firebrand height (ft).

      var product = f * firelineIntensity;
      return product <= 0 ? 0 : 1.055 * Math.sqrt(product);
    }

    return 0;
  }
  /**
   * Torching trees firebrand ht (ft+1)
   *
   * \param treeHt Tree height (ft+1) of the torching trees
   * \param flameHt Steady flame height (ft+1) of the toching trees
   *  as calculated by torchingTreesSteadyFlameHt()
   * \param flameDur Steady flame duration (min+1) of the toching trees
   *  as calculated by torchingTreesSteadyFlameDuration()
   *
   * \return Maximum firebrand height (ft+1)
   */

  function torchingTreesFirebrandHt(treeHt, flameHt, flameDur) {
    var parms = [{
      a: 4.24,
      b: 0.332
    }, {
      a: 3.64,
      b: 0.391
    }, {
      a: 2.78,
      b: 0.418
    }, {
      a: 4.7,
      b: 0.0
    }];
    var ratio = flameHt <= 0 ? 0 : treeHt / flameHt;
    var idx = 3;

    if (ratio >= 1) {
      idx = 0;
    } else if (ratio >= 0.5) {
      idx = 1;
    } else if (flameDur < 3.5) {
      idx = 2;
    }

    return parms[idx].a * Math.pow(flameDur, parms[idx].b) * flameHt + 0.5 * treeHt;
  }
  /**
   * \brief Calculates steady state flame duration (min+1) of the toching trees
   *
   * \param species Species label of the torching trees
   * \param dbh Dbh of the torching trees (in+1)
   * \param trees Number of torching trees
   *
   * \return Flame duration (min+1) of torching trees
   */

  function torchingTreesSteadyFlameDuration(species, dbh, trees) {
    return TorchingSteadyFlame[species].duration[0] * Math.pow(dbh, TorchingSteadyFlame[species].duration[1]) * Math.pow(trees, -0.2);
  }
  /**
   * \brief Calculates steady state flame height (ft+1) of the torching trees
   *
   * \param species Species label of the torching trees
   * \param dbh Dbh (in+1) of the torching trees
   * \param trees Number of torching trees
   * \return Steady state flame height (ft+1) of the torching trees
   */

  function torchingTreesSteadyFlameHt(species, dbh, trees) {
    return TorchingSteadyFlame[species].height[0] * Math.pow(dbh, TorchingSteadyFlame[species].height[1]) * Math.pow(trees, 0.4);
  }

  var Spotting = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Location: Location,
    locations: locations,
    TorchingTreeSpecies: TorchingTreeSpecies,
    TorchingSteadyFlame: TorchingSteadyFlame,
    appliedDownWindCoverHt: appliedDownWindCoverHt,
    burningPileFirebrandHt: burningPileFirebrandHt,
    criticalCoverHt: criticalCoverHt,
    distanceFlatTerrain: distanceFlatTerrain,
    distanceFlatTerrainWithDrift: distanceFlatTerrainWithDrift,
    distanceMountainTerrain: distanceMountainTerrain,
    surfaceFireCriticalCoverHt: surfaceFireCriticalCoverHt,
    surfaceFireFirebrandDrift: surfaceFireFirebrandDrift,
    surfaceFireFirebrandHt: surfaceFireFirebrandHt,
    torchingTreesFirebrandHt: torchingTreesFirebrandHt,
    torchingTreesSteadyFlameDuration: torchingTreesSteadyFlameDuration,
    torchingTreesSteadyFlameHt: torchingTreesSteadyFlameHt
  });

  /**
   * @file Class of export function surface fire methods per Rothermel 1972.
   *
   * Library of algorithms implementing the Rothermel (1972) mathematical model
   * of surface fire spread rate and direction of maximum spread from upslope.
   *
   * It also includes a few of the fundamental Byram and Thomas equations for
   * fireline intensity, flame length, and scorch height.  All equations
   * relating to fire elliptical growth are in BpxLibFireEllipse.
   *
   * All algorithms in this class are implemented as pure export function methods,
   * returning a single property.
   *
   * @author Collin D. Bevins <cbevins@montana.com>
   * @copyright 2019 Systems for Environmental Management
   * @license MIT
   **/
  function arithmeticMeanSpreadRate(cover1, ros1, ros2) {
    return cover1 * ros1 + (1 - cover1) * ros2;
  }
  /**
   * Calculate the `effective wind speed` of a combined slope-plus-wind spread rate coefficient.
   *
   * The `effective` wind speed is the theoretical wind speed that yields the same
   * spread rate coefficient as the combined slope-plus-wind spread rate coefficient.
   *
   * @param phiew The sum of the slope and wind coefficients.
   * @param windB Fuel bed wind factor B.
   * @param windI Fuel bed wind factor I.
   * @return The effective wind speed for the slope-plus-wind coefficient (ft+1 min-1).
   */

  function effectiveWindSpeed(phiew, windB, windI) {
    var ews = 0;

    if (phiew > 0 && windB > 0 && windI > 0) {
      var a = phiew * windI;
      var b = 1.0 / windB;
      ews = Math.pow(a, b);
    }

    return ews;
  }
  /**
   * Calculate the effective wind speed (ft+1 min-1) from the length-to-width ratio.
   *
   * This uses Anderson's (1983) equation.
   *
   * @param lwr The fire ellipse length-to-width ratio (ratio).
   * @return The effective wind speed (ft+1 min-1).
   */

  function effectiveWindSpeedFromLwr(lwr) {
    return 88 * (4 * (lwr - 1));
  }
  /**
   * Calculate the maximum effective wind speed limit
   * as per Rothermel (1972) equation 86 on page 33.
   *
   * @param rxi Fire reaction intensity (btu+1 ft-2 min-1).
   * @return The maximum effective wind speed limit (ft+1 min-1).
   */

  function effectiveWindSpeedLimit(rxi) {
    return 0.9 * rxi;
  }
  function expectedValueSpreadRateMOCK(cover1, ros1, ros2) {
    return 0.5 * (arithmeticMeanSpreadRate(cover1, ros1, ros2) + harmonicMeanSpreadRate(cover1, ros1, ros2));
  }
  /**
   * Calculate the fire heading direction (degrees clockwise from north).
   *
   * @param upslopeFromNorth Upslope direction (degrees clockwise from north).
   * @param headingFromUpslope Fire heading direction (degrees clockwise from the upslope direction).
   * @return The fire heading direction (degrees clockwise from north).
   */
  // export function headingFromNorth(upslopeFromNorth, headingFromUpslope) {
  //   return compass.constrain(upslopeFromNorth + headingFromUpslope)
  // }

  /**
   * Calculate the fireline intensity (btu+1 ft-1 s-1) from spread rate,
   * reaction intensity, and residence time.
   *
   * @param ros The fire spread rate (ft+1 min-1).
   * @param rxi The reaction intensity (btu+1 ft-2 min-1).
   * @param taur The flame residence time (min+1)
   * @return The fireline intensity (btu+1 ft-1 s-1).
   */

  function firelineIntensity(ros, rxi, taur) {
    return ros * rxi * taur / 60;
  }
  /**
   * Calculate the fireline intensity (btu+1 ft-1 s-1) from flame length.
   *
   * @param flame The flame length (ft+1).
   * @return The fireline intensity (btu+1 ft-1 s-1).
   */

  function firelineIntensityFromFlameLength(flame) {
    return flame <= 0 ? 0 : Math.pow(flame / 0.45, 1 / 0.46);
  }
  /**
   * Calculate Byram's (1959) flame length (ft+1) given a fireline intensity.
   *
   * @param fli Fireline intensity (btu+1 ft-1 s-1).
   * @return Byram's (1959) flame length (ft+1).
   */

  function flameLength(fli) {
    return fli <= 0 ? 0 : 0.45 * Math.pow(fli, 0.46);
  }
  function harmonicMeanSpreadRate(cover1, ros1, ros2) {
    return 1 / (cover1 / ros1 + (1 - cover1) / ros2);
  }
  /**
   * Calculate the fire ellipse length-to-width ratio from the
   * effective wind speed (ft+1 min-1).
   *
   * This uses Anderson's (1983) equation.
   *
   * @param effectiveWindSpeed The effective wind speed (ft+1 min-1).
   * @return The fire ellipse length-to-width ratio (ratio).
   */

  function lengthToWidthRatio$1(effectiveWindSpeed) {
    // Wind speed MUST be in miles per hour
    return 1 + 0.25 * (effectiveWindSpeed / 88);
  }
  /**
   * Calculate the maximum fire spread rate under slope & wind conditions.
   *
   * @param ros0 No-wind, no-slope spread rate (ft+1 min-1).
   * @param phiEw Rothermel's (1972) `phiEw` wind-slope coefficient (ratio).
   * @return The maximum fire spread rate (ft+1 min-1).
   */

  function maximumSpreadRate(ros0, phiEw) {
    return ros0 * (1 + phiEw);
  }
  /**
   * Calculate the wind-slope coefficient (phiEw = phiW + phiS)
   * from the individual slope (phiS) and wind (phiW) coefficients.
   *
   * @param phiW Rothermel (1972) wind coefficient `phiW` (ratio)
   * @param phiS Rothermel (1972) slope coefficient `phiS` (ratio)
   * @return Rothermel's (1972) wind-slope coefficient `phiEw` (ratio).
   */

  function phiEffectiveWind(phiW, phiS) {
    return phiW + phiS;
  }
  /**
   * Calculate the wind-slope coefficient (phiEw = phiW + phiS)
   * from the no-wind, no-slope spread rate and an actual spread rate.
   *
   * There are 3 ways to calculate the wind-slope coefficient `phiEw`:
   * - from `phiS` and `phiW`: see phiEw(phiS,phiW)
   * - from `ros0` and `rosHead`: see phiEwInferred(ros0,rosHead)
   * - from `ews`, `windB`, and `windK`: see phiEwFromEws(ews, windB, windK)
   *
   * @param ros0 No-wind, no-slope spread rate (ft+1 min-1).
   * @param rosHead The actual spread rate (ft+1 min-1) at the fire head
   *    (possibly under cross-slope wind conditions).
   * @return Rothermel's (1972) wind-slope coefficient `phiEw` (ratio).
   */

  function phiEffectiveWindInferred(ros0, rosHead) {
    return ros0 <= 0 ? 0 : rosHead / ros0 - 1;
  }
  /**
   * Calculate the wind-slope coefficient (phiEw = phiW + phiS)
   * from the effective wind speed.
   *
   * There are 3 ways to calculate the wind-slope coefficient `phiEw`:
   * - from `phiS` and `phiW`: see phiEw(phiS,phiW)
   * - from `ros0` and `rosHead`: see phiEwInferred(ros0,rosHead)
   * - from `ews`, `windB`, and `windK`: see phiEwFromEws(ews, windB, windK)
   *
   * @param ews The theoretical wind speed that produces
   *  the same spread rate coefficient as the current slope-wind combination.
   * @param windB
   * @param windK
   * @return Rothermel's (1972) wind-slope coefficient `phiEw` (ratio).
   */

  function phiEwFromEws(ews, windB, windK) {
    return ews <= 0 ? 0 : windK * Math.pow(ews, windB);
  }
  /** Calculate the fire spread rate slope coefficient (ratio).
   *
   * This returns Rothermel's (1972) `phiS' as per equation 51 (p 24, 26).
   *
   * @param slopeRatio Slope steepness ratio (vertical rise / horizontal reach).
   * @param slopeK Fuel Bed slope factor.
   * @return The fire spread rate slope coefficient (ratio).
   */

  function phiSlope(slopeRatio, slopeK) {
    return slopeK * slopeRatio * slopeRatio;
  }
  /** Calculate the fire spread rate wind coefficient (ratio).
   *
   * This returns Rothermel's (1972) `phiW' as per equation 47 (p 23, 26).
   *
   * @param midflameWind Wind speed at midflame height (ft+1 min-1).
   * @param windB Fuel Bed wind factor `B`.
   * @param windK Fuel Bed wind factor `K`.
   * @return The fire spread rate wind coefficient (ratio).
   */

  function phiWind(midflameWind, windB, windK) {
    return midflameWind <= 0 ? 0 : windK * Math.pow(midflameWind, windB);
  }
  /**
   * Calculate the maximum fire spread rate under cross-slope wind conditions.
   *
   * If the wind is blowing up-slope (or, if there is no slope, or if there is no wind),
   * then spreadRateMaximumUpSlopeWind() == spreadRateMaximumCrossSlopeWind().
   *
   * @param ros0 No-wind, no-slope spread rate (ft+1 min-1).
   * @param spreadDirVectorRate Additional spread reate (ft+1 min-1)
   *    along the cross-slope vector of maximum spread.
   * @return The maximum fire spread rate (ft+1 min-1).
   */

  function spreadRateWithCrossSlopeWind(ros0, spreadDirVectorRate) {
    return ros0 + spreadDirVectorRate;
  }
  /**
   * Calculate the maximum spread rate after applying the effective wind speed limit.
   *
   * If the effective wind speed does not exceed the limit,
   * then spreadRateMaximumCrossSlopeWind() == spreadRateMaximumEffectiveWindSpeedLimitApplied().
   *
   * @param ros0 The no-wind, no-slope spread rate (ft+1 min-1).
   * @param phiEwLimited Rothermel's (1972) `phiEw` wind-slope coefficient (ratio)
   * AFTER applying the effective wind speed limit.
   */
  // export function rosMaxEwslApplied(ros0, phiEwLimited) {
  //   return ros0 * (1 + phiEwLimited)
  // }

  /**
   * Calculate the maximum spread rate after applying the effective wind speed upper limit.
   *
   * If the spread rate exceeds the effective wind speed
   * AND the effective wind speed exceeds 1 mph, then the
   * spread rate is reduced back to the effective wind speed.
   *
   * @param rosMax The fire maximum spread rate (ft+1 min-1)
   * @param ews The effective wind speed (ft+1 min-1).
   * @return The maximum spread rate (ft+1 min-1) after applying any effective wind speed limit.
   */

  function spreadRateWithRosLimitApplied(rosMax, ews) {
    return rosMax > ews && ews > 88 ? ews : rosMax;
  }
  /**
   * Calculate the scorch height (ft+1) estimated from Byram's fireline
   * intensity, wind speed, and air temperature.
   *
   * @param fli Byram's fireline intensity (btu+1 ft-1 s-1).
   * @param windSpeed Wind speed (ft+1 min-1).
   * @param airTemp (oF).
   * @return The scorch height (ft+1).
   */

  function scorchHeight(fli, windSpeed, airTemp) {
    var mph = windSpeed / 88;
    return fli <= 0 ? 0 : 63 / (140 - airTemp) * Math.pow(fli, 1.166667) / Math.sqrt(fli + mph * mph * mph);
  }
  /**
   * Calculate the scorch height (ft+1) estimated from flame length,
   * wind speed, and air temperature.
   *
   * @param flame Flame length (ft+1).
   * @param windSpeed Wind speed (ft+1 min-1).
   * @param airTemp (oF).
   * @return The scorch height (ft+1)
   */

  function scorchHtFromFlame(flame, windSpeed, airTemp) {
    var fli = firelineIntensityFromFlameLength(flame);
    return scorchHeight(fli, windSpeed, airTemp);
  }
  /**
   * Calculate the direction of maximum spread as degrees clockwise from up-slope.
   *
   * @param xComp Vector x-component returned by spreadDirectionXComponent()
   * @param yComp Vector y-component as returned by spreadDirectionYComponent().
   * @param rosv Spread rate in the vector of maximum spread (ft+1 min-1).
   * @return The direction of maximum fire spread (degrees from upslope)
   */

  function spreadDirectionFromUpslope(xComp, yComp, rosv) {
    var pi = Math.PI;
    var al = rosv <= 0 ? 0 : Math.asin(Math.abs(yComp) / rosv);
    var radians = xComp >= 0 ? yComp >= 0 ? al : pi + pi - al : yComp >= 0 ? pi - al : pi + al;
    var degrees = radians * 180 / pi;
    return degrees;
  }
  /**
   * Calculate the slope contribution to the spread rate.
   *
   * @param ros0 No-wind, no-wlope fire spread rate (ft+1 min-1)
   * @param phiS Slope coefficient (factor)
   * @return The slope contribution to the fire spread rate (ft+1 min-1)
   */

  function maximumDirectionSlopeSpreadRate(ros0, phiS) {
    return ros0 * phiS;
  }
  /**
   * Calculate the wind contribution to the spread rate.
   *
   * @param ros0 No-wind, no-wlope fire spread rate (ft+1 min-1)
   * @param phiW Wind coefficient (factor)
   * @return The wind contribution to the fire spread rate (ft+1 min-1)
   */

  function maximumDirectionWindSpreadRate(ros0, phiW) {
    return ros0 * phiW;
  }
  /**
   * Calculate the additional spread rate (ft+1 min-1) in the direction of maximum
   * spread under cross-slope wind condtions.
   *
   * @param xComp Vector x-component returned by spreadDirXComp()
   * @param yComp Vector y-component as returned by spreadDirYComp().
   * @return Cross wind - cross slope spread rate (ft+1 min-1)
   */

  function maximumDirectionSpreadRate(xComp, yComp) {
    return Math.sqrt(xComp * xComp + yComp * yComp);
  }
  /**
   * Calculate the x-component of the spread rate vector under cross-slope wind conditions.
   *
   * @param windRate
   * @param slopeRate
   * @param windHdgAzUp Wind heading in degrees clockwise from the up-slope direction.
   */

  function maximumDirectionXComponent(windRate, slopeRate, windHdgAzUp) {
    var radians = windHdgAzUp * Math.PI / 180;
    return slopeRate + windRate * Math.cos(radians);
  }
  /**
   * Calculate the y-component of the spread rate vector under cross-slope wind conditions.
   *
   * @param windRate
   * @param windHdgAzUp Wind heading in degrees clockwise from the up-slope direction.
   */

  function maximumDirectionYComponent(windRate, windHdgAzUp) {
    var radians = windHdgAzUp * Math.PI / 180;
    return windRate * Math.sin(radians);
  }
  /**
   * Calculates the midflame wind speed required to attain a target fire spread rate.
   *
   * @param rosTarget Target fire spread rate (ft+1 min-1)
   * @param ros0 The fuel bed no-wind, no-slope fire spread rate (ft+1 min-1)
   * @param windB The fuel bed wind factor B
   * @param windK The fuel bed wind factor K
   * @param phiS The fuel bed slope coefficient (phi slope)
   * @return The midflame wind speed (ft+1 min-1) required to attain the target fire spread rate.
   */
  // export function windSpeedAtRosTarget(rosTarget, ros0, windB, windK, phiS) {
  //   if (ros0 <= 0 || windK <= 0) {
  //     return 0
  //   }
  //   const numerator = (rosTarget / ros0) - 1 - phiS
  //   const term = numerator / windK
  //   return Math.pow(term, (1/windB))
  // }

  /**
   * Calculates the midflame wind speed required to attain a target fire spread rate.
   *
   * @param rosTarget Target fire spread rate (ft+1 min-1)
   * @param ros0 The fuel bed no-wind, no-slope fire spread rate (ft+1 min-1)
   * @param beta The fuel bed packing ratio
   * @param bedSavr The fuel bed characteristic surface area-to-volume ratio (ft-1)
   * @param slopeRatio The fuel bed slope (ratio)
   * @return The midflame wind speed (ft+1 min-1) required to attain the target fire spread rate.
   */
  // export function windSpeedAtRosTarget2(rosTarget, ros0, beta, bedSavr, slopeRatio) {
  //   const windB = BpxLibFuelBed.windB(bedSavr)
  //   const windC = BpxLibFuelBed.windC(bedSavr)
  //   const windE = BpxLibFuelBed.windE(bedSavr)
  //   const betaOpt = BpxLibFuelBed.beto(bedSavr)
  //   const betaRatio = beta / betaOpt
  //   const windK = BpxLibFuelBed.windK(betaRatio, windE, windC)
  //   const slopeK = BpxLibFuelBed.slopeK(beta)
  //   const phiS = BpxLibSurfaceFire.phiS(slopeRatio, slopeK)
  //   return BpxLibSurfaceFire.windSpeedAtRosTarget(rosTarget, ros0, windB, windK, phiS)
  // }

  var SurfaceFire = /*#__PURE__*/Object.freeze({
    __proto__: null,
    arithmeticMeanSpreadRate: arithmeticMeanSpreadRate,
    effectiveWindSpeed: effectiveWindSpeed,
    effectiveWindSpeedFromLwr: effectiveWindSpeedFromLwr,
    effectiveWindSpeedLimit: effectiveWindSpeedLimit,
    expectedValueSpreadRateMOCK: expectedValueSpreadRateMOCK,
    firelineIntensity: firelineIntensity,
    firelineIntensityFromFlameLength: firelineIntensityFromFlameLength,
    flameLength: flameLength,
    harmonicMeanSpreadRate: harmonicMeanSpreadRate,
    lengthToWidthRatio: lengthToWidthRatio$1,
    maximumSpreadRate: maximumSpreadRate,
    phiEffectiveWind: phiEffectiveWind,
    phiEffectiveWindInferred: phiEffectiveWindInferred,
    phiEwFromEws: phiEwFromEws,
    phiSlope: phiSlope,
    phiWind: phiWind,
    spreadRateWithCrossSlopeWind: spreadRateWithCrossSlopeWind,
    spreadRateWithRosLimitApplied: spreadRateWithRosLimitApplied,
    scorchHeight: scorchHeight,
    scorchHtFromFlame: scorchHtFromFlame,
    spreadDirectionFromUpslope: spreadDirectionFromUpslope,
    maximumDirectionSlopeSpreadRate: maximumDirectionSlopeSpreadRate,
    maximumDirectionWindSpreadRate: maximumDirectionWindSpreadRate,
    maximumDirectionSpreadRate: maximumDirectionSpreadRate,
    maximumDirectionXComponent: maximumDirectionXComponent,
    maximumDirectionYComponent: maximumDirectionYComponent
  });

  /**
   * @file Exported WFSP tree mortality data as implemented by BehavePlus V6 and FOFEM v6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */
  // ------------------------------------------------------------------------------
  //  FOFEM tree species and equations
  //  These are used in the bark thickness and tree mortality functions.
  //
  //  NOTE: FOFEM v6 introduced new species codes for all species, and also
  // introduced 13 new species and dropped 2 other species.
  //
  // The FOFEM 6 genus-species abbreviations are the object key.
  //  The species object properties are:
  //  - 'fofem5' FOFEM 5 genus-species codes (deprecated),
  //  - 'mortEq' Index to mortality equation (base 1): 1, 3, and 10-20
  //      - Through BP5, there were only mortality equations 1 and 3.
  //      - BP6 introduces mortality equations 10 through 20.
  //  - 'barkEq' Index to single bark thickness equation (base 1)
  //  - 'regions' Region list (any combination of 1, 2, 3, and/or 4, where
  //      - 1 = Interior West,
  //      - 2 = Pacific West,
  //      - 3 = NorthEast,
  //      - 4 = SouthEast).
  //  - 'scientific' Scientific name
  //  - 'common' Common name
  // ------------------------------------------------------------------------------
  // Fofem factors for determining Single Bark Thickness.
  // Each FOFEM species has a SBT equation index "barkEq" [1-39] into this array.
  var fofemSingleBarkThicknessFactor = [
  /* 00 */
  0.0, // Not used

  /* 01 */
  0.019, // Not used

  /* 02 */
  0.022,
  /* 03 */
  0.024,
  /* 04 */
  0.025,
  /* 05 */
  0.026,
  /* 06 */
  0.027,
  /* 07 */
  0.028,
  /* 08 */
  0.029,
  /* 09 */
  0.03,
  /* 10 */
  0.031,
  /* 11 */
  0.032,
  /* 12 */
  0.033,
  /* 13 */
  0.034,
  /* 14 */
  0.035,
  /* 15 */
  0.036,
  /* 16 */
  0.037,
  /* 17 */
  0.038,
  /* 18 */
  0.039,
  /* 19 */
  0.04,
  /* 20 */
  0.041,
  /* 21 */
  0.042,
  /* 22 */
  0.043,
  /* 23 */
  0.044,
  /* 24 */
  0.045,
  /* 25 */
  0.046,
  /* 26 */
  0.047,
  /* 27 */
  0.048,
  /* 28 */
  0.049,
  /* 29 */
  0.05,
  /* 30 */
  0.052,
  /* 31 */
  0.055,
  /* 32 */
  0.057, // Not used

  /* 33 */
  0.059,
  /* 34 */
  0.06,
  /* 35 */
  0.062,
  /* 36 */
  0.063, // Changed from 0.065 to 0.063 in Build 606

  /* 37 */
  0.068,
  /* 38 */
  0.072,
  /* 39 */
  0.081,
  /* 40 */
  0.0 // Reserved for Pinus palustrus (longleaf pine)
  ];
  var data = {
    ABAM: {
      fofem5: 'ABIAMA',
      mortEq: 1,
      barkEq: 26,
      regions: 2,
      scientific: 'Abies amabilis',
      common: 'Pacific silver fir'
    },
    ABBA: {
      fofem5: 'ABIBAL',
      mortEq: 1,
      barkEq: 10,
      regions: 134,
      scientific: 'Abies balsamea',
      common: 'Balsam fir'
    },
    ABCO: {
      fofem5: 'ABICON',
      mortEq: 10,
      barkEq: 27,
      regions: 12,
      scientific: 'Abies concolor',
      common: 'White fir'
    },
    ABGR: {
      fofem5: 'ABIGRA',
      mortEq: 11,
      barkEq: 25,
      regions: 12,
      scientific: 'Abies grandis',
      common: 'Grand fir'
    },
    ABLA: {
      fofem5: 'ABILAS',
      mortEq: 11,
      barkEq: 20,
      regions: 12,
      scientific: 'Abies lasiocarpa',
      common: 'Subalpine fir'
    },
    ABMA: {
      fofem5: 'ABIMAG',
      mortEq: 16,
      barkEq: 18,
      regions: 12,
      scientific: 'Abies magnifica',
      common: 'Red fir'
    },
    ABPR: {
      fofem5: 'ABIPRO',
      mortEq: 1,
      barkEq: 24,
      regions: 2,
      scientific: 'Abies procera',
      common: 'Noble fir'
    },
    ABISPP: {
      fofem5: 'ABISPP',
      mortEq: 1,
      barkEq: 30,
      regions: 34,
      scientific: 'Abies species',
      common: 'Firs'
    },
    ACBA3: {
      fofem5: 'ACEBAR',
      mortEq: 1,
      barkEq: 8,
      regions: 4,
      scientific: 'Acer barbatum',
      common: 'Southern sugar maple'
    },
    ACLE: {
      fofem5: 'ACELEU',
      mortEq: 1,
      barkEq: 8,
      regions: 4,
      scientific: 'Acer leucoderme',
      common: 'Chalk maple'
    },
    ACMA3: {
      fofem5: 'ACEMAC',
      mortEq: 1,
      barkEq: 3,
      regions: 2,
      scientific: 'Acer macrophyllum',
      common: 'Bigleaf maple'
    },
    ACNE2: {
      fofem5: 'ACENEG',
      mortEq: 1,
      barkEq: 13,
      regions: 34,
      scientific: 'Acer negundo',
      common: 'Boxelder'
    },
    ACNI5: {
      fofem5: 'ACENIG',
      mortEq: 1,
      barkEq: 14,
      regions: 34,
      scientific: 'Acer nigrum',
      common: 'Black maple'
    },
    ACPE: {
      fofem5: 'ACEPEN',
      mortEq: 1,
      barkEq: 24,
      regions: 34,
      scientific: 'Acer pensylvanicum',
      common: 'Striped maple'
    },
    ACRU: {
      fofem5: 'ACERUB',
      mortEq: 1,
      barkEq: 7,
      regions: 34,
      scientific: 'Acer rubrum',
      common: 'Red maple'
    },
    ACSA2: {
      fofem5: 'ACESACI',
      mortEq: 1,
      barkEq: 10,
      regions: 34,
      scientific: 'Acer saccharinum',
      common: 'Silver maple'
    },
    ACSA3: {
      fofem5: 'ACESACU',
      mortEq: 1,
      barkEq: 12,
      regions: 34,
      scientific: 'Acer saccharum',
      common: 'Sugar maple'
    },
    ACESPP: {
      fofem5: 'ACESPI',
      mortEq: 1,
      barkEq: 19,
      regions: 3,
      scientific: 'Acer spicatum',
      common: 'Mountain maple'
    },
    ACSP2: {
      fofem5: 'ACESPP',
      mortEq: 1,
      barkEq: 8,
      regions: 34,
      scientific: 'Acer species',
      common: 'Maples'
    },
    AEGL: {
      fofem5: 'AESGLA',
      mortEq: 1,
      barkEq: 15,
      regions: 34,
      scientific: 'Aesculus glabra',
      common: 'Ohio buckeye'
    },
    AEOC2: {
      fofem5: 'AESOCT',
      mortEq: 1,
      barkEq: 29,
      regions: 34,
      scientific: 'Aesculus octandra',
      common: 'Yellow buckeye'
    },
    AIAL: {
      fofem5: 'AILALT',
      mortEq: 1,
      barkEq: 29,
      regions: 34,
      scientific: 'Ailanthus altissima',
      common: 'Ailanthus'
    },
    ALRH2: {
      fofem5: 'ALNRHO',
      mortEq: 1,
      barkEq: 35,
      regions: 2,
      scientific: 'Alnus rhombifolia',
      common: 'White alder'
    },
    ALRU2: {
      fofem5: 'ALNRUB',
      mortEq: 1,
      barkEq: 5,
      regions: 2,
      scientific: 'Alnus rubra',
      common: 'Red alder'
    },
    AMAR3: {
      fofem5: 'AMEARB',
      mortEq: 1,
      barkEq: 29,
      regions: 34,
      scientific: 'Amelanchier arborea',
      common: 'Common serviceberry'
    },
    ARME: {
      fofem5: 'ARBMEN',
      mortEq: 1,
      barkEq: 34,
      regions: 2,
      scientific: 'Arbutus menziesii',
      common: 'Pacific madrone'
    },
    BEAL2: {
      fofem5: 'BETALL',
      mortEq: 1,
      barkEq: 10,
      regions: 34,
      scientific: 'Betula alleghaniensis',
      common: 'Yellow birch'
    },
    BELE: {
      fofem5: 'BETLEN',
      mortEq: 1,
      barkEq: 9,
      regions: 4,
      scientific: 'Betula lenta',
      common: 'Sweet birch'
    },
    BENI: {
      fofem5: 'BETNIG',
      mortEq: 1,
      barkEq: 8,
      regions: 34,
      scientific: 'Betula nigra',
      common: 'River birch'
    },
    BEOC2: {
      fofem5: 'BETOCC',
      mortEq: 1,
      barkEq: 29,
      regions: 34,
      scientific: 'Betula occidentalis',
      common: 'Water birch'
    },
    BEPA: {
      fofem5: 'BETPAP',
      mortEq: 1,
      barkEq: 6,
      regions: 234,
      scientific: 'Betula papyrifera',
      common: 'Paper birch'
    },
    BETSPP: {
      fofem5: 'BETSPP',
      mortEq: 1,
      barkEq: 12,
      regions: 234,
      scientific: 'Betula species ',
      common: 'Birches'
    },
    CEOC: {
      fofem5: 'CELOCC',
      mortEq: 1,
      barkEq: 14,
      regions: 34,
      scientific: 'Celtis occidentalis',
      common: 'Common hackberry'
    },
    CAAQ2: {
      fofem5: 'CARAQU',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Carya aquatica',
      common: 'Water hickory'
    },
    CACA18: {
      fofem5: 'CARCAR',
      mortEq: 1,
      barkEq: 9,
      regions: 34,
      scientific: 'Carpinus caroliniana',
      common: 'American hornbeam'
    },
    CACOL3: {
      fofem5: 'CARCOR',
      mortEq: 1,
      barkEq: 16,
      regions: 34,
      scientific: 'Carya cordiformis',
      common: 'Bitternut hickory'
    },
    CAGL8: {
      fofem5: 'CARGLA',
      mortEq: 1,
      barkEq: 16,
      regions: 34,
      scientific: 'Carya glabra',
      common: 'Pignut hickory'
    },
    CAIL2: {
      fofem5: 'CARILL',
      mortEq: 1,
      barkEq: 15,
      regions: 34,
      scientific: 'Carya illinoensis',
      common: 'Pecan'
    },
    CALA21: {
      fofem5: 'CARLAC',
      mortEq: 1,
      barkEq: 22,
      regions: 34,
      scientific: 'Carya laciniosa',
      common: 'Shellbark hickory'
    },
    CAOV2: {
      fofem5: 'CAROVA',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Carya ovata',
      common: 'Shagbark hickory'
    },
    CARSPP: {
      fofem5: 'CARSPP',
      mortEq: 1,
      barkEq: 23,
      regions: 34,
      scientific: 'Carya species',
      common: 'Hickories'
    },
    CATE9: {
      fofem5: 'CARTEX',
      mortEq: 1,
      barkEq: 19,
      regions: 4,
      scientific: 'Carya texana',
      common: 'Black hickory'
    },
    CATO6: {
      fofem5: 'CARTOM',
      mortEq: 1,
      barkEq: 22,
      regions: 34,
      scientific: 'Carya tomentosa',
      common: 'Mockernut hickory'
    },
    CACHM: {
      fofem5: 'CASCHR',
      mortEq: 1,
      barkEq: 24,
      regions: 2,
      scientific: 'Castanopsis chrysophylla',
      common: 'Giant chinkapin'
    },
    CADE12: {
      fofem5: 'CASDEN',
      mortEq: 1,
      barkEq: 19,
      regions: 3,
      scientific: 'Castanea dentata',
      common: 'American chestnut'
    },
    CATSPP: {
      fofem5: 'CATSPP',
      mortEq: 1,
      barkEq: 16,
      regions: 4,
      scientific: 'Catalpa species',
      common: 'Catalpas'
    },
    CELA: {
      fofem5: 'CELLAE',
      mortEq: 1,
      barkEq: 15,
      regions: 34,
      scientific: 'Celtis laevigata',
      common: 'Sugarberry'
    },
    CECA4: {
      fofem5: 'CERCAN',
      mortEq: 1,
      barkEq: 14,
      regions: 34,
      scientific: 'Cercis canadensis',
      common: 'Eastern redbud'
    },
    CHLA: {
      fofem5: 'CHALAW',
      mortEq: 1,
      barkEq: 39,
      regions: 2,
      scientific: 'Chamaecyparis lawsoniana',
      common: 'Port Orford cedar'
    },
    CHNO: {
      fofem5: 'CHANOO',
      mortEq: 1,
      barkEq: 2,
      regions: 2,
      scientific: 'Chamaecyparis nootkatenis',
      common: 'Alaska cedar'
    },
    CHTH2: {
      fofem5: 'CHATHY',
      mortEq: 1,
      barkEq: 4,
      regions: 34,
      scientific: 'Chamaecyparis thyoides',
      common: 'Atlantic white cedar'
    },
    COFL2: {
      fofem5: 'CORFLO',
      mortEq: 1,
      barkEq: 20,
      regions: 34,
      scientific: 'Cornus florida',
      common: 'Flowering dogwood'
    },
    CONU4: {
      fofem5: 'CORNUT',
      mortEq: 1,
      barkEq: 35,
      regions: 2,
      scientific: 'Cornus nuttallii',
      common: 'Pacific dogwood'
    },
    CORSPP: {
      fofem5: 'CORSPP',
      mortEq: 1,
      barkEq: 10,
      regions: 34,
      scientific: 'Cornus species',
      common: 'Dogwoods'
    },
    CRDO2: {
      fofem5: 'CRADOU',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Crataegus douglasii',
      common: 'Black hawthorn'
    },
    CRASPP: {
      fofem5: 'CRASPPW',
      mortEq: 1,
      barkEq: 35,
      regions: 2,
      scientific: 'Crataegus species (western)',
      common: 'Hawthorns (western)'
    },
    DIVI5: {
      fofem5: 'DIOVIR',
      mortEq: 1,
      barkEq: 20,
      regions: 34,
      scientific: 'Diospyros virginiana',
      common: 'Persimmon'
    },
    FAGR: {
      fofem5: 'FAGGRA',
      mortEq: 1,
      barkEq: 4,
      regions: 34,
      scientific: 'Fagus grandifolia',
      common: 'American beech'
    },
    FRAM2: {
      fofem5: 'FRAAMA',
      mortEq: 1,
      barkEq: 21,
      regions: 34,
      scientific: 'Fraxinus americana',
      common: 'White ash'
    },
    FRNI: {
      fofem5: 'FRANIG',
      mortEq: 1,
      barkEq: 14,
      regions: 34,
      scientific: 'Fraxinus nigra',
      common: 'Black ash'
    },
    FRPE: {
      fofem5: 'FRAPEN',
      mortEq: 1,
      barkEq: 18,
      regions: 34,
      scientific: 'Fraxinus pennsylvanica',
      common: 'Green ash'
    },
    FRPR: {
      fofem5: 'FRAPRO',
      mortEq: 1,
      barkEq: 16,
      regions: 34,
      scientific: 'Fraxinus profunda',
      common: 'Pumpkin ash'
    },
    FRQU: {
      fofem5: 'FRAQUA',
      mortEq: 1,
      barkEq: 9,
      regions: 34,
      scientific: 'Fraxinus quadrangulata',
      common: 'Blue ash'
    },
    FRASPP: {
      fofem5: 'FRASPP',
      mortEq: 1,
      barkEq: 21,
      regions: 34,
      scientific: 'Fraxinus species',
      common: 'Ashes'
    },
    GLTR: {
      fofem5: 'GLETRI',
      mortEq: 1,
      barkEq: 17,
      regions: 34,
      scientific: 'Gleditsia triacanthos',
      common: 'Honeylocust'
    },
    GOLA: {
      fofem5: 'GORLAS',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Gordonia lasianthus',
      common: 'Loblolly bay'
    },
    GYDI: {
      fofem5: 'GYMDIO',
      mortEq: 1,
      barkEq: 10,
      regions: 34,
      scientific: 'Gymnocladus dioicus',
      common: 'Kentucky coffeetree'
    },
    HALSPP: {
      fofem5: 'HALSPP',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Halesia species',
      common: 'Silverbells'
    },
    ILOP: {
      fofem5: 'ILEOPA',
      mortEq: 1,
      barkEq: 21,
      regions: 34,
      scientific: 'Ilex opaca',
      common: 'American holly'
    },
    JUCI: {
      fofem5: 'JUGCIN',
      mortEq: 1,
      barkEq: 20,
      regions: 34,
      scientific: 'Juglans cinerea',
      common: 'Butternut'
    },
    JUNI: {
      fofem5: 'JUGNIG',
      mortEq: 1,
      barkEq: 20,
      regions: 34,
      scientific: 'Juglans nigra',
      common: 'Black walnut'
    },
    JUOC: {
      fofem5: 'JUNOCC',
      mortEq: 1,
      barkEq: 4,
      regions: 2,
      scientific: 'Juniperus occidentalis',
      common: 'Western juniper'
    },
    JUNSPP: {
      fofem5: 'JUNSPP',
      mortEq: 1,
      barkEq: 12,
      regions: 34,
      scientific: 'Juniperus species',
      common: 'Junipers/Redcedars'
    },
    JUVI: {
      fofem5: 'JUNVIR',
      mortEq: 1,
      barkEq: 17,
      regions: 34,
      scientific: 'Juniperus virginiana',
      common: 'Eastern red cedar'
    },
    LALA: {
      fofem5: 'LARLAR',
      mortEq: 1,
      barkEq: 10,
      regions: 34,
      scientific: 'Larix laricina',
      common: 'Tamarack'
    },
    LALY: {
      fofem5: 'LARLYA',
      mortEq: 1,
      barkEq: 29,
      regions: 2,
      scientific: 'Larix lyallii',
      common: 'Subalpine larch'
    },
    LAOC: {
      fofem5: 'LAROCC',
      mortEq: 14,
      barkEq: 36,
      regions: 12,
      scientific: 'Larix occidentalis',
      common: 'Western larch'
    },
    LIDE: {
      fofem5: 'LIBDEC',
      mortEq: 12,
      barkEq: 34,
      regions: 2,
      scientific: 'Libocedrus decurrens',
      common: 'Incense cedar'
    },
    LIST2: {
      fofem5: 'LIQSTY',
      mortEq: 1,
      barkEq: 15,
      regions: 34,
      scientific: 'Liquidambar styraciflua',
      common: 'Sweetgum'
    },
    LITU: {
      fofem5: 'LIRTUL',
      mortEq: 1,
      barkEq: 20,
      regions: 34,
      scientific: 'Liriodendron tulipifera',
      common: 'Yellow poplar'
    },
    LIDE3: {
      fofem5: 'LITDEN',
      mortEq: 1,
      barkEq: 30,
      regions: 2,
      scientific: 'Lithocarpus densiflorus',
      common: 'Tanoak'
    },
    MAPO: {
      fofem5: 'MACPOM',
      mortEq: 1,
      barkEq: 16,
      regions: 4,
      scientific: 'Maclura pomifera',
      common: 'Osage orange'
    },
    MAAC: {
      fofem5: 'MAGACU',
      mortEq: 1,
      barkEq: 15,
      regions: 34,
      scientific: 'Magnolia acuminata',
      common: 'Cucumber tree'
    },
    MAGR4: {
      fofem5: 'MAGGRA',
      mortEq: 1,
      barkEq: 12,
      regions: 4,
      scientific: 'Magnolia grandiflora',
      common: 'Southern magnolia'
    },
    MAMA2: {
      fofem5: 'MAGMAC',
      mortEq: 1,
      barkEq: 12,
      regions: 4,
      scientific: 'Magnolia macrophylla',
      common: 'Bigleaf magnolia'
    },
    MAGSPP: {
      fofem5: 'MAGSPP',
      mortEq: 1,
      barkEq: 18,
      regions: 34,
      scientific: 'Magnolia species',
      common: 'Magnolias'
    },
    MAVI2: {
      fofem5: 'MAGVIR',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Magnolia virginiana',
      common: 'Sweetbay'
    },
    MALPRU: {
      fofem5: 'MALPRU',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Prunus species',
      common: 'Apples/Cherries'
    },
    MALSPP: {
      fofem5: 'MALSPP',
      mortEq: 1,
      barkEq: 22,
      regions: 34,
      scientific: 'Malus species',
      common: 'Apples'
    },
    MOAL: {
      fofem5: 'MORALB',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Morus alba',
      common: 'White mulberry'
    },
    MORU2: {
      fofem5: 'MORRUB',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Morus rubra',
      common: 'Red mulberry'
    },
    MORSPP: {
      fofem5: 'MORSPP',
      mortEq: 1,
      barkEq: 12,
      regions: 34,
      scientific: 'Morus species',
      common: 'Mulberries'
    },
    NYAQ2: {
      fofem5: 'NYSAQU',
      mortEq: 1,
      barkEq: 9,
      regions: 4,
      scientific: 'Nyssa aquatica',
      common: 'Water tupelo'
    },
    NYOG: {
      fofem5: 'NYSOGE',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Nyssa ogache',
      common: 'Ogeechee tupelo'
    },
    NYSSPP: {
      fofem5: 'NYSSPP',
      mortEq: 1,
      barkEq: 4,
      regions: 34,
      scientific: 'Nyssa species',
      common: 'Tupelos'
    },
    NYSY: {
      fofem5: 'NYSSYL',
      mortEq: 1,
      barkEq: 18,
      regions: 34,
      scientific: 'Nyssa sylvatica',
      common: 'Black gum, Black tupelo'
    },
    NYBI: {
      fofem5: 'NYSSYLB',
      mortEq: 1,
      barkEq: 16,
      regions: 4,
      scientific: 'Nyssa biflora',
      common: 'Swamp tupelo'
    },
    OSVI: {
      fofem5: 'OSTVIR',
      mortEq: 1,
      barkEq: 16,
      regions: 34,
      scientific: 'Ostrya virginiana',
      common: 'Hophornbeam'
    },
    OXAR: {
      fofem5: 'OXYARB',
      mortEq: 1,
      barkEq: 15,
      regions: 34,
      scientific: 'Oxydendrum arboreum',
      common: 'Sourwood'
    },
    PATO2: {
      fofem5: 'PAUTOM',
      mortEq: 1,
      barkEq: 29,
      regions: 34,
      scientific: 'Paulownia tomentosa',
      common: 'Princess tree'
    },
    PEBO: {
      fofem5: 'PERBOR',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Persea borbonia',
      common: 'Redbay'
    },
    PIAB: {
      fofem5: 'PICABI',
      mortEq: 3,
      barkEq: 8,
      regions: 34,
      scientific: 'Picea abies',
      common: 'Norway spruce'
    },
    PIEN: {
      fofem5: 'PICENG',
      mortEq: 15,
      barkEq: 15,
      regions: 12,
      scientific: 'Picea engelmannii',
      common: 'Engelmann spruce'
    },
    PIGL: {
      fofem5: 'PICGLA',
      mortEq: 3,
      barkEq: 4,
      regions: 123,
      scientific: 'Picea glauca',
      common: 'White spruce'
    },
    PIMA: {
      fofem5: 'PICMAR',
      mortEq: 3,
      barkEq: 11,
      regions: 234,
      scientific: 'Picea mariana',
      common: 'Black spruce'
    },
    PIPU: {
      fofem5: 'PICPUN',
      mortEq: 3,
      barkEq: 10,
      regions: 1,
      scientific: 'Picea pungens',
      common: 'Blue spruce'
    },
    PIRU: {
      fofem5: 'PICRUB',
      mortEq: 3,
      barkEq: 13,
      regions: 34,
      scientific: 'Picea rubens',
      common: 'Red spruce'
    },
    PISI: {
      fofem5: 'PICSIT',
      mortEq: 3,
      barkEq: 6,
      regions: 2,
      scientific: 'Picea sitchensis',
      common: 'Sitka spruce'
    },
    PICSPP: {
      fofem5: 'PICSPP',
      mortEq: 3,
      barkEq: 13,
      regions: 34,
      scientific: 'Picea species',
      common: 'Spruces'
    },
    PIAL: {
      fofem5: 'PINALB',
      mortEq: 17,
      barkEq: 9,
      regions: 12,
      scientific: 'Pinus albicaulis',
      common: 'Whitebark pine'
    },
    PIAT: {
      fofem5: 'PINATT',
      mortEq: 1,
      barkEq: 9,
      regions: 2,
      scientific: 'Pinus attenuata',
      common: 'Knobcone pine'
    },
    PIBA2: {
      fofem5: 'PINBAN',
      mortEq: 1,
      barkEq: 19,
      regions: 3,
      scientific: 'Pinus banksiana',
      common: 'Jack pine'
    },
    PICL: {
      fofem5: 'PINCLA',
      mortEq: 1,
      barkEq: 14,
      regions: 4,
      scientific: 'Pinus clausa',
      common: 'Sand pine'
    },
    PICO: {
      fofem5: 'PINCON',
      mortEq: 17,
      barkEq: 7,
      regions: 12,
      scientific: 'Pinus contorta',
      common: 'Lodgepole pine'
    },
    PIEC2: {
      fofem5: 'PINECH',
      mortEq: 1,
      barkEq: 16,
      regions: 34,
      scientific: 'Pinus echinata',
      common: 'Shortleaf pine'
    },
    PIEL: {
      fofem5: 'PINELL',
      mortEq: 1,
      barkEq: 31,
      regions: 4,
      scientific: 'Pinus elliottii',
      common: 'Slash pine'
    },
    PIFL2: {
      fofem5: 'PINFLE',
      mortEq: 1,
      barkEq: 9,
      regions: 1,
      scientific: 'Pinus flexilis',
      common: 'Limber pine'
    },
    PIGL2: {
      fofem5: 'PINGLA',
      mortEq: 1,
      barkEq: 14,
      regions: 4,
      scientific: 'Pinus glabra',
      common: 'Spruce pine'
    },
    PIJE: {
      fofem5: 'PINJEF',
      mortEq: 19,
      barkEq: 37,
      regions: 12,
      scientific: 'Pinus jeffreyi',
      common: 'Jeffrey pine'
    },
    PILA: {
      fofem5: 'PINLAM',
      mortEq: 18,
      barkEq: 38,
      regions: 12,
      scientific: 'Pinus lambertiana',
      common: 'Sugar pine'
    },
    PIMO3: {
      fofem5: 'PINMON',
      mortEq: 1,
      barkEq: 14,
      regions: 12,
      scientific: 'Pinus monticola',
      common: 'Western white pine'
    },
    PIPA2: {
      fofem5: 'PINPAL',
      mortEq: 5,
      barkEq: 40,
      regions: 4,
      scientific: 'Pinus palustrus',
      common: 'Longleaf pine'
    },
    PIPO: {
      fofem5: 'PINPON',
      mortEq: 19,
      barkEq: 36,
      regions: 12,
      scientific: 'Pinus ponderosa',
      common: 'Ponderosa pine'
    },
    PIPU5: {
      fofem5: 'PINPUN',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Pinus pungens',
      common: 'Table mountain pine'
    },
    PIRE: {
      fofem5: 'PINRES',
      mortEq: 1,
      barkEq: 22,
      regions: 34,
      scientific: 'Pinus resinosa',
      common: 'Red pine'
    },
    PIRI: {
      fofem5: 'PINRIG',
      mortEq: 1,
      barkEq: 24,
      regions: 34,
      scientific: 'Pinus rigida',
      common: 'Pitch pine'
    },
    PISA2: {
      fofem5: 'PINSAB',
      mortEq: 1,
      barkEq: 12,
      regions: 2,
      scientific: 'Pinus sabiniana',
      common: 'Gray (Digger) pine'
    },
    PISE: {
      fofem5: 'PINSER',
      mortEq: 1,
      barkEq: 35,
      regions: 34,
      scientific: 'Pinus serotina',
      common: 'Pond pine'
    },
    PINSPP: {
      fofem5: 'PINSPP',
      mortEq: 1,
      barkEq: 9,
      regions: 34,
      scientific: 'Pinus species',
      common: 'Pines'
    },
    PIST: {
      fofem5: 'PINSTR',
      mortEq: 1,
      barkEq: 24,
      regions: 34,
      scientific: 'Pinus strobus',
      common: 'Eastern white pine'
    },
    PISY: {
      fofem5: 'PINSYL',
      mortEq: 1,
      barkEq: 9,
      regions: 34,
      scientific: 'Pinus sylvestris',
      common: 'Scots pine'
    },
    PITA: {
      fofem5: 'PINTAE',
      mortEq: 1,
      barkEq: 30,
      regions: 34,
      scientific: 'Pinus taeda',
      common: 'Loblolly pine'
    },
    PIVI2: {
      fofem5: 'PINVIR',
      mortEq: 1,
      barkEq: 12,
      regions: 34,
      scientific: 'Pinus virginiana',
      common: 'Virginia pine'
    },
    PLOC: {
      fofem5: 'PLAOCC',
      mortEq: 1,
      barkEq: 12,
      regions: 34,
      scientific: 'Plantus occidentalis',
      common: 'American sycamore'
    },
    POBA2: {
      fofem5: 'POPBAL',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Populus balsamifera',
      common: 'Balsam poplar'
    },
    PODE3: {
      fofem5: 'POPDEL',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Populus deltoides',
      common: 'Eastern cottonwood'
    },
    POGR4: {
      fofem5: 'POPGRA',
      mortEq: 1,
      barkEq: 18,
      regions: 34,
      scientific: 'Populus grandidentata',
      common: 'Bigtooth aspen'
    },
    POHE4: {
      fofem5: 'POPHET',
      mortEq: 1,
      barkEq: 29,
      regions: 34,
      scientific: 'Populus heterophylla',
      common: 'Swamp cottonwood'
    },
    POPSPP: {
      fofem5: 'POPSPP',
      mortEq: 1,
      barkEq: 17,
      regions: 34,
      scientific: 'Populus species',
      common: 'Poplars'
    },
    POTR15: {
      fofem5: 'POPTRI',
      mortEq: 1,
      barkEq: 23,
      regions: 2,
      scientific: 'Populus trichocarpa',
      common: 'Black cottonwood'
    },
    PRAM: {
      fofem5: 'PRUAME',
      mortEq: 1,
      barkEq: 19,
      regions: 3,
      scientific: 'Prunus americana',
      common: 'American plum'
    },
    PREM: {
      fofem5: 'PRUEMA',
      mortEq: 1,
      barkEq: 35,
      regions: 2,
      scientific: 'Prunus emarginata',
      common: 'Bitter cherry'
    },
    PRPE2: {
      fofem5: 'PRUDEN',
      mortEq: 1,
      barkEq: 24,
      regions: 34,
      scientific: 'Prunus pensylvanica',
      common: 'Pin cherry'
    },
    PRSE2: {
      fofem5: 'PRUSER',
      mortEq: 1,
      barkEq: 9,
      regions: 34,
      scientific: 'Prunus serotina',
      common: 'Black cherry'
    },
    PRVI: {
      fofem5: 'PRUVIR',
      mortEq: 1,
      barkEq: 19,
      regions: 3,
      scientific: 'Prunus virginiana',
      common: 'Chokecherry'
    },
    PSME: {
      fofem5: 'PSEMEN',
      mortEq: 20,
      barkEq: 36,
      regions: 12,
      scientific: 'Pseudotsuga menziesii',
      common: 'Douglas-fir'
    },
    QUAG: {
      fofem5: 'QUEAGR',
      mortEq: 1,
      barkEq: 29,
      regions: 2,
      scientific: 'Quercus agrifolia',
      common: 'California live oak'
    },
    QUAL: {
      fofem5: 'QUEALB',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Quercus alba',
      common: 'White oak'
    },
    QUBI: {
      fofem5: 'QUEBIC',
      mortEq: 1,
      barkEq: 24,
      regions: 34,
      scientific: 'Quercus bicolor',
      common: 'Swamp white oak'
    },
    QUCH2: {
      fofem5: 'QUECHR',
      mortEq: 1,
      barkEq: 3,
      regions: 2,
      scientific: 'Quercus chrysolepis',
      common: 'Canyon live oak'
    },
    QUOC2: {
      fofem5: 'QUEOCC',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Quercus coccinea',
      common: 'Scarlet oak'
    },
    QUDU: {
      fofem5: 'QUEDOU',
      mortEq: 1,
      barkEq: 12,
      regions: 2,
      scientific: 'Quercus douglasii',
      common: 'Blue oak'
    },
    QUEL: {
      fofem5: 'QUEELL',
      mortEq: 1,
      barkEq: 17,
      regions: 34,
      scientific: 'Quercus ellipsoidalis',
      common: 'Northern pin oak'
    },
    QUEN: {
      fofem5: 'QUEENG',
      mortEq: 1,
      barkEq: 33,
      regions: 2,
      scientific: 'Quercus engelmannii',
      common: 'Engelmann oak'
    },
    QUFA: {
      fofem5: 'QUEFAL',
      mortEq: 1,
      barkEq: 23,
      regions: 34,
      scientific: 'Quercus falcata',
      common: 'Southern red oak'
    },
    QUGA4: {
      fofem5: 'QUEGAR',
      mortEq: 1,
      barkEq: 8,
      regions: 2,
      scientific: 'Quercus garryana',
      common: 'Oregon white oak'
    },
    QUIM: {
      fofem5: 'QUEIMB',
      mortEq: 1,
      barkEq: 20,
      regions: 34,
      scientific: 'Quercus imbricaria',
      common: 'Shingle oak'
    },
    QUIN: {
      fofem5: 'QUEINC',
      mortEq: 1,
      barkEq: 17,
      regions: 4,
      scientific: 'Quercus incana',
      common: 'Bluejack oak'
    },
    QUKE: {
      fofem5: 'QUEKEL',
      mortEq: 1,
      barkEq: 9,
      regions: 2,
      scientific: 'Quercus kellogii',
      common: 'Califonia black oak'
    },
    QULA2: {
      fofem5: 'QUELAE',
      mortEq: 1,
      barkEq: 16,
      regions: 4,
      scientific: 'Quercus laevis',
      common: 'Turkey oak'
    },
    QULA3: {
      fofem5: 'QUELAU',
      mortEq: 1,
      barkEq: 15,
      regions: 4,
      scientific: 'Quercus laurifolia',
      common: 'Laurel oak'
    },
    QULO: {
      fofem5: 'QUELOB',
      mortEq: 1,
      barkEq: 22,
      regions: 2,
      scientific: 'Quercus lobata',
      common: 'Valley oak'
    },
    QULY: {
      fofem5: 'QUELYR',
      mortEq: 1,
      barkEq: 18,
      regions: 34,
      scientific: 'Quercus lyrata',
      common: 'Overcup oak'
    },
    QUMA2: {
      fofem5: 'QUEMAC',
      mortEq: 1,
      barkEq: 21,
      regions: 34,
      scientific: 'Quercus macrocarpa',
      common: 'Bur oak'
    },
    QUMA3: {
      fofem5: 'QUEMAR',
      mortEq: 1,
      barkEq: 16,
      regions: 34,
      scientific: 'Quercus marilandica',
      common: 'Blackjack oak'
    },
    QUMI: {
      fofem5: 'QUEMIC',
      mortEq: 1,
      barkEq: 25,
      regions: 34,
      scientific: 'Quercus michauxii',
      common: 'Swamp chestnut oak'
    },
    QUMU: {
      fofem5: 'QUEMUE',
      mortEq: 1,
      barkEq: 21,
      regions: 34,
      scientific: 'Quercus muehlenbergii',
      common: 'Chinkapin oak'
    },
    QUNI: {
      fofem5: 'QUENIG',
      mortEq: 1,
      barkEq: 15,
      regions: 34,
      scientific: 'Quercus nigra',
      common: 'Water oak'
    },
    QUNU: {
      fofem5: 'QUENUT',
      mortEq: 1,
      barkEq: 9,
      regions: 4,
      scientific: 'Quercus nuttallii',
      common: 'Nuttall oak'
    },
    QUPA2: {
      fofem5: 'QUEPAL',
      mortEq: 1,
      barkEq: 20,
      regions: 34,
      scientific: 'Quercus palustris',
      common: 'Pin oak'
    },
    QUPH: {
      fofem5: 'QUEPHE',
      mortEq: 1,
      barkEq: 20,
      regions: 34,
      scientific: 'Quercus phellos',
      common: 'Willow oak'
    },
    QUPR2: {
      fofem5: 'QUEPRI',
      mortEq: 1,
      barkEq: 28,
      regions: 34,
      scientific: 'Quercus prinus',
      common: 'Chestnut oak'
    },
    QURU: {
      fofem5: 'QUERUB',
      mortEq: 1,
      barkEq: 21,
      regions: 34,
      scientific: 'Quercus rubra',
      common: 'Northern red oak'
    },
    QUSH: {
      fofem5: 'QUESHU',
      mortEq: 1,
      barkEq: 16,
      regions: 34,
      scientific: 'Quercus shumardii',
      common: 'Shumard oak'
    },
    QUESPP: {
      fofem5: 'QUESPP',
      mortEq: 1,
      barkEq: 24,
      regions: 34,
      scientific: 'Quercus species',
      common: 'Oaks'
    },
    QUST: {
      fofem5: 'QUESTE',
      mortEq: 1,
      barkEq: 23,
      regions: 34,
      scientific: 'Quercus stellata',
      common: 'Post oak'
    },
    QUVE: {
      fofem5: 'QUEVEL',
      mortEq: 1,
      barkEq: 24,
      regions: 34,
      scientific: 'Quercus velutina',
      common: 'Black oak'
    },
    QUVI: {
      fofem5: 'QUEVIR',
      mortEq: 1,
      barkEq: 22,
      regions: 4,
      scientific: 'Quercus virginiana',
      common: 'Live oak'
    },
    QUWI2: {
      fofem5: 'QUEWIS',
      mortEq: 1,
      barkEq: 13,
      regions: 2,
      scientific: 'Quercus wislizenii',
      common: 'Interior live oak'
    },
    ROPS: {
      fofem5: 'ROBPSE',
      mortEq: 1,
      barkEq: 28,
      regions: 34,
      scientific: 'Robinia pseudoacacia',
      common: 'Black locust'
    },
    SABE2: {
      fofem5: 'SALDIA',
      mortEq: 1,
      barkEq: 19,
      regions: 3,
      scientific: 'Salix bebbiana',
      common: 'Diamond willow'
    },
    SANI: {
      fofem5: 'SALNIG',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Salix nigra',
      common: 'Black willow'
    },
    SALSPP: {
      fofem5: 'SALSPP',
      mortEq: 1,
      barkEq: 20,
      regions: 234,
      scientific: 'Salix species',
      common: 'Willows'
    },
    SAAL5: {
      fofem5: 'SASALB',
      mortEq: 1,
      barkEq: 14,
      regions: 34,
      scientific: 'Sassafras albidum',
      common: 'Sassafras'
    },
    SEGI2: {
      fofem5: 'SEQGIG',
      mortEq: 1,
      barkEq: 39,
      regions: 2,
      scientific: 'Sequoiadendron gigantea',
      common: 'Giant sequoia'
    },
    SESE3: {
      fofem5: 'SEQSEM',
      mortEq: 1,
      barkEq: 39,
      regions: 2,
      scientific: 'Sequoia sempervirens',
      common: 'Redwood'
    },
    SOAM3: {
      fofem5: 'SORAME',
      mortEq: 1,
      barkEq: 19,
      regions: 3,
      scientific: 'Sorbus americana',
      common: 'American mountain ash'
    },
    TABR2: {
      fofem5: 'TAXBRE',
      mortEq: 1,
      barkEq: 4,
      regions: 12,
      scientific: 'Taxus brevifolia',
      common: 'Pacific yew'
    },
    TADI2: {
      fofem5: 'TAXDIS',
      mortEq: 1,
      barkEq: 4,
      regions: 34,
      scientific: 'Taxodium distichum',
      common: 'Bald cypress'
    },
    TAAS: {
      fofem5: 'TAXDISN',
      mortEq: 1,
      barkEq: 21,
      regions: 4,
      scientific: 'Taxodium distictum var. nutans',
      common: 'Pond cypress'
    },
    THOC2: {
      fofem5: 'THUOCC',
      mortEq: 1,
      barkEq: 4,
      regions: 34,
      scientific: 'Thuja occidentalis',
      common: 'Northern white cedar'
    },
    THPL: {
      fofem5: 'THUPLI',
      mortEq: 1,
      barkEq: 14,
      regions: 12,
      scientific: 'Thuja plicata',
      common: 'Western red cedar'
    },
    THUSPP: {
      fofem5: 'THUSPP',
      mortEq: 1,
      barkEq: 12,
      regions: 34,
      scientific: 'Thuju species',
      common: 'Arborvitae'
    },
    TIAM: {
      fofem5: 'TILAME',
      mortEq: 1,
      barkEq: 17,
      regions: 34,
      scientific: 'Tilia americana',
      common: 'American basswood'
    },
    TIHE: {
      fofem5: 'TILHET',
      mortEq: 1,
      barkEq: 29,
      regions: 34,
      scientific: 'Tilia heterophylla',
      common: 'White basswood'
    },
    TSCA: {
      fofem5: 'TSUCAN',
      mortEq: 1,
      barkEq: 18,
      regions: 34,
      scientific: 'Tsuga canadensis',
      common: 'Eastern hemlock'
    },
    TSHE: {
      fofem5: 'TSUHET',
      mortEq: 1,
      barkEq: 19,
      regions: 12,
      scientific: 'Tsuga heterophylla',
      common: 'Western hemlock'
    },
    TSME: {
      fofem5: 'TSUMER',
      mortEq: 1,
      barkEq: 19,
      regions: 12,
      scientific: 'Tsuga mertensiana',
      common: 'Mountain hemlock'
    },
    ULAL: {
      fofem5: 'ULMALA',
      mortEq: 1,
      barkEq: 10,
      regions: 34,
      scientific: 'Ulmus alata',
      common: 'Winged elm'
    },
    ULAM: {
      fofem5: 'ULMAME',
      mortEq: 1,
      barkEq: 10,
      regions: 34,
      scientific: 'Ulmus americana',
      common: 'American elm'
    },
    ULPU: {
      fofem5: 'ULMPUM',
      mortEq: 1,
      barkEq: 17,
      regions: 34,
      scientific: 'Ulmus pumila',
      common: 'Siberian elm'
    },
    ULRU: {
      fofem5: 'ULMRUB',
      mortEq: 1,
      barkEq: 11,
      regions: 34,
      scientific: 'Ulmus rubra',
      common: 'Slippery elm'
    },
    ULMSPP: {
      fofem5: 'ULMSPP',
      mortEq: 1,
      barkEq: 18,
      regions: 34,
      scientific: 'Ulmus species',
      common: 'Elms'
    },
    ULTH: {
      fofem5: 'ULMTHO',
      mortEq: 1,
      barkEq: 12,
      regions: 34,
      scientific: 'Ulmus thomasii',
      common: 'Rock elm'
    },
    UMCA: {
      fofem5: 'UMBCAL',
      mortEq: 1,
      barkEq: 5,
      regions: 2,
      scientific: 'Umbellularia californica',
      common: 'California laurel'
    },
    ABLO: {
      fofem5: 'ABLO',
      mortEq: 10,
      barkEq: 27,
      regions: 12,
      scientific: 'Abies lowiana',
      common: 'Sierra white fir'
    },
    ABNO: {
      fofem5: 'ABNO',
      mortEq: 1,
      barkEq: 24,
      regions: 12,
      scientific: 'Abies nobilis',
      common: 'Noble fir'
    },
    AEFL: {
      fofem5: 'AEFL',
      mortEq: 1,
      barkEq: 29,
      regions: 34,
      scientific: 'Aesculus flava',
      common: 'Yellow buckeye'
    },
    CANO9: {
      fofem5: 'CANO9',
      mortEq: 1,
      barkEq: 2,
      regions: 2,
      scientific: 'Callitropsis nootkatensis',
      common: 'Alaska cedar'
    },
    CADE27: {
      fofem5: 'CADE27',
      mortEq: 12,
      barkEq: 34,
      regions: 12,
      scientific: 'Calocedrus decurrens',
      common: 'Incense cedar'
    },
    CAAL27: {
      fofem5: 'CAAL27',
      mortEq: 1,
      barkEq: 22,
      regions: 34,
      scientific: 'Carya alba',
      common: 'Mockernut hickory'
    },
    CACA38: {
      fofem5: 'CACA38',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Carya carolinae septentrionalis',
      common: 'Shagbark hickory'
    },
    CAAM29: {
      fofem5: 'CAAM29',
      mortEq: 1,
      barkEq: 19,
      regions: 34,
      scientific: 'Castenea Americana',
      common: 'American chestnut'
    },
    CHCHC4: {
      fofem5: 'CHCHC4',
      mortEq: 1,
      barkEq: 24,
      regions: 34,
      scientific: 'Chrysolepis chrysophylla',
      common: 'Giant chinkapin'
    },
    CUNO: {
      fofem5: 'CUNO',
      mortEq: 1,
      barkEq: 2,
      regions: 2,
      scientific: 'Cupressus nootkatensis',
      common: 'Nootka cypress'
    },
    CUTH: {
      fofem5: 'CUTH',
      mortEq: 1,
      barkEq: 4,
      regions: 2,
      scientific: 'Cupressus thyoides',
      common: 'Atlantic white cedar'
    },
    QUTE: {
      fofem5: 'QUTE',
      mortEq: 1,
      barkEq: 9,
      regions: 34,
      scientific: 'Quercus texana',
      common: 'Texas red oak'
    },
    ULRA: {
      fofem5: 'ULRA',
      mortEq: 1,
      barkEq: 12,
      regions: 34,
      scientific: 'Ulmus racemosa',
      common: 'Rock elm'
    }
  };

  /* eslint-disable no-prototype-builtins */

  /*! \brief Calculates the aspen mortality rate.
   *
   *  \param severity Fire severity level: 0 = low severity, 1= moderate+ severity
   *  \param flameLength Flame length of the fire at the tree (ft).
   *  \param dbh          Aspen diameter at breast height (in).
   *
   *  \return Aspen mortality rate (fraction).
   */

  function aspenMortality(severity, flameLength, dbh) {
    var ch = flameLength / 1.8;
    return severity < 1 ? fraction(1 / (1 + Math.exp(-4.407 + 0.638 * dbh - 2.134 * ch))) : fraction(1 / (1 + Math.exp(-2.157 + 0.218 * dbh - 3.6 * ch)));
  }
  function barkThickness(fofem6Code, dbh) {
    ensureFofem6Code(fofem6Code);
    var equationIdx = data[fofem6Code].barkEq;
    ensureEquationIdx(fofem6Code, equationIdx); // In FOFEM 6, longleaf pine has its own bark thickness formula and uses dbh in cm

    if (equationIdx === 40) {
      var dbhCm = 2.54 * dbh; // dbh in cm

      var barkCm = 0.435 + 0.031 * dbhCm; // bark thickness in cm

      return barkCm / 2.54; // bark thickness in inches
    }

    return fofemSingleBarkThicknessFactor[equationIdx] * dbh;
  }
  /**
   * Calculates fraction of crown length scorched.
   * @param {real} treeHt Tree height (ft)
   * @param {real} baseHt Tree crown base height (ft)
   * @param {real} scorchHt Scorch height (ft)
   * @return {real} Fraction of crown length that was scorched (ft/ft)
   */

  function crownLengthScorched(treeHt, baseHt, scorchHt) {
    // Tree crown length (ft) and base height (ft)
    var crownLength = treeHt - baseHt; // Tree crown length scorched (ft)

    var scorchLength = positive(Math.min(scorchHt, treeHt) - baseHt); // Fraction of the crown length scorched (ft/ft)

    return divide(scorchLength, crownLength);
  }
  /**
   * Calculates fraction of crown volume scorched.
   * @param {real} treeHt Tree height (ft)
   * @param {real} baseHt Tree crown base height (ft)
   * @param {real} scorchHt Scorch height (ft)
   * @return {real} Fraction of crown volume that was scorched (ft3/ft3)
   */

  function crownVolumeScorched(treeHt, baseHt, scorchHt) {
    // Tree crown length (ft) and base height (ft)
    var crownLength = treeHt - baseHt; // Tree crown length scorched (ft)

    var scorchLength = positive(Math.min(scorchHt, treeHt) - baseHt); // Fraction of the crown volume scorched (ft3/ft3)

    return divide(scorchLength * (2 * crownLength - scorchLength), crownLength * crownLength);
  }
  function ensureEquationIdx(fofem6Code, equationIdx) {
    if (equationIdx < 0 || equationIdx >= fofemSingleBarkThicknessFactor.length) {
      throw new Error("Tree Mortality Fofem6 species code '".concat(fofem6Code, "' bark thickness index '").concat(equationIdx, "' is invalid"));
    }
  }
  function ensureFofem6Code(fofem6Code) {
    if (!hasFofem6Code(fofem6Code)) {
      throw new Error("Tree Mortality Fofem6 species code '".concat(fofem6Code, "' is invalid"));
    }
  }
  function commonNames() {
    return fofem6Codes().map(function (key) {
      return data[key].common;
    });
  }
  function fofem5Codes() {
    return fofem6Codes().map(function (key) {
      return data[key].fofem5;
    });
  }
  function fofem6Codes() {
    return Object.keys(data);
  }
  function scientificNames() {
    return fofem6Codes().map(function (key) {
      return data[key].scientific;
    });
  }
  function hasFofem6Code(fofem6Code) {
    return data.hasOwnProperty(fofem6Code);
  }
  /**
   *  Calculates probability of tree mortality using the FOFEM 6.0
   *  equations for trees with dbh >= 1.
   *
   *  This is only a partial implementation of the FOFEM mortality algorithm.
   *  Specifically, it only implements those cases where the tree dbh >= 1".
   *  It also excludes the FOFEM special case of \e Populus \e tremuloides,
   *  which requires additional inputs (namely, flame height and fire severity).
   *
   * @param {string} fofem6Code FOFEM 6 tree species code
   * @param {number} dbh Tree diameter at breast height (in)
   * @param {number} treeHt Tree total height (ft)
   * @param {number} baseHt Tree crown base height (ft)
   * @param {number} scorchHt Scorch height (ft)
   */

  function mortalityRate(fofem6Code, dbh, treeHt, baseHt, scorchHt) {
    var clsFraction = crownLengthScorched(treeHt, baseHt, scorchHt);
    var cvsFraction = crownVolumeScorched(treeHt, baseHt, scorchHt);
    var clsPercent = 100 * clsFraction;
    var cvsPercent = 100 * cvsFraction;
    var equationId = data[fofem6Code].mortEq;
    var mr = 0; // Pat requested that if scorch ht is zero, then mortality is zero

    if (scorchHt <= 0) {
      return mr;
    } // Equation 1 is the default mortality equation for all species with dbh > 1"
    // Equation 3 is for spruce species
    // its the same as Equation 1 but with a minimum value of 0.8


    if (equationId === 1 || equationId === 3) {
      var bark = barkThickness(fofem6Code, dbh);
      mr = -1.941 + 6.316 * (1 - Math.exp(-bark)) - 5.35 * cvsFraction * cvsFraction;
      mr = 1 / (1 + Math.exp(mr));
      mr = equationId === 3 ? Math.max(0.8, mr) : mr;
    } // Equation 5 is specifically for Pinus palustris (longleaf pine)
    // Note that bark thickness is in cm
    else if (equationId === 5) {
        // This equation uses crown volume scorched as a scale of 1-10
        var cvsScale = cvsPercent / 10;
        var barkCm = 2.54 * barkThickness(fofem6Code, dbh);
        mr = 0.169 + 5.136 * barkCm + 14.492 * barkCm * barkCm - 0.348 * cvsScale * cvsScale;
        mr = 1 / (1 + Math.exp(mr));
      } // Equation 10 is specifically for Abies concolor (white fir)
      else if (equationId === 10) {
          mr = -3.5083 + 0.0956 * clsPercent - 0.00184 * clsPercent * clsPercent + 0.000017 * clsPercent * clsPercent * clsPercent;
          mr = 1 / (1 + Math.exp(-mr));
        } // Equation 11 is specifically for Abies lasiocarpa (subalpine fir)
        // and Abies grandis (grad fir)
        else if (equationId === 11) {
            mr = -1.695 + 0.2071 * cvsPercent - 0.0047 * cvsPercent * cvsPercent + 0.000035 * cvsPercent * cvsPercent * cvsPercent;
            mr = 1 / (1 + Math.exp(-mr));
          } // Equation 12 is specifically for Libocedrus decurrens (incense cedar)
          else if (equationId === 12) {
              mr = -4.2466 + 0.000007172 * clsPercent * clsPercent * clsPercent;
              mr = 1 / (1 + Math.exp(-mr));
            } // Equation 14 is specifically for Larix occidentalis (western larch)
            // Note that this is from Hood, so dbh is in cm
            else if (equationId === 14) {
                mr = -1.6594 + 0.0327 * cvsPercent - 0.0489 * (2.54 * dbh);
                mr = 1 / (1 + Math.exp(-mr));
              } // Equation 15 is specifically for Picea engelmannii (Englemann spruce)
              else if (equationId === 15) {
                  mr = 0.0845 + 0.0445 * cvsPercent;
                  mr = 1 / (1 + Math.exp(-mr));
                } // Equation 16 is specifically for Abies magnifica (red fir)
                else if (equationId === 16) {
                    mr = -2.3085 + 0.000004059 * clsPercent * clsPercent * clsPercent;
                    mr = 1 / (1 + Math.exp(-mr));
                  } // Equation 17 is specifically for Pinus albicaulis (whitebark pine)
                  // and Pinus contorta (lodgepole pine)
                  // Note that this is from Hood, so dbh is in cm
                  else if (equationId === 17) {
                      mr = -0.3268 + 0.1387 * cvsPercent - 0.0033 * cvsPercent * cvsPercent + 0.000025 * cvsPercent * cvsPercent * cvsPercent - 0.0266 * (2.54 * dbh);
                      mr = 1 / (1 + Math.exp(-mr));
                    } // Equation 18 is specifically for Pinus lambertiana (sugar pine)
                    else if (equationId === 18) {
                        mr = -2.0588 + 0.000814 * clsPercent * clsPercent;
                        mr = 1 / (1 + Math.exp(-mr));
                      } // Equation 19 is specifically for Pinus ponderosa (ponderosa pine)
                      // and Pinus jeffreyi (Jeffry pine)
                      else if (equationId === 19) {
                          mr = -2.7103 + 0.000004093 * cvsPercent * cvsPercent * cvsPercent;
                          mr = 1 / (1 + Math.exp(-mr));
                        } // Equation 20 is specifically for Pseudotsuga menziesii (Douglas-fir)
                        else if (equationId === 20) {
                            mr = -2.0346 + 0.0906 * cvsPercent - 0.0022 * cvsPercent * cvsPercent + 0.000019 * cvsPercent * cvsPercent * cvsPercent;
                            mr = 1 / (1 + Math.exp(-mr));
                          } else {
                            throw new Error('mortalityRate(): invalid mortality equation id' + equationId);
                          }

    return fraction(mr);
  }

  var TreeMortality = /*#__PURE__*/Object.freeze({
    __proto__: null,
    aspenMortality: aspenMortality,
    barkThickness: barkThickness,
    crownLengthScorched: crownLengthScorched,
    crownVolumeScorched: crownVolumeScorched,
    ensureEquationIdx: ensureEquationIdx,
    ensureFofem6Code: ensureFofem6Code,
    commonNames: commonNames,
    fofem5Codes: fofem5Codes,
    fofem6Codes: fofem6Codes,
    scientificNames: scientificNames,
    hasFofem6Code: hasFofem6Code,
    mortalityRate: mortalityRate
  });

  /**
   * @file Exported WFSP western aspen dynamic fuel model equations
   * as described by Brown and Simmerman (1986) and implemented by BehavePlus V6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins
   * @license MIT
   */
  var ppsf = 2000 / 43560; // Array curing levels are [0, 0.3, 0.5, 0.7 0.9, 1]

  var Table = {
    aspenShrub: {
      depth: 0.65,
      dead1Load: [0.8, 0.893, 1.056, 1.218, 1.379, 1.4595],
      dead1Savr: [1440.0, 1620.0, 1910.0, 2090.0, 2220.0, 2285.0],
      dead10Load: 0.975,
      liveHerbLoad: [0.335, 0.234, 0.167, 0.1, 0.033, 0.0],
      liveStemLoad: [0.403, 0.403, 0.333, 0.283, 0.277, 0.274],
      liveStemSavr: [2440.0, 2440.0, 2310.0, 2090.0, 1670.0, 1670.0]
    },
    aspenTallForb: {
      depth: 0.3,
      dead1Load: [0.738, 0.93, 1.056, 1.183, 1.309, 1.372],
      dead1Savr: [1480.0, 1890.0, 2050.0, 2160.0, 2240.0, 2280.0],
      dead10Load: 0.475,
      liveHerbLoad: [0.665, 0.465, 0.332, 0.199, 0.067, 0.0],
      liveStemLoad: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      liveStemSavr: [2440.0, 2440.0, 2440.0, 2440.0, 2440.0, 2440.0]
    },
    aspenLowForb: {
      depth: 0.18,
      dead1Load: [0.601, 0.645, 0.671, 0.699, 0.73, 0.7455],
      dead1Savr: [1400.0, 1540.0, 1620.0, 1690.0, 1750.0, 1780.0],
      dead10Load: 1.035,
      liveHerbLoad: [0.15, 0.105, 0.075, 0.045, 0.015, 0.0],
      liveStemLoad: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      liveStemSavr: [2440.0, 2440.0, 2440.0, 2440.0, 2440.0, 2440.0]
    },
    mixedShrub: {
      depth: 0.5,
      dead1Load: [0.88, 0.906, 1.037, 1.167, 1.3, 1.3665],
      dead1Savr: [1350.0, 1420.0, 1710.0, 1910.0, 2060.0, 2135.0],
      dead10Load: 1.34,
      liveHerbLoad: [0.1, 0.07, 0.05, 0.03, 0.01, 0.0],
      liveStemLoad: [0.455, 0.455, 0.364, 0.29, 0.261, 0.2465],
      liveStemSavr: [2530.0, 2530.0, 2410.0, 2210.0, 1800.0, 1800.0]
    },
    mixedForb: {
      depth: 0.18,
      dead1Load: [0.754, 0.797, 0.825, 0.854, 0.884, 0.899],
      dead1LoadDEPRECATED: [0.754, 0.797, 0.825, 1.167, 0.884, 0.899],
      dead1Savr: [1420.0, 1540.0, 1610.0, 1670.0, 1720.0, 1745.0],
      dead10Load: 1.115,
      liveHerbLoad: [0.15, 0.105, 0.075, 0.045, 0.015, 0.0],
      liveStemLoad: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      liveStemSavr: [2440.0, 2440.0, 2440.0, 2440.0, 2440.0, 2440.0]
    }
  };
  var Types$1 = Object.keys(Table);
  function interpolate(curingLevel, valueAtLevel) {
    var Curing = [0.0, 0.3, 0.5, 0.7, 0.9, 1.000000001];
    var cl = fraction(curingLevel);
    var fraction$1 = 0;

    for (var idx = 1; idx <= 4; idx += 1) {
      if (cl <= Curing[idx]) {
        fraction$1 = 1 - (Curing[idx] - cl) / (Curing[idx] - Curing[idx - 1]);
        return valueAtLevel[idx - 1] + fraction$1 * (valueAtLevel[idx] - valueAtLevel[idx - 1]);
      }
    }

    return valueAtLevel[5];
  }
  function deadMext() {
    return 0.25;
  }
  function has(fuelType) {
    return Object.keys(Table).includes(fuelType);
  }
  function depth(fuelType) {
    return has(fuelType) ? Table[fuelType].depth : 0.01;
  }
  function deadFineLoad$1(fuelType, curingLevel) {
    return has(fuelType) ? ppsf * interpolate(curingLevel, Table[fuelType].dead1Load) : 0;
  }
  function deadFineSavr(fuelType, curingLevel) {
    return has(fuelType) ? interpolate(curingLevel, Table[fuelType].dead1Savr) : 1;
  }
  function deadSmallLoad$1(fuelType) {
    return has(fuelType) ? ppsf * Table[fuelType].dead10Load : 0;
  }
  function fuelTypes$1() {
    return Object.keys(Table);
  } // Live herb

  function liveHerbLoad$1(fuelType, curingLevel) {
    return has(fuelType) ? ppsf * interpolate(curingLevel, Table[fuelType].liveHerbLoad) : 0;
  } // Live stem

  function liveStemLoad(fuelType, curingLevel) {
    return has(fuelType) ? ppsf * interpolate(curingLevel, Table[fuelType].liveStemLoad) : 0;
  }
  function liveStemSavr(fuelType, curingLevel) {
    return has(fuelType) ? interpolate(curingLevel, Table[fuelType].liveStemSavr) : 1;
  }

  var WesternAspenFuel = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Types: Types$1,
    interpolate: interpolate,
    deadMext: deadMext,
    has: has,
    depth: depth,
    deadFineLoad: deadFineLoad$1,
    deadFineSavr: deadFineSavr,
    deadSmallLoad: deadSmallLoad$1,
    fuelTypes: fuelTypes$1,
    liveHerbLoad: liveHerbLoad$1,
    liveStemLoad: liveStemLoad,
    liveStemSavr: liveStemSavr
  });

  /**
   * @file Exported WFSP wind functions as implemented by BehavePlus v6.
   * @version 0.1.0
   * @copyright Systems for Environmental Management 2020
   * @author Collin D. Bevins <cbevins@montana.com>
   * @license MIT
   */
  function speedAt10m(ws20ft) {
    return 1.13 * ws20ft;
  }
  function speedAt20ft(ws10m) {
    return ws10m / 1.13;
  }
  function speedAt20ftFromMidflame(wsmid, mwaf) {
    return mwaf > 0 ? divide(wsmid, mwaf) : wsmid;
  }
  function speedAtMidflame(ws20ft, mwaf) {
    return mwaf * ws20ft;
  }

  var Wind = /*#__PURE__*/Object.freeze({
    __proto__: null,
    speedAt10m: speedAt10m,
    speedAt20ft: speedAt20ft,
    speedAt20ftFromMidflame: speedAt20ftFromMidflame,
    speedAtMidflame: speedAtMidflame
  });

  function tbd() {
    return true;
  } // \todo Have the Dag add its Dag.* methods directly


  var MethodArray = [['Dag.bind', tbd], // (87 users)
  ['Dag.config', tbd], // Config Leaf update method
  ['Dag.dangler', tbd], // same as input(), but due to boundary conditions
  ['Dag.fixed', tbd], // (164 users)
  ['Dag.input', tbd], // (120 users)
  ['Behave.curedHerbFraction', curedHerbFraction], // (2 users)
  ['Behave.deadHerbLoad', deadHerbLoad], // (2 users)
  ['Behave.liveHerbLoad', liveHerbLoad], // (2 users)
  ['Calc.divide', divide], // (37 users)
  ['Calc.greaterThan', greaterThan], // (6 users)
  ['Calc.multiply', multiply], // (9 users)
  ['Calc.or', or], // (1 users)
  ['Calc.subtract', subtract], // (7 users)
  ['Calc.sum', sum], // (46 users)
  ['Calc.sumOfProducts', sumOfProducts], // (42 users)
  ['Canopy.crownFill', crownFill], // (1 users)
  ['Canopy.crownLength', crownLength], // (1 users)
  ['Canopy.crownRatio', crownRatio], // (1 users)
  ['Canopy.fuelLoad', fuelLoad], // (1 users)
  ['Canopy.heatPerUnitArea', heatPerUnitArea], // (1 users)
  ['Canopy.sheltersFuel', sheltersFuelFromWind], // (1 users)
  ['Canopy.windSpeedAdjustmentFactor', windSpeedAdjustmentFactor$1], // (1 users)
  ['Chaparral.age', age], // (2 users)
  ['Chaparral.deadClass1Load', deadClass1Load], // (2 users)
  ['Chaparral.deadClass2Load', deadClass2Load], // (2 users)
  ['Chaparral.deadClass3Load', deadClass3Load], // (2 users)
  ['Chaparral.deadClass4Load', deadClass4Load], // (2 users)
  ['Chaparral.deadFractionAverageMortality', deadFractionAverageMortality], // (2 users)
  ['Chaparral.deadFractionSevereMortality', deadFractionSevereMortality], ['Chaparral.deadLoad', deadLoad], // (2 users)
  ['Chaparral.fuelDepth', fuelDepth], // (2 users)
  ['Chaparral.liveClass1Load', liveClass1Load], // (2 users)
  ['Chaparral.liveClass2Load', liveClass2Load], // (2 users)
  ['Chaparral.liveClass3Load', liveClass3Load], // (2 users)
  ['Chaparral.liveClass4Load', liveClass4Load], // (2 users)
  ['Chaparral.liveClass5Load', liveClass5Load], // (2 users)
  ['Chaparral.liveLoad', liveLoad], // (2 users)
  ['Chaparral.totalLoad', totalLoad], // (2 users)
  ['Compass.diff', diff], ['Compass.opposite', opposite], // (6 users)
  ['Compass.slopeDegrees', slopeDegrees$1], // (1 users)
  ['Compass.slopeDegreesMap', slopeDegreesMap], // (1 users)
  ['Compass.slopeRatio', slopeRatio$2], // (1 users)
  ['Compass.slopeRatioMap', slopeRatioMap], // (1 users)
  ['Compass.sum', sum$1], ['CrownFire.activeRatio', activeRatio], // (1 users)
  ['CrownFire.area', area], // (2 users)
  ['CrownFire.canTransition', canTransition], // (1 users)
  ['CrownFire.crownFractionBurned', crownFractionBurned], // (1 users)
  ['CrownFire.crowningIndex', crowningIndex], // (1 users)
  ['CrownFire.flameLength', flameLength], // (1 users, 'crown.fire.initiation.flameLength')
  ['CrownFire.flameLengthThomas', flameLengthThomas], // (2 users)
  ['CrownFire.fliActive', fliActive], // (1 users)
  ['CrownFire.fliFinal', fliFinal], // (1 users)
  ['CrownFire.fliInit', fliInit], // (1 users)
  ['CrownFire.hpuaActive', hpuaActive], // (1 users)
  ['CrownFire.isActive', isActive], // (1 users)
  ['CrownFire.isConditional', isConditional], // (1 users)
  ['CrownFire.isCrown', isCrown], // (1 users)
  ['CrownFire.isPassive', isPassive], // (1 users)
  ['CrownFire.isPlumeDominated', isPlumeDominated], // (1 users)
  ['CrownFire.isSurface', isSurface], // (1 users)
  ['CrownFire.isWindDriven', isWindDriven], // (1 users)
  ['CrownFire.lengthToWidthRatio', lengthToWidthRatio], // (1 users)
  ['CrownFire.mapArea', mapArea], // (2 users)
  ['CrownFire.oActive', oActive], // (1 users)
  ['CrownFire.perimeter', perimeter], // (2 users)
  ['CrownFire.powerOfTheFire', powerOfTheFire], // (1 users)
  ['CrownFire.powerOfTheWind', powerOfTheWind], // (1 users)
  ['CrownFire.rActive', rActive], // (1 users)
  ['CrownFire.rFinal', rFinal], // (1 users)
  ['CrownFire.rInit', rInit], // (1 users)
  ['CrownFire.rPrimeActive', rPrimeActive], // (1 users)
  ['CrownFire.rSa', rSa], // (1 users)
  ['CrownFire.spreadDistance', spreadDistance], // (2 users)
  ['CrownFire.transitionRatio', transitionRatio], // (1 users)
  ['CrownFire.type', type], // (1 users)
  ['CrownSpotting.firelineIntensityThomas', firelineIntensityThomas], // (1 users, 'site.fire.crown.firelineIntensity')
  ['CrownSpotting.flatDistance', flatDistance], // (1 users)
  ['CrownSpotting.xdrift', xdrift], // (1 users)
  ['CrownSpotting.xdrop', xdrop], // (1 users)
  ['CrownSpotting.xspot', xspot], // (1 users)
  ['CrownSpotting.zdrop', zdrop], // (1 users)
  ['FireEllipse.area', area$1], // (1 users)
  ['FireEllipse.backingSpreadRate', backingSpreadRate], // (1 users)
  ['FireEllipse.betaSpreadRate', betaSpreadRate], // (1 users)
  ['FireEllipse.eccentricity', eccentricity], // (1 users)
  ['FireEllipse.flameLength', flameLength], // (6 users)
  ['FireEllipse.flankingSpreadRate', flankingSpreadRate], // (1 users)
  ['FireEllipse.fliAtAzimuth', fliAtAzimuth], // (5 users)
  ['FireEllipse.fSpreadRate', fSpreadRate], // (1 users)
  ['FireEllipse.gSpreadRate', gSpreadRate], // (1 users)
  ['FireEllipse.hSpreadRate', hSpreadRate], // (1 users)
  ['FireEllipse.majorSpreadRate', majorSpreadRate], // (1 users)
  ['FireEllipse.mapArea', mapArea], // (1 users)
  ['FireEllipse.minorSpreadRate', minorSpreadRate], // (1 users)
  ['FireEllipse.perimeter', perimeter$1], // (1 users)
  ['FireEllipse.psiFromTheta', psiFromTheta], // (1 users)
  ['FireEllipse.scorchHeight', scorchHeight], // (6 users)
  ['FireEllipse.spreadDistance', spreadDistance], // (8 users)
  ['FireEllipse.psiSpreadRate', psiSpreadRate], // (2 users)
  ['FireEllipse.thetaFromBeta', thetaFromBeta], // (1 users)
  ['FireWeighting.arithmeticMeanSpreadRate', arithmeticMeanSpreadRate], // (1 users)
  ['FireWeighting.expectedValueSpreadRate', expectedValueSpreadRateMOCK], // (1 users)
  ['FireWeighting.harmonicMeanSpreadRate', harmonicMeanSpreadRate], // (1 users)
  ['FuelBed.extinctionMoistureContent', extinctionMoistureContent$1], // (3 users)
  ['FuelBed.extinctionMoistureContentFactor', extinctionMoistureContentFactor], // (3 users)
  ['FuelBed.heatPerUnitArea', heatPerUnitArea$1], // (3 users)
  ['FuelBed.heatSink', heatSink], // (3 users)
  ['FuelBed.mineralDamping', mineralDamping], // (6 users)
  ['FuelBed.moistureDamping', moistureDamping], // (6 users)
  ['FuelBed.noWindNoSlopeSpreadRate', noWindNoSlopeSpreadRate], // (3 users)
  ['FuelBed.openWindSpeedAdjustmentFactor', openWindSpeedAdjustmentFactor], // (3 users)
  ['FuelBed.optimumPackingRatio', optimumPackingRatio], // (3 users)
  ['FuelBed.packingRatio', packingRatio], // (3 users)
  ['FuelBed.propagatingFluxRatio', propagatingFluxRatio], // (3 users)
  ['FuelBed.reactionIntensityDry', reactionIntensityDry], // (6 users)
  ['FuelBed.reactionVelocityExponent', reactionVelocityExponent], // (3 users)
  ['FuelBed.reactionVelocityMaximum', reactionVelocityMaximum], // (3 users)
  ['FuelBed.reactionVelocityOptimum', reactionVelocityOptimum], // (3 users)
  ['FuelBed.savr15', savr15], // (3 users)
  ['FuelBed.slopeK', slopeK], // (3 users)
  ['FuelBed.sizeClassWeightingFactorArray', sizeClassWeightingFactorArray], // (36 users)
  ['FuelBed.taur', taur], // (3 users)
  ['FuelBed.windB', windB], // (3 users)
  ['FuelBed.windC', windC], // (3 users)
  ['FuelBed.windE', windE], // (3 users)
  ['FuelBed.windI', windI], // (3 users)
  ['FuelBed.windK', windK], // (3 users)
  ['FuelBed.windSpeedAdjustmentFactor', windSpeedAdjustmentFactor$2], // (2 users)
  ['FuelCatalog.behaveDead100Load', behaveDead100Load], // (2 users)
  ['FuelCatalog.behaveDead10Load', behaveDead10Load], // (2 users)
  ['FuelCatalog.behaveDead1Load', behaveDead1Load], // (2 users)
  ['FuelCatalog.behaveDead1Savr', behaveDead1Savr], // (2 users)
  ['FuelCatalog.behaveDeadHeat', behaveDeadHeat], // (2 users)
  ['FuelCatalog.behaveDeadMext', behaveDeadMext], // (2 users)
  ['FuelCatalog.behaveDepth', behaveDepth], // (2 users)
  ['FuelCatalog.behaveLiveHeat', behaveLiveHeat], // (2 users)
  ['FuelCatalog.behaveLiveHerbSavr', behaveLiveHerbSavr], // (2 users)
  ['FuelCatalog.behaveLiveStemLoad', behaveLiveStemLoad], // (2 users)
  ['FuelCatalog.behaveLiveStemSavr', behaveLiveStemSavr], // (2 users)
  ['FuelCatalog.behaveTotalHerbLoad', behaveTotalHerbLoad], // (2 users)
  ['FuelCatalog.chaparralDeadFraction', chaparralDeadFraction], // (2 users)
  ['FuelCatalog.chaparralDepth', chaparralDepth], // (2 users)
  ['FuelCatalog.chaparralFuelType', chaparralFuelType], // (2 users)
  ['FuelCatalog.chaparralTotalLoad', chaparralTotalLoad], // (2 users)
  ['FuelCatalog.domain', domain], // (2 users)
  ['FuelCatalog.palmettoGallberrylAge', pgAge], // (2 users)
  ['FuelCatalog.palmettoGallberrylBasalArea', pgBasalArea], // (2 users)
  ['FuelCatalog.palmettoGallberrylCover', pgCover], // (2 users)
  ['FuelCatalog.palmettoGallberrylHeight', pgHeight], // (2 users)
  ['FuelCatalog.westernAspenCuringLevel', westernAspenCuringLevel], // (2 users)
  ['FuelCatalog.westernAspenFuelType', westernAspenFuelType], // (2 users)
  ['FuelParticle.cylindricalDiameter', cylindricalDiameter], // (30 users)
  ['FuelParticle.heatOfPreignition', heatOfPreignition], // (30 users)
  ['FuelParticle.effectiveHeatingNumber', effectiveHeatingNumber], // (30 users)
  ['FuelParticle.effectiveFuelLoad', effectiveFuelLoad], // (15 users)
  ['FuelParticle.effectiveFuelLoadDead', effectiveFuelLoadDead], // (15 users)
  ['FuelParticle.effectiveFuelLoadLive', effectiveFuelLoadLive], // (15 users)
  ['FuelParticle.effectiveFuelWaterLoad', effectiveFuelWaterLoad], // (30 users)
  ['FuelParticle.netOvendryLoad', netOvendryLoad], // (30 users)
  ['FuelParticle.volume', volume], // (30 users)
  ['FuelParticle.selectByDomain', selectByDomain], // (150 users)
  ['FuelParticle.sizeClass', sizeClass], // (30 users)
  ['FuelParticle.sizeClassWeightingFactor', sizeClassWeightingFactor], // (36 users)
  ['FuelParticle.surfaceArea', surfaceArea], // (30 users)
  ['FuelParticle.surfaceAreaWeightingFactor', surfaceAreaWeightingFactor], // (30 users)
  ['IgnitionProbability.firebrand', firebrand], ['IgnitionProbability.fuelTemperature', fuelTemperature], ['IgnitionProbability.lightningStrike', lightningStrike], ['Math.max', Math.max], // (4 users)
  ['Math.min', Math.min], // (10 users)
  ['PalmettoGallberry.deadFineLoad', deadFineLoad], // (2 users)
  ['PalmettoGallberry.deadFoliageLoad', deadFoliageLoad], // (2 users)
  ['PalmettoGallberry.deadLitterLoad', deadLitterLoad], // (2 users)
  ['PalmettoGallberry.deadSmallLoad', deadSmallLoad], // (2 users)
  ['PalmettoGallberry.fuelDepth', fuelDepth$1], // (2 users)
  ['PalmettoGallberry.liveFineLoad', liveFineLoad], // (2 users)
  ['PalmettoGallberry.liveFoliageLoad', liveFoliageLoad], // (2 users)
  ['PalmettoGallberry.liveSmallLoad', liveSmallLoad], // (2 users)
  ['Spotting.appliedDownWindCoverHeight', appliedDownWindCoverHt], // (1 users)
  ['Spotting.burningPileFirebrandHeight', burningPileFirebrandHt], // (1 users)
  ['Spotting.criticalCoverHeight', criticalCoverHt], // (3 users)
  ['Spotting.spotDistanceFlatTerrain', distanceFlatTerrain], // (3 users)
  ['Spotting.spotDistanceFlatTerrainWithDrift', distanceFlatTerrainWithDrift], // (3 users)
  ['Spotting.spotDistanceMountainTerrain', distanceMountainTerrain], // (4 users)
  ['Spotting.surfaceFireFirebrandDrift', surfaceFireFirebrandDrift], // (1 users)
  ['Spotting.surfaceFireFirebrandHeight', surfaceFireFirebrandHt], // (1 users)
  ['Spotting.torchingTreesFirebrandHeight', torchingTreesFirebrandHt], // (1 users)
  ['Spotting.torchingTreesSteadyFlameDuration', torchingTreesSteadyFlameDuration], // (1 users)
  ['Spotting.torchingTreesSteadyFlameHeight', torchingTreesSteadyFlameHt], // (1 users)
  ['SurfaceFire.effectiveWindSpeed', effectiveWindSpeed], // (12 users)
  ['SurfaceFire.effectiveWindSpeedFromLwr', effectiveWindSpeedFromLwr], // (12 users)
  ['SurfaceFire.effectiveWindSpeedLimit', effectiveWindSpeedLimit], // (3 users)
  ['SurfaceFire.firelineIntensity', firelineIntensity], // (3 users)
  ['SurfaceFire.firelineIntensityFromFlameLength', firelineIntensityFromFlameLength], // (1 users)
  ['SurfaceFire.flameLength', flameLength], // (4 users)
  ['SurfaceFire.lengthToWidthRatio', lengthToWidthRatio$1], // (3 users)
  ['SurfaceFire.maximumDirectionSlopeSpreadRate', maximumDirectionSlopeSpreadRate], // (3 users)
  ['SurfaceFire.maximumDirectionSpreadRate', maximumDirectionSpreadRate], // (3 users)
  ['SurfaceFire.maximumDirectionWindSpreadRate', maximumDirectionWindSpreadRate], // (3 users)
  ['SurfaceFire.maximumDirectionXComponent', maximumDirectionXComponent], // (3 users)
  ['SurfaceFire.maximumDirectionYComponent', maximumDirectionYComponent], // (3 users)
  ['SurfaceFire.maximumSpreadRate', maximumSpreadRate], // (3 users)
  ['SurfaceFire.phiEffectiveWind', phiEffectiveWind], // (3 users)
  ['SurfaceFire.phiEffectiveWindInferred', phiEffectiveWindInferred], // (9 users)
  ['SurfaceFire.phiSlope', phiSlope], // (3 users)
  ['SurfaceFire.phiWind', phiWind], // (3 users)
  ['SurfaceFire.spreadDirectionFromUpslope', spreadDirectionFromUpslope], // (3 users)
  ['SurfaceFire.spreadRateWithCrossSlopeWind', spreadRateWithCrossSlopeWind], // (3 users)
  ['SurfaceFire.spreadRateWithRosLimitApplied', spreadRateWithRosLimitApplied], // (6 users)
  ['SurfaceFire.windSlopeSpreadRateCoefficientLimit', phiEwFromEws], // (3 users)
  ['SurfaceFire.windSpeedAdjustmentFactor', windSpeedAdjustmentFactor$2], // (2 users)
  ['TreeMortality.barkThickness', barkThickness], ['TreeMortality.crownLengthScorched', crownLengthScorched], ['TreeMortality.crownVolumeScorched', crownVolumeScorched], ['TreeMortality.mortality', mortalityRate], ['WesternAspen.deadFineLoad', deadFineLoad$1], // (2 users)
  ['WesternAspen.deadFineSavr', deadFineSavr], // (2 users)
  ['WesternAspen.deadSmallLoad', deadSmallLoad$1], // (2 users)
  ['WesternAspen.depth', depth], // (2 users)
  ['WesternAspen.liveHerbLoad', liveHerbLoad$1], // (2 users)
  ['WesternAspen.liveStemLoad', liveStemLoad], // (2 users)
  ['WesternAspen.liveStemSavr', liveStemSavr], // (2 users)
  ['Wind.speedAt10m', speedAt10m], // (1 users)
  ['Wind.speedAt20ft', speedAt20ft], // (1 users)
  ['Wind.speedAt20ftFromMidflame', speedAt20ftFromMidflame], // (1 users)
  ['Wind.speedAtMidflame', speedAtMidflame] // (4 users)
  ];
  var MethodMap = new Map(MethodArray);

  var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Behave: BehaveFuel,
    Calc: Calc,
    Canopy: Canopy,
    Chaparral: ChaparralFuel,
    Compass: Compass,
    CrownFire: CrownFire,
    CrownSpotting: CrownSpotting,
    FireEllipse: FireEllipse,
    FuelBed: FuelBed,
    FuelCatalog: FuelCatalog,
    FuelParticle: FuelParticle,
    IgnitionProbability: IgnitionProbability,
    PalmettoGallberry: PalmettoGallberryFuel,
    Spotting: Spotting,
    SurfaceFire: SurfaceFire,
    TreeMortality: TreeMortality,
    WesternAspen: WesternAspenFuel,
    Wind: Wind,
    MethodArray: MethodArray,
    MethodMap: MethodMap
  });

  var AirTemperature = /*#__PURE__*/function (_Variant$Quantity) {
    _inherits(AirTemperature, _Variant$Quantity);

    var _super = _createSuper(AirTemperature);

    function AirTemperature() {
      _classCallCheck(this, AirTemperature);

      return _super.call(this, Temperature);
    }

    return AirTemperature;
  }(Quantity);
  var ChaparralTypeOption = /*#__PURE__*/function (_Variant$Option) {
    _inherits(ChaparralTypeOption, _Variant$Option);

    var _super2 = _createSuper(ChaparralTypeOption);

    function ChaparralTypeOption() {
      _classCallCheck(this, ChaparralTypeOption);

      return _super2.call(this, Types);
    }

    return ChaparralTypeOption;
  }(Option);
  var CompassAzimuth = /*#__PURE__*/function (_Variant$Quantity2) {
    _inherits(CompassAzimuth, _Variant$Quantity2);

    var _super3 = _createSuper(CompassAzimuth);

    function CompassAzimuth() {
      _classCallCheck(this, CompassAzimuth);

      return _super3.call(this, Arc);
    }

    return CompassAzimuth;
  }(Quantity);
  var ConfigChaparralTotalLoad = /*#__PURE__*/function (_Variant$Config) {
    _inherits(ConfigChaparralTotalLoad, _Variant$Config);

    var _super4 = _createSuper(ConfigChaparralTotalLoad);

    function ConfigChaparralTotalLoad() {
      _classCallCheck(this, ConfigChaparralTotalLoad);

      return _super4.call(this, ChaparralTotalLoad);
    }

    return ConfigChaparralTotalLoad;
  }(Config);
  var ConfigCuredHerbFraction = /*#__PURE__*/function (_Variant$Config2) {
    _inherits(ConfigCuredHerbFraction, _Variant$Config2);

    var _super5 = _createSuper(ConfigCuredHerbFraction);

    function ConfigCuredHerbFraction() {
      _classCallCheck(this, ConfigCuredHerbFraction);

      return _super5.call(this, CuredHerbFraction);
    }

    return ConfigCuredHerbFraction;
  }(Config);
  var ConfigEffectiveWindSpeedLimit = /*#__PURE__*/function (_Variant$Config3) {
    _inherits(ConfigEffectiveWindSpeedLimit, _Variant$Config3);

    var _super6 = _createSuper(ConfigEffectiveWindSpeedLimit);

    function ConfigEffectiveWindSpeedLimit() {
      _classCallCheck(this, ConfigEffectiveWindSpeedLimit);

      return _super6.call(this, EffectiveWindSpeedLimit);
    }

    return ConfigEffectiveWindSpeedLimit;
  }(Config);
  var ConfigFireLengthToWidthRatio = /*#__PURE__*/function (_Variant$Config4) {
    _inherits(ConfigFireLengthToWidthRatio, _Variant$Config4);

    var _super7 = _createSuper(ConfigFireLengthToWidthRatio);

    function ConfigFireLengthToWidthRatio() {
      _classCallCheck(this, ConfigFireLengthToWidthRatio);

      return _super7.call(this, FireLengthToWidthRatio);
    }

    return ConfigFireLengthToWidthRatio;
  }(Config);
  var ConfigFireVector = /*#__PURE__*/function (_Variant$Config5) {
    _inherits(ConfigFireVector, _Variant$Config5);

    var _super8 = _createSuper(ConfigFireVector);

    function ConfigFireVector() {
      _classCallCheck(this, ConfigFireVector);

      return _super8.call(this, FireVector);
    }

    return ConfigFireVector;
  }(Config);
  var ConfigFireWeightingMethod = /*#__PURE__*/function (_Variant$Config6) {
    _inherits(ConfigFireWeightingMethod, _Variant$Config6);

    var _super9 = _createSuper(ConfigFireWeightingMethod);

    function ConfigFireWeightingMethod() {
      _classCallCheck(this, ConfigFireWeightingMethod);

      return _super9.call(this, FireWeightingMethod);
    }

    return ConfigFireWeightingMethod;
  }(Config);
  var ConfigFirelineIntensity = /*#__PURE__*/function (_Variant$Config7) {
    _inherits(ConfigFirelineIntensity, _Variant$Config7);

    var _super10 = _createSuper(ConfigFirelineIntensity);

    function ConfigFirelineIntensity() {
      _classCallCheck(this, ConfigFirelineIntensity);

      return _super10.call(this, FirelineIntensity);
    }

    return ConfigFirelineIntensity;
  }(Config);
  var ConfigModule = /*#__PURE__*/function (_Variant$Config8) {
    _inherits(ConfigModule, _Variant$Config8);

    var _super11 = _createSuper(ConfigModule);

    function ConfigModule() {
      _classCallCheck(this, ConfigModule);

      return _super11.call(this, Module);
    }

    return ConfigModule;
  }(Config);
  var ConfigMoistureContents = /*#__PURE__*/function (_Variant$Config9) {
    _inherits(ConfigMoistureContents, _Variant$Config9);

    var _super12 = _createSuper(ConfigMoistureContents);

    function ConfigMoistureContents() {
      _classCallCheck(this, ConfigMoistureContents);

      return _super12.call(this, MoistureContent);
    }

    return ConfigMoistureContents;
  }(Config);
  var ConfigPrimaryFuels = /*#__PURE__*/function (_Variant$Config10) {
    _inherits(ConfigPrimaryFuels, _Variant$Config10);

    var _super13 = _createSuper(ConfigPrimaryFuels);

    function ConfigPrimaryFuels() {
      _classCallCheck(this, ConfigPrimaryFuels);

      return _super13.call(this, PrimaryFuel);
    }

    return ConfigPrimaryFuels;
  }(Config);
  var ConfigSecondaryFuels = /*#__PURE__*/function (_Variant$Config11) {
    _inherits(ConfigSecondaryFuels, _Variant$Config11);

    var _super14 = _createSuper(ConfigSecondaryFuels);

    function ConfigSecondaryFuels() {
      _classCallCheck(this, ConfigSecondaryFuels);

      return _super14.call(this, SecondaryFuel);
    }

    return ConfigSecondaryFuels;
  }(Config);
  var ConfigSlopeSteepness = /*#__PURE__*/function (_Variant$Config12) {
    _inherits(ConfigSlopeSteepness, _Variant$Config12);

    var _super15 = _createSuper(ConfigSlopeSteepness);

    function ConfigSlopeSteepness() {
      _classCallCheck(this, ConfigSlopeSteepness);

      return _super15.call(this, SlopeSteepness);
    }

    return ConfigSlopeSteepness;
  }(Config);
  var ConfigWindDirection = /*#__PURE__*/function (_Variant$Config13) {
    _inherits(ConfigWindDirection, _Variant$Config13);

    var _super16 = _createSuper(ConfigWindDirection);

    function ConfigWindDirection() {
      _classCallCheck(this, ConfigWindDirection);

      return _super16.call(this, WindDirection);
    }

    return ConfigWindDirection;
  }(Config);
  var ConfigWindSpeed = /*#__PURE__*/function (_Variant$Config14) {
    _inherits(ConfigWindSpeed, _Variant$Config14);

    var _super17 = _createSuper(ConfigWindSpeed);

    function ConfigWindSpeed() {
      _classCallCheck(this, ConfigWindSpeed);

      return _super17.call(this, WindSpeed);
    }

    return ConfigWindSpeed;
  }(Config);
  var ConfigWindSpeedAdjustmentFactor = /*#__PURE__*/function (_Variant$Config15) {
    _inherits(ConfigWindSpeedAdjustmentFactor, _Variant$Config15);

    var _super18 = _createSuper(ConfigWindSpeedAdjustmentFactor);

    function ConfigWindSpeedAdjustmentFactor() {
      _classCallCheck(this, ConfigWindSpeedAdjustmentFactor);

      return _super18.call(this, WindSpeedAdjustmentFactor);
    }

    return ConfigWindSpeedAdjustmentFactor;
  }(Config);
  var CrownFillFraction = /*#__PURE__*/function (_Variant$Quantity3) {
    _inherits(CrownFillFraction, _Variant$Quantity3);

    var _super19 = _createSuper(CrownFillFraction);

    function CrownFillFraction() {
      _classCallCheck(this, CrownFillFraction);

      return _super19.call(this, Fraction);
    }

    return CrownFillFraction;
  }(Quantity);
  var CrownFireActiveRatio = /*#__PURE__*/function (_Variant$Quantity4) {
    _inherits(CrownFireActiveRatio, _Variant$Quantity4);

    var _super20 = _createSuper(CrownFireActiveRatio);

    function CrownFireActiveRatio() {
      _classCallCheck(this, CrownFireActiveRatio);

      return _super20.call(this, Ratio);
    }

    return CrownFireActiveRatio;
  }(Quantity);
  var CrownFireBurnedFraction = /*#__PURE__*/function (_Variant$Quantity5) {
    _inherits(CrownFireBurnedFraction, _Variant$Quantity5);

    var _super21 = _createSuper(CrownFireBurnedFraction);

    function CrownFireBurnedFraction() {
      _classCallCheck(this, CrownFireBurnedFraction);

      return _super21.call(this, Fraction);
    }

    return CrownFireBurnedFraction;
  }(Quantity);
  var CrownFireInitiationTypeOption = /*#__PURE__*/function (_Variant$Option2) {
    _inherits(CrownFireInitiationTypeOption, _Variant$Option2);

    var _super22 = _createSuper(CrownFireInitiationTypeOption);

    function CrownFireInitiationTypeOption() {
      _classCallCheck(this, CrownFireInitiationTypeOption);

      return _super22.call(this, InitiationTypes);
    }

    return CrownFireInitiationTypeOption;
  }(Option);
  var CrownRatioFraction = /*#__PURE__*/function (_Variant$Quantity6) {
    _inherits(CrownRatioFraction, _Variant$Quantity6);

    var _super23 = _createSuper(CrownRatioFraction);

    function CrownRatioFraction() {
      _classCallCheck(this, CrownRatioFraction);

      return _super23.call(this, Load);
    }

    return CrownRatioFraction;
  }(Quantity);
  var CrownTransitionRatio = /*#__PURE__*/function (_Variant$Quantity7) {
    _inherits(CrownTransitionRatio, _Variant$Quantity7);

    var _super24 = _createSuper(CrownTransitionRatio);

    function CrownTransitionRatio() {
      _classCallCheck(this, CrownTransitionRatio);

      return _super24.call(this, Ratio);
    }

    return CrownTransitionRatio;
  }(Quantity);
  var Documentation = /*#__PURE__*/function (_Variant$Text) {
    _inherits(Documentation, _Variant$Text);

    var _super25 = _createSuper(Documentation);

    function Documentation() {
      _classCallCheck(this, Documentation);

      return _super25.call(this, '');
    }

    return Documentation;
  }(Text);
  var FireArea = /*#__PURE__*/function (_Variant$Quantity8) {
    _inherits(FireArea, _Variant$Quantity8);

    var _super26 = _createSuper(FireArea);

    function FireArea() {
      _classCallCheck(this, FireArea);

      return _super26.call(this, Area);
    }

    return FireArea;
  }(Quantity);
  var FireDampingCoefficient = /*#__PURE__*/function (_Variant$Float) {
    _inherits(FireDampingCoefficient, _Variant$Float);

    var _super27 = _createSuper(FireDampingCoefficient);

    function FireDampingCoefficient() {
      _classCallCheck(this, FireDampingCoefficient);

      return _super27.call(this, 0);
    }

    return FireDampingCoefficient;
  }(Float);
  var FireElapsedTime = /*#__PURE__*/function (_Variant$Quantity9) {
    _inherits(FireElapsedTime, _Variant$Quantity9);

    var _super28 = _createSuper(FireElapsedTime);

    function FireElapsedTime() {
      _classCallCheck(this, FireElapsedTime);

      return _super28.call(this, Time);
    }

    return FireElapsedTime;
  }(Quantity);
  var FireFirelineIntensity = /*#__PURE__*/function (_Variant$Quantity10) {
    _inherits(FireFirelineIntensity, _Variant$Quantity10);

    var _super29 = _createSuper(FireFirelineIntensity);

    function FireFirelineIntensity() {
      _classCallCheck(this, FireFirelineIntensity);

      return _super29.call(this, HeatIntensity);
    }

    return FireFirelineIntensity;
  }(Quantity);
  var FireFlameDuration = /*#__PURE__*/function (_Variant$Quantity11) {
    _inherits(FireFlameDuration, _Variant$Quantity11);

    var _super30 = _createSuper(FireFlameDuration);

    function FireFlameDuration() {
      _classCallCheck(this, FireFlameDuration);

      return _super30.call(this, Time);
    }

    return FireFlameDuration;
  }(Quantity);
  var FireFlameLength = /*#__PURE__*/function (_Variant$Quantity12) {
    _inherits(FireFlameLength, _Variant$Quantity12);

    var _super31 = _createSuper(FireFlameLength);

    function FireFlameLength() {
      _classCallCheck(this, FireFlameLength);

      return _super31.call(this, Distance);
    }

    return FireFlameLength;
  }(Quantity);
  var FireHeatPerUnitArea = /*#__PURE__*/function (_Variant$Quantity13) {
    _inherits(FireHeatPerUnitArea, _Variant$Quantity13);

    var _super32 = _createSuper(FireHeatPerUnitArea);

    function FireHeatPerUnitArea() {
      _classCallCheck(this, FireHeatPerUnitArea);

      return _super32.call(this, HeatLoad);
    }

    return FireHeatPerUnitArea;
  }(Quantity);
  var FireLengthToWidthRatio$1 = /*#__PURE__*/function (_Variant$Quantity14) {
    _inherits(FireLengthToWidthRatio, _Variant$Quantity14);

    var _super33 = _createSuper(FireLengthToWidthRatio);

    function FireLengthToWidthRatio() {
      _classCallCheck(this, FireLengthToWidthRatio);

      return _super33.call(this, Ratio);
    }

    return FireLengthToWidthRatio;
  }(Quantity);
  var FirePower = /*#__PURE__*/function (_Variant$Quantity15) {
    _inherits(FirePower, _Variant$Quantity15);

    var _super34 = _createSuper(FirePower);

    function FirePower() {
      _classCallCheck(this, FirePower);

      return _super34.call(this, Power);
    }

    return FirePower;
  }(Quantity);
  var FirePowerRatio = /*#__PURE__*/function (_Variant$Quantity16) {
    _inherits(FirePowerRatio, _Variant$Quantity16);

    var _super35 = _createSuper(FirePowerRatio);

    function FirePowerRatio() {
      _classCallCheck(this, FirePowerRatio);

      return _super35.call(this, Ratio);
    }

    return FirePowerRatio;
  }(Quantity);
  var FirePropagatingFluxRatio = /*#__PURE__*/function (_Variant$Quantity17) {
    _inherits(FirePropagatingFluxRatio, _Variant$Quantity17);

    var _super36 = _createSuper(FirePropagatingFluxRatio);

    function FirePropagatingFluxRatio() {
      _classCallCheck(this, FirePropagatingFluxRatio);

      return _super36.call(this, Ratio);
    }

    return FirePropagatingFluxRatio;
  }(Quantity);
  var FireReactionIntensity = /*#__PURE__*/function (_Variant$Quantity18) {
    _inherits(FireReactionIntensity, _Variant$Quantity18);

    var _super37 = _createSuper(FireReactionIntensity);

    function FireReactionIntensity() {
      _classCallCheck(this, FireReactionIntensity);

      return _super37.call(this, HeatFlux);
    }

    return FireReactionIntensity;
  }(Quantity);
  var FireReactionVelocity = /*#__PURE__*/function (_Variant$Quantity19) {
    _inherits(FireReactionVelocity, _Variant$Quantity19);

    var _super38 = _createSuper(FireReactionVelocity);

    function FireReactionVelocity() {
      _classCallCheck(this, FireReactionVelocity);

      return _super38.call(this, Hertz, 0.1);
    }

    return FireReactionVelocity;
  }(Quantity);
  var FireResidenceTime = /*#__PURE__*/function (_Variant$Quantity20) {
    _inherits(FireResidenceTime, _Variant$Quantity20);

    var _super39 = _createSuper(FireResidenceTime);

    function FireResidenceTime() {
      _classCallCheck(this, FireResidenceTime);

      return _super39.call(this, Time);
    }

    return FireResidenceTime;
  }(Quantity);
  var FireScorchHeight = /*#__PURE__*/function (_Variant$Quantity21) {
    _inherits(FireScorchHeight, _Variant$Quantity21);

    var _super40 = _createSuper(FireScorchHeight);

    function FireScorchHeight() {
      _classCallCheck(this, FireScorchHeight);

      return _super40.call(this, Distance);
    }

    return FireScorchHeight;
  }(Quantity);
  var FireSpotDistance = /*#__PURE__*/function (_Variant$Quantity22) {
    _inherits(FireSpotDistance, _Variant$Quantity22);

    var _super41 = _createSuper(FireSpotDistance);

    function FireSpotDistance() {
      _classCallCheck(this, FireSpotDistance);

      return _super41.call(this, Distance);
    }

    return FireSpotDistance;
  }(Quantity);
  var FireSpreadDistance = /*#__PURE__*/function (_Variant$Quantity23) {
    _inherits(FireSpreadDistance, _Variant$Quantity23);

    var _super42 = _createSuper(FireSpreadDistance);

    function FireSpreadDistance() {
      _classCallCheck(this, FireSpreadDistance);

      return _super42.call(this, Distance);
    }

    return FireSpreadDistance;
  }(Quantity);
  var FireSpreadRate = /*#__PURE__*/function (_Variant$Quantity24) {
    _inherits(FireSpreadRate, _Variant$Quantity24);

    var _super43 = _createSuper(FireSpreadRate);

    function FireSpreadRate() {
      _classCallCheck(this, FireSpreadRate);

      return _super43.call(this, Velocity);
    }

    return FireSpreadRate;
  }(Quantity);
  var FuelAge = /*#__PURE__*/function (_Variant$Quantity25) {
    _inherits(FuelAge, _Variant$Quantity25);

    var _super44 = _createSuper(FuelAge);

    function FuelAge() {
      _classCallCheck(this, FuelAge);

      return _super44.call(this, Years);
    }

    return FuelAge;
  }(Quantity);
  var FuelBasalArea = /*#__PURE__*/function (_Variant$Quantity26) {
    _inherits(FuelBasalArea, _Variant$Quantity26);

    var _super45 = _createSuper(FuelBasalArea);

    function FuelBasalArea() {
      _classCallCheck(this, FuelBasalArea);

      return _super45.call(this, Area);
    }

    return FuelBasalArea;
  }(Quantity);
  var FuelBedBulkDensity = /*#__PURE__*/function (_Variant$Quantity27) {
    _inherits(FuelBedBulkDensity, _Variant$Quantity27);

    var _super46 = _createSuper(FuelBedBulkDensity);

    function FuelBedBulkDensity() {
      _classCallCheck(this, FuelBedBulkDensity);

      return _super46.call(this, Density);
    }

    return FuelBedBulkDensity;
  }(Quantity);
  var FuelBedDepth = /*#__PURE__*/function (_Variant$Quantity28) {
    _inherits(FuelBedDepth, _Variant$Quantity28);

    var _super47 = _createSuper(FuelBedDepth);

    function FuelBedDepth() {
      _classCallCheck(this, FuelBedDepth);

      return _super47.call(this, Distance, 0.1);
    }

    return FuelBedDepth;
  }(Quantity);
  var FuelBedHeatOfPreignition = /*#__PURE__*/function (_Variant$Quantity29) {
    _inherits(FuelBedHeatOfPreignition, _Variant$Quantity29);

    var _super48 = _createSuper(FuelBedHeatOfPreignition);

    function FuelBedHeatOfPreignition() {
      _classCallCheck(this, FuelBedHeatOfPreignition);

      return _super48.call(this, HeatContent);
    }

    return FuelBedHeatOfPreignition;
  }(Quantity);
  var FuelBedPackingRatio = /*#__PURE__*/function (_Variant$Quantity30) {
    _inherits(FuelBedPackingRatio, _Variant$Quantity30);

    var _super49 = _createSuper(FuelBedPackingRatio);

    function FuelBedPackingRatio() {
      _classCallCheck(this, FuelBedPackingRatio);

      return _super49.call(this, Ratio);
    }

    return FuelBedPackingRatio;
  }(Quantity);
  var FuelCoverFraction = /*#__PURE__*/function (_Variant$Quantity31) {
    _inherits(FuelCoverFraction, _Variant$Quantity31);

    var _super50 = _createSuper(FuelCoverFraction);

    function FuelCoverFraction() {
      _classCallCheck(this, FuelCoverFraction);

      return _super50.call(this, Fraction);
    }

    return FuelCoverFraction;
  }(Quantity);
  var FuelCylindricalDiameter = /*#__PURE__*/function (_Variant$Quantity32) {
    _inherits(FuelCylindricalDiameter, _Variant$Quantity32);

    var _super51 = _createSuper(FuelCylindricalDiameter);

    function FuelCylindricalDiameter() {
      _classCallCheck(this, FuelCylindricalDiameter);

      return _super51.call(this, Distance);
    }

    return FuelCylindricalDiameter;
  }(Quantity);
  var FuelCylindricalVolume = /*#__PURE__*/function (_Variant$Quantity33) {
    _inherits(FuelCylindricalVolume, _Variant$Quantity33);

    var _super52 = _createSuper(FuelCylindricalVolume);

    function FuelCylindricalVolume() {
      _classCallCheck(this, FuelCylindricalVolume);

      return _super52.call(this, Volume);
    }

    return FuelCylindricalVolume;
  }(Quantity);
  var FuelDeadFraction = /*#__PURE__*/function (_Variant$Quantity34) {
    _inherits(FuelDeadFraction, _Variant$Quantity34);

    var _super53 = _createSuper(FuelDeadFraction);

    function FuelDeadFraction() {
      _classCallCheck(this, FuelDeadFraction);

      return _super53.call(this, Fraction);
    }

    return FuelDeadFraction;
  }(Quantity);
  var FuelEffectiveHeatingNumber = /*#__PURE__*/function (_Variant$Quantity35) {
    _inherits(FuelEffectiveHeatingNumber, _Variant$Quantity35);

    var _super54 = _createSuper(FuelEffectiveHeatingNumber);

    function FuelEffectiveHeatingNumber() {
      _classCallCheck(this, FuelEffectiveHeatingNumber);

      return _super54.call(this, Fraction);
    }

    return FuelEffectiveHeatingNumber;
  }(Quantity);
  var FuelEffectiveMineralContent = /*#__PURE__*/function (_Variant$Quantity36) {
    _inherits(FuelEffectiveMineralContent, _Variant$Quantity36);

    var _super55 = _createSuper(FuelEffectiveMineralContent);

    function FuelEffectiveMineralContent() {
      _classCallCheck(this, FuelEffectiveMineralContent);

      return _super55.call(this, Fraction);
    }

    return FuelEffectiveMineralContent;
  }(Quantity);
  var FuelHeatOfCombustion = /*#__PURE__*/function (_Variant$Quantity37) {
    _inherits(FuelHeatOfCombustion, _Variant$Quantity37);

    var _super56 = _createSuper(FuelHeatOfCombustion);

    function FuelHeatOfCombustion() {
      _classCallCheck(this, FuelHeatOfCombustion);

      return _super56.call(this, HeatContent);
    }

    return FuelHeatOfCombustion;
  }(Quantity);
  var FuelHeatOfPreignition = /*#__PURE__*/function (_Variant$Quantity38) {
    _inherits(FuelHeatOfPreignition, _Variant$Quantity38);

    var _super57 = _createSuper(FuelHeatOfPreignition);

    function FuelHeatOfPreignition() {
      _classCallCheck(this, FuelHeatOfPreignition);

      return _super57.call(this, HeatContent);
    }

    return FuelHeatOfPreignition;
  }(Quantity);
  var FuelHeatSink = /*#__PURE__*/function (_Variant$Quantity39) {
    _inherits(FuelHeatSink, _Variant$Quantity39);

    var _super58 = _createSuper(FuelHeatSink);

    function FuelHeatSink() {
      _classCallCheck(this, FuelHeatSink);

      return _super58.call(this, HeatDensity);
    }

    return FuelHeatSink;
  }(Quantity);
  var FuelLabelText = /*#__PURE__*/function (_Variant$Text2) {
    _inherits(FuelLabelText, _Variant$Text2);

    var _super59 = _createSuper(FuelLabelText);

    function FuelLabelText() {
      _classCallCheck(this, FuelLabelText);

      return _super59.call(this, '');
    }

    return FuelLabelText;
  }(Text);
  var FuelModelDomainOption = /*#__PURE__*/function (_Variant$Option3) {
    _inherits(FuelModelDomainOption, _Variant$Option3);

    var _super60 = _createSuper(FuelModelDomainOption);

    function FuelModelDomainOption() {
      _classCallCheck(this, FuelModelDomainOption);

      return _super60.call(this, Domains);
    }

    return FuelModelDomainOption;
  }(Option);
  var FuelModelKeyOption = /*#__PURE__*/function (_Variant$Option4) {
    _inherits(FuelModelKeyOption, _Variant$Option4);

    var _super61 = _createSuper(FuelModelKeyOption);

    function FuelModelKeyOption() {
      _classCallCheck(this, FuelModelKeyOption);

      return _super61.call(this, keys());
    }

    return FuelModelKeyOption;
  }(Option);
  var FuelMoistureContent = /*#__PURE__*/function (_Variant$Quantity40) {
    _inherits(FuelMoistureContent, _Variant$Quantity40);

    var _super62 = _createSuper(FuelMoistureContent);

    function FuelMoistureContent() {
      _classCallCheck(this, FuelMoistureContent);

      return _super62.call(this, Ratio);
    }

    return FuelMoistureContent;
  }(Quantity);
  var FuelOvendryLoad = /*#__PURE__*/function (_Variant$Quantity41) {
    _inherits(FuelOvendryLoad, _Variant$Quantity41);

    var _super63 = _createSuper(FuelOvendryLoad);

    function FuelOvendryLoad() {
      _classCallCheck(this, FuelOvendryLoad);

      return _super63.call(this, Load);
    }

    return FuelOvendryLoad;
  }(Quantity);
  var FuelParticleFiberDensity = /*#__PURE__*/function (_Variant$Quantity42) {
    _inherits(FuelParticleFiberDensity, _Variant$Quantity42);

    var _super64 = _createSuper(FuelParticleFiberDensity);

    function FuelParticleFiberDensity() {
      _classCallCheck(this, FuelParticleFiberDensity);

      return _super64.call(this, Density);
    }

    return FuelParticleFiberDensity;
  }(Quantity);
  var FuelSizeClassIndex = /*#__PURE__*/function (_Variant$Index) {
    _inherits(FuelSizeClassIndex, _Variant$Index);

    var _super65 = _createSuper(FuelSizeClassIndex);

    function FuelSizeClassIndex() {
      _classCallCheck(this, FuelSizeClassIndex);

      return _super65.call(this, 6);
    }

    return FuelSizeClassIndex;
  }(Index);
  var FuelSurfaceArea = /*#__PURE__*/function (_Variant$Quantity43) {
    _inherits(FuelSurfaceArea, _Variant$Quantity43);

    var _super66 = _createSuper(FuelSurfaceArea);

    function FuelSurfaceArea() {
      _classCallCheck(this, FuelSurfaceArea);

      return _super66.call(this, Area);
    }

    return FuelSurfaceArea;
  }(Quantity);
  var FuelSurfaceAreaToVolumeRatio = /*#__PURE__*/function (_Variant$Quantity44) {
    _inherits(FuelSurfaceAreaToVolumeRatio, _Variant$Quantity44);

    var _super67 = _createSuper(FuelSurfaceAreaToVolumeRatio);

    function FuelSurfaceAreaToVolumeRatio() {
      _classCallCheck(this, FuelSurfaceAreaToVolumeRatio);

      return _super67.call(this, Savr, 1);
    }

    return FuelSurfaceAreaToVolumeRatio;
  }(Quantity);
  var FuelTotalMineralContent = /*#__PURE__*/function (_Variant$Quantity45) {
    _inherits(FuelTotalMineralContent, _Variant$Quantity45);

    var _super68 = _createSuper(FuelTotalMineralContent);

    function FuelTotalMineralContent() {
      _classCallCheck(this, FuelTotalMineralContent);

      return _super68.call(this, Fraction);
    }

    return FuelTotalMineralContent;
  }(Quantity);
  var FuelVolume = /*#__PURE__*/function (_Variant$Quantity46) {
    _inherits(FuelVolume, _Variant$Quantity46);

    var _super69 = _createSuper(FuelVolume);

    function FuelVolume() {
      _classCallCheck(this, FuelVolume);

      return _super69.call(this, Volume);
    }

    return FuelVolume;
  }(Quantity);
  var IgnitionFuelDepth = /*#__PURE__*/function (_Variant$Quantity47) {
    _inherits(IgnitionFuelDepth, _Variant$Quantity47);

    var _super70 = _createSuper(IgnitionFuelDepth);

    function IgnitionFuelDepth() {
      _classCallCheck(this, IgnitionFuelDepth);

      return _super70.call(this, Distance);
    }

    return IgnitionFuelDepth;
  }(Quantity);
  var IgnitionFuelTypeOption = /*#__PURE__*/function (_Variant$Option5) {
    _inherits(IgnitionFuelTypeOption, _Variant$Option5);

    var _super71 = _createSuper(IgnitionFuelTypeOption);

    function IgnitionFuelTypeOption() {
      _classCallCheck(this, IgnitionFuelTypeOption);

      return _super71.call(this, LightningFuels);
    }

    return IgnitionFuelTypeOption;
  }(Option);
  var IgnitionLightningChargeOption = /*#__PURE__*/function (_Variant$Option6) {
    _inherits(IgnitionLightningChargeOption, _Variant$Option6);

    var _super72 = _createSuper(IgnitionLightningChargeOption);

    function IgnitionLightningChargeOption() {
      _classCallCheck(this, IgnitionLightningChargeOption);

      return _super72.call(this, LightningCharges);
    }

    return IgnitionLightningChargeOption;
  }(Option);
  var MapArea = /*#__PURE__*/function (_Variant$Quantity48) {
    _inherits(MapArea, _Variant$Quantity48);

    var _super73 = _createSuper(MapArea);

    function MapArea() {
      _classCallCheck(this, MapArea);

      return _super73.call(this, Area);
    }

    return MapArea;
  }(Quantity);
  var MapContoursCount = /*#__PURE__*/function (_Variant$Count) {
    _inherits(MapContoursCount, _Variant$Count);

    var _super74 = _createSuper(MapContoursCount);

    function MapContoursCount() {
      _classCallCheck(this, MapContoursCount);

      return _super74.call(this, 0);
    }

    return MapContoursCount;
  }(Count);
  var MapDistance = /*#__PURE__*/function (_Variant$Quantity49) {
    _inherits(MapDistance, _Variant$Quantity49);

    var _super75 = _createSuper(MapDistance);

    function MapDistance() {
      _classCallCheck(this, MapDistance);

      return _super75.call(this, Distance);
    }

    return MapDistance;
  }(Quantity);
  var MortalityFraction = /*#__PURE__*/function (_Variant$Quantity50) {
    _inherits(MortalityFraction, _Variant$Quantity50);

    var _super76 = _createSuper(MortalityFraction);

    function MortalityFraction() {
      _classCallCheck(this, MortalityFraction);

      return _super76.call(this, Fraction);
    }

    return MortalityFraction;
  }(Quantity);
  var SlopeSteepness$1 = /*#__PURE__*/function (_Variant$Quantity51) {
    _inherits(SlopeSteepness, _Variant$Quantity51);

    var _super77 = _createSuper(SlopeSteepness);

    function SlopeSteepness() {
      _classCallCheck(this, SlopeSteepness);

      return _super77.call(this, Arc, 0, 0, 89);
    }

    return SlopeSteepness;
  }(Quantity);
  var SpottingFirebrandObject = /*#__PURE__*/function (_Variant$Blob) {
    _inherits(SpottingFirebrandObject, _Variant$Blob);

    var _super78 = _createSuper(SpottingFirebrandObject);

    // Crown fire spotting distance
    function SpottingFirebrandObject() {
      _classCallCheck(this, SpottingFirebrandObject);

      return _super78.call(this, {
        zdrop: 0,
        xdrop: 0,
        xdrift: 0,
        xspot: 0,
        layer: 0
      });
    }

    return SpottingFirebrandObject;
  }(Blob);
  var SpottingSourceLocationOption = /*#__PURE__*/function (_Variant$Option7) {
    _inherits(SpottingSourceLocationOption, _Variant$Option7);

    var _super79 = _createSuper(SpottingSourceLocationOption);

    function SpottingSourceLocationOption() {
      _classCallCheck(this, SpottingSourceLocationOption);

      return _super79.call(this, locations());
    }

    return SpottingSourceLocationOption;
  }(Option);
  var TorchingTreeSpeciesOption = /*#__PURE__*/function (_Variant$Option8) {
    _inherits(TorchingTreeSpeciesOption, _Variant$Option8);

    var _super80 = _createSuper(TorchingTreeSpeciesOption);

    function TorchingTreeSpeciesOption() {
      _classCallCheck(this, TorchingTreeSpeciesOption);

      return _super80.call(this, TorchingTreeSpecies);
    }

    return TorchingTreeSpeciesOption;
  }(Option);
  var TreeBarkThickness = /*#__PURE__*/function (_Variant$Quantity52) {
    _inherits(TreeBarkThickness, _Variant$Quantity52);

    var _super81 = _createSuper(TreeBarkThickness);

    function TreeBarkThickness() {
      _classCallCheck(this, TreeBarkThickness);

      return _super81.call(this, Distance);
    }

    return TreeBarkThickness;
  }(Quantity);
  var TreeCount = /*#__PURE__*/function (_Variant$Count2) {
    _inherits(TreeCount, _Variant$Count2);

    var _super82 = _createSuper(TreeCount);

    function TreeCount() {
      _classCallCheck(this, TreeCount);

      return _super82.call(this, 0);
    }

    return TreeCount;
  }(Count);
  var TreeDbh = /*#__PURE__*/function (_Variant$Quantity53) {
    _inherits(TreeDbh, _Variant$Quantity53);

    var _super83 = _createSuper(TreeDbh);

    function TreeDbh() {
      _classCallCheck(this, TreeDbh);

      return _super83.call(this, Distance);
    }

    return TreeDbh;
  }(Quantity);
  var TreeHeight = /*#__PURE__*/function (_Variant$Quantity54) {
    _inherits(TreeHeight, _Variant$Quantity54);

    var _super84 = _createSuper(TreeHeight);

    function TreeHeight() {
      _classCallCheck(this, TreeHeight);

      return _super84.call(this, Distance);
    }

    return TreeHeight;
  }(Quantity);
  var TreeSpeciesFofem6Option = /*#__PURE__*/function (_Variant$Option9) {
    _inherits(TreeSpeciesFofem6Option, _Variant$Option9);

    var _super85 = _createSuper(TreeSpeciesFofem6Option);

    function TreeSpeciesFofem6Option() {
      _classCallCheck(this, TreeSpeciesFofem6Option);

      return _super85.call(this, fofem6Codes());
    }

    return TreeSpeciesFofem6Option;
  }(Option);
  var WeightingFactor = /*#__PURE__*/function (_Variant$Quantity55) {
    _inherits(WeightingFactor, _Variant$Quantity55);

    var _super86 = _createSuper(WeightingFactor);

    function WeightingFactor() {
      _classCallCheck(this, WeightingFactor);

      return _super86.call(this, Fraction);
    }

    return WeightingFactor;
  }(Quantity);
  var WesternAspenTypeOption = /*#__PURE__*/function (_Variant$Option10) {
    _inherits(WesternAspenTypeOption, _Variant$Option10);

    var _super87 = _createSuper(WesternAspenTypeOption);

    function WesternAspenTypeOption() {
      _classCallCheck(this, WesternAspenTypeOption);

      return _super87.call(this, Types$1);
    }

    return WesternAspenTypeOption;
  }(Option);
  var WindSpeed$1 = /*#__PURE__*/function (_Variant$Quantity56) {
    _inherits(WindSpeed, _Variant$Quantity56);

    var _super88 = _createSuper(WindSpeed);

    function WindSpeed() {
      _classCallCheck(this, WindSpeed);

      return _super88.call(this, Velocity);
    }

    return WindSpeed;
  }(Quantity);
  var WindSpeedAdjustmentFraction = /*#__PURE__*/function (_Variant$Quantity57) {
    _inherits(WindSpeedAdjustmentFraction, _Variant$Quantity57);

    var _super89 = _createSuper(WindSpeedAdjustmentFraction);

    function WindSpeedAdjustmentFraction() {
      _classCallCheck(this, WindSpeedAdjustmentFraction);

      return _super89.call(this, Fraction);
    }

    return WindSpeedAdjustmentFraction;
  }(Quantity);

  var BpxVariantArray = [['AirTemperature', new AirTemperature()], // \todo Add Bools with specialized display strings, i.e.,
  ['ChaparralTypeOption', new ChaparralTypeOption()], ['CompassAzimuth', new CompassAzimuth()], ['ConfigChaparralTotalLoad', new ConfigChaparralTotalLoad()], ['ConfigCuredHerbFraction', new ConfigCuredHerbFraction()], ['ConfigEffectiveWindSpeedLimit', new ConfigEffectiveWindSpeedLimit()], ['ConfigFireLengthToWidthRatio', new ConfigFireLengthToWidthRatio()], ['ConfigFireVector', new ConfigFireVector()], ['ConfigFireWeightingMethod', new ConfigFireWeightingMethod()], ['ConfigFirelineIntensity', new ConfigFirelineIntensity()], ['ConfigMoistureContents', new ConfigMoistureContents()], ['ConfigModule', new ConfigModule()], ['ConfigPrimaryFuels', new ConfigPrimaryFuels()], ['ConfigSecondaryFuels', new ConfigSecondaryFuels()], ['ConfigSlopeSteepness', new ConfigSlopeSteepness()], ['ConfigWindDirection', new ConfigWindDirection()], ['ConfigWindSpeed', new ConfigWindSpeed()], ['ConfigWindSpeedAdjustmentFactor', new ConfigWindSpeedAdjustmentFactor()], ['CrownFillFraction', new CrownFillFraction()], ['CrownFireActiveRatio', new CrownFireActiveRatio()], ['CrownFireBurnedFraction', new CrownFireBurnedFraction()], ['CrownFireInitiationTypeOption', new CrownFireInitiationTypeOption()], ['CrownRatioFraction', new CrownRatioFraction()], ['CrownTransitionRatio', new CrownTransitionRatio()], ['Documentation', new Documentation()], ['FireArea', new FireArea()], ['FireDampingCoefficient', new FireDampingCoefficient()], ['FireElapsedTime', new FireElapsedTime()], ['FireFirelineIntensity', new FireFirelineIntensity()], ['FireFlameDuration', new FireFlameDuration()], ['FireFlameLength', new FireFlameLength()], ['FireHeatPerUnitArea', new FireHeatPerUnitArea()], ['FireLengthToWidthRatio', new FireLengthToWidthRatio$1()], ['FirePower', new FirePower()], ['FirePowerRatio', new FirePowerRatio()], ['FirePropagatingFluxRatio', new FirePropagatingFluxRatio()], ['FireReactionIntensity', new FireReactionIntensity()], ['FireReactionVelocity', new FireReactionVelocity()], ['FireResidenceTime', new FireResidenceTime()], ['FireScorchHeight', new FireScorchHeight()], ['FireSpotDistance', new FireSpotDistance()], ['FireSpreadDistance', new FireSpreadDistance()], ['FireSpreadRate', new FireSpreadRate()], ['FuelAge', new FuelAge()], ['FuelBasalArea', new FuelBasalArea()], ['FuelBedBulkDensity', new FuelBedBulkDensity()], ['FuelBedDepth', new FuelBedDepth()], ['FuelBedHeatOfPreignition', new FuelBedHeatOfPreignition()], ['FuelBedPackingRatio', new FuelBedPackingRatio()], ['FuelCoverFraction', new FuelCoverFraction()], ['FuelCylindricalDiameter', new FuelCylindricalDiameter()], ['FuelCylindricalVolume', new FuelCylindricalVolume()], ['FuelDeadFraction', new FuelDeadFraction()], ['FuelEffectiveHeatingNumber', new FuelEffectiveHeatingNumber()], ['FuelEffectiveMineralContent', new FuelEffectiveMineralContent()], ['FuelHeatOfCombustion', new FuelHeatOfCombustion()], ['FuelHeatOfPreignition', new FuelHeatOfPreignition()], ['FuelHeatSink', new FuelHeatSink()], ['FuelLabelText', new FuelLabelText()], ['FuelModelDomainOption', new FuelModelDomainOption()], ['FuelModelKeyOption', new FuelModelKeyOption()], ['FuelMoistureContent', new FuelMoistureContent()], ['FuelOvendryLoad', new FuelOvendryLoad()], ['FuelParticleFiberDensity', new FuelParticleFiberDensity()], ['FuelSizeClassIndex', new FuelSizeClassIndex()], ['FuelSurfaceArea', new FuelSurfaceArea()], ['FuelSurfaceAreaToVolumeRatio', new FuelSurfaceAreaToVolumeRatio()], ['FuelTotalMineralContent', new FuelTotalMineralContent()], ['FuelVolume', new FuelVolume()], ['IgnitionFuelDepth', new IgnitionFuelDepth()], ['IgnitionFuelTypeOption', new IgnitionFuelTypeOption()], ['IgnitionLightningChargeOption', new IgnitionLightningChargeOption()], ['MapArea', new MapArea()], ['MapContoursCount', new MapContoursCount()], ['MapDistance', new MapDistance()], ['MortalityFraction', new MortalityFraction()], ['SlopeSteepness', new SlopeSteepness$1()], ['SpottingFirebrandObject', new SpottingFirebrandObject()], ['SpottingSourceLocationOption', new SpottingSourceLocationOption()], ['TorchingTreeSpeciesOption', new TorchingTreeSpeciesOption()], ['TreeBarkThickness', new TreeBarkThickness()], ['TreeCount', new TreeCount()], ['TreeDbh', new TreeDbh()], ['TreeHeight', new TreeHeight()], ['TreeSpeciesFofem6Option', new TreeSpeciesFofem6Option()], ['WeightingFactor', new WeightingFactor()], ['WesternAspenTypeOption', new WesternAspenTypeOption()], ['WindSpeed', new WindSpeed$1()], ['WindSpeedAdjustmentFraction', new WindSpeedAdjustmentFraction()]];
  var BpxVariantMap = /*#__PURE__*/function (_Map) {
    _inherits(BpxVariantMap, _Map);

    var _super = _createSuper(BpxVariantMap);

    function BpxVariantMap() {
      _classCallCheck(this, BpxVariantMap);

      return _super.call(this, [].concat(_toConsumableArray(VariantArray), BpxVariantArray));
    }

    return BpxVariantMap;
  }( /*#__PURE__*/_wrapNativeSuper(Map));

  var NodeMapSize = 1208;
  var MethodMapSize = 228;
  function BpxDag(dagKey) {
    var root = new Root(BpxGenome, BpxVariantMap, MethodMap, BpxTranslationMap);
    return root.addDag(dagKey);
  }
  /*
    /1/--> surfaceFire -+->/2/--> fireEllipse -+->/3/--> scorchHeight ---/4/--> treeMortality
                        |                      |
                        |                      +->/5/--> fireContainment
                        |
                       /6/--> surfaceSpotting
                        |
                       /7/--> Crown Fire -->/8/--> Crown Spotting

    /9/--> Spotting from Pile, Trees
    /10/--> Ignition Probability
  */

  var alwaysEnabled = ['configure', 'site', 'docs'];
  var moduleEnabled = {
    // Surface Fire, Fire Ellipse, Scorch Height, Tree Mortality, Fire Containment, Surface Spotting, Crown Fire, Crown Spotting
    surfaceFire: ['surface', 'spotting', 'mortality', 'crown'],
    // Fire Ellipse, Scorch Height, Tree Mortality, Fire Containment
    fireEllipse: ['surface.fire.ellipse', 'mortality'],
    // Scorch height, Tree Mortality
    scorchHeight: ['mortality'],
    // Tree Mortality
    treeMortality: ['mortality'],
    // ['mortality.scorchHeight', false],
    // Fire Containment
    fireContainment: ['contain'],
    // Surface Fire Spotting
    surfaceSpotting: ['spotting.surfaceFire'],
    // Crown Fire, Crown Fire Spotting
    crownFire: ['crown', 'spotting.crownFire'],
    // Crown Fire Spotting
    crownSpotting: ['spotting.crownFire'],
    // Burning Pile Spotting, Torching Trees Spotting
    spottingDistance: ['spotting'],
    // Ignition Probability
    ignitionProbability: ['configure', 'site', 'docs', 'ignition']
  };
  var Modules = Object.keys(moduleEnabled);
  /**
   * Enables/disables Nodes based on the module selection
   * and reconfigures the Dag
   * @param {Dag} dag
   * @param {string} module One of the moduleEnabled keys
   */

  function configModule(dag, module) {
    var prefix = [].concat(alwaysEnabled, _toConsumableArray(moduleEnabled[module]));
    dag.node.map.forEach(function (node, key) {
      var enabled = false;

      for (var idx = 0; idx < prefix.length; idx += 1) {
        if (key.startsWith(prefix[idx])) {
          enabled = true;
          break;
        }
      }

      node.status.isEnabled = enabled;
    });
    dag.runConfigs([['configure.module', module]]);
  }

  var index$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Module: Module,
    ChaparralTotalLoad: ChaparralTotalLoad,
    CuredHerbFraction: CuredHerbFraction,
    PrimaryFuel: PrimaryFuel,
    SecondaryFuel: SecondaryFuel,
    MoistureContent: MoistureContent,
    WindSpeedAdjustmentFactor: WindSpeedAdjustmentFactor,
    SlopeSteepness: SlopeSteepness,
    WindDirection: WindDirection,
    WindSpeed: WindSpeed,
    FirelineIntensity: FirelineIntensity,
    FireLengthToWidthRatio: FireLengthToWidthRatio,
    EffectiveWindSpeedLimit: EffectiveWindSpeedLimit,
    FireWeightingMethod: FireWeightingMethod,
    FireVector: FireVector,
    ConfigDefault: ConfigDefault,
    ConfigMinimalInput: ConfigMinimalInput,
    ConfigFm010Fm124Config: ConfigFm010Fm124Config,
    ConfigFm010Fm124Input: ConfigFm010Fm124Input,
    NodeMapSize: NodeMapSize,
    MethodMapSize: MethodMapSize,
    BpxDag: BpxDag,
    Modules: Modules,
    configModule: configModule,
    BpxGenome: BpxGenome,
    BpxVariantArray: BpxVariantArray,
    BpxVariantMap: BpxVariantMap
  });

  var GraphLine = {
    color: '#000000',
    width: 1,
    style: 'solid'
  };
  var GraphVar = {
    node: null,
    units: null,
    decimals: 2,
    data: [],
    line: _objectSpread2({}, GraphLine)
  };

  const PaletteText = [
    ['palette/label@en_US', 'Variable Palette'],
    ['palette/option=common/label@en_US',
      'just the most commonly used variables'],
    [
      'palette/option=intermediate/label@en_US',
      'commonly used PLUS more technical variables'
    ],
    ['palette/option=advanced/label@en_US',
      'commonly used, technical, PLUS advanced variables']
  ];

  const SelectorText = [
    ['selector.graph.x.variable/label@en_US', 'Graph X variable'],
    [
      'selector.graph.x.variable/option=range/label@en_US',
      'Enter x-axis min and max values, and number of data points'
    ],
    [
      'selector.graph.x.variable/option=menu/label@en_US',
      'Select the x variable values'
    ],
    ['selector.graph.y.variable/label@en_US', 'Graph Y variable'],
    [
      'selector.graph.z.variable/label@en_US',
      'Graph Z variable'
    ]
  ];

  const ModuleText = [
    ['module/label@en_US', 'BehavePlus Module'],
    ['module/option=surfaceFire/label@en_US', 'Surface Fire'],
    ['module/option=fireEllipse/label@en_US', 'Fire Ellipse'],
    ['module/option=scorchHeight/label@en_US', 'Scorch Height'],
    ['module/option=treeMortality/label@en_US', 'Tree Mortality'],
    ['module/option=crownFire/label@en_US', 'Crown Fire'],
    ['module/option=spottingDistance/label@en_US', 'Spotting Distance'],
    ['module/option=ignitionProbability/label@en_US', 'Ignition Probability']
  ];

  const ProductText = [
    ['product/label@en_US', 'Product'],
    ['product/option=graph/label@en_US', 'Graph'],
    [
      'product/option=table0Ranges/label@en_US',
      'Table with no multi-valued inputs'
    ],
    [
      'product/option=table1Range/label@en_US',
      'Table with 1 multi-valued input'
    ],
    [
      'product/option=table2Ranges/label@en_US',
      'Table with 2 multi-valued inptus'
    ],
    ['product/option=runRecords/label@en_US',
      'Set of data records (any number of multi-valued inputs)'],
    ['product/option=diagram/label@en_US', 'A diagram'],
    ['product/option=caseComparison/label@en_US',
      'A set of case-wise comparisons between discrete cases'],
    ['product/option=timeSeries/label@en_US',
      'A table or graph of conditions over time']
  ];

  const SurfaceFireText = [
    [
      'surface.fire.ellipse.axis.lengthToWidthRatio/label@en_US',
      'Fire Ellipse Length-toWidth Ratio'
    ],
    [
      'surface.fire.ellipse.head.spreadRate/label@en_US',
      'Spread Rate at Ellipse Head'
    ],
    [
      'surface.fire.ellipse.head.firelineIntensity/label@en_US',
      'Fireline Intensity at Ellipse Head'
    ],
    [
      'surface.fire.ellipse.head.flameLength/label@en_US',
      'Flame Length at Ellipse Head'
    ],
    [
      'surface.fire.ellipse.head.scorchHeight/label@en_US',
      'Scorch Height at Ellipse Head'
    ],
    [
      'surface.fire.ellipse.head.spreadDistance/label@en_US',
      'Spread Distance at Ellipse Head'
    ],
    [
      'surface.fire.ellipse.head.treeMortality/label@en_US',
      'Tree Mortality at Ellipse Head'
    ],
    [
      'surface.fire.ellipse.axis.eccentricity/label@en_US',
      'Fire Ellipse Eccentricity'
    ],
    [
      'surface.primary.fuel.bed.packingRatio/label@en_US',
      'Primary Fuel Bed Packing Ratio'
    ],
    ['surface.primary.fuel.model.catalogKey', 'Primary Fuel Catalog Key'],
    [
      'surface.weighted.fire.arithmeticMean.spreadRate/label@en_US',
      'Surface Fire Maximum Spread Rate'
    ],
    [
      'surface.weighted.fire.heading.fromUpslope/label@en_US',
      'Direction of Maximum Spread from Upslope'
    ],
    [
      'surface.weighted.fire.heatPerUnitArea/label@en_US',
      'Surface Fire Heat per Unit Area'
    ]
  ];

  const SiteMoistureText = [
    ['site.moisture.dead.tl1h/label@en_US', 'Dead 1-h Fuel Moisture'],
    ['site.moisture.dead.tl10h/label@en_US', 'Dead 10-h Fuel Moisture'],
    ['site.moisture.dead.tl100h/label@en_US', 'Dead 100-h Fuel Moisture'],
    ['site.moisture.live.herb/label@en_US', 'Live Herbaceous Fuel Moisture'],
    ['site.moisture.live.stem/label@en_US', 'Live Stem Fuel Moisture']
  ];

  const ConfigureFuelText = [
    [
      'configure.fuel.primary/label@en_US',
      'Primary fuels are specified by entering'
    ],
    ['configure.fuel.primary/option=catalog/label@en_US', 'a fuel catalog key'],
    [
      'configure.fuel.primary/option=behave/label@en_US',
      'Behave fuel parameters'
    ],
    [
      'configure.fuel.primary/option=chaparral/label@en_US',
      'chaparral dynamic stand parameters'
    ],
    [
      'configure.fuel.primary/option=palmettoGallberry/label@en_US',
      'palmetto-gallberry dynamic stand parameters'
    ],
    [
      'configure.fuel.primary/option=westernAspen/label@en_US',
      'western aspen dynamic stand parameters'
    ],
    [
      'configure.fuel.secondary/label@en_US',
      'Secondary fuels are specified by entering'
    ],
    [
      'configure.fuel.secondary/option=none/label@en_US',
      'there is no secondary fuel'
    ],
    ['configure.fuel.secondary/option=catalog/label@en_US', 'a fuel catalog key'],
    [
      'configure.fuel.secondary/option=behave/label@en_US',
      'Behave fuel parameters'
    ],
    [
      'configure.fuel.secondary/option=chaparral/label@en_US',
      'chaparral dynamic stand parameters'
    ],
    [
      'configure.fuel.secondary/option=palmettoGallberry/label@en_US',
      'palmetto-gallberry dynamic stand parameters'
    ],
    [
      'configure.fuel.secondary/option=westernAspen/label@en_US',
      'western aspen dynamic stand parameters'
    ]
  ];

  const TranslationMap = new Map([
    ...ModuleText,
    ...PaletteText,
    ...ProductText,
    ...SelectorText,
    ...ConfigureFuelText,
    ...SiteMoistureText,
    ...SurfaceFireText
  ]);

  function noop() { }
  const identity = x => x;
  function assign(tar, src) {
      // @ts-ignore
      for (const k in src)
          tar[k] = src[k];
      return tar;
  }
  function add_location(element, file, line, column, char) {
      element.__svelte_meta = {
          loc: { file, line, column, char }
      };
  }
  function run(fn) {
      return fn();
  }
  function blank_object() {
      return Object.create(null);
  }
  function run_all(fns) {
      fns.forEach(run);
  }
  function is_function(thing) {
      return typeof thing === 'function';
  }
  function safe_not_equal(a, b) {
      return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
  }
  function validate_store(store, name) {
      if (store != null && typeof store.subscribe !== 'function') {
          throw new Error(`'${name}' is not a store with a 'subscribe' method`);
      }
  }
  function subscribe(store, ...callbacks) {
      if (store == null) {
          return noop;
      }
      const unsub = store.subscribe(...callbacks);
      return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function component_subscribe(component, store, callback) {
      component.$$.on_destroy.push(subscribe(store, callback));
  }
  function create_slot(definition, ctx, $$scope, fn) {
      if (definition) {
          const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
          return definition[0](slot_ctx);
      }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
      return definition[1] && fn
          ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
          : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
      if (definition[2] && fn) {
          const lets = definition[2](fn(dirty));
          if ($$scope.dirty === undefined) {
              return lets;
          }
          if (typeof lets === 'object') {
              const merged = [];
              const len = Math.max($$scope.dirty.length, lets.length);
              for (let i = 0; i < len; i += 1) {
                  merged[i] = $$scope.dirty[i] | lets[i];
              }
              return merged;
          }
          return $$scope.dirty | lets;
      }
      return $$scope.dirty;
  }
  function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
      const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
      if (slot_changes) {
          const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
          slot.p(slot_context, slot_changes);
      }
  }
  function exclude_internal_props(props) {
      const result = {};
      for (const k in props)
          if (k[0] !== '$')
              result[k] = props[k];
      return result;
  }

  const is_client = typeof window !== 'undefined';
  let now = is_client
      ? () => window.performance.now()
      : () => Date.now();
  let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

  const tasks = new Set();
  function run_tasks(now) {
      tasks.forEach(task => {
          if (!task.c(now)) {
              tasks.delete(task);
              task.f();
          }
      });
      if (tasks.size !== 0)
          raf(run_tasks);
  }
  /**
   * Creates a new task that runs on each raf frame
   * until it returns a falsy value or is aborted
   */
  function loop(callback) {
      let task;
      if (tasks.size === 0)
          raf(run_tasks);
      return {
          promise: new Promise(fulfill => {
              tasks.add(task = { c: callback, f: fulfill });
          }),
          abort() {
              tasks.delete(task);
          }
      };
  }

  function append(target, node) {
      target.appendChild(node);
  }
  function insert(target, node, anchor) {
      target.insertBefore(node, anchor || null);
  }
  function detach(node) {
      node.parentNode.removeChild(node);
  }
  function destroy_each(iterations, detaching) {
      for (let i = 0; i < iterations.length; i += 1) {
          if (iterations[i])
              iterations[i].d(detaching);
      }
  }
  function element(name) {
      return document.createElement(name);
  }
  function text(data) {
      return document.createTextNode(data);
  }
  function space() {
      return text(' ');
  }
  function empty() {
      return text('');
  }
  function listen(node, event, handler, options) {
      node.addEventListener(event, handler, options);
      return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
      if (value == null)
          node.removeAttribute(attribute);
      else if (node.getAttribute(attribute) !== value)
          node.setAttribute(attribute, value);
  }
  function set_attributes(node, attributes) {
      // @ts-ignore
      const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
      for (const key in attributes) {
          if (attributes[key] == null) {
              node.removeAttribute(key);
          }
          else if (key === 'style') {
              node.style.cssText = attributes[key];
          }
          else if (key === '__value') {
              node.value = node[key] = attributes[key];
          }
          else if (descriptors[key] && descriptors[key].set) {
              node[key] = attributes[key];
          }
          else {
              attr(node, key, attributes[key]);
          }
      }
  }
  function children(element) {
      return Array.from(element.childNodes);
  }
  function set_style(node, key, value, important) {
      node.style.setProperty(key, value, important ? 'important' : '');
  }
  function toggle_class(element, name, toggle) {
      element.classList[toggle ? 'add' : 'remove'](name);
  }
  function custom_event(type, detail) {
      const e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, false, false, detail);
      return e;
  }

  const active_docs = new Set();
  let active = 0;
  // https://github.com/darkskyapp/string-hash/blob/master/index.js
  function hash(str) {
      let hash = 5381;
      let i = str.length;
      while (i--)
          hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
      return hash >>> 0;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
      const step = 16.666 / duration;
      let keyframes = '{\n';
      for (let p = 0; p <= 1; p += step) {
          const t = a + (b - a) * ease(p);
          keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
      }
      const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
      const name = `__svelte_${hash(rule)}_${uid}`;
      const doc = node.ownerDocument;
      active_docs.add(doc);
      const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
      const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
      if (!current_rules[name]) {
          current_rules[name] = true;
          stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
      }
      const animation = node.style.animation || '';
      node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
      active += 1;
      return name;
  }
  function delete_rule(node, name) {
      const previous = (node.style.animation || '').split(', ');
      const next = previous.filter(name
          ? anim => anim.indexOf(name) < 0 // remove specific animation
          : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
      );
      const deleted = previous.length - next.length;
      if (deleted) {
          node.style.animation = next.join(', ');
          active -= deleted;
          if (!active)
              clear_rules();
      }
  }
  function clear_rules() {
      raf(() => {
          if (active)
              return;
          active_docs.forEach(doc => {
              const stylesheet = doc.__svelte_stylesheet;
              let i = stylesheet.cssRules.length;
              while (i--)
                  stylesheet.deleteRule(i);
              doc.__svelte_rules = {};
          });
          active_docs.clear();
      });
  }

  let current_component;
  function set_current_component(component) {
      current_component = component;
  }
  function get_current_component() {
      if (!current_component)
          throw new Error(`Function called outside component initialization`);
      return current_component;
  }
  function onMount(fn) {
      get_current_component().$$.on_mount.push(fn);
  }
  function createEventDispatcher() {
      const component = get_current_component();
      return (type, detail) => {
          const callbacks = component.$$.callbacks[type];
          if (callbacks) {
              // TODO are there situations where events could be dispatched
              // in a server (non-DOM) environment?
              const event = custom_event(type, detail);
              callbacks.slice().forEach(fn => {
                  fn.call(component, event);
              });
          }
      };
  }
  function setContext(key, context) {
      get_current_component().$$.context.set(key, context);
  }
  function getContext(key) {
      return get_current_component().$$.context.get(key);
  }
  // TODO figure out if we still want to support
  // shorthand events, or if we want to implement
  // a real bubbling mechanism
  function bubble(component, event) {
      const callbacks = component.$$.callbacks[event.type];
      if (callbacks) {
          callbacks.slice().forEach(fn => fn(event));
      }
  }

  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
      if (!update_scheduled) {
          update_scheduled = true;
          resolved_promise.then(flush);
      }
  }
  function add_render_callback(fn) {
      render_callbacks.push(fn);
  }
  let flushing = false;
  const seen_callbacks = new Set();
  function flush() {
      if (flushing)
          return;
      flushing = true;
      do {
          // first, call beforeUpdate functions
          // and update components
          for (let i = 0; i < dirty_components.length; i += 1) {
              const component = dirty_components[i];
              set_current_component(component);
              update$1(component.$$);
          }
          dirty_components.length = 0;
          while (binding_callbacks.length)
              binding_callbacks.pop()();
          // then, once components are updated, call
          // afterUpdate functions. This may cause
          // subsequent updates...
          for (let i = 0; i < render_callbacks.length; i += 1) {
              const callback = render_callbacks[i];
              if (!seen_callbacks.has(callback)) {
                  // ...so guard against infinite loops
                  seen_callbacks.add(callback);
                  callback();
              }
          }
          render_callbacks.length = 0;
      } while (dirty_components.length);
      while (flush_callbacks.length) {
          flush_callbacks.pop()();
      }
      update_scheduled = false;
      flushing = false;
      seen_callbacks.clear();
  }
  function update$1($$) {
      if ($$.fragment !== null) {
          $$.update();
          run_all($$.before_update);
          const dirty = $$.dirty;
          $$.dirty = [-1];
          $$.fragment && $$.fragment.p($$.ctx, dirty);
          $$.after_update.forEach(add_render_callback);
      }
  }

  let promise;
  function wait() {
      if (!promise) {
          promise = Promise.resolve();
          promise.then(() => {
              promise = null;
          });
      }
      return promise;
  }
  function dispatch(node, direction, kind) {
      node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
  }
  const outroing = new Set();
  let outros;
  function group_outros() {
      outros = {
          r: 0,
          c: [],
          p: outros // parent group
      };
  }
  function check_outros() {
      if (!outros.r) {
          run_all(outros.c);
      }
      outros = outros.p;
  }
  function transition_in(block, local) {
      if (block && block.i) {
          outroing.delete(block);
          block.i(local);
      }
  }
  function transition_out(block, local, detach, callback) {
      if (block && block.o) {
          if (outroing.has(block))
              return;
          outroing.add(block);
          outros.c.push(() => {
              outroing.delete(block);
              if (callback) {
                  if (detach)
                      block.d(1);
                  callback();
              }
          });
          block.o(local);
      }
  }
  const null_transition = { duration: 0 };
  function create_bidirectional_transition(node, fn, params, intro) {
      let config = fn(node, params);
      let t = intro ? 0 : 1;
      let running_program = null;
      let pending_program = null;
      let animation_name = null;
      function clear_animation() {
          if (animation_name)
              delete_rule(node, animation_name);
      }
      function init(program, duration) {
          const d = program.b - t;
          duration *= Math.abs(d);
          return {
              a: t,
              b: program.b,
              d,
              duration,
              start: program.start,
              end: program.start + duration,
              group: program.group
          };
      }
      function go(b) {
          const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
          const program = {
              start: now() + delay,
              b
          };
          if (!b) {
              // @ts-ignore todo: improve typings
              program.group = outros;
              outros.r += 1;
          }
          if (running_program) {
              pending_program = program;
          }
          else {
              // if this is an intro, and there's a delay, we need to do
              // an initial tick and/or apply CSS animation immediately
              if (css) {
                  clear_animation();
                  animation_name = create_rule(node, t, b, duration, delay, easing, css);
              }
              if (b)
                  tick(0, 1);
              running_program = init(program, duration);
              add_render_callback(() => dispatch(node, b, 'start'));
              loop(now => {
                  if (pending_program && now > pending_program.start) {
                      running_program = init(pending_program, duration);
                      pending_program = null;
                      dispatch(node, running_program.b, 'start');
                      if (css) {
                          clear_animation();
                          animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                      }
                  }
                  if (running_program) {
                      if (now >= running_program.end) {
                          tick(t = running_program.b, 1 - t);
                          dispatch(node, running_program.b, 'end');
                          if (!pending_program) {
                              // we're done
                              if (running_program.b) {
                                  // intro — we can tidy up immediately
                                  clear_animation();
                              }
                              else {
                                  // outro — needs to be coordinated
                                  if (!--running_program.group.r)
                                      run_all(running_program.group.c);
                              }
                          }
                          running_program = null;
                      }
                      else if (now >= running_program.start) {
                          const p = now - running_program.start;
                          t = running_program.a + running_program.d * easing(p / running_program.duration);
                          tick(t, 1 - t);
                      }
                  }
                  return !!(running_program || pending_program);
              });
          }
      }
      return {
          run(b) {
              if (is_function(config)) {
                  wait().then(() => {
                      // @ts-ignore
                      config = config();
                      go(b);
                  });
              }
              else {
                  go(b);
              }
          },
          end() {
              clear_animation();
              running_program = pending_program = null;
          }
      };
  }

  function get_spread_update(levels, updates) {
      const update = {};
      const to_null_out = {};
      const accounted_for = { $$scope: 1 };
      let i = levels.length;
      while (i--) {
          const o = levels[i];
          const n = updates[i];
          if (n) {
              for (const key in o) {
                  if (!(key in n))
                      to_null_out[key] = 1;
              }
              for (const key in n) {
                  if (!accounted_for[key]) {
                      update[key] = n[key];
                      accounted_for[key] = 1;
                  }
              }
              levels[i] = n;
          }
          else {
              for (const key in o) {
                  accounted_for[key] = 1;
              }
          }
      }
      for (const key in to_null_out) {
          if (!(key in update))
              update[key] = undefined;
      }
      return update;
  }
  function get_spread_object(spread_props) {
      return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
  }
  function create_component(block) {
      block && block.c();
  }
  function mount_component(component, target, anchor) {
      const { fragment, on_mount, on_destroy, after_update } = component.$$;
      fragment && fragment.m(target, anchor);
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
          const new_on_destroy = on_mount.map(run).filter(is_function);
          if (on_destroy) {
              on_destroy.push(...new_on_destroy);
          }
          else {
              // Edge case - component was destroyed immediately,
              // most likely as a result of a binding initialising
              run_all(new_on_destroy);
          }
          component.$$.on_mount = [];
      });
      after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
      const $$ = component.$$;
      if ($$.fragment !== null) {
          run_all($$.on_destroy);
          $$.fragment && $$.fragment.d(detaching);
          // TODO null out other refs, including component.$$ (but need to
          // preserve final state?)
          $$.on_destroy = $$.fragment = null;
          $$.ctx = [];
      }
  }
  function make_dirty(component, i) {
      if (component.$$.dirty[0] === -1) {
          dirty_components.push(component);
          schedule_update();
          component.$$.dirty.fill(0);
      }
      component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
  }
  function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
      const parent_component = current_component;
      set_current_component(component);
      const prop_values = options.props || {};
      const $$ = component.$$ = {
          fragment: null,
          ctx: null,
          // state
          props,
          update: noop,
          not_equal,
          bound: blank_object(),
          // lifecycle
          on_mount: [],
          on_destroy: [],
          before_update: [],
          after_update: [],
          context: new Map(parent_component ? parent_component.$$.context : []),
          // everything else
          callbacks: blank_object(),
          dirty
      };
      let ready = false;
      $$.ctx = instance
          ? instance(component, prop_values, (i, ret, ...rest) => {
              const value = rest.length ? rest[0] : ret;
              if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                  if ($$.bound[i])
                      $$.bound[i](value);
                  if (ready)
                      make_dirty(component, i);
              }
              return ret;
          })
          : [];
      $$.update();
      ready = true;
      run_all($$.before_update);
      // `false` as a special case of no DOM component
      $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
      if (options.target) {
          if (options.hydrate) {
              const nodes = children(options.target);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.l(nodes);
              nodes.forEach(detach);
          }
          else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.c();
          }
          if (options.intro)
              transition_in(component.$$.fragment);
          mount_component(component, options.target, options.anchor);
          flush();
      }
      set_current_component(parent_component);
  }
  class SvelteComponent {
      $destroy() {
          destroy_component(this, 1);
          this.$destroy = noop;
      }
      $on(type, callback) {
          const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
          callbacks.push(callback);
          return () => {
              const index = callbacks.indexOf(callback);
              if (index !== -1)
                  callbacks.splice(index, 1);
          };
      }
      $set() {
          // overridden by instance, if it has props
      }
  }

  function dispatch_dev(type, detail) {
      document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.0' }, detail)));
  }
  function append_dev(target, node) {
      dispatch_dev("SvelteDOMInsert", { target, node });
      append(target, node);
  }
  function insert_dev(target, node, anchor) {
      dispatch_dev("SvelteDOMInsert", { target, node, anchor });
      insert(target, node, anchor);
  }
  function detach_dev(node) {
      dispatch_dev("SvelteDOMRemove", { node });
      detach(node);
  }
  function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
      const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
      if (has_prevent_default)
          modifiers.push('preventDefault');
      if (has_stop_propagation)
          modifiers.push('stopPropagation');
      dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
      const dispose = listen(node, event, handler, options);
      return () => {
          dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
          dispose();
      };
  }
  function attr_dev(node, attribute, value) {
      attr(node, attribute, value);
      if (value == null)
          dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
      else
          dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
  }
  function prop_dev(node, property, value) {
      node[property] = value;
      dispatch_dev("SvelteDOMSetProperty", { node, property, value });
  }
  function set_data_dev(text, data) {
      data = '' + data;
      if (text.data === data)
          return;
      dispatch_dev("SvelteDOMSetData", { node: text, data });
      text.data = data;
  }
  function validate_each_argument(arg) {
      if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
          let msg = '{#each} only iterates over array-like objects.';
          if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
              msg += ' You can use a spread to convert this iterable into an array.';
          }
          throw new Error(msg);
      }
  }
  function validate_slots(name, slot, keys) {
      for (const slot_key of Object.keys(slot)) {
          if (!~keys.indexOf(slot_key)) {
              console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
          }
      }
  }
  class SvelteComponentDev extends SvelteComponent {
      constructor(options) {
          if (!options || (!options.target && !options.$$inline)) {
              throw new Error(`'target' is a required option`);
          }
          super();
      }
      $destroy() {
          super.$destroy();
          this.$destroy = () => {
              console.warn(`Component was already destroyed`); // eslint-disable-line no-console
          };
      }
      $capture_state() { }
      $inject_state() { }
  }

  const getGraphPages = function () {
    return [
      {
        id: 'graphIntroPage',
        title: 'Begin Graph',
        component: 'GraphIntro'
      }, {
        id: 'graphYVariablePage',
        title: 'Select Graph Y Variable',
        component: 'GraphYVariable'
      }, {
        id: 'graphModelConfigPage',
        title: 'Configure Fire Modules',
        component: 'GraphModelConfig'
      }, {
        id: 'graphXVariablePage',
        title: 'Select Graph X Variable',
        component: 'GraphXVariable'
      }, {
        id: 'graphZVariablePage',
        title: 'Select Graph Z Variable',
        component: 'GraphZVariable'
      }, {
        id: 'graphInputsPage',
        title: 'Enter Fire Model Inputs',
        component: 'GraphInputs'
      }, {
        id: 'graphDecorationsPage',
        title: 'Enter Graph Decorations',
        component: 'GraphDecorations'
      }, {
        id: 'graphResultsPage',
        title: 'View Graph',
        component: 'GraphResults'
      }
    ]
  };

  /* C:\cbevins\dev\node\fire-portfolio\src\components\SinglePageApp\SinglePageApp.svelte generated by Svelte v3.23.0 */
  const file = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\SinglePageApp\\SinglePageApp.svelte";

  function get_each_context(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[3] = list[i];
  	child_ctx[5] = i;
  	return child_ctx;
  }

  // (12:4) {#each pages as page, pageIndex}
  function create_each_block(ctx) {
  	let t;
  	let hr;
  	let current;
  	var switch_value = /*getComponent*/ ctx[1](/*page*/ ctx[3].component);

  	function switch_props(ctx) {
  		return {
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[5]
  			},
  			$$inline: true
  		};
  	}

  	if (switch_value) {
  		var switch_instance = new switch_value(switch_props(ctx));
  	}

  	const block = {
  		c: function create() {
  			if (switch_instance) create_component(switch_instance.$$.fragment);
  			t = space();
  			hr = element("hr");
  			add_location(hr, file, 13, 6, 504);
  		},
  		m: function mount(target, anchor) {
  			if (switch_instance) {
  				mount_component(switch_instance, target, anchor);
  			}

  			insert_dev(target, t, anchor);
  			insert_dev(target, hr, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (switch_value !== (switch_value = /*getComponent*/ ctx[1](/*page*/ ctx[3].component))) {
  				if (switch_instance) {
  					group_outros();
  					const old_component = switch_instance;

  					transition_out(old_component.$$.fragment, 1, 0, () => {
  						destroy_component(old_component, 1);
  					});

  					check_outros();
  				}

  				if (switch_value) {
  					switch_instance = new switch_value(switch_props(ctx));
  					create_component(switch_instance.$$.fragment);
  					transition_in(switch_instance.$$.fragment, 1);
  					mount_component(switch_instance, t.parentNode, t);
  				} else {
  					switch_instance = null;
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (switch_instance) destroy_component(switch_instance, detaching);
  			if (detaching) detach_dev(t);
  			if (detaching) detach_dev(hr);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block.name,
  		type: "each",
  		source: "(12:4) {#each pages as page, pageIndex}",
  		ctx
  	});

  	return block;
  }

  function create_fragment(ctx) {
  	let div;
  	let main;
  	let current;
  	let each_value = /*pages*/ ctx[0];
  	validate_each_argument(each_value);
  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  	}

  	const out = i => transition_out(each_blocks[i], 1, 1, () => {
  		each_blocks[i] = null;
  	});

  	const block = {
  		c: function create() {
  			div = element("div");
  			main = element("main");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			attr_dev(main, "role", "main");
  			attr_dev(main, "class", "col-md-12 ml-sm-auto col-lg-10 px-md-4");
  			set_style(main, "height", "400px");
  			add_location(main, file, 10, 2, 290);
  			attr_dev(div, "class", "container-fluid");
  			add_location(div, file, 9, 0, 258);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);
  			append_dev(div, main);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(main, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*getComponent, pages*/ 3) {
  				each_value = /*pages*/ ctx[0];
  				validate_each_argument(each_value);
  				let i;

  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  						transition_in(each_blocks[i], 1);
  					} else {
  						each_blocks[i] = create_each_block(child_ctx);
  						each_blocks[i].c();
  						transition_in(each_blocks[i], 1);
  						each_blocks[i].m(main, null);
  					}
  				}

  				group_outros();

  				for (i = each_value.length; i < each_blocks.length; i += 1) {
  					out(i);
  				}

  				check_outros();
  			}
  		},
  		i: function intro(local) {
  			if (current) return;

  			for (let i = 0; i < each_value.length; i += 1) {
  				transition_in(each_blocks[i]);
  			}

  			current = true;
  		},
  		o: function outro(local) {
  			each_blocks = each_blocks.filter(Boolean);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				transition_out(each_blocks[i]);
  			}

  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			destroy_each(each_blocks, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance($$self, $$props, $$invalidate) {
  	let pages = getGraphPages();
  	const { getMap, getComponent } = getContext("componentMap");
  	const writable_props = [];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SinglePageApp> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("SinglePageApp", $$slots, []);

  	$$self.$capture_state = () => ({
  		getContext,
  		getGraphPages,
  		pages,
  		getMap,
  		getComponent
  	});

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, getComponent];
  }

  class SinglePageApp extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance, create_fragment, safe_not_equal, {});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "SinglePageApp",
  			options,
  			id: create_fragment.name
  		});
  	}
  }

  const subscriber_queue = [];
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */
  function writable(value, start = noop) {
      let stop;
      const subscribers = [];
      function set(new_value) {
          if (safe_not_equal(value, new_value)) {
              value = new_value;
              if (stop) { // store is ready
                  const run_queue = !subscriber_queue.length;
                  for (let i = 0; i < subscribers.length; i += 1) {
                      const s = subscribers[i];
                      s[1]();
                      subscriber_queue.push(s, value);
                  }
                  if (run_queue) {
                      for (let i = 0; i < subscriber_queue.length; i += 2) {
                          subscriber_queue[i][0](subscriber_queue[i + 1]);
                      }
                      subscriber_queue.length = 0;
                  }
              }
          }
      }
      function update(fn) {
          set(fn(value));
      }
      function subscribe(run, invalidate = noop) {
          const subscriber = [run, invalidate];
          subscribers.push(subscriber);
          if (subscribers.length === 1) {
              stop = start(set) || noop;
          }
          run(value);
          return () => {
              const index = subscribers.indexOf(subscriber);
              if (index !== -1) {
                  subscribers.splice(index, 1);
              }
              if (subscribers.length === 0) {
                  stop();
                  stop = null;
              }
          };
      }
      return { set, update, subscribe };
  }

  // This extends the Dag.node.map via shared keys
  // with additional user interface properties
  // such as 'selected', 'label', 'units', etc props

  const variableMap = new Map([
    ['a1', { selected: false, label: 'Maximum Fire Spread Rate' }],
    ['a2', { selected: false, label: 'Direction of Maximum Spread from Upslope' }],
    ['a3', { selected: false, label: 'Maximum Flame Length' }],
    ['b1', { selected: false, label: 'Spread Rate at Ellipse Head' }],
    ['b2', { selected: false, label: 'Flame Length at Ellipse Head' }],
    ['b3', { selected: false, label: 'Spread Rate at Ellipse Flank' }],
    ['b4', { selected: false, label: 'Flame Length at Ellipse Flank' }],
    ['b5', { selected: false, label: 'Spread Rate at Ellipse Back' }],
    ['b6', { selected: false, label: 'Flame Length at Ellipse Back' }],
    ['c1', { selected: false, label: 'Scorch Height' }],
    ['d1', { selected: false, label: 'Tree Mortality' }],
    ['d2', { selected: false, label: 'Bark Thckness' }],
    ['d3', { selected: false, label: 'Scorch Height' }]
  ]);

  function v (key) {
    const obj = variableMap.get(key);
    return {
      type: 'item',
      key: key,
      label: obj.label,
      items: [],
      selected: obj.selected
    }
  }

  const variableTree = [
    {
      type: 'container',
      key: 'surfaceFire',
      label: 'Surface Fire',
      items: [v('a1'), v('a2'), v('a3')]
    }, {
      type: 'container',
      key: 'fireEllipse',
      label: 'Fire Ellipse',
      items: [v('b1'), v('b2'), v('b3'), v('b4'), v('b5'), v('b6')]
    }, {
      type: 'container',
      key: 'scorchHeight',
      label: 'Scorch Height',
      items: [v('c1')]
    }, {
      type: 'container',
      key: 'treeMortality',
      label: 'Tree Mortality',
      items: [v('d1'), v('d2'), v('d3')]
    }
  ];

  const initialSelected = [];
  variableMap.forEach(item => {
    if ( item.isSelected ) {
      initialSelected.push(item.key);
    }
  });

  const _selected = writable(initialSelected);

  _selected.select = (item, isSelected) => _selected.update(currentItems => {
    variableMap.get(item).selected = isSelected;
    return isSelected ? [...currentItems, item]
      : currentItems.filter(key => key !== item)
  });

  function cubicOut(t) {
      const f = t - 1.0;
      return f * f * f + 1.0;
  }

  function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
      const style = getComputedStyle(node);
      const opacity = +style.opacity;
      const height = parseFloat(style.height);
      const padding_top = parseFloat(style.paddingTop);
      const padding_bottom = parseFloat(style.paddingBottom);
      const margin_top = parseFloat(style.marginTop);
      const margin_bottom = parseFloat(style.marginBottom);
      const border_top_width = parseFloat(style.borderTopWidth);
      const border_bottom_width = parseFloat(style.borderBottomWidth);
      return {
          delay,
          duration,
          easing,
          css: t => `overflow: hidden;` +
              `opacity: ${Math.min(t * 20, 1) * opacity};` +
              `height: ${t * height}px;` +
              `padding-top: ${t * padding_top}px;` +
              `padding-bottom: ${t * padding_bottom}px;` +
              `margin-top: ${t * margin_top}px;` +
              `margin-bottom: ${t * margin_bottom}px;` +
              `border-top-width: ${t * border_top_width}px;` +
              `border-bottom-width: ${t * border_bottom_width}px;`
      };
  }

  function toVal(mix) {
  	var k, y, str='';

  	if (typeof mix === 'string' || typeof mix === 'number') {
  		str += mix;
  	} else if (typeof mix === 'object') {
  		if (Array.isArray(mix)) {
  			for (k=0; k < mix.length; k++) {
  				if (mix[k]) {
  					if (y = toVal(mix[k])) {
  						str && (str += ' ');
  						str += y;
  					}
  				}
  			}
  		} else {
  			for (k in mix) {
  				if (mix[k]) {
  					str && (str += ' ');
  					str += k;
  				}
  			}
  		}
  	}

  	return str;
  }

  function clsx () {
  	var i=0, tmp, x, str='';
  	while (i < arguments.length) {
  		if (tmp = arguments[i++]) {
  			if (x = toVal(tmp)) {
  				str && (str += ' ');
  				str += x;
  			}
  		}
  	}
  	return str;
  }

  function isObject(value) {
    const type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  function getColumnSizeClass(isXs, colWidth, colSize) {
    if (colSize === true || colSize === '') {
      return isXs ? 'col' : `col-${colWidth}`;
    } else if (colSize === 'auto') {
      return isXs ? 'col-auto' : `col-${colWidth}-auto`;
    }

    return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
  }

  function clean($$props) {
    const rest = {};
    for (const key of Object.keys($$props)) {
      if (key !== "children" && key !== "$$scope" && key !== "$$slots") {
        rest[key] = $$props[key];
      }
    }
    return rest;
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\Badge.svelte generated by Svelte v3.23.0 */
  const file$1 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\Badge.svelte";

  // (30:0) {:else}
  function create_else_block_1(ctx) {
  	let span;
  	let current_block_type_index;
  	let if_block;
  	let current;
  	const if_block_creators = [create_if_block_2, create_else_block_2];
  	const if_blocks = [];

  	function select_block_type_2(ctx, dirty) {
  		if (/*children*/ ctx[0]) return 0;
  		return 1;
  	}

  	current_block_type_index = select_block_type_2(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  	let span_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[2] }];
  	let span_data = {};

  	for (let i = 0; i < span_levels.length; i += 1) {
  		span_data = assign(span_data, span_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			span = element("span");
  			if_block.c();
  			set_attributes(span, span_data);
  			add_location(span, file$1, 30, 2, 548);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  			if_blocks[current_block_type_index].m(span, null);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type_2(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(span, null);
  			}

  			set_attributes(span, span_data = get_spread_update(span_levels, [
  				dirty & /*props*/ 8 && /*props*/ ctx[3],
  				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  			if_blocks[current_block_type_index].d();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block_1.name,
  		type: "else",
  		source: "(30:0) {:else}",
  		ctx
  	});

  	return block;
  }

  // (22:0) {#if href}
  function create_if_block(ctx) {
  	let a;
  	let current_block_type_index;
  	let if_block;
  	let current;
  	const if_block_creators = [create_if_block_1, create_else_block];
  	const if_blocks = [];

  	function select_block_type_1(ctx, dirty) {
  		if (/*children*/ ctx[0]) return 0;
  		return 1;
  	}

  	current_block_type_index = select_block_type_1(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  	let a_levels = [/*props*/ ctx[3], { href: /*href*/ ctx[1] }, { class: /*classes*/ ctx[2] }];
  	let a_data = {};

  	for (let i = 0; i < a_levels.length; i += 1) {
  		a_data = assign(a_data, a_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			a = element("a");
  			if_block.c();
  			set_attributes(a, a_data);
  			add_location(a, file$1, 22, 2, 420);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, a, anchor);
  			if_blocks[current_block_type_index].m(a, null);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type_1(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(a, null);
  			}

  			set_attributes(a, a_data = get_spread_update(a_levels, [
  				dirty & /*props*/ 8 && /*props*/ ctx[3],
  				dirty & /*href*/ 2 && { href: /*href*/ ctx[1] },
  				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(a);
  			if_blocks[current_block_type_index].d();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block.name,
  		type: "if",
  		source: "(22:0) {#if href}",
  		ctx
  	});

  	return block;
  }

  // (34:4) {:else}
  function create_else_block_2(ctx) {
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[9].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

  	const block = {
  		c: function create() {
  			if (default_slot) default_slot.c();
  		},
  		m: function mount(target, anchor) {
  			if (default_slot) {
  				default_slot.m(target, anchor);
  			}

  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 256) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block_2.name,
  		type: "else",
  		source: "(34:4) {:else}",
  		ctx
  	});

  	return block;
  }

  // (32:4) {#if children}
  function create_if_block_2(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = text(/*children*/ ctx[0]);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block_2.name,
  		type: "if",
  		source: "(32:4) {#if children}",
  		ctx
  	});

  	return block;
  }

  // (26:4) {:else}
  function create_else_block(ctx) {
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[9].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

  	const block = {
  		c: function create() {
  			if (default_slot) default_slot.c();
  		},
  		m: function mount(target, anchor) {
  			if (default_slot) {
  				default_slot.m(target, anchor);
  			}

  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 256) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block.name,
  		type: "else",
  		source: "(26:4) {:else}",
  		ctx
  	});

  	return block;
  }

  // (24:4) {#if children}
  function create_if_block_1(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = text(/*children*/ ctx[0]);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block_1.name,
  		type: "if",
  		source: "(24:4) {#if children}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$1(ctx) {
  	let current_block_type_index;
  	let if_block;
  	let if_block_anchor;
  	let current;
  	const if_block_creators = [create_if_block, create_else_block_1];
  	const if_blocks = [];

  	function select_block_type(ctx, dirty) {
  		if (/*href*/ ctx[1]) return 0;
  		return 1;
  	}

  	current_block_type_index = select_block_type(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

  	const block = {
  		c: function create() {
  			if_block.c();
  			if_block_anchor = empty();
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			if_blocks[current_block_type_index].m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(if_block_anchor.parentNode, if_block_anchor);
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if_blocks[current_block_type_index].d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$1.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$1($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	let { children = undefined } = $$props;
  	let { color = "secondary" } = $$props;
  	let { href = undefined } = $$props;
  	let { pill = false } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Badge", $$slots, ['default']);

  	$$self.$set = $$new_props => {
  		$$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
  		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
  		if ("color" in $$new_props) $$invalidate(5, color = $$new_props.color);
  		if ("href" in $$new_props) $$invalidate(1, href = $$new_props.href);
  		if ("pill" in $$new_props) $$invalidate(6, pill = $$new_props.pill);
  		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		clsx,
  		clean,
  		className,
  		children,
  		color,
  		href,
  		pill,
  		props,
  		classes
  	});

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(7, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
  		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
  		if ("color" in $$props) $$invalidate(5, color = $$new_props.color);
  		if ("href" in $$props) $$invalidate(1, href = $$new_props.href);
  		if ("pill" in $$props) $$invalidate(6, pill = $$new_props.pill);
  		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className, color, pill*/ 112) {
  			 $$invalidate(2, classes = clsx(className, "badge", `badge-${color}`, pill ? "badge-pill" : false));
  		}
  	};

  	$$props = exclude_internal_props($$props);

  	return [
  		children,
  		href,
  		classes,
  		props,
  		className,
  		color,
  		pill,
  		$$props,
  		$$scope,
  		$$slots
  	];
  }

  class Badge extends SvelteComponentDev {
  	constructor(options) {
  		super(options);

  		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
  			class: 4,
  			children: 0,
  			color: 5,
  			href: 1,
  			pill: 6
  		});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Badge",
  			options,
  			id: create_fragment$1.name
  		});
  	}

  	get class() {
  		throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get children() {
  		throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set children(value) {
  		throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get color() {
  		throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set color(value) {
  		throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get href() {
  		throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set href(value) {
  		throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pill() {
  		throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pill(value) {
  		throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.23.0 */
  const file$2 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\Button.svelte";

  // (53:0) {:else}
  function create_else_block_1$1(ctx) {
  	let button;
  	let current;
  	let mounted;
  	let dispose;
  	const default_slot_template = /*$$slots*/ ctx[19].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
  	const default_slot_or_fallback = default_slot || fallback_block(ctx);

  	let button_levels = [
  		/*props*/ ctx[10],
  		{ id: /*id*/ ctx[4] },
  		{ class: /*classes*/ ctx[8] },
  		{ disabled: /*disabled*/ ctx[2] },
  		{ value: /*value*/ ctx[6] },
  		{
  			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
  		},
  		{ style: /*style*/ ctx[5] }
  	];

  	let button_data = {};

  	for (let i = 0; i < button_levels.length; i += 1) {
  		button_data = assign(button_data, button_levels[i]);
  	}

  	const block_1 = {
  		c: function create() {
  			button = element("button");
  			if (default_slot_or_fallback) default_slot_or_fallback.c();
  			set_attributes(button, button_data);
  			add_location(button, file$2, 53, 2, 1061);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, button, anchor);

  			if (default_slot_or_fallback) {
  				default_slot_or_fallback.m(button, null);
  			}

  			current = true;

  			if (!mounted) {
  				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
  				mounted = true;
  			}
  		},
  		p: function update(ctx, dirty) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 262144) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, null, null);
  				}
  			} else {
  				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*close, children, $$scope*/ 262147) {
  					default_slot_or_fallback.p(ctx, dirty);
  				}
  			}

  			set_attributes(button, button_data = get_spread_update(button_levels, [
  				dirty & /*props*/ 1024 && /*props*/ ctx[10],
  				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
  				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
  				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
  				dirty & /*value*/ 64 && { value: /*value*/ ctx[6] },
  				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
  					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
  				},
  				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot_or_fallback, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot_or_fallback, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(button);
  			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: create_else_block_1$1.name,
  		type: "else",
  		source: "(53:0) {:else}",
  		ctx
  	});

  	return block_1;
  }

  // (37:0) {#if href}
  function create_if_block$1(ctx) {
  	let a;
  	let current_block_type_index;
  	let if_block;
  	let current;
  	let mounted;
  	let dispose;
  	const if_block_creators = [create_if_block_1$1, create_else_block$1];
  	const if_blocks = [];

  	function select_block_type_1(ctx, dirty) {
  		if (/*children*/ ctx[0]) return 0;
  		return 1;
  	}

  	current_block_type_index = select_block_type_1(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

  	let a_levels = [
  		/*props*/ ctx[10],
  		{ id: /*id*/ ctx[4] },
  		{ class: /*classes*/ ctx[8] },
  		{ disabled: /*disabled*/ ctx[2] },
  		{ href: /*href*/ ctx[3] },
  		{
  			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
  		},
  		{ style: /*style*/ ctx[5] }
  	];

  	let a_data = {};

  	for (let i = 0; i < a_levels.length; i += 1) {
  		a_data = assign(a_data, a_levels[i]);
  	}

  	const block_1 = {
  		c: function create() {
  			a = element("a");
  			if_block.c();
  			set_attributes(a, a_data);
  			add_location(a, file$2, 37, 2, 825);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, a, anchor);
  			if_blocks[current_block_type_index].m(a, null);
  			current = true;

  			if (!mounted) {
  				dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
  				mounted = true;
  			}
  		},
  		p: function update(ctx, dirty) {
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type_1(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(a, null);
  			}

  			set_attributes(a, a_data = get_spread_update(a_levels, [
  				dirty & /*props*/ 1024 && /*props*/ ctx[10],
  				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
  				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
  				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
  				dirty & /*href*/ 8 && { href: /*href*/ ctx[3] },
  				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
  					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
  				},
  				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(a);
  			if_blocks[current_block_type_index].d();
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: create_if_block$1.name,
  		type: "if",
  		source: "(37:0) {#if href}",
  		ctx
  	});

  	return block_1;
  }

  // (68:6) {:else}
  function create_else_block_2$1(ctx) {
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[19].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

  	const block_1 = {
  		c: function create() {
  			if (default_slot) default_slot.c();
  		},
  		m: function mount(target, anchor) {
  			if (default_slot) {
  				default_slot.m(target, anchor);
  			}

  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 262144) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, null, null);
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: create_else_block_2$1.name,
  		type: "else",
  		source: "(68:6) {:else}",
  		ctx
  	});

  	return block_1;
  }

  // (66:25) 
  function create_if_block_3(ctx) {
  	let t;

  	const block_1 = {
  		c: function create() {
  			t = text(/*children*/ ctx[0]);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: create_if_block_3.name,
  		type: "if",
  		source: "(66:25) ",
  		ctx
  	});

  	return block_1;
  }

  // (64:6) {#if close}
  function create_if_block_2$1(ctx) {
  	let span;

  	const block_1 = {
  		c: function create() {
  			span = element("span");
  			span.textContent = "×";
  			attr_dev(span, "aria-hidden", "true");
  			add_location(span, file$2, 64, 8, 1250);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: create_if_block_2$1.name,
  		type: "if",
  		source: "(64:6) {#if close}",
  		ctx
  	});

  	return block_1;
  }

  // (63:10)        
  function fallback_block(ctx) {
  	let current_block_type_index;
  	let if_block;
  	let if_block_anchor;
  	let current;
  	const if_block_creators = [create_if_block_2$1, create_if_block_3, create_else_block_2$1];
  	const if_blocks = [];

  	function select_block_type_2(ctx, dirty) {
  		if (/*close*/ ctx[1]) return 0;
  		if (/*children*/ ctx[0]) return 1;
  		return 2;
  	}

  	current_block_type_index = select_block_type_2(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

  	const block_1 = {
  		c: function create() {
  			if_block.c();
  			if_block_anchor = empty();
  		},
  		m: function mount(target, anchor) {
  			if_blocks[current_block_type_index].m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type_2(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(if_block_anchor.parentNode, if_block_anchor);
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if_blocks[current_block_type_index].d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: fallback_block.name,
  		type: "fallback",
  		source: "(63:10)        ",
  		ctx
  	});

  	return block_1;
  }

  // (49:4) {:else}
  function create_else_block$1(ctx) {
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[19].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

  	const block_1 = {
  		c: function create() {
  			if (default_slot) default_slot.c();
  		},
  		m: function mount(target, anchor) {
  			if (default_slot) {
  				default_slot.m(target, anchor);
  			}

  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 262144) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, null, null);
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: create_else_block$1.name,
  		type: "else",
  		source: "(49:4) {:else}",
  		ctx
  	});

  	return block_1;
  }

  // (47:4) {#if children}
  function create_if_block_1$1(ctx) {
  	let t;

  	const block_1 = {
  		c: function create() {
  			t = text(/*children*/ ctx[0]);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: create_if_block_1$1.name,
  		type: "if",
  		source: "(47:4) {#if children}",
  		ctx
  	});

  	return block_1;
  }

  function create_fragment$2(ctx) {
  	let current_block_type_index;
  	let if_block;
  	let if_block_anchor;
  	let current;
  	const if_block_creators = [create_if_block$1, create_else_block_1$1];
  	const if_blocks = [];

  	function select_block_type(ctx, dirty) {
  		if (/*href*/ ctx[3]) return 0;
  		return 1;
  	}

  	current_block_type_index = select_block_type(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

  	const block_1 = {
  		c: function create() {
  			if_block.c();
  			if_block_anchor = empty();
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			if_blocks[current_block_type_index].m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(if_block_anchor.parentNode, if_block_anchor);
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if_blocks[current_block_type_index].d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block: block_1,
  		id: create_fragment$2.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block_1;
  }

  function instance$2($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	let { active = false } = $$props;
  	let { block = false } = $$props;
  	let { children = undefined } = $$props;
  	let { close = false } = $$props;
  	let { color = "secondary" } = $$props;
  	let { disabled = false } = $$props;
  	let { href = "" } = $$props;
  	let { id = "" } = $$props;
  	let { outline = false } = $$props;
  	let { size = "" } = $$props;
  	let { style = "" } = $$props;
  	let { value = "" } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Button", $$slots, ['default']);

  	function click_handler(event) {
  		bubble($$self, event);
  	}

  	function click_handler_1(event) {
  		bubble($$self, event);
  	}

  	$$self.$set = $$new_props => {
  		$$invalidate(17, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(11, className = $$new_props.class);
  		if ("active" in $$new_props) $$invalidate(12, active = $$new_props.active);
  		if ("block" in $$new_props) $$invalidate(13, block = $$new_props.block);
  		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
  		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
  		if ("color" in $$new_props) $$invalidate(14, color = $$new_props.color);
  		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
  		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
  		if ("id" in $$new_props) $$invalidate(4, id = $$new_props.id);
  		if ("outline" in $$new_props) $$invalidate(15, outline = $$new_props.outline);
  		if ("size" in $$new_props) $$invalidate(16, size = $$new_props.size);
  		if ("style" in $$new_props) $$invalidate(5, style = $$new_props.style);
  		if ("value" in $$new_props) $$invalidate(6, value = $$new_props.value);
  		if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		clsx,
  		clean,
  		className,
  		active,
  		block,
  		children,
  		close,
  		color,
  		disabled,
  		href,
  		id,
  		outline,
  		size,
  		style,
  		value,
  		props,
  		ariaLabel,
  		classes,
  		defaultAriaLabel
  	});

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(17, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(11, className = $$new_props.className);
  		if ("active" in $$props) $$invalidate(12, active = $$new_props.active);
  		if ("block" in $$props) $$invalidate(13, block = $$new_props.block);
  		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
  		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
  		if ("color" in $$props) $$invalidate(14, color = $$new_props.color);
  		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
  		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
  		if ("id" in $$props) $$invalidate(4, id = $$new_props.id);
  		if ("outline" in $$props) $$invalidate(15, outline = $$new_props.outline);
  		if ("size" in $$props) $$invalidate(16, size = $$new_props.size);
  		if ("style" in $$props) $$invalidate(5, style = $$new_props.style);
  		if ("value" in $$props) $$invalidate(6, value = $$new_props.value);
  		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
  		if ("classes" in $$props) $$invalidate(8, classes = $$new_props.classes);
  		if ("defaultAriaLabel" in $$props) $$invalidate(9, defaultAriaLabel = $$new_props.defaultAriaLabel);
  	};

  	let ariaLabel;
  	let classes;
  	let defaultAriaLabel;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		 $$invalidate(7, ariaLabel = $$props["aria-label"]);

  		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 129026) {
  			 $$invalidate(8, classes = clsx(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
  		}

  		if ($$self.$$.dirty & /*close*/ 2) {
  			 $$invalidate(9, defaultAriaLabel = close ? "Close" : null);
  		}
  	};

  	$$props = exclude_internal_props($$props);

  	return [
  		children,
  		close,
  		disabled,
  		href,
  		id,
  		style,
  		value,
  		ariaLabel,
  		classes,
  		defaultAriaLabel,
  		props,
  		className,
  		active,
  		block,
  		color,
  		outline,
  		size,
  		$$props,
  		$$scope,
  		$$slots,
  		click_handler,
  		click_handler_1
  	];
  }

  class Button extends SvelteComponentDev {
  	constructor(options) {
  		super(options);

  		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
  			class: 11,
  			active: 12,
  			block: 13,
  			children: 0,
  			close: 1,
  			color: 14,
  			disabled: 2,
  			href: 3,
  			id: 4,
  			outline: 15,
  			size: 16,
  			style: 5,
  			value: 6
  		});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Button",
  			options,
  			id: create_fragment$2.name
  		});
  	}

  	get class() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get active() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set active(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get block() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set block(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get children() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set children(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get close() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set close(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get color() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set color(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get disabled() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set disabled(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get href() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set href(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get id() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set id(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get outline() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set outline(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get size() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set size(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get style() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set style(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get value() {
  		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set value(value) {
  		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\Card.svelte generated by Svelte v3.23.0 */
  const file$3 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\Card.svelte";

  function create_fragment$3(ctx) {
  	let div;
  	let current;
  	let mounted;
  	let dispose;
  	const default_slot_template = /*$$slots*/ ctx[11].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

  	let div_levels = [
  		/*props*/ ctx[3],
  		{ id: /*id*/ ctx[0] },
  		{ class: /*classes*/ ctx[2] },
  		{ style: /*style*/ ctx[1] }
  	];

  	let div_data = {};

  	for (let i = 0; i < div_levels.length; i += 1) {
  		div_data = assign(div_data, div_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot) default_slot.c();
  			set_attributes(div, div_data);
  			add_location(div, file$3, 24, 0, 512);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot) {
  				default_slot.m(div, null);
  			}

  			current = true;

  			if (!mounted) {
  				dispose = listen_dev(div, "click", /*click_handler*/ ctx[12], false, false, false);
  				mounted = true;
  			}
  		},
  		p: function update(ctx, [dirty]) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 1024) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
  				}
  			}

  			set_attributes(div, div_data = get_spread_update(div_levels, [
  				dirty & /*props*/ 8 && /*props*/ ctx[3],
  				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
  				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
  				dirty & /*style*/ 2 && { style: /*style*/ ctx[1] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot) default_slot.d(detaching);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$3.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$3($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	let { body = false } = $$props;
  	let { color = "" } = $$props;
  	let { id = "" } = $$props;
  	let { inverse = false } = $$props;
  	let { outline = false } = $$props;
  	let { style = "" } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Card", $$slots, ['default']);

  	function click_handler(event) {
  		bubble($$self, event);
  	}

  	$$self.$set = $$new_props => {
  		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
  		if ("body" in $$new_props) $$invalidate(5, body = $$new_props.body);
  		if ("color" in $$new_props) $$invalidate(6, color = $$new_props.color);
  		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
  		if ("inverse" in $$new_props) $$invalidate(7, inverse = $$new_props.inverse);
  		if ("outline" in $$new_props) $$invalidate(8, outline = $$new_props.outline);
  		if ("style" in $$new_props) $$invalidate(1, style = $$new_props.style);
  		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		clsx,
  		clean,
  		className,
  		body,
  		color,
  		id,
  		inverse,
  		outline,
  		style,
  		props,
  		classes
  	});

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
  		if ("body" in $$props) $$invalidate(5, body = $$new_props.body);
  		if ("color" in $$props) $$invalidate(6, color = $$new_props.color);
  		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
  		if ("inverse" in $$props) $$invalidate(7, inverse = $$new_props.inverse);
  		if ("outline" in $$props) $$invalidate(8, outline = $$new_props.outline);
  		if ("style" in $$props) $$invalidate(1, style = $$new_props.style);
  		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className, inverse, body, color, outline*/ 496) {
  			 $$invalidate(2, classes = clsx(className, "card", inverse ? "text-white" : false, body ? "card-body" : false, color ? `${outline ? "border" : "bg"}-${color}` : false));
  		}
  	};

  	$$props = exclude_internal_props($$props);

  	return [
  		id,
  		style,
  		classes,
  		props,
  		className,
  		body,
  		color,
  		inverse,
  		outline,
  		$$props,
  		$$scope,
  		$$slots,
  		click_handler
  	];
  }

  class Card extends SvelteComponentDev {
  	constructor(options) {
  		super(options);

  		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
  			class: 4,
  			body: 5,
  			color: 6,
  			id: 0,
  			inverse: 7,
  			outline: 8,
  			style: 1
  		});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Card",
  			options,
  			id: create_fragment$3.name
  		});
  	}

  	get class() {
  		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get body() {
  		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set body(value) {
  		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get color() {
  		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set color(value) {
  		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get id() {
  		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set id(value) {
  		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get inverse() {
  		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set inverse(value) {
  		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get outline() {
  		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set outline(value) {
  		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get style() {
  		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set style(value) {
  		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\CardBody.svelte generated by Svelte v3.23.0 */
  const file$4 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\CardBody.svelte";

  function create_fragment$4(ctx) {
  	let div;
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[6].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
  	let div_levels = [/*props*/ ctx[2], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[1] }];
  	let div_data = {};

  	for (let i = 0; i < div_levels.length; i += 1) {
  		div_data = assign(div_data, div_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot) default_slot.c();
  			set_attributes(div, div_data);
  			add_location(div, file$4, 13, 0, 239);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot) {
  				default_slot.m(div, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 32) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
  				}
  			}

  			set_attributes(div, div_data = get_spread_update(div_levels, [
  				dirty & /*props*/ 4 && /*props*/ ctx[2],
  				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
  				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$4.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$4($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	let { id = "" } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("CardBody", $$slots, ['default']);

  	$$self.$set = $$new_props => {
  		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
  		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
  		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		clsx,
  		clean,
  		className,
  		id,
  		props,
  		classes
  	});

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
  		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
  		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className*/ 8) {
  			 $$invalidate(1, classes = clsx(className, "card-body"));
  		}
  	};

  	$$props = exclude_internal_props($$props);
  	return [id, classes, props, className, $$props, $$scope, $$slots];
  }

  class CardBody extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$4, create_fragment$4, safe_not_equal, { class: 3, id: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "CardBody",
  			options,
  			id: create_fragment$4.name
  		});
  	}

  	get class() {
  		throw new Error("<CardBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<CardBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get id() {
  		throw new Error("<CardBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set id(value) {
  		throw new Error("<CardBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\CardFooter.svelte generated by Svelte v3.23.0 */
  const file$5 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\CardFooter.svelte";

  function create_fragment$5(ctx) {
  	let div;
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[5].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
  	let div_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
  	let div_data = {};

  	for (let i = 0; i < div_levels.length; i += 1) {
  		div_data = assign(div_data, div_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot) default_slot.c();
  			set_attributes(div, div_data);
  			add_location(div, file$5, 12, 0, 219);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot) {
  				default_slot.m(div, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 16) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
  				}
  			}

  			set_attributes(div, div_data = get_spread_update(div_levels, [
  				dirty & /*props*/ 2 && /*props*/ ctx[1],
  				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$5.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$5($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("CardFooter", $$slots, ['default']);

  	$$self.$set = $$new_props => {
  		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
  		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({ clsx, clean, className, props, classes });

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
  		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className*/ 4) {
  			 $$invalidate(0, classes = clsx(className, "card-footer"));
  		}
  	};

  	$$props = exclude_internal_props($$props);
  	return [classes, props, className, $$props, $$scope, $$slots];
  }

  class CardFooter extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$5, create_fragment$5, safe_not_equal, { class: 2 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "CardFooter",
  			options,
  			id: create_fragment$5.name
  		});
  	}

  	get class() {
  		throw new Error("<CardFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<CardFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\CardHeader.svelte generated by Svelte v3.23.0 */
  const file$6 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\CardHeader.svelte";

  // (19:0) {:else}
  function create_else_block$2(ctx) {
  	let div;
  	let current;
  	let mounted;
  	let dispose;
  	const default_slot_template = /*$$slots*/ ctx[7].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
  	let div_levels = [/*props*/ ctx[3], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[2] }];
  	let div_data = {};

  	for (let i = 0; i < div_levels.length; i += 1) {
  		div_data = assign(div_data, div_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot) default_slot.c();
  			set_attributes(div, div_data);
  			add_location(div, file$6, 19, 2, 365);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot) {
  				default_slot.m(div, null);
  			}

  			current = true;

  			if (!mounted) {
  				dispose = listen_dev(div, "click", /*click_handler_1*/ ctx[9], false, false, false);
  				mounted = true;
  			}
  		},
  		p: function update(ctx, dirty) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 64) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
  				}
  			}

  			set_attributes(div, div_data = get_spread_update(div_levels, [
  				dirty & /*props*/ 8 && /*props*/ ctx[3],
  				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
  				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot) default_slot.d(detaching);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block$2.name,
  		type: "else",
  		source: "(19:0) {:else}",
  		ctx
  	});

  	return block;
  }

  // (15:0) {#if tag === 'h3'}
  function create_if_block$2(ctx) {
  	let h3;
  	let current;
  	let mounted;
  	let dispose;
  	const default_slot_template = /*$$slots*/ ctx[7].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
  	let h3_levels = [/*props*/ ctx[3], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[2] }];
  	let h3_data = {};

  	for (let i = 0; i < h3_levels.length; i += 1) {
  		h3_data = assign(h3_data, h3_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			h3 = element("h3");
  			if (default_slot) default_slot.c();
  			set_attributes(h3, h3_data);
  			add_location(h3, file$6, 15, 2, 288);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, h3, anchor);

  			if (default_slot) {
  				default_slot.m(h3, null);
  			}

  			current = true;

  			if (!mounted) {
  				dispose = listen_dev(h3, "click", /*click_handler*/ ctx[8], false, false, false);
  				mounted = true;
  			}
  		},
  		p: function update(ctx, dirty) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 64) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
  				}
  			}

  			set_attributes(h3, h3_data = get_spread_update(h3_levels, [
  				dirty & /*props*/ 8 && /*props*/ ctx[3],
  				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
  				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(h3);
  			if (default_slot) default_slot.d(detaching);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block$2.name,
  		type: "if",
  		source: "(15:0) {#if tag === 'h3'}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$6(ctx) {
  	let current_block_type_index;
  	let if_block;
  	let if_block_anchor;
  	let current;
  	const if_block_creators = [create_if_block$2, create_else_block$2];
  	const if_blocks = [];

  	function select_block_type(ctx, dirty) {
  		if (/*tag*/ ctx[1] === "h3") return 0;
  		return 1;
  	}

  	current_block_type_index = select_block_type(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

  	const block = {
  		c: function create() {
  			if_block.c();
  			if_block_anchor = empty();
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			if_blocks[current_block_type_index].m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(if_block_anchor.parentNode, if_block_anchor);
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if_blocks[current_block_type_index].d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$6.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$6($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	let { id = "" } = $$props;
  	let { tag = "div" } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("CardHeader", $$slots, ['default']);

  	function click_handler(event) {
  		bubble($$self, event);
  	}

  	function click_handler_1(event) {
  		bubble($$self, event);
  	}

  	$$self.$set = $$new_props => {
  		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
  		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
  		if ("tag" in $$new_props) $$invalidate(1, tag = $$new_props.tag);
  		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		clsx,
  		clean,
  		className,
  		id,
  		tag,
  		props,
  		classes
  	});

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
  		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
  		if ("tag" in $$props) $$invalidate(1, tag = $$new_props.tag);
  		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className*/ 16) {
  			 $$invalidate(2, classes = clsx(className, "card-header"));
  		}
  	};

  	$$props = exclude_internal_props($$props);

  	return [
  		id,
  		tag,
  		classes,
  		props,
  		className,
  		$$props,
  		$$scope,
  		$$slots,
  		click_handler,
  		click_handler_1
  	];
  }

  class CardHeader extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$6, create_fragment$6, safe_not_equal, { class: 4, id: 0, tag: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "CardHeader",
  			options,
  			id: create_fragment$6.name
  		});
  	}

  	get class() {
  		throw new Error("<CardHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<CardHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get id() {
  		throw new Error("<CardHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set id(value) {
  		throw new Error("<CardHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get tag() {
  		throw new Error("<CardHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set tag(value) {
  		throw new Error("<CardHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\CardText.svelte generated by Svelte v3.23.0 */
  const file$7 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\CardText.svelte";

  function create_fragment$7(ctx) {
  	let p;
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[5].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
  	let p_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
  	let p_data = {};

  	for (let i = 0; i < p_levels.length; i += 1) {
  		p_data = assign(p_data, p_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			p = element("p");
  			if (default_slot) default_slot.c();
  			set_attributes(p, p_data);
  			add_location(p, file$7, 12, 0, 217);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, p, anchor);

  			if (default_slot) {
  				default_slot.m(p, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 16) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
  				}
  			}

  			set_attributes(p, p_data = get_spread_update(p_levels, [
  				dirty & /*props*/ 2 && /*props*/ ctx[1],
  				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(p);
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$7.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$7($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("CardText", $$slots, ['default']);

  	$$self.$set = $$new_props => {
  		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
  		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({ clsx, clean, className, props, classes });

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
  		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className*/ 4) {
  			 $$invalidate(0, classes = clsx(className, "card-text"));
  		}
  	};

  	$$props = exclude_internal_props($$props);
  	return [classes, props, className, $$props, $$scope, $$slots];
  }

  class CardText extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$7, create_fragment$7, safe_not_equal, { class: 2 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "CardText",
  			options,
  			id: create_fragment$7.name
  		});
  	}

  	get class() {
  		throw new Error("<CardText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<CardText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\CardTitle.svelte generated by Svelte v3.23.0 */
  const file$8 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\CardTitle.svelte";

  function create_fragment$8(ctx) {
  	let div;
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[5].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
  	let div_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
  	let div_data = {};

  	for (let i = 0; i < div_levels.length; i += 1) {
  		div_data = assign(div_data, div_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot) default_slot.c();
  			set_attributes(div, div_data);
  			add_location(div, file$8, 12, 0, 218);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot) {
  				default_slot.m(div, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 16) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
  				}
  			}

  			set_attributes(div, div_data = get_spread_update(div_levels, [
  				dirty & /*props*/ 2 && /*props*/ ctx[1],
  				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$8.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$8($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("CardTitle", $$slots, ['default']);

  	$$self.$set = $$new_props => {
  		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
  		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({ clsx, clean, className, props, classes });

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
  		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className*/ 4) {
  			 $$invalidate(0, classes = clsx(className, "card-title"));
  		}
  	};

  	$$props = exclude_internal_props($$props);
  	return [classes, props, className, $$props, $$scope, $$slots];
  }

  class CardTitle extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$8, create_fragment$8, safe_not_equal, { class: 2 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "CardTitle",
  			options,
  			id: create_fragment$8.name
  		});
  	}

  	get class() {
  		throw new Error("<CardTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<CardTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\Col.svelte generated by Svelte v3.23.0 */
  const file$9 = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\Col.svelte";

  function create_fragment$9(ctx) {
  	let div;
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[7].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

  	let div_levels = [
  		/*props*/ ctx[1],
  		{ id: /*id*/ ctx[0] },
  		{ class: /*colClasses*/ ctx[2].join(" ") }
  	];

  	let div_data = {};

  	for (let i = 0; i < div_levels.length; i += 1) {
  		div_data = assign(div_data, div_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot) default_slot.c();
  			set_attributes(div, div_data);
  			add_location(div, file$9, 51, 0, 1305);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot) {
  				default_slot.m(div, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 64) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
  				}
  			}

  			set_attributes(div, div_data = get_spread_update(div_levels, [
  				dirty & /*props*/ 2 && /*props*/ ctx[1],
  				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
  				dirty & /*colClasses*/ 4 && { class: /*colClasses*/ ctx[2].join(" ") }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$9.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$9($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	let { id = "" } = $$props;
  	const props = clean($$props);
  	const colClasses = [];
  	const widths = ["xs", "sm", "md", "lg", "xl"];

  	widths.forEach(colWidth => {
  		const columnProp = $$props[colWidth];

  		if (!columnProp && columnProp !== "") {
  			return; //no value for this width
  		}

  		const isXs = colWidth === "xs";

  		if (isObject(columnProp)) {
  			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
  			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

  			if (columnProp.size || columnProp.size === "") {
  				colClasses.push(colClass);
  			}

  			if (columnProp.push) {
  				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
  			}

  			if (columnProp.pull) {
  				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
  			}

  			if (columnProp.offset) {
  				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
  			}
  		} else {
  			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
  		}
  	});

  	if (!colClasses.length) {
  		colClasses.push("col");
  	}

  	if (className) {
  		colClasses.push(className);
  	}

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Col", $$slots, ['default']);

  	$$self.$set = $$new_props => {
  		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
  		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
  		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		clean,
  		getColumnSizeClass,
  		isObject,
  		className,
  		id,
  		props,
  		colClasses,
  		widths
  	});

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
  		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$props = exclude_internal_props($$props);
  	return [id, props, colClasses, className, widths, $$props, $$scope, $$slots];
  }

  class Col extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$9, create_fragment$9, safe_not_equal, { class: 3, id: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Col",
  			options,
  			id: create_fragment$9.name
  		});
  	}

  	get class() {
  		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get id() {
  		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set id(value) {
  		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\Collapse.svelte generated by Svelte v3.23.0 */
  const file$a = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\Collapse.svelte";

  // (60:0) {#if isOpen}
  function create_if_block$3(ctx) {
  	let div;
  	let div_transition;
  	let current;
  	let mounted;
  	let dispose;
  	const default_slot_template = /*$$slots*/ ctx[18].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
  	let div_levels = [{ class: /*classes*/ ctx[6] }, /*props*/ ctx[7]];
  	let div_data = {};

  	for (let i = 0; i < div_levels.length; i += 1) {
  		div_data = assign(div_data, div_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot) default_slot.c();
  			set_attributes(div, div_data);
  			add_location(div, file$a, 60, 2, 1284);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot) {
  				default_slot.m(div, null);
  			}

  			current = true;

  			if (!mounted) {
  				dispose = [
  					listen_dev(div, "introstart", /*introstart_handler*/ ctx[19], false, false, false),
  					listen_dev(div, "introend", /*introend_handler*/ ctx[20], false, false, false),
  					listen_dev(div, "outrostart", /*outrostart_handler*/ ctx[21], false, false, false),
  					listen_dev(div, "outroend", /*outroend_handler*/ ctx[22], false, false, false),
  					listen_dev(
  						div,
  						"introstart",
  						function () {
  							if (is_function(/*onEntering*/ ctx[1])) /*onEntering*/ ctx[1].apply(this, arguments);
  						},
  						false,
  						false,
  						false
  					),
  					listen_dev(
  						div,
  						"introend",
  						function () {
  							if (is_function(/*onEntered*/ ctx[2])) /*onEntered*/ ctx[2].apply(this, arguments);
  						},
  						false,
  						false,
  						false
  					),
  					listen_dev(
  						div,
  						"outrostart",
  						function () {
  							if (is_function(/*onExiting*/ ctx[3])) /*onExiting*/ ctx[3].apply(this, arguments);
  						},
  						false,
  						false,
  						false
  					),
  					listen_dev(
  						div,
  						"outroend",
  						function () {
  							if (is_function(/*onExited*/ ctx[4])) /*onExited*/ ctx[4].apply(this, arguments);
  						},
  						false,
  						false,
  						false
  					)
  				];

  				mounted = true;
  			}
  		},
  		p: function update(new_ctx, dirty) {
  			ctx = new_ctx;

  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 131072) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, null, null);
  				}
  			}

  			set_attributes(div, div_data = get_spread_update(div_levels, [
  				dirty & /*classes*/ 64 && { class: /*classes*/ ctx[6] },
  				dirty & /*props*/ 128 && /*props*/ ctx[7]
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);

  			add_render_callback(() => {
  				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
  				div_transition.run(1);
  			});

  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
  			div_transition.run(0);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot) default_slot.d(detaching);
  			if (detaching && div_transition) div_transition.end();
  			mounted = false;
  			run_all(dispose);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block$3.name,
  		type: "if",
  		source: "(60:0) {#if isOpen}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$a(ctx) {
  	let if_block_anchor;
  	let current;
  	let mounted;
  	let dispose;
  	add_render_callback(/*onwindowresize*/ ctx[23]);
  	let if_block = /*isOpen*/ ctx[0] && create_if_block$3(ctx);

  	const block = {
  		c: function create() {
  			if (if_block) if_block.c();
  			if_block_anchor = empty();
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			if (if_block) if_block.m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  			current = true;

  			if (!mounted) {
  				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[23]);
  				mounted = true;
  			}
  		},
  		p: function update(ctx, [dirty]) {
  			if (/*isOpen*/ ctx[0]) {
  				if (if_block) {
  					if_block.p(ctx, dirty);

  					if (dirty & /*isOpen*/ 1) {
  						transition_in(if_block, 1);
  					}
  				} else {
  					if_block = create_if_block$3(ctx);
  					if_block.c();
  					transition_in(if_block, 1);
  					if_block.m(if_block_anchor.parentNode, if_block_anchor);
  				}
  			} else if (if_block) {
  				group_outros();

  				transition_out(if_block, 1, 1, () => {
  					if_block = null;
  				});

  				check_outros();
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (if_block) if_block.d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$a.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$a($$self, $$props, $$invalidate) {
  	const noop = () => undefined;
  	let { isOpen = false } = $$props;
  	let { class: className = "" } = $$props;
  	let { navbar = false } = $$props;
  	let { onEntering = noop } = $$props;
  	let { onEntered = noop } = $$props;
  	let { onExiting = noop } = $$props;
  	let { onExited = noop } = $$props;
  	let { expand = false } = $$props;
  	const props = clean($$props);
  	let windowWidth = 0;
  	let _wasMaximazed = false;
  	const minWidth = {};
  	minWidth["xs"] = 0;
  	minWidth["sm"] = 576;
  	minWidth["md"] = 768;
  	minWidth["lg"] = 992;
  	minWidth["xl"] = 1200;
  	const dispatch = createEventDispatcher();

  	function notify() {
  		dispatch("update", { isOpen });
  	}

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Collapse", $$slots, ['default']);

  	function introstart_handler(event) {
  		bubble($$self, event);
  	}

  	function introend_handler(event) {
  		bubble($$self, event);
  	}

  	function outrostart_handler(event) {
  		bubble($$self, event);
  	}

  	function outroend_handler(event) {
  		bubble($$self, event);
  	}

  	function onwindowresize() {
  		$$invalidate(5, windowWidth = window.innerWidth);
  	}

  	$$self.$set = $$new_props => {
  		$$invalidate(16, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("isOpen" in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
  		if ("class" in $$new_props) $$invalidate(8, className = $$new_props.class);
  		if ("navbar" in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
  		if ("onEntering" in $$new_props) $$invalidate(1, onEntering = $$new_props.onEntering);
  		if ("onEntered" in $$new_props) $$invalidate(2, onEntered = $$new_props.onEntered);
  		if ("onExiting" in $$new_props) $$invalidate(3, onExiting = $$new_props.onExiting);
  		if ("onExited" in $$new_props) $$invalidate(4, onExited = $$new_props.onExited);
  		if ("expand" in $$new_props) $$invalidate(10, expand = $$new_props.expand);
  		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		clsx,
  		clean,
  		createEventDispatcher,
  		slide,
  		noop,
  		isOpen,
  		className,
  		navbar,
  		onEntering,
  		onEntered,
  		onExiting,
  		onExited,
  		expand,
  		props,
  		windowWidth,
  		_wasMaximazed,
  		minWidth,
  		dispatch,
  		notify,
  		classes
  	});

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(16, $$props = assign(assign({}, $$props), $$new_props));
  		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
  		if ("className" in $$props) $$invalidate(8, className = $$new_props.className);
  		if ("navbar" in $$props) $$invalidate(9, navbar = $$new_props.navbar);
  		if ("onEntering" in $$props) $$invalidate(1, onEntering = $$new_props.onEntering);
  		if ("onEntered" in $$props) $$invalidate(2, onEntered = $$new_props.onEntered);
  		if ("onExiting" in $$props) $$invalidate(3, onExiting = $$new_props.onExiting);
  		if ("onExited" in $$props) $$invalidate(4, onExited = $$new_props.onExited);
  		if ("expand" in $$props) $$invalidate(10, expand = $$new_props.expand);
  		if ("windowWidth" in $$props) $$invalidate(5, windowWidth = $$new_props.windowWidth);
  		if ("_wasMaximazed" in $$props) $$invalidate(11, _wasMaximazed = $$new_props._wasMaximazed);
  		if ("classes" in $$props) $$invalidate(6, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className, navbar*/ 768) {
  			 $$invalidate(6, classes = clsx(className, // collapseClass,
  			navbar && "navbar-collapse"));
  		}

  		if ($$self.$$.dirty & /*navbar, expand, windowWidth, minWidth, isOpen, _wasMaximazed*/ 7713) {
  			 if (navbar && expand) {
  				if (windowWidth >= minWidth[expand] && !isOpen) {
  					$$invalidate(0, isOpen = true);
  					$$invalidate(11, _wasMaximazed = true);
  					notify();
  				} else if (windowWidth < minWidth[expand] && _wasMaximazed) {
  					$$invalidate(0, isOpen = false);
  					$$invalidate(11, _wasMaximazed = false);
  					notify();
  				}
  			}
  		}
  	};

  	$$props = exclude_internal_props($$props);

  	return [
  		isOpen,
  		onEntering,
  		onEntered,
  		onExiting,
  		onExited,
  		windowWidth,
  		classes,
  		props,
  		className,
  		navbar,
  		expand,
  		_wasMaximazed,
  		minWidth,
  		noop,
  		dispatch,
  		notify,
  		$$props,
  		$$scope,
  		$$slots,
  		introstart_handler,
  		introend_handler,
  		outrostart_handler,
  		outroend_handler,
  		onwindowresize
  	];
  }

  class Collapse extends SvelteComponentDev {
  	constructor(options) {
  		super(options);

  		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
  			isOpen: 0,
  			class: 8,
  			navbar: 9,
  			onEntering: 1,
  			onEntered: 2,
  			onExiting: 3,
  			onExited: 4,
  			expand: 10
  		});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Collapse",
  			options,
  			id: create_fragment$a.name
  		});
  	}

  	get isOpen() {
  		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set isOpen(value) {
  		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get class() {
  		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get navbar() {
  		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set navbar(value) {
  		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get onEntering() {
  		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set onEntering(value) {
  		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get onEntered() {
  		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set onEntered(value) {
  		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get onExiting() {
  		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set onExiting(value) {
  		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get onExited() {
  		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set onExited(value) {
  		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get expand() {
  		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set expand(value) {
  		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\node_modules\sveltestrap\src\Row.svelte generated by Svelte v3.23.0 */
  const file$b = "C:\\cbevins\\dev\\node\\fire-portfolio\\node_modules\\sveltestrap\\src\\Row.svelte";

  function create_fragment$b(ctx) {
  	let div;
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[8].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
  	let div_levels = [/*props*/ ctx[2], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[1] }];
  	let div_data = {};

  	for (let i = 0; i < div_levels.length; i += 1) {
  		div_data = assign(div_data, div_levels[i]);
  	}

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot) default_slot.c();
  			set_attributes(div, div_data);
  			add_location(div, file$b, 19, 0, 361);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot) {
  				default_slot.m(div, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 128) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
  				}
  			}

  			set_attributes(div, div_data = get_spread_update(div_levels, [
  				dirty & /*props*/ 4 && /*props*/ ctx[2],
  				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
  				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
  			]));
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot) default_slot.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$b.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$b($$self, $$props, $$invalidate) {
  	let { class: className = "" } = $$props;
  	let { noGutters = false } = $$props;
  	let { form = false } = $$props;
  	let { id = "" } = $$props;
  	const props = clean($$props);
  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Row", $$slots, ['default']);

  	$$self.$set = $$new_props => {
  		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
  		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
  		if ("noGutters" in $$new_props) $$invalidate(4, noGutters = $$new_props.noGutters);
  		if ("form" in $$new_props) $$invalidate(5, form = $$new_props.form);
  		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
  		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		clsx,
  		clean,
  		className,
  		noGutters,
  		form,
  		id,
  		props,
  		classes
  	});

  	$$self.$inject_state = $$new_props => {
  		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
  		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
  		if ("noGutters" in $$props) $$invalidate(4, noGutters = $$new_props.noGutters);
  		if ("form" in $$props) $$invalidate(5, form = $$new_props.form);
  		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
  		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
  	};

  	let classes;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*className, noGutters, form*/ 56) {
  			 $$invalidate(1, classes = clsx(className, noGutters ? "no-gutters" : null, form ? "form-row" : "row"));
  		}
  	};

  	$$props = exclude_internal_props($$props);
  	return [id, classes, props, className, noGutters, form, $$props, $$scope, $$slots];
  }

  class Row extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$b, create_fragment$b, safe_not_equal, { class: 3, noGutters: 4, form: 5, id: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Row",
  			options,
  			id: create_fragment$b.name
  		});
  	}

  	get class() {
  		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set class(value) {
  		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get noGutters() {
  		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set noGutters(value) {
  		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get form() {
  		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set form(value) {
  		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get id() {
  		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set id(value) {
  		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\VariableSelector\SelectedPanel.svelte generated by Svelte v3.23.0 */

  const file$c = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\VariableSelector\\SelectedPanel.svelte";

  function get_each_context$1(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[3] = list[i];
  	return child_ctx;
  }

  // (15:10) {:else}
  function create_else_block$3(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			attr_dev(span, "class", "fa fa-toggle-down");
  			add_location(span, file$c, 15, 12, 507);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block$3.name,
  		type: "else",
  		source: "(15:10) {:else}",
  		ctx
  	});

  	return block;
  }

  // (13:10) {#if isOpen}
  function create_if_block$4(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			attr_dev(span, "class", "fa fa-toggle-up");
  			add_location(span, file$c, 13, 12, 439);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block$4.name,
  		type: "if",
  		source: "(13:10) {#if isOpen}",
  		ctx
  	});

  	return block;
  }

  // (11:6) <Button color="primary" size="sm"           on:click={() => (isOpen = !isOpen)} class="mb-3">
  function create_default_slot_6(ctx) {
  	let if_block_anchor;

  	function select_block_type(ctx, dirty) {
  		if (/*isOpen*/ ctx[0]) return create_if_block$4;
  		return create_else_block$3;
  	}

  	let current_block_type = select_block_type(ctx);
  	let if_block = current_block_type(ctx);

  	const block = {
  		c: function create() {
  			if_block.c();
  			if_block_anchor = empty();
  		},
  		m: function mount(target, anchor) {
  			if_block.m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
  				if_block.d(1);
  				if_block = current_block_type(ctx);

  				if (if_block) {
  					if_block.c();
  					if_block.m(if_block_anchor.parentNode, if_block_anchor);
  				}
  			}
  		},
  		d: function destroy(detaching) {
  			if_block.d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_6.name,
  		type: "slot",
  		source: "(11:6) <Button color=\\\"primary\\\" size=\\\"sm\\\"           on:click={() => (isOpen = !isOpen)} class=\\\"mb-3\\\">",
  		ctx
  	});

  	return block;
  }

  // (20:8) <Badge color="success">
  function create_default_slot_5(ctx) {
  	let t_value = /*$_selected*/ ctx[1].length + "";
  	let t;

  	const block = {
  		c: function create() {
  			t = text(t_value);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*$_selected*/ 2 && t_value !== (t_value = /*$_selected*/ ctx[1].length + "")) set_data_dev(t, t_value);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_5.name,
  		type: "slot",
  		source: "(20:8) <Badge color=\\\"success\\\">",
  		ctx
  	});

  	return block;
  }

  // (10:6) <CardTitle>
  function create_default_slot_4(ctx) {
  	let t0;
  	let t1;
  	let current;

  	const button = new Button({
  			props: {
  				color: "primary",
  				size: "sm",
  				class: "mb-3",
  				$$slots: { default: [create_default_slot_6] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	button.$on("click", /*click_handler*/ ctx[2]);

  	const badge = new Badge({
  			props: {
  				color: "success",
  				$$slots: { default: [create_default_slot_5] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(button.$$.fragment);
  			t0 = text("\n        There are currently\n        ");
  			create_component(badge.$$.fragment);
  			t1 = text("\n        Selected Variables of Interest");
  		},
  		m: function mount(target, anchor) {
  			mount_component(button, target, anchor);
  			insert_dev(target, t0, anchor);
  			mount_component(badge, target, anchor);
  			insert_dev(target, t1, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const button_changes = {};

  			if (dirty & /*$$scope, isOpen*/ 65) {
  				button_changes.$$scope = { dirty, ctx };
  			}

  			button.$set(button_changes);
  			const badge_changes = {};

  			if (dirty & /*$$scope, $_selected*/ 66) {
  				badge_changes.$$scope = { dirty, ctx };
  			}

  			badge.$set(badge_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(button.$$.fragment, local);
  			transition_in(badge.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(button.$$.fragment, local);
  			transition_out(badge.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(button, detaching);
  			if (detaching) detach_dev(t0);
  			destroy_component(badge, detaching);
  			if (detaching) detach_dev(t1);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_4.name,
  		type: "slot",
  		source: "(10:6) <CardTitle>",
  		ctx
  	});

  	return block;
  }

  // (9:4) <CardHeader>
  function create_default_slot_3(ctx) {
  	let current;

  	const cardtitle = new CardTitle({
  			props: {
  				$$slots: { default: [create_default_slot_4] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardtitle.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardtitle, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardtitle_changes = {};

  			if (dirty & /*$$scope, $_selected, isOpen*/ 67) {
  				cardtitle_changes.$$scope = { dirty, ctx };
  			}

  			cardtitle.$set(cardtitle_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardtitle.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardtitle.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardtitle, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_3.name,
  		type: "slot",
  		source: "(9:4) <CardHeader>",
  		ctx
  	});

  	return block;
  }

  // (28:10) {#each $_selected.sort() as key}
  function create_each_block$1(ctx) {
  	let li;
  	let t_value = variableMap.get(/*key*/ ctx[3]).label + "";
  	let t;

  	const block = {
  		c: function create() {
  			li = element("li");
  			t = text(t_value);
  			add_location(li, file$c, 28, 12, 852);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, li, anchor);
  			append_dev(li, t);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*$_selected*/ 2 && t_value !== (t_value = variableMap.get(/*key*/ ctx[3]).label + "")) set_data_dev(t, t_value);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(li);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block$1.name,
  		type: "each",
  		source: "(28:10) {#each $_selected.sort() as key}",
  		ctx
  	});

  	return block;
  }

  // (26:6) <CardBody>
  function create_default_slot_2(ctx) {
  	let ul;
  	let each_value = /*$_selected*/ ctx[1].sort();
  	validate_each_argument(each_value);
  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  	}

  	const block = {
  		c: function create() {
  			ul = element("ul");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			add_location(ul, file$c, 26, 8, 792);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, ul, anchor);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(ul, null);
  			}
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*variableMap, $_selected*/ 2) {
  				each_value = /*$_selected*/ ctx[1].sort();
  				validate_each_argument(each_value);
  				let i;

  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context$1(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  					} else {
  						each_blocks[i] = create_each_block$1(child_ctx);
  						each_blocks[i].c();
  						each_blocks[i].m(ul, null);
  					}
  				}

  				for (; i < each_blocks.length; i += 1) {
  					each_blocks[i].d(1);
  				}

  				each_blocks.length = each_value.length;
  			}
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(ul);
  			destroy_each(each_blocks, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_2.name,
  		type: "slot",
  		source: "(26:6) <CardBody>",
  		ctx
  	});

  	return block;
  }

  // (25:4) <Collapse {isOpen}>
  function create_default_slot_1(ctx) {
  	let current;

  	const cardbody = new CardBody({
  			props: {
  				$$slots: { default: [create_default_slot_2] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardbody.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardbody, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardbody_changes = {};

  			if (dirty & /*$$scope, $_selected*/ 66) {
  				cardbody_changes.$$scope = { dirty, ctx };
  			}

  			cardbody.$set(cardbody_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardbody.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardbody.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardbody, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_1.name,
  		type: "slot",
  		source: "(25:4) <Collapse {isOpen}>",
  		ctx
  	});

  	return block;
  }

  // (8:2) <Card class="mb-3">
  function create_default_slot(ctx) {
  	let t;
  	let current;

  	const cardheader = new CardHeader({
  			props: {
  				$$slots: { default: [create_default_slot_3] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const collapse = new Collapse({
  			props: {
  				isOpen: /*isOpen*/ ctx[0],
  				$$slots: { default: [create_default_slot_1] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardheader.$$.fragment);
  			t = space();
  			create_component(collapse.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardheader, target, anchor);
  			insert_dev(target, t, anchor);
  			mount_component(collapse, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardheader_changes = {};

  			if (dirty & /*$$scope, $_selected, isOpen*/ 67) {
  				cardheader_changes.$$scope = { dirty, ctx };
  			}

  			cardheader.$set(cardheader_changes);
  			const collapse_changes = {};
  			if (dirty & /*isOpen*/ 1) collapse_changes.isOpen = /*isOpen*/ ctx[0];

  			if (dirty & /*$$scope, $_selected*/ 66) {
  				collapse_changes.$$scope = { dirty, ctx };
  			}

  			collapse.$set(collapse_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardheader.$$.fragment, local);
  			transition_in(collapse.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardheader.$$.fragment, local);
  			transition_out(collapse.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardheader, detaching);
  			if (detaching) detach_dev(t);
  			destroy_component(collapse, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot.name,
  		type: "slot",
  		source: "(8:2) <Card class=\\\"mb-3\\\">",
  		ctx
  	});

  	return block;
  }

  function create_fragment$c(ctx) {
  	let current;

  	const card = new Card({
  			props: {
  				class: "mb-3",
  				$$slots: { default: [create_default_slot] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(card.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(card, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const card_changes = {};

  			if (dirty & /*$$scope, isOpen, $_selected*/ 67) {
  				card_changes.$$scope = { dirty, ctx };
  			}

  			card.$set(card_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(card.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(card.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(card, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$c.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$c($$self, $$props, $$invalidate) {
  	let $_selected;
  	validate_store(_selected, "_selected");
  	component_subscribe($$self, _selected, $$value => $$invalidate(1, $_selected = $$value));
  	let isOpen = true;
  	const writable_props = [];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SelectedPanel> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("SelectedPanel", $$slots, []);
  	const click_handler = () => $$invalidate(0, isOpen = !isOpen);

  	$$self.$capture_state = () => ({
  		_selected,
  		variableTree,
  		variableMap,
  		Badge,
  		Button,
  		Collapse,
  		Card,
  		CardBody,
  		CardHeader,
  		CardTitle,
  		isOpen,
  		$_selected
  	});

  	$$self.$inject_state = $$props => {
  		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [isOpen, $_selected, click_handler];
  }

  class SelectedPanel extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "SelectedPanel",
  			options,
  			id: create_fragment$c.name
  		});
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\VariableSelector\SelectorTreeLeaf.svelte generated by Svelte v3.23.0 */
  const file$d = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\VariableSelector\\SelectorTreeLeaf.svelte";

  function create_fragment$d(ctx) {
  	let span;
  	let label_1;
  	let input;
  	let input_id_value;
  	let t0;
  	let t1;
  	let mounted;
  	let dispose;

  	const block = {
  		c: function create() {
  			span = element("span");
  			label_1 = element("label");
  			input = element("input");
  			t0 = space();
  			t1 = text(/*label*/ ctx[1]);
  			attr_dev(input, "type", "checkbox");
  			attr_dev(input, "id", input_id_value = "variable-selector-checkbox-" + /*key*/ ctx[2]);
  			input.checked = /*checked*/ ctx[3];
  			add_location(input, file$d, 30, 4, 636);
  			add_location(label_1, file$d, 29, 2, 623);
  			set_style(span, "background-image", "url(https://svelte.dev/tutorial/icons/" + /*type*/ ctx[4] + ".svg)");
  			attr_dev(span, "class", "svelte-dyhy23");
  			add_location(span, file$d, 28, 0, 537);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  			append_dev(span, label_1);
  			append_dev(label_1, input);
  			append_dev(label_1, t0);
  			append_dev(label_1, t1);

  			if (!mounted) {
  				dispose = listen_dev(
  					input,
  					"change",
  					function () {
  						if (is_function(/*clicked*/ ctx[5](/*selected*/ ctx[0]))) /*clicked*/ ctx[5](/*selected*/ ctx[0]).apply(this, arguments);
  					},
  					false,
  					false,
  					false
  				);

  				mounted = true;
  			}
  		},
  		p: function update(new_ctx, [dirty]) {
  			ctx = new_ctx;

  			if (dirty & /*key*/ 4 && input_id_value !== (input_id_value = "variable-selector-checkbox-" + /*key*/ ctx[2])) {
  				attr_dev(input, "id", input_id_value);
  			}

  			if (dirty & /*checked*/ 8) {
  				prop_dev(input, "checked", /*checked*/ ctx[3]);
  			}

  			if (dirty & /*label*/ 2) set_data_dev(t1, /*label*/ ctx[1]);

  			if (dirty & /*type*/ 16) {
  				set_style(span, "background-image", "url(https://svelte.dev/tutorial/icons/" + /*type*/ ctx[4] + ".svg)");
  			}
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$d.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$d($$self, $$props, $$invalidate) {
  	let { label } = $$props, { key } = $$props, { selected } = $$props;
  	let checked = "";

  	if (selected) {
  		checked = "checked";
  		_selected.select(key, true);
  	}

  	function clicked() {
  		$$invalidate(0, selected = !selected);
  		_selected.select(key, selected);
  	}

  	const writable_props = ["label", "key", "selected"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SelectorTreeLeaf> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("SelectorTreeLeaf", $$slots, []);

  	$$self.$set = $$props => {
  		if ("label" in $$props) $$invalidate(1, label = $$props.label);
  		if ("key" in $$props) $$invalidate(2, key = $$props.key);
  		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
  	};

  	$$self.$capture_state = () => ({
  		_selected,
  		variableMap,
  		label,
  		key,
  		selected,
  		checked,
  		clicked,
  		type
  	});

  	$$self.$inject_state = $$props => {
  		if ("label" in $$props) $$invalidate(1, label = $$props.label);
  		if ("key" in $$props) $$invalidate(2, key = $$props.key);
  		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
  		if ("checked" in $$props) $$invalidate(3, checked = $$props.checked);
  		if ("type" in $$props) $$invalidate(4, type = $$props.type);
  	};

  	let type;

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	$$self.$$.update = () => {
  		if ($$self.$$.dirty & /*label*/ 2) {
  			 $$invalidate(4, type = label.slice(label.lastIndexOf(".") + 1));
  		}
  	};

  	return [selected, label, key, checked, type, clicked];
  }

  class SelectorTreeLeaf extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$d, create_fragment$d, safe_not_equal, { label: 1, key: 2, selected: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "SelectorTreeLeaf",
  			options,
  			id: create_fragment$d.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*label*/ ctx[1] === undefined && !("label" in props)) {
  			console.warn("<SelectorTreeLeaf> was created without expected prop 'label'");
  		}

  		if (/*key*/ ctx[2] === undefined && !("key" in props)) {
  			console.warn("<SelectorTreeLeaf> was created without expected prop 'key'");
  		}

  		if (/*selected*/ ctx[0] === undefined && !("selected" in props)) {
  			console.warn("<SelectorTreeLeaf> was created without expected prop 'selected'");
  		}
  	}

  	get label() {
  		throw new Error("<SelectorTreeLeaf>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set label(value) {
  		throw new Error("<SelectorTreeLeaf>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get key() {
  		throw new Error("<SelectorTreeLeaf>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set key(value) {
  		throw new Error("<SelectorTreeLeaf>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get selected() {
  		throw new Error("<SelectorTreeLeaf>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set selected(value) {
  		throw new Error("<SelectorTreeLeaf>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\VariableSelector\SelectorTreeBranch.svelte generated by Svelte v3.23.0 */
  const file$e = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\VariableSelector\\SelectorTreeBranch.svelte";

  function get_each_context$2(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[4] = list[i];
  	return child_ctx;
  }

  // (11:0) {#if expanded}
  function create_if_block$5(ctx) {
  	let ul;
  	let current;
  	let each_value = /*items*/ ctx[2];
  	validate_each_argument(each_value);
  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  	}

  	const out = i => transition_out(each_blocks[i], 1, 1, () => {
  		each_blocks[i] = null;
  	});

  	const block = {
  		c: function create() {
  			ul = element("ul");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			attr_dev(ul, "class", "svelte-2x6ipa");
  			add_location(ul, file$e, 11, 1, 261);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, ul, anchor);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(ul, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*items*/ 4) {
  				each_value = /*items*/ ctx[2];
  				validate_each_argument(each_value);
  				let i;

  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context$2(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  						transition_in(each_blocks[i], 1);
  					} else {
  						each_blocks[i] = create_each_block$2(child_ctx);
  						each_blocks[i].c();
  						transition_in(each_blocks[i], 1);
  						each_blocks[i].m(ul, null);
  					}
  				}

  				group_outros();

  				for (i = each_value.length; i < each_blocks.length; i += 1) {
  					out(i);
  				}

  				check_outros();
  			}
  		},
  		i: function intro(local) {
  			if (current) return;

  			for (let i = 0; i < each_value.length; i += 1) {
  				transition_in(each_blocks[i]);
  			}

  			current = true;
  		},
  		o: function outro(local) {
  			each_blocks = each_blocks.filter(Boolean);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				transition_out(each_blocks[i]);
  			}

  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(ul);
  			destroy_each(each_blocks, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block$5.name,
  		type: "if",
  		source: "(11:0) {#if expanded}",
  		ctx
  	});

  	return block;
  }

  // (17:4) {:else}
  function create_else_block$4(ctx) {
  	let current;
  	const selectortreeleaf_spread_levels = [/*item*/ ctx[4]];
  	let selectortreeleaf_props = {};

  	for (let i = 0; i < selectortreeleaf_spread_levels.length; i += 1) {
  		selectortreeleaf_props = assign(selectortreeleaf_props, selectortreeleaf_spread_levels[i]);
  	}

  	const selectortreeleaf = new SelectorTreeLeaf({
  			props: selectortreeleaf_props,
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(selectortreeleaf.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(selectortreeleaf, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const selectortreeleaf_changes = (dirty & /*items*/ 4)
  			? get_spread_update(selectortreeleaf_spread_levels, [get_spread_object(/*item*/ ctx[4])])
  			: {};

  			selectortreeleaf.$set(selectortreeleaf_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(selectortreeleaf.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(selectortreeleaf.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(selectortreeleaf, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block$4.name,
  		type: "else",
  		source: "(17:4) {:else}",
  		ctx
  	});

  	return block;
  }

  // (15:4) {#if item.type === 'container'}
  function create_if_block_1$2(ctx) {
  	let current;
  	const selectortreebranch_spread_levels = [/*item*/ ctx[4]];
  	let selectortreebranch_props = {};

  	for (let i = 0; i < selectortreebranch_spread_levels.length; i += 1) {
  		selectortreebranch_props = assign(selectortreebranch_props, selectortreebranch_spread_levels[i]);
  	}

  	const selectortreebranch = new SelectorTreeBranch({
  			props: selectortreebranch_props,
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(selectortreebranch.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(selectortreebranch, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const selectortreebranch_changes = (dirty & /*items*/ 4)
  			? get_spread_update(selectortreebranch_spread_levels, [get_spread_object(/*item*/ ctx[4])])
  			: {};

  			selectortreebranch.$set(selectortreebranch_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(selectortreebranch.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(selectortreebranch.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(selectortreebranch, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block_1$2.name,
  		type: "if",
  		source: "(15:4) {#if item.type === 'container'}",
  		ctx
  	});

  	return block;
  }

  // (13:2) {#each items as item}
  function create_each_block$2(ctx) {
  	let li;
  	let current_block_type_index;
  	let if_block;
  	let t;
  	let current;
  	const if_block_creators = [create_if_block_1$2, create_else_block$4];
  	const if_blocks = [];

  	function select_block_type(ctx, dirty) {
  		if (/*item*/ ctx[4].type === "container") return 0;
  		return 1;
  	}

  	current_block_type_index = select_block_type(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

  	const block = {
  		c: function create() {
  			li = element("li");
  			if_block.c();
  			t = space();
  			attr_dev(li, "class", "svelte-2x6ipa");
  			add_location(li, file$e, 13, 3, 295);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, li, anchor);
  			if_blocks[current_block_type_index].m(li, null);
  			append_dev(li, t);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(li, t);
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(li);
  			if_blocks[current_block_type_index].d();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block$2.name,
  		type: "each",
  		source: "(13:2) {#each items as item}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$e(ctx) {
  	let span;
  	let t0;
  	let t1;
  	let if_block_anchor;
  	let current;
  	let mounted;
  	let dispose;
  	let if_block = /*expanded*/ ctx[0] && create_if_block$5(ctx);

  	const block = {
  		c: function create() {
  			span = element("span");
  			t0 = text(/*label*/ ctx[1]);
  			t1 = space();
  			if (if_block) if_block.c();
  			if_block_anchor = empty();
  			attr_dev(span, "class", "svelte-2x6ipa");
  			toggle_class(span, "expanded", /*expanded*/ ctx[0]);
  			add_location(span, file$e, 8, 0, 187);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  			append_dev(span, t0);
  			insert_dev(target, t1, anchor);
  			if (if_block) if_block.m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  			current = true;

  			if (!mounted) {
  				dispose = listen_dev(span, "click", /*toggle*/ ctx[3], false, false, false);
  				mounted = true;
  			}
  		},
  		p: function update(ctx, [dirty]) {
  			if (!current || dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

  			if (dirty & /*expanded*/ 1) {
  				toggle_class(span, "expanded", /*expanded*/ ctx[0]);
  			}

  			if (/*expanded*/ ctx[0]) {
  				if (if_block) {
  					if_block.p(ctx, dirty);

  					if (dirty & /*expanded*/ 1) {
  						transition_in(if_block, 1);
  					}
  				} else {
  					if_block = create_if_block$5(ctx);
  					if_block.c();
  					transition_in(if_block, 1);
  					if_block.m(if_block_anchor.parentNode, if_block_anchor);
  				}
  			} else if (if_block) {
  				group_outros();

  				transition_out(if_block, 1, 1, () => {
  					if_block = null;
  				});

  				check_outros();
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  			if (detaching) detach_dev(t1);
  			if (if_block) if_block.d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$e.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$e($$self, $$props, $$invalidate) {
  	let { expanded = false } = $$props;
  	let { label } = $$props, { items } = $$props;

  	function toggle() {
  		$$invalidate(0, expanded = !expanded);
  	}

  	const writable_props = ["expanded", "label", "items"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SelectorTreeBranch> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("SelectorTreeBranch", $$slots, []);

  	$$self.$set = $$props => {
  		if ("expanded" in $$props) $$invalidate(0, expanded = $$props.expanded);
  		if ("label" in $$props) $$invalidate(1, label = $$props.label);
  		if ("items" in $$props) $$invalidate(2, items = $$props.items);
  	};

  	$$self.$capture_state = () => ({
  		SelectorTreeLeaf,
  		expanded,
  		label,
  		items,
  		toggle
  	});

  	$$self.$inject_state = $$props => {
  		if ("expanded" in $$props) $$invalidate(0, expanded = $$props.expanded);
  		if ("label" in $$props) $$invalidate(1, label = $$props.label);
  		if ("items" in $$props) $$invalidate(2, items = $$props.items);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [expanded, label, items, toggle];
  }

  class SelectorTreeBranch extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$e, create_fragment$e, safe_not_equal, { expanded: 0, label: 1, items: 2 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "SelectorTreeBranch",
  			options,
  			id: create_fragment$e.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*label*/ ctx[1] === undefined && !("label" in props)) {
  			console.warn("<SelectorTreeBranch> was created without expected prop 'label'");
  		}

  		if (/*items*/ ctx[2] === undefined && !("items" in props)) {
  			console.warn("<SelectorTreeBranch> was created without expected prop 'items'");
  		}
  	}

  	get expanded() {
  		throw new Error("<SelectorTreeBranch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set expanded(value) {
  		throw new Error("<SelectorTreeBranch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get label() {
  		throw new Error("<SelectorTreeBranch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set label(value) {
  		throw new Error("<SelectorTreeBranch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get items() {
  		throw new Error("<SelectorTreeBranch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set items(value) {
  		throw new Error("<SelectorTreeBranch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\VariableSelector\SelectorTree.svelte generated by Svelte v3.23.0 */

  const file$f = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\VariableSelector\\SelectorTree.svelte";

  // (27:12) {:else}
  function create_else_block$5(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			attr_dev(span, "class", "fa fa-toggle-down");
  			add_location(span, file$f, 27, 14, 890);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block$5.name,
  		type: "else",
  		source: "(27:12) {:else}",
  		ctx
  	});

  	return block;
  }

  // (25:12) {#if isOpen}
  function create_if_block$6(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			attr_dev(span, "class", "fa fa-toggle-up");
  			add_location(span, file$f, 25, 14, 818);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block$6.name,
  		type: "if",
  		source: "(25:12) {#if isOpen}",
  		ctx
  	});

  	return block;
  }

  // (23:8) <Button color="primary" size="sm"             on:click={() => (isOpen = !isOpen)} class="mb-3">
  function create_default_slot_6$1(ctx) {
  	let if_block_anchor;

  	function select_block_type(ctx, dirty) {
  		if (/*isOpen*/ ctx[0]) return create_if_block$6;
  		return create_else_block$5;
  	}

  	let current_block_type = select_block_type(ctx);
  	let if_block = current_block_type(ctx);

  	const block = {
  		c: function create() {
  			if_block.c();
  			if_block_anchor = empty();
  		},
  		m: function mount(target, anchor) {
  			if_block.m(target, anchor);
  			insert_dev(target, if_block_anchor, anchor);
  		},
  		p: function update(ctx, dirty) {
  			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
  				if_block.d(1);
  				if_block = current_block_type(ctx);

  				if (if_block) {
  					if_block.c();
  					if_block.m(if_block_anchor.parentNode, if_block_anchor);
  				}
  			}
  		},
  		d: function destroy(detaching) {
  			if_block.d(detaching);
  			if (detaching) detach_dev(if_block_anchor);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_6$1.name,
  		type: "slot",
  		source: "(23:8) <Button color=\\\"primary\\\" size=\\\"sm\\\"             on:click={() => (isOpen = !isOpen)} class=\\\"mb-3\\\">",
  		ctx
  	});

  	return block;
  }

  // (32:8) <Button size="sm" on:click={clearAll}>
  function create_default_slot_5$1(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = text("Clear All");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_5$1.name,
  		type: "slot",
  		source: "(32:8) <Button size=\\\"sm\\\" on:click={clearAll}>",
  		ctx
  	});

  	return block;
  }

  // (22:6) <CardTitle>
  function create_default_slot_4$1(ctx) {
  	let t;
  	let current;

  	const button0 = new Button({
  			props: {
  				color: "primary",
  				size: "sm",
  				class: "mb-3",
  				$$slots: { default: [create_default_slot_6$1] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	button0.$on("click", /*click_handler*/ ctx[3]);

  	const button1 = new Button({
  			props: {
  				size: "sm",
  				$$slots: { default: [create_default_slot_5$1] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	button1.$on("click", /*clearAll*/ ctx[1]);

  	const block = {
  		c: function create() {
  			create_component(button0.$$.fragment);
  			t = text("\n        Select/Unselect Variables of Interest Here\n        ");
  			create_component(button1.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(button0, target, anchor);
  			insert_dev(target, t, anchor);
  			mount_component(button1, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const button0_changes = {};

  			if (dirty & /*$$scope, isOpen*/ 17) {
  				button0_changes.$$scope = { dirty, ctx };
  			}

  			button0.$set(button0_changes);
  			const button1_changes = {};

  			if (dirty & /*$$scope*/ 16) {
  				button1_changes.$$scope = { dirty, ctx };
  			}

  			button1.$set(button1_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(button0.$$.fragment, local);
  			transition_in(button1.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(button0.$$.fragment, local);
  			transition_out(button1.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(button0, detaching);
  			if (detaching) detach_dev(t);
  			destroy_component(button1, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_4$1.name,
  		type: "slot",
  		source: "(22:6) <CardTitle>",
  		ctx
  	});

  	return block;
  }

  // (21:4) <CardHeader>
  function create_default_slot_3$1(ctx) {
  	let current;

  	const cardtitle = new CardTitle({
  			props: {
  				$$slots: { default: [create_default_slot_4$1] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardtitle.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardtitle, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardtitle_changes = {};

  			if (dirty & /*$$scope, isOpen*/ 17) {
  				cardtitle_changes.$$scope = { dirty, ctx };
  			}

  			cardtitle.$set(cardtitle_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardtitle.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardtitle.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardtitle, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_3$1.name,
  		type: "slot",
  		source: "(21:4) <CardHeader>",
  		ctx
  	});

  	return block;
  }

  // (39:6) <CardBody>
  function create_default_slot_2$1(ctx) {
  	let current;

  	const selectortreebranch = new SelectorTreeBranch({
  			props: {
  				label: "Modules",
  				items: variableTree,
  				expanded: true
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(selectortreebranch.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(selectortreebranch, target, anchor);
  			current = true;
  		},
  		p: noop,
  		i: function intro(local) {
  			if (current) return;
  			transition_in(selectortreebranch.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(selectortreebranch.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(selectortreebranch, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_2$1.name,
  		type: "slot",
  		source: "(39:6) <CardBody>",
  		ctx
  	});

  	return block;
  }

  // (38:4) <Collapse {isOpen}>
  function create_default_slot_1$1(ctx) {
  	let current;

  	const cardbody = new CardBody({
  			props: {
  				$$slots: { default: [create_default_slot_2$1] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardbody.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardbody, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardbody_changes = {};

  			if (dirty & /*$$scope*/ 16) {
  				cardbody_changes.$$scope = { dirty, ctx };
  			}

  			cardbody.$set(cardbody_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardbody.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardbody.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardbody, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_1$1.name,
  		type: "slot",
  		source: "(38:4) <Collapse {isOpen}>",
  		ctx
  	});

  	return block;
  }

  // (20:2) <Card>
  function create_default_slot$1(ctx) {
  	let t;
  	let current;

  	const cardheader = new CardHeader({
  			props: {
  				$$slots: { default: [create_default_slot_3$1] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const collapse = new Collapse({
  			props: {
  				isOpen: /*isOpen*/ ctx[0],
  				$$slots: { default: [create_default_slot_1$1] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardheader.$$.fragment);
  			t = space();
  			create_component(collapse.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardheader, target, anchor);
  			insert_dev(target, t, anchor);
  			mount_component(collapse, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardheader_changes = {};

  			if (dirty & /*$$scope, isOpen*/ 17) {
  				cardheader_changes.$$scope = { dirty, ctx };
  			}

  			cardheader.$set(cardheader_changes);
  			const collapse_changes = {};
  			if (dirty & /*isOpen*/ 1) collapse_changes.isOpen = /*isOpen*/ ctx[0];

  			if (dirty & /*$$scope*/ 16) {
  				collapse_changes.$$scope = { dirty, ctx };
  			}

  			collapse.$set(collapse_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardheader.$$.fragment, local);
  			transition_in(collapse.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardheader.$$.fragment, local);
  			transition_out(collapse.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardheader, detaching);
  			if (detaching) detach_dev(t);
  			destroy_component(collapse, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$1.name,
  		type: "slot",
  		source: "(20:2) <Card>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$f(ctx) {
  	let div;
  	let current;

  	const card = new Card({
  			props: {
  				$$slots: { default: [create_default_slot$1] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			div = element("div");
  			create_component(card.$$.fragment);
  			attr_dev(div, "class", "overflow-auto");
  			attr_dev(div, "max-height", "800");
  			add_location(div, file$f, 18, 0, 586);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);
  			mount_component(card, div, null);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const card_changes = {};

  			if (dirty & /*$$scope, isOpen*/ 17) {
  				card_changes.$$scope = { dirty, ctx };
  			}

  			card.$set(card_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(card.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(card.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			destroy_component(card);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$f.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$f($$self, $$props, $$invalidate) {
  	let $_selected;
  	validate_store(_selected, "_selected");
  	component_subscribe($$self, _selected, $$value => $$invalidate(2, $_selected = $$value));
  	let isOpen = true;

  	function clearAll() {
  		//console.log('Before clear: ',$_selected)
  		$_selected.forEach(key => {
  			_selected.select(key, false);
  			document.getElementById("variable-selector-checkbox-" + key).checked = false;
  		});
  	} //console.log('After clear: ',$_selected)

  	const writable_props = [];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SelectorTree> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("SelectorTree", $$slots, []);
  	const click_handler = () => $$invalidate(0, isOpen = !isOpen);

  	$$self.$capture_state = () => ({
  		_selected,
  		variableTree,
  		variableMap,
  		SelectorTreeBranch,
  		Button,
  		Collapse,
  		Card,
  		CardBody,
  		CardHeader,
  		CardTitle,
  		isOpen,
  		clearAll,
  		$_selected
  	});

  	$$self.$inject_state = $$props => {
  		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [isOpen, clearAll, $_selected, click_handler];
  }

  class SelectorTree extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "SelectorTree",
  			options,
  			id: create_fragment$f.name
  		});
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\VariableSelector\VariableSelector.svelte generated by Svelte v3.23.0 */
  const file$g = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\VariableSelector\\VariableSelector.svelte";

  // (9:4) <CardText>
  function create_default_slot_2$2(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = text("Select as many Graph Y Variables as you like from the first panel;\r\n      the selected variables will appear in the second panel.");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_2$2.name,
  		type: "slot",
  		source: "(9:4) <CardText>",
  		ctx
  	});

  	return block;
  }

  // (13:4) <CardText>
  function create_default_slot_1$2(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = text("A separate graph will be produced for each selected Y variable.\r\n      As you select and unselect Y variables,\r\n      the number of applicable BehavePlus configuration options will likely change,\r\n      as may the set of required input variables.");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_1$2.name,
  		type: "slot",
  		source: "(13:4) <CardText>",
  		ctx
  	});

  	return block;
  }

  // (19:4) <Row>
  function create_default_slot$2(ctx) {
  	let t;
  	let current;
  	const selectortree = new SelectorTree({ $$inline: true });
  	const selectedpanel = new SelectedPanel({ $$inline: true });

  	const block = {
  		c: function create() {
  			create_component(selectortree.$$.fragment);
  			t = space();
  			create_component(selectedpanel.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(selectortree, target, anchor);
  			insert_dev(target, t, anchor);
  			mount_component(selectedpanel, target, anchor);
  			current = true;
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(selectortree.$$.fragment, local);
  			transition_in(selectedpanel.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(selectortree.$$.fragment, local);
  			transition_out(selectedpanel.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(selectortree, detaching);
  			if (detaching) detach_dev(t);
  			destroy_component(selectedpanel, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$2.name,
  		type: "slot",
  		source: "(19:4) <Row>",
  		ctx
  	});

  	return block;
  }

  // (8:8)       
  function fallback_block$1(ctx) {
  	let t0;
  	let t1;
  	let current;

  	const cardtext0 = new CardText({
  			props: {
  				$$slots: { default: [create_default_slot_2$2] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const cardtext1 = new CardText({
  			props: {
  				$$slots: { default: [create_default_slot_1$2] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const row = new Row({
  			props: {
  				$$slots: { default: [create_default_slot$2] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardtext0.$$.fragment);
  			t0 = space();
  			create_component(cardtext1.$$.fragment);
  			t1 = space();
  			create_component(row.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardtext0, target, anchor);
  			insert_dev(target, t0, anchor);
  			mount_component(cardtext1, target, anchor);
  			insert_dev(target, t1, anchor);
  			mount_component(row, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardtext0_changes = {};

  			if (dirty & /*$$scope*/ 2) {
  				cardtext0_changes.$$scope = { dirty, ctx };
  			}

  			cardtext0.$set(cardtext0_changes);
  			const cardtext1_changes = {};

  			if (dirty & /*$$scope*/ 2) {
  				cardtext1_changes.$$scope = { dirty, ctx };
  			}

  			cardtext1.$set(cardtext1_changes);
  			const row_changes = {};

  			if (dirty & /*$$scope*/ 2) {
  				row_changes.$$scope = { dirty, ctx };
  			}

  			row.$set(row_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardtext0.$$.fragment, local);
  			transition_in(cardtext1.$$.fragment, local);
  			transition_in(row.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardtext0.$$.fragment, local);
  			transition_out(cardtext1.$$.fragment, local);
  			transition_out(row.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardtext0, detaching);
  			if (detaching) detach_dev(t0);
  			destroy_component(cardtext1, detaching);
  			if (detaching) detach_dev(t1);
  			destroy_component(row, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: fallback_block$1.name,
  		type: "fallback",
  		source: "(8:8)       ",
  		ctx
  	});

  	return block;
  }

  function create_fragment$g(ctx) {
  	let div;
  	let current;
  	const default_slot_template = /*$$slots*/ ctx[0].default;
  	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
  	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

  	const block = {
  		c: function create() {
  			div = element("div");
  			if (default_slot_or_fallback) default_slot_or_fallback.c();
  			attr_dev(div, "id", "selectVariablesComponent");
  			add_location(div, file$g, 6, 0, 182);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);

  			if (default_slot_or_fallback) {
  				default_slot_or_fallback.m(div, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (default_slot) {
  				if (default_slot.p && dirty & /*$$scope*/ 2) {
  					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(default_slot_or_fallback, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(default_slot_or_fallback, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$g.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$g($$self, $$props, $$invalidate) {
  	const writable_props = [];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VariableSelector> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("VariableSelector", $$slots, ['default']);

  	$$self.$set = $$props => {
  		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		SelectedPanel,
  		SelectorTree,
  		Col,
  		Row,
  		CardText
  	});

  	return [$$slots, $$scope];
  }

  class VariableSelector extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "VariableSelector",
  			options,
  			id: create_fragment$g.name
  		});
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\NavButtons.svelte generated by Svelte v3.23.0 */

  const file$h = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\NavButtons.svelte";

  function create_fragment$h(ctx) {
  	let a0;
  	let span0;
  	let t0;
  	let t1_value = /*pages*/ ctx[0][/*prev*/ ctx[2]].title + "";
  	let t1;
  	let t2;
  	let a0_href_value;
  	let t3;
  	let a1;
  	let span1;
  	let t4;
  	let t5_value = /*pages*/ ctx[0][/*next*/ ctx[3]].title + "";
  	let t5;
  	let t6;
  	let a1_href_value;
  	let t7;
  	let a2;
  	let span2;
  	let t8;
  	let a2_href_value;
  	let t9;
  	let a3;
  	let span3;
  	let t10;
  	let a3_href_value;

  	const block = {
  		c: function create() {
  			a0 = element("a");
  			span0 = element("span");
  			t0 = text(" Prev (");
  			t1 = text(t1_value);
  			t2 = text(")");
  			t3 = space();
  			a1 = element("a");
  			span1 = element("span");
  			t4 = text(" Next (");
  			t5 = text(t5_value);
  			t6 = text(")");
  			t7 = space();
  			a2 = element("a");
  			span2 = element("span");
  			t8 = text(" First");
  			t9 = space();
  			a3 = element("a");
  			span3 = element("span");
  			t10 = text(" Last");
  			attr_dev(span0, "class", "fa fa-angle-double-left");
  			add_location(span0, file$h, 11, 2, 321);
  			attr_dev(a0, "href", a0_href_value = "#" + /*pages*/ ctx[0][/*prev*/ ctx[2]].id);
  			attr_dev(a0, "class", /*buttonClasses*/ ctx[4]);
  			attr_dev(a0, "role", "button");
  			add_location(a0, file$h, 10, 0, 253);
  			attr_dev(span1, "class", "fa fa-angle-double-right");
  			add_location(span1, file$h, 13, 2, 465);
  			attr_dev(a1, "href", a1_href_value = "#" + /*pages*/ ctx[0][/*next*/ ctx[3]].id);
  			attr_dev(a1, "class", /*buttonClasses*/ ctx[4]);
  			attr_dev(a1, "role", "button");
  			add_location(a1, file$h, 12, 0, 397);
  			attr_dev(span2, "class", "fa fa-angle-double-up");
  			add_location(span2, file$h, 15, 2, 607);
  			attr_dev(a2, "href", a2_href_value = "#" + /*pages*/ ctx[0][0].id);
  			attr_dev(a2, "class", /*buttonClasses*/ ctx[4]);
  			attr_dev(a2, "role", "button");
  			add_location(a2, file$h, 14, 0, 542);
  			attr_dev(span3, "class", "fa fa-angle-double-down");
  			add_location(span3, file$h, 17, 2, 728);
  			attr_dev(a3, "href", a3_href_value = "#" + /*pages*/ ctx[0][/*last*/ ctx[1]].id);
  			attr_dev(a3, "class", /*buttonClasses*/ ctx[4]);
  			attr_dev(a3, "role", "button");
  			add_location(a3, file$h, 16, 0, 660);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, a0, anchor);
  			append_dev(a0, span0);
  			append_dev(a0, t0);
  			append_dev(a0, t1);
  			append_dev(a0, t2);
  			insert_dev(target, t3, anchor);
  			insert_dev(target, a1, anchor);
  			append_dev(a1, span1);
  			append_dev(a1, t4);
  			append_dev(a1, t5);
  			append_dev(a1, t6);
  			insert_dev(target, t7, anchor);
  			insert_dev(target, a2, anchor);
  			append_dev(a2, span2);
  			append_dev(a2, t8);
  			insert_dev(target, t9, anchor);
  			insert_dev(target, a3, anchor);
  			append_dev(a3, span3);
  			append_dev(a3, t10);
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*pages*/ 1 && t1_value !== (t1_value = /*pages*/ ctx[0][/*prev*/ ctx[2]].title + "")) set_data_dev(t1, t1_value);

  			if (dirty & /*pages*/ 1 && a0_href_value !== (a0_href_value = "#" + /*pages*/ ctx[0][/*prev*/ ctx[2]].id)) {
  				attr_dev(a0, "href", a0_href_value);
  			}

  			if (dirty & /*pages*/ 1 && t5_value !== (t5_value = /*pages*/ ctx[0][/*next*/ ctx[3]].title + "")) set_data_dev(t5, t5_value);

  			if (dirty & /*pages*/ 1 && a1_href_value !== (a1_href_value = "#" + /*pages*/ ctx[0][/*next*/ ctx[3]].id)) {
  				attr_dev(a1, "href", a1_href_value);
  			}

  			if (dirty & /*pages*/ 1 && a2_href_value !== (a2_href_value = "#" + /*pages*/ ctx[0][0].id)) {
  				attr_dev(a2, "href", a2_href_value);
  			}

  			if (dirty & /*pages*/ 1 && a3_href_value !== (a3_href_value = "#" + /*pages*/ ctx[0][/*last*/ ctx[1]].id)) {
  				attr_dev(a3, "href", a3_href_value);
  			}
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(a0);
  			if (detaching) detach_dev(t3);
  			if (detaching) detach_dev(a1);
  			if (detaching) detach_dev(t7);
  			if (detaching) detach_dev(a2);
  			if (detaching) detach_dev(t9);
  			if (detaching) detach_dev(a3);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$h.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$h($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	let last = pages.length - 1;
  	let prev = Math.max(0, pageIndex - 1);
  	let next = Math.min(pages.length - 1, pageIndex + 1);
  	let buttonClasses = "btn btn-outline-primary btn-sm";
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NavButtons> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("NavButtons", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(5, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({
  		pages,
  		pageIndex,
  		page,
  		last,
  		prev,
  		next,
  		buttonClasses
  	});

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(5, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) page = $$props.page;
  		if ("last" in $$props) $$invalidate(1, last = $$props.last);
  		if ("prev" in $$props) $$invalidate(2, prev = $$props.prev);
  		if ("next" in $$props) $$invalidate(3, next = $$props.next);
  		if ("buttonClasses" in $$props) $$invalidate(4, buttonClasses = $$props.buttonClasses);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, last, prev, next, buttonClasses, pageIndex];
  }

  class NavButtons extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$h, create_fragment$h, safe_not_equal, { pages: 0, pageIndex: 5 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "NavButtons",
  			options,
  			id: create_fragment$h.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<NavButtons> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[5] === undefined && !("pageIndex" in props)) {
  			console.warn("<NavButtons> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<NavButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<NavButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<NavButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<NavButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\StandardPage.svelte generated by Svelte v3.23.0 */

  const file$i = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\StandardPage.svelte";
  const get_content_slot_changes = dirty => ({});
  const get_content_slot_context = ctx => ({});
  const get_title_slot_changes = dirty => ({});
  const get_title_slot_context = ctx => ({});

  // (18:27)            
  function fallback_block_1(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = "Unknown title";
  			attr_dev(span, "class", "missing");
  			add_location(span, file$i, 18, 10, 614);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: fallback_block_1.name,
  		type: "fallback",
  		source: "(18:27)            ",
  		ctx
  	});

  	return block;
  }

  // (17:6) <CardTitle>
  function create_default_slot_4$2(ctx) {
  	let current;
  	const title_slot_template = /*$$slots*/ ctx[7].title;
  	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[8], get_title_slot_context);
  	const title_slot_or_fallback = title_slot || fallback_block_1(ctx);

  	const block = {
  		c: function create() {
  			if (title_slot_or_fallback) title_slot_or_fallback.c();
  		},
  		m: function mount(target, anchor) {
  			if (title_slot_or_fallback) {
  				title_slot_or_fallback.m(target, anchor);
  			}

  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (title_slot) {
  				if (title_slot.p && dirty & /*$$scope*/ 256) {
  					update_slot(title_slot, title_slot_template, ctx, /*$$scope*/ ctx[8], dirty, get_title_slot_changes, get_title_slot_context);
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(title_slot_or_fallback, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(title_slot_or_fallback, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_4$2.name,
  		type: "slot",
  		source: "(17:6) <CardTitle>",
  		ctx
  	});

  	return block;
  }

  // (16:4) <CardHeader class={headerClasses}>
  function create_default_slot_3$2(ctx) {
  	let current;

  	const cardtitle = new CardTitle({
  			props: {
  				$$slots: { default: [create_default_slot_4$2] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardtitle.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardtitle, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardtitle_changes = {};

  			if (dirty & /*$$scope*/ 256) {
  				cardtitle_changes.$$scope = { dirty, ctx };
  			}

  			cardtitle.$set(cardtitle_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardtitle.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardtitle.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardtitle, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_3$2.name,
  		type: "slot",
  		source: "(16:4) <CardHeader class={headerClasses}>",
  		ctx
  	});

  	return block;
  }

  // (24:27)          
  function fallback_block$2(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = "Unknown content";
  			attr_dev(span, "class", "missing");
  			add_location(span, file$i, 24, 8, 781);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: fallback_block$2.name,
  		type: "fallback",
  		source: "(24:27)          ",
  		ctx
  	});

  	return block;
  }

  // (23:4) <CardBody class={bodyClasses}>
  function create_default_slot_2$3(ctx) {
  	let current;
  	const content_slot_template = /*$$slots*/ ctx[7].content;
  	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[8], get_content_slot_context);
  	const content_slot_or_fallback = content_slot || fallback_block$2(ctx);

  	const block = {
  		c: function create() {
  			if (content_slot_or_fallback) content_slot_or_fallback.c();
  		},
  		m: function mount(target, anchor) {
  			if (content_slot_or_fallback) {
  				content_slot_or_fallback.m(target, anchor);
  			}

  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (content_slot) {
  				if (content_slot.p && dirty & /*$$scope*/ 256) {
  					update_slot(content_slot, content_slot_template, ctx, /*$$scope*/ ctx[8], dirty, get_content_slot_changes, get_content_slot_context);
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(content_slot_or_fallback, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(content_slot_or_fallback, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (content_slot_or_fallback) content_slot_or_fallback.d(detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_2$3.name,
  		type: "slot",
  		source: "(23:4) <CardBody class={bodyClasses}>",
  		ctx
  	});

  	return block;
  }

  // (28:4) <CardFooter class={footerClasses}>
  function create_default_slot_1$3(ctx) {
  	let current;

  	const navbuttons = new NavButtons({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1]
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(navbuttons.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(navbuttons, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const navbuttons_changes = {};
  			if (dirty & /*pages*/ 1) navbuttons_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) navbuttons_changes.pageIndex = /*pageIndex*/ ctx[1];
  			navbuttons.$set(navbuttons_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(navbuttons.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(navbuttons.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(navbuttons, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot_1$3.name,
  		type: "slot",
  		source: "(28:4) <CardFooter class={footerClasses}>",
  		ctx
  	});

  	return block;
  }

  // (15:2) <Card id={page.id} style="height: 400px" class={cardClasses}>
  function create_default_slot$3(ctx) {
  	let t0;
  	let t1;
  	let current;

  	const cardheader = new CardHeader({
  			props: {
  				class: /*headerClasses*/ ctx[4],
  				$$slots: { default: [create_default_slot_3$2] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const cardbody = new CardBody({
  			props: {
  				class: /*bodyClasses*/ ctx[6],
  				$$slots: { default: [create_default_slot_2$3] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const cardfooter = new CardFooter({
  			props: {
  				class: /*footerClasses*/ ctx[5],
  				$$slots: { default: [create_default_slot_1$3] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(cardheader.$$.fragment);
  			t0 = space();
  			create_component(cardbody.$$.fragment);
  			t1 = space();
  			create_component(cardfooter.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(cardheader, target, anchor);
  			insert_dev(target, t0, anchor);
  			mount_component(cardbody, target, anchor);
  			insert_dev(target, t1, anchor);
  			mount_component(cardfooter, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const cardheader_changes = {};

  			if (dirty & /*$$scope*/ 256) {
  				cardheader_changes.$$scope = { dirty, ctx };
  			}

  			cardheader.$set(cardheader_changes);
  			const cardbody_changes = {};

  			if (dirty & /*$$scope*/ 256) {
  				cardbody_changes.$$scope = { dirty, ctx };
  			}

  			cardbody.$set(cardbody_changes);
  			const cardfooter_changes = {};

  			if (dirty & /*$$scope, pages, pageIndex*/ 259) {
  				cardfooter_changes.$$scope = { dirty, ctx };
  			}

  			cardfooter.$set(cardfooter_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(cardheader.$$.fragment, local);
  			transition_in(cardbody.$$.fragment, local);
  			transition_in(cardfooter.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(cardheader.$$.fragment, local);
  			transition_out(cardbody.$$.fragment, local);
  			transition_out(cardfooter.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(cardheader, detaching);
  			if (detaching) detach_dev(t0);
  			destroy_component(cardbody, detaching);
  			if (detaching) detach_dev(t1);
  			destroy_component(cardfooter, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$3.name,
  		type: "slot",
  		source: "(15:2) <Card id={page.id} style=\\\"height: 400px\\\" class={cardClasses}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$i(ctx) {
  	let div;
  	let div_id_value;
  	let current;

  	const card = new Card({
  			props: {
  				id: /*page*/ ctx[2].id,
  				style: "height: 400px",
  				class: /*cardClasses*/ ctx[3],
  				$$slots: { default: [create_default_slot$3] },
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			div = element("div");
  			create_component(card.$$.fragment);
  			attr_dev(div, "id", div_id_value = /*page*/ ctx[2].id + "Component");
  			add_location(div, file$i, 13, 0, 424);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);
  			mount_component(card, div, null);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const card_changes = {};

  			if (dirty & /*$$scope, pages, pageIndex*/ 259) {
  				card_changes.$$scope = { dirty, ctx };
  			}

  			card.$set(card_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(card.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(card.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			destroy_component(card);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$i.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  const borderColor = "border-success";

  function instance$i($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	let cardClasses = "border-success";
  	let headerClasses = "border-success";
  	let footerClasses = "border-success";
  	let bodyClasses = "overflow-auto " + borderColor;
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StandardPage> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("StandardPage", $$slots, ['title','content']);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
  	};

  	$$self.$capture_state = () => ({
  		NavButtons,
  		Card,
  		CardHeader,
  		CardFooter,
  		CardTitle,
  		CardBody,
  		CardText,
  		pages,
  		pageIndex,
  		page,
  		borderColor,
  		cardClasses,
  		headerClasses,
  		footerClasses,
  		bodyClasses
  	});

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  		if ("cardClasses" in $$props) $$invalidate(3, cardClasses = $$props.cardClasses);
  		if ("headerClasses" in $$props) $$invalidate(4, headerClasses = $$props.headerClasses);
  		if ("footerClasses" in $$props) $$invalidate(5, footerClasses = $$props.footerClasses);
  		if ("bodyClasses" in $$props) $$invalidate(6, bodyClasses = $$props.bodyClasses);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [
  		pages,
  		pageIndex,
  		page,
  		cardClasses,
  		headerClasses,
  		footerClasses,
  		bodyClasses,
  		$$slots,
  		$$scope
  	];
  }

  class StandardPage extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$i, create_fragment$i, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "StandardPage",
  			options,
  			id: create_fragment$i.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<StandardPage> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<StandardPage> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<StandardPage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<StandardPage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<StandardPage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<StandardPage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\Intro.svelte generated by Svelte v3.23.0 */
  const file$j = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\Intro.svelte";

  // (8:2) <span slot="title">
  function create_title_slot(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `${/*page*/ ctx[2].title}`;
  			attr_dev(span, "slot", "title");
  			add_location(span, file$j, 7, 2, 168);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_title_slot.name,
  		type: "slot",
  		source: "(8:2) <span slot=\\\"title\\\">",
  		ctx
  	});

  	return block;
  }

  // (9:2) <span slot="content">
  function create_content_slot(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `This is the '${/*page*/ ctx[2].title}' page`;
  			attr_dev(span, "slot", "content");
  			add_location(span, file$j, 8, 2, 209);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_content_slot.name,
  		type: "slot",
  		source: "(9:2) <span slot=\\\"content\\\">",
  		ctx
  	});

  	return block;
  }

  // (7:0) <StandardPage {pages} {pageIndex}>
  function create_default_slot$4(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = space();
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$4.name,
  		type: "slot",
  		source: "(7:0) <StandardPage {pages} {pageIndex}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$j(ctx) {
  	let current;

  	const standardpage = new StandardPage({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1],
  				$$slots: {
  					default: [create_default_slot$4],
  					content: [create_content_slot],
  					title: [create_title_slot]
  				},
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(standardpage.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(standardpage, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const standardpage_changes = {};
  			if (dirty & /*pages*/ 1) standardpage_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) standardpage_changes.pageIndex = /*pageIndex*/ ctx[1];

  			if (dirty & /*$$scope*/ 8) {
  				standardpage_changes.$$scope = { dirty, ctx };
  			}

  			standardpage.$set(standardpage_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(standardpage.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(standardpage.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(standardpage, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$j.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$j($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Intro> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Intro", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({ StandardPage, pages, pageIndex, page });

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, pageIndex, page];
  }

  class Intro extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$j, create_fragment$j, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Intro",
  			options,
  			id: create_fragment$j.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<Intro> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<Intro> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<Intro>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<Intro>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<Intro>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<Intro>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\Decorations.svelte generated by Svelte v3.23.0 */
  const file$k = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\Decorations.svelte";

  // (8:2) <span slot="title">
  function create_title_slot$1(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `${/*page*/ ctx[2].title}`;
  			attr_dev(span, "slot", "title");
  			add_location(span, file$k, 7, 2, 168);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_title_slot$1.name,
  		type: "slot",
  		source: "(8:2) <span slot=\\\"title\\\">",
  		ctx
  	});

  	return block;
  }

  // (9:2) <span slot="content">
  function create_content_slot$1(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `This is the '${/*page*/ ctx[2].title}' page`;
  			attr_dev(span, "slot", "content");
  			add_location(span, file$k, 8, 2, 209);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_content_slot$1.name,
  		type: "slot",
  		source: "(9:2) <span slot=\\\"content\\\">",
  		ctx
  	});

  	return block;
  }

  // (7:0) <StandardPage {pages} {pageIndex}>
  function create_default_slot$5(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = space();
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$5.name,
  		type: "slot",
  		source: "(7:0) <StandardPage {pages} {pageIndex}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$k(ctx) {
  	let current;

  	const standardpage = new StandardPage({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1],
  				$$slots: {
  					default: [create_default_slot$5],
  					content: [create_content_slot$1],
  					title: [create_title_slot$1]
  				},
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(standardpage.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(standardpage, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const standardpage_changes = {};
  			if (dirty & /*pages*/ 1) standardpage_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) standardpage_changes.pageIndex = /*pageIndex*/ ctx[1];

  			if (dirty & /*$$scope*/ 8) {
  				standardpage_changes.$$scope = { dirty, ctx };
  			}

  			standardpage.$set(standardpage_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(standardpage.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(standardpage.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(standardpage, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$k.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$k($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Decorations> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Decorations", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({ StandardPage, pages, pageIndex, page });

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, pageIndex, page];
  }

  class Decorations extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$k, create_fragment$k, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Decorations",
  			options,
  			id: create_fragment$k.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<Decorations> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<Decorations> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<Decorations>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<Decorations>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<Decorations>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<Decorations>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\Inputs.svelte generated by Svelte v3.23.0 */
  const file$l = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\Inputs.svelte";

  // (8:2) <span slot="title">
  function create_title_slot$2(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `${/*page*/ ctx[2].title}`;
  			attr_dev(span, "slot", "title");
  			add_location(span, file$l, 7, 2, 168);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_title_slot$2.name,
  		type: "slot",
  		source: "(8:2) <span slot=\\\"title\\\">",
  		ctx
  	});

  	return block;
  }

  // (9:2) <span slot="content">
  function create_content_slot$2(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `This is the '${/*page*/ ctx[2].title}' page`;
  			attr_dev(span, "slot", "content");
  			add_location(span, file$l, 8, 2, 209);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_content_slot$2.name,
  		type: "slot",
  		source: "(9:2) <span slot=\\\"content\\\">",
  		ctx
  	});

  	return block;
  }

  // (7:0) <StandardPage {pages} {pageIndex}>
  function create_default_slot$6(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = space();
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$6.name,
  		type: "slot",
  		source: "(7:0) <StandardPage {pages} {pageIndex}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$l(ctx) {
  	let current;

  	const standardpage = new StandardPage({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1],
  				$$slots: {
  					default: [create_default_slot$6],
  					content: [create_content_slot$2],
  					title: [create_title_slot$2]
  				},
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(standardpage.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(standardpage, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const standardpage_changes = {};
  			if (dirty & /*pages*/ 1) standardpage_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) standardpage_changes.pageIndex = /*pageIndex*/ ctx[1];

  			if (dirty & /*$$scope*/ 8) {
  				standardpage_changes.$$scope = { dirty, ctx };
  			}

  			standardpage.$set(standardpage_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(standardpage.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(standardpage.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(standardpage, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$l.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$l($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Inputs> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Inputs", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({ StandardPage, pages, pageIndex, page });

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, pageIndex, page];
  }

  class Inputs extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$l, create_fragment$l, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Inputs",
  			options,
  			id: create_fragment$l.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<Inputs> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<Inputs> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<Inputs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<Inputs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<Inputs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<Inputs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\ModelConfig.svelte generated by Svelte v3.23.0 */
  const file$m = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\ModelConfig.svelte";

  // (8:2) <span slot="title">
  function create_title_slot$3(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `${/*page*/ ctx[2].title}`;
  			attr_dev(span, "slot", "title");
  			add_location(span, file$m, 7, 2, 168);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_title_slot$3.name,
  		type: "slot",
  		source: "(8:2) <span slot=\\\"title\\\">",
  		ctx
  	});

  	return block;
  }

  // (9:2) <span slot="content">
  function create_content_slot$3(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `This is the '${/*page*/ ctx[2].title}' page`;
  			attr_dev(span, "slot", "content");
  			add_location(span, file$m, 8, 2, 209);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_content_slot$3.name,
  		type: "slot",
  		source: "(9:2) <span slot=\\\"content\\\">",
  		ctx
  	});

  	return block;
  }

  // (7:0) <StandardPage {pages} {pageIndex}>
  function create_default_slot$7(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = space();
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$7.name,
  		type: "slot",
  		source: "(7:0) <StandardPage {pages} {pageIndex}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$m(ctx) {
  	let current;

  	const standardpage = new StandardPage({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1],
  				$$slots: {
  					default: [create_default_slot$7],
  					content: [create_content_slot$3],
  					title: [create_title_slot$3]
  				},
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(standardpage.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(standardpage, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const standardpage_changes = {};
  			if (dirty & /*pages*/ 1) standardpage_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) standardpage_changes.pageIndex = /*pageIndex*/ ctx[1];

  			if (dirty & /*$$scope*/ 8) {
  				standardpage_changes.$$scope = { dirty, ctx };
  			}

  			standardpage.$set(standardpage_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(standardpage.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(standardpage.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(standardpage, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$m.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$m($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ModelConfig> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("ModelConfig", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({ StandardPage, pages, pageIndex, page });

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, pageIndex, page];
  }

  class ModelConfig extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$m, create_fragment$m, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "ModelConfig",
  			options,
  			id: create_fragment$m.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<ModelConfig> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<ModelConfig> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<ModelConfig>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<ModelConfig>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<ModelConfig>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<ModelConfig>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\Results.svelte generated by Svelte v3.23.0 */
  const file$n = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\Results.svelte";

  // (8:2) <span slot="title">
  function create_title_slot$4(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `${/*page*/ ctx[2].title}`;
  			attr_dev(span, "slot", "title");
  			add_location(span, file$n, 7, 2, 168);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_title_slot$4.name,
  		type: "slot",
  		source: "(8:2) <span slot=\\\"title\\\">",
  		ctx
  	});

  	return block;
  }

  // (9:2) <span slot="content">
  function create_content_slot$4(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `This is the '${/*page*/ ctx[2].title}' page`;
  			attr_dev(span, "slot", "content");
  			add_location(span, file$n, 8, 2, 209);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_content_slot$4.name,
  		type: "slot",
  		source: "(9:2) <span slot=\\\"content\\\">",
  		ctx
  	});

  	return block;
  }

  // (7:0) <StandardPage {pages} {pageIndex}>
  function create_default_slot$8(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = space();
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$8.name,
  		type: "slot",
  		source: "(7:0) <StandardPage {pages} {pageIndex}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$n(ctx) {
  	let current;

  	const standardpage = new StandardPage({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1],
  				$$slots: {
  					default: [create_default_slot$8],
  					content: [create_content_slot$4],
  					title: [create_title_slot$4]
  				},
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(standardpage.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(standardpage, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const standardpage_changes = {};
  			if (dirty & /*pages*/ 1) standardpage_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) standardpage_changes.pageIndex = /*pageIndex*/ ctx[1];

  			if (dirty & /*$$scope*/ 8) {
  				standardpage_changes.$$scope = { dirty, ctx };
  			}

  			standardpage.$set(standardpage_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(standardpage.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(standardpage.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(standardpage, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$n.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$n($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Results> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("Results", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({ StandardPage, pages, pageIndex, page });

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, pageIndex, page];
  }

  class Results extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$n, create_fragment$n, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Results",
  			options,
  			id: create_fragment$n.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<Results> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<Results> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<Results>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<Results>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<Results>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<Results>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\XVariable.svelte generated by Svelte v3.23.0 */
  const file$o = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\XVariable.svelte";

  // (8:2) <span slot="title">
  function create_title_slot$5(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `${/*page*/ ctx[2].title}`;
  			attr_dev(span, "slot", "title");
  			add_location(span, file$o, 7, 2, 168);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_title_slot$5.name,
  		type: "slot",
  		source: "(8:2) <span slot=\\\"title\\\">",
  		ctx
  	});

  	return block;
  }

  // (9:2) <span slot="content">
  function create_content_slot$5(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `This is the '${/*page*/ ctx[2].title}' page`;
  			attr_dev(span, "slot", "content");
  			add_location(span, file$o, 8, 2, 209);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_content_slot$5.name,
  		type: "slot",
  		source: "(9:2) <span slot=\\\"content\\\">",
  		ctx
  	});

  	return block;
  }

  // (7:0) <StandardPage {pages} {pageIndex}>
  function create_default_slot$9(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = space();
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$9.name,
  		type: "slot",
  		source: "(7:0) <StandardPage {pages} {pageIndex}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$o(ctx) {
  	let current;

  	const standardpage = new StandardPage({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1],
  				$$slots: {
  					default: [create_default_slot$9],
  					content: [create_content_slot$5],
  					title: [create_title_slot$5]
  				},
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(standardpage.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(standardpage, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const standardpage_changes = {};
  			if (dirty & /*pages*/ 1) standardpage_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) standardpage_changes.pageIndex = /*pageIndex*/ ctx[1];

  			if (dirty & /*$$scope*/ 8) {
  				standardpage_changes.$$scope = { dirty, ctx };
  			}

  			standardpage.$set(standardpage_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(standardpage.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(standardpage.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(standardpage, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$o.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$o($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<XVariable> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("XVariable", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({ StandardPage, pages, pageIndex, page });

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, pageIndex, page];
  }

  class XVariable extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$o, create_fragment$o, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "XVariable",
  			options,
  			id: create_fragment$o.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<XVariable> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<XVariable> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<XVariable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<XVariable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<XVariable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<XVariable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\YVariable.svelte generated by Svelte v3.23.0 */
  const file$p = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\YVariable.svelte";

  // (12:2) <span slot="title">
  function create_title_slot$6(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `${/*page*/ ctx[2].title}`;
  			attr_dev(span, "slot", "title");
  			add_location(span, file$p, 11, 2, 313);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_title_slot$6.name,
  		type: "slot",
  		source: "(12:2) <span slot=\\\"title\\\">",
  		ctx
  	});

  	return block;
  }

  // (13:2) <span slot="content">
  function create_content_slot$6(ctx) {
  	let span;
  	let current;
  	var switch_value = /*content*/ ctx[3];

  	function switch_props(ctx) {
  		return { $$inline: true };
  	}

  	if (switch_value) {
  		var switch_instance = new switch_value(switch_props());
  	}

  	const block = {
  		c: function create() {
  			span = element("span");
  			if (switch_instance) create_component(switch_instance.$$.fragment);
  			attr_dev(span, "slot", "content");
  			add_location(span, file$p, 12, 2, 354);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);

  			if (switch_instance) {
  				mount_component(switch_instance, span, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			if (switch_value !== (switch_value = /*content*/ ctx[3])) {
  				if (switch_instance) {
  					group_outros();
  					const old_component = switch_instance;

  					transition_out(old_component.$$.fragment, 1, 0, () => {
  						destroy_component(old_component, 1);
  					});

  					check_outros();
  				}

  				if (switch_value) {
  					switch_instance = new switch_value(switch_props());
  					create_component(switch_instance.$$.fragment);
  					transition_in(switch_instance.$$.fragment, 1);
  					mount_component(switch_instance, span, null);
  				} else {
  					switch_instance = null;
  				}
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  			if (switch_instance) destroy_component(switch_instance);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_content_slot$6.name,
  		type: "slot",
  		source: "(13:2) <span slot=\\\"content\\\">",
  		ctx
  	});

  	return block;
  }

  // (11:0) <StandardPage {pages} {pageIndex}>
  function create_default_slot$a(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = space();
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: noop,
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$a.name,
  		type: "slot",
  		source: "(11:0) <StandardPage {pages} {pageIndex}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$p(ctx) {
  	let current;

  	const standardpage = new StandardPage({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1],
  				$$slots: {
  					default: [create_default_slot$a],
  					content: [create_content_slot$6],
  					title: [create_title_slot$6]
  				},
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(standardpage.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(standardpage, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const standardpage_changes = {};
  			if (dirty & /*pages*/ 1) standardpage_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) standardpage_changes.pageIndex = /*pageIndex*/ ctx[1];

  			if (dirty & /*$$scope*/ 32) {
  				standardpage_changes.$$scope = { dirty, ctx };
  			}

  			standardpage.$set(standardpage_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(standardpage.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(standardpage.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(standardpage, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$p.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$p($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	const { getComponent } = getContext("componentMap");
  	const content = getComponent("VariableSelector");
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<YVariable> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("YVariable", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({
  		getContext,
  		StandardPage,
  		pages,
  		pageIndex,
  		page,
  		getComponent,
  		content
  	});

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, pageIndex, page, content];
  }

  class YVariable extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$p, create_fragment$p, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "YVariable",
  			options,
  			id: create_fragment$p.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<YVariable> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<YVariable> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<YVariable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<YVariable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<YVariable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<YVariable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\components\Graph\ZVariable.svelte generated by Svelte v3.23.0 */
  const file$q = "C:\\cbevins\\dev\\node\\fire-portfolio\\src\\components\\Graph\\ZVariable.svelte";

  // (8:2) <span slot="title">
  function create_title_slot$7(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `${/*page*/ ctx[2].title}`;
  			attr_dev(span, "slot", "title");
  			add_location(span, file$q, 7, 2, 168);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_title_slot$7.name,
  		type: "slot",
  		source: "(8:2) <span slot=\\\"title\\\">",
  		ctx
  	});

  	return block;
  }

  // (9:2) <span slot="content">
  function create_content_slot$7(ctx) {
  	let span;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = `This is the '${/*page*/ ctx[2].title}' page`;
  			attr_dev(span, "slot", "content");
  			add_location(span, file$q, 8, 2, 209);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_content_slot$7.name,
  		type: "slot",
  		source: "(9:2) <span slot=\\\"content\\\">",
  		ctx
  	});

  	return block;
  }

  // (7:0) <StandardPage {pages} {pageIndex}>
  function create_default_slot$b(ctx) {
  	let t;

  	const block = {
  		c: function create() {
  			t = space();
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, t, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(t);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_default_slot$b.name,
  		type: "slot",
  		source: "(7:0) <StandardPage {pages} {pageIndex}>",
  		ctx
  	});

  	return block;
  }

  function create_fragment$q(ctx) {
  	let current;

  	const standardpage = new StandardPage({
  			props: {
  				pages: /*pages*/ ctx[0],
  				pageIndex: /*pageIndex*/ ctx[1],
  				$$slots: {
  					default: [create_default_slot$b],
  					content: [create_content_slot$7],
  					title: [create_title_slot$7]
  				},
  				$$scope: { ctx }
  			},
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(standardpage.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(standardpage, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			const standardpage_changes = {};
  			if (dirty & /*pages*/ 1) standardpage_changes.pages = /*pages*/ ctx[0];
  			if (dirty & /*pageIndex*/ 2) standardpage_changes.pageIndex = /*pageIndex*/ ctx[1];

  			if (dirty & /*$$scope*/ 8) {
  				standardpage_changes.$$scope = { dirty, ctx };
  			}

  			standardpage.$set(standardpage_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(standardpage.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(standardpage.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(standardpage, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$q.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$q($$self, $$props, $$invalidate) {
  	let { pages } = $$props, { pageIndex } = $$props;
  	let page = pages[pageIndex];
  	const writable_props = ["pages", "pageIndex"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ZVariable> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("ZVariable", $$slots, []);

  	$$self.$set = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  	};

  	$$self.$capture_state = () => ({ StandardPage, pages, pageIndex, page });

  	$$self.$inject_state = $$props => {
  		if ("pages" in $$props) $$invalidate(0, pages = $$props.pages);
  		if ("pageIndex" in $$props) $$invalidate(1, pageIndex = $$props.pageIndex);
  		if ("page" in $$props) $$invalidate(2, page = $$props.page);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [pages, pageIndex, page];
  }

  class ZVariable extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$q, create_fragment$q, safe_not_equal, { pages: 0, pageIndex: 1 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "ZVariable",
  			options,
  			id: create_fragment$q.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*pages*/ ctx[0] === undefined && !("pages" in props)) {
  			console.warn("<ZVariable> was created without expected prop 'pages'");
  		}

  		if (/*pageIndex*/ ctx[1] === undefined && !("pageIndex" in props)) {
  			console.warn("<ZVariable> was created without expected prop 'pageIndex'");
  		}
  	}

  	get pages() {
  		throw new Error("<ZVariable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pages(value) {
  		throw new Error("<ZVariable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get pageIndex() {
  		throw new Error("<ZVariable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set pageIndex(value) {
  		throw new Error("<ZVariable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* C:\cbevins\dev\node\fire-portfolio\src\App.svelte generated by Svelte v3.23.0 */

  function create_fragment$r(ctx) {
  	let current;
  	const singlepageapp = new SinglePageApp({ $$inline: true });

  	const block = {
  		c: function create() {
  			create_component(singlepageapp.$$.fragment);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			mount_component(singlepageapp, target, anchor);
  			current = true;
  		},
  		p: noop,
  		i: function intro(local) {
  			if (current) return;
  			transition_in(singlepageapp.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(singlepageapp.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(singlepageapp, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$r.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$r($$self, $$props, $$invalidate) {
  	let { dag } = $$props;

  	const compMap = new Map([
  			["GraphDecorations", Decorations],
  			["GraphInputs", Inputs],
  			["GraphIntro", Intro],
  			["GraphModelConfig", ModelConfig],
  			["GraphResults", Results],
  			["GraphXVariable", XVariable],
  			["GraphYVariable", YVariable],
  			["GraphZVariable", ZVariable],
  			["VariableSelector", VariableSelector]
  		]);

  	setContext("componentMap", {
  		getMap: () => compMap,
  		getComponent: key => compMap.get(key)
  	});

  	// The second Context is The Dag!
  	setContext("dag", dag);

  	const writable_props = ["dag"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
  	});

  	let { $$slots = {}, $$scope } = $$props;
  	validate_slots("App", $$slots, []);

  	$$self.$set = $$props => {
  		if ("dag" in $$props) $$invalidate(0, dag = $$props.dag);
  	};

  	$$self.$capture_state = () => ({
  		dag,
  		onMount,
  		setContext,
  		SinglePageApp,
  		VariableSelector,
  		GraphIntro: Intro,
  		GraphDecorations: Decorations,
  		GraphInputs: Inputs,
  		GraphModelConfig: ModelConfig,
  		GraphResults: Results,
  		GraphXVariable: XVariable,
  		GraphYVariable: YVariable,
  		GraphZVariable: ZVariable,
  		compMap
  	});

  	$$self.$inject_state = $$props => {
  		if ("dag" in $$props) $$invalidate(0, dag = $$props.dag);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [dag];
  }

  class App extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$r, create_fragment$r, safe_not_equal, { dag: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "App",
  			options,
  			id: create_fragment$r.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*dag*/ ctx[0] === undefined && !("dag" in props)) {
  			console.warn("<App> was created without expected prop 'dag'");
  		}
  	}

  	get dag() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set dag(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  const root = new index$1.Root(
    index$3.BpxGenome,
    index$3.BpxVariantMap,
    index$2.MethodMap,
    TranslationMap.translationMap
  );
  const dag = root.addDag('Products');

  const app = new App({
    target: document.body,
    props: {
      dag: dag
    }
  });

  return app;

}());
//# sourceMappingURL=bundle.js.map
