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

    var comboboxOptions = {
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
