define.proxy('proxy.Batch', function (model, require) {

  model.entityId = 'batchId';

  model.findOne = 'GET api/batch/findOne';

  model.create = 'POST api/batch/create';

  model.update = 'POST api/batch/update';

  model.destroy = 'POST api/batch/destroy';

});
