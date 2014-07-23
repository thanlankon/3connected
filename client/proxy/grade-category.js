/*
 * System          : 3connected
 * Component       : Grade category proxy
 * Creator         : UayLU
 * Created date    : 2014/18/06
 */
define.proxy('proxy.GradeCategory', function (proxy, require) {

  proxy.entityId = 'gradeCategoryId';

  proxy.findAll = 'GET api/gradeCategory/findAll';

  proxy.findOne = 'GET api/gradeCategory/findOne';

  proxy.create = 'POST api/gradeCategory/create';

  proxy.update = 'POST api/gradeCategory/update';

  proxy.destroy = 'POST api/gradeCategory/destroy';

  proxy.getSubjectVersionGradeCaterogy = 'GET   api/gradeCategory/getSubjectVersionGradeCaterogy';

  // gradeCategory entity map
  proxy.EntityMap = [
    {
      name: 'gradeCategoryId',
      type: 'number'
    },
    {
      name: 'gradeCategoryCode',
      type: 'string'
    },
    {
      name: 'gradeCategoryName',
      type: 'string'
    },
    {
      name: 'minimumGrade',
      type: 'number'
    },
    {
      name: 'weight',
      type: 'number'
    },
    {
      name: 'description',
      type: 'string',
      map: 'subjectVersion.description'
    },
    {
      name: 'subjectName',
      type: 'string',
      map: 'subjectVersion.subject.subjectName'
    }
  ];

});
