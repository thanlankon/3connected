/*
 * System          : 3connected
 * Component       : Notification model
 * Creator         : TrongND
 * Created date    : 2014/07/19
 */

define.model('model.Notification', function (model, ModelUtil, require) {

  model.getIds = function (items, callback) {
    items = [].concat(items);

    var CourseStudent = require('model.entity.CourseStudent');
    var Student = require('model.entity.Student');
    var Entity = require('core.model.Entity');

    var ids = {
      studentIds: {},
      parentIds: {}
    }

    var queryChainer = Entity.queryChainer();

    var forUsers = [];

    for (var i = 0, len = items.length; i < len; i++) {
      var item = parseId(items[i]);

      if (!item.valid) continue;

      switch (item.type) {
      case 'all':
        queryChainer.add(Student.findAll({
          attributes: ['studentId']
        }));

        forUsers.push(item.user);
        break;
      case 'class':
        queryChainer.add(Student.findAll({
          where: {
            classId: item.id
          },
          attributes: ['studentId']
        }));

        forUsers.push(item.user);
        break;
      case 'course':
        queryChainer.add(CourseStudent.findAll({
          where: {
            courseId: item.id
          },
          attributes: ['studentId']
        }));

        forUsers.push(item.user);
        break;
      case 'specific':
        switch (item.user) {
        case 'students':
          ids.studentIds[item.id] = true;
          break;
        case 'parents':
          ids.parentIds[item.id] = true;
          break;
        case 'students,parents':
          ids.studentIds[item.id] = true;
          ids.parentIds[item.id] = true;
          break;
        }
        break;
      }
    }

    queryChainer
      .run()
      .success(function (results) {
        for (var i = 0, resultLen = results.length; i < resultLen; i++) {
          var items = results[i];

          for (var j = 0, itemLen = items.length; j < itemLen; j++) {
            var item = items[j];

            switch (forUsers[i]) {
            case 'students':
              ids.studentIds[item.studentId] = true;
              break;
            case 'parents':
              ids.parentIds[item.studentId] = true;
              break;
            case 'students,parents':
              ids.studentIds[item.studentId] = true;
              ids.parentIds[item.studentId] = true;
              break;
            }
          }
        }

        var Util = require('core.util.Util');

        // convert to list of ids
        var listOfIds = {
          studentIds: Util.Object.keys(ids.studentIds),
          parentIds: Util.Object.keys(ids.parentIds)
        }

        callback(null, listOfIds);
      })
      .error(function (error) {
        callback(error);
      });

  }

  function parseId(id) {
    var parsedId = {
      valid: false
    };

    // type:user[id]
    var tokens = id.match(/(.+)\:(.+)\[(.*)\]/);

    if (tokens.length != 4) return parsedId;

    var userId = +tokens[3];
    var user = tokens[2];

    parsedId.valid = ['students', 'parents', 'students,parents'].indexOf(user) !== -1 && !isNaN(userId);
    parsedId.type = tokens[1];
    parsedId.user = user;
    parsedId.id = userId;

    return parsedId;
  }

});