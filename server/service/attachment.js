/*
 * System          : 3connected
 * Component       : Attachment service
 * Creator         : TrongND
 * Created date    : 2014/07/11
 */

define.service('service.Attachment', function (service, require, ServiceUtil, Util) {

  var Configuration = require('core.config.Configuration').getConfiguration();
  var path = require('lib.Path');
  var fs = require('lib.FileSystem');

  var attachmentDirectory = path.join(Configuration.File.LOCATION, 'attachments');

  service.map = {
    url: '/attachment',

    methods: {
      download: {
        url: '/download',
        httpMethod: 'GET'
      }
    }
  };

  var AttachmentModel = require('model.Attachment');

  service.download = function (req, res) {
    var attachmentId = req.query.attachmentId;

    AttachmentModel.findOne(attachmentId, function (error, attachment, isNotFound) {
      var message = null;

      if (error) {
        message = 'news.attachment.download.error.unknown';
      } else {
        var filePath = path.join(attachmentDirectory, attachmentId);
        var exists = fs.existsSync(filePath);

        if (isNotFound === true || !exists) {
          error = {
            code: 'ENTITY.NOT_FOUND'
          };

          message = 'news.attachment.download.error.notFound';
        }
      }

      if (error || message) {
        ServiceUtil.sendServiceResponse(res, error, message, attachment);
      } else {
        // send file
        var fileName = attachment.name + '.' + attachment.extension;
        //res.attachment(fileName);

        res.download(filePath, fileName);
      }
    });

  };

});
