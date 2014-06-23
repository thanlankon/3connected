/*
 * System          : 3connected
 * Component       : Course model
 * Creator         : VyBD
 * Modifier        : TrongND
 * Created date    : 2014/06/17
 * Modified date   : 2014/06/23
 */

define.model('model.Course', function (model, ModelUtil, require) {

  var Course = require('model.entity.Course');
  var Schedule = require('model.entity.Schedule');

  model.Entity = Course;

  model.addScheduleSlots = function (courseId, slots, callback) {

    var scheduleItems = [];

    for (var i = 0, len = slots.length; i < len; i++) {
      var slot = slots[i];

      if (!slot['date'] || !slot['slot']) continue;

      scheduleItems.push({
        courseId: courseId,
        date: slot.date,
        slot: slot.slot
      });
    }

    Schedule.bulkCreate(scheduleItems)
      .success(function () {
        callback(null, scheduleItems)
      })
      .error(function (error) {
        callback(error);
      });

  };

  model.removeScheduleSlots = function (scheduleIds, callback) {

    var findConditions = {
      scheduleId: scheduleIds
    };

    Schedule.destroy(findConditions)
      .success(function (affectedRows) {
        callback(null, affectedRows);
      })
      .error(function (error) {
        callback(error);
      });

  };

});
