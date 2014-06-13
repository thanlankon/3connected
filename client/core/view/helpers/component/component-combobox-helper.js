define('core.view.helpers.component.ComboboxHelper', function (module, require) {

  var View = require('core.view.View');
  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');

  View.registerHelper('component.combobox', comboboxComponentHelper);

  function comboboxComponentHelper(options) {

    var attribute = options.hash.attribute;
    var settings = options.hash.settings;

    options.hash = Util.Object.omit(options.hash, ['attribute', 'settings']);

    var data = this;

    settings = data.attr(settings);

    return function (element) {

      element = jQuery(element);

      var combobox = jQuery('<div />')
        .attr('data-attribute', attribute)
        .attr('data-component-role', 'combobox')
        .appendTo(element);

      var comboboxOptions = {
        width: '100%',
        height: '30px'
      };

      comboboxOptions = Util.Object.extend(comboboxOptions, options.hash);

      var ServiceProxy = settings.ServiceProxy;

      var source = {
        dataType: 'json',

        // service url
        url: ServiceProxy.findAll.url,

        // root element
        root: 'data.items',

        dataFields: ServiceProxy.EntityMap,

        // source mapping char
        mapChar: '.',
        mapchar: '.'
      };

      var dataAdapter = new jQuery.jqx.dataAdapter(source);

      comboboxOptions.source = dataAdapter;
      comboboxOptions.valueMember = settings.combobox.valueMember;
      comboboxOptions.displayMember = settings.combobox.displayMember;

      combobox.jqxComboBox(comboboxOptions);

      // tracking changes of combobox
      combobox.on('select', function (event) {
        var item = event.args.item;

        data.attr(attribute, item.value);
      });

      // tracking changes of data
      data.bind('change', function (ev, attr, how, newVal, oldVal) {
        if (attr == attribute) {
          if (newVal === null || newVal === undefined) {
            combobox.jqxComboBox('clearSelection');
          } else {
            var item = combobox.jqxComboBox('getItemByValue', newVal);
            combobox.jqxComboBox('selectItem', item);
          }
        }
      });

    };

  }

});
