define.component('component.common.Input', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var input = jQuery('<input />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'input')
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

    var inputOptions = {
      width: '100%',
      height: '30px'
    };

    inputOptions = Util.Object.extend(inputOptions, componentAttributes);

    input.jqxInput(inputOptions);

    // tracking changes of input
    input.on('change', function () {
      componentData.attr(dataAttribute, input.val().trim());
    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {
      if (attr == dataAttribute) {
        input.val(newVal);
      }
    });

  };

});
