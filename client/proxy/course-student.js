/*
 * System          : 3connected
 * Component       : Course student proxy
 * Creator         : UayLU
 * Created date    : 2014/19/06
 */
define.proxy('proxy.CourseStudent', function (proxy, require) {

  proxy.entityId = 'courseStudentId';

  proxy.findAll = 'GET api/courseStudent/findAll';

  proxy.findOne = 'GET api/courseStudent/findOne';

  proxy.create = 'POST api/courseStudent/create';

  proxy.update = 'POST api/courseStudent/update';

  proxy.destroy = 'POST api/courseStudent/destroy';

  // courseStudent entity map
  proxy.EntityMap = [
    {
      name: 'courseStudentId',
      type: 'number'
    },
    {
      name: 'studentId',
      type: 'string',
      map: 'student.studentId'
    },
    {
      name: 'studentCode',
      type: 'string',
      map: 'student.studentCode'
    },
    {
      name: 'firstName',
      type: 'string',
      map: 'student.firstName'
    },
    {
      name: 'lastName',
      type: 'string',
      map: 'student.lastName'
    },
    {
      name: 'className',
      type: 'string',
      map: 'student.studentId'
    },
    {
      name: 'batchName',
      type: 'string',
      map: 'student.class.batch.batchName'
    },
    {
      name: 'majorName',
      type: 'string',
      map: 'student.class.major.majorName'
    },
    {
      name: 'gender',
      type: 'string',
      map: 'student.gender'
    },
    {
      name: 'dateOfBirth',
      type: 'string',
      map: 'student.dateOfBirth'
    },
    {
      name: 'courseId',
      type: 'string'
    },
    {
      name: 'courseName',
      type: 'string',
      map: 'course.courseName'
    },
    {
      name: 'termName',
      type: 'string',
      map: 'course.term.termName'
    },
    {
      name: 'majorName',
      type: 'string',
      map: 'course.major.majorName'
    },
    {
      name: 'discription',
      type: 'string',
      map: 'course.subjectVersion.description'
    },
    {
      name: 'subjectName',
      type: 'string',
      map: 'course.subjectVersion.subject.subjectName'
    }
  ];

});
