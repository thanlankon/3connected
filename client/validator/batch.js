define('validator.rule.Batch', function (module, require) {

  var ruleBatchId = {
    // validate for batchId
    attribute: 'batchId',
    attributeName: 'batch.batchId',
    rules: [
      {
        // batchId is required
        rule: 'required'
      },
      {
        rule: 'positiveInteger'
      }
     ]
  };

  var ruleBatchName = {
    // validate for batchName
    attribute: 'batchName',
    attributeName: 'batch.batchName',
    rules: [
      {
        // batchName is required
        rule: 'required'
      },
      {
        // batchName maximum length is 50
        rule: 'maxLength',
        ruleData: {
          maxLength: 50
        }
      }
    ]
  };

  var ruleCreateBatch = [
    ruleBatchName
  ];

  var ruleUpdateBatch = [
    ruleBatchId,
  ].concat(ruleCreateBatch);

  var ruleBatch = {
    create: ruleCreateBatch,
    update: ruleUpdateBatch
  };

  module.exports = ruleBatch;

});
