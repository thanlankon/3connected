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
