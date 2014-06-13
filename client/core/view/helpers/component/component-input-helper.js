define('core.view.helpers.component.InputHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  View.registerHelper('component.input', inputComponentHelper);

  function inputComponentHelper(options) {

    var attribute = options.hash.attribute;
    delete options.hash.attribute;

    var data = this;

    return function (element) {

      element = jQuery(element);

      var input = jQuery('<input />')
        .attr('data-attribute', attribute)
        .attr('data-component-role', 'input')
        .appendTo(element);

      var inputOptions = {
        width: '100%',
        height: '30px'
      };

      inputOptions = Util.Object.extend(inputOptions, options.hash);

      input.jqxInput(inputOptions);

      // tracking changes of input
      input.on('change', function () {
        data.attr(attribute, input.val());
      });

      // tracking changes of data
      data.bind('change', function (ev, attr, how, newVal, oldVal) {
        if (attr == attribute) {
          input.val(newVal);
        }
      });

    };

  }

});
