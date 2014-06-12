//define.service('service.Student', function (service, require, ServiceUtil, Util) {
//
//  service.map = {
//    url: '/student',
//
//    methods: {
//
//      getAllStudents: {
//        url: '/all',
//        httpMethod: 'GET'
//      },
//
//      createStudent: {
//        url: '/create',
//        httpMethod: 'GET'
//      },
//
//    }
//  };
//
//  var StudentModel = require('model.Student');
//  var Util = require('core.util.Util');
//
//  service.getAllStudents = function (req, res) {
//
//    var page = {
//      size: req.query.pagesize,
//      index: req.query.pagenum
//    };
//
//    var sort = null;
//
//    if (req.query.sortdatafield) {
//      sort = {
//        field: req.query.sortdatafield,
//        order: req.query.sortorder ? req.query.sortorder.toUpperCase() : 'ASC'
//      };
//    }
//
//    var options = {
//      page: page,
//      sort: sort
//    };
//
//    StudentModel.getAllStudents(options, function (error, students) {
//      res.sendServiceResponse(error, students);
//    });
//
//  };
//
//  service.createStudent = function (req, res) {
//
//    var student = {
//      studentId: req.query.studentId,
//      studentName: req.query.studentName
//    };
//
//    StudentModel.createStudent(student, function (error, result) {
//      if (!error) {
//        result = Util.Object.pick(result, ['studentId', 'studentName']);
//      }
//
//      res.sendServiceResponse(error, result);
//    });
//
//  };
//
//});
