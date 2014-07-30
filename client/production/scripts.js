Dependency = {
  libs: {
    Can: can,
    jQuery: $,
    Underscore: _,
    Moment: moment,
    Numeral: numeral,

    ExcelBuilder: ExcelBuilder,
    FileSaver: saveAs
  },

  modules: {},

  define: function (id, definer) {
    var module = Dependency.modules[id];

    if (module) {
      throw new Error('Module already exists: ' + id);
    }

    module = {
      definer: definer,
      resolved: false,
      exports: null
    };

    Dependency.modules[id] = module;
  },

  require: function (id) {
    var module = Dependency.modules[id];

    if (!module) {
      throw new Error('Module not found: ' + id);
    }

    var exec;
    if (!module.resolved) {
      exec = module.definer(module, Dependency.require, Dependency.libs);

      module.resolved = true;
    }

    return module.exports; // || exec;
  },

  resolve: function () {
    var ids = Dependency.libs.Underscore.keys(Dependency.modules),
      id;

    for (var i in ids) {
      Dependency.require(ids[i]);
    }
  }
};



// global define

define = Dependency.define;

// define main

define.main = function (definer) {
  // resolve dependencies
  Dependency.resolve();

  // set global theme for jqwidgets
  jQuery.jqx.theme = 'metro';

  // exec main
  definer(Dependency.require);
};

// libs

define('lib.Can', function (module, require, libs) {
  module.exports = libs.Can;
});

define('lib.jQuery', function (module, require, libs) {
  module.exports = libs.jQuery;
});

define('lib.Underscore', function (module, require, libs) {
  module.exports = libs.Underscore;
});

define('lib.Moment', function (module, require, libs) {
  module.exports = libs.Moment;
});

define('lib.Numeral', function (module, require, libs) {
  module.exports = libs.Numeral;
});

define('lib.ExcelBuilder', function (module, require, libs) {
  module.exports = libs.ExcelBuilder;
});

define('lib.FileSaver', function (module, require, libs) {
  module.exports = {
    saveAs: libs.FileSaver
  };
});



define.construct = function (id, definer) {

  define(id, function (module, require) {

    var construct = {};

    definer(control, require);

    var baseConstruct = require(construct.base || 'core.construct.Construct');

    var staticMembers = control.static || {};
    var instanceMembers = control.instance || {};

    module.exports = baseConstruct.extend(staticMembers, instanceMembers);

  });

};



define.component = function (id, definer) {

  define(id, function (module, require) {

    var Util = require('core.util.Util');
    var Lang = require('core.lang.Lang');
    var jQuery = require('lib.jQuery');

    var component = {
      static: {},
      events: {}
    };

    component.authentication = __Authentication;

    definer(component, require, Util, Lang, jQuery);

    var baseComponent = require(component.base || 'core.component.Component');

    // singleton
    //    if (component.singleton) {
    //      component.static.newInstance = function () {
    //        if (!this.static._instance) {
    //          this.static._instance = this._super.apply(this, arguments);
    //        }
    //
    //        return this.static._instance;
    //      };
    //
    //      component.static.hasInstance = function () {
    //        return !!this.static._instance;
    //      };
    //
    //      component.static.getInstance = function () {
    //        return this.static._instance;
    //      };
    //
    //      component.static.destroyInstance = function () {
    //        return this.static._instance = null;
    //      };
    //    }

    var staticMembers = component.static;

    // component template
    if (component.tmpl) {
      staticMembers.tmpl = component.tmpl;
    }

    // auto inheritance for setup method
    //    if (component.setup) {
    //      staticMembers.setup = function () {
    //        this._super.apply(this, arguments);
    //
    //        component.setup.apply(this, arguments);
    //      };
    //    }

    var instanceMembers = Util.Object.omit(component, ['isDialog', 'tmpl', 'setup', 'static', 'events' /*, 'init'*/ ]);

    // auto inheritance for init method
    //    if (component.init) {
    //      instanceMembers.init = function () {
    //        this._super.apply(this, arguments);
    //
    //        component.init.apply(this, arguments);
    //      };
    //    }

    // auto inheritance for ready method
    //    if (component.ready) {
    //      instanceMembers.ready = function () {
    //        this._super.apply(this, arguments);
    //
    //        component.ready.apply(this, arguments);
    //      };
    //    }

    // auto inheritance for initData method
    //    if (component.initData) {
    //      instanceMembers.initData = function () {
    //        this._super.apply(this, arguments);
    //
    //        component.initData.apply(this, arguments);
    //      };
    //    }

    Util.Object.extend(instanceMembers, component.events);

    module.exports = baseComponent.extend(id, staticMembers, instanceMembers);

  });

};



define.form = function (id, definer) {

  define.component(id, function (component, require, Util, Lang, jQuery) {

    var Route = require('core.route.Route');
    var CpanelComponent = require('component.Cpanel');

    component.FormType = {
      FORM: 1,
      DIALOG: 2,
      Form: {
        LIST: 11
      },
      Dialog: {
        VIEW: 21,
        CREATE: 22,
        EDIT: 23,
        VALIDATION: 24
      }
    };

    definer(component, require, Util, Lang, jQuery);

    if (component.base) {
      //
    } else if (component.formType == component.FormType.FORM || component.formType == component.FormType.Form.LIST) {
      component.base = 'component.Form';

      component.isDialog = component.static.isDialog = false;
    } else {
      component.base = 'component.Dialog';

      component.isDialog = component.static.isDialog = true;
    }

    component.setFormParam = function (key, value) {
      if (!this.formParams) {
        this.formParams = {};
      }

      if (value === null) {
        this.formParams = Util.Object.omit(this.formParams, key);
      } else {
        this.formParams[key] = value;
      }
    };

    // require proxy
    //    if (component.proxyMap) {
    //      component.initProxy = function () {
    //        this.ServiceProxy = require(this.proxyMap.proxy);
    //      }
    //    }

    if (!component.urlMap) return;

    component.urlMap = [].concat(component.urlMap);

    for (var i = 0, len = component.urlMap.length; i < len; i++) {
      var formUrlMap = {
        url: component.urlMap[i].url,
        data: component.urlMap[i].data,
        formId: id
      };

      Route.define(formUrlMap.url);

      CpanelComponent.addFormUrlMap(formUrlMap);
    }

  });

};



define.proxy = function (id, definer) {

  define(id, function (module, require) {

    var Util = require('core.util.Util');
    var ProxyMethod = require('core.proxy.Proxy').ProxyMethod;

    var proxy = {};

    definer(proxy, require);

    var Proxy = module.exports = {};

    Util.Collection.each(proxy, function (value, key) {
      if (key === 'id') {
        Proxy.id = value;

        return;
      }

      if (key === 'entityId') {
        Proxy.entityId = value;

        return;
      }

      if (key === 'EntityMap') {
        Proxy.EntityMap = value;

        return;
      }

      if (!Util.Object.isString(value)) {
        Proxy[key] = value;

        return;
      }

      var httpMethod = value.slice(0, value.indexOf(' '));
      var url = value.slice(value.indexOf(' ') + 1);

      var proxyMethod = new ProxyMethod(url, httpMethod);

      Proxy[key] = function (data, callback) {
        proxyMethod.doRequest(data, callback);
      };

      Proxy[key].url = proxyMethod.url;
      Proxy[key].httpMethod = proxyMethod.httpMethod;
    });

  });

};



define('core.component.Component', function (module, require) {

  var Can = require('lib.Can');
  var jQuery = require('lib.jQuery');

  var View = require('core.view.View');
  var Map = require('core.observe.Map');
  var Route = require('core.route.Route');

  var component = module.exports = Can.Control.extend({

    tmpl: undefined,

    setup: function () {
      this._super.apply(this, arguments);

      this.static = this;
    },

    tmplUrl: function (tmpl) {
      return 'resource/template/' + this.static.tmpl;
    }

  }, {
    data: null,

    init: function (element, options) {
      this._super.apply(this, arguments);

      this.data = new Can.Map();

      this.static = this.constructor;

      if (this.initData) {
        this.initData(element, options);
      }

      if (this.initComponent) {
        this.initComponent(element, options);
      }

      if (this.beforeInitView) {
        this.beforeInitView(element, options);
      }

      if (this.static.tmpl) {
        this.view(function (view) {
          if (this.initView) {
            this.initView(view);
          }

          if (this.ready) {
            this.ready();
          }

          if (this.showForm) {
            this.showForm(options.formParams);
          }
        });
      }
    },

    ready: function () {},

    initData: function () {},

    view: function (callback) {
      if (!(this.data instanceof Map)) {
        this.data = new Map(this.data);
      }

      var view = View.make(this.static.tmplUrl(), this.data, this.proxy(callback));

      return view;
    },

  });

});



define('core.construct.Construct', function (module, require) {

  var Can = require('lib.Can');

  var Construct = module.exports = Can.Construct.extend({

  }, {

  });

});



define('core.lang.Engine', function (module, require) {

  module.exports = {
    parse: parse
  };

  var Util = require('core.util.Util');
  var Moment = require('lib.Moment');
  var Numeral = require('lib.Numeral');

  function parse(key, data, dfFormat, langData) {
    //    var text = getNestedData(key, langData);
    var text = langData[key];

    var block, parsedBlock, blockKeys, blockCase, blockConditions, blockValues
    var isMatch, arrayToken;
    var parsedText = '';

    while (true) {
      block = nextBlock(text);
      parsedText += block.textBefore;

      if (!block.found) break;

      text = block.textAfter;

      parsedBlock = parseBlock(block.text);

      blockKeys = parsedBlock.keys;

      if (!parsedBlock.complex) {
        parsedText += mergeTokens(blockKeys, data, dfFormat, langData);
        continue;
      }

      var defaultValues = null;

      for (var i in parsedBlock.cases) {
        blockCase = parsedBlock.cases[i];
        blockConditions = blockCase.conditions;
        blockValues = blockCase.values;

        isMatch = false;

        if (blockConditions.length == 1) {
          if (blockConditions[0] === 'default') {
            defaultValues = blockValues;
            continue;
          }

          if (isArray(blockConditions[0])) {
            arrayToken = parseArray(blockConditions[0]);

            if (arrayToken.range) {
              if (compare(blockKeys, arrayToken.elements[0], data, dfFormat, langData) >= 0 &&
                compare(blockKeys, arrayToken.elements[1], data, dfFormat, langData) <= 0) {

                isMatch = true;
              }
            } else {
              for (var i in arrayToken.elements) {
                if (compare(blockKeys, arrayToken.elements[i], data, dfFormat, langData) == 0) {
                  isMatch = true;
                  break;
                }
              }
            }
          }
        }

        if (!isMatch && blockKeys.length == 2) {
          switch (blockConditions[0].trim()) {
          case '=':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) == 0);
            break;
          case '!=':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) != 0);
            break;
          case '>=':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) >= 0);
            break;
          case '<=':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) <= 0);
            break;
          case '>':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) > 0);
            break;
          case '<':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) < 0);
            break;
          }
        }

        if (!isMatch) {
          isMatch = compare(blockKeys, blockConditions, data, dfFormat, langData) == 0;
        }

        if (isMatch) {
          parsedText += mergeTokens(blockValues, data, dfFormat, langData);

          break;
        }
      }

      if (!isMatch && defaultValues) {
        parsedText += mergeTokens(defaultValues, data, dfFormat, langData);
      }
    };

    return parsedText;
  }

  function compare(tokens1, tokens2, data, dfFormat, langData) {
    var token1, token2;

    if (Util.Object.isArray(tokens1) && tokens1.length == 1) {
      token1 = tokens1[0];
    } else {
      token1 = tokens1;
    }

    if (Util.Object.isArray(token1)) {
      token1 = mergeTokens(token1, data, dfFormat, langData);
    } else {
      if (isString(token1)) {
        token1 = getString(token1);
      } else if (isNumber(token1)) {
        token1 = getNumber(token1);
      } else {
        token1 = getData(token1, data, dfFormat, langData);
      }
    }

    if (Util.Object.isArray(tokens2) && tokens2.length == 1) {
      token2 = tokens2[0];
    } else {
      token2 = tokens2;
    }

    if (Util.Object.isArray(token2)) {
      token2 = mergeTokens(token2, data, dfFormat, langData);
    } else {
      if (isString(token2)) {
        token2 = getString(token2);
      } else if (isNumber(token2)) {
        token2 = getNumber(token2);
      } else {
        token2 = getData(token2, data, dfFormat, langData);
      }
    }

    return token1 == token2 ? 0 : (token1 > token2 ? 1 : -1);
  }

  function nextBlock(text) {
    var block = {
      found: null,
      text: null,
      textBefore: null,
      textAfter: null
    };

    var index = text.indexOf('{{');

    if (index == -1) {
      block.found = false;
      block.text = '';
      block.textBefore = text;
      block.textAfter = '';

      return block;
    }

    block.found = false;
    block.text = '';
    block.textBefore = text.substr(0, index);
    block.textAfter = '';

    text = text.substr(index + 2);

    var length = text.length;
    var stringOff = true;
    index = -1;

    while (++index < length) {
      if (text[index] === '}' && text[index + 1] === '}' && stringOff) {
        block.found = true;
        index += 2;
        break;
      }

      block.text += text[index];

      if (text[index] === "'") {
        if (text[index + 1] === "'") {
          index++;
          block.text += "'";
        } else {
          stringOff = !stringOff;
        }
      }
    }

    if (block.found) {
      block.textAfter = text.slice(index);
    } else {
      block.textBefore += block.text;
      block.text = '';
    }

    return block;
  }

  function nextToken(text) {
    var token = {
      found: null,
      text: null,
      textAfter: null
    };

    var text = text.trim();
    var length = text.length;
    var index = -1;
    var stringOff = true,
      arrayOff = true;

    while (++index < length) {
      if ([',', ':'].indexOf(text[index]) != -1 && stringOff && arrayOff) {
        if (index == 0) index++;
        break;
      }
      if (text[index] === '=' && stringOff && text[index + 1] === '>') {
        index += 2;
        break;
      }
      if (text[index] === ' ' && stringOff) {
        break;
      }

      if (text[index] === '[') {
        arrayOff = false;
      } else if (text[index] === ']') {
        arrayOff = true;
      }

      if (text[index] === "'") {
        if (text[index + 1] === "'" && !stringOff) {
          index++;
        } else {
          stringOff = !stringOff;

          if (arrayOff && !stringOff && index > 0) {
            break;
          } else if (arrayOff && stringOff) {
            index++;
            break;
          }
        }
      }
    }

    token.text = text.slice(0, index),
    token.textAfter = text.slice(index);
    token.textAfter = token.textAfter ? token.textAfter.trim() : '';

    return token;
  }

  function parseBlock(text) {
    var block = {
      keys: [],
      cases: [],
      complex: false
    };

    var token;
    var isCondition = true;
    var currentCase = {
      conditions: [],
      values: []
    };

    while (token = nextToken(text)) {
      if (token.text === '=>') {
        block.complex = true;
      } else if (token.text === ':') {
        isCondition = false;
      } else if (token.text === ',') {
        if (currentCase.conditions.length && currentCase.values.length) {
          block.cases.push(currentCase);
        }

        currentCase = {
          conditions: [],
          values: []
        };

        isCondition = true;
      } else if (!block.complex) {
        block.keys.push(token.text);
      } else if (isCondition) {
        currentCase.conditions.push(token.text);
      } else {
        currentCase.values.push(token.text);
      }

      if (token.textAfter === '') {
        break;
      } else {
        text = token.textAfter;
      }
    }

    if (block.complex) {
      if (currentCase.conditions.length && currentCase.values.length) {
        block.cases.push(currentCase);
      }
    }

    return block;
  }

  function mergeTokens(tokens, data, dfFormat, langData) {
    var line = '';
    var token;

    for (var i in tokens) {
      token = tokens[i];

      if (isString(token)) {
        line += getString(token);
      } else if (isNumber(token)) {
        line += token;
      } else {
        line += getData(token, data, dfFormat, langData);
      }
    }

    return line;
  }

  function parseArray(token) {
    token = token.slice(1, token.length - 1);

    var array = {
      range: false,
      elements: []
    };

    var index = -1,
      length = token.length,
      stringOff = true;
    var element = '';
    while (++index < length) {
      if (token[index] === ' ' && stringOff) continue;

      if (token[index] === ',' && stringOff) {
        if (element) array.elements.push(element)
        element = '';

        continue;
      }

      if (token[index] === '.' && stringOff && token[index + 1] === '.') {
        array.range = true;
        if (element) array.elements.push(element);

        element = '';
        index++;

        continue;
      }

      element += token[index];

      if (token[index] === "'") {
        if (token[index + 1] === "'") {
          index++;
        } else {
          stringOff = !stringOff;
        }
      }
    }

    if (element) array.elements.push(element);

    return array;
  }

  function isArray(token) {
    return token[0] === '[' && token[token.length - 1] === ']';
  }

  function isString(token) {
    return token[0] === "'" && token[token.length - 1] === "'";
  }

  function isNumber(token) {
    return !isNaN(token);
  }

  function getString(token) {
    return token.slice(1, token.length - 1).replace(/""/g, "'");
  }

  function getNumber(token) {
    return +token;
  }

  function getData(token, data, dfFormat, langData) {
    var format = null,
      force = null;

    if (token.substr(0, 1) === '.') {

      token = token.substr(1);

      var langText = langData[token];

      if (!langText) return '';

      return parse(token, data, dfFormat, langData);
    }

    var formatIndex = token.indexOf('!');
    if (formatIndex != -1) {
      format = token.slice(formatIndex + 1);
      token = token.substr(0, formatIndex);

      formatIndex = format.indexOf('!');
      if (formatIndex != -1) {
        force = format.substr(0, formatIndex);
        format = format.slice(formatIndex + 1);
      }
    }

    var value = getNestedData(token, data);

    return format || dfFormat ? formatData(value, format, dfFormat, force) : value;
  }

  function getNestedData(token, data) {
    var value = data;

    token = token.split('.');

    for (var i in token) {
      if (value && value[token[i]]) {
        value = value[token[i]];
      } else {
        return '';
      }
    }

    return value;
  }

  function formatData(token, format, dfFormat, force) {
    // format to date - using Moment
    if (force && force.toLowerCase() === 'date' || (Util.Object.isDate(token) && (format || dfFormat.date))) {
      if (!Util.Object.isDate(token)) token = new Date(+token);
      return Moment(token).format(format ? format : dfFormat.date);
    }

    // format to number - using Numeral
    if (force && force.toLowerCase() === 'number' || (isNumber(token) && (format || dfFormat.number))) {
      token = +token;
      return Numeral(+token).format(format ? format : dfFormat.number);
    }

    // format to string - using Util.String
    if (force && force.toLowerCase() === 'string' || format) {
      format = format.split('+');
      token = '' + token;

      for (var i = 0, len = format.length; i < len; i++) {
        token = Util.String[format[i]] ? Util.String[format[i]](token) : token;
      }

      return token;
    }

    return token;
  }

});



define('core.lang.Lang', function (module, require) {

  var LangEngine = require('core.lang.Engine');
  var DateTime = require('constant.DateTime');

  var Lang = {};

  var dfFormat = {
    date: DateTime.Format.DATE
  };

  Lang.get = function (id, data) {

    var LangContainer = window.__Langs;

    if (!LangContainer[id]) {
      throw new Error('Lang not found: ' + id);
    }

    return LangEngine.parse(id, data, dfFormat, LangContainer);
  };

  module.exports = Lang;

});



define('core.observe.List', function (module, require) {

  var Can = require('lib.Can');

  module.exports = Can.List;

});



define('core.observe.Map', function (module, require) {

  var Can = require('lib.Can');

  module.exports = Can.Map;

});



define('core.proxy.Proxy', function (module, require) {

  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var ServiceResponseUtil = require('core.proxy.ServiceResponseUtil');

  module.exports = {
    //    ProxyUtil: ProxyUtil,
    ProxyMethod: ProxyMethod,
    ServiceResponse: ServiceResponse
  };

  // service response
  function ServiceResponse(responseData) {
    Util.Object.extend(this, responseData.data);

    this._data = responseData.data;
    this._service = responseData._service;
  }

  ServiceResponse.prototype.hasError = function () {
    return !!this._service.error;
  };

  ServiceResponse.prototype.getError = function () {
    return this._service.error;
  };

  ServiceResponse.prototype.hasMessage = function () {
    return !!this._service.message;
  };

  ServiceResponse.prototype.getMessage = function () {
    return this._service.message;
  };

  ServiceResponse.prototype.getData = function () {
    return this._data;
  };

  // proxy method
  function ProxyMethod(url, httpMethod) {
    this.url = url;
    this.httpMethod = httpMethod;
  }

  ProxyMethod.prototype.doRequest = function (requestData, callback) {
    console.log('do request', requestData);

    var ajax = jQuery.ajax({
      type: this.httpMethod,
      url: this.url,
      data: requestData
    });

    if (callback) {
      ajax.done(function (responseData) {
        var serviceResponse = new ServiceResponse(responseData);

        ServiceResponseUtil.handleServiceResponse(serviceResponse);

        if (callback) {
          callback(serviceResponse);
        }
      });
    } else {
      return ajax;
    }

  };

  // global ajax error handler
  jQuery(document).ajaxError(function (error) {
    console.log(error);

    var MsgBox = require('component.common.MsgBox');
    var Lang = require('core.lang.Lang');

    MsgBox.alert({
      text: Lang.get('error.ajax'),
      icon: 'error'
    });
  });

  //  var ProxyUtil = {
  //    async: function () {
  //      var args = Util.Collection.toArray(arguments);
  //      var ajax = args.slice(0, -1);
  //      var callback = args.slice(-1);
  //
  //      jQuery.when
  //        .apply(null, ajax)
  //        .done(function () {
  //          var responses = Util.Collection.toArray(arguments);
  //
  //          for (var i = 0, len = responses.length; i < len; i++) {
  //            var serviceResponse = new ServiceResponse(responses[i]);
  //            ServiceResponseUtil.handleServiceResponse(serviceResponse);
  //
  //            responses[i] = serviceResponse;
  //          }
  //
  //          callback.apply(null, responses);
  //        });
  //    }
  //  };

});



define('core.proxy.ServiceResponseUtil', function (module, require) {

  var MsgBox = require('component.common.MsgBox');
  var Lang = require('core.lang.Lang');
  var Util = require('core.util.Util');

  var ServiceResponseUtil = module.exports = {};

  ServiceResponseUtil.handleServiceResponse = function (serviceResponse) {

    if (serviceResponse.hasMessage()) {
      var message = serviceResponse.getMessage();

      var messageId, messageData;

      if (Util.Object.isObject(message)) {
        messageId = message.messageId;
        messageData = {
          entityName: Lang.get(message.messageData.entityName),
          displayAttribute: serviceResponse[message.messageData.displayAttribute]
        };
      } else {
        messageId = message;
        messageData = {};
      }

      Util.Object.extend(messageData, serviceResponse.getData());

      var lang = Lang.get(messageId, messageData);

      MsgBox.alert({
        text: lang,
        icon: serviceResponse.hasError() ? 'error' : 'info'
      });
    }

    if (serviceResponse.hasError()) {
      console.log(serviceResponse.getError(), serviceResponse.getMessage(), serviceResponse.getData());
    }

  }

});



define('core.route.Route', function (module, require) {

  var Can = require('lib.Can');

  var Route = Can.route;

  var originalSetState = Route.setState;

  Route.setState = function () {
    originalSetState.apply(this, arguments);

    if (Route.onChange) Route.onChange();
  }

  Can.unbind.call(window, 'hashchange', originalSetState);

  Route.bindings.hashchange.bind = function () {
    Can.bind.call(window, 'hashchange', Route.setState);
  };

  Route.bindings.hashchange.unbind = function () {
    Can.unbind.call(window, 'hashchange', Route.setState);
  };

  Route.define = Route;

  module.exports = Route;

});



define('core.util.ConvertUtil', function (module, require) {

  var Moment = require('lib.Moment');
  var Gender = require('enum.Gender');
  var Role = require('enum.Role');
  var Relationship = require('enum.Relationship');
  var Attendance = require('enum.Attendance');
  var DateTimeConstant = require('constant.DateTime');
  var Lang = require('core.lang.Lang');

  var Util = require('core.util.Util');

  var ConvertUtil = {};

  ConvertUtil.Export = {
    getExportFileName: function (fileName) {
      return Moment().format('[' + fileName + '] - YYYY-MM-DD HH[h]mm[m]ss[s][.xlsx]');
    }
  };

  ConvertUtil.DateTime = {
    format: function (date, format) {
      return Moment.utc(date).format(format);
    },
    formatDate: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DATE);
    },
    formatDayOfWeek: function (date) {
      return Moment.utc(date).format(DateTimeConstant.Format.DAY_OF_WEEK);
    },
    formatCurrentDate: function (format) {
      return Moment.utc().format(DateTimeConstant.Format.DATE);
    },

    convertDateToDayOfWeek: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DATE).format(DateTimeConstant.Format.DAY_OF_WEEK);
    },

    convertDayOfWeekToDate: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DAY_OF_WEEK).format(DateTimeConstant.Format.DATE);
    },

    parseDate: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DATE).toDate();
    },
    parseDayOfWeek: function (date) {
      return Moment.utc(date, DateTimeConstant.Format.DAY_OF_WEEK).toDate();
    },

    isDate: function (date, format) {
      return Moment.utc(date, format).isValid();
    },

    compare: function (date1, date2) {
      date1 = ConvertUtil.DateTime.parseDate(date1);
      date2 = ConvertUtil.DateTime.parseDate(date2);

      if (date1 == date2) return 0;

      return date1 > date2 ? 1 : -1;
    },

    addDays: function (date, days) {
      date = ConvertUtil.DateTime.parseDate(date);

      date = Moment(date).add('days', days);

      return ConvertUtil.DateTime.formatDate(date);
    },

    toUTCDate: function (date) {
      date = date.getTime() + date.getTimezoneOffset() * 60000;

      return new Date(date);
    },
    toTimezoneDate: function (date) {
      date = date.getTime() + date.getTimezoneOffset() - 60000;

      return new Date(date);
    }
  };

  ConvertUtil.Gender = {
    toString: function (gender) {
      switch (gender) {
      case Gender.UNKNOWN:
        gender = Lang.get('gender.unknown');
        break;
      case Gender.MALE:
        gender = Lang.get('gender.male');
        break;
      case Gender.FEMALE:
        gender = Lang.get('gender.female');
        break;
      }

      return gender;
    },

    toGender: function (string) {
      var gender;

      switch (string) {
      case Lang.get('gender.male'):
        gender = Gender.MALE;
        break;
      case Lang.get('gender.female'):
        gender = Gender.FEMALE;
        break;
      default:
        gender = Gender.UNKNOWN;
        break;
      }

      return gender;
    },
  };

  ConvertUtil.Attendance = {
    toString: function (attendance) {
      switch (attendance) {
      case Attendance.UNATTENDED:
        attendance = Lang.get('attendance.unattended');
        break;
      case Attendance.PRESENT:
        attendance = Lang.get('attendance.present');
        break;
      case Attendance.ABSENT:
        attendance = Lang.get('attendance.absent');
        break;
      }

      return attendance;
    },

    toAttendance: function (string) {
      var attendance;

      switch (string) {
      case Lang.get('attendance.present'):
        attendance = Attendance.PRESENT;
        break;
      case Lang.get('attendance.absent'):
        attendance = Attendance.ABSENT;
        break;
      default:
        attendance = Attendance.UNATTENDED;
        break;
      }

      return attendance;
    },
  };

  ConvertUtil.Role = {
    toString: function (role) {
      switch (role) {
      case Role.ADMINISTRATOR:
        gender = Lang.get('role.administrator');
        break;
      case Role.EDUCATOR:
        gender = Lang.get('role.educator');
        break;
      case Role.EXAMINATOR:
        gender = Lang.get('role.examinator');
        break;
      case Role.NEWS_MANAGER:
        gender = Lang.get('role.newsManager');
        break;
      case Role.STUDENT:
        gender = Lang.get('role.student');
        break;
      case Role.PARENT:
        gender = Lang.get('role.parent');
        break;
      }

      return gender;
    },

    toRole: function (string) {
      var role;

      switch (string) {
      case Lang.get('role.administrator'):
        role = Role.ADMINISTRATOR;
        break;
      case Lang.get('role.educator'):
        role = Role.EDUCATOR;
        break;
      case Lang.get('role.examinator'):
        role = Role.EXAMINATOR;
        break;
      case Lang.get('role.newsManager'):
        role = Role.NEWS_MANAGER;
        break;
      case Lang.get('role.student'):
        role = Role.STUDENT;
        break;
      case Lang.get('role.parent'):
        role = Role.PARENT;
        break;
      default:
        role = null
        break;
      }

      return role;
    },
  };

  ConvertUtil.Relationship = {
    toString: function (relationship) {
      switch (relationship) {
      case Relationship.UNKNOWN:
        relationship = Lang.get('relationship.unknown');
        break;
      case Relationship.OTHER:
        relationship = Lang.get('relationship.other');
        break;
      case Relationship.FATHER:
        relationship = Lang.get('relationship.father');
        break;
      case Relationship.MOTHER:
        relationship = Lang.get('relationship.mother');
        break;
      case Relationship.GRAND_FATHER:
        relationship = Lang.get('relationship.grandFather');
        break;
      case Relationship.GRAND_MOTHER:
        relationship = Lang.get('relationship.grandMother');
        break;
      case Relationship.GODPARENT:
        relationship = Lang.get('relationship.godParent');
        break;
      }

      return relationship;
    },

    toRelationship: function (string) {
      var relationship;

      switch (string) {
      case Lang.get('relationship.unknown'):
        relationship = Relationship.UNKNOWN;
        break;
      case Lang.get('relationship.other'):
        relationship = Relationship.OTHER;
        break;
      case Lang.get('relationship.father'):
        relationship = Relationship.FATHER;
        break;
      case Lang.get('relationship.mother'):
        relationship = Relationship.MOTHER;
        break;
      case Lang.get('relationship.grandFather'):
        relationship = Relationship.GRAND_FATHER;
        break;
      case Lang.get('relationship.grandMother'):
        relationship = Relationship.GRAND_MOTHER;
        break;
      case Lang.get('relationship.godParent'):
        relationship = Relationship.GODPARENT;
        break;
      }

      return gender;
    },
  };

  module.exports = ConvertUtil;

});



define('core.util.Util', function (module, require) {

  var Underscore = require('lib.Underscore');

  var Util = module.exports = {};

  Util.Collection = {
    each: Underscore.each,
    toArray: Underscore.toArray,

    min: Underscore.min,
    max: Underscore.max,

    findWhere: Underscore.findWhere
  };

  Util.Array = {
    rest: Underscore.rest
  };

  Util.Object = {
    extend: Underscore.extend,
    clone: Underscore.clone,
    pick: Underscore.pick,
    omit: Underscore.omit,

    keys: Underscore.keys,

    isNumber: Underscore.isNumber,
    isString: Underscore.isString,
    isArray: Underscore.isArray,
    isDate: Underscore.isDate,
    isFunction: Underscore.isFunction,
    isObject: Underscore.isObject,
    isEmpty: Underscore.isEmpty,

    isInteger: function (object) {
      // check for type is Number
      // if (!Util.Object.isNumber(object)) return false;

      // check for integer
      var isInteger = object !== '' && !isNaN(+object) && ~~object == +object;

      return isInteger;
    }
  };

  Util.String = {
    lowerOne: function (str, index) {
      if (index) {
        return str;
      } else {
        return str[0].toLowerCase() + str.substr(1);
      }
    },
    upperOne: function (str, index) {
      if (index) {
        return str;
      } else {
        return str[0].toUpperCase() + str.substr(1);
      }
    },
    lowerAll: function (str) {
      return str.toLowerCase();
    },
    upperAll: function (str) {
      return str.toUpperCase();
    },

    plural: function (str) {
      if (str.slice(-1).toLowerCase() === 'f') {
        return str.slice(0, -1) + 'ves';
      }
      if (str.slice(-2).toLowerCase() === 'fe') {
        return str.slice(0, -2) + 'ves';
      }
      if (str.slice(-2).toLowerCase() === 'ff') {
        return str.slice(0, -2) + 'ves';
      }
      if (str.slice(-1).toLowerCase() === 'o') {
        return str + 'es';
      }
      if (str.slice(-1).toLowerCase() === 'y') {
        return str.slice(0, -1) + 'ies';
      }
      if (str.slice(-1).toLowerCase() === 'z') {
        return str.slice(0, -1) + 'zes';
      }
      if (str.slice(-1).toLowerCase() === 'z') {
        return str + 'zes';
      }
      if (str.slice(-2).toLowerCase() === 'ch') {
        return str + 'es';
      }
      if (str.slice(-2).toLowerCase() === 'sh') {
        return str + 'es';
      }
      if (str.slice(-1).toLowerCase() === 's') {
        return str + 'es';
      }
      if (str.slice(-1).toLowerCase() === 'x') {
        return str + 'es';
      }

      return str + 's';
    }
  };

  Util.File = {
    fileName: function (fileName) {
      var dotIndex = fileName.lastIndexOf('.');

      if (dotIndex == -1) return fileName;

      return fileName.slice(0, dotIndex);
    },
    fileExtension: function (fileName) {
      var dotIndex = fileName.lastIndexOf('.');

      if (dotIndex == -1) return null;

      return fileName.slice(dotIndex + 1);
    },
    sizeText: function (size) {
      var Numeral = require('lib.Numeral');

      if (size < 1024) {
        return Numeral(size).format('0') + 'B';
      }

      if (size < 1024 * 1024) {
        return Numeral(size / 1024).format('0.00') + 'KB';
      }

      if (size < 1024 * 1024 * 1024) {
        return Numeral(size / 1024).format('0.00') + 'MB';
      }

      return Numeral(size / 1024).format('0.00') + 'GB';
    },
    getBase64Data: function (fileData) {
      var key = 'base64,';
      var keyIndex = fileData.indexOf(key);

      if (key == -1) return fileData;
      return fileData.slice(keyIndex + key.length);
    }
  };

  Util.value = function (value) {
    return Util.Object.isFunction(value) ? value() : value;
  };

  Util.uniqueId = Underscore.uniqueId;

});



define('core.validator.Equal', function (module, require) {

  module.exports = function (attribute, value, ruleData, rules, data) {

    // skip checking for null or undefined
    if (value === null || value === undefined) return true;

    var attribute = ruleData.attribute;
    attribute = data[attribute];

    return value === attribute;

  };

});



define('core.validator.Integer', function (module, require) {

  var Util = require('core.util.Util');

  module.exports = function (attribute, value, rule, rules, data) {

    // skip checking for null or undefined
    if (value === null || value === undefined) return true;

    return Util.Object.isInteger(isValid);;

  };

});



define('core.validator.MaxLength', function (module, require) {

  module.exports = function (attribute, value, ruleData, rules, data) {

    // skip checking for null or undefined
    if (value === null || value === undefined) return true;

    value = '' + value;

    return value.length <= ruleData.maxLength;

  };

});



define('core.validator.PositiveInteger', function (module, require) {

  var Util = require('core.util.Util');

  module.exports = function (attribute, value, rule, rules, data) {

    // skip checking for null or undefined
    if (value === null || value === undefined) return true;

    return Util.Object.isInteger(value) && value > 0;

  };

});



define('core.validator.Required', function (module, require) {

  var Util = require('core.util.Util');

  module.exports = function (attribute, value, rule, rules, data) {

    var isValid = false;

    if (Util.Object.isNumber(value)) {
      isValid = true;
    } else if (Util.Object.isString(value)) {
      isValid = value.trim().length > 0;
    } else if (Util.Object.isArray(value)) {
      isValid = value.length > 0;
    } else {
      isValid = !!value;
    }

    return isValid;

  };

});



define('core.validator.Validator', function (module, require) {

  var Util = require('core.util.Util');
  var Lang = require('core.lang.Lang');

  module.exports = {
    validate: validate
  };

  function validate(data, rules) {
    for (var i = 0, len = rules.length; i < len; i++) {
      var rule = rules[i];

      var validate = validateAttribute(rule.attribute, rule.attributeName, data[rule.attribute], rule.rules, data);

      if (!validate.isValid) {
        return validate;
      }
    }

    return {
      isValid: true
    };
  }

  function validateAttribute(attribute, attributeName, value, rules, data) {
    var validate = {
      isValid: true,
      attribute: attribute,
      message: null
    };

    for (var i = 0, len = rules.length; i < len; i++) {
      var rule = rules[i];

      var validator;

      // custom validator
      if (Util.Object.isFunction(rule.rule)) {
        validator = rule.rule;
      }
      // required
      else if (rule.rule == 'required') {
        validator = 'core.validator.Required';
      }
      // maxLength
      else if (rule.rule == 'maxLength') {
        validator = 'core.validator.MaxLength';
      }
      // integer
      else if (rule.rule == 'integer') {
        validator = 'core.validator.Integer';
      }
      // positiveInteger - integer > 0
      else if (rule.rule == 'positiveInteger') {
        validator = 'core.validator.PositiveInteger';
      }
      // equal
      else if (rule.rule == 'equal') {
        validator = 'core.validator.Equal';
      }

      validator = require(validator);

      if (!validator(attribute, value, rule.ruleData, rules, data)) {
        validate.isValid = false;

        validate.message = rule.message || 'validate.' + rule.rule;

        validate.messageData = {
          attribute: attribute,
          attributeName: attributeName ? Lang.get(attributeName) : null,
          value: value,
          additionalData: rule.ruleData
        };

        Util.Object.extend(validate.messageData, rule.ruleData);

        break;
      }
    }

    return validate;
  }

});



define('core.view.helpers.authentication.IsAdministratorAuthenticationHelper', function (module, require) {

  var View = require('core.view.View');
  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');
  var Role = require('enum.Role');

  registerIsRoleHelper('Administrator');
  registerIsRoleHelper('Educator');
  registerIsRoleHelper('Examinator');
  registerIsRoleHelper('NewsManager');
  registerIsRoleHelper('Student');
  registerIsRoleHelper('Parent');
  registerIsRoleHelper('Staff');
  registerIsRoleHelper('StudentOrParent');
  registerIsRoleHelper('Teacher');

  function registerIsRoleHelper(role) {
    View.registerHelper('auth.is' + role, isRoleHelper);

    function isRoleHelper(options) {
      var authentication = __Authentication;

      if (Role['is' + role](authentication.accountRole)) {
        return options.fn(options.contexts || this);
      } else {
        return options.inverse(options.contexts || this);
      }
    }
  }

});



define('core.view.helpers.component.CheckboxHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var CheckboxComponent = require('component.common.Checkbox');

  View.registerHelper('component.checkbox', checkboxComponentHelper);

  function checkboxComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new CheckboxComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.component.ComboboxHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var ComboboxComponent = require('component.common.Combobox');
  var MultipleSelectionComboboxComponent = require('component.common.MultipleSelectionCombobox');
  var LocalDataComboboxComponent = require('component.common.LocalDataCombobox');
  var InlineSelectionComboboxComponent = require('component.common.InlineSelectionCombobox');

  View.registerHelper('component.combobox', comboboxComponentHelper);

  function comboboxComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['id', 'attribute', 'localData', 'multipleSelection', 'inlineSelection']);

    var localData = options.hash.localData;
    var multipleSelection = options.hash.multipleSelection;
    var inlineSelection = options.hash.inlineSelection;

    var Combobox;

    if (inlineSelection) {
      Combobox = InlineSelectionComboboxComponent;
    } else if (localData) {
      Combobox = multipleSelection ? null : LocalDataComboboxComponent;
    } else {
      Combobox = multipleSelection ? MultipleSelectionComboboxComponent : ComboboxComponent;
    }

    return function (element) {
      new Combobox(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.component.DateInputHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var DateInputComponent = require('component.common.DateInput');

  View.registerHelper('component.dateInput', dateInputComponentHelper);

  function dateInputComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new DateInputComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.DialogSizeHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');

  View.registerHelper('dialog.size', dialogSizeHelper);

  function dialogSizeHelper(options) {

    var width = options.hash.width;
    var height = options.hash.height;

    return function (element) {
      element = jQuery(element);

      element.addClass('dialog-size').data({
        width: width,
        height: height
      });
    };

  }

});



define('core.view.helpers.component.GenderDropDownListHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var GenderDropDownListComponent = require('component.common.GenderDropDownList');

  View.registerHelper('component.genderDropDownList', genderDropDownListComponentHelper);

  function genderDropDownListComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new GenderDropDownListComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.component.GridColumnsChooserHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var GridColumnsChooser = require('component.common.GridColumnsChooser');

  View.registerHelper('component.gridColumnsChooser', gridColumnsChooserHelper);

  function gridColumnsChooserHelper(options) {

    var componentData = this;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new GridColumnsChooser(element, {
        componentData: componentData,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.component.GridPagerHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  var GridPager = require('component.common.GridPager');

  View.registerHelper('component.gridPager', gridPagerHelper);

  function gridPagerHelper(options) {

    var componentData = this;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new GridPager(element, {
        componentData: componentData,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.component.InputHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var InputComponent = require('component.common.Input');

  View.registerHelper('component.input', inputComponentHelper);

  function inputComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new InputComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.component.RelationshipDropDownListHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var RelationshipDropDownListComponent = require('component.common.RelationshipDropDownList');

  View.registerHelper('component.relationshipDropDownList', relationshipDropDownListComponentHelper);

  function relationshipDropDownListComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new RelationshipDropDownListComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.component.RoleDropDownListHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var RoleDropDownListComponent = require('component.common.RoleDropDownList');

  View.registerHelper('component.roleDropDownList', roleDropDownListComponentHelper);

  function roleDropDownListComponentHelper(options) {

    var componentData = this;
    var dataAttribute = options.hash.attribute;
    var componentAttributes = Util.Object.omit(options.hash, ['attribute']);

    return function (element) {
      new RoleDropDownListComponent(element, {
        componentData: componentData,
        dataAttribute: dataAttribute,
        componentAttributes: componentAttributes
      });
    }

  }

});



define('core.view.helpers.LangHelper', function (module, require) {

  var View = require('core.view.View');
  var Lang = require('core.lang.Lang');

  View.registerHelper('lang', langHelper);

  function langHelper(id, options) {
    //    return unescape(text);

    var lang = Lang.get(id, options.hash);

    return View.safeString(lang);
  }

});



define('core.view.helpers.PartialHelper', function (module, require) {

  var View = require('core.view.View');
  var Route = require('core.route.Route');

  var jQuery = require('lib.jQuery');

  View.registerHelper('partial', partialHelper);

  function partialHelper(options) {
    if (!options.hash.id) return;

    var tmplId = options.hash.id;

    var tmplUrl = 'resource/template/' + tmplId + '.mustache';

    return View.safeString(View.render(tmplUrl, options.context));
  }

});



define('core.view.helpers.text.DateTextHelper', function (module, require) {

  var View = require('core.view.View');
  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');

  View.registerHelper('text.date', dateTextHelper);

  function dateTextHelper(date) {
    date = Util.value(date);

    return View.safeString(date);
  }

});



define('core.view.helpers.text.GenderTextHelper', function (module, require) {

  var View = require('core.view.View');
  var Util = require('core.util.Util');
  var ConvertUtil = require('core.util.ConvertUtil');

  View.registerHelper('text.gender', genderTextHelper);

  function genderTextHelper(gender) {
    gender = Util.value(gender);

    gender = ConvertUtil.Gender.toString(gender);

    return View.safeString(gender);
  }

});



define('core.view.helpers.UrlHelper', function (module, require) {

  var View = require('core.view.View');
  var Route = require('core.route.Route');
  var Util = require('core.util.Util');
  var jQuery = require('lib.jQuery');

  View.registerHelper('url', urlHelper);

  function urlHelper(options) {

    var urlData = options.hash;
    var element;

    Util.Collection.each(urlData, function (value, key) {
      if (Util.Object.isFunction(value)) {
        value.bind('change', updateUrl);
      }
    });

    function updateUrl() {
      if (!element) return;

      var routeData = {};

      Util.Collection.each(urlData, function (value, key) {
        if (Util.Object.isFunction(value)) {
          value = value();
        }

        routeData[key] = value;
      });

      var url = Route.url(routeData);

      element.attr('href', url);
    }

    return function (el) {
      element = jQuery(el);

      updateUrl();
    };
  }

});



define('core.view.View', function (module, require) {

  var Can = require('lib.Can');
  var Util = require('core.util.Util');

  var helpers = {};

  var View = {};

  View.make = function () {
    arguments[0] += '.mustache';

    return Can.view.apply(this, arguments);
  };

  View.registerHelper = function (name, helper) {
    Can.Mustache.registerHelper(name, helper);
  };

  View.safeString = Can.Mustache.safeString;

  View.render = function (idOrUrl, data) {

    return Can.view.render(idOrUrl, data);

    //var html = Can.mustache(content).render(data);
    //return View.safeString(html);
  };

  // tag maps
  Util.Object.extend(Can.view.elements.tagMap, {
    //    'div': 'div'
  });

  module.exports = View;

});



define.proxy('proxy.Account', function (proxy, require) {

  proxy.entityId = 'accountId';

  proxy.findAll = 'GET api/account/findAll';

  proxy.findOne = 'GET api/account/findOne';

  proxy.create = 'POST api/account/create';

  proxy.update = 'POST api/account/update';

  proxy.destroy = 'POST api/account/destroy';

  proxy.resetPassword = 'POST api/account/resetPassword';

  // batch entity map
  proxy.EntityMap = [
    {
      name: 'accountId',
      type: 'number'
    },
    {
      name: 'username',
      type: 'string'
    },
    {
      name: 'password',
      type: 'string'
    },
    {
      name: 'role',
      type: 'string'
    },
    {
      name: 'userInformationId',
      type: 'string'
    },
    {
      name: 'isActive',
      type: 'string'
    },
    {
      name: 'expiredDate',
      type: 'string'
    }
  ];

});



/*
 * System          : 3connected
 * Component       : Attendance history proxy
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.proxy('proxy.AttendanceHistory', function (proxy, require) {

  proxy.entityId = 'attendanceHistoryId';

  proxy.findAll = 'GET api/attendanceHistory/findAll';

  proxy.findOne = 'GET api/attendanceHistory/findOne';

  // attendance history entity map
  proxy.EntityMap = [
    {
      name: 'attendanceHistoryId',
      type: 'number'
    },
    {
      name: 'oldValue',
      type: 'number'
    },
    {
      name: 'newValue',
      type: 'number'
    },
    {
      name: 'time',
      type: 'string'
    }, {
      name: 'attendanceId',
      type: 'number'
    }, {
      name: 'staffCode',
      type: 'string',
      map: 'staff.staffCode'
    }, {
      name: 'scheduleId',
      type: 'number',
      map: 'attendance.schedule.scheduleId'
    }, {
      name: 'date',
      type: 'number',
      map: 'attendance.schedule.date'
    }, {
      name: 'slot',
      type: 'number',
      map: 'attendance.schedule.slot'
    }, {
      name: 'courseName',
      type: 'number',
      map: 'attendance.schedule.course.courseName'
    }, {
      name: 'termName',
      type: 'number',
      map: 'attendance.schedule.course.term.termName'
    }, {
      name: 'majorName',
      type: 'number',
      map: 'attendance.schedule.course.major.majorName'
    }, {
      name: 'studentCode',
      type: 'number',
      map: 'attendance.student.studentCode'
    }
  ];

});



define.proxy('proxy.Attendance', function (proxy, require) {

  proxy.getCourseAttendance = 'GET api/attendance/getCourseAttendance';

  proxy.getCourseAttendanceStudent = 'GET api/attendance/getCourseAttendanceStudent';

  proxy.updateCourseAttendance = 'POST api/attendance/updateCourseAttendance';

  proxy.statisticCourseAttendance = 'GET api/attendance/statisticCourseAttendance';

  proxy.EntityMap = [
    {
      name: 'studentId',
      type: 'number'
    }, {
      name: 'firstName',
      type: 'string'
    }, {
      name: 'lastName',
      type: 'string'
    }, {
      name: 'totalAbsent',
      type: 'number'
    }, {
      name: 'totalPresent',
      type: 'number'
    }, {
      name: 'totalSlots',
      type: 'number'
    }, {
      name: 'percentAbsent',
      type: 'number'
    }

  ];

});



define.proxy('proxy.Authentication', function (proxy, require) {

  proxy.login = 'POST api/authentication/login';

  proxy.logout = 'GET api/authentication/logout';

});



define.proxy('proxy.Batch', function (proxy, require) {

  proxy.entityId = 'batchId';

  proxy.findAll = 'GET api/batch/findAll';

  proxy.findOne = 'GET api/batch/findOne';

  proxy.create = 'POST api/batch/create';

  proxy.update = 'POST api/batch/update';

  proxy.destroy = 'POST api/batch/destroy';

  // batch entity map
  proxy.EntityMap = [
    {
      name: 'batchId',
      type: 'number'
    },
    {
      name: 'batchName',
      type: 'string'
    }
  ];

});



define.proxy('proxy.CategoryOfNews', function (proxy, require) {

  proxy.entityId = 'newsId';

  proxy.findAll = 'GET api/categoryOfNews/findAll';

  // news entity map
  proxy.EntityMap = [
    {
      name: 'newsId',
      type: 'number',
      map: 'news.newsId'
    },
    {
      name: 'title',
      type: 'string',
      map: 'news.title'
    },
    {
      name: 'author',
      type: 'string',
      map: 'news.author.staffId'
    },
    {
      name: 'createdTime',
      type: 'date',
      map: 'news.createdTime'
    }
  ];

});



define.proxy('proxy.Class', function (proxy, require) {

  proxy.entityId = 'classId';

  proxy.findAll = 'GET api/class/findAll';

  proxy.findOne = 'GET api/class/findOne';

  proxy.create = 'POST api/class/create';

  proxy.update = 'POST api/class/update';

  proxy.destroy = 'POST api/class/destroy';

  // for clas students
  proxy.addStudents = 'POST api/class/addStudents';

  proxy.removeStudents = 'POST api/class/removeStudents';

  // class entity map
  proxy.EntityMap = [
    {
      name: 'classId',
      type: 'number'
    },
    {
      name: 'className',
      type: 'string'
    },
    {
      name: 'batchId',
      type: 'int'
    },
    {
      name: 'batchName',
      type: 'string',
      map: 'batch.batchName'
    },
    {
      name: 'majorId',
      type: 'int'
    },
    {
      name: 'majorName',
      type: 'string',
      map: 'major.majorName'
    }
  ];

});



/*
 * System          : 3connected
 * Component       : Course student proxy
 * Creator         : UayLU
 * Created date    : 2014/19/06
 */
define.proxy('proxy.CourseStudent', function (proxy, require) {

  proxy.entityId = 'courseStudentId';

  proxy.findAll = 'GET api/courseStudent/findAll';

  proxy.findOne = 'GET api/courseStudent/findOne';

  proxy.create = 'POST api/courseStudent/create';

  proxy.update = 'POST api/courseStudent/update';

  proxy.destroy = 'POST api/courseStudent/destroy';

  proxy.addStudents = 'POST api/courseStudent/addStudents';

  proxy.removeStudents = 'POST api/courseStudent/removeStudents';


  // courseStudent entity map
  proxy.EntityMap = [
    {
      name: 'courseStudentId',
      type: 'number'
    },
    {
      name: 'studentId',
      type: 'string',
      map: 'student.studentId'
    },
    {
      name: 'studentCode',
      type: 'string',
      map: 'student.studentCode'
    },
    {
      name: 'firstName',
      type: 'string',
      map: 'student.firstName'
    },
    {
      name: 'lastName',
      type: 'string',
      map: 'student.lastName'
    },
    {
      name: 'className',
      type: 'string',
      map: 'student.class.className'
    },
    {
      name: 'batchName',
      type: 'string',
      map: 'student.class.batch.batchName'
    },
    {
      name: 'majorName',
      type: 'string',
      map: 'student.class.major.majorName'
    },
    {
      name: 'gender',
      type: 'string',
      map: 'student.gender'
    },
    {
      name: 'dateOfBirth',
      type: 'string',
      map: 'student.dateOfBirth'
    },
    {
      name: 'courseId',
      type: 'string'
    },
    {
      name: 'courseName',
      type: 'string',
      map: 'course.courseName'
    }
  ];

});



/*
 * System          : 3connected
 * Component       : Subject course proxy
 * Creator         : VyBD
 * Modifier        : TrongND, UayLU
 * Created date    : 2014/06/16
 * Modified date   : 2014/06/22
 */

define.proxy('proxy.Course', function (proxy, require) {

  proxy.entityId = 'courseId';

  proxy.findAll = 'GET api/course/findAll';

  proxy.findOne = 'GET api/course/findOne';

  proxy.create = 'POST api/course/create';

  proxy.update = 'POST api/course/update';

  proxy.destroy = 'POST api/course/destroy';

  // update schedule
  proxy.updateSchedule = 'POST api/course/updateSchedule';
  proxy.findAttendanceStudent = 'GET api/course/findAttendanceStudent';
  proxy.findCourseStudent = 'GET api/course/findCourseStudent';
  proxy.findOneCourseStudent = 'GET api/course/findOneCourseStudent';
  proxy.findCourseStudentMobile = 'GET api/course/findCourseStudentMobile';

  // course entity map
  proxy.EntityMap = [
    {
      name: 'courseId',
      type: 'number'
    }, {
      name: 'courseName',
      type: 'string'
    }, {
      name: 'numberOfCredits',
      type: 'string'
    }, {
      name: 'className',
      type: 'string',
      map: 'class.className'
    }, {
      name: 'staffCode',
      type: 'string',
      map: 'staff.staffCode'
    }, {
      name: 'termName',
      type: 'string',
      map: 'term.termName'
    }, {
      name: 'majorName',
      type: 'string',
      map: 'major.majorName'
    }, {
      name: 'subjectName',
      type: 'string',
      map: 'subjectVersion.subject.subjectName'
    }, {
      name: 'description',
      type: 'string',
      map: 'subjectVersion.description'
    }
  ];

  proxy.StudentCourseEntityMap = [
    {
      name: 'courseId',
      type: 'number',
      map: 'course.courseId'
    }, {
      name: 'courseName',
      type: 'string',
      map: 'course.courseName'
    }, {
      name: 'numberOfCredits',
      type: 'string',
      map: 'course.numberOfCredits'
    }, {
      name: 'className',
      type: 'string',
      map: 'course.class.className'
    }, {
      name: 'termName',
      type: 'string',
      map: 'course.term.termName'
    }, {
      name: 'majorName',
      type: 'string',
      map: 'course.major.majorName'
    }, {
      name: 'subjectName',
      type: 'string',
      map: 'course.subjectVersion.subject.subjectName'
    }, {
      name: 'description',
      type: 'string',
      map: 'course.subjectVersion.description'
    }
  ];

});



//ThanhVMSE90059
//UayLUSE90014
define.proxy('proxy.Department', function (proxy, require) {

  proxy.entityId = 'departmentId';

  proxy.findAll = 'GET api/department/findAll';

  proxy.findOne = 'GET api/department/findOne';

  proxy.create = 'POST api/department/create';

  proxy.update = 'POST api/department/update';

  proxy.destroy = 'POST api/department/destroy';

  // department entity map
  proxy.EntityMap = [
    {
      name: 'departmentId',
      type: 'number'
    },
    {
      name: 'departmentName',
      type: 'string'
    }
  ];

});



/*
 * System          : 3connected
 * Component       : Grade category proxy
 * Creator         : UayLU
 * Created date    : 2014/18/06
 */
define.proxy('proxy.GradeCategory', function (proxy, require) {

  proxy.entityId = 'gradeCategoryId';

  proxy.findAll = 'GET api/gradeCategory/findAll';

  proxy.findOne = 'GET api/gradeCategory/findOne';

  proxy.create = 'POST api/gradeCategory/create';

  proxy.update = 'POST api/gradeCategory/update';

  proxy.destroy = 'POST api/gradeCategory/destroy';

  proxy.getSubjectVersionGradeCaterogy = 'GET   api/gradeCategory/getSubjectVersionGradeCaterogy';

  // gradeCategory entity map
  proxy.EntityMap = [
    {
      name: 'gradeCategoryId',
      type: 'number'
    },
    {
      name: 'gradeCategoryCode',
      type: 'string'
    },
    {
      name: 'gradeCategoryName',
      type: 'string'
    },
    {
      name: 'minimumGrade',
      type: 'number'
    },
    {
      name: 'weight',
      type: 'number'
    },
    {
      name: 'description',
      type: 'string',
      map: 'subjectVersion.description'
    },
    {
      name: 'subjectName',
      type: 'string',
      map: 'subjectVersion.subject.subjectName'
    }
  ];

});



/*
 * System          : 3connected
 * Component       : Grade history proxy
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.proxy('proxy.GradeHistory', function (proxy, require) {

  proxy.entityId = 'GradeHistoryId';

  proxy.findAll = 'GET api/gradeHistory/findAll';

  proxy.findOne = 'GET api/gradeHistory/findOne';

  // attendance history entity map
  proxy.EntityMap = [
    {
      name: 'gradeHistoryId',
      type: 'number'
    },
    {
      name: 'oldValue',
      type: 'number'
    },
    {
      name: 'newValue',
      type: 'number'
    },
    {
      name: 'time',
      type: 'string'
    }, {
      name: 'gradeCategoryName',
      type: 'string',
      map: 'grade.gradeCategory.gradeCategoryName'
    }, {
      name: 'staffCode',
      type: 'string',
      map: 'staff.staffCode'
    }, {
      name: 'courseId',
      type: 'number',
      map: 'grade.course.courseId'
    }, {
      name: 'courseName',
      type: 'number',
      map: 'grade.course.courseName'
    }, {
      name: 'termName',
      type: 'number',
      map: 'grade.course.term.termName'
    }, {
      name: 'majorName',
      type: 'number',
      map: 'grade.course.major.majorName'
    }, {
      name: 'studentCode',
      type: 'number',
      map: 'grade.student.studentCode'
    }
  ];

});



/*
 * System          : 3connected
 * Component       : Subject course proxy
 * Creator         : UayLU
 * Created date    : 2014/06/23
 */
define.proxy('proxy.Grade', function (proxy, require) {

  proxy.getCourseGrade = 'GET api/grade/getCourseGrade';

  proxy.updateCourseGrade = 'POST api/grade/updateCourseGrade';

  proxy.getSumaryGrade = 'GET api/grade/getSumaryGrade';

  proxy.statisticGradeStudent = 'GET api/grade/statisticGradeStudent';

  // grade entity map
  proxy.EntityMap = [
    {
      name: 'courseId',
      type: 'number',
      map: 'courseId'
    }, {
      name: 'courseName',
      type: 'string',
      map: 'courseName'
    }, {
      name: 'numberOfCredits',
      type: 'string',
      map: 'numberOfCredits'
    }, {
      name: 'subjectName',
      type: 'string',
      map: 'subjectName'
    }, {
      name: 'finalSubjectGrade',
      type: 'string',
      map: 'finalSubjectGrade'
    }, {
      name: 'resultSubject',
      type: 'string',
      map: 'resultSubject'
    }, {
      name: 'statistic',
      type: 'string',
      map: 'statistic'
    }, {
      name: 'termName',
      type: 'string',
      map: 'termName'
    }
  ];




});



define.proxy('proxy.Major', function (proxy, require) {

  proxy.entityId = 'majorId';

  proxy.findAll = 'GET api/major/findAll';

  proxy.findOne = 'GET api/major/findOne';

  proxy.create = 'POST api/major/create';

  proxy.update = 'POST api/major/update';

  proxy.destroy = 'POST api/major/destroy';

  // major entity map
  proxy.EntityMap = [
    {
      name: 'majorId',
      type: 'number'
    },
    {
      name: 'majorName',
      type: 'string'
    }
  ];

});



define.proxy('proxy.NewsCategory', function (proxy, require) {

  proxy.entityId = 'newsCategoryId';

  proxy.findAll = 'GET api/newsCategory/findAll';

  proxy.findOne = 'GET api/newsCategory/findOne';

  proxy.create = 'POST api/newsCategory/create';

  proxy.update = 'POST api/newsCategory/update';

  proxy.destroy = 'POST api/newsCategory/destroy';

  // newsCategory entity map
  proxy.EntityMap = [
    {
      name: 'newsCategoryId',
      type: 'number'
    },
    {
      name: 'newsCategoryName',
      type: 'string'
    },
    {
      name: 'parentCategoryId',
      type: 'string'
    },
    {
      name: 'parentCategoryName',
      type: 'string',
      map: 'parentCategory.newsCategoryName'
    }
  ];

});



define.proxy('proxy.News', function (proxy, require) {

  proxy.entityId = 'newsId';

  proxy.findAll = 'GET api/news/findAll';

  proxy.findOne = 'GET api/news/findOne';

  proxy.create = 'POST api/news/create';

  proxy.update = 'POST api/news/update';

  proxy.destroy = 'POST api/news/destroy';

  proxy.downloadAttachment = 'GET api/attachment/download';

  // news entity map
  proxy.EntityMap = [
    {
      name: 'newsId',
      type: 'number'
    },
    {
      name: 'title',
      type: 'string'
    },
    {
      name: 'author',
      type: 'string',
      map: 'author.staffCode'
    },
    {
      name: 'createdTime',
      type: 'date'
    }
  ];

});



/*
 * System          : 3connected
 * Component       : Notification proxy
 * Creator         : TrongND
 * Created date    : 2014/07/19
 */

define.proxy('proxy.Notification', function (proxy, require) {

  proxy.entityId = 'notificationId';

  proxy.findAll = 'GET api/notification/findAll';
  proxy.destroy = 'POST api/notification/destroy';

  proxy.notifyNews = 'POST api/notification/notifyNews';
  proxy.notifyGrade = 'POST api/notification/notifyGrade';
  proxy.notifyAttendance = 'POST api/notification/notifyAttendance';

  // class entity map
  proxy.EntityMap = [
    {
      name: 'notificationId',
      type: 'number'
    },
    {
      name: 'notificationType',
      type: 'number'
    },
    {
      name: 'senderName',
      type: 'string',
      map: 'sender.staffCode'
    },
    {
      name: 'newsTitle',
      type: 'string',
      map: 'news.title'
    },
    {
      name: 'courseName',
      type: 'string',
      map: 'course.courseName'
    },
    {
      name: 'notificationType',
      type: 'number'
    },
    {
      name: 'dataId',
      type: 'number'
    },
    {
      name: 'notificationTime',
      type: 'string'
    }
  ];


});



/*
 * System          : 3connected
 * Component       : Parent proxy
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.proxy('proxy.Parent', function (proxy, require) {

  proxy.entityId = 'parentId';

  proxy.findAll = 'GET api/parent/findAll';

  proxy.findOne = 'GET api/parent/findOne';

  proxy.create = 'POST api/parent/create';

  proxy.update = 'POST api/parent/update';

  proxy.destroy = 'POST api/parent/destroy';

  // parent entity map
  proxy.EntityMap = [
    {
      name: 'parentId',
      type: 'number'
    },
    {
      name: 'studentId',
      type: 'number'
    },
    {
      name: 'firstName',
      type: 'string'
    },
    {
      name: 'lastName',
      type: 'string'
    },
    {
      name: 'relationship',
      type: 'number'
    },
    {
      name: 'gender',
      type: 'number'
    },
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'email',
      type: 'string'
    },
    {
      name: 'phoneNumber',
      type: 'number'
    },
    {
      name: 'dateOfBirth',
      type: 'string'
    }


  ];

});



define.proxy('proxy.Profile', function (proxy, require) {

  proxy.getSimpleProfile = 'GET api/profile/getSimpleProfile';

  proxy.changePassword = 'POST api/profile/changePassword';

});



define.proxy('proxy.Staff', function (proxy, require) {

  proxy.entityId = 'staffId';

  proxy.findAll = 'GET api/staff/findAll';

  proxy.findOne = 'GET api/staff/findOne';

  proxy.create = 'POST api/staff/create';

  proxy.update = 'POST api/staff/update';

  proxy.destroy = 'POST api/staff/destroy';

  // staff entity map
  proxy.EntityMap = [
    {
      name: 'staffId',
      type: 'number'
    },
    {
      name: 'staffCode',
      type: 'string'
    },
    {
      name: 'firstName',
      type: 'string'
    },
    {
      name: 'lastName',
      type: 'string'
    },
    {
      name: 'gender',
      type: 'number'
    },
    {
      name: 'dateOfBirth',
      type: 'string'
    },
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'email',
      type: 'string'
    },
    {
      name: 'departmentId',
      type: 'string'
    },
    {
      name: 'departmentName',
      type: 'string',
      map: 'department.departmentName'
    }

  ];

});



/*
 * System          : 3connected
 * Component       : Student course proxy
 * Creator         : ThanhVM
 * Modifier        : TrongND
 */

define.proxy('proxy.student.CourseOfStudent', function (proxy, require) {

  proxy.entityId = 'courseId';

  proxy.getCourseGrade = 'GET api/student/course/getCourseGrade';

  // course entity map
  proxy.CourseGradeEntityMap = [
    {
      name: 'gradeCategoryName',
      type: 'string'
    }, {
      name: 'gradeCategoryCode',
      type: 'string'
    }, {
      name: 'weight',
      type: 'number'
    }, {
      name: 'value',
      type: 'number'
    }
  ];

});



define.proxy('proxy.Student', function (proxy, require) {

  proxy.entityId = 'studentId';

  proxy.findAll = 'GET api/student/findAll';

  proxy.findOne = 'GET api/student/findOne';

  proxy.create = 'POST api/student/create';

  proxy.update = 'POST api/student/update';

  proxy.destroy = 'POST api/student/destroy';

  // student entity map
  proxy.EntityMap = [
    {
      name: 'studentId',
      type: 'number'
    },
    {
      name: 'studentCode',
      type: 'string'
    },
    {
      name: 'firstName',
      type: 'string'
    },
    {
      name: 'lastName',
      type: 'string'
    },
    {
      name: 'gender',
      type: 'number'
    },
    {
      name: 'dateOfBirth',
      type: 'string'
    },
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'email',
      type: 'string'
    },
    {
      name: 'classId',
      type: 'string'
    },
    {
      name: 'className',
      type: 'string',
      map: 'class.className'
    },
    {
      name: 'batchName',
      type: 'string',
      map: 'class.batch.batchName'
    }, {
      name: 'majorName',
      type: 'string',
      map: 'class.major.majorName'
    }

  ];

});



/*
 * System          : 3connected
 * Component       : Subject version proxy
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.proxy('proxy.SubjectVersion', function (proxy, require) {

  proxy.entityId = 'subjectVersionId';

  proxy.findAll = 'GET api/subjectVersion/findAll';

  proxy.findOne = 'GET api/subjectVersion/findOne';

  proxy.create = 'POST api/subjectVersion/create';

  proxy.update = 'POST api/subjectVersion/update';

  proxy.destroy = 'POST api/subjectVersion/destroy';

  // subjectVersion entity map
  proxy.EntityMap = [
    {
      name: 'subjectVersionId',
      type: 'number'
    },
    {
      name: 'subjectName',
      type: 'string',
      map: 'subject.subjectName'
    },
    {
      name: 'description',
      type: 'string'
    }
  ];

});



/*
 * System          : 3connected
 * Component       : Subject proxy
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.proxy('proxy.Subject', function (proxy, require) {

  proxy.entityId = 'subjectId';

  proxy.findAll = 'GET api/subject/findAll';

  proxy.findOne = 'GET api/subject/findOne';

  proxy.create = 'POST api/subject/create';

  proxy.update = 'POST api/subject/update';

  proxy.destroy = 'POST api/subject/destroy';

  // subject entity map
  proxy.EntityMap = [
    {
      name: 'subjectId',
      type: 'number'
    },
    {
      name: 'subjectCode',
      type: 'string'
    },
    {
      name: 'subjectName',
      type: 'string'
    },
    {
      name: 'numberOfCredits',
      type: 'number'
    }
  ];

});



define.proxy('proxy.Term', function (proxy, require) {

  proxy.entityId = 'termId';

  proxy.findAll = 'GET api/term/findAll';

  proxy.findOne = 'GET api/term/findOne';

  proxy.create = 'POST api/term/create';

  proxy.update = 'POST api/term/update';

  proxy.destroy = 'POST api/term/destroy';

  // term entity map
  proxy.EntityMap = [
    {
      name: 'termId',
      type: 'number'
    },
    {
      name: 'termName',
      type: 'string'
    }
  ];

});



define.component('component.common.Checkbox', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var isPasswordInput = componentAttributes.passwordInput;

    componentAttributes = Util.Object.omit(componentAttributes, ['passwordInput']);

    var checkbox = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'checkbox')
      .appendTo(element.parent());

    element.remove();

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var trackingChange = {
      checkbox: false,
      data: false
    };

    var checkboxOptions = {
      width: '13px',
      height: '13px',
      hasThreeStates: false,
      checked: componentData.attr(dataAttribute) || false
    };

    checkboxOptions = Util.Object.extend(checkboxOptions, componentAttributes);

    checkbox.jqxCheckBox(checkboxOptions);

    // tracking changes of input
    checkbox.on('change', function (event) {
      if (trackingChange.data || !event || !event.args) return;

      var checked = event.args.checked;

      trackingChange.checkbox = true;
      componentData.attr(dataAttribute, checked);
      trackingChange.checkbox = false;
    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {
      if (attr == dataAttribute && !trackingChange.checkbox) {

        trackingChange.checkbox = true;
        checkbox.jqxCheckBox({
          checked: newVal
        });
        trackingChange.checkbox = false;
      }
    });

  };

});



define.component('component.common.Combobox', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var settingsAttribute = 'componentSettings.' + dataAttribute;
    var filtersAttribute = 'componentSettings.' + dataAttribute + '.filterConditions';
    var filterByAttribute = 'componentSettings.' + dataAttribute + '.filterByAttributes';

    var filterByAttributes = componentData.attr(filterByAttribute);
    this.filterByAttributes = filterByAttributes = filterByAttributes ? filterByAttributes.attr() : [];

    var settings = componentData.attr(settingsAttribute);

    this.componentData = componentData;
    this.dataAttribute = dataAttribute;

    var combobox = this.combobox = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'combobox')
      .data('ComboBoxComponent', this)
      .appendTo(element.parent());

    element.remove();

    var comboboxOptions = {
      autoComplete: true,
      enableBrowserBoundsDetection: true,

      width: '100%',
      height: '30px'
    };

    comboboxOptions = Util.Object.extend(comboboxOptions, componentAttributes);

    var ServiceProxy = settings.ServiceProxy;

    // combobox source
    var source = this.source = {
      dataType: 'json',

      // service url
      url: ServiceProxy.findAll.url,

      // root element
      root: 'data.items',

      dataFields: ServiceProxy.EntityMap,

      // source mapping char
      mapChar: '.',
      mapchar: '.',

      // filters data
      data: {}
    };

    var trackingChange = {
      combobox: false,
      data: false
    };

    // build filters data
    buildFilters(source, componentData, filtersAttribute);

    if (Util.Object.isEmpty(filterByAttributes)) {
      comboboxOptions.source = createDataAdapter(source);
    } else {
      comboboxOptions.disabled = true;
    }
    comboboxOptions.valueMember = settings.combobox.valueMember;
    comboboxOptions.displayMember = settings.combobox.displayMember;
    comboboxOptions.searchMode = 'containsignorecase';

    combobox.jqxComboBox(comboboxOptions);

    // tracking changes of combobox
    combobox.on('select', function (event) {
      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      trackingChange.combobox = true;
      componentData.attr(dataAttribute, item.value);
      trackingChange.combobox = false;
    });

    // tracking changes of reloading source
    combobox.on('bindingComplete', function (event) {
      trackingChange.data = true;

      var value = componentData.attr(dataAttribute);

      var item = combobox.jqxComboBox('getItemByValue', value);
      combobox.jqxComboBox('selectItem', item);

      var items = combobox.jqxComboBox('getItems');
      var autoDropDownHeight = !items || items.length <= 10;

      combobox.jqxComboBox({
        autoDropDownHeight: autoDropDownHeight
      });

      trackingChange.data = false;
    });

    // tracking changes of data
    componentData.bind('change', function (event, attr, how, newVal, oldVal) {

      if (attr == dataAttribute && !trackingChange.combobox) {
        trackingChange.data = true;

        // unselect current selected item
        var selectedItem = combobox.jqxComboBox('getSelectedItem');
        if (selectedItem) {
          combobox.jqxComboBox('unselectItem', selectedItem);
        }

        if (newVal) {
          var item = combobox.jqxComboBox('getItemByValue', newVal);

          combobox.jqxComboBox('selectItem', item);
        }

        trackingChange.data = false;
      }

    });

    // tracking changes of filters
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {

      // filter conditions
      if (attr == filtersAttribute) {
        buildFilters(source, componentData, filtersAttribute);

        refreshSource(combobox, source);
      }

      // filter attributes
      if (filterByAttributes.indexOf(attr) != -1) {
        var filterConditions = {};
        filterConditions[attr] = newVal;

        if (!newVal) {
          combobox.jqxComboBox({
            disabled: true
          });
        } else {
          combobox.jqxComboBox({
            disabled: false
          });
          this.attr(filtersAttribute, filterConditions);
        }
      }

    });

  };

  component.refreshData = function () {
    if (!Util.Object.isEmpty(this.filterByAttributes)) {
      this.source.data = null;
    }

    this.componentData.attr(this.dataAttribute, null);

    refreshSource(this.combobox, this.source);
  };

  function refreshSource(combobox, source) {
    var dataAdapter = createDataAdapter(source);

    combobox.jqxComboBox({
      source: dataAdapter
    });


  }

  function createDataAdapter(source) {
    return new jQuery.jqx.dataAdapter(source);
  }

  function buildFilters(source, data, filtersAttribute) {
    source.data = source.data || {};

    var filtersData = data.attr(filtersAttribute);

    if (filtersData) {
      var filters = filtersData.attr();

      source.data.filters = [];

      Util.Collection.each(filters, function (value, key) {
        source.data.filters.push({
          field: key,
          value: value
        });
      });
    } else {
      source.data = Util.Object.omit(source.data, 'filters');
    }

  }

});



define.component('component.common.InlineSelectionCombobox', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    this.componentData = options.componentData;
    this.dataAttribute = options.dataAttribute;
    this.componentAttributes = options.componentAttributes;

    this.settingsAttribute = 'componentSettings.' + this.dataAttribute;
    this.localDataAttribute = 'componentSettings.' + this.dataAttribute + '.localDataAttribute';

    this.localDataAttribute = this.componentData.attr(this.localDataAttribute);
    this.settings = this.componentData.attr(this.settingsAttribute);

    this.combobox = jQuery('<div />')
      .attr('data-attribute', this.dataAttribute)
      .attr('data-component-role', 'combobox')
      .data('ComboBoxComponent', this)
      .appendTo(element.parent());

    element.remove();

    var comboboxOptions = {
      autoComplete: true,
      enableBrowserBoundsDetection: true,

      valueMember: this.settings.combobox.valueMember,
      displayMember: this.settings.combobox.displayMember,
      searchMode: 'containsignorecase',

      width: '100%',
      height: '30px'
    };

    comboboxOptions = Util.Object.extend(comboboxOptions, this.componentAttributes);

    this.combobox.jqxComboBox(comboboxOptions);

    var trackingChange = {
      combobox: false,
      data: false
    };

    this.refreshData();

    // tracking changes of combobox
    this.combobox.on('select', this.proxy(function (event) {

      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      trackingChange.combobox = true;
      this.componentData.attr(this.dataAttribute, item.value);
      trackingChange.combobox = false;

    }));

    // tracking changes of reloading source
    this.combobox.on('bindingComplete', this.proxy(function (event) {

      var items = this.combobox.jqxComboBox('getItems');
      var autoDropDownHeight = !items || items.length <= 10;

      this.combobox.jqxComboBox({
        autoDropDownHeight: autoDropDownHeight
      });

    }));

    // tracking changes of data
    this.componentData.bind('change', this.proxy(function (event, attr, how, newVal, oldVal) {

      if (attr == this.dataAttribute && !trackingChange.combobox) {
        trackingChange.data = true;

        // unselect current selected item
        var selectedItem = this.combobox.jqxComboBox('getSelectedItem');
        if (selectedItem) {
          this.combobox.jqxComboBox('unselectItem', selectedItem);
        }

        if (newVal) {
          var item = this.combobox.jqxComboBox('getItemByValue', newVal);

          this.combobox.jqxComboBox('selectItem', item);
        }

        trackingChange.data = false;
      }

    }));

    // tracking changes of loca data
    this.componentData.bind('change', this.proxy(function (ev, attr, how, newVal, oldVal) {

      if (attr == this.localDataAttribute) {
        this.refreshData();
      }

    }));

  };

  component.refreshData = function () {

    var data = this.componentData.attr(this.localDataAttribute);

    if (Util.Object.isEmpty(data)) {
      this.combobox.jqxComboBox({
        source: null,
        disabled: true
      });
    } else {
      data = data.attr();

      var source = this.getComboboxSource(data);

      this.combobox.jqxComboBox({
        source: source,
        disabled: false
      });
    }

  };

  component.getComboboxSource = function (data) {

    // combobox source
    var source = {
      dataType: 'json',

      // local data
      localData: data || [],

      dataFields: [{
        name: this.settings.attr('combobox.valueMember'),
        type: 'number'
      }, {
        name: this.settings.attr('combobox.displayMember'),
        type: 'string'
      }]
    };

    var dataAdaper = new jQuery.jqx.dataAdapter(source);

    return dataAdaper;

  }

});



define.component('component.common.LocalDataCombobox', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    this.componentData = options.componentData;
    this.dataAttribute = options.dataAttribute;
    this.componentAttributes = options.componentAttributes;

    this.settingsAttribute = 'componentSettings.' + this.dataAttribute;
    this.localDataAttribute = 'componentSettings.' + this.dataAttribute + '.localDataAttribute';

    this.localDataAttribute = this.componentData.attr(this.localDataAttribute);
    this.settings = this.componentData.attr(this.settingsAttribute);

    this.combobox = jQuery('<div />')
      .attr('data-attribute', this.dataAttribute)
      .attr('data-component-role', 'combobox')
      .data('ComboBoxComponent', this)
      .appendTo(element.parent());

    element.remove();

    //if (!this.componentData.attr('componentElements')) this.componentData.attr('componentElements', {});
    //this.componentData.attr('componentElements.' + this.dataAttribute, this.combobox);

    var comboboxOptions = {
      autoComplete: true,
      enableBrowserBoundsDetection: true,

      valueMember: this.settings.combobox.valueMember,
      displayMember: this.settings.combobox.displayMember,
      searchMode: 'containsignorecase',

      width: '100%',
      height: '30px'
    };

    comboboxOptions = Util.Object.extend(comboboxOptions, this.componentAttributes);

    this.combobox.jqxComboBox(comboboxOptions);

    var trackingChange = {
      combobox: false,
      data: false
    };

    this.refreshData();

    // tracking changes of combobox
    this.combobox.on('select', this.proxy(function (event) {
      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      trackingChange.combobox = true;
      this.componentData.attr(this.dataAttribute, item.value);
      trackingChange.combobox = false;

    }));

    // tracking changes of reloading source
    this.combobox.on('bindingComplete', this.proxy(function (event) {

      var items = this.combobox.jqxComboBox('getItems');
      var autoDropDownHeight = !items || items.length <= 10;

      this.combobox.jqxComboBox({
        autoDropDownHeight: autoDropDownHeight
      });

    }));

    // tracking changes of data
    this.componentData.bind('change', this.proxy(function (event, attr, how, newVal, oldVal) {

      if (attr == this.dataAttribute && !trackingChange.combobox) {
        trackingChange.data = true;

        // unselect current selected item
        var selectedItem = this.combobox.jqxComboBox('getSelectedItem');
        if (selectedItem) {
          this.combobox.jqxComboBox('unselectItem', selectedItem);
        }

        if (newVal) {
          var item = this.combobox.jqxComboBox('getItemByValue', newVal);

          this.combobox.jqxComboBox('selectItem', item);
        }

        trackingChange.data = false;
      }

    }));

    // tracking changes of loca data
    this.componentData.bind('change', this.proxy(function (ev, attr, how, newVal, oldVal) {

      if (attr == this.localDataAttribute) {
        this.refreshData();
      }

    }));

  };

  component.refreshData = function () {

    var data = this.componentData.attr(this.localDataAttribute);

    if (Util.Object.isEmpty(data)) {
      this.combobox.jqxComboBox({
        source: null,
        disabled: true
      });
    } else {
      data = data.attr();

      var source = this.getComboboxSource(data);

      this.combobox.jqxComboBox({
        source: source,
        disabled: false
      });

      var item = this.combobox.jqxComboBox('getItemByValue', this.componentData.attr(this.dataAttribute));
      this.combobox.jqxComboBox('selectItem', item);

    }

  };

  component.getComboboxSource = function (data) {

    // combobox source
    var source = {
      dataType: 'json',

      // local data
      localData: data || [],

      dataFields: [{
        name: this.settings.attr('combobox.valueMember'),
        type: 'number'
      }, {
        name: this.settings.attr('combobox.displayMember'),
        type: 'string'
      }]
    };

    var dataAdaper = new jQuery.jqx.dataAdapter(source);

    return dataAdaper;

  }

});



define.component('component.common.MultipleSelectionCombobox', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var settingsAttribute = 'componentSettings.' + dataAttribute;
    var filtersAttribute = 'componentSettings.' + dataAttribute + '.filterConditions';
    var filterByAttribute = 'componentSettings.' + dataAttribute + '.filterByAttributes';

    var filterByAttributes = componentData.attr(filterByAttribute);
    this.filterByAttributes = filterByAttributes = filterByAttributes ? filterByAttributes.attr() : [];

    var settings = componentData.attr(settingsAttribute);

    var combobox = this.combobox = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'combobox')
      .data('ComboBoxComponent', this)
      .appendTo(element.parent());

    element.remove();

    var comboboxOptions = {
      autoComplete: true,
      checkboxes: true,
      enableBrowserBoundsDetection: true,

      width: '100%',
      height: '30px'
    };

    comboboxOptions = Util.Object.extend(comboboxOptions, componentAttributes);

    var ServiceProxy = settings.ServiceProxy;

    // combobox source
    var source = this.source = {
      dataType: 'json',

      // service url
      url: ServiceProxy.findAll.url,

      // root element
      root: 'data.items',

      dataFields: ServiceProxy.EntityMap,

      // source mapping char
      mapChar: '.',
      mapchar: '.',

      // filters data
      data: {}
    };

    var trackingChange = {
      combobox: false,
      data: false
    };

    // build filters data
    buildFilters(source, componentData, filtersAttribute);

    if (Util.Object.isEmpty(filterByAttributes)) {
      comboboxOptions.source = createDataAdapter(source);
    } else {
      comboboxOptions.disabled = true;
    }
    comboboxOptions.valueMember = settings.combobox.valueMember;
    comboboxOptions.displayMember = settings.combobox.displayMember;
    comboboxOptions.searchMode = 'containsignorecase';

    combobox.jqxComboBox(comboboxOptions);

    // tracking changes of combobox
    combobox.on('checkChange', function (event) {
      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      var checkedItems = combobox.jqxComboBox('getCheckedItems');

      var checkedValues = [];

      for (var i = 0, len = checkedItems.length; i < len; i++) {
        checkedValues.push(checkedItems[i].value);
      }

      trackingChange.combobox = true;
      componentData.attr(dataAttribute, checkedValues);
      trackingChange.combobox = false;
    });

    // tracking changes of reloading source
    combobox.on('bindingComplete', function (event) {
      trackingChange.data = true;

      var value = componentData.attr(dataAttribute);

      // uncheck all checked item
      if (value && value.length) {
        for (var i = 0, len = value.length; i < len; i++) {
          var item = combobox.jqxComboBox('getItemByValue', value[i]);
          combobox.jqxComboBox('checkItem', item);
        }
      }

      var items = combobox.jqxComboBox('getItems');
      var autoDropDownHeight = !items || items.length <= 10;

      combobox.jqxComboBox({
        autoDropDownHeight: autoDropDownHeight
      });

      trackingChange.data = false;
    });

    // tracking changes of data
    componentData.bind('change', function (event, attr, how, newVal, oldVal) {

      if (attr == dataAttribute && !trackingChange.combobox) {
        trackingChange.data = true;

        // uncheck all checked item
        combobox.jqxComboBox('uncheckAll');

        if (newVal && newVal.length) {
          for (var i = 0, len = newVal.length; i < len; i++) {
            var item = combobox.jqxComboBox('getItemByValue', newVal[i]);

            combobox.jqxComboBox('checkItem', item);
          }
        }

        trackingChange.data = false;
      }

    });

    // tracking changes of filters
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {

      // filter conditions
      if (attr == filtersAttribute) {
        buildFilters(source, componentData, filtersAttribute);

        refreshSource(combobox, source);
      }

      // filter attributes
      if (filterByAttributes.indexOf(attr) != -1) {
        var filterConditions = {};
        filterConditions[attr] = newVal;

        if (!newVal) {
          combobox.jqxComboBox({
            disabled: true
          });
        } else {
          combobox.jqxComboBox({
            disabled: false
          });
          this.attr(filtersAttribute, filterConditions);
        }
      }

    });

  };

  component.refreshData = function () {
    if (!Util.Object.isEmpty(this.filterByAttributes)) {
      this.source.data = null;
    }

    refreshSource(this.combobox, this.source);
  };

  function refreshSource(combobox, source) {
    var dataAdapter = createDataAdapter(source);

    combobox.jqxComboBox({
      source: dataAdapter
    });
  }

  function createDataAdapter(source) {
    return new jQuery.jqx.dataAdapter(source);
  }

  function buildFilters(source, data, filtersAttribute) {
    source.data = source.data || {};

    var filtersData = data.attr(filtersAttribute);

    if (filtersData) {
      var filters = filtersData.attr();

      source.data.filters = [];

      Util.Collection.each(filters, function (value, key) {
        source.data.filters.push({
          field: key,
          value: value
        });
      });
    } else {
      source.data = Util.Object.omit(source.data, 'filters');
    }

  }

});



define.component('component.common.DateInput', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var ConvertUtil = require('core.util.ConvertUtil');
    var DateTimeConstant = require('constant.DateTime');

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var dateInput = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'dateInput')
      .appendTo(element.parent());

    //    var isToolbarComponent = element.closest('.toolbar').size() > 0;

    element.remove();

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var dateInputOptions = {
      value: null,
      formatString: DateTimeConstant.WidgetFormat.DATE,
      enableBrowserBoundsDetection: true,

      width: '100%',
      height: '30px'
    };

    var trackingChange = {
      dateInput: false,
      data: false
    }

    dateInputOptions = Util.Object.extend(dateInputOptions, componentAttributes);

    dateInput.jqxDateTimeInput(dateInputOptions);

    // tracking changes of dateInput
    dateInput.on('change', function () {
      if (trackingChange.data) return;

      trackingChange.dateInput = true;

      var dateString = dateInput.jqxDateTimeInput('getText');

      console.log(dateString);

      componentData.attr(dataAttribute, dateString);

      trackingChange.dateInput = false;
    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {
      if (trackingChange.dateInput || trackingChange.data) return;

      trackingChange.data = true;

      if (attr == dataAttribute) {
        var dateUTC;

        if (newVal) {
          var date = ConvertUtil.DateTime.parseDate(newVal);

          dateUTC = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        } else {
          dateUTC = null;
        }

        dateInput.jqxDateTimeInput('setDate', dateUTC);
      }

      trackingChange.data = false;
    });

  };

});



define.component('component.common.GenderDropDownList', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var Gender = require('enum.Gender');

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var genderDropDownList = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'genderDropDownList')
      .appendTo(element.parent());

    element.remove();

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var genderData = [
      {
        value: Gender.MALE,
        text: Lang.get('gender.male')
      }, {
        value: Gender.FEMALE,
        text: Lang.get('gender.female')
      }, {
        value: Gender.UNKNOWN,
        text: Lang.get('gender.unknown')
      }
    ];

    var source = {
      localData: genderData,

      dataFields: [
        {
          name: 'value',
          typy: 'number'
        },
        {
          name: 'text',
          typy: 'string'
        }
      ]
    }

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    var genderDropDownListOptions = {
      source: dataAdapter,
      displayMember: 'text',
      valueMember: 'value',

      width: '100%',
      height: '30px',
      autoDropDownHeight: true
    };

    var trackingChange = {
      genderDropDownList: false,
      data: false
    }

    genderDropDownListOptions = Util.Object.extend(genderDropDownListOptions, componentAttributes);

    genderDropDownList.jqxDropDownList(genderDropDownListOptions);

    // tracking changes of genderDropDownList
    genderDropDownList.on('select', function (event) {

      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      trackingChange.genderDropDownList = true;

      componentData.attr(dataAttribute, item.value);

      trackingChange.genderDropDownList = false;

    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {

      if (attr == dataAttribute && !trackingChange.genderDropDownList) {

        trackingChange.data = true;

        // unselect current selected item
        var selectedItem = genderDropDownList.jqxDropDownList('getSelectedItem');
        if (selectedItem) {
          genderDropDownList.jqxDropDownList('unselectItem', selectedItem);
        }

        var item = genderDropDownList.jqxDropDownList('getItemByValue', newVal);
        genderDropDownList.jqxDropDownList('selectItem', item);

        trackingChange.data = false;
      }

    });

  };

});



define.component('component.common.RelationshipDropDownList', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var Relationship = require('enum.Relationship');

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var relationshipDropDownList = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'relationshipDropDownList')
      .appendTo(element.parent());

    element.remove();

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var relationshipData = [
      {
        value: Relationship.UNKNOWN,
        text: Lang.get('relationship.unknown'),
      }, {
        value: Relationship.OTHER,
        text: Lang.get('relationship.other'),
      }, {
        value: Relationship.FATHER,
        text: Lang.get('relationship.father'),
      }, {
        value: Relationship.MOTHER,
        text: Lang.get('relationship.mother'),
      }, {
        value: Relationship.GRAND_FATHER,
        text: Lang.get('relationship.grandFather'),
      }, {
        value: Relationship.GRAND_MOTHER,
        text: Lang.get('relationship.grandMother'),
      }, {
        value: Relationship.GODPARENT,
        text: Lang.get('relationship.godParent')
      }
    ];

    var source = {
      localData: relationshipData,

      dataFields: [
        {
          name: 'value',
          typy: 'number'
        },
        {
          name: 'text',
          typy: 'string'
        }
      ]
    }

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    var relationshipDropDownListOptions = {
      source: dataAdapter,
      displayMember: 'text',
      valueMember: 'value',

      width: '100%',
      height: '30px',
      autoDropDownHeight: true
    };

    var trackingChange = {
      relationshipDropDownList: false,
      data: false
    }

    relationshipDropDownListOptions = Util.Object.extend(relationshipDropDownListOptions, componentAttributes);

    relationshipDropDownList.jqxDropDownList(relationshipDropDownListOptions);

    // tracking changes of relationshipDropDownList
    relationshipDropDownList.on('select', function (event) {

      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      trackingChange.relationshipDropDownList = true;

      componentData.attr(dataAttribute, item.value);

      trackingChange.relationshipDropDownList = false;

    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {

      if (attr == dataAttribute && !trackingChange.relationshipDropDownList) {

        trackingChange.data = true;

        // unselect current selected item
        var selectedItem = relationshipDropDownList.jqxDropDownList('getSelectedItem');
        if (selectedItem) {
          relationshipDropDownList.jqxDropDownList('unselectItem', selectedItem);
        }

        var item = relationshipDropDownList.jqxDropDownList('getItemByValue', newVal);
        relationshipDropDownList.jqxDropDownList('selectItem', item);

        trackingChange.data = false;
      }

    });

  };

});



define.component('component.common.RoleDropDownList', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var Role = require('enum.Role');

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var roleDropDownList = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'roleDropDownList')
      .appendTo(element.parent());

    var staffOnly = componentAttributes.staffOnly;

    componentAttributes = Util.Object.omit(componentAttributes, ['staffOnly']);

    element.remove();

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var roleData = [];

    var adminRoleData = [
      {
        value: Role.ADMINISTRATOR,
        text: Lang.get('role.administrator')
      }
    ];

    var studentRoleData = [
      {
        value: Role.STUDENT,
        text: Lang.get('role.student')
      }, {
        value: Role.PARENT,
        text: Lang.get('role.parent')
      }
    ];

    var staffRoleData = [
      {
        value: Role.EDUCATOR,
        text: Lang.get('role.educator')
      }, {
        value: Role.EXAMINATOR,
        text: Lang.get('role.examinator')
      }, {
        value: Role.NEWS_MANAGER,
        text: Lang.get('role.newsManager')
      }, {
        value: Role.TEACHER,
        text: Lang.get('role.teacher')
      }
    ];

    if (staffOnly) {
      roleData = roleData.concat(staffRoleData);
    } else {
      roleData = roleData
        .concat(adminRoleData)
        .concat(studentRoleData)
        .concat(staffRoleData);
    }

    var source = {
      localData: roleData,

      dataFields: [
        {
          name: 'value',
          typy: 'number'
        },
        {
          name: 'text',
          typy: 'string'
        }
      ]
    }

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    var roleDropDownListOptions = {
      source: dataAdapter,
      displayMember: 'text',
      valueMember: 'value',

      width: '100%',
      height: '30px',
      autoDropDownHeight: true
    };

    var trackingChange = {
      roleDropDownList: false,
      data: false
    }

    roleDropDownListOptions = Util.Object.extend(roleDropDownListOptions, componentAttributes);

    roleDropDownList.jqxDropDownList(roleDropDownListOptions);

    // tracking changes of roleDropDownList
    roleDropDownList.on('select', function (event) {

      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      trackingChange.roleDropDownList = true;

      componentData.attr(dataAttribute, item.value);

      trackingChange.roleDropDownList = false;

    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {

      if (attr == dataAttribute && !trackingChange.roleDropDownList) {

        trackingChange.data = true;

        // unselect current selected item
        var selectedItem = roleDropDownList.jqxDropDownList('getSelectedItem');
        if (selectedItem) {
          roleDropDownList.jqxDropDownList('unselectItem', selectedItem);
        }

        var item = roleDropDownList.jqxDropDownList('getItemByValue', newVal);
        roleDropDownList.jqxDropDownList('selectItem', item);

        trackingChange.data = false;
      }

    });

  };

});



define.component('component.Dialog', function (component, require, Util, Lang) {

  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var Validator = require('core.validator.Validator');
  var MsgBox = require('component.common.MsgBox');

  //  component.singleton = true;

  component.defaultSize = {
    height: '90%',
    width: '90%',
    maxHeight: '90%',
    maxWidth: '90%',
  };

  component.showForm = function (params) {
    this.element.find('.content .error').remove();

    this.resizeComponents();

    if (this.refreshData) {
      this.refreshData(params)
    }
  };

  component.refreshData = function (params) {
    // refresh comboboxes source
    this.element.find('[data-component-role=combobox]').each(function () {
      var combobox = jQuery(this).data('ComboBoxComponent');

      if (combobox) {
        combobox.refreshData();
      }
    });

    if (
      this.formType == this.FormType.DIALOG ||
      this.formType == this.FormType.Dialog.CREATE ||
      this.formType == this.FormType.Dialog.VALIDATION
    ) {
      this.initData(params);

      // reset bound attributes
      var boundAttributes = this.data.attr('boundAttributes');
      if (boundAttributes) {
        for (var i = 0, len = boundAttributes.length; i < len; i++) {
          this.data.attr(boundAttributes[i], null);
        }
      }

      if (this.clearData) {
        this.clearData();
      }

      this.element.jqxWindow('open');

      return;
    }

    if ((this.formType == this.FormType.Dialog.EDIT || this.formType == this.FormType.Dialog.VIEW) && this.ServiceProxy) {
      var id = params.id || this.data.attr('params.id');

      var findOptions = {};
      findOptions[this.ServiceProxy.entityId] = id;

      this.ServiceProxy.findOne(findOptions, this.proxy(findOneDone));

      return;
    };

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var entity = serviceResponse.getData();

      entity.originalData = Util.Object.clone(entity);

      this.data.attr(entity);

      if (this.reloadData) {
        this.reloadData();
      }

      this.element.jqxWindow('open');
    }

  };

  component.hideForm = function () {
    if (this.element.jqxWindow('isOpen')) {
      this.element.jqxWindow('close');
    }
  };

  component.initView = function (view) {
    var tmplElement = jQuery('<div />').append(view);

    var dialogElement = jQuery('<div />').addClass('dialog');

    var bodyElement = jQuery('<div />').addClass('body');
    var topElement = jQuery('<div />').addClass('top');
    var panelElement = jQuery('<div />').addClass('panel');

    var headerElement = tmplElement.find('.header');
    var contentElement = tmplElement.find('.content');
    var footerElement = tmplElement.find('.footer');

    panelElement.append(contentElement);
    topElement.append(panelElement);
    bodyElement.append(topElement).append(footerElement);

    dialogElement.append(headerElement, bodyElement);

    this.element.append(dialogElement);

    this.element = dialogElement;

    var sizeElement = tmplElement.find('.dialog-size');

    if (sizeElement.size()) {
      this.size = Util.Object.extend(this.size || {}, sizeElement.data());
    }

    if (this.formType == this.FormType.Dialog.CREATE) {
      footerElement.find('.ok').addClass('create');
    } else if (this.formType == this.FormType.Dialog.EDIT) {
      footerElement.find('.ok').addClass('edit');
    }

    //    this.initProxy();

    // setup dialog
    this.initDialogComponents();
  };

  component.initDialogComponents = function () {

    this.size = Util.Object.extend(this.defaultSize, this.size);

    this.element.jqxWindow({
      maxWidth: this.size.maxWidth,
      maxHeight: this.size.maxHeight,

      isModal: true,
      modalOpacity: 0.8,

      draggable: false,
      resizable: false,

      autoOpen: false,

      //      okButton: this.element.find('#buttonOk'),
      //      cancelButton: this.element.find('#buttonCancel'),

      initContent: this.proxy(initContent)
    });

    this.element.on('close', function () {
      window.history.back();
    });

    function initContent() {
      this.element.find('.panel').jqxPanel({
        sizeMode: 'fixed',
        autoUpdate: true,
        scrollBarSize: 5
      });

      if (this.initDialog) {
        this.initDialog();
      }

      this.on();
    }
  };

  component.resizeDialog = function () {

    this.element.jqxWindow({
      width: this.size.width,
      height: this.size.height,
      position: 'center'
    });

    this.element.find('.panel').jqxPanel({
      width: '0px',
      height: '0px',
    }).jqxPanel({
      width: '100%',
      height: '100%',
    });

    this.resizeComponents();
  };

  component.resizeComponents = function () {
    //    console.log(this.element.find('.content [data-component-role=combobox]').size());
    //
    //    this.element.find('.content [data-component-role=combobox]')
    //      .jqxComboBox({
    //        width: '0px'
    //      })
    //      .jqxComboBox({
    //        width: '100%'
    //      });
  };

  component.validateData = function () {
    var data = this.data;
    var rules = this.validateRules;

    if (this.formType == this.FormType.Dialog.CREATE) {
      rules = rules.create;
    } else if (this.formType == this.FormType.Dialog.EDIT) {
      rules = rules.update;
    } else {
      // skip validate for other types of form
      if (this.formType != this.FormType.Dialog.VALIDATION) {
        return {
          isValid: true
        };
      }
    }

    var validate = Validator.validate(data, rules);

    return validate;
  };

  component.submitForm = function () {
    var validate = this.validateData();

    // remove all available error messages
    this.element.find('.content .error').remove();

    this.resizeComponents();

    if (validate.isValid) {
      // submit data to server
      if (this.beforeSubmitData) {
        this.beforeSubmitData(function (commit) {
          if (commit) this.submitData();
        });
      } else {
        this.submitData();
      }
    } else {
      // show validate error

      var message = Lang.get(validate.message, validate.messageData);

      var parentElement = this.element.find('.content [data-attribute="' + validate.attribute + '"]').parent();

      if (parentElement.size()) {
        // visible attribute

        var errorElement = jQuery('<span />').addClass('error');

        errorElement.text(message);

        parentElement.find('.error').remove();

        parentElement.append(errorElement);

        this.element.find('.panel').jqxPanel('scrollTo', 0, parentElement.position().top - 30);

        this.resizeComponents();

        errorElement.on('click', this.proxy(function () {
          errorElement.fadeOut(100, this.proxy(function () {
            errorElement.remove();

            this.resizeComponents();
          }));
        }));
      } else {
        // hidden attribute

        MsgBox.alert({
          text: message,
          icon: 'warning'
        });
      }
    }
  };

  component.submitData = function () {
    var formData = this.data;
    var entity = formData.attr();

    var skipSubmitAttributes = ['originalData', 'boundAttributes', 'componentSettings', 'componentElements'];

    Util.Collection.each(entity, function (value, key) {
      if (value == null) {
        skipSubmitAttributes.push(key);
      }
    });

    entity = Util.Object.omit(entity, skipSubmitAttributes);

    var omitAttributes = [];
    Util.Collection.each(entity, function (value, key) {
      if (formData.attr('componentSettings.' + key + '.skipDataSubmission')) {
        omitAttributes.push(key);
      }
    });

    entity = Util.Object.omit(entity, omitAttributes);

    if (this.formType == this.FormType.Dialog.CREATE) {
      this.ServiceProxy.create(entity, this.proxy(createDone));
    } else if (this.formType == this.FormType.Dialog.EDIT) {
      this.ServiceProxy.update(entity, this.proxy(updateDone));
    } else {
      if (this.submitDialogData) {
        this.submitDialogData(entity);
      }
    }

    function createDone(serviceResponse) {
      if (!serviceResponse.hasError()) {
        this.refreshData();
      }
    }

    function updateDone(serviceResponse) {
      if (!serviceResponse.hasError()) {
        this.hideForm();
      }
    }
  };

  component.events['{window} resize'] = function (element, event) {
    this.resizeDialog();
  };

  component.events['[data-component-role=cancel-button] click'] = function () {
    this.element.jqxWindow('close');
  };

  component.events['[data-component-role=submit-button] click'] = function () {
    this.submitForm();
  };

});



define.component('component.Form', function (component, require, Util, Lang) {

  var jQuery = require('lib.jQuery');
  var Route = require('core.route.Route');
  var MsgBox = require('component.common.MsgBox');

  //  component.singleton = true;

  component.showForm = function (data) {
    this.element.show();

    if (this.refreshData) {
      this.refreshData(data)
    }

    this.element.trigger('visible');

    // for form list
    if (this.formType == this.FormType.Form.LIST) {
      this.refreshGrid();
    }
  };

  component.hideForm = function () {
    this.element.hide();

    this.element.trigger('hidden');
  };

  component.initView = function (view) {
    var formElement = jQuery('<div />').addClass('form').append(view);

    this.element.append(formElement);

    this.element = formElement;

    this.initForm();

    // for form list
    if (this.formType == this.FormType.Form.LIST) {
      if (this.initGrid) {
        this.initGrid();
      }
    }

    // update grid columns chooser
    this.updateGridColumnsChooser();

    this.on();
  };

  component.beforeInitView = function (element, options) {
    this.data.attr('form', this);
  };

  component.initForm = function () {};

  component.events['[data-depends-entity=focused] click'] = function (element, event) {
    if (element.data('skip-update-url')) {
      if (element.hasClass('disabled')) event.preventDefault();
      return;
    }

    event.preventDefault();

    if (element.hasClass('disabled')) {
      return;
    }

    var href = element.find('a').attr('href');

    if (href.substr(0, 2) == '#!') {
      href = href.substr(2);
    }

    var params = Route.deparam(href);
    params.id = element.data('entityId');

    Route.attr(params);
  };

  component.events['[data-component-role=delete-button] click'] = function (element, event) {
    event.preventDefault();

    if (element.hasClass('disabled')) {
      return;
    }

    var entityIds = element.data('entityIds');

    MsgBox.confirm(Lang.get('entity.destroy.confirm', {
      'totalItems': entityIds.length
    }), this.proxy(doDestroy));

    function doDestroy() {
      var data = {};
      data[this.ServiceProxy.entityId] = entityIds;

      this.ServiceProxy.destroy(data, this.proxy(destroyDone));
    }

    function destroyDone(serviceResponse) {
      this.refreshGrid();
    }
  };

  component.events['[data-component-role=export-button] click'] = function (element, event) {
    event.preventDefault();

    var grid = element.data('grid') || 'grid';

    var GridExport = require('component.export.grid.GridExport');

    GridExport.exportToExcel(this[grid], this.exportConfig[grid] || this.exportConfig);
  }

  component.initGrid = function () {

    var GridComponent = require('component.common.Grid');

    var gridConfig = this.getGridConfig();

    this.grid = new GridComponent(this.element.find('[data-component-role=grid]'), {
      ServiceProxy: this.ServiceProxy,
      grid: gridConfig,
      events: gridConfig.events || {}
    });

  };

  component.updateGridColumnsChooser = function () {
    var columnsChoosers = this.element.find('.toolbar [data-component-role=grid-columns-choooser]');

    columnsChoosers.each(function (index, element) {
      var columnsChooser = jQuery(element);

      var gridColumnsChooser = columnsChooser.data('GridColumnsChooser');

      gridColumnsChooser.updateSelectedColumns();
    });
  };

  component.getGridConfig = function (grid) {
    var gridConfig = this.gridConfig;
    if (Util.Object.isFunction(gridConfig)) {
      gridConfig = this.proxy(gridConfig)();

      this.gridConfig = gridConfig;
    }

    return grid ? this.gridConfig[grid] : this.gridConfig;
  };

  component.refreshGrid = function () {
    if (this.grid) {
      this.grid.refreshData();
    }
  }

});



define('component.common.MsgBox', function (module, require) {

  var jQuery = require('lib.jQuery');

  module.exports = {
    alert: jQuery.alert,
    confirm: jQuery.confirm
  };

});



define.component('component.common.AttendanceGrid', function (component, require, Util, Lang, jQuery) {

  // grid columns
  component.getGridColumns = function () {

    var DateTimeConstant = require('constant.DateTime');

    if (this.gridColumns) return this.gridColumns;

    var gridColumns = [{
      text: Lang.get('attendance.student.studentCode'),
      dataField: 'studentCode',

      width: '150px',

      filterType: 'textbox',
      editable: false,

      cellClassName: function (row, dataField, value, rowData) {
        //          return cellClass;
      }
    }, {
      text: Lang.get('attendance.student.firstName'),
      dataField: 'firstName',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.student.lastName'),
      dataField: 'lastName',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.present'),
      dataField: 'isPresent',

      width: '150px',

      filterType: 'bool',
      columnType: 'checkbox',
      editable: false,
    }, {
      text: Lang.get('attendance.absent'),
      dataField: 'isAbsent',

      width: '150px',

      filterType: 'bool',
      columnType: 'checkbox',
      editable: false,
    }, {
      text: Lang.get('attendance.totalPresents'),
      dataField: 'totalPresents',

      width: '150px',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.totalAbsents'),
      dataField: 'totalAbsents',

      width: '150px',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.totalUnattended'),
      dataField: 'totalUnattended',

      width: '150px',

      filterType: 'textbox',
      editable: false,
    }];

    this.gridColumns = gridColumns;

    return this.gridColumns;

  };

  component.getGridDataFields = function () {

    if (this.gridDataFields) return this.gridDataFields;

    var getGridDataFields = [{
      name: 'attendanceId',
      type: 'number'
    }, {
      name: 'studentId',
      type: 'number'
    }, {
      name: 'studentCode',
      type: 'string'
    }, {
      name: 'firstName',
      type: 'string'
    }, {
      name: 'lastName',
      type: 'string'
    }, {
      name: 'totalPresents',
      type: 'number'
    }, {
      name: 'totalAbsents',
      type: 'number'
    }, {
      name: 'totalUnattended',
      type: 'number'
    }, {
      name: 'isPresent',
      type: 'bool'
    }, {
      name: 'isAbsent',
      type: 'bool'
    }];

    this.gridDataFields = getGridDataFields;

    return this.gridDataFields;
  }

  component.initComponent = function (element, options) {
    var formElement = this.element.closest('.form');

    formElement.on('visible', this.proxy(this.initGrid));
  };

  component.initGrid = function () {

    // check for init grid only once
    if (this.isGridInitialized) {
      return;
    } else {
      this.isGridInitialized = true;
    }

    var source = this.generateSource();

    this.element.jqxGrid({
      source: source,
      columns: this.getGridColumns(),

      pageable: false,
      sortable: false,
      filterable: true,
      showFilterRow: true,
      editable: false,

      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical'
    });

    this.element.jqxGrid('removesort');

    this.element.on('cellClick', this.proxy(this.processDataChange));

  };

  component.refreshData = function (attendanceData) {

    var source = this.generateSource(attendanceData);

    this.element.jqxGrid({
      source: source
    });

  };

  component.generateSource = function (attendanceData) {

    var Attendance = require('enum.Attendance');

    var sourceData = [];

    this.sourceData = sourceData;

    this.originalData = {};

    // generate attendance data
    if (attendanceData) {

      var isLocked = attendanceData.isLocked || [];
      var students = attendanceData.students || [];
      var attendanceStatistics = attendanceData.statistics;
      var attendances = attendanceData.attendances || [];
      var hasAnyAttendances = attendances.length > 0;

      var studentAttendances = {};
      for (var i = 0, len = attendances.length; i < len; i++) {
        var attendance = attendances[i];
        studentAttendances[attendance.studentId] = {
          attendanceId: attendance.attendanceId,
          status: attendance.status
        };
      }

      for (var i = 0, len = students.length; i < len; i++) {
        var student = students[i];

        var totalPresents = attendanceStatistics.studentAttendances[student.studentId].totalPresents;
        var totalAbsents = attendanceStatistics.studentAttendances[student.studentId].totalAbsents;
        var totalUnattended = attendanceStatistics.totalSlots - totalPresents - totalAbsents;

        var item = {
          studentId: student.studentId,
          studentCode: student.studentCode,
          firstName: student.firstName,
          lastName: student.lastName,

          totalPresents: totalPresents,
          totalAbsents: totalAbsents,
          totalUnattended: totalUnattended,

          attendanceId: null,
          isPresent: isLocked ? false : true,
          isAbsent: false,
        };

        if (hasAnyAttendances) {
          var attendance = studentAttendances[student.studentId];
          if (attendance) {
            item.attendanceId = attendance.attendanceId;

            switch (attendance.status) {
            case Attendance.PRESENT:
              item.isPresent = true;
              item.isAbsent = false;
              break;
            case Attendance.ABSENT:
              item.isPresent = false;
              item.isAbsent = true;
              break;
            default:
              item.isPresent = false;
              item.isAbsent = false;
              break;
            }
          } else {
            item.isPresent = false;
            item.isAbsent = false;
          }
        }

        this.originalData[item.studentId] = {
          isPresent: item.isPresent,
          isAbsent: item.isAbsent
        };

        sourceData.push(item);
      }

    }

    // build source
    var source = {
      dataType: 'local',
      localData: sourceData,
      dataFields: this.getGridDataFields()
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  component.setEditable = function (editable) {
    this.isGridEditable = editable;
  };

  component.processDataChange = function (event, isForced) {

    if (!this.isGridEditable || !event || !event.args) return;

    var args = event.args;

    console.log(args);

    var rowData = this.element.jqxGrid('getrowdata', args.rowindex);

    var isPresent, isAbsent, totalPresents, totalAbsents, totalUnattended;

    if (args.datafield == 'isPresent') {
      if (isForced && rowData.isPresent) {
        return;
      }

      if (rowData.isPresent) {
        isPresent = false;
        isAbsent = false;

        totalPresents = rowData.totalPresents - 1;
        totalAbsents = rowData.totalAbsents;
        totalUnattended = rowData.totalUnattended + 1;
      } else if (rowData.isAbsent) {
        isPresent = true;
        isAbsent = false;

        totalPresents = rowData.totalPresents + 1;
        totalAbsents = rowData.totalAbsents - 1;
        totalUnattended = rowData.totalUnattended;
      } else {
        isPresent = true;
        isAbsent = false;

        totalPresents = rowData.totalPresents + 1;
        totalAbsents = rowData.totalAbsents;
        totalUnattended = rowData.totalUnattended - 1;
      }
    } else if (args.datafield == 'isAbsent') {
      if (isForced && rowData.isAbsent) {
        return;
      }

      if (rowData.isAbsent) {
        isAbsent = false;
        isPresent = false;

        totalAbsents = rowData.totalAbsents - 1;
        totalPresents = rowData.totalPresents;
        totalUnattended = rowData.totalUnattended + 1;
      } else if (rowData.isPresent) {
        isAbsent = true;
        isPresent = false;

        totalAbsents = rowData.totalAbsents + 1;
        totalPresents = rowData.totalPresents - 1;
        totalUnattended = rowData.totalUnattended;
      } else {
        isAbsent = true;
        isPresent = false;

        totalAbsents = rowData.totalAbsents + 1;
        totalPresents = rowData.totalPresents;
        totalUnattended = rowData.totalUnattended - 1;
      }
    } else {
      return;
    }

    this.element.jqxGrid('setCellValue', args.rowindex, 'isPresent', isPresent);
    this.element.jqxGrid('setCellValue', args.rowindex, 'isAbsent', isAbsent);
    this.element.jqxGrid('setCellValue', args.rowindex, 'totalPresents', totalPresents);
    this.element.jqxGrid('setCellValue', args.rowindex, 'totalAbsents', totalAbsents);
    this.element.jqxGrid('setCellValue', args.rowindex, 'totalUnattended', totalUnattended);

  };

  component.getAttendanceData = function () {

    var Attendance = require('enum.Attendance');

    var attendanceData = [];

    var gridRows = this.element.jqxGrid('getdisplayrows');

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];
      var originalData = this.originalData[row.studentId];

      // skip empty row
      if (!row || !originalData) continue;

      // skip unchanged row
      if (row.isPresent == originalData.isPresent && row.isAbsent == originalData.isAbsent) continue;

      var item = {
        attendanceId: row.attendanceId,
        studentId: row.studentId
      };

      if (row.isPresent) {
        item.status = Attendance.PRESENT;
      } else if (row.isAbsent) {
        item.status = Attendance.ABSENT;
      } else {
        item.status = Attendance.UNATTENDED;
      }

      attendanceData.push(item);
    }

    return attendanceData;

  };

  component.presentAll = function () {
    var gridRows = this.element.jqxGrid('getdisplayrows');

    var event = {
      args: {
        datafield: 'isPresent',
        rowindex: null
      }
    };

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];

      if (!row) continue;

      event.args.rowindex = row.visibleindex;

      this.processDataChange(event, true);
    }

  }

  component.presentAll = function () {
    this.selectAllStatus('isPresent');
  };

  component.absentAll = function () {
    this.selectAllStatus('isAbsent');
  };

  component.selectAllStatus = function (field) {
    var gridRows = this.element.jqxGrid('getdisplayrows');

    var event = {
      args: {
        datafield: field,
        rowindex: null
      }
    };

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];

      if (!row) continue;

      event.args.rowindex = row.visibleindex;

      this.processDataChange(event, true);
    }

  };

});



define.component('component.common.ViewAttendanceGrid', function (component, require, Util, Lang, jQuery) {

  // grid columns
  component.getGridColumns = function () {

    var DateTimeConstant = require('constant.DateTime');

    if (!this.gridColumns) {
      var gridColumns = [{
        text: Lang.get('schedule.date'),
        dataField: 'date',

        cellsFormat: DateTimeConstant.WidgetFormat.DAY_OF_WEEK,
        filterType: 'textbox',
        editable: false,
        cellClassName: function (row, dataField, value, rowData) {
          var ConvertUtil = require('core.util.ConvertUtil');

          // get dayOfWeek as UTC day
          var dayOfWeek = ConvertUtil.DateTime.parseDayOfWeek(value).getUTCDay();

          var cellClass = 'schedule-date';

          if (dayOfWeek === 6 || dayOfWeek == 0) {
            cellClass += ' schedule-weekend';
          }

          return cellClass;
        }
      }];

      for (var i = 1; i <= 9; i++) {
        gridColumns.push({
          text: Lang.get('schedule.slot' + i),
          dataField: 'slot' + i,

          editable: false,
          width: '100px',
          align: 'center',
          filterType: 'textbox'
        });
      }

      this.gridColumns = gridColumns;
    }

    return this.gridColumns;

  };

  component.getGridDataFields = function () {

    if (!this.gridDataFields) {
      var getGridDataFields = [{
        name: 'date',
        type: 'string'
      }];

      for (var i = 1; i <= 9; i++) {
        getGridDataFields.push({
          name: 'slot' + i,
          type: 'string'
        });
      }

      this.gridDataFields = getGridDataFields;
    }

    return this.gridDataFields;
  }

  component.initComponent = function (element, options) {
    var formElement = this.element.closest('.form');

    formElement.on('visible', this.proxy(this.initGrid));
  }

  component.initGrid = function () {

    // check for init grid only once
    if (this.isGridInitialized) {
      return;
    } else {
      this.isGridInitialized = true;
    }

    var source = this.generateSource();

    this.element.jqxGrid({
      source: source,
      columns: this.getGridColumns(),

      pageable: false,
      sortable: false,
      filterable: true,
      showFilterRow: true,
      editable: false,

      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical'
    });

    this.element.jqxGrid('removesort');

    this.element.on('cellClick', this.proxy(this.processDataChange));

  };

  component.refreshData = function (startDate, endDate, originalData, originalAttendaceStudentData) {

    if (originalData && originalAttendaceStudentData) {
      this.originalData = originalData;
      this.originalAttendaceStudentData = originalAttendaceStudentData;
    }



    var source = this.generateSource(startDate, endDate, this.originalData, this.originalAttendaceStudentData);

    this.element.jqxGrid({
      source: source
    });

  }

  component.generateSource = function (startDate, endDate, originalData, originalAttendaceStudentData) {

    var ConvertUtil = require('core.util.ConvertUtil');

    // reset schedule data
    this.scheduleAttendaceStudentData = {};
    this.scheduleData = {};

    originalData = originalData || [];
    originalAttendaceStudentData = originalAttendaceStudentData || [];

    for (var i = 0, len = originalData.length; i < len; i++) {
      var schedule = originalData[i];

      if (!this.scheduleData[schedule.date]) {
        this.scheduleData[schedule.date] = {};
      }
      this.scheduleData[schedule.date]['slot' + schedule.slot] = {};
      this.scheduleData[schedule.date]['slot' + schedule.slot]['index'] = i;
    }


    for (var i = 0, len = originalAttendaceStudentData.length; i < len; i++) {
      var scheduleAttendaceStudentData = originalAttendaceStudentData[i];

      if (!this.scheduleAttendaceStudentData[scheduleAttendaceStudentData.date]) {
        this.scheduleAttendaceStudentData[scheduleAttendaceStudentData.date] = {};
      }
      this.scheduleAttendaceStudentData[scheduleAttendaceStudentData.date]['slot' + scheduleAttendaceStudentData.slot] = {};
      this.scheduleAttendaceStudentData[scheduleAttendaceStudentData.date]['slot' + scheduleAttendaceStudentData.slot]['index'] = i;
    }



    var sourceData = [];

    // generate source data
    if (startDate && endDate && ConvertUtil.DateTime.compare(startDate, endDate) <= 0) {

      var Moment = require('lib.Moment');

      while (ConvertUtil.DateTime.compare(startDate, endDate) <= 0) {
        var dayOfWeek = ConvertUtil.DateTime.convertDateToDayOfWeek(startDate);

        var item = {
          date: dayOfWeek
        };

        var flag = false;

        for (var j = 1; j <= 9; j++) {
          var isAttendance = !!(this.scheduleAttendaceStudentData[startDate] && this.scheduleAttendaceStudentData[startDate]['slot' + j]);
          var isHaveSchedule = !!(this.scheduleData[startDate] && this.scheduleData[startDate]['slot' + j]);

          if (isAttendance) {
            if (originalAttendaceStudentData[this.scheduleAttendaceStudentData[startDate]['slot' + j]['index']].attendances[0].status == 1) {
              item['slot' + j] = 'Present';
              flag = true;
            } else if (originalAttendaceStudentData[this.scheduleAttendaceStudentData[startDate]['slot' + j]['index']].attendances[0].status == 2) {
              item['slot' + j] = 'Absent';
              flag = true;
            }

          } else if (isHaveSchedule) {
            item['slot' + j] = 'Unattended ';
            flag = true;
          }

        }
        if (flag) {
          sourceData.push(item);
        }

        startDate = ConvertUtil.DateTime.addDays(startDate, 1);
      }

    }

    // build source
    var source = {
      dataType: 'local',
      localData: sourceData,
      dataFields: this.getGridDataFields(),

    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  component.setEditable = function (editable) {
    this.isGridEditable = editable;
  };

});



define.component('component.common.GradeGrid', function (component, require, Util, Lang, jQuery) {

  component.gradeCalculation = {};

  // grid columns
  component.getGridColumns = function () {

    var gradeCategories = this.gradeCategories || [];

    var gridColumns = [{
      text: Lang.get('grade.student.studentCode'),
      dataField: 'studentCode',
      //      columnGroup: 'student',

      width: '150px',

      filterType: 'textbox',
      editable: false,

      cellClassName: function (row, dataField, value, rowData) {}
    }, {
      text: Lang.get('grade.student.firstName'),
      dataField: 'firstName',
      //      columnGroup: 'student',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('grade.student.lastName'),
      dataField: 'lastName',
      //      columnGroup: 'student',

      filterType: 'textbox',
      editable: false,
    }];

    for (var i = 0, len = gradeCategories.length; i < len; i++) {
      var gradeCategory = gradeCategories[i];

      var column = {
        text: Lang.get('grade.nameCode', {
          name: gradeCategory.gradeCategoryName,
          code: gradeCategory.gradeCategoryCode,
          weight: gradeCategory.weight
        }),
        dataField: 'gradeCategory.' + gradeCategory.gradeCategoryCode,
        //          columnGroup: 'grade',

        filterType: 'textbox',
        editable: true,

        type: 'number',

        validation: function (cell, value) {
          if (value != null && (value < 0 || value > 10)) {
            return {
              result: false,
              message: "Quantity should be in the 0-10 interval"
            };
          }

          return true;
        }
      };

      gridColumns.push(column);
    }

    gridColumns.push({
      text: Lang.get('grade.averageGrade'),
      filterType: 'textbox',
      editable: false,
      dataField: 'averageGrade',

      cellsRenderer: this.proxy(function (rowIndex, columnField, value, defaultHtml, columnProperties) {
        var GradeConstant = require('constant.Grade');
        var GradeStatus = require('enum.GradeStatus');

        var totalGrade = 0;
        var totalWeight = 0;
        var gradeStatus;

        var rowData = this.element.jqxGrid('getrowdata', rowIndex);

        for (var i = 0, len = gradeCategories.length; i < len; i++) {
          var gradeCategory = gradeCategories[i];
          var grade = rowData['gradeCategory.' + gradeCategory.gradeCategoryCode];
          var weight = gradeCategory.weight;
          var minimumGrade = gradeCategory.minimumGrade;

          if (grade == null) {
            if (gradeStatus === undefined) {
              gradeStatus = GradeStatus.UNFINISHED;
            }
          } else {
            totalGrade += grade * weight;
            totalWeight += weight;

            if (grade < minimumGrade && gradeStatus === undefined) {
              gradeStatus = GradeStatus.FAIL;
            }
          }
        }

        var averageGrade = totalGrade / totalWeight;
        if (isNaN(averageGrade)) {
          averageGrade = null;
        }

        if (gradeStatus === undefined) {
          if (averageGrade >= GradeConstant.PASS_GRADE) {
            gradeStatus = GradeStatus.PASS;
          } else if (totalWeight == 0) {
            gradeStatus = GradeStatus.UNFINISHED;
          } else {
            gradeStatus = GradeStatus.FAIL;
          }
        }

        this.gradeCalculation[rowIndex] = {
          gradeStatus: gradeStatus
        }

        var text = (averageGrade !== 0 && !averageGrade) ? '' : averageGrade
        text = '<span class="statistic">' + text + '</span>';

        return defaultCellRenderer(defaultHtml, text);
      })
    }, {
      text: Lang.get('grade.averageGrade'),
      filterType: 'textbox',
      editable: false,
      dataField: 'gradeStatus',

      cellsRenderer: this.proxy(function (rowIndex, columnField, value, defaultHtml, columnProperties) {
        var GradeStatus = require('enum.GradeStatus');

        var gradeCalculation = this.gradeCalculation[rowIndex];

        var text;

        if (gradeCalculation) {
          switch (gradeCalculation.gradeStatus) {
          case GradeStatus.PASS:
            text = Lang.get('grade.status.pass');
            text = '<span class="grade-status grade-status-pass">' + text + '</span>';

            break;
          case GradeStatus.FAIL:
            text = Lang.get('grade.status.fail');
            text = '<span class="grade-status grade-status-fail">' + text + '</span>';

            break;
          case GradeStatus.UNFINISHED:
            text = Lang.get('grade.status.unfinished');
            text = '<span class="grade-status grade-status-unfinished">' + text + '</span>';

            break;
          }
        }

        return defaultCellRenderer(defaultHtml, text);
      })
    });

    return gridColumns;

    function defaultCellRenderer(defaultHtml, text) {
      var elmHtml = jQuery(defaultHtml).html(text);
      var elmWrapper = jQuery('<div />');

      var html = elmWrapper.append(elmHtml).html();

      elmHtml.remove();
      elmWrapper.remove();

      return html;
    }

  };

  component.getGridDataFields = function () {

    var gradeCategories = this.gradeCategories || [];

    var gridDataFields = [{
      name: 'studentId',
      type: 'number'
    }, {
      name: 'studentCode',
      type: 'string'
    }, {
      name: 'firstName',
      type: 'string'
    }, {
      name: 'lastName',
      type: 'string'
    }];

    for (var i = 0, len = gradeCategories.length; i < len; i++) {
      var gradeCategory = gradeCategories[i];

      var field = {
        name: 'gradeCategory.' + gradeCategory.gradeCategoryCode,
        type: 'number'
      };

      gridDataFields.push(field);
    }

    gridDataFields.push({
      name: 'averageGrade',
      type: 'number'
    }, {
      name: 'gradeStatus',
      type: 'string'
    });

    return gridDataFields;
  }

  component.initComponent = function (element, options) {
    var formElement = this.element.closest('.form');

    formElement.on('visible', this.proxy(this.initGrid));
  };

  component.initGrid = function () {

    // check for init grid only once
    if (this.isGridInitialized) {
      return;
    } else {
      this.isGridInitialized = true;
    }

    var source = this.generateSource();
    var columns = this.getGridColumns();

    this.element.addClass('grade-grid');

    this.element.jqxGrid({
      source: source,
      columns: columns,
      columngroups: [{
        text: Lang.get('grade.group.student'),
        align: 'center',
        name: 'student'
        }, {
        text: Lang.get('grade.group.grade'),
        align: 'center',
        name: 'grade'
      }],

      pageable: false,
      sortable: false,
      filterable: true,
      showFilterRow: true,
      editable: true,
      selectionMode: 'multipleCellsAdvanced',

      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical'
    });

    this.element.jqxGrid('removesort');

  };

  component.refreshData = function (gradeData) {

    this.gradeCategories = gradeData ? gradeData.gradeCategories : undefined;

    var source = this.generateSource(gradeData);
    var columns = this.getGridColumns();

    this.element.jqxGrid({
      source: source,
      columns: columns,
    });

  };

  component.generateSource = function (gradeData) {
    var sourceData = [];
    var dataFields;

    if (gradeData) {
      var gradeCategories = this.gradeCategories || [];

      var students = gradeData.students || [];
      var grades = gradeData.grades || [];

      // generate data fields
      dataFields = this.getGridDataFields(gradeCategories);

      // map of grade category id and code
      var gradeCategoryIdCodeMaps = {};
      for (var i = 0, len = gradeCategories.length; i < len; i++) {
        var gradeCategory = gradeCategories[i];
        gradeCategoryIdCodeMaps[gradeCategory.gradeCategoryId] = gradeCategory.gradeCategoryCode;
      }

      // build original grades
      var originalGrades = this.originalGrades = {};

      for (var i = 0, studentLen = students.length; i < studentLen; i++) {
        var student = students[i];
        var studentGrade = originalGrades[student.studentId] = {};

        for (var j = 0, gradeCategoryLen = gradeCategories.length; j < gradeCategoryLen; j++) {
          var gradeCategory = gradeCategories[j];

          studentGrade[gradeCategory.gradeCategoryCode] = {
            gradeId: null,
            gradeCategoryId: null,
            value: null
          };
        }
      }

      // update original grade
      for (var i = 0, len = grades.length; i < len; i++) {
        var grade = grades[i];

        var gradeCategoryCode = gradeCategoryIdCodeMaps[grade.gradeCategoryId];

        // skip grade not in the null grade list
        if (
          originalGrades[grade.studentId] === undefined ||
          originalGrades[grade.studentId][gradeCategoryCode] === undefined
        ) continue;

        originalGrades[grade.studentId][gradeCategoryCode] = {
          gradeId: grade.gradeId,
          gradeCategoryId: grade.gradeCategoryId,
          value: grade.value
        };
      };

      // generate source

      for (var i = 0, studentLen = students.length; i < studentLen; i++) {
        var student = students[i];

        var item = {
          studentId: student.studentId,
          studentCode: student.studentCode,
          firstName: student.firstName,
          lastName: student.lastName
        };

        for (var j = 0, gradeCategoryLen = gradeCategories.length; j < gradeCategoryLen; j++) {
          var gradeCategory = gradeCategories[j];

          var value = originalGrades[student.studentId][gradeCategory.gradeCategoryCode].value;
          item['gradeCategory.' + gradeCategory.gradeCategoryCode] = value;
        };

        sourceData.push(item);
      }
    } else {
      dataFields = this.getGridDataFields();
    }

    // build source
    var source = {
      dataType: 'local',
      localData: sourceData,
      dataFields: dataFields
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  component.setEditable = function (editable) {
    this.isGridEditable = editable;

    this.element.jqxGrid({
      editable: editable,
      selectionMode: 'multipleCellsAdvanced'
    });
  };

  component.getGradeData = function () {

    var gradeData = [];

    var gradeCategories = this.gradeCategories || [];

    if (!gradeCategories.length) return gradeData;

    var gridRows = this.element.jqxGrid('getdisplayrows');

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];
      var studentId = row.studentId;
      var originalData = this.originalGrades[studentId];

      // skip empty row
      if (!row || !originalData) continue;

      for (var j = 0, gradeCategoryLen = gradeCategories.length; j < gradeCategoryLen; j++) {
        var gradeCategory = gradeCategories[j];

        var gradeCategoryCode = gradeCategory.gradeCategoryCode;
        var value = row['gradeCategory.' + gradeCategoryCode];

        // skip unchanged data
        if (originalData && originalData[gradeCategoryCode].value === value) continue;

        var item = {
          gradeId: originalData[gradeCategoryCode].gradeId,
          gradeCategoryId: gradeCategory.gradeCategoryId,
          studentId: studentId,
          value: value
        };

        gradeData.push(item);
      }
    }

    return gradeData;

  };

});



define('component.export.grid.GridExport', function (module, require) {

  module.exports = {
    exportToExcel: exportToExcel
  };

  function getGridData(grid) {
    var jQuery = require('lib.jQuery');
    var Underscore = require('lib.Underscore');

    var trimmer = jQuery('<div />');

    var originalGridColumns = grid.gridColumns;

    grid = grid.element;

    var startIndex = grid.jqxGrid('selectionmode') === 'checkbox' ? 1 : 0;

    var gridColumns = grid.jqxGrid('columns').records;

    var gridData = {
      fields: [],
      items: []
    };

    for (var i = startIndex, len = gridColumns.length; i < len; i++) {
      var column = gridColumns[i];

      if (column.hidden) continue;

      var columnConfig = Underscore.findWhere(originalGridColumns, {
        dataField: column.datafield
      });

      var renderer = columnConfig && columnConfig.originalRenderer ? columnConfig.originalRenderer : undefined;

      gridData.fields.push({
        name: column.datafield,
        text: column.text,
        renderer: renderer
      });
    }

    var gridRows = grid.jqxGrid('getdisplayrows');

    var ConvertUtil = require('core.util.ConvertUtil');

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];

      if (!row) continue;

      var item = {};

      for (var j = 0, fieldLen = gridData.fields.length; j < fieldLen; j++) {
        var fieldName = gridData.fields[j].name;
        var renderer = gridData.fields[j].renderer;
        var fieldValue = row[fieldName];

        // for datetime
        if (['dateOfBirth'].indexOf(fieldName) != -1) {
          // fieldValue = ConvertUtil.DateTime.formatDate(fieldValue);
          fieldValue = fieldValue;
        }
        // for gender
        else if (['gender'].indexOf(fieldName) != -1) {
          fieldValue = ConvertUtil.Gender.toString(fieldValue);
        }
        // for column has custom renderer
        else if (renderer) {
          fieldValue = renderer(row, fieldName, fieldValue);
        }

        if (fieldValue === null || fieldValue === undefined) {
          fieldValue = '';
        } else {
          fieldValue = '' + fieldValue;
        }

        // trim html
        fieldValue = trimmer.html(fieldValue).text();

        item[fieldName] = fieldValue;
      }

      gridData.items.push(item);
    }

    return gridData;
  }

  function exportToExcel(grid, exportConfig) {
    var ExcelBuilder = require('lib.ExcelBuilder');
    var Util = require('core.util.Util');

    var gridData = getGridData(grid);

    var workBook = ExcelBuilder.createWorkbook();

    var sheet = workBook.createWorksheet({
      name: exportConfig.sheetName
    });

    var styleSheet = workBook.getStyleSheet();

    // header style
    var styleHeader = styleSheet.createFormat({
      font: {
        bold: true,
        color: '2b579a'
      }
    });

    var header = [];
    var headerFields = [];

    for (var i = 0, len = gridData.fields.length; i < len; i++) {
      var columnConfig = exportConfig.columns[gridData.fields[i].name];

      if (!columnConfig || columnConfig.skip) continue;

      header.push({
        value: gridData.fields[i].text,
        metadata: {
          style: styleHeader.id
        }
      });

      headerFields.push(gridData.fields[i].name);
    };

    var exportData = [header];

    var headerLen = headerFields.length;

    for (i = 0, len = gridData.items.length; i < len; i++) {
      var item = gridData.items[i];
      var row = [];

      for (j = 0; j < headerLen; j++) {
        var columnConfig = exportConfig.columns[headerFields[j]];

        if (!columnConfig || columnConfig.skip) continue;

        row.push({
          value: item[headerFields[j]]
        });
      }

      exportData.push(row);
    }

    sheet.setData(exportData);

    var exportColumns = [];
    for (i = 0; i < headerLen; i++) {
      var columnConfig = exportConfig.columns[headerFields[i]];

      if (!columnConfig || columnConfig.skip) continue;

      exportColumns.push({
        width: columnConfig.width
      });
    }

    sheet.setColumns(exportColumns);

    workBook.addWorksheet(sheet);

    var workBookData = ExcelBuilder.createFile(workBook);

    exportToExcelFile(workBookData, exportConfig);
  }

  function exportToExcelFile(data, exportConfig) {

    var FileSaver = require('lib.FileSaver');

    var mimeXlsx = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    var blob = base64toBlob(data, mimeXlsx);

    FileSaver.saveAs(blob, getFileName(exportConfig.fileName));
  }

  function getFileName(fileName) {
    var ConvertUtil = require('core.util.ConvertUtil');

    return ConvertUtil.Export.getExportFileName(fileName);
  }

  function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';

    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, {
      type: contentType
    });
  }

});



define.component('component.common.GridColumnsChooser', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var form = componentData.attr('form');

    var grid = options.componentAttributes.grid;

    var gridConfig = form.getGridConfig();

    var columns;
    if (grid) {
      columns = gridConfig[grid].columns;
    } else {
      grid = 'grid';
      columns = gridConfig.columns;
    }
    this.columns = columns;

    var dropDownList = this.dropDownList = jQuery('<div />')
      .attr('data-component-role', 'grid-columns-choooser')
      .data('GridColumnsChooser', this)
      .appendTo(element);

    var sourceData = [];
    for (var i = 0, len = columns.length; i < len; i++) {
      sourceData.push({
        columnName: columns[i].dataField,
        columnText: columns[i].text
      });
    }

    var source = {
      localData: sourceData,
      id: 'columnName',
      dataType: 'json',
      dataFields: [{
        name: 'columnName'
      }, {
        name: 'columnText'
      }]
    };

    var dataAdaper = new jQuery.jqx.dataAdapter(source);

    var dropDownListOptions = {
      source: dataAdaper,
      displayMember: 'columnText',
      valueMember: 'columnName',
      checkboxes: true,

      width: '150px',
      height: '22px',
      enableBrowserBoundsDetection: true
    };

    //    if (sourceData.length > 2) {
    //      dropDownListOptions.dropDownHeight = '200px';
    //    } else {
    //      dropDownListOptions.autoDropDownHeight = true;
    //    }

    dropDownListOptions.autoDropDownHeight = true;

    dropDownList.jqxDropDownList(dropDownListOptions);

    // tracking changes of dropdownlist
    dropDownList.on('checkChange', function (event) {
      if (!form[grid] || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      if (item.checked) {
        form[grid].showColumn(item.value);
      } else {
        form[grid].hideColumn(item.value);
      }
    });

  };

  component.updateSelectedColumns = function () {
    for (var i = 0, len = this.columns.length; i < len; i++) {
      if (!this.columns[i].hidden) {
        this.dropDownList.jqxDropDownList('checkIndex', i);
      }
    }
  }

});



define.component('component.common.GridPager', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var grid = options.componentAttributes.grid || 'grid';

    var componentData = options.componentData;
    var form = componentData.attr('form');

    var numberInput = this.numberInput = jQuery('<div />')
      .attr('data-component-role', 'grid-pager')
      .data('GridPager', this)
      .appendTo(element);

    var numberInputOptions = {
      spinButtons: true,
      spinMode: 'advanced',
      inputMode: 'simple',
      spinButtonsStep: 10,
      decimal: 50,
      decimalDigits: 0,
      min: 0,
      width: '50px',
      height: '22px'
    };

    numberInput.jqxNumberInput(numberInputOptions);

    numberInput.on('valuechanged', function (event) {
      var value = event.args.value;

      form[grid].setPageSize(value);
    });

  };

});



define.component('component.common.Grid', function (component, require, Util, Lang, jQuery) {

  component.maximumPageItems = 10000;

  component.initComponent = function (element, options) {

    var DateTimeConstant = require('constant.DateTime');

    this.toolbar = {};

    this.lastSelectedRow = null;

    this.eventHandlers = options.events || {};

    var formElement = this.element.closest('.form');

    var dependsEntityFocusedElements = formElement.find('.toolbar [data-depends-entity=focused]');
    if (dependsEntityFocusedElements.size()) {
      this.toolbar.dependsEntityFocusedElements = dependsEntityFocusedElements;

      this.updateDependsEntityFocusedElements(null);
    }

    var dependsEntitySelectedElements = formElement.find('.toolbar [data-depends-entity=selected]');
    if (dependsEntitySelectedElements.size()) {
      this.toolbar.dependsEntitySelectedElements = dependsEntitySelectedElements;

      this.updateDependsEntitySelectedElements(null);
    }

    var ServiceProxy = options.ServiceProxy;

    var source = this.generateSource(ServiceProxy);

    var gridOptions = options.grid;

    // allow all columns to be hidden
    for (var i = 0, len = gridOptions.columns.length; i < len; i++) {
      var gridColumn = gridOptions.columns[i];

      gridColumn.hideable = true;
      gridColumn.resizable = true;

      if (gridColumn.cellsRenderer) {
        gridColumn.originalRenderer = gridColumn.cellsRenderer;
        gridColumn.cellsRenderer = this.proxy(defaultCellsRenderer(gridColumn.cellsRenderer));
      }

      // for date
      if (['dateOfBirth'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '100px';

        gridColumn.cellsFormat = DateTimeConstant.WidgetFormat.DATE;
      }

      // for datetime
      if (['createdTime'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '200px';

        gridColumn.cellsFormat = DateTimeConstant.WidgetFormat.DATE;
      }

      // for gender
      if (['gender'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '100px';

        gridColumn.filterType = 'list';

        gridColumn.createFilterWidget = function (column, columnElement, widget) {
          var source = [
            Lang.get('gender.all'),
            Lang.get('gender.male'),
            Lang.get('gender.female'),
            Lang.get('gender.unknown')
          ];

          widget.jqxDropDownList({
            source: source,
            dropDownWidth: '90px'
          });
        };

        gridColumn.cellsRenderer = function (row, columnField, value, defaultHtml, columnProperties) {
          if (columnProperties.hidden) return;

          var ConvertUtil = require('core.util.ConvertUtil');

          var genderText = ConvertUtil.Gender.toString(value);

          var elmHtml = jQuery(defaultHtml).text(genderText);
          var elmWrapper = jQuery('<div />');

          var genderHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return genderHtml;
        }
      }

      // for attendance
      if (gridColumn.columnType == 'attendance' || ['attendance'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '100px';

        gridColumn.filterType = 'list';

        gridColumn.createFilterWidget = function (column, columnElement, widget) {
          var source = [
            Lang.get('attendance.all'),
            Lang.get('attendance.present'),
            Lang.get('attendance.absent'),
            Lang.get('attendance.unattended')
          ];

          widget.jqxDropDownList({
            source: source,
            dropDownWidth: '90px'
          });
        };

        gridColumn.cellsRenderer = function (row, columnField, value, defaultHtml, columnProperties) {
          if (columnProperties.hidden) return;

          var ConvertUtil = require('core.util.ConvertUtil');

          var attendanceText = ConvertUtil.Attendance.toString(value);

          var elmHtml = jQuery(defaultHtml).text(attendanceText);
          var elmWrapper = jQuery('<div />');

          var attendanceHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return attendanceHtml;
        }
      }

      // for role
      if (['role'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '150px';

        gridColumn.filterType = 'list';

        gridColumn.createFilterWidget = function (column, columnElement, widget) {
          var source = [
            Lang.get('role.all'),
            Lang.get('role.educator'),
            Lang.get('role.examinator'),
            Lang.get('role.newsManager'),
            Lang.get('role.student'),
            Lang.get('role.parent'),
          ];

          widget.jqxDropDownList({
            source: source,
            dropDownWidth: '140px'
          });
        };

        gridColumn.cellsRenderer = function (row, columnField, value, defaultHtml, columnProperties) {
          if (columnProperties.hidden) return;

          var ConvertUtil = require('core.util.ConvertUtil');

          var roleText = ConvertUtil.Role.toString(value);

          var elmHtml = jQuery(defaultHtml).text(roleText);
          var elmWrapper = jQuery('<div />');

          var roleHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return roleHtml;
        }
      }

      // for relationship
      if (['relationship'].indexOf(gridColumn.dataField) != -1) {
        gridColumn.width = '150px';

        gridColumn.filterType = 'list';

        gridColumn.createFilterWidget = function (column, columnElement, widget) {
          var source = [
            Lang.get('relationship.unknown'),
            Lang.get('relationship.other'),
            Lang.get('relationship.father'),
            Lang.get('relationship.mother'),
            Lang.get('relationship.grandFather'),
            Lang.get('relationship.grandMother'),
            Lang.get('relationship.godParent'),
          ];

          widget.jqxDropDownList({
            source: source,
            dropDownWidth: '140px'
          });
        };

        gridColumn.cellsRenderer = function (row, columnField, value, defaultHtml, columnProperties) {
          if (columnProperties.hidden) return;

          var ConvertUtil = require('core.util.ConvertUtil');

          var roleText = ConvertUtil.Relationship.toString(value);

          var elmHtml = jQuery(defaultHtml).text(roleText);
          var elmWrapper = jQuery('<div />');

          var relationshipHtml = elmWrapper.append(elmHtml).html();

          elmHtml.remove();
          elmWrapper.remove();

          return relationshipHtml;
        }
      }

    }

    this.gridColumns = gridOptions.columns;

    this.element.data('GridComponent', this);

    gridOptions = {
      // source
      //source: source,
      // paging
      pageable: options.grid.pageable !== false,
      // resizing
      columnsResize: true,
      // sorting
      sortable: options.grid.sortable !== false,
      // filtering
      filterable: options.grid.filterable !== false,
      showFilterRow: options.grid.filterable !== false,
      // selection
      selectionMode: options.grid.singleSelection ? 'singlerow' : 'checkbox',
      enableHover: false,
      // size
      width: '100%',
      height: '100%',
      scrollBarSize: 12,
      scrollMode: 'logical',
      // columns
      columns: gridOptions.columns,
      // resize
      //      columnsResize: true,
      // other
      showEmptyRow: false,
      // toolbar
      showStatusbar: false
    };

    if (options.grid.pageable !== false) {
      gridOptions.pageSize = options.grid.pageable !== false ? 50 : this.maximumPageItems;
      gridOptions.pagerMode = 'simple';
      gridOptions.virtualMode = true;
      gridOptions.renderGridRows = function (params) {
        return params.data;
      };
    }

    this.element.jqxGrid(gridOptions);

    this.element.on('initialized', this.proxy(function () {
      this.element.jqxGrid({
        source: source
      });
    }));

    this.element.on('rowClick rowclick', this.proxy(function (event) {
      var args = event.args;

      var row = this.element.jqxGrid('getrowdata', args.rowindex);

      var rowElement = $(args.originalEvent.target).closest('[role="row"]');

      if (this.lastSelectedRow) {
        this.lastSelectedRow.removeClass('selected');
      }

      rowElement.addClass('selected');
      this.lastSelectedRow = rowElement;

      var entityId = row[this.source.id];

      this.updateDependsEntityFocusedElements(entityId);

      if (this.eventHandlers.singleSelect) {
        this.eventHandlers.singleSelect(entityId, row);
      }
    }));

    this.element.on('rowSelect rowUnselect rowselect rowunselect', this.proxy(function (event) {
      var args = event.args;
      var rowIndexes = args.rowindex;

      if (!Util.Object.isArray(rowIndexes)) {
        rowIndexes = [rowIndexes];
      }

      if (rowIndexes.length == 0) {
        this.updateDependsEntitySelectedElements(null);
        return;
      }

      for (var i = 0, len = rowIndexes.length; i < len; i++) {
        var row = this.element.jqxGrid('getrowdata', rowIndexes[i]);

        if (!row) continue;

        var entityId = row[this.source.id];

        this.updateDependsEntitySelectedElements(entityId);
      }
    }));

    this.element.on('pageChanged', this.proxy(function (event) {
      this.clearSelection();
    }));

    this.gridInitialized = true;

    function defaultCellsRenderer(cellsRenderer) {
      return function (rowIndex, columnField, value, defaultHtml, columnProperties) {
        if (columnProperties.hidden) return;

        var rowData = this.element.jqxGrid('getrowdata', rowIndex);

        var text = cellsRenderer(rowData, columnField, value);

        var elmHtml = jQuery(defaultHtml).html(text);
        var elmWrapper = jQuery('<div />');

        var html = elmWrapper.append(elmHtml).html();

        elmHtml.remove();
        elmWrapper.remove();

        return html;
      };
    }

  };

  component.generateSource = function (ServiceProxy) {
    var source = {};
    this.source = source;

    // date type
    source.dataType = 'json';

    var proxy, proxyMethod, entityMap;

    // service url
    if (ServiceProxy.proxy && ServiceProxy.method) {
      proxyMethod = ServiceProxy.proxy[ServiceProxy.method];
      proxy = ServiceProxy.proxy;
      entityMap = ServiceProxy.entityMap ? proxy[ServiceProxy.entityMap] : proxy.EntityMap;
    } else {
      proxyMethod = ServiceProxy.findAll;
      proxy = ServiceProxy;
      entityMap = ServiceProxy.EntityMap;
    }

    source.url = proxyMethod.url;

    // http method
    source.type = proxyMethod.httpMethod;

    // root element
    source.root = 'data.items';

    // id attribute
    source.id = proxy.entityId;

    // data fields
    source.dataFields = entityMap;

    // source mapping char
    source.mapChar = '.';
    source.mapchar = '.';

    // auto update sort
    source.sort = this.proxy(function () {
      this.element.jqxGrid('updatebounddata', 'sort');

      this.clearSelection();
    });

    // auto update filter
    source.filter = this.proxy(function () {
      this.element.jqxGrid('updatebounddata', 'filter');
      this.clearSelection();
    });

    // data adapter
    var dataAdapter = new jQuery.jqx.dataAdapter(source, {

      // custom paging data
      beforeLoadComplete: this.proxy(function (data, originalData) {
        if (this.eventHandlers.processData) {
          this.eventHandlers.processData(data, originalData);
        }

        var totalRecords;

        if (this.eventHandlers.getTotalRecords) {
          totalRecords = this.eventHandlers.getTotalRecords(originalData);
        } else {
          totalRecords = originalData.data.total;
        }

        dataAdapter.totalrecords = totalRecords;
      }),

      // custom data send to server
      formatData: this.proxy(function (originalData) {
        var data = {};

        if (this.element.jqxGrid('pageable')) {
          data.pageSize = originalData.pagesize;
          data.pageIndex = originalData.pagenum || 0;
        }

        if (originalData.sortdatafield) {
          data.sortField = originalData.sortdatafield;

          // check if dataField is mapped
          for (var j = 0, dataFieldLen = source.dataFields.length; j < dataFieldLen; j++) {
            if (source.dataFields[j].name == data.sortField && source.dataFields[j].map) {
              data.sortField = source.dataFields[j].map;
              break;
            }
          }

          data.sortOrder = originalData.sortorder || 'ASC';
        }

        if (originalData.filterscount) {
          data.filters = [];

          for (var i = 0, len = originalData.filterscount; i < len; i++) {
            var dataField = originalData['filterdatafield' + i];
            var dataValue = originalData['filtervalue' + i];

            var column = Util.Collection.findWhere(this.gridColumns, {
              dataField: dataField
            });

            var columnType = column ? column.columnType : null;

            if (columnType == 'gender' || ['gender'].indexOf(dataField) != -1) {
              var ConvertUtil = require('core.util.ConvertUtil');

              dataValue = ConvertUtil.Gender.toGender(dataValue);
            }

            if (columnType == 'attendance' || ['attendance'].indexOf(dataField) != -1) {
              var ConvertUtil = require('core.util.ConvertUtil');

              dataValue = ConvertUtil.Attendance.toAttendance(dataValue);
            }

            if (columnType == 'role' || ['role'].indexOf(dataField) != -1) {
              var ConvertUtil = require('core.util.ConvertUtil');

              dataValue = ConvertUtil.Role.toRole(dataValue);
            }

            if (columnType == 'relationship' || ['relationship'].indexOf(dataField) != -1) {
              var ConvertUtil = require('core.util.ConvertUtil');

              dataValue = ConvertUtil.Relationship.toRelationship(dataValue);
            }

            // check if dataField is mapped
            for (var j = 0, dataFieldLen = source.dataFields.length; j < dataFieldLen; j++) {
              if (source.dataFields[j].name == dataField && source.dataFields[j].map) {
                dataField = source.dataFields[j].map;
                break;
              }
            }

            data.filters.push({
              field: dataField,
              value: dataValue
            });
          }
        }

        if (this.params) {
          Util.Collection.each(this.params, function (value, key) {
            data[key] = value;
          });
        }

        if (this.filterConditions) {
          if (!data.filters) data.filters = [];

          Util.Collection.each(this.filterConditions, function (value, key) {
            data.filters.push({
              field: key,
              value: value
            });
          });
        }

        if (this.excludeConditions) {
          if (!data.excludeFilters) data.excludeFilters = [];

          Util.Collection.each(this.excludeConditions, function (value, key) {
            data.excludeFilters.push({
              field: key,
              value: value
            });
          });
        }

        return data;
      })

    });

    return dataAdapter
  };

  component.setServiceProxy = function (ServiceProxy) {
    var source = this.generateSource(ServiceProxy);

    // clear filter conditions when change ServiceProxy
    // this.filterConditions = {};
    // this.excludeConditions = {};

    this.element.jqxGrid({
      source: source
    });

    this.clearSelection();
  };

  component.refreshData = function () {
    this.element.jqxGrid('updatebounddata');

    this.clearSelection();
  };

  component.clearSelection = function () {
    var selectedIndexes = this.element.jqxGrid('getselectedrowindexes');

    if (selectedIndexes.length) {
      this.element.jqxGrid('clearSelection');
    }

    if (this.lastSelectedRow) {
      this.lastSelectedRow.removeClass('selected');
    }

    this.updateDependsEntityFocusedElements(null);
    this.updateDependsEntitySelectedElements(null);
  };

  component.updateDependsEntityFocusedElements = function (entityId) {
    var dependsEntityFocusedElements = this.toolbar.dependsEntityFocusedElements;

    if (!dependsEntityFocusedElements) return;

    dependsEntityFocusedElements.each(this.proxy(updateElements));

    function updateElements(index, element) {
      element = $(element);

      if (entityId === null) {
        element.data('entityId', '');

        element.addClass('disabled');
      } else {
        element.data('entityId', entityId);

        element.removeClass('disabled');
      }
    }
  };

  component.updateDependsEntitySelectedElements = function (entityId) {
    var dependsEntitySelectedElements = this.toolbar.dependsEntitySelectedElements;

    if (!dependsEntitySelectedElements) return;

    dependsEntitySelectedElements.each(this.proxy(updateElements));

    function updateElements(index, element) {
      element = $(element);

      if (entityId === null) {
        element.data('entityIds', []);

        element.addClass('disabled');
      } else {
        var entityIds = element.data('entityIds');

        var index = entityIds.indexOf(entityId);

        if (index == -1) {
          entityIds.push(entityId);
        } else {
          entityIds.splice(index, 1);
        }

        element.data('entityId', entityIds);

        if (entityIds.length) {
          element.removeClass('disabled');
        } else {
          element.addClass('disabled');
        }
      }
    }
  };

  component.hideColumn = function (column) {
    this.element.jqxGrid('hideColumn', column);
  };

  component.showColumn = function (column) {
    this.element.jqxGrid('showColumn', column);
  };

  component.setPageSize = function (pageSize) {
    pageSize = ~~pageSize;

    if (pageSize == 0) {
      pageSize = this.maximumPageItems;
    }

    this.element.jqxGrid({
      pageSize: pageSize
    });
  };

  component.setParams = function (key, value) {
    if (!this.params) {
      this.params = {};
    }

    if (value === null) {
      this.params = Util.Object.omit(this.params, key);
    } else {
      this.params[key] = value;
    }

    this.refreshData();
  };

  component.setFilterConditions = function (key, value, skipRefresh) {
    if (!this.filterConditions) {
      this.filterConditions = {};
    }

    if (value === null) {
      this.filterConditions = Util.Object.omit(this.filterConditions, key);
    } else {
      this.filterConditions[key] = value;
    }

    if (!skipRefresh) this.refreshData();
  };

  component.setExcludeConditions = function (key, value, skipRefresh) {
    if (!this.excludeConditions) {
      this.excludeConditions = {};
    }

    this.excludeConditions[key] = value;

    if (!skipRefresh) this.refreshData();
  };

  component.getSelectedIds = function () {
    var selectedIndexes = this.element.jqxGrid('getSelectedRowIndexes');

    var selectedIds = [];

    var entityId = this.source.id;

    for (var i = 0, len = selectedIndexes.length; i < len; i++) {
      var rowData = this.element.jqxGrid('getRowData', selectedIndexes[i]);

      if (!rowData || !rowData[entityId]) continue;

      selectedIds.push(rowData[entityId]);
    }

    return selectedIds;
  };

  component.refreshSize = function () {
    this.element.jqxGrid({
      width: '0px',
      height: '0px'
    });
    this.element.jqxGrid({
      width: '100%',
      height: '100%'
    });
  };

});


define.component('component.common.ScheduleGrid', function (component, require, Util, Lang, jQuery) {

  // grid columns
  component.getGridColumns = function () {

    var DateTimeConstant = require('constant.DateTime');

    if (!this.gridColumns) {
      var gridColumns = [{
        text: Lang.get('schedule.date'),
        dataField: 'date',

        cellsFormat: DateTimeConstant.WidgetFormat.DAY_OF_WEEK,
        filterType: 'textbox',
        editable: false,
        cellClassName: function (row, dataField, value, rowData) {
          var ConvertUtil = require('core.util.ConvertUtil');

          // get dayOfWeek as UTC day
          var dayOfWeek = ConvertUtil.DateTime.parseDayOfWeek(value).getUTCDay();

          var cellClass = 'schedule-date';

          if (dayOfWeek === 6 || dayOfWeek == 0) {
            cellClass += ' schedule-weekend';
          }

          return cellClass;
        }
      }];

      for (var i = 1; i <= 9; i++) {
        gridColumns.push({
          text: Lang.get('schedule.slot' + i),
          dataField: 'slot' + i,

          editable: true,
          width: '100px',
          filterType: 'bool',
          columnType: 'checkbox',
          align: 'center',
          threeStateCheckbox: false,
          cellClassName: function (row, dataField, value, rowData) {
            if (value === true) {
              return 'schedule-slot-selected';
            }
          }
        });
      }

      this.gridColumns = gridColumns;
    }

    return this.gridColumns;

  };

  component.getGridDataFields = function () {

    if (!this.gridDataFields) {
      var getGridDataFields = [{
        name: 'date',
        type: 'string'
      }];

      for (var i = 1; i <= 9; i++) {
        getGridDataFields.push({
          name: 'slot' + i,
          type: 'bool'
        });
      }

      this.gridDataFields = getGridDataFields;
    }

    return this.gridDataFields;
  }

  component.initComponent = function (element, options) {
    var formElement = this.element.closest('.form');

    formElement.on('visible', this.proxy(this.initGrid));
  }

  component.initGrid = function () {

    // check for init grid only once
    if (this.isGridInitialized) {
      return;
    } else {
      this.isGridInitialized = true;
    }

    var source = this.generateSource();

    this.element.jqxGrid({
      source: source,
      columns: this.getGridColumns(),

      pageable: false,
      sortable: false,
      filterable: true,
      showFilterRow: true,
      editable: false,

      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical'
    });

    this.element.jqxGrid('removesort');

    this.element.on('cellClick', this.proxy(this.processDataChange));

  };

  component.refreshData = function (startDate, endDate, originalData) {

    if (originalData) {
      this.originalData = originalData;
    }

    var source = this.generateSource(startDate, endDate, this.originalData);

    this.element.jqxGrid({
      source: source
    });

  }

  component.generateSource = function (startDate, endDate, originalData) {

    var ConvertUtil = require('core.util.ConvertUtil');

    // reset schedule data
    this.scheduleData = {};
    this.scheduleIds = {};

    originalData = originalData || [];

    for (var i = 0, len = originalData.length; i < len; i++) {
      var schedule = originalData[i];

      if (!this.scheduleData[schedule.date]) {
        this.scheduleData[schedule.date] = {};
        this.scheduleIds[schedule.date] = {};
      }

      this.scheduleData[schedule.date]['slot' + schedule.slot] = 'UNCHANGED';
      this.scheduleIds[schedule.date]['slot' + schedule.slot] = schedule.scheduleId;
    }

    var sourceData = [];

    // generate source data
    if (startDate && endDate && ConvertUtil.DateTime.compare(startDate, endDate) <= 0) {

      var Moment = require('lib.Moment');

      while (ConvertUtil.DateTime.compare(startDate, endDate) <= 0) {
        var dayOfWeek = ConvertUtil.DateTime.convertDateToDayOfWeek(startDate);

        var item = {
          date: dayOfWeek
        };

        for (var j = 1; j <= 9; j++) {
          var selected = !!(this.scheduleData[startDate] && this.scheduleData[startDate]['slot' + j]);

          item['slot' + j] = selected;
        }

        sourceData.push(item);

        startDate = ConvertUtil.DateTime.addDays(startDate, 1);
      }

    }

    // build source
    var source = {
      dataType: 'local',
      localData: sourceData,
      dataFields: this.getGridDataFields(),

      updaterow: function (rowid, rowdata, commit) {
        commit(true);
      }
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  component.setEditable = function (editable) {
    this.isGridEditable = editable;
  };

  component.processDataChange = function (event) {

    var ConvertUtil = require('core.util.ConvertUtil');

    if (!this.isGridEditable || !event || !event.args || event.args.datafield == 'date') return;

    var args = event.args;

    var dateCell = this.element.jqxGrid('getcell', args.rowindex, 'date');

    var date = dateCell.value;
    date = ConvertUtil.DateTime.convertDayOfWeekToDate(date);

    var slot = args.datafield;

    var value = args.value;

    if (value) {
      // current value is TRUE -> to be unchecked

      switch (this.scheduleData[date][slot]) {
      case 'ADDED':
        this.scheduleData[date][slot] = 'DEATCHED';
        break;
      case 'UNCHANGED':
        this.scheduleData[date][slot] = 'DELETED';
        break;
      }
    } else {
      // current value is FALSE -> to be checked

      if (!this.scheduleData[date]) {
        this.scheduleData[date] = {};
      }

      if (!this.scheduleData[date][slot]) {
        this.scheduleData[date][slot] = 'ADDED';
      } else {
        switch (this.scheduleData[date][slot]) {
        case 'DELETED':
          this.scheduleData[date][slot] = 'UNCHANGED';
          break;
        case 'DEATCHED':
          this.scheduleData[date][slot] = 'ADDED';
          break;
        }
      }
    }

    this.element.jqxGrid('setCellValue', args.rowindex, args.datafield, !args.value);

  };

  component.getScheduleData = function () {

    var scheduleData = {
      addedItems: [],
      removedItems: []
    };

    var scheduleIds = this.scheduleIds;

    Util.Collection.each(this.scheduleData, function (slots, date) {
      Util.Collection.each(slots, function (status, slot) {

        // convert slot from name to slot number
        var slotNumber = +slot.slice(-1);

        if (status == 'ADDED') {
          scheduleData.addedItems.push({
            date: date,
            slot: slotNumber
          });
        } else if (status == 'DELETED') {
          scheduleData.removedItems.push({
            scheduleId: scheduleIds[date][slot],
            date: date,
            slot: slotNumber
          });
        }

      });
    });

    return scheduleData;

  };

});



define.component('component.common.Input', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var isPasswordInput = componentAttributes.passwordInput;

    componentAttributes = Util.Object.omit(componentAttributes, ['passwordInput']);

    var input = jQuery('<input />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'input')
      .appendTo(element.parent());

    element.remove();

    if (!componentData.attr('componentElements')) componentData.attr('componentElements', {});
    componentData.attr('componentElements.' + dataAttribute, input);

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var inputOptions = {
      width: '100%',
      height: '30px'
    };

    inputOptions = Util.Object.extend(inputOptions, componentAttributes);

    if (isPasswordInput) {
      input.attr('type', 'password');

      input.jqxInput(inputOptions);
    } else {
      input.jqxInput(inputOptions);
    }

    var trackingChange = {
      input: false,
      data: false
    };

    // tracking changes of input
    input.on('change', function () {
      if (trackingChange.data) return;

      trackingChange.input = true;
      componentData.attr(dataAttribute, input.val().trim());
      trackingChange.input = false;
    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {
      if (trackingChange.input) return;

      if (attr == dataAttribute) {
        trackingChange.data = true;
        input.val(newVal);
        trackingChange.data = false;
      }
    });

  };

});



define.component('component.Cpanel', function (component, require, Util, Lang, jQuery) {

  var Route = require('core.route.Route');
  var Util = require('core.util.Util');
  var jQuery = require('lib.jQuery');

  var MsgBox = require('component.common.MsgBox');

  // cpanel template
  component.tmpl = 'cpanel';

  component.initData = function () {
    var Role = require('enum.Role');

    if (Role.isAdministrator(this.authentication.accountRole)) {
      // get profile for administrator

      var profile = {
        displayName: Lang.get('administrator')
      };

      this.data.attr({
        profile: profile
      });
    } else {
      // get profile for other roles

      var ProfileProxy = require('proxy.Profile');
      ProfileProxy.getSimpleProfile({}, this.proxy(getSimpleProfileDone));
    }

    this.data.attr({
      user: {
        username: 'TrongND'
      }
    });

    function getSimpleProfileDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var profile = serviceResponse.getData();
      profile.displayName = Lang.get('displayName', {
        firstName: profile.firstName,
        lastName: profile.lastName
      });

      this.data.attr({
        profile: profile
      });
    }
  };

  component.initView = function (view) {
    this.element.html(view);
  };

  component.ready = function () {
    this.static.cpanelElement = this.element;
    this.static.formContainer = this.element.find('#forms');
    this.static.bindRoute();

    this.element.find('#expander').click(toggleNavigator);
    this.element.find('#expander #navigator li').click(function () {
      var elm = jQuery(this);
      elm.parent().parent().parent().find('#location').text(elm.text());
    });

    jQuery(document).mousedown(function (event) {
      var elm = jQuery(event.target);

      if (elm.closest('#expander').size() == 0 && jQuery('#expander').hasClass('active')) {
        toggleNavigator();
      }
    });

    function toggleNavigator() {
      var elm = jQuery('#expander');
      elm.find('#navigator').slideToggle(100);
      elm.toggleClass('active');
    }

    Route.ready();
    this.static.mapRoute();
  };

  component.static.formUrlMaps = [];

  component.static.addFormUrlMap = function (urlMap) {
    this.static.formUrlMaps.push(urlMap);
  };

  component.static.bindRoute = function () {
    Route.onChange = this.proxy(this.static.mapRoute);
  };

  component.static.mapRoute = function () {
    var formUrlMaps = this.static.formUrlMaps;

    for (var i = 0, len = formUrlMaps.length; i < len; i++) {
      var formUrlMap = formUrlMaps[i];

      if (Route.attr('route') == formUrlMap.url) {
        var isMatched = true;

        if (formUrlMap.data) {
          var keys = Util.Object.keys(formUrlMap.data);

          for (var j = 0, lenKeys = keys.length; j < lenKeys; j++) {
            var key = keys[j];

            if (formUrlMap.data[key] != Route.attr(key)) {
              isMatched = false;
              break;
            }
          }
        }

        if (isMatched) {
          this.static.switchForm(formUrlMap.formId);
          this.static.updateNavigator();

          return;
        }
      }
    }

    var Role = require('enum.Role');

    Route.removeAttr('action');
    Route.removeAttr('id');

    if (Role.isStudentOrParent(component.authentication.accountRole)) {
      Route.attr({
        module: 'notification'
      });
    } else {
      Route.attr({
        module: 'news'
      });
    }
  };

  component.static.switchForm = function (formId) {

    var activeFormId = this.static.activeFormId;

    if (!formId || activeFormId == formId) return;

    this.static.activeFormId = formId;

    var Form = require(formId);

    var activeForm;
    var activeFormParams;
    var skipRefresh = false;

    if (activeFormId) {
      var ActiveForm = require(activeFormId);
      var activeForm = ActiveForm.formInstance;

      activeFormParams = activeForm.formParams;
      skipRefresh = activeForm.skipRefresh;
    }

    if (!Form.isDialog && activeForm) {
      activeForm.hideForm();
    }

    var formParams = Route.attr();

    Util.Object.extend(formParams, activeFormParams);

    if (!Form.formInstance) {
      // this form is auto displayed when created
      Form.formInstance = new Form(this.static.formContainer, {
        formParams: formParams
      });

      //      Form.newInstance(this.static.formContainer, {
      //        on: {
      //          ready: function () {
      //            this.showForm(formData);
      //          }
      //        }
      //      });
    } else {
      Form.formInstance.showForm(formParams, skipRefresh);
    }
  };

  component.static.updateNavigator = function () {
    var module = Route.attr('module');
    var moduleName = '';

    this.static.cpanelElement.find('#navigator a').each(function () {
      var a = jQuery(this);

      if (a.attr('href') && a.attr('href').substr(2, module.length) == module) {
        moduleName = a.text();
        return false;
      }
    });

    this.static.cpanelElement.find('#location').text(moduleName);
  };

  component.logout = function () {
    var AuthenticationProxy = require('proxy.Authentication');

    AuthenticationProxy.logout({}, this.proxy(logoutDone));

    function logoutDone(serviceResponse) {
      //if (serviceResponse.hasError()) return;

      jQuery.removeCookie('accessToken');

      window.location.href = window.location.origin;
    }
  };

  component.events['#button-logout click'] = function (element, event) {
    MsgBox.confirm(Lang.get('authentication.logout.confirm'), this.proxy(this.logout));
  };

});



define.component('component.Login', function (component, require, Util, Lang, jQuery) {

  component.tmpl = 'login';

  component.initView = function (view) {
    this.element.html(view);
  };

  component.login = function () {
    var loginData = Util.Object.pick(this.data.attr(), ['username', 'password', 'role', 'remember']);
    var remember = loginData.remember;

    var AuthenticationProxy = require('proxy.Authentication');

    jQuery.removeCookie('accessToken');

    AuthenticationProxy.login(loginData, this.proxy(loginDone));

    function loginDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var loginData = serviceResponse.getData();
      var accessToken = loginData.accessToken;

      if (remember) {
        jQuery.cookie('accessToken', accessToken, {
          expires: 7
        });
      } else {
        jQuery.cookie('accessToken', accessToken);
      }

      window.location.href = window.location.origin;
    }
  }

  component.events['#button-login click'] = function (element, event) {
    this.login();
  }

});



/*
 * System          : 3connected
 * Component       : Edit account component
 * Creator         : ThanhVM
 */
define.form('component.dialog.manage-account.EditAccount', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-account/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-account',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-account.edit-account';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Account');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Account');
});



/*
 * System          : 3connected
 * Component       : List account component
 * Creator         : UayLU
 * Created date    : 2014/07/1
 */
define.form('component.form.manage-account.ListAccount', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-batch
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-account'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-account.list-account';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Account');

  // the config used for exporting grid data
  form.exportConfig = require('export.Account');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('account.accountId'),
      dataField: 'accountId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('account.username'),
      dataField: 'username',
    }, {
      text: Lang.get('account.role'),
      dataField: 'role',
    }, {
      text: Lang.get('account.userInformationId'),
      dataField: 'userInformationId',
    }, {
      text: Lang.get('account.isActive'),
      dataField: 'isActive',
    }, {
      text: Lang.get('account.expiredDate'),
      dataField: 'expiredDate',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define.form('component.dialog.manage-account.ResetPassword', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-account',
      action: 'reset-password'
    }
  };

  form.tmpl = 'dialog.manage-account.reset-password';

  form.formType = form.FormType.Dialog.VALIDATION;

  form.initData = function (params) {
    this.data.attr({
      accountId: params.id
    });
  };

  form.submitDialogData = function (entity) {
    var AccountProxy = require('proxy.Account');

    var data = Util.Object.pick(this.data.attr(), ['accountId', 'password']);

    AccountProxy.resetPassword(data, this.proxy(resetPasswordDone));

    function resetPasswordDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.hideForm();
    }
  }

  // the validation rules used by form
  form.validateRules = require('validator.rule.Account').resetPassword;
});



define.form('component.dialog.manage-batch.CreateBatch', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-batch/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-batch',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-batch.create-batch';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Batch');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Batch');
});



define.form('component.dialog.manage-batch.EditBatch', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-batch/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-batch',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-batch.edit-batch';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Batch');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Batch');
});



define.form('component.form.manage-batch.ListBatch', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-batch
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-batch'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-batch.list-batch';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Batch');

  // the config used for exporting grid data
  form.exportConfig = require('export.Batch');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('batch.batchId'),
      dataField: 'batchId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('batch.batchName'),
      dataField: 'batchName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define.form('component.form.manage-class.ClassStudent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-class
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-class',
      action: 'class-student'
    }
  };

  form.gridConfig = function () {

    // grid students
    var gridStudentsColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        width: '80px'
      }, {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '100px'
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName'
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName'
      },
      {
        text: Lang.get('student.className'),
        dataField: 'className',

        width: '120px'
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '120px'
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName'
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender'
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth'
      }
    ];

    // grid class students
    var gridClassStudentsColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        width: '80px'
      }, {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '100px'
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName'
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName'
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '120px'
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName'
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender'
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth'
      }
    ];

    var gridConfig = {
      gridStudents: {
        columns: gridStudentsColumns
      },
      gridClassStudents: {
        columns: gridClassStudentsColumns
      }
    };

    return gridConfig;

  };

  // the template that used by the form
  form.tmpl = 'form.manage-class.class-student';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {
    var splitter = this.element.find('#splitter');

    splitter.jqxSplitter({
      width: '100%',
      height: '100%'
    });

    var gridStudentsConfig = this.getGridConfig().gridStudents;
    var gridClassStudentsConfig = this.getGridConfig().gridClassStudents;

    var StudentProxy = require('proxy.Student');

    var GridComponent = require('component.common.Grid');

    this.gridStudents = new GridComponent(this.element.find('#grid-students'), {
      ServiceProxy: StudentProxy,
      grid: gridStudentsConfig
    });

    this.gridClassStudents = new GridComponent(this.element.find('#grid-class-students'), {
      ServiceProxy: StudentProxy,
      grid: gridClassStudentsConfig
    });

    // handle click for Add Students button
    this.element.find('#button-add-students').click(this.proxy(function () {
      var MsgBox = require('component.common.MsgBox');

      var studentIds = this.gridStudents.getSelectedIds();

      MsgBox.confirm(Lang.get('class.addStudents.confirm', {
        'totalItems': studentIds.length
      }), this.proxy(doAddStudents));
    }));

    // handle click for Remove Students button
    this.element.find('#button-remove-students').click(this.proxy(function () {
      var MsgBox = require('component.common.MsgBox');

      var studentIds = this.gridClassStudents.getSelectedIds();

      MsgBox.confirm(Lang.get('class.removeStudents.confirm', {
        'totalItems': studentIds.length
      }), this.proxy(doRemoveStudents));
    }));

    // handle click for Change direction button
    this.element.find('#button-change-orientation').click(this.proxy(toggleSplitterOrientation));

    toggleSplitterOrientation();

    function doAddStudents() {
      var studentIds = this.gridStudents.getSelectedIds();

      if (!studentIds.length) return;

      var classId = this.data.attr('classId');

      var data = {
        classId: classId,
        studentIds: studentIds
      };

      var ClassProxy = require('proxy.Class');

      ClassProxy.addStudents(data, this.proxy(refreshGridData));
    }

    function doRemoveStudents() {
      var studentIds = this.gridClassStudents.getSelectedIds();

      if (!studentIds.length) return;

      var classId = this.data.attr('classId');

      var data = {
        classId: classId,
        studentIds: studentIds
      };

      var ClassProxy = require('proxy.Class');

      ClassProxy.removeStudents(data, this.proxy(refreshGridData));
    }

    function refreshGridData() {
      this.gridStudents.refreshData();
      this.gridClassStudents.refreshData();
    }

    function toggleSplitterOrientation() {

      var orientation = splitter.jqxSplitter('orientation');

      if (orientation == 'vertical') {
        splitter.jqxSplitter({
          orientation: 'horizontal',
          panels: [{
            size: '50%'
          }, {
            size: '50%'
          }]
        });
      } else {
        splitter.jqxSplitter({
          orientation: 'vertical',
          panels: [{
            size: '60%'
          }, {
            size: '40%'
          }]
        });
      }

      $(window).trigger('resize');

    }

  };

  form.refreshData = function (data) {
    var classId = data.id;

    var ClassProxy = require('proxy.Class');

    ClassProxy.findOne({
      classId: classId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var classInfo = serviceResponse.getData();

      this.data.attr(classInfo);

      this.gridStudents.setExcludeConditions('classId', classInfo.classId);
      this.gridClassStudents.setFilterConditions('classId', classInfo.classId);
    }
  }

});



define.form('component.dialog.manage-class.CreateClass', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-class/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-class',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-class.create-class';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Class');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Class');

  // init form data
  form.initData = function () {

    var componentSettings = {
      batchId: {
        ServiceProxy: require('proxy.Batch'),
        combobox: {
          valueMember: 'batchId',
          displayMember: 'batchName'
        }
      },
      majorId: {
        ServiceProxy: require('proxy.Major'),
        combobox: {
          valueMember: 'majorId',
          displayMember: 'majorName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});



/*
 * System          : 3connected
 * Component       : Edit class component
 * Creator         : UayLU
 * Created date    : 2014/06/15
 */
define.form('component.dialog.manage-class.EditClass', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-class/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-class',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-class.edit-class';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Class');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Class');

  // init form data
  form.initData = function () {

    var componentSettings = {
      batchId: {
        ServiceProxy: require('proxy.Batch'),
        combobox: {
          valueMember: 'batchId',
          displayMember: 'batchName'
        }
      },
      majorId: {
        ServiceProxy: require('proxy.Major'),
        combobox: {
          valueMember: 'majorId',
          displayMember: 'majorName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});



define.form('component.form.manage-class.ListClass', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-class
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-class'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-class.list-class';

  // the form type is Form.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Class');

  // the config used for exporting grid data
  form.exportConfig = require('export.Class');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('class.classId'),
        dataField: 'classId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 150,
        hidden: false
      },
      {
        text: Lang.get('class.className'),
        dataField: 'className',
      },
      {
        text: Lang.get('class.batchName'),
        dataField: 'batchName',
      },
      {
        text: Lang.get('major.majorName'),
        dataField: 'majorName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



/*
 * System          : 3connected
 * Component       : Statistic attendance component
 * Creator         : UayLU
 * Created date    : 2014/07/26
 */
define.form('component.form.manage-course.CourseAttendanceStatistic', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'attendance-statistic'
    }
  };

  form.ServiceProxy = {
    proxy: require('proxy.Attendance'),
    method: 'statisticCourseAttendance'
  };

  form.tmpl = 'form.manage-course.course-attendance-statistic';

  form.formType = form.FormType.Form.LIST;

  // the config used for exporting grid data
  form.exportConfig = require('export.AttendanceStatistic');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 100,
        hidden: false
      }, {
        text: Lang.get('student.firstName'),
        dataField: 'firstName',
      }, {
        text: Lang.get('student.lastName'),
        dataField: 'lastName',
      }, {
        text: Lang.get('student.totalAbsent'),
        dataField: 'totalAbsent',
      }, {
        text: Lang.get('student.totalPresent'),
        dataField: 'totalPresent',
      }, {
        text: Lang.get('student.totalSlots'),
        dataField: 'totalSlots',
      }, {
        text: Lang.get('student.percentAbsent'),
        dataField: 'percentAbsent'
      }
      ];

    var gridConfig = {
      columns: gridColumns,
      singleSelection: true,
      filterable: false,
      sortable: false,
      pageable: false,
    };

    return gridConfig;

  };


  form.refreshData = function (data) {
    var courseId = data.id;

    this.grid.setFilterConditions('courseId', courseId);

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr({
        course: course
      });
    }
  }

});



define.form('component.form.manage-course.CourseAttendance', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/attendance/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'attendance'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-course.course-attendance';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  // the config used for exporting grid data
  form.exportConfig = require('export.Attendance');

  form.initData = function () {

    var componentSettings = {
      scheduleId: {
        localDataAttribute: 'schedules',
        combobox: {
          valueMember: 'scheduleId',
          displayMember: 'dateSlot'
        }
      }
    };

    this.data.attr({
      componentSettings: componentSettings
    });

  };

  form.initForm = function () {
    var AttendanceGridComponent = require('component.common.AttendanceGrid');

    this.gridAttendance = new AttendanceGridComponent(this.element.find('#grid-course-attendance'));

    // bind event handlers to elements
    this.element.find('#button-view-attendance').click(this.proxy(this.viewAttendance));
    this.element.find('#button-update-attendance').click(this.proxy(this.updateAttendance));

    this.element.find('#button-reject-changes').click(this.proxy(this.switchToViewMode));
    this.element.find('#button-edit-attendance').click(this.proxy(this.switchToEditMode));

    this.element.find('#button-all-present').click(this.proxy(this.presentAll));
    this.element.find('#button-all-absent').click(this.proxy(this.absentAll));
    this.element.find('#button-notify-attendance').click(this.proxy(this.notifyAttendance));
  };

  form.notifyAttendance = function () {
    var NotificationProxy = require('proxy.Notification');
    var MsgBox = require('component.common.MsgBox');

    MsgBox.confirm(Lang.get('notification.confirm.attendance'), this.proxy(doNotifyAttendance));

    function doNotifyAttendance() {
      NotificationProxy.notifyAttendance({
        courseId: this.courseId
      }, function (serviceResponse) {
        if (serviceResponse.hasError()) return;
      });
    }
  };

  form.refreshData = function (data) {
    this.courseId = data.id;

    this.data.attr('scheduleId', null);
    this.switchToDisableMode();

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: this.courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var ConvertUtil = require('core.util.ConvertUtil');

      var course = serviceResponse.getData();

      var schedules = [];

      for (var i = 0, len = course.schedules.length; i < course.schedules.length; i++) {
        var schedule = course.schedules[i];

        schedules.push({
          scheduleId: schedule.scheduleId,
          dateSlot: Lang.get('attendance.dateSlot', {
            date: schedule.date,
            slot: schedule.slot
          })
        });
      }

      this.data.attr({
        course: course,
        schedules: null
      });

      this.data.attr({
        schedules: schedules
      });
    }

  };

  form.viewAttendance = function () {
    if (!this.data.attr('scheduleId')) return;

    this.switchToViewMode();
  };

  form.presentAll = function () {
    this.gridAttendance.presentAll();
  };

  form.absentAll = function () {
    this.gridAttendance.absentAll();
  };

  form.refreshAttendance = function () {

    this.scheduleId = this.data.attr('scheduleId');

    if (!this.scheduleId) return;

    var AttendanceProxy = require('proxy.Attendance');

    var data = {
      courseId: this.courseId,
      scheduleId: this.scheduleId,
    };

    AttendanceProxy.getCourseAttendance(data, this.proxy(getCourseAttendanceDone));

    function getCourseAttendanceDone(serviceResponse) {

      if (serviceResponse.hasError()) {
        this.gridAttendance.refreshData();
        return;
      }

      var attendanceData = serviceResponse.getData();

      if (attendanceData.isLocked) {
        if (this.isGridMode !== 'DISABLED') {
          this.switchToDisableMode();
        }
      } else if (attendanceData.attendances && attendanceData.attendances.length) {
        if (this.isGridMode !== 'READONLY' && this.isGridMode !== 'EDITABLE') {
          this.switchToViewMode();
        }
      } else {
        if (this.isGridMode !== 'EDITABLE') {
          this.switchToEditMode();
        }
      }

      this.gridAttendance.refreshData(attendanceData);

    }

  };

  form.updateAttendance = function () {

    var scheduleId = this.scheduleId;
    var attendanceData = this.gridAttendance.getAttendanceData();

    if (!attendanceData.length) return;

    var AttendanceProxy = require('proxy.Attendance');

    var data = {
      scheduleId: scheduleId,
      attendanceData: attendanceData
    };

    AttendanceProxy.updateCourseAttendance(data, this.proxy(updateCourseAttendanceDone));

    function updateCourseAttendanceDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.refreshAttendance();
    }
  };

  form.switchToDisableMode = function () {
    this.isGridMode = 'DISABLED';

    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').hide();

    // disable grid editable
    this.gridAttendance.setEditable(false);
    this.gridAttendance.refreshData();
  }

  form.switchToViewMode = function () {
    this.isGridMode = 'READONLY';

    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridAttendance.setEditable(false);

    this.refreshAttendance();
  };

  form.switchToEditMode = function () {
    this.isGridMode = 'EDITABLE';

    // hide all edit component
    this.element.find('[data-component-group=view]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=edit]').show();

    // enable grid editable
    this.gridAttendance.setEditable(true);

    this.refreshAttendance();
  };

});



/*
 * System          : 3connected
 * Component       : Input grade component
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
define.form('component.form.manage-course.CourseGrade', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/grade/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'grade'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-course.course-grade';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {
    var GradeGridComponent = require('component.common.GradeGrid');

    this.gridGrade = new GradeGridComponent(this.element.find('#grid-course-grade'));

    // bind event handlers to elements
    this.element.find('#button-update-grade').click(this.proxy(this.updateGrade));

    this.element.find('#button-reject-changes').click(this.proxy(this.rejectChanges));
    this.element.find('#button-edit-grade').click(this.proxy(this.editGrade));

    this.element.find('#button-notify-grade').click(this.proxy(this.notifyGrade));
  };

  form.notifyGrade = function () {
    var NotificationProxy = require('proxy.Notification');
    var MsgBox = require('component.common.MsgBox');

    MsgBox.confirm(Lang.get('notification.confirm.grade'), this.proxy(doNotifyGrade));

    function doNotifyGrade() {
      NotificationProxy.notifyGrade({
        courseId: this.courseId
      }, function (serviceResponse) {
        if (serviceResponse.hasError()) return;
      });
    }
  };

  form.refreshData = function (data) {
    this.courseId = data.id;

    this.switchToLockedMode();

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: this.courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr({
        course: course
      });

      this.refreshGrade();
    }

  };

  form.refreshGrade = function () {

    if (!this.courseId) return;

    var GradeProxy = require('proxy.Grade');

    var data = {
      courseId: this.courseId
    };

    GradeProxy.getCourseGrade(data, this.proxy(getCourseGradeDone));

    function getCourseGradeDone(serviceResponse) {

      if (serviceResponse.hasError()) {
        this.gridGrade.refreshData();
        return;
      }

      var gradeData = serviceResponse.getData();

      if (!gradeData.gradeCategories || !gradeData.gradeCategories.length) {
        this.data.attr('noGradeCategories', true);
        gradeData.isLocked = true;
      } else {
        this.data.attr('noGradeCategories', false);
      }

      if (gradeData.isLocked) {
        this.switchToLockedMode();
      } else if (gradeData.grades && gradeData.grades.length) {
        this.switchToViewMode();
      } else {
        this.switchToEditMode();
      }

      this.gridGrade.refreshData(gradeData);

    }

  };

  form.updateGrade = function () {

    var courseId = this.courseId;
    var gradeData = this.gridGrade.getGradeData();

    if (!gradeData.length) return;

    var GradeProxy = require('proxy.Grade');

    var data = {
      courseId: courseId,
      gradeData: gradeData
    };

    GradeProxy.updateCourseGrade(data, this.proxy(updateCourseGradeDone));

    function updateCourseGradeDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.refreshGrade();
    }
  };

  form.editGrade = function () {
    this.switchToEditMode();
  };

  form.rejectChanges = function () {
    this.switchToViewMode();
    this.refreshGrade();
  };

  form.switchToLockedMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // hide all view toolbar component
    this.element.find('[data-component-group=view]').hide();

    // disable grid editable
    this.gridGrade.setEditable(false);
  };

  form.switchToViewMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridGrade.setEditable(false);
  };

  form.switchToEditMode = function () {
    // hide all edit component
    this.element.find('[data-component-group=view]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=edit]').show();

    // enable grid editable
    this.gridGrade.setEditable(true);
  };

});



define.form('component.form.manage-course.CourseSchedule', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/schedule/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'schedule'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-course.course-schedule';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {

    var ScheduleGridComponent = require('component.common.ScheduleGrid');

    this.gridSchedule = new ScheduleGridComponent(this.element.find('#grid-course-schedule'));

    // bind event handlers to elements
    this.element.find('#button-view-schedule').click(this.proxy(this.viewSchedule));
    this.element.find('#button-refresh-schedule').click(this.proxy(this.refreshSchedule));
    this.element.find('#button-update-schedule').click(this.proxy(this.updateSchedule));

    this.element.find('#button-reject-changes').click(this.proxy(this.switchToViewMode));
    this.element.find('#button-edit-schedule').click(this.proxy(this.switchToEditMode));

  };

  form.refreshData = function (data) {

    this.courseId = data.id;

    this.switchToViewMode();

  };

  form.viewSchedule = function () {
    var ConvertUtil = require('core.util.ConvertUtil');

    var startDate = this.data.attr('schedule.startDate');
    var endDate = this.data.attr('schedule.endDate');

    this.gridSchedule.refreshData(startDate, endDate);
  };

  form.updateSchedule = function () {
    var scheduleData = this.gridSchedule.getScheduleData();

    // check if data has been changed
    if (!scheduleData.addedItems.length && !scheduleData.removedItems.length) return;

    // set courseId of the schedule
    scheduleData.courseId = this.data.attr('course.courseId');

    var CourseProxy = require('proxy.Course');

    CourseProxy.updateSchedule(scheduleData, this.proxy(updateScheduleDone));

    function updateScheduleDone(serviceResponse) {
      if (!serviceResponse.hasError()) {
        this.refreshSchedule();
      }
    }
  };

  form.refreshSchedule = function () {
    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: this.courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var ConvertUtil = require('core.util.ConvertUtil');

      var course = serviceResponse.getData();

      this.data.attr({
        // course info
        course: course,
        // schedule
        schedule: {
          startDate: null,
          endDate: null
        }
      });

      var schedules = course.schedules;

      if (schedules && schedules.length) {
        // find start date and end date of the schedule

        var startDate = Util.Collection.min(schedules, function (schedule) {
          var date = ConvertUtil.DateTime.parseDate(schedule.date);
          return date;
        });
        startDate = startDate.date;

        var endDate = Util.Collection.max(schedules, function (schedule) {
          var date = ConvertUtil.DateTime.parseDate(schedule.date);
          return date;
        });
        endDate = endDate.date;

        this.data.attr({
          schedule: {
            startDate: startDate,
            endDate: endDate
          }
        });

        this.gridSchedule.refreshData(startDate, endDate, schedules);

      } else {
        this.gridSchedule.refreshData();
      }
    }

  };

  form.switchToViewMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridSchedule.setEditable(false);

    this.refreshSchedule();
  };

  form.switchToEditMode = function () {
    // hide all edit component
    this.element.find('[data-component-group=view]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=edit]').show();

    // enable grid editable
    this.gridSchedule.setEditable(true);
  };

});



/*
 * System          : 3connected
 * Component       : Grade category versions component
 * Creator         : UayLU + ThanhVM
 * Created date    : 2014/18/06
 */

define.form('component.form.manage-course.CourseStudent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/course-student/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'course-student'
    }
  };

  form.exportConfig = require('export.Student');

  form.gridConfig = function () {

    // grid students
    var gridStudentsColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        width: '80px'
      }, {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '100px'
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName'
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName'
      },
      {
        text: Lang.get('student.className'),
        dataField: 'className',

        width: '120px'
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '120px'
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName',

        width: '200px'
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender'
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth'
      }
    ];

    // grid class students
    var gridCourseStudentsColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        width: '80px'
      }, {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '100px'
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName'
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName'
      },
      {
        text: Lang.get('student.className'),
        dataField: 'className',

        width: '120px'
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '120px'
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName',

        width: '200px'
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender'
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth'
      }
    ];

    var gridConfig = {
      gridStudents: {
        columns: gridStudentsColumns
      },
      gridCourseStudents: {
        columns: gridCourseStudentsColumns
      }
    };

    return gridConfig;

  };

  // the template that used by the form
  form.tmpl = 'form.manage-course.course-student';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {
    var splitter = this.element.find('#splitter');

    splitter.jqxSplitter({
      width: '100%',
      height: '100%'
    });

    var gridStudentsConfig = this.getGridConfig().gridStudents;
    var gridCourseStudentsConfig = this.getGridConfig().gridCourseStudents;

    var StudentProxy = require('proxy.Student');
    var CourseStudentProxy = require('proxy.CourseStudent');

    var GridComponent = require('component.common.Grid');

    this.gridStudents = new GridComponent(this.element.find('#grid-students'), {
      ServiceProxy: StudentProxy,
      grid: gridStudentsConfig
    });

    this.gridCourseStudents = new GridComponent(this.element.find('#grid-course-students'), {
      ServiceProxy: CourseStudentProxy,
      grid: gridCourseStudentsConfig
    });

    // handle click for Add Students button
    this.element.find('#button-add-students').click(this.proxy(function () {
      var MsgBox = require('component.common.MsgBox');

      var studentIds = this.gridStudents.getSelectedIds();

      MsgBox.confirm(Lang.get('course.addStudents.confirm', {
        'totalItems': studentIds.length
      }), this.proxy(doAddStudents));
    }));

    // handle click for Remove Students button
    this.element.find('#button-remove-students').click(this.proxy(function () {
      var MsgBox = require('component.common.MsgBox');

      var studentIds = this.gridCourseStudents.getSelectedIds();

      MsgBox.confirm(Lang.get('course.removeStudents.confirm', {
        'totalItems': studentIds.length
      }), this.proxy(doRemoveStudents));
    }));

    // handle click for Change direction button
    this.element.find('#button-change-orientation').click(this.proxy(toggleSplitterOrientation));
    // handle window resize
    jQuery(window).resize(this.proxy(this.refreshGridSize));

    toggleSplitterOrientation.apply(this);

    function doAddStudents() {
      var studentIds = this.gridStudents.getSelectedIds();

      if (!studentIds.length) return;

      var courseId = this.data.attr('courseId');

      var CourseStudentProxy = require('proxy.CourseStudent');

      var data = {
        courseId: courseId,
        studentIds: studentIds
      };

      CourseStudentProxy.addStudents(data, this.proxy(refreshGridData));

    }

    function doRemoveStudents() {
      var courseStudentIds = this.gridCourseStudents.getSelectedIds();

      if (!courseStudentIds.length) return;

      var courseId = this.data.attr('courseId');
      var CourseStudentProxy = require('proxy.CourseStudent');

      var data = {
        courseStudentIds: courseStudentIds
      };

      CourseStudentProxy.removeStudents(data, this.proxy(refreshGridData));
    }

    function refreshGridData() {
      this.gridStudents.refreshData();
      this.gridCourseStudents.refreshData();
    }

    function toggleSplitterOrientation() {

      var orientation = splitter.jqxSplitter('orientation');

      if (orientation == 'vertical') {
        splitter.jqxSplitter({
          orientation: 'horizontal',
          panels: [{
            size: '50%'
          }, {
            size: '50%'
          }]
        });
      } else {
        splitter.jqxSplitter({
          orientation: 'vertical',
          panels: [{
            size: '60%'
          }, {
            size: '40%'
          }]
        });
      }

      // $(window).trigger('resize');

      this.refreshGridSize();
    }

  };

  form.refreshGridSize = function () {
    this.gridStudents.refreshSize();
    this.gridCourseStudents.refreshSize();
  };

  form.refreshData = function (data) {
    var courseId = data.id;

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var courseInfo = serviceResponse.getData();

      this.data.attr(courseInfo);

      //this.gridStudents.setExcludeConditions('classId', classInfo.classId);
      this.gridCourseStudents.setFilterConditions('courseId', courseInfo.courseId);
    }
  }

});



define.form('component.dialog.manage-course.CreateCourse', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-course',
      action: 'create'
    }
  };

  form.initData = function () {

    var componentSettings = {
      lectureId: {
        ServiceProxy: require('proxy.Staff'),
        combobox: {
          valueMember: 'staffId',
          displayMember: 'staffCode'
        }
      },
      majorId: {
        ServiceProxy: require('proxy.Major'),
        combobox: {
          valueMember: 'majorId',
          displayMember: 'majorName'
        }
      },
      termId: {
        ServiceProxy: require('proxy.Term'),
        combobox: {
          valueMember: 'termId',
          displayMember: 'termName'
        }
      },
      classId: {
        ServiceProxy: require('proxy.Class'),
        combobox: {
          valueMember: 'classId',
          displayMember: 'className'
        }
      },
      subjectId: {
        ServiceProxy: require('proxy.Subject'),
        combobox: {
          valueMember: 'subjectId',
          displayMember: 'subjectName'
        },
        skipDataSubmission: true
      },
      subjectVersionId: {
        ServiceProxy: require('proxy.SubjectVersion'),
        combobox: {
          valueMember: 'subjectVersionId',
          displayMember: 'description'
        },
        filterByAttributes: ['subjectId']
      } //,
      //      lectureId: {
      //        ServiceProxy: require('proxy.Lecture'),
      //        combobox: {
      //          valueMember: 'lectureId',
      //          displayMember: 'lectureName'
      //        }
      //      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);

  }

  // the template that used by the form
  form.tmpl = 'dialog.manage-course.create-course';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Course');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Course');
});



define.form('component.dialog.manage-course.EditCourse', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'edit'
    }
  };

  form.ServiceProxy = require('proxy.Course');

  form.formType = form.FormType.Dialog.EDIT;

  form.tmpl = 'dialog.manage-course.edit-course';

  form.validateRules = require('validator.rule.Course');

  form.initData = function () {
    var componentSettings = {
      lectureId: {
        ServiceProxy: require('proxy.Staff'),
        combobox: {
          valueMember: 'staffId',
          displayMember: 'staffCode'
        }
      },
      majorId: {
        ServiceProxy: require('proxy.Major'),
        combobox: {
          valueMember: 'majorId',
          displayMember: 'majorName'
        }
      },
      termId: {
        ServiceProxy: require('proxy.Term'),
        combobox: {
          valueMember: 'termId',
          displayMember: 'termName'
        }
      },
      classId: {
        ServiceProxy: require('proxy.Class'),
        combobox: {
          valueMember: 'classId',
          displayMember: 'className'
        }
      },
      subjectId: {
        ServiceProxy: require('proxy.Subject'),
        combobox: {
          valueMember: 'subjectId',
          displayMember: 'subjectName'
        },
        skipDataSubmission: true
      },
      subjectVersionId: {
        ServiceProxy: require('proxy.SubjectVersion'),
        combobox: {
          valueMember: 'subjectVersionId',
          displayMember: 'description'
        },
        filterByAttributes: ['subjectId']
      } //,
      //      lectureId: {
      //        ServiceProxy: require('proxy.Lecture'),
      //        combobox: {
      //          valueMember: 'lectureId',
      //          displayMember: 'lectureName'
      //        }
      //      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);

  };

  form.reloadData = function () {

    // set subjectId when reload
    var subjectId = this.data.attr('subjectVersion.subjectId');

    if (this.data.attr('subjectId') != subjectId) {
      this.data.attr({
        subjectId: subjectId
      });
    }

  };

});



define.form('component.form.manage-course.ListCourse', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-course'
    }
  };

  form.ServiceProxy = require('proxy.Course');

  form.tmpl = 'form.manage-course.list-course';

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('course.courseId'),
        dataField: 'courseId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 100,
        hidden: false
      }, {
        text: Lang.get('course.courseName'),
        dataField: 'courseName',
      }, {
        text: Lang.get('course.numberOfCredits'),
        dataField: 'numberOfCredits',
      }, {
        text: Lang.get('class.className'),
        dataField: 'className',
      }, {
        text: Lang.get('staff.teacherCode'),
        dataField: 'staffCode',
      }, {
        text: Lang.get('term.termName'),
        dataField: 'termName',
      }, {
        text: Lang.get('major.majorName'),
        dataField: 'majorName'
      }, {
        text: Lang.get('subject.subjectName'),
        dataField: 'subjectName'
      }, {
        text: Lang.get('course.subjectVersion'),
        dataField: 'description'
      },
        //    {
        //     text: Lang.get('lecture.lectureName'),
        //     dataField: 'lectureName'
        //    }
      ];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };


  form.refreshData = function (data) {
    var Role = require('enum.Role');

    if (Role.isTeacher(form.authentication.accountRole)) {
      this.grid.setFilterConditions('lectureId', form.authentication.userInformationId);
    }

  }

});



define.form('component.dialog.manage-department.CreateDepartment', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-department/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-department',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-department.create-department';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Department');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Department');
});



define.form('component.dialog.manage-department.EditDepartment', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-department/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-department',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-department.edit-department';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Department');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Department');
});



/*
 * System          : 3connected
 * Component       : List department component
 * Creator         : UayLU
 * Created date    : 2014/06/15
 */
define.form('component.form.manage-department.ListDepartment', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-department'
    }
  };

  form.ServiceProxy = require('proxy.Department');

  form.tmpl = 'form.manage-department.list-department';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Department');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('department.departmentId'),
      dataField: 'departmentId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150
    }, {
      text: Lang.get('department.departmentName'),
      dataField: 'departmentName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



/*
 * System          : 3connected
 * Component       : Create grade category component
 * Creator         : UayLU
 * Created date    : 2014/06/18
 */
define.form('component.dialog.manage-gradeCategory.GradeCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-grade-category',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-gradeCategory.create-gradeCategory';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.GradeCategory');

  // the validation rules used by form
  form.validateRules = require('validator.rule.GradeCategory');

  // init form data
  form.initData = function (params) {

    if (!params) return;

    var subjectVersionId = 0;
    if (params.subjectVersionId) {

      subjectVersionId = +params.subjectVersionId;

      var data = {
        subjectVersionId: subjectVersionId
      };

      this.data.attr(data);
    }
  };

});



/*
 * System          : 3connected
 * Component       : Edit grade category component
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
define.form('component.dialog.manage-gradeCategory.EditGradeCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-grade-category',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-gradeCategory.edit-gradeCategory';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.GradeCategory');

  // the validation rules used by form
  form.validateRules = require('validator.rule.GradeCategory');

  // init form data
  form.initData = function () {

    var componentSettings = {
      subjectId: {
        ServiceProxy: require('proxy.Subject'),
        combobox: {
          valueMember: 'subjectId',
          displayMember: 'subjectName'
        }
      },
      subjectVersionId: {
        ServiceProxy: require('proxy.SubjectVersion'),
        combobox: {
          valueMember: 'subjectVersionId',
          displayMember: 'description'
        },
        filterByAttributes: ['subjectId']
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);

  };

  form.reloadData = function () {

    // set subjectId when reload
    var subjectId = this.data.attr('subjectVersion.subjectId');

    if (this.data.attr('subjectId') != subjectId) {
      this.data.attr({
        subjectId: subjectId
      });
    }

  }

});



/*
 * System          : 3connected
 * Component       : Grade category versions component
 * Creator         : UayLU
 * Created date    : 2014/16/06
 */
define.form('component.form.manage-gradeCategory.ListGradeCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-subject-version',
      action: 'grade-category'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-gradeCategory.list-gradeCategory';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.GradeCategory');
  //  form.ServiceProxy = {
  //    proxy: require('proxy.GradeCategory'),
  //    method: 'getSubjectVersionGradeCaterogy'
  //  };
  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('gradeCategory.gradeCategoryId'),
      dataField: 'gradeCategoryId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('gradeCategory.gradeCategoryCode'),
      dataField: 'gradeCategoryCode',
    }, {
      text: Lang.get('gradeCategory.gradeCategoryName'),
      dataField: 'gradeCategoryName',
    }, {
      text: Lang.get('gradeCategory.minimumGrade'),
      dataField: 'minimumGrade',
    }, {
      text: Lang.get('gradeCategory.weight'),
      dataField: 'weight',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };


  form.refreshData = function (data) {
    var subjectVersionId = data.id;

    this.grid.setFilterConditions('subjectVersionId', subjectVersionId);
    this.setFormParam('subjectVersionId', subjectVersionId);
    var SubjectVersionProxy = require('proxy.SubjectVersion');

    SubjectVersionProxy.findOne({
      subjectVersionId: subjectVersionId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var subjectVersion = serviceResponse.getData();

      this.data.attr({
        subject: subjectVersion.subject,
        version: subjectVersion.description
      });
    }
  }

});



/*
 * System          : 3connected
 * Component       : List attendance history component
 * Creator         : UayLU
 * Created date    : 2014/07/1
 */
define.form('component.form.view-logs.ListAttendanceHistory', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'history',
      action: 'attendance'
    }
  };

  form.ServiceProxy = require('proxy.AttendanceHistory');

  form.tmpl = 'form.view-logs.list-attendanceHistory';

  form.formType = form.FormType.Form.LIST;


  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('attendanceHistory.attendanceHistoryId'),
      dataField: 'attendanceHistoryId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 140,
    }, {
      text: Lang.get('attendanceHistory.oldValue'),
      dataField: 'oldValue',
      width: 100,
      columnType: 'attendance'
    }, {
      text: Lang.get('attendanceHistory.newValue'),
      dataField: 'newValue',
      width: 100,
      columnType: 'attendance'
    }, {
      text: Lang.get('attendanceHistory.time'),
      dataField: 'time',
      width: 150
    }, {
      text: Lang.get('attendanceHistory.attendanceId'),
      dataField: 'attendanceId',
      width: 100
    }, {
      text: Lang.get('staff.staffCode'),
      dataField: 'staffCode',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.studentCode'),
      dataField: 'studentCode',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.date'),
      dataField: 'date',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.slot'),
      dataField: 'slot',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.courseName'),
      dataField: 'courseName',
    }, {
      text: Lang.get('attendanceHistory.termName'),
      dataField: 'termName',
      width: 100
    }, {
      text: Lang.get('attendanceHistory.majorName'),
      dataField: 'majorName',
      width: 150
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



/*
 * System          : 3connected
 * Component       : List grade history component
 * Creator         : UayLU
 * Created date    : 2014/07/1
 */
define.form('component.form.view-logs.ListGradeHistory', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'history',
      action: 'grade'
    }
  };

  form.ServiceProxy = require('proxy.GradeHistory');

  form.tmpl = 'form.view-logs.list-gradeHistory';

  form.formType = form.FormType.Form.LIST;


  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('gradeHistory.gradeHistoryId'),
      dataField: 'gradeHistoryId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('gradeHistory.oldValue'),
      dataField: 'oldValue',
      width: 100
    }, {
      text: Lang.get('gradeHistory.newValue'),
      dataField: 'newValue',
      width: 100
    }, {
      text: Lang.get('gradeHistory.time'),
      dataField: 'time',
      width: 150
    }, {
      text: Lang.get('gradeCategory.gradeCategoryName'),
      dataField: 'gradeCategoryName',
      width: 140
    }, {
      text: Lang.get('staff.staffCode'),
      dataField: 'staffCode',
      width: 100
    }, {
      text: Lang.get('gradeHistory.studentCode'),
      dataField: 'studentCode',
      width: 100
    }, {
      text: Lang.get('gradeHistory.courseName'),
      dataField: 'courseName'
    }, {
      text: Lang.get('gradeHistory.termName'),
      dataField: 'termName'
    }, {
      text: Lang.get('gradeHistory.majorName'),
      dataField: 'majorName'
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define.form('component.dialog.manage-major.CreateMajor', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-major/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-major',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-major.create-major';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Major');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Major');
});



define.form('component.dialog.manage-major.EditMajor', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-major/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-major',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-major.edit-major';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Major');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Major');
});



/*
 * System          : 3connected
 * Component       : List major component
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
define.form('component.form.manage-major.ListMajor', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-major'
    }
  };

  form.ServiceProxy = require('proxy.Major');

  form.tmpl = 'form.manage-major.list-major';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Major');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('major.majorId'),
      dataField: 'majorId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150
    }, {
      text: Lang.get('major.majorName'),
      dataField: 'majorName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define.form('component.form.manage-news.NewsDetail', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'news',
      action: 'detail'
    }
  };

  form.tmpl = 'form.manage-news.news-detail';

  form.formType = form.FormType.FORM;

  form.initForm = function () {
    this.panelNewsContent = this.element.find('#news-content');
    this.panelNewsContent.jqxPanel({
      width: '100%',
      height: '100%',
      sizeMode: 'fixed',
      autoUpdate: true,
      scrollBarSize: 12
    });

    this.element.find('#button-delete-news').click(this.proxy(this.deleteNews));
  };

  form.refreshData = function (params) {
    var newsId = params.id;

    var Route = require('core.route.Route');

    var editFormUrl = Route.url({
      module: 'news',
      action: 'edit',
      id: newsId
    });

    // update edit button url
    this.element.find('#button-edit-news').attr('href', editFormUrl);

    this.refreshNews(newsId);
  };

  form.deleteNews = function () {
    var newsTitle = this.data.attr('title');
    var newsId = this.data.attr('newsId');

    var MsgBox = require('component.common.MsgBox');

    MsgBox.confirm(Lang.get('news.delete.confirm', {
      title: newsTitle
    }), this.proxy(function () {
      var NewsProxy = require('proxy.News');

      NewsProxy.destroy({
        newsId: newsId
      }, this.proxy(destroyNewsDone));
    }));

    function destroyNewsDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var Route = require('core.route.Route');
      Route.attr({
        module: 'news'
      });
    }
  };

  form.refreshNews = function (newsId) {
    if (!newsId) {
      this.panelNewsContent.jqxPanel('clearContent');
      return;
    }

    var NewsProxy = require('proxy.News');

    NewsProxy.findOne({
      newsId: newsId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var newsData = serviceResponse.getData();

      var attachments = newsData.attachments;
      for (var i = 0, len = attachments.length; i < len; i++) {
        attachments[i].size = Util.File.sizeText(attachments[i].size);
      }

      this.panelNewsContent.jqxPanel('clearContent');
      this.panelNewsContent.jqxPanel('append', newsData.content);

      this.data.attr(newsData);

      this.on();
    }
  };

  form.events['#button-download-attachment click'] = function (element, event) {
    if (!this.attachmentId) return;

    //    var NewsProxy = require('proxy.News');
    //
    //    NewsProxy.downloadAttachment({
    //      attachmentId: this.attachmentId
    //    }, function () {});

    window.location.href = '/api/attachment/download?attachmentId=' + this.attachmentId;
  };

  form.events['.attachment click'] = function (element, event) {
    if (element.hasClass('selected')) return;

    this.element.find('.attachment.selected').removeClass('selected');

    element.addClass('selected');

    var attachmentId = element.data('attachment-id');
    this.attachmentId = attachmentId;
  };

});



define.form('component.form.manage-news.Editor', function (form, require, Util, Lang) {

  form.urlMap = [{
    url: ':module/:action',
    data: {
      module: 'news',
      action: 'create'
    }
  }, {
    url: ':module/:action/:id',
    data: {
      module: 'news',
      action: 'edit'
    }
  }];

  form.tmpl = 'form.manage-news.news-editor';

  form.formType = form.FormType.FORM;

  form.attachmentInfo = {};
  form.attachmentData = {};

  form.initData = function () {

    var componentSettings = {
      categoryIds: {
        ServiceProxy: require('proxy.NewsCategory'),
        combobox: {
          valueMember: 'newsCategoryId',
          displayMember: 'newsCategoryName'
        }
      }
    };

    this.data.attr({
      componentSettings: componentSettings
    });

  };

  form.loadNews = function (newsId) {
    var NewsProxy = require('proxy.News');

    NewsProxy.findOne({
      newsId: newsId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var newsData = serviceResponse.getData();

      var categoryIds = [];
      for (var i = 0, len = newsData.categories.length; i < len; i++) {
        var category = newsData.categories[i];
        categoryIds.push(category.newsCategoryId);
      }

      this.attachmentInfo = {};
      this.attachmentData = {};

      for (var i = 0, len = newsData.attachments.length; i < len; i++) {
        var attachment = newsData.attachments[i];

        var attachmentUid = this.attachmentUid();

        var fileInfo = {
          name: attachment.name,
          size: attachment.size,
          extension: attachment.extension,
          isCreated: true
        };

        this.attachmentInfo[attachmentUid] = fileInfo;
        this.attachmentData[attachmentUid] = null;
      }

      this.editor.val(newsData.content);

      this.data.attr({
        title: newsData.title,
        content: newsData.content,
        categoryIds: categoryIds
      });

      this.refreshAttachmentList();

      this.on();
    }
  };

  form.refreshData = function (params) {
    this.newsId = params.id;

    if (!this.isFormInitialized) {
      return;
    };

    if (params.action == 'edit') {
      // load news for edit
      this.data.attr({
        newsId: this.newsId
      });

      this.loadNews(params.id);
    } else {
      // clear form for create
      this.editor.val('');

      this.data.attr({
        title: null,
        content: null,
        categoryIds: null
      });

      this.data.attr({
        categoryIds: []
      });

      this.data.removeAttr('newsId');

      this.attachmentInfo = {};
      this.attachmentData = {};

      this.refreshAttachmentList();
    }
  };

  form.initForm = function () {
    this.element.on('visible', this.proxy(this.initFormComponents));
  };

  form.initFormComponents = function () {
    if (this.isFormInitialized) return;

    // init splitter
    this.element.find('#splitter').jqxSplitter({
      width: '100%',
      height: '100%',
      panels: [{
        size: 300
      }]
    }).on('resize', function (event) {});

    // init attachments listbox
    this.listBoxAttachment = this.element.find('#attachments');
    this.listBoxAttachment.jqxListBox({
      source: this.buildAttachmentSource(),

      selectedIndex: 0,
      valueMember: 'attachmentUid',
      width: '100%',
      height: '100px',
      itemHeight: 47,

      renderer: this.proxy(function (index, label, value) {
        var fileInfo = this.attachmentInfo[value];

        if (!fileInfo) return '';

        var html = '\
          <div> \
          <table class="attachment-item"> \
            <tr> \
              <td class="icon" rowspan="2"></td> \
              <td class="name" colspan="2"></td> \
            </tr> \
            <tr> \
              <td class="extension"></td> \
              <td class="size"></td> \
            </tr> \
          </table> \
          </div> \
        ';

        html = jQuery(html);

        var fileSize = '(' + Util.File.sizeText(fileInfo.size) + ')';
        var fileExtension = '.' + fileInfo.extension;

        html.find('.icon').addClass(fileInfo.extension);
        html.find('.name').text(fileInfo.name);
        html.find('.extension').text(fileExtension);
        html.find('.size').text(fileSize);

        return html.html();
      })
    });

    // init editor
    this.editor = this.element.find('#news-editor');
    this.editor.ckeditor(this.proxy(this.resizeFormComponents));

    // resize components when window resized
    jQuery(window).resize(this.proxy(this.resizeFormComponents));

    // handle for add - remove attachments
    this.element.find('#button-add-attachments').click(this.proxy(this.addAttachments));
    this.element.find('#button-remove-attachments').click(this.proxy(this.removeAttachments));

    // handle for save
    this.element.find('#button-save').click(this.proxy(this.saveNews));

    // handle for attachments selected
    this.inputAttachments = this.element.find('#input-attachments');
    this.inputAttachments.change(this.proxy(this.updateSelectedAttachments));

    // mark form initialized
    this.isFormInitialized = true;

    if (this.newsId) {
      this.loadNews(this.newsId);
    }
  };

  form.resizeFormComponents = function () {
    this.resizeEditor();
    this.resizeAttachmentListBox();
  };

  form.resizeEditor = function () {
    var ckeditor = this.editor.ckeditorGet();
    var ckeditorWrapper = this.element.find('.news-editor-wrapper');

    var editorHeight = ckeditorWrapper.height();

    ckeditor.resize('100%', editorHeight - 10);
  };

  form.resizeAttachmentListBox = function () {
    var attachmentListBox = this.element.find('#attachments');

    var newsInfoWrapper = this.element.find('.news-info');

    var listBoxHeight = newsInfoWrapper.height() - attachmentListBox.offset().top + 60;

    attachmentListBox.jqxListBox({
      height: listBoxHeight
    });
  };

  form.refreshAttachmentList = function () {
    var source = this.buildAttachmentSource();

    this.listBoxAttachment.jqxListBox({
      source: source
    });
  };

  form.buildAttachmentSource = function () {
    var attachmentInfo = this.attachmentInfo;

    var sourceData = [];

    Util.Collection.each(attachmentInfo, function (fileInfo, attachmentUid) {
      var item = {
        attachmentUid: attachmentUid
      };

      sourceData.push(item);
    });

    var source = {
      localData: sourceData,
      dataType: 'array'
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  form.buildAttachmentData = function () {
    var attachmentInfo = this.attachmentInfo;
    var attachmentData = this.attachmentData;

    var attachments = [];

    Util.Collection.each(attachmentInfo, function (fileInfo, attachmentUid) {
      var attachment = {
        name: fileInfo.name,
        size: fileInfo.size,
        extension: fileInfo.extension,

        data: attachmentData[attachmentUid]
      };

      attachments.push(attachment);
    });

    return attachments;
  };

  form.saveNews = function () {
    var newsContent = this.editor.val();
    var attachments = this.buildAttachmentData();

    this.data.attr('content', newsContent);
    this.data.attr('attachments', attachments);

    var validate = this.validateData();

    if (!validate.isValid) {
      var MsgBox = require('component.common.MsgBox');

      var message = Lang.get(validate.message, validate.messageData);
      MsgBox.alert({
        text: message,
        icon: 'warning'
      });

      return;
    }

    var data = Util.Object.pick(this.data.attr(), ['title', 'content', 'categoryIds', 'attachments']);

    var NewsProxy = require('proxy.News');
    NewsProxy.create(data, this.proxy(createNewsDone));

    function createNewsDone(serviceResonse) {
      if (serviceResonse.hasError()) return;

      var newsData = serviceResonse.getData();
      var newsId = newsData.newsId;

      var Route = require('core.route.Route');

      Route.attr({
        module: 'news',
        action: 'detail',
        id: newsId
      });
    }
  };

  form.validateData = function () {
    var Validator = require('core.validator.Validator');
    var data = this.data;
    var rules = require('validator.rule.News').create;

    var validate = Validator.validate(data, rules);

    return validate;
  };

  form.addAttachments = function () {
    this.inputAttachments[0].files = null;
    this.inputAttachments.click();
  };

  form.removeAttachments = function () {
    var selectedItem = this.listBoxAttachment.jqxListBox('getSelectedItem');

    if (!selectedItem) return;

    var attachmentUid = selectedItem.value;

    this.attachmentInfo = Util.Object.omit(this.attachmentInfo, [attachmentUid]);
    this.attachmentData = Util.Object.omit(this.attachmentData, [attachmentUid]);

    this.refreshAttachmentList();
  };

  form.updateSelectedAttachments = function () {
    var files = this.inputAttachments[0].files;

    for (var i = 0, len = files.length; i < len; i++) {
      this.addLocalAttachment(files[i]);
    }
  };

  form.addLocalAttachment = function (file) {
    var reader = new FileReader();

    var fileInfo = {
      name: Util.File.fileName(file.name),
      size: file.size,
      extension: Util.File.fileExtension(file.name)
    }

    reader.onloadend = this.proxy(function () {
      var fileData = reader.result;

      // get base64 data
      fileData = Util.File.getBase64Data(fileData);

      var attachmentUid = this.attachmentUid();

      this.attachmentInfo[attachmentUid] = fileInfo;
      this.attachmentData[attachmentUid] = fileData;

      this.refreshAttachmentList();
    });

    reader.readAsDataURL(file);
  };

  form.attachmentUid = function () {
    return Util.uniqueId();
  };

});



define.form('component.form.manage-news.NewsExplorer', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'news'
    }
  };

  form.tmpl = 'form.manage-news.news-explorer';

  form.formType = form.FormType.FORM;

  form.refreshData = function () {
    var NewsCategoryProxy = require('proxy.NewsCategory');

    NewsCategoryProxy.findAll({}, this.proxy(findAllDone));

    function findAllDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var categories = serviceResponse.getData();

      this.newsServiceProxy = null;
      this.refreshTreeCategories(categories.items);
    }
  };

  form.initForm = function () {
    this.element.on('visible', this.proxy(this.initFormComponents));
  };

  form.initFormComponents = function () {
    if (this.isFormInitialized) {
      return;
    } else {
      this.isFormInitialized = true;
    }

    // init splitter
    this.element.find('#splitter-vertical').jqxSplitter({
      orientation: 'vertical',
      splitBarSize: 3,
      width: '100%',
      height: '100%',
      panels: [{
        size: 200
      }]
    });

    this.element.find('#splitter-horizontal').jqxSplitter({
      orientation: 'horizontal',
      splitBarSize: 3,
      width: '100%',
      height: '100%',
      panels: [{
        size: '80%',
        collapsible: false
      }]
    });

    this.treeCategories = this.element.find('#tree-categories');
    this.treeCategories.jqxTree({
      source: null,
      width: '100%',
      height: '100%',
      easing: '',
      animationShowDuration: 0,
      animationHideDuration: 0
    });

    this.treeCategories.on('select', this.proxy(function (event) {
      var args = event.args;

      var item = this.treeCategories.jqxTree('getItem', args.element);
      var value = item.value;

      this.refreshNewsList(value);
    }));

    this.panelNewsContent = this.element.find('#news-content');
    this.panelNewsContent.jqxPanel({
      width: '100%',
      height: '100%',
      sizeMode: 'fixed',
      autoUpdate: true,
      scrollBarSize: 12
    });

    this.newsServiceProxy = require('proxy.News');

    var GridComponent = require('component.common.Grid');
    this.gridNews = new GridComponent(this.element.find('#grid-news'), {
      ServiceProxy: this.newsServiceProxy,
      grid: this.getGridConfig().gridNews,
      events: {
        singleSelect: this.proxy(this.refreshNews)
      }
    });

  };

  form.refreshNews = function (newsId, row) {
    if (!newsId) {
      this.panelNewsContent.jqxPanel('clearContent');
      return;
    }

    var NewsProxy = require('proxy.News');

    NewsProxy.findOne({
      newsId: row.newsId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var newsData = serviceResponse.getData();

      this.panelNewsContent.jqxPanel('clearContent');
      this.panelNewsContent.jqxPanel('append', newsData.content);
    }
  };

  form.gridConfig = function () {
    var gridNewsColumns = [{
      text: Lang.get('news.title'),
      dataField: 'title',

      filterType: 'textbox'
    }, {
      text: Lang.get('news.author'),
      dataField: 'author',

      filterType: 'textbox',

      width: 200
    }, {
      text: Lang.get('news.createdTime'),
      dataField: 'createdTime',

      filterType: 'textbox',

      width: 130
    }];

    var gridConfig = {
      gridNews: {
        singleSelection: true,
        pageable: false,
        columns: gridNewsColumns
      }
    };

    return gridConfig;
  };

  form.refreshNewsList = function (categoryId) {
    var ServiceProxy;

    if (categoryId) {
      ServiceProxy = require('proxy.CategoryOfNews');
    } else {
      ServiceProxy = require('proxy.News');
    }

    if (this.newsServiceProxy !== ServiceProxy) {
      this.newsServiceProxy = ServiceProxy;

      this.gridNews.setFilterConditions('newsCategoryId', categoryId, true);
      this.gridNews.setServiceProxy(this.newsServiceProxy);
    } else {
      this.gridNews.setFilterConditions('newsCategoryId', categoryId);
    }

    this.refreshNews();
  };

  form.refreshTreeCategories = function (categories) {
    var categorySource = this.buildCategorySource(categories);

    this.treeCategories.jqxTree({
      source: categorySource
    });

    var items = this.treeCategories.jqxTree('getItems');
    this.treeCategories.jqxTree('selectItem', items[0]);

    this.treeCategories.jqxTree('expandAll');
  };

  form.buildCategorySource = function (categories) {
    var sourceData = [{
      newsCategoryId: null,
      parentCategoryId: '',
      newsCategoryName: Lang.get('news.allCatetories')
    }].concat(categories);

    var source = {
      dataType: 'json',
      dataFields: [{
        name: 'newsCategoryId'
      }, {
        name: 'parentCategoryId'
      }, {
        name: 'newsCategoryName'
      }],
      id: 'newsCategoryId',
      localData: sourceData
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    dataAdapter.dataBind();

    var records = dataAdapter.getRecordsHierarchy('newsCategoryId', 'parentCategoryId', 'items', [{
      name: 'newsCategoryName',
      map: 'label'
    }, {
      name: 'newsCategoryId',
      map: 'value'
    }]);

    return records;
  };

});



define.form('component.dialog.manage-newsCategory.NewsCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-news-category/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-news-category',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-newsCategory.create-newsCategory';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.NewsCategory');

  // the validation rules used by form
  form.validateRules = require('validator.rule.NewsCategory');

  // init form data
  form.initData = function () {

    var componentSettings = {
      parentCategoryId: {
        ServiceProxy: require('proxy.NewsCategory'),
        combobox: {
          valueMember: 'newsCategoryId',
          displayMember: 'newsCategoryName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };
});



define.form('component.dialog.manage-newsCategory.EditNewsCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-newsCategory/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-news-category',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-newsCategory.edit-newsCategory';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.NewsCategory');

  // the validation rules used by form
  form.validateRules = require('validator.rule.NewsCategory');
});



define.form('component.form.manage-newsCategory.ListNewsCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-news-category
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-news-category'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-newsCategory.list-newsCategory';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.NewsCategory');

  // the config used for exporting grid data
  form.exportConfig = require('export.NewsCategory');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('newsCategory.newsCategoryId'),
      dataField: 'newsCategoryId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('newsCategory.newsCategoryName'),
      dataField: 'newsCategoryName',
    }, {
      text: Lang.get('newsCategory.parentCategoryId'),
      dataField: 'parentCategoryId',
    }, {
      text: Lang.get('newsCategory.parentCategoryName'),
      dataField: 'parentCategoryName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



/*
 * System          : 3connected
 * Component       : Create parent component
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.form('component.dialog.manage-parent.Parent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-parent',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-parent.create-parent';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Parent');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Parent');

  // init form data
  form.initData = function (params) {

    if (!params) return;

    var studentId = 0;
    if (params.studentId) {

      studentId = +params.studentId;

      var data = {
        studentId: studentId
      };

      this.data.attr(data);
    }
  };

});



define.form('component.dialog.manage-parent.EditParent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-parent',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-parent.edit-parent';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Parent');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Parent');

  // init form data
  form.initData = function () {};

});



/*
 * System          : 3connected
 * Component       : List parents component
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.form('component.form.manage-parent.Listparent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subjectVersion
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-student',
      action: 'parent'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-parent.list-parent';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Parent');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('parent.parentId'),
      dataField: 'parentId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('parent.firstName'),
      dataField: 'firstName',
    }, {
      text: Lang.get('parent.lastName'),
      dataField: 'lastName',
    }, {
      text: Lang.get('parent.relationship'),
      dataField: 'relationship',

      width: '150px'
    }, {
      text: Lang.get('parent.gender'),
      dataField: 'gender',

      width: '150px'
    }, {
      text: Lang.get('parent.dateOfBirth'),
      dataField: 'dateOfBirth',

      width: '150px'
    }, {
      text: Lang.get('parent.address'),
      dataField: 'address',
    }, {
      text: Lang.get('parent.email'),
      dataField: 'email',

      width: '200px'
    }, {
      text: Lang.get('parent.phoneNumber'),
      dataField: 'phoneNumber',

      width: '180px'
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

  form.refreshData = function (data) {

    var studentId = data.id;

    this.setFormParam('studentId', studentId);

    this.grid.setFilterConditions('studentId', studentId);

    var StudentProxy = require('proxy.Student');

    StudentProxy.findOne({
      studentId: studentId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var student = serviceResponse.getData();

      this.data.attr({
        student: student
      });
    }
  }

});



define.form('component.dialog.manage-staff.CreateStaff', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-staff/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-staff',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-staff.create-staff';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Staff');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Staff');

  // init form data
  form.initData = function () {

    var componentSettings = {
      departmentId: {
        ServiceProxy: require('proxy.Department'),
        combobox: {
          valueMember: 'departmentId',
          displayMember: 'departmentName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});



define.form('component.dialog.manage-staff.EditStaff', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-staff/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-staff',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-staff.edit-staff';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Staff');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Staff');

  // init form data
  form.initData = function () {

    var componentSettings = {
      departmentId: {
        ServiceProxy: require('proxy.Department'),
        combobox: {
          valueMember: 'departmentId',
          displayMember: 'departmentName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});



define.form('component.form.manage-staff.ListStaff', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-staff'
    }
  };

  form.ServiceProxy = require('proxy.Staff');

  form.tmpl = 'form.manage-staff.list-staff';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Staff');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('staff.staffId'),
        dataField: 'staffId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: '100px',
        hidden: false
      },
      {
        text: Lang.get('staff.staffCode'),
        dataField: 'staffCode',
      },
      {
        text: Lang.get('staff.firstName'),
        dataField: 'firstName',
      },
      {
        text: Lang.get('staff.lastName'),
        dataField: 'lastName',
      },
      {
        text: Lang.get('staff.departmentName'),
        dataField: 'departmentName',

        width: '100px',
      },
      {
        text: Lang.get('staff.gender'),
        dataField: 'gender',
      },
      {
        text: Lang.get('staff.dateOfBirth'),
        dataField: 'dateOfBirth',

        width: '130px'
      },
      {
        text: Lang.get('staff.address'),
        dataField: 'address',

        width: '200px',
        hidden: true
      },
      {
        text: Lang.get('staff.email'),
        dataField: 'email',

        width: '200px',
        hidden: true
      }
    ];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define.form('component.dialog.manage-student.CreateStudent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-student/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-student',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-student.create-student';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Student');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Student');

  // init form data
  form.initData = function () {

    var componentSettings = {
      classId: {
        ServiceProxy: require('proxy.Class'),
        combobox: {
          valueMember: 'classId',
          displayMember: 'className'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});



define.form('component.dialog.manage-student.EditStudent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-student/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-student',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-student.edit-student';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Student');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Student');

  // init form data
  form.initData = function () {

    var componentSettings = {
      classId: {
        ServiceProxy: require('proxy.Class'),
        combobox: {
          valueMember: 'classId',
          displayMember: 'className'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});



/*
 * System          : 3connected
 * Component       : Statistic grade component
 * Creator         : UayLU
 * Created date    : 2014/07/27
 */
define.form('component.form.manage-student.grade-student-statistic', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-student',
      action: 'grade-statistic'
    }
  };

  form.ServiceProxy = {
    proxy: require('proxy.Grade'),
    method: 'statisticGradeStudent'
  };

  form.tmpl = 'form.manage-student.grade-student-statistic';

  form.exportConfig = require('export.GradeStudentStatistic');

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var GradeStatus = require('enum.GradeStatus');
    var StatisticType = require('enum.StatisticType');

    var gridColumns = [{
      text: Lang.get('course.courseName'),
      dataField: 'courseName',

      cellsRenderer: function (row, columnField, value) {
        var text;
        if (row.statistic == undefined) {
          text = row.courseName;
        } else {
          switch (row.statistic) {
          case StatisticType.AVERAGE_GRADE:
            text = Lang.get('grade.averageGrade');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.ACCUMULATION_GRADE:
            text = Lang.get('grade.accumulationGrade');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.TOTAL_CREDIT_PASS:
            text = Lang.get('grade.totalCreditPass');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.TOTAL_CREDIT_FAIL:
            text = Lang.get('grade.totalCreditFail');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.TOTAL_CREDIT_UNFINISHED:
            text = Lang.get('grade.totalCreditUnfinished');
            text = '<span class="statistic">' + text + '</span>';

            break;
          case StatisticType.TOTAL_CREDIT:
            text = Lang.get('grade.totalCredits');
            text = '<span class="statistic">' + text + '</span>';

            break;
          }
        }

        return text;
      }
    }, {
      text: Lang.get('course.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('term.termName'),
      dataField: 'termName',
    }, {
      text: Lang.get('course.numberOfCredits'),
      dataField: 'numberOfCredits',

      cellsRenderer: function (row, columnField, value) {
        var text = '';

        if (row.statistic && value !== null && value != undefined) {
          text = '<span class="statistic">' + value + '</span>';
        } else {
          text = value;
        }

        return text;
      }
    }, {
      text: Lang.get('course.finalSubjectGrade'),
      dataField: 'finalSubjectGrade',

      cellsRenderer: function (row, columnField, value) {
        var text = '';

        if (row.statistic && value !== null && value != undefined) {
          text = '<span class="statistic">' + value + '</span>';
        } else {
          text = value;
        }

        return text;
      }
    }, {
      text: Lang.get('course.resultSubject'),
      dataField: 'resultSubject',
      width: 100,

      cellsRenderer: function (row, columnField, value) {
        var text = '';

        if (row.statistic && value !== null && value != undefined) {
          text = '<span class="statistic">' + value + '</span>';
        } else {
          switch (value) {
          case GradeStatus.PASS:
            text = Lang.get('grade.status.pass');
            text = '<span class="grade-status grade-status-pass">' + text + '</span>';

            break;
          case GradeStatus.FAIL:
            text = Lang.get('grade.status.fail');
            text = '<span class="grade-status grade-status-fail">' + text + '</span>';

            break;
          case GradeStatus.UNFINISHED:
            text = Lang.get('grade.status.unfinished');
            text = '<span class="grade-status grade-status-unfinished">' + text + '</span>';

            break;
          }
        }

        return text;
      }
    }];

    var gridConfig = {
      columns: gridColumns,
      singleSelection: true,
      filterable: false,
      sortable: false,
      pageable: false,

      events: {
        processData: this.proxy(this.processData)
      }
    };

    return gridConfig;

  };

  form.processData = function (data, originalData) {
    var accumulationGrade = originalData.data && originalData.data.accumulationGrade;
    var totalCredits = originalData.data && originalData.data.totalCredits;
    var totalCreditFail = originalData.data && originalData.data.totalCreditFail;
    var totalCreditUnfinished = originalData.data && originalData.data.totalCreditUnfinished;

    this.data.attr('accumulationGrade', accumulationGrade);
    this.data.attr('totalCredits', totalCredits);
    this.data.attr('totalCreditFail', totalCreditFail);
    this.data.attr('totalCreditUnfinished', totalCreditUnfinished);
  };


  form.refreshData = function (data) {

    var studentId = data.id;

    this.grid.setFilterConditions('studentId', studentId);

    var StudentProxy = require('proxy.Student');

    StudentProxy.findOne({
      studentId: studentId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var student = serviceResponse.getData();

      this.data.attr({
        student: student
      });
    }
  }

});



define.form('component.form.manage-student.ListStudent', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-student'
    }
  };

  form.ServiceProxy = require('proxy.Student');

  form.tmpl = 'form.manage-student.list-student';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Student');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('student.studentId'),
        dataField: 'studentId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: '100px',
        hidden: false
      },
      {
        text: Lang.get('student.studentCode'),
        dataField: 'studentCode',

        width: '150px',
      },
      {
        text: Lang.get('student.firstName'),
        dataField: 'firstName',
      },
      {
        text: Lang.get('student.lastName'),
        dataField: 'lastName',
      },
      {
        text: Lang.get('student.className'),
        dataField: 'className',

        width: '100px',
      },
      {
        text: Lang.get('student.batchName'),
        dataField: 'batchName',

        width: '150px',
      },
      {
        text: Lang.get('student.majorName'),
        dataField: 'majorName',

        width: '150px',
      },
      {
        text: Lang.get('student.gender'),
        dataField: 'gender',
      },
      {
        text: Lang.get('student.dateOfBirth'),
        dataField: 'dateOfBirth',

        width: '130px'
      },
      {
        text: Lang.get('student.address'),
        dataField: 'address',

        width: '200px',
        hidden: true
      },
      {
        text: Lang.get('student.email'),
        dataField: 'email',

        width: '200px',
        hidden: true
      }
    ];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define.form('component.dialog.manage-student.StudentDetail', function (form, require, Util, Lang) {

  var Role = require('enum.Role');

  if (form.authentication) {
    // admin
    if (Role.isAdministrator(form.authentication.accountRole)) {
      form.urlMap = {
        url: ':module/:action/:id',
        data: {
          module: 'manage-student',
          action: 'detail'
        }
      };
    }

    // staff
    if (Role.isEducator(form.authentication.accountRole)) {
      form.urlMap = {
        url: ':module/:action/:id',
        data: {
          module: 'manage-student',
          action: 'detail'
        }
      };
    }
    // student or parent
    if (Role.isStudentOrParent(form.authentication.accountRole)) {
      form.urlMap = {
        url: ':module',
        data: {
          module: 'profile'
        }
      };

      // init default student Id
      form.initData = function () {
        this.data.attr({
          params: {
            id: this.authentication.userInformationId
          }
        });
      };
    }
  }

  // the template that used by the form
  form.tmpl = 'dialog.manage-student.student-detail';

  // the form type is Dialog.VIEW
  form.formType = form.FormType.Dialog.VIEW;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Student');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Student');

});



/*
 * System          : 3connected
 * Component       : Create subject component
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.form('component.dialog.manage-subject.CreateSubject', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subject/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-subject',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-subject.create-subject';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Subject');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Subject');
});



/*
 * System          : 3connected
 * Component       : Edit subject component
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.form('component.dialog.manage-subject.EditSubject', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subject/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-subject',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-subject.edit-subject';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Subject');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Subject');
});



/*
 * System          : 3connected
 * Component       : List subjects component
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.form('component.form.manage-subject.ListSubject', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subject
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-subject'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-subject.list-subject';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Subject');

  // the config used for exporting grid data
  form.exportConfig = require('export.Subject');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('subject.subjectId'),
      dataField: 'subjectId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('subject.subjectCode'),
      dataField: 'subjectCode',
    }, {
      text: Lang.get('subject.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('subject.numberOfCredits'),
      dataField: 'numberOfCredits',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



/*
 * System          : 3connected
 * Component       : Create subject versions component
 * Creator         : ThanhVM
 * Created date    : 2014/16/06
 */
define.form('component.dialog.manage-subjectVersion.SubjectVersion', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-subject-version',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-subjectVersion.create-subjectVersion';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.SubjectVersion');

  // the validation rules used by form
  form.validateRules = require('validator.rule.SubjectVersion');

  // init form data
  form.initData = function (params) {

    if (!params) return;

    var subjectId = 0;
    if (params.subjectId) {

      subjectId = +params.subjectId;

      var data = {
        subjectId: subjectId
      };

      this.data.attr(data);
    }
  };

});



define.form('component.dialog.manage-subjectVersion.EditSubjectVersion', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-subject-version',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-subjectVersion.edit-subjectVersion';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.SubjectVersion');

  // the validation rules used by form
  form.validateRules = require('validator.rule.SubjectVersion');

  // init form data
  form.initData = function () {

    var componentSettings = {
      subjectId: {
        ServiceProxy: require('proxy.Subject'),
        combobox: {
          valueMember: 'subjectId',
          displayMember: 'subjectName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

});



/*
 * System          : 3connected
 * Component       : List subject versions component
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.form('component.form.manage-subjectVersion.ListSubjectVersion', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subjectVersion
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-subject',
      action: 'version'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-subjectVersion.list-subjectVersion';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.SubjectVersion');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('subjectVersion.subjectVersionId'),
      dataField: 'subjectVersionId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('subject.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('subjectVersion.description'),
      dataField: 'description',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

  form.refreshData = function (data) {

    var subjectId = data.id;

    this.setFormParam('subjectId', subjectId);

    this.grid.setFilterConditions('subjectId', subjectId);

    var SubjectProxy = require('proxy.Subject');

    SubjectProxy.findOne({
      subjectId: subjectId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var subject = serviceResponse.getData();

      this.data.attr({
        subject: subject
      });
    }
  }

});



define.form('component.dialog.manage-term.CreateTerm', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-term/create
  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-term',
      action: 'create'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-term.create-term';

  // the form type is Dialog.CREATE
  form.formType = form.FormType.Dialog.CREATE;

  // the proxy that used by the form
  // proxy.create method will be used
  form.ServiceProxy = require('proxy.Term');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Term');
});



define.form('component.dialog.manage-term.EditTerm', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-term/edit/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-term',
      action: 'edit'
    }
  };

  // the template that used by the form
  form.tmpl = 'dialog.manage-term.edit-term';

  // the form type is Dialog.EDIT
  form.formType = form.FormType.Dialog.EDIT;

  // the proxy that used by the form
  // proxy.findOne & proxy.update methods will be used
  form.ServiceProxy = require('proxy.Term');

  // the validation rules used by form
  form.validateRules = require('validator.rule.Term');
});



/*
 * System          : 3connected
 * Component       : List term component
 * Creator         : UayLU
 * Created date    : 2014/06/14
 */
define.form('component.form.manage-term.ListTerm', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-term'
    }
  };

  form.ServiceProxy = require('proxy.Term');

  form.tmpl = 'form.manage-term.list-term';

  form.formType = form.FormType.Form.LIST;

  form.exportConfig = require('export.Term');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('term.termId'),
      dataField: 'termId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('term.termName'),
      dataField: 'termName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define.form('component.form.notification.NotificationExplorer', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'notification'
    }
  };

  form.tmpl = 'form.notification.notification-explorer';

  form.formType = form.FormType.Form.LIST;

  //form.exportConfig = require('export.Notification');

  form.ServiceProxy = require('proxy.Notification');

  form.initData = function () {

    var NotificationType = require('enum.NotificationType');

    var componentSettings = {
      notificationType: {
        localDataAttribute: 'notificationTypes',
        combobox: {
          valueMember: 'type',
          displayMember: 'text'
        }
      }
    };

    var notificationTypes = [{
      type: NotificationType.ALL,
      text: Lang.get('notification.all')
    }, {
      type: NotificationType.NEWS,
      text: Lang.get('notification.news')
    }, {
      type: NotificationType.GRADE,
      text: Lang.get('notification.grade')
    }, {
      type: NotificationType.ATTENDANCE,
      text: Lang.get('notification.attendance')
    }];

    this.data.attr({
      notificationType: NotificationType.ALL,
      notificationTypes: notificationTypes,
      componentSettings: componentSettings
    });

  };

  form.initForm = function () {
    this.buttonSearchNotification = this.element.find('#button-search-notification');
    this.buttonSearchNotification.click(this.proxy(this.searchNotification));

    this.buttonViewNotification = this.element.find('#button-view-notification');
  };

  form.searchNotification = function () {
    var NotificationType = require('enum.NotificationType');

    var notificationType = this.data.attr('notificationType');
    var message = this.data.attr('message') || '';

    if (notificationType === NotificationType.ALL) {
      notificationType = null;
    }
    if (message.trim().length == 0) {
      message = null;
    }

    this.grid.setFilterConditions('notificationType', notificationType, true);
    this.grid.setParams('message', message);
  };

  form.updateViewNotificationUrl = function (entityId, row) {
    var NotificationType = require('enum.NotificationType');
    var Route = require('core.route.Route');

    switch (row.notificationType) {
    case NotificationType.ATTENDANCE:
      this.buttonViewNotification.attr('href', Route.url({
        module: 'student-course',
        action: 'attendance',
        id: row.dataId
      }));
      break;
    case NotificationType.GRADE:
      this.buttonViewNotification.attr('href', Route.url({
        module: 'course',
        action: 'grade',
        id: row.dataId
      }));
      break;
    case NotificationType.NEWS:
      this.buttonViewNotification.attr('href', Route.url({
        module: 'news',
        action: 'detail',
        id: row.dataId
      }));
      break;
    }
  };

  // grid config
  form.gridConfig = function () {
    var NotificationType = require('enum.NotificationType');

    var gridColumns = [{
      text: Lang.get('notification.type'),
      dataField: 'notificationType',
      width: 130,
      cellsRenderer: function (row, columnField, value) {
        switch (value) {
        case NotificationType.NEWS:
          var text = Lang.get('notification.news');
          text = '<span class="notification notification-news">' + text + '</span>';

          break;
        case NotificationType.ATTENDANCE:
          var text = Lang.get('notification.attendance');
          text = '<span class="notification notification-attendance">' + text + '</span>';

          break;
        case NotificationType.GRADE:
          var text = Lang.get('notification.grade');
          text = '<span class="notification notification-grade">' + text + '</span>';

          break;
        }

        return text;
      }
    }, {
      text: Lang.get('notification.sender'),
      dataField: 'senderName',
      width: 250
    }, {
      text: Lang.get('notification.message'),
      cellsRenderer: function (row, columnField, value) {
        if (row.notificationType == NotificationType.NEWS) {
          return row.newsTitle;
        }

        return row.courseName;
      }
    }, {
      text: Lang.get('notification.time'),
      dataField: 'notificationTime',
      width: 130
    }];

    var gridConfig = {
      columns: gridColumns,
      filterable: false,

      events: {
        singleSelect: this.proxy(this.updateViewNotificationUrl)
      }
    };

    return gridConfig;

  };

});



define.form('component.dialog.notification.NotifyNews', function (form, require, Util, Lang, jQuery) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'notification',
      action: 'notify-news'
    }
  };

  form.tmpl = 'dialog.notification.notify-news';

  form.formType = form.FormType.DIALOG;

  form.selectedUsers = {};

  form.getSelectTypes = function () {

    var selectTypes = [{
      id: 'all:students,parents',
      text: Lang.get('notification.selectType.allStudentsAndParents')
    }, {
      id: 'all:students',
      text: Lang.get('notification.selectType.allStudents')
    }, {
      id: 'all:parents',
      text: Lang.get('notification.selectType.allParents')
    }, {
      id: 'class:students,parents',
      text: Lang.get('notification.selectType.classStudentsAndParents')
    }, {
      id: 'class:students',
      text: Lang.get('notification.selectType.classStudents')
    }, {
      id: 'class:parents',
      text: Lang.get('notification.selectType.classParents')
    }, {
      id: 'course:students,parents',
      text: Lang.get('notification.selectType.courseStudentsAndParents')
    }, {
      id: 'course:students',
      text: Lang.get('notification.selectType.courseStudents')
    }, {
      id: 'course:parents',
      text: Lang.get('notification.selectType.courseParents')
    }, {
      id: 'specific:students,parents',
      text: Lang.get('notification.selectType.specificStudentsAndParents')
    }, {
      id: 'specific:students',
      text: Lang.get('notification.selectType.specificStudents')
    }, {
      id: 'specific:parents',
      text: Lang.get('notification.selectType.specificParents')
    }];

    return selectTypes;

  };

  form.initData = function (params) {

    var componentSettings = {
      selectType: {
        localDataAttribute: 'selectTypes',
        combobox: {
          valueMember: 'id',
          displayMember: 'text'
        }
      }
    };

    this.newsId = params.id;

    this.data.attr({
      selectTypes: this.getSelectTypes(),

      componentSettings: componentSettings
    });

  };

  form.initDialog = function () {

    this.listOfUsers = this.element.find('#list-users');
    this.listOfSelectedUsers = this.element.find('#list-selected-users');

    this.listOfUsers.jqxListBox({
      source: this.buildUsersSource(),
      width: '100%',
      height: '210px',
      displayMember: 'text',
      valueMember: 'uniqueId',
      checkboxes: true
    });

    this.listOfSelectedUsers.jqxListBox({
      source: this.buildSelectedUsersSource(),
      width: '100%',
      height: '338px',
      displayMember: 'text',
      valueMember: 'itemId',
      checkboxes: true
    });

    this.element.find('#button-add-users').click(this.proxy(this.addUsers));
    this.element.find('#button-remove-users').click(this.proxy(this.removeUsers));

    this.data.bind('change', this.proxy(this.findUsers));
    this.findUsers();
  };

  form.findUsers = function (event, attr, how, newVal, oldVal) {
    var selectType = this.data.attr('selectType');
    var filter = (this.data.attr('filter') || '').trim();

    this.data.componentElements.filter.jqxInput({
      disabled: !selectType || ['all:students,parents', 'all:students', 'all:parents'].indexOf(selectType) !== -1
    });

    switch (selectType) {
    case 'class:students,parents':
    case 'class:students':
    case 'class:parents':
      var data = {
        filters: [{
          field: 'className',
          value: filter
        }]
      };

      var ClassProxy = require('proxy.Class');
      ClassProxy.findAll(data, this.proxy(findClassDone));

      break;
    case 'course:students,parents':
    case 'course:students':
    case 'course:parents':
      var data = {
        filters: [{
          field: 'courseName',
          value: filter
        }]
      };

      var CourseProxy = require('proxy.Course');
      CourseProxy.findAll(data, this.proxy(findCourseDone));

      break;
    case 'specific:students,parents':
    case 'specific:students':
    case 'specific:parents':
      if (filter) {
        var data = {
          filters: [{
            field: 'studentCode',
            value: filter
          }]
        };

        var StudentProxy = require('proxy.Student');
        StudentProxy.findAll(data, this.proxy(findStudentDone));
      } else {
        this.refreshListOfUsers(selectType);
      }

      break;
    default:
      this.refreshListOfUsers(selectType);

      break;
    }

    function findClassDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var items = serviceResponse.getData().items;
      this.refreshListOfUsers(selectType, items);
    }

    function findCourseDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var items = serviceResponse.getData().items;
      this.refreshListOfUsers(selectType, items);
    }

    function findStudentDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var items = serviceResponse.getData().items;
      this.refreshListOfUsers(selectType, items);
    }
  };

  form.refreshListOfUsers = function (selectType, items) {
    this.listOfUsers.jqxListBox({
      source: this.buildUsersSource(selectType, items)
    });

    if (['all:students,parents', 'all:students', 'all:parents'].indexOf(selectType) !== -1) {
      this.listOfUsers.jqxListBox('checkAll');
    }
  };

  form.refreshListOfSelectedUsers = function () {
    this.listOfSelectedUsers.jqxListBox({
      source: this.buildSelectedUsersSource()
    });
  };

  form.buildUsersSource = function (selectType, items) {
    var sourceData = [];

    items = items || [];

    switch (selectType) {
    case 'all:students,parents':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allStudentsAndParents')
      };

      sourceData.push(item);

      break;
    case 'all:students':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allStudents')
      };

      sourceData.push(item);

      break;
    case 'all:parents':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allParents')
      };

      sourceData.push(item);

      break;
    case 'class:students,parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].classId,
          type: selectType,
          text: Lang.get('notification.selectItem.classStudentsAndParents', {
            className: items[i].className
          })
        };

        sourceData.push(item);
      }

      break;
    case 'class:students':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].classId,
          type: selectType,
          text: Lang.get('notification.selectItem.classStudents', {
            className: items[i].className
          })
        };

        sourceData.push(item);
      }

      break;
    case 'class:parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].classId,
          type: selectType,
          text: Lang.get('notification.selectItem.classParents', {
            className: items[i].className
          })
        };

        sourceData.push(item);
      }

      break;
    case 'course:students,parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].courseId,
          type: selectType,
          text: Lang.get('notification.selectItem.courseStudentsAndParents', {
            courseName: items[i].courseName,
            termName: items[i].term.termName
          })
        };

        sourceData.push(item);
      }

      break;
    case 'course:students':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].courseId,
          type: selectType,
          text: Lang.get('notification.selectItem.courseStudents', {
            courseName: items[i].courseName,
            termName: items[i].term.termName
          })
        };

        sourceData.push(item);
      }

      break;
    case 'course:parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].courseId,
          type: selectType,
          text: Lang.get('notification.selectItem.courseParents', {
            courseName: items[i].courseName,
            termName: items[i].term.termName
          })
        };

        sourceData.push(item);
      }

      break;
    case 'specific:students,parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].studentId,
          type: selectType,
          text: Lang.get('notification.selectItem.specificStudentsAndParents', {
            firstName: items[i].firstName,
            lastName: items[i].lastName,
            studentCode: items[i].studentCode,
            className: (items[i].class && items[i].class.className) || Lang.get('notification.selectItem.noClass')
          })
        };

        sourceData.push(item);
      }

      break;
    case 'specific:students':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].studentId,
          type: selectType,
          text: Lang.get('notification.selectItem.specificStudents', {
            firstName: items[i].firstName,
            lastName: items[i].lastName,
            studentCode: items[i].studentCode,
            className: (items[i].class && items[i].class.className) || Lang.get('notification.selectItem.noClass')
          })
        };

        sourceData.push(item);
      }

      break;
    case 'specific:parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].studentId,
          type: selectType,
          text: Lang.get('notification.selectItem.specificParents', {
            firstName: items[i].firstName,
            lastName: items[i].lastName,
            studentCode: items[i].studentCode,
            className: (items[i].class && items[i].class.className) || Lang.get('notification.selectItem.noClass')
          })
        };

        sourceData.push(item);
      }

      break;
    }

    this.users = {};
    for (var i = 0, len = sourceData.length; i < len; i++) {
      this.users[sourceData[i].uniqueId] = sourceData[i];
    }

    var source = {
      localData: sourceData,
      dataType: 'array',
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  }

  form.buildSelectedUsersSource = function () {
    var sourceData = [];

    Util.Collection.each(this.selectedUsers, function (user) {
      var item = {
        itemId: user.id,
        text: user.text
      };

      sourceData.push(item);
    });

    var source = {
      localData: sourceData,
      dataType: 'array',
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  }

  form.addUsers = function () {
    var items = this.listOfUsers.jqxListBox('getItems');

    for (var i = 0, len = items.length; i < len; i++) {
      if (!items[i].checked) continue;

      var item = this.users[items[i].value];

      var itemId = item.type + '[' + (item.id || '') + ']';

      this.selectedUsers[itemId] = {
        id: itemId,
        text: item.text
      };
    }

    this.refreshListOfSelectedUsers();
  }

  form.removeUsers = function () {
    var items = this.listOfSelectedUsers.jqxListBox('getItems');

    var selectedItemIds = [];

    for (var i = 0, len = items.length; i < len; i++) {
      if (!items[i].checked) continue;

      selectedItemIds.push(items[i].value);
    }

    this.selectedUsers = Util.Object.omit(this.selectedUsers, selectedItemIds);

    this.refreshListOfSelectedUsers();
  }

  form.submitDialogData = function () {
    var selectedUserIds = Util.Object.keys(this.selectedUsers);

    var NotificationProxy = require('proxy.Notification');
    NotificationProxy.notifyNews({
      newsId: this.newsId,
      userIds: selectedUserIds
    }, this.proxy(notifyNewsDone));

    function notifyNewsDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.hideForm();
    }
  };

});



define.form('component.dialog.profile.ChangePassword', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'profile',
      action: 'change-password'
    }
  };

  form.tmpl = 'dialog.profile.change-password';

  form.formType = form.FormType.Dialog.VALIDATION;

  form.initData = function() {
    this.data.attr({
      accountId: this.authentication.accountId
    });
  };

  form.submitDialogData = function(entity) {
    var ProfileProxy = require('proxy.Profile');

    var data = Util.Object.pick(this.data.attr(), ['accountId', 'currentPassword', 'password']);

    ProfileProxy.changePassword(data, this.proxy(changePasswordDone));

    function changePasswordDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.hideForm();
    }
  }

  // the validation rules used by form
  form.validateRules = require('validator.rule.Profile').changePassword;
});



define.form('component.form.view-attendance.ListAttendance', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/schedule/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'student-course',
      action: 'attendance'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.student-course.course-attendance';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {

    var ScheduleGridComponent = require('component.common.ViewAttendanceGrid');

    this.gridSchedule = new ScheduleGridComponent(this.element.find('#grid-course-schedule'));

    // bind event handlers to elements
    this.element.find('#button-view-schedule').click(this.proxy(this.viewSchedule));
    this.element.find('#button-refresh-schedule').click(this.proxy(this.refreshSchedule));

  };

  form.refreshData = function (data) {

    this.courseId = data.id;

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOneCourseStudent({
      courseId: this.courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr({
        course: course
      });
    }

    this.switchToViewMode();

  };

  form.viewSchedule = function () {
    var ConvertUtil = require('core.util.ConvertUtil');

    var startDate = this.data.attr('schedule.startDate');
    var endDate = this.data.attr('schedule.endDate');

    this.gridSchedule.refreshData(startDate, endDate);
  };

  form.refreshSchedule = function () {
    var CourseProxy = require('proxy.Course');

    CourseProxy.findAttendanceStudent({
      courseId: this.courseId
    }, this.proxy(findAttendanceStudent));


    function findAttendanceStudent(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var ConvertUtil = require('core.util.ConvertUtil');

      var courseAttendanceStudent = serviceResponse.getData();

      this.data.attr({
        // courseAttendanceStudent info
        courseAttendanceStudent: courseAttendanceStudent,
        // course infor
        course: null,
        // schedule
        schedule: {
          startDate: null,
          endDate: null
        }
      });

      var schedulesAttendanceStudent = [];
      if (courseAttendanceStudent.length) {
        schedulesAttendanceStudent = courseAttendanceStudent[0].schedules;
      }

      CourseProxy.findOneCourseStudent({
        courseId: this.courseId
      }, this.proxy(findOneCourseStudent));



      function findOneCourseStudent(serviceResponse) {
        if (serviceResponse.hasError()) return;

        var course = serviceResponse.getData();

        var schedules = course.schedules;

        if (schedules && schedules.length) {
          // find start date and end date of the schedule

          var startDate = Util.Collection.min(schedules, function (schedule) {
            var date = ConvertUtil.DateTime.parseDate(schedule.date);
            return date;
          });
          startDate = startDate.date;

          var endDate = Util.Collection.max(schedules, function (schedule) {
            var date = ConvertUtil.DateTime.parseDate(schedule.date);
            return date;
          });
          endDate = endDate.date;

          var AttendanceProxy = require('proxy.Attendance');

          AttendanceProxy.getCourseAttendanceStudent({
            courseId: this.courseId,
            scheduleId: schedules[0].scheduleId
          }, this.proxy(findOneAttendanceDone));

          function findOneAttendanceDone(serviceResponse) {
            if (serviceResponse.hasError()) return;

            var courseAttendance = serviceResponse.getData();

            var percentAbsents = courseAttendance.statistics.studentAttendances[courseAttendance.students[0].studentId].totalAbsents / courseAttendance.statistics.totalSlots * 100;
            percentAbsents = percentAbsents.toFixed(2);
            this.data.attr({
              courseAttendance: {
                percentAbsents: percentAbsents,
                totalAbsents: courseAttendance.statistics.studentAttendances[courseAttendance.students[0].studentId].totalAbsents,
                totalPresents: courseAttendance.statistics.studentAttendances[courseAttendance.students[0].studentId].totalPresents,

              }
            });
          }

          this.data.attr({
            course: course,
            schedule: {
              startDate: startDate,
              endDate: endDate,
              length: schedules.length
            }
          });
          this.gridSchedule.refreshData(startDate, endDate, schedules, schedulesAttendanceStudent);

        } else {
          this.gridSchedule.refreshData();
        }
      }
    }

  };

  form.switchToViewMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridSchedule.setEditable(false);

    this.refreshSchedule();
  };

});



define.form('component.form.student-course.CourseGrade', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'course',
      action: 'grade',
    }
  };

  form.tmpl = 'form.student-course.grade';

  form.formType = form.FormType.Form.LIST;

  form.ServiceProxy = {
    proxy: require('proxy.student.CourseOfStudent'),
    method: 'getCourseGrade',
    entityMap: 'CourseGradeEntityMap'
  };

  form.exportConfig = require('export.student.CourseGrade');

  form.refreshData = function (params) {
    var courseId = params.id;

    this.grid.setParams('courseId', courseId);

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr(course);
    }
  }

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('gradeCategory.gradeCategoryName'),
      dataField: 'gradeCategoryName',
      cellsRenderer: function (row, columnField, value) {
        if (!row.gradeCategoryCode) {
          return row.gradeCategoryName;
        }

        return Lang.get('gradeCategory.nameAndCode', {
          gradeCategoryCode: row.gradeCategoryCode,
          gradeCategoryName: row.gradeCategoryName
        });
      }
    }, {
      text: Lang.get('gradeCategory.weight'),
      dataField: 'weight',
    }, {
      text: Lang.get('grade.value'),
      dataField: 'value'
    }];

    var gridConfig = {
      columns: gridColumns,
      singleSelection: true,
      filterable: false,
      sortable: false,
      pageable: false,

      events: {
        processData: this.proxy(this.processData)
      }
    };

    return gridConfig;

  };

  form.processData = function (data, originalData) {
    var totalGrade = 0;
    var totalWeight = 0;

    var isCompleted = true;

    for (var i = 0, len = data.length; i < len; i++) {
      var grade = data[i];

      if (grade.value === 0 || grade.value) {
        totalWeight += grade.weight;

        totalGrade += grade.value * grade.weight;
      } else {
        isCompleted = false;
      }
    }

    var averageGrade = totalGrade / totalWeight;

    var totalText = isCompleted ? Lang.get('grade.averageGrade') : Lang.get('grade.accumulationGrade');

    var aggregateItem = {
      gradeCategoryName: '<span class="average-grade">' + Lang.get('grade.averageGrade') + '</span>',
      value: '<span class="average-grade">' + (isNaN(averageGrade) ? '' : averageGrade.toFixed(2)) + '</span>',
    }

    data.push(aggregateItem);

    originalData.items = data;
    originalData.total = data.length;
  };

});



define.form('component.form.student-course.ListCourse', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'student-course'
    }
  };

  form.ServiceProxy = {
    proxy: require('proxy.Course'),
    method: 'findCourseStudent',
    entityMap: 'StudentCourseEntityMap'
  };

  form.tmpl = 'form.student-course.list-course';

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('course.courseId'),
        dataField: 'courseId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 100,
        hidden: false
      }, {
        text: Lang.get('course.courseName'),
        dataField: 'courseName',
      }, {
        text: Lang.get('course.numberOfCredits'),
        dataField: 'numberOfCredits',
      }, {
        text: Lang.get('class.className'),
        dataField: 'className',
      }, {
        text: Lang.get('term.termName'),
        dataField: 'termName',
      }, {
        text: Lang.get('major.majorName'),
        dataField: 'majorName'
      }, {
        text: Lang.get('subject.subjectName'),
        dataField: 'subjectName'
      }, {
        text: Lang.get('course.subjectVersion'),
        dataField: 'description'
      },
        //    {
        //     text: Lang.get('lecture.lectureName'),
        //     dataField: 'lectureName'
        //    }
      ];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define.form('component.form.summary-grade.summary-grade', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'summary-grade'
    }
  };

  form.ServiceProxy = {
    proxy: require('proxy.Grade'),
    method: 'getSumaryGrade'
  };

  form.tmpl = 'form.summary-grade.summary-grade';

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var GradeStatus = require('enum.GradeStatus');

    var gridColumns = [{
      text: Lang.get('course.courseId'),
      dataField: 'courseId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('course.courseName'),
      dataField: 'courseName',
    }, {
      text: Lang.get('course.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('course.numberOfCredits'),
      dataField: 'numberOfCredits',
    }, {
      text: Lang.get('course.finalSubjectGrade'),
      dataField: 'finalSubjectGrade',
    }, {
      text: Lang.get('course.resultSubject'),
      dataField: 'resultSubject',
      width: 100,

      cellsRenderer: function (row, columnField, value) {
        switch (value) {
        case GradeStatus.PASS:
          var text = Lang.get('grade.status.pass');
          text = '<span class="grade-status grade-status-pass">' + text + '</span>';

          break;
        case GradeStatus.FAIL:
          var text = Lang.get('grade.status.fail');
          text = '<span class="grade-status grade-status-fail">' + text + '</span>';

          break;
        case GradeStatus.UNFINISHED:
          var text = Lang.get('grade.status.unfinished');
          text = '<span class="grade-status grade-status-unfinished">' + text + '</span>';

          break;
        }

        return text;
      }
    }];

    var gridConfig = {
      columns: gridColumns,
      singleSelection: true,
      filterable: false,
      sortable: false,
      pageable: false,

      events: {
        processData: this.proxy(this.processData)
      }
    };

    return gridConfig;

  };

  form.processData = function (data, originalData) {
    var averageGrade = originalData.data && originalData.data.averageGrade;
    var totalCredits = originalData.data && originalData.data.totalCredits;
    var totalCreditFailed = originalData.data && originalData.data.totalCreditFailed;

    this.data.attr('displayAverageGrade', averageGrade != null);

    this.data.attr('averageGrade', averageGrade);
    this.data.attr('totalCredits', totalCredits);
    this.data.attr('totalCreditFailed', totalCreditFailed);
  };

  form.initForm = function () {

    // bind event handlers to elements
    this.element.find('#button-view-summary-grade').click(this.proxy(this.viewSummaryGrade));
  };

  // init form data
  form.initData = function () {

    var componentSettings = {
      termId: {
        ServiceProxy: require('proxy.Term'),
        combobox: {
          valueMember: 'termId',
          displayMember: 'termName'
        }
      }
    };

    var data = {
      componentSettings: componentSettings
    };

    this.data.attr(data);
  };

  form.viewSummaryGrade = function () {

    var termId = this.data.attr('termId');

    this.grid.setFilterConditions('termId', termId);

  };

});



define.form('component.form.view-course.CourseGrade', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-course/grade/:id
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'view-course',
      action: 'grade'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.view-course.course-grade';

  // the form type is FORM
  form.formType = form.FormType.FORM;

  form.initForm = function () {
    var GradeGridComponent = require('component.common.GradeGrid');

    this.gridGrade = new GradeGridComponent(this.element.find('#grid-course-grade'));

    // bind event handlers to elements
    this.element.find('#button-update-grade').click(this.proxy(this.updateGrade));

    this.element.find('#button-reject-changes').click(this.proxy(this.rejectChanges));
    this.element.find('#button-edit-grade').click(this.proxy(this.editGrade));
  };

  form.refreshData = function (data) {
    this.courseId = data.id;

    this.switchToLockedMode();

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: this.courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr({
        course: course
      });

      this.refreshGrade();
    }

  };

  form.refreshGrade = function () {

    if (!this.courseId) return;

    var GradeProxy = require('proxy.Grade');

    var data = {
      courseId: this.courseId
    };

    GradeProxy.getCourseGrade(data, this.proxy(getCourseGradeDone));

    function getCourseGradeDone(serviceResponse) {

      if (serviceResponse.hasError()) {
        this.gridGrade.refreshData();
        return;
      }

      var gradeData = serviceResponse.getData();

      if (gradeData.isLocked) {
        this.switchToLockedMode();
      } else if (gradeData.grades && gradeData.grades.length) {
        this.switchToViewMode();
      } else {
        this.switchToEditMode();
      }

      this.gridGrade.refreshData(gradeData);

    }

  };

  form.updateGrade = function () {

    var courseId = this.courseId;
    var gradeData = this.gridGrade.getGradeData();

    if (!gradeData.length) return;

    var GradeProxy = require('proxy.Grade');

    var data = {
      courseId: courseId,
      gradeData: gradeData
    };

    GradeProxy.updateCourseGrade(data, this.proxy(updateCourseGradeDone));

    function updateCourseGradeDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.refreshGrade();
    }
  };

  form.editGrade = function () {
    this.switchToEditMode();
  };

  form.rejectChanges = function () {
    this.switchToViewMode();
    this.refreshGrade();
  };

  form.switchToLockedMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // hide all view toolbar component
    this.element.find('[data-component-group=view]').hide();

    // disable grid editable
    this.gridGrade.setEditable(false);
  };

  form.switchToViewMode = function () {
    // hide all edit toolbar component
    this.element.find('[data-component-group=edit]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=view]').show();

    // disable grid editable
    this.gridGrade.setEditable(false);
  };

  form.switchToEditMode = function () {
    // hide all edit component
    this.element.find('[data-component-group=view]').hide();

    // show all view toolbar component
    this.element.find('[data-component-group=edit]').show();

    // enable grid editable
    this.gridGrade.setEditable(true);
  };

});



/*
 * System          : 3connected
 * Component       : Student View Course
 * Creator         : ThanhVM
 */
define.form('component.form.view-course.ListCourse', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'view-course'
    }
  };

  form.ServiceProxy = require('proxy.Course');

  form.tmpl = 'form.view-course.list-course';

  form.formType = form.FormType.Form.LIST;

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('course.courseId'),
        dataField: 'courseId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 100,
        hidden: false
      }, {
        text: Lang.get('course.courseName'),
        dataField: 'courseName',
      }, {
        text: Lang.get('course.numberOfCredits'),
        dataField: 'numberOfCredits',
      }, {
        text: Lang.get('class.className'),
        dataField: 'className',
      }, {
        text: Lang.get('term.termName'),
        dataField: 'termName',
      }, {
        text: Lang.get('major.majorName'),
        dataField: 'majorName'
      }, {
        text: Lang.get('subject.subjectName'),
        dataField: 'subjectName'
      }, {
        text: Lang.get('course.subjectVersion'),
        dataField: 'description'
      },
 //    {
 //     text: Lang.get('lecture.lectureName'),
 //     dataField: 'lectureName'
 //    }
      ];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});



define('validator.rule.Account', function (module, require) {

  var ruleAccountId = {
    // validate for accountId
    attribute: 'accountId',
    attributeName: 'account.accountId',
    rules: [
      {
        // accountId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleUsername = {
    // validate for username
    attribute: 'username',
    attributeName: 'account.username',
    rules: [
      {
        // username is required
        rule: 'required'
      },
      {
        // username maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var rulePassword = {
    // validate for username
    attribute: 'password',
    attributeName: 'account.password',
    rules: [
      {
        // username is required
        rule: 'required'
      },
      {
        // username maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleConfirmPassword = {
    // validate for username
    attribute: 'confirmPassword',
    attributeName: 'account.confirmPassword',
    rules: [
      {
        // username is required
        rule: 'required'
      },
      {
        // username maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      },
      {
        rule: 'equal',
        ruleData: {
          attribute: 'password'
        }
      }
    ]
  };

  var ruleCreateAccount = [
    ruleUsername,
  ];

  var ruleResetPassword = [
    ruleAccountId,
    rulePassword,
    ruleConfirmPassword
  ];

  var ruleUpdateAccount = [
    ruleAccountId,
  ].concat(ruleCreateAccount);

  var ruleAccount = {
    create: ruleCreateAccount,
    update: ruleUpdateAccount,
    resetPassword: ruleResetPassword
  };

  module.exports = ruleAccount;

});



define('validator.rule.Batch', function (module, require) {

  var ruleBatchId = {
    // validate for batchId
    attribute: 'batchId',
    attributeName: 'batch.batchId',
    rules: [
      {
        // batchId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleBatchName = {
    // validate for batchName
    attribute: 'batchName',
    attributeName: 'batch.batchName',
    rules: [
      {
        // batchName is required
        rule: 'required'
      },
      {
        // batchName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateBatch = [
    ruleBatchName
  ];

  var ruleUpdateBatch = [
    ruleBatchId,
  ].concat(ruleCreateBatch);

  var ruleBatch = {
    create: ruleCreateBatch,
    update: ruleUpdateBatch
  };

  module.exports = ruleBatch;

});



define('validator.rule.Class', function (module, require) {

  var ruleClassId = {
    // validate for classId
    attribute: 'classId',
    attributeName: 'class.classId',
    rules: [
      {
        // classId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleClassName = {
    // validate for className
    attribute: 'className',
    attributeName: 'class.className',
    rules: [
      {
        // className is required
        rule: 'required'
      },
      {
        // className maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateClass = [
    ruleClassName
  ];

  var ruleUpdateClass = [
    ruleClassId,
  ].concat(ruleCreateClass);

  var ruleClass = {
    create: ruleCreateClass,
    update: ruleUpdateClass
  };

  module.exports = ruleClass;

});



/*
 * System          : 3connected
 * Component       : Course validator
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */

define('validator.rule.Course', function (module, require) {

  var ruleCourseId = {
    // validate for courseId
    attribute: 'courseId',
    attributeName: 'course.courseId',
    rules: [
      {
        // courseId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleCourseName = {
    // validate for courseName
    attribute: 'courseName',
    attributeName: 'course.courseName',
    rules: [
      {
        // courseName is required
        rule: 'required'
      }
    ]
  };

  var ruleCreateCourse = [
    ruleCourseName
  ];

  var ruleUpdateCourse = [
    ruleCourseId,
  ].concat(ruleCreateCourse);

  var ruleCourse = {
    create: ruleCreateCourse,
    update: ruleUpdateCourse
  };

  module.exports = ruleCourse;

});



//ThanhVMSE90059
define('validator.rule.Department', function (module, require) {

  var ruleDepartmentId = {
    // validate for departmentId
    attribute: 'departmentId',
    attributeName: 'department.departmentId',
    rules: [
      {
        // departmentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleDepartmentName = {
    // validate for departmentName
    attribute: 'departmentName',
    attributeName: 'department.departmentName',
    rules: [
      {
        // departmentName is required
        rule: 'required'
      },
      {
        // departmentName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateDepartment = [
    ruleDepartmentName
  ];

  var ruleUpdateDepartment = [
    ruleDepartmentId,
  ].concat(ruleCreateDepartment);

  var ruleDepartment = {
    create: ruleCreateDepartment,
    update: ruleUpdateDepartment
  };

  module.exports = ruleDepartment;

});



define('validator.rule.GradeCategory', function (module, require) {

  var ruleGradeCategoryId = {
    // validate for grade category id
    attribute: 'gradeCategoryId',
    attributeName: 'gradeCategory.gradeCategoryId',
    rules: [
      {
        // GradeCategoryId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleMinimumGrade = {
    // validate for grade category id
    attribute: 'minimumGrade',
    attributeName: 'gradeCategory.minimumGrade',
    rules: [
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleGradeCategoryCode = {
    // validate for grade category code
    attribute: 'gradeCategoryCode',
    attributeName: 'gradeCategory.gradeCategoryCode',
    rules: [
      {
        // grade-categoryCode is required
        rule: 'required'
      },
      {
        // grade-categoryCode max len is 20
        rule: 'maxLength',
        ruleData: {
          maxLength: 20
        }
      }
     ]
  };

  var ruleGradeCategoryName = {
    // validate for grade category name
    attribute: 'gradeCategoryName',
    attributeName: 'gradeCategory.gradeCategoryName',
    rules: [
      {
        // GradeCategoryName is required
        rule: 'required'
      },
      {
        // GradeCategoryName max length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
     ]
  };


  var ruleWeight = {
    // validate for weight
    attribute: 'weight',
    attributeName: 'gradeCategory.weight',
    rules: [
      {
        // weight is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleSubjectVersionId = {
    // validate for subject version id
    attribute: 'subjectVersionId',
    attributeName: 'subject.subjectVersionId',
    rules: [
      {
        // subjectVersionId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };


  var ruleCreateGradeCategory = [
    ruleSubjectVersionId,
    ruleGradeCategoryCode,
    ruleGradeCategoryName,
    ruleGradeCategoryName,
    ruleWeight

  ];

  var ruleUpdateGradeCategory = [
    ruleGradeCategoryId,
  ].concat(ruleCreateGradeCategory);

  var ruleGradeCategory = {
    create: ruleCreateGradeCategory,
    update: ruleUpdateGradeCategory
  };

  module.exports = ruleGradeCategory;

});



define('validator.rule.Major', function (module, require) {

  var ruleMajorId = {
    // validate for majorId
    attribute: 'majorId',
    attributeName: 'major.majorId',
    rules: [
      {
        // majorId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleMajorName = {
    // validate for majorName
    attribute: 'majorName',
    attributeName: 'major.majorName',
    rules: [
      {
        // majorName is required
        rule: 'required'
      },
      {
        // majorName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateMajor = [
    ruleMajorName
  ];

  var ruleUpdateMajor = [
    ruleMajorId,
  ].concat(ruleCreateMajor);

  var ruleMajor = {
    create: ruleCreateMajor,
    update: ruleUpdateMajor
  };

  module.exports = ruleMajor;

});



define('validator.rule.NewsCategory', function (module, require) {

  var ruleNewsCategoryId = {
    // validate for newsCategoryId
    attribute: 'newsCategoryId',
    attributeName: 'newsCategory.newsCategoryId',
    rules: [
      {
        // newsCategoryId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleNewsCategoryName = {
    // validate for newsCategoryName
    attribute: 'newsCategoryName',
    attributeName: 'newsCategory.newsCategoryName',
    rules: [
      {
        // newsCategoryName is required
        rule: 'required'
      },
      {
        // newsCategoryName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateNewsCategory = [
    ruleNewsCategoryName
  ];

  var ruleUpdateNewsCategory = [
    ruleNewsCategoryId,
  ].concat(ruleCreateNewsCategory);

  var ruleNewsCategory = {
    create: ruleCreateNewsCategory,
    update: ruleUpdateNewsCategory
  };

  module.exports = ruleNewsCategory;

});



define('validator.rule.News', function (module, require) {

  var ruleNewsId = {
    // validate for newsId
    attribute: 'newsId',
    attributeName: 'news.newsId',
    rules: [
      {
        // newsId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleNewsTitle = {
    // validate for title
    attribute: 'title',
    attributeName: 'news.title',
    rules: [
      {
        // title is required
        rule: 'required'
      },
      {
        // title maximum length is 200
        rule: 'maxLength',
        ruleData: {
          maxLength: 200
        }
      }
    ]
  };

  var ruleNewsContent = {
    // validate for content
    attribute: 'content',
    attributeName: 'news.content',
    rules: [
      {
        // content is required
        rule: 'required'
      }
    ]
  };

  var ruleNewsCategories = {
    // validate for categoryIds
    attribute: 'categoryIds',
    attributeName: 'news.categories',
    rules: [
      {
        // categoryIds is required
        rule: 'required'
      }
    ]
  };

  var ruleCreateNews = [
    ruleNewsTitle,
    ruleNewsContent,
    ruleNewsCategories
  ];

  var ruleUpdateNews = [
    ruleNewsId,
  ].concat(ruleCreateNews);

  var ruleNews = {
    create: ruleCreateNews,
    update: ruleUpdateNews
  };

  module.exports = ruleNews;

});



define('validator.rule.Parent', function (module, require) {

  var Gender = require('enum.Gender');

  var ruleStudentId = {
    // validate for studentId
    attribute: 'studentId',
    attributeName: 'student.studentId',
    rules: [
      {
        // studentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleParentId = {
    // validate for studentId
    attribute: 'parentId',
    attributeName: 'parent.parentId',
    rules: [
      {
        // studentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleFirstName = {
    // validate for firstName
    attribute: 'firstName',
    attributeName: 'parent.firstName',
    rules: [
      {
        // firstName is required
        rule: 'required'
      },
      {
        // firstName max length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
     ]
  };

  var ruleLastName = {
    // validate for lastName
    attribute: 'lastName',
    attributeName: 'parent.lastName',
    rules: [
      {
        // lastName is required
        rule: 'required'
      },
      {
        // lastName max length is 100
        rule: 'maxLength',
        ruleData: {
          maxLength: 100
        }
      }
     ]
  };

  var ruleRelationship = {
    // validate for lastName
    attribute: 'relationship',
    attributeName: 'parent.relationship',
    rules: [
      {
        // lastName is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleGender = {
    // validate for gender
    attribute: 'gender',
    attributeName: 'parent.gender',
    rules: [
      {
        // classId is required
        rule: 'required'
      },
      {
        rule: 'in',
        ruleData: {
          items: [Gender.UNKNOWN, Gender.MALE, Gender.FEMALE]
        }
      }
     ]
  };

  var rulePhoneNumber = {
    // validate for studentId
    attribute: 'phoneNumber',
    attributeName: 'parent.phoneNumber',
    rules: [
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleCreateParent = [
    ruleStudentId,
    ruleFirstName,
    ruleLastName,
    rulePhoneNumber,
    ruleRelationship
  ];

  var ruleUpdateParent = [
    ruleParentId,
  ].concat(ruleCreateParent);

  var ruleParent = {
    create: ruleCreateParent,
    update: ruleUpdateParent
  };

  module.exports = ruleParent;

});



define('validator.rule.Profile', function (module, require) {

  var ruleAccountId = {
    // validate for accountId
    attribute: 'accountId',
    attributeName: 'account.accountId',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleCurrentPassword = {
    // validate for currentPassword
    attribute: 'currentPassword',
    attributeName: 'account.currentPassword',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var rulePassword = {
    // validate for password
    attribute: 'password',
    attributeName: 'account.password',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleConfirmPassword = {
    // validate for confirmPassword
    attribute: 'confirmPassword',
    attributeName: 'account.confirmPassword',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      },
      {
        rule: 'equal',
        ruleData: {
          attribute: 'password'
        }
      }
    ]
  };

  var ruleChangePassword = [
    ruleAccountId,
    ruleCurrentPassword,
    rulePassword,
    ruleConfirmPassword
  ];

  var ruleProfile = {
    changePassword: ruleChangePassword
  };

  module.exports = ruleProfile;

});



define('validator.rule.Staff', function (module, require) {

  var ruleStaffId = {
    // validate for staffId
    attribute: 'staffId',
    attributeName: 'staff.staffId',
    rules: [
      {
        // studentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleStaffCode = {
    // validate for firstName
    attribute: 'staffCode',
    attributeName: 'staff.staffCode',
    rules: [
      {
        // firstName is required
        rule: 'required'
      },
      {
        // firstName max length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
     ]
  };

  var ruleFirstName = {
    // validate for firstName
    attribute: 'firstName',
    attributeName: 'staff.firstName',
    rules: [
      {
        // firstName is required
        rule: 'required'
      },
      {
        // firstName max length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
     ]
  };

  var ruleLastName = {
    // validate for lastName
    attribute: 'lastName',
    attributeName: 'staff.lastName',
    rules: [
      {
        // lastName is required
        rule: 'required'
      },
      {
        // lastName max length is 100
        rule: 'maxLength',
        ruleData: {
          maxLength: 100
        }
      }
     ]
  };

  var ruleDepartmentId = {
    // validate for departmentId
    attribute: 'departmentId',
    attributeName: 'staff.departmentId',
    rules: [
      {
        // departmentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleCreateStaff = [
    ruleStaffCode,
    ruleFirstName,
    ruleLastName
  ];

  var ruleUpdateStaff = [
    ruleStaffId,
  ].concat(ruleCreateStaff);

  var ruleStaff = {
    create: ruleCreateStaff,
    update: ruleUpdateStaff
  };

  module.exports = ruleStaff;

});



define('validator.rule.Student', function (module, require) {

  var Gender = require('enum.Gender');

  var ruleStudentId = {
    // validate for studentId
    attribute: 'studentId',
    attributeName: 'student.studentId',
    rules: [
      {
        // studentId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleStudentCode = {
    // validate for studentCode
    attribute: 'studentCode',
    attributeName: 'student.studentCode',
    rules: [
      {
        // studentCode is required
        rule: 'required'
      },
      {
        // studentCode max len is 20
        rule: 'maxLength',
        ruleData: {
          maxLength: 20
        }
      }
     ]
  };

  var ruleFirstName = {
    // validate for firstName
    attribute: 'firstName',
    attributeName: 'student.firstName',
    rules: [
      {
        // firstName is required
        rule: 'required'
      },
      {
        // firstName max length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
     ]
  };

  var ruleLastName = {
    // validate for lastName
    attribute: 'lastName',
    attributeName: 'student.lastName',
    rules: [
      {
        // lastName is required
        rule: 'required'
      },
      {
        // lastName max length is 100
        rule: 'maxLength',
        ruleData: {
          maxLength: 100
        }
      }
     ]
  };

  var ruleClassId = {
    // validate for classId
    attribute: 'classId',
    attributeName: 'student.classId',
    rules: [
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleGender = {
    // validate for gender
    attribute: 'gender',
    attributeName: 'student.classId',
    rules: [
      {
        // classId is required
        rule: 'required'
      },
      {
        rule: 'in',
        ruleData: {
          items: [Gender.UNKNOWN, Gender.MALE, Gender.FEMALE]
        }
      }
     ]
  };

  var ruleCreateStudent = [
    ruleStudentCode,
    ruleFirstName,
    ruleLastName
  ];

  var ruleUpdateStudent = [
    ruleStudentId,
  ].concat(ruleCreateStudent);

  var ruleStudent = {
    create: ruleCreateStudent,
    update: ruleUpdateStudent
  };

  module.exports = ruleStudent;

});



define('validator.rule.SubjectVersion', function (module, require) {

  var ruleSubjectVersionId = {
    // validate for grade category id
    attribute: 'subjectVersionId',
    attributeName: 'subjectVersion.subjectVersionId',
    rules: [
      {
        rule: 'required'
            },
      {
        rule: 'positiveInteger'
            }
        ]
  };

  var ruleSubjectId = {
    attribute: 'subjectId',
    attributeName: 'subject.subjectId',
    rules: [
      {
        rule: 'required'
            },
      {
        rule: 'positiveInteger'
            }
        ]
  };

  var ruleDescription = {
    // validate for grade category name
    attribute: 'description',
    attributeName: 'subjectVersion.description',
    rules: [
      {
        rule: 'required'
      },
      {
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
     ]
  };

  var ruleCreateSubjectVersion = [
    ruleSubjectId,
    ruleDescription
  ];

  var ruleUpdateSubjectVersion = [
    ruleSubjectVersionId,
  ].concat(ruleCreateSubjectVersion);

  var ruleSubjectVersion = {
    create: ruleCreateSubjectVersion,
    update: ruleUpdateSubjectVersion
  };

  module.exports = ruleSubjectVersion;

});



/*
 * System          : 3connected
 * Component       : Subject validator
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */

define('validator.rule.Subject', function (module, require) {

  var ruleSubjectId = {
    // validate for subjectId
    attribute: 'subjectId',
    attributeName: 'subject.subjectId',
    rules: [
      {
        // subjectId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleSubjectCode = {
    // validate for subjectName
    attribute: 'subjectCode',
    attributeName: 'subject.subjectCode',
    rules: [
      {
        // subjectName is required
        rule: 'required'
      },
      {
        // subjectName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 6
        }
      }
    ]
  };

  var ruleSubjectName = {
    // validate for subjectName
    attribute: 'subjectName',
    attributeName: 'subject.subjectName',
    rules: [
      {
        // subjectName is required
        rule: 'required'
      },
      {
        // subjectName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleNumberOfCredits = {
    // validate for subjectId
    attribute: 'numberOfCredits',
    attributeName: 'subject.numberOfCredits',
    rules: [
      {
        // subjectId is required
        rule: 'required'
      }
     ]
  };

  var ruleCreateSubject = [
    ruleSubjectCode,
    ruleSubjectName,
    ruleNumberOfCredits
  ];

  var ruleUpdateSubject = [
    ruleSubjectId,
  ].concat(ruleCreateSubject);

  var ruleSubject = {
    create: ruleCreateSubject,
    update: ruleUpdateSubject
  };

  module.exports = ruleSubject;

});



define('validator.rule.Term', function (module, require) {

  var ruleTermId = {
    // validate for termId
    attribute: 'termId',
    attributeName: 'term.termId',
    rules: [
      {
        // termId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleTermName = {
    // validate for termName
    attribute: 'termName',
    attributeName: 'term.termName',
    rules: [
      {
        // termName is required
        rule: 'required'
      },
      {
        // termName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateTerm = [
    ruleTermName
  ];

  var ruleUpdateTerm = [
    ruleTermId,
  ].concat(ruleCreateTerm);

  var ruleTerm = {
    create: ruleCreateTerm,
    update: ruleUpdateTerm
  };

  module.exports = ruleTerm;

});



define('export.Account', function (module, require) {

  module.exports = {

    fileName: 'Account',
    sheetName: 'Account',

    columns: {

      accountId: {
        width: 10
      },
      username: {
        width: 50
      },
      password: {
        width: 50
      },
      role: {
        width: 50
      },
      userInformationId: {
        width: 50
      },
      isActive: {
        width: 50
      },
      effectiveDate: {
        width: 50
      },
      expireDate: {
        width: 50
      }

    }

  };

});



define('export.AttendanceStatistic', function (module, require) {

  module.exports = {

    fileName: 'AttendanceStatistic',
    sheetName: 'AttendanceStatistic',

    columns: {

      studentId: {
        width: 10
      },
      firstName: {
        width: 30
      },
      lastName: {
        width: 30
      },
      totalAbsent: {
        width: 15
      },
      totalPresent: {
        width: 15
      },
      totalSlots: {
        width: 15
      },
      percentAbsent: {
        width: 17
      }


    }

  };

});



define('export.Attendance', function (module, require) {

  module.exports = {

    fileName: 'Attendance',
    sheetName: 'Attendance',

    columns: {

      studentCode: {
        width: 10
      },
      firstName: {
        width: 30
      },
      lastName: {
        width: 50
      },
      totalPresents: {
        width: 20
      },
      totalAbsents: {
        width: 20
      },
      totalUnattended: {
        width: 20
      }

    }

  };

});



define('export.Batch', function (module, require) {

  module.exports = {

    fileName: 'Batch',
    sheetName: 'Batch',

    columns: {

      batchId: {
        width: 10
      },
      batchName: {
        width: 50
      }

    }

  };

});



define('export.Class', function (module, require) {

  module.exports = {

    fileName: 'Class',
    sheetName: 'Class',

    columns: {

      classId: {
        width: 10
      },
      className: {
        width: 50
      },
      batchName: {
        width: 50
      },
      majorName: {
        width: 50
      }

    }

  };

});



//ThanhVMSE90059
define('export.Department', function (module, require) {

  module.exports = {

    fileName: 'Department',
    sheetName: 'Department',

    columns: {

      termId: {
        width: 10
      },
      termName: {
        width: 50
      }

    }

  };

});



define('export.GradeStudentStatistic', function (module, require) {

  module.exports = {

    fileName: 'GradeStudentStatistic',
    sheetName: 'GradeStudentStatistic',

    columns: {

      courseId: {
        width: 10
      },
      courseName: {
        width: 30
      },
      subjectName: {
        width: 30
      },
      termName: {
        width: 30
      },
      numberOfCredits: {
        width: 15
      },
      finalSubjectGrade: {
        width: 15
      },
      resultSubject: {
        width: 15
      }


    }

  };

});



define('export.Major', function (module, require) {

  module.exports = {

    fileName: 'Major',
    sheetName: 'Major',

    columns: {

      majorId: {
        width: 10
      },
      majorName: {
        width: 50
      }

    }

  };

});



define('export.NewsCategory', function (module, require) {

  module.exports = {

    fileName: 'NewsCategory',
    sheetName: 'NewsCategory',

    columns: {

      newsCategoryId: {
        width: 10
      },
      newsCategoryName: {
        width: 50
      }

    }

  };

});



define('export.Staff', function (module, require) {

  module.exports = {

    fileName: 'Staff',
    sheetName: 'Staff',

    columns: {

      staffId: {
        width: 15
      },
      staffCode: {
        width: 20
      },
      firstName: {
        width: 20
      },
      lastName: {
        width: 30
      },
      departmentName: {
        width: 10
      },
      gender: {
        width: 10
      },
      dateOfBirth: {
        width: 20
      },
      address: {
        width: 50
      },
      email: {
        width: 40
      }

    }

  };

});



define('export.student.CourseGrade', function (module, require) {

  module.exports = {

    fileName: 'Course Grade',
    sheetName: 'Course Grade',

    columns: {

      gradeCategoryName: {
        width: 30
      },
      weight: {
        width: 15
      },
      value: {
        width: 15
      }

    }

  };

});



define('export.Student', function (module, require) {

  module.exports = {

    fileName: 'Student',
    sheetName: 'Student',

    columns: {

      studentId: {
        width: 15
      },
      studentCode: {
        width: 20
      },
      firstName: {
        width: 20
      },
      lastName: {
        width: 30
      },
      className: {
        width: 10
      },
      batchName: {
        width: 15
      },
      majorName: {
        width: 15
      },
      gender: {
        width: 10
      },
      dateOfBirth: {
        width: 20
      },
      address: {
        width: 50
      },
      email: {
        width: 40
      }

    }

  };

});



/*
 * System          : 3connected
 * Component       : Subject export configuration
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define('export.Subject', function (module, require) {

  module.exports = {

    fileName: 'Subject',
    sheetName: 'Subject',

    columns: {

      subjectId: {
        width: 10
      },
      subjectCode: {
        width: 20
      },
      subjectName: {
        width: 50
      },
      numberOfCredits: {
        width: 10
      }

    }

  };

});



define('export.Term', function (module, require) {

  module.exports = {

    fileName: 'Term',
    sheetName: 'Term',

    columns: {

      termId: {
        width: 10
      },
      termName: {
        width: 50
      }

    }

  };

});



define('enum.Attendance', function (module, require) {

  var Attendance = {
    UNATTENDED: 0,
    PRESENT: 1,
    ABSENT: 2
  };

  module.exports = Attendance;

});



define('constant.DateTime', function (module, require) {

  var DateTime = {
    // date time format follow Moment
    Format: {
      DATE: 'DD/MM/YYYY',
      DAY_OF_WEEK: 'DD/MM/YYYY (dddd)',
      EXPORT_DATE_TIME: '',
    },

    WidgetFormat: {
      DATE: 'dd/MM/yyyy',
      DAY_TIME: 'dd/MM/yyyy HH:mm',
      DAY_OF_WEEK: 'dd/MM/yyyy (dddd)'
    }
  };

  module.exports = DateTime;

});



define('enum.Gender', function (module, require) {

  var Gender = {
    UNKNOWN: 0,
    MALE: 1,
    FEMALE: 2
  };

  module.exports = Gender;

});



define('enum.GradeStatus', function (module, require) {

  var GradeStatus = {
    UNKNOWN: 0,
    PASS: 1,
    FAIL: 2,
    UNFINISHED: 3
  };

  module.exports = GradeStatus;

});

define('constant.Grade', function (module, require) {

  var GradeConstant = {
    PASS_GRADE: 5
  };

  module.exports = GradeConstant;

});



define('enum.NotificationType', function (module, require) {

  var NotificationType = {
    ALL: 0,
    GRADE: 1,
    ATTENDANCE: 2,
    NEWS: 3
  };

  module.exports = NotificationType;

});

define('enum.NotifyFor', function (module, require) {

  var NotifyFor = {
    STUDENT: 1,
    PARENT: 2
  };

  module.exports = NotifyFor;

});



define('enum.Relationship', function (module, require) {

  var Relationship = {
    UNKNOWN: 0,
    OTHER: 1,
    FATHER: 2,
    MOTHER: 3,
    GRAND_FATHER: 4,
    GRAND_MOTHER: 5,
    GODPARENT: 6
  };

  module.exports = Relationship;

});



define('enum.Role', function (module, require) {

  var Role = {
    UNKNOWN: 0,
    ADMINISTRATOR: 1,
    EDUCATOR: 2,
    EXAMINATOR: 3,
    NEWS_MANAGER: 4,
    STUDENT: 5,
    PARENT: 6,
    TEACHER: 7,
  };

  Role.isAdministrator = function (role) {
    return role === Role.ADMINISTRATOR;
  };

  Role.isEducator = function (role) {
    return role === Role.EDUCATOR;
  };

  Role.isExaminator = function (role) {
    return role === Role.EXAMINATOR;
  };

  Role.isTeacher = function (role) {
    return role === Role.TEACHER;
  };

  Role.isNewsManager = function (role) {
    return role === Role.NEWS_MANAGER;
  };

  Role.isStudent = function (role) {
    return role === Role.STUDENT;
  };

  Role.isParent = function (role) {
    return role === Role.PARENT;
  };

  Role.isStudentOrParent = function (role) {
    return Role.isStudent(role) || Role.isParent(role);
  };

  Role.isStaff = function (role) {
    return Role.isEducator(role) || Role.isExaminator(role) || Role.isNewsManager(role) || Role.isTeacher(role);
  };

  Role.isAdministratorOrStaff = function (role) {
    return Role.isAdministrator(role) || Role.isStaff(role);
  };

  module.exports = Role;

});



define('enum.StatisticType', function (module, require) {

  var StatisticType = {
    AVERAGE_GRADE: 1,
    ACCUMULATION_GRADE: 2,
    TOTAL_CREDIT_PASS: 3,
    TOTAL_CREDIT_FAIL: 4,
    TOTAL_CREDIT_UNFINISHED: 5,
    TOTAL_CREDIT: 6
  };

  module.exports = StatisticType;

});
