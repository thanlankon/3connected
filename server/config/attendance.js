define('config.Attendance', function (module, require) {

  var AttendanceConfig = {
    SLOT: {
      DURATION: 90,
      LOCK_BEFORE_STARTING: false,
      LOCK_AFTER_STARTING: false,
      LOCK_AFTER_ENDING: 0,
    },

    SLOT1: {
      START: '07:00',
      END: false
    },
    SLOT2: {
      START: '09:30',
      END: false
    },
    SLOT3: {
      START: '09:30',
      END: false
    },
    SLOT4: {
      START: '09:30',
      END: false
    },
    SLOT5: {
      START: '09:30',
      END: false
    },
    SLOT6: {
      START: '09:30',
      END: false
    },
    SLOT7: {
      START: '09:30',
      END: false
    },
    SLOT8: {
      START: '09:30',
      END: false
    },
    SLOT9: {
      START: '09:30',
      END: false
    },
  };

  module.exports = AttendanceConfig;

});
