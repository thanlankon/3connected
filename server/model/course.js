/*
 * System          : 3connected
 * Component       : Course model
 * Creator         : VyBD
 * Created date    : 2014/17/06
 */
define.model('model.Course', function (model, ModelUtil, require) {

  var Course = require('model.entity.Course');
  var Schedule = require('model.entity.Schedule');

  model.Entity = Course;

  model.addScheduleSlots = function (courseId, slots, callback) {

    var ConvertUtil = require('core.util.ConvertUtil');

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

});
