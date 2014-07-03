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
