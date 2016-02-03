(function emailNotificationsInit(io) {
  'use strict';

  var socket = io.connect('/emails/', {
    path: '/web-sockets/'
  });

  socket
    .on('connect', function onConnected() {
      console.log('Connected to /emails/ server.');
    })
    .on('email-status', function onEmailStatusReceived(data) {
      console.log('New email status received:', data);
      var emailStatusElement = document.getElementById('email-status');
      emailStatusElement.classList.remove('not-loaded');

      var unreadElement = emailStatusElement.querySelectorAll('.unread')[0];
      unreadElement.innerHTML = data.unread || 0;
      if (data.unread) {
        unreadElement.classList.add('has-new-email');
      } else {
        unreadElement.classList.remove('has-new-email');
      }

      var totalElement = emailStatusElement.querySelectorAll('.total')[0];
      totalElement.innerHTML = data.total || 0;
    });
})(window.io);