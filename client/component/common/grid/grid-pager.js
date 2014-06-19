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
