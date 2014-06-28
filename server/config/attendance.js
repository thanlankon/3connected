define('config.Attendance', function (module, require) {

  var AttendanceConfig = {
    SLOT_DURATION: 90,
    LOCK_BEFORE_STARTING: 0,
    LOCK_AFTER_STARTING: false,
    LOCK_AFTER_ENDING: 0,

    Slots: {
      SLOT1: {
        START: '07:00',
        END: false
      },
      SLOT2: {
        START: '09:30',
        END: false
      },
      SLOT3: {
        START: '11:30',
        END: false
      },
      SLOT4: {
        START: '09:30',
        END: false
      },
      SLOT5: {
        START: '15:00',
        END: false
      },
      SLOT6: {
        START: '16:00',
        END: false
      },
      SLOT7: {
        START: '18:00',
        END: false
      },
      SLOT8: {
        START: '09:30',
        END: false
      },
      SLOT9: {
        START: '09:30',
        END: false
      }
    }
  };

  module.exports = AttendanceConfig;

});
