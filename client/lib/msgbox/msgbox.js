(function ($, window) {
  $.alert = function (msg) {
    //    if ($('#overlay').is(':visible')) return;

    var $overlay = $('<div class="overlay" id="overlay" />');
    var $alert = $('<div class="msgbox" id="alert" />');
    var $content = $(' \
      <div class="content" id="content"> \
        <table><tr> \
          <td class="icon"></td> \
          <td class="msg"></td> \
        </tr></table> \
      </div> \
    ');
    var $buttons = $('<div class="buttons" id="buttons" />');
    var $btnOK = $('<input type="button" class="button ok"/>').val('OK');

    $content.find('.msg').html(msg.text);
    $content.find('.icon').addClass(msg.icon);
    $buttons.append($btnOK);
    $alert.append($content);
    $alert.append($buttons);
    $alert.appendTo($overlay);

    $overlay.css('visibility', 'hidden');
    $overlay.appendTo('body');

    resize();

    $overlay.css('display', 'none');
    $overlay.css('visibility', 'visible');

    $btnOK.click(function () {
      close();
    });

    $overlay.click(function (event) {
      if (event.target.id == $overlay.attr('id')) {
        close();
      }
    });

    $('body').on('keyup.alert', function (event) {
      if (event.keyCode == 13 || event.keyCode == 27) {
        //ENTER || ESC
        close();
      }
    });
    $(window).on('resize.alert', resize);

    $btnOK.focusout(function () {
      $(this).focus();
    });

    $overlay.fadeIn(300, function () {
      $btnOK.focus();
    });

    function close() {
      $overlay.fadeOut(300, function () {
        $(this).remove();
      });

      $('body').off('keyup.alert');
      $(window).off('resize.alert');
    }

    function resize() {
      $alert.css('margin-top', -$alert.height() / 2 /* - 50*/ );
      $alert.css('margin-left', -$alert.width() / 2);
    }
  };

  $.confirm = function (msg, callback) {
    //    if ($('#overlay').is(':visible')) return;

    var $overlay = $('<div class="overlay" id="overlay" />');
    var $confirm = $('<div class="msgbox" id="alert" />');
    var $content = $(' \
      <div class="content" id="content"> \
        <table><tr> \
          <td class="icon question"></td> \
          <td class="msg"></td> \
        </tr></table> \
      </div> \
    ');
    var $buttons = $('<div class="buttons" id="buttons" />');
    var $btnCancel = $('<input type="button" class="button cancel"/>').val('Cancel');
    var $btnOK = $('<input type="button" class="button ok"/>').val('OK');

    $content.find('.msg').html(msg);
    $buttons.append($btnCancel);
    $buttons.append($btnOK);
    $confirm.append($content);
    $confirm.append($buttons);
    $confirm.appendTo($overlay);

    $overlay.css('visibility', 'hidden');
    $overlay.appendTo('body');

    resize();

    $overlay.css('display', 'none');
    $overlay.css('visibility', 'visible');

    $btnOK.click(function () {
      exec();
    });

    $btnCancel.click(function () {
      close();
    });

    $overlay.click(function (event) {
      if (event.target.id == $overlay.attr('id')) {
        close();
      }
    });

    $('body').on('keyup.confirm', function (event) {
      if (event.keyCode == 27) {
        // ESC
        close();
      } else if (event.keyCode == 13) {
        // ENTER
        exec();
      }
    });
    $(window).on('resize.confirm', resize);

    $btnOK.focusout(function () {
      $(this).focus();
    });

    $overlay.fadeIn(300, function () {
      $btnOK.focus();
    });

    function close() {
      $overlay.fadeOut(300, function () {
        $(this).remove();
      });

      $('body').off('keyup.confirm');
      $(window).off('resize.confirm');
    }

    function resize() {
      $confirm.css('margin-top', -$confirm.height() / 2 /* - 100*/ );
      $confirm.css('margin-left', -$confirm.width() / 2);
    }

    function exec() {
      if (callback) callback();
      close();
    }
  };

  $.fn.confirmNavigate = function (msg) {
    this.click(function (event) {
      event.preventDefault();

      $this = $(this);
      $.confirm(msg, function () {
        var href = $this.attr('href');
        window.location.href = href;
      });
    });
  };

  $.fn.confirmSubmit = function (msg) {
    if (this.is('form')) {
      this.on('keyup.confirm', function (event) {
        event.stopPropagation();
      });

      this.on('submit.confirm', function (event) {
        event.preventDefault();

        $this = $(this);
        $.confirm(msg, function () {
          $this.off('submit.confirm').submit();
        });
      });
    } else {
      this.click(function (event) {
        event.preventDefault();

        $this = $(this);
        $.confirm(msg, function () {
          $this.closest('form').submit();
        });
      });
    }
  };
})(jQuery, window);
