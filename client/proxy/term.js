define.proxy('proxy.Term', function (model, require) {

  model.entityId = 'termId';

  model.findOne = 'GET api/term/findOne';

  model.create = 'POST api/term/create';

  model.update = 'POST api/term/update';

  model.destroy = 'POST api/term/destroy';

});
