//define.form('component.form.ManageStudent', function (form, require) {
//
//  form.urlMap = {
//    url: ':module',
//    data: {
//      module: 'manage-student'
//    }
//  };
//
//  form.tmpl = 'form.manage-student';
//
//  form.ready = function () {
//    //    this.element.find('#splitter-data-table').jqxSplitter({
//    //      width: '100%',
//    //      height: '100%',
//    //      splitBarSize: '10px',
//    //      resizable: false,
//    //      panels: [{
//    //        size: '250px'
//    //      }, {
//    //        collapsible: false
//    //      }]
//    //    });
//
//
//    var source = {
//      dataType: 'json',
//      //    id: 'StudentId',
//      dataFields: [
//        {
//          name: 'studentId',
//          type: 'string'
//        },
//        {
//          name: 'studentName',
//          type: 'number'
//        }
//    ],
//
//      url: 'api/student/all',
//
//      root: 'rows',
//
//      beforeprocessing: function (data) {
//        console.log(data);
//
//        source.totalrecords = data.count;
//      },
//
//      sort: this.proxy(sort)
//    };
//
//    var dataAdapter = new $.jqx.dataAdapter(source, {
//      loadComplete: function () {
//
//      },
//      beforeLoadComplete: function (data) {
//        //      console.log(data);
//        //      source.totalrecords = data.count;
//      }
//    });
//
//    function sort() {
//      this.element.find('#data-table').jqxGrid('updatebounddata', 'sort');
//    };
//
//    this.element.find('#data-table').jqxGrid({
//      source: dataAdapter,
//      pageable: true,
//      pageSize: 20,
//      sortable: true,
//      showFilterRow: true,
//      filterable: true,
//      virtualmode: true,
//      renderGridRows: function (params) {
//        return params.data;
//      },
//      width: '100%',
//      height: '100%',
//      scrollbarSize: 12,
//      scrollMode: 'logical',
//      pagermode: 'simple',
//      showemptyrow: false,
//      columns: [
//        {
//          text: 'Student Id',
//          hidden: false,
//          cellsAlign: 'left',
//          align: 'left',
//          dataField: 'studentId',
//          width: 280,
//          filterType: 'checkedlist'
//        },
//        {
//          text: 'Student Name',
//          cellsAlign: 'left',
//          align: 'left',
//          dataField: 'studentName'
//        }
//      ]
//    });
//
//    $('#data-table').on('cellClick', function (event) {
//      // event.args.rowindex is a bound index.
//      console.log("Row with bound index: " + event.args.rowindex + " has been clicked.");
//    });
//
//    //    this.element.find('#splitter').jqxSplitter({
//    //      width: '100%',
//    //      height: '100%',
//    //      orientation: 'horizontal',
//    //      splitBarSize: '4px',
//    //      resizable: false,
//    //      panels: [{
//    //        size: '50px'
//    //      }, {
//    //        collapsible: false
//    //      }]
//    //    });
//
//    //    function createElements() {
//    //      var $dialog = $('.dialog');
//    //      $dialog.jqxWindow({
//    //        height: '90%',
//    //        width: '500px',
//    //        maxHeight: '95%',
//    //        maxWidth: '80%',
//    //        position: 'center',
//    //        draggable: false,
//    //        resizable: false,
//    //        isModal: true,
//    //        modalOpacity: 0.8,
//    //        okButton: $('#ok'),
//    //        cancelButton: $('#cancel'),
//    //        initContent: function () {
//    //          console.log(arguments);
//    //          $dialog.find('.panel').jqxPanel({
//    //            width: '100%',
//    //            height: '100%',
//    //            sizeMode: "fixed",
//    //            autoUpdate: true
//    //          });
//    //        }
//    //      });
//    //    }
//    //
//    //    $(document).ready(function () {
//    //      createElements();
//    //    });
//
//  };
//
//});
