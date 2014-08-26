define('config.Attendance', function (module, require) {

  var AttendanceConfig = {
    SLOT_DURATION: 90,
    LOCK_BEFORE_STARTING: 0,
    LOCK_AFTER_STARTING: false,
    LOCK_AFTER_ENDING: 0,

    Slots: {
      SLOT1: {
        START: '00:00'
      },
      SLOT2: {
        START: '01:45'
      },
      SLOT3: {
        START: '03:30'
      },
      SLOT4: {
        START: '05:30'
      },
      SLOT5: {
        START: '07:15'
      },
      SLOT6: {
        START: '09:00'
      },
      SLOT7: {
        START: '11:00'
      },
      SLOT8: {
        START: '12:45'
      },
      SLOT9: {
        START: '14:30'
      }
    }
  };

  module.exports = AttendanceConfig;

});
