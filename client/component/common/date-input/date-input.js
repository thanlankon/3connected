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
        var date = ConvertUtil.DateTime.parseDate(newVal);
        // convert to UTC
        //        date = ConvertUtil.DateTime.toUTCDate(date);

        var dateUTC = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

        console.log(dateUTC);

        dateInput.jqxDateTimeInput('setDate', dateUTC);
      }

      trackingChange.data = false;
    });

  };

});
