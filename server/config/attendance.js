define('config.Attendance', function (module, require) {

  var AttendanceConfig = {
    SLOT_DURATION: 90,
    LOCK_BEFORE_STARTING: false,
    LOCK_AFTER_STARTING: false,
    LOCK_AFTER_ENDING: 0,

    Slots: {
      SLOT1: {
        START: '07:00'
      },
      SLOT2: {
        START: '08:45'
      },
      SLOT3: {
        START: '10:30'
      },
      SLOT4: {
        START: '12:30'
      },
      SLOT5: {
        START: '14:15'
      },
      SLOT6: {
        START: '16:00'
      },
      SLOT7: {
        START: '18:00'
      },
      SLOT8: {
        START: '19:45'
      },
      SLOT9: {
        START: '21:30'
      }
    }
  };

  module.exports = AttendanceConfig;

});
