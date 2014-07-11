/*
 * System          : 3connected
 * Component       : Attachment service
 * Creator         : TrongND
 * Created date    : 2014/07/11
 */

define.service('service.Attachment', function (service, require, ServiceUtil, Util) {

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
        if (isNotFound === true) {
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
        res.attachment(attachment.name + '.' + attachment.extension);

        res.send(attachment.data);
      }
    });

  };

});
