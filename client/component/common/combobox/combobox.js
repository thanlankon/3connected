define.component('component.common.Combobox', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var settingsAttribute = 'componentSettings.' + dataAttribute;
    var filtersAttribute = 'componentSettings.' + dataAttribute + '.filterConditions';

    var settings = componentData.attr(settingsAttribute);

    var combobox = this.combobox = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'combobox')
      .data('ComboBoxComponent', this)
      .appendTo(element.parent());

    element.remove();

    var comboboxOptions = {
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

    comboboxOptions.source = createDataAdapter(source);
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

      if (attr == filtersAttribute) {
        buildFilters(source, componentData, filtersAttribute);

        refreshSource(combobox, source);
      }

    });

  };

  component.refreshData = function () {
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
