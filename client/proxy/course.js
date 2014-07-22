/*
 * System          : 3connected
 * Component       : Subject course proxy
 * Creator         : VyBD
 * Modifier        : TrongND, UayLU
 * Created date    : 2014/06/16
 * Modified date   : 2014/06/22
 */

define.proxy('proxy.Course', function (proxy, require) {

  proxy.entityId = 'courseId';

  proxy.findAll = 'GET api/course/findAll';

  proxy.findOne = 'GET api/course/findOne';

  proxy.create = 'POST api/course/create';

  proxy.update = 'POST api/course/update';

  proxy.destroy = 'POST api/course/destroy';

  // update schedule
  proxy.updateSchedule = 'POST api/course/updateSchedule';
  proxy.findAttendanceStudent = 'GET api/course/findAttendanceStudent';
  proxy.findCourseStudent = 'GET api/course/findCourseStudent';
  proxy.findOneCourseStudent = 'GET api/course/findOneCourseStudent';
  proxy.findCourseStudentMobile = 'GET api/course/findCourseStudentMobile';

  // course entity map
  proxy.EntityMap = [
    {
      name: 'courseId',
      type: 'number'
    }, {
      name: 'courseName',
      type: 'string'
    }, {
      name: 'numberOfCredits',
      type: 'string'
    }, {
      name: 'className',
      type: 'string',
      map: 'class.className'
    }, {
      name: 'staffCode',
      type: 'string',
      map: 'staff.staffCode'
    }, {
      name: 'termName',
      type: 'string',
      map: 'term.termName'
    }, {
      name: 'majorName',
      type: 'string',
      map: 'major.majorName'
    }, {
      name: 'subjectName',
      type: 'string',
      map: 'subjectVersion.subject.subjectName'
    }, {
      name: 'description',
      type: 'string',
      map: 'subjectVersion.description'
    }
  ];

  proxy.StudentCourseEntityMap = [
    {
      name: 'courseId',
      type: 'number',
      map: 'course.courseId'
    }, {
      name: 'courseName',
      type: 'string',
      map: 'course.courseName'
    }, {
      name: 'numberOfCredits',
      type: 'string',
      map: 'course.numberOfCredits'
    }, {
      name: 'className',
      type: 'string',
      map: 'course.class.className'
    }, {
      name: 'termName',
      type: 'string',
      map: 'course.term.termName'
    }, {
      name: 'majorName',
      type: 'string',
      map: 'course.major.majorName'
    }, {
      name: 'subjectName',
      type: 'string',
      map: 'course.subjectVersion.subject.subjectName'
    }, {
      name: 'description',
      type: 'string',
      map: 'course.subjectVersion.description'
    }
  ];

});
