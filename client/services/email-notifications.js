import $ from 'jquery';
import io from 'socket.io-client';

function initialize() {
  const socket = io.connect('/emails/', {
    path: '/ws/'
  });

  socket
    .on('connect', function onEmailsConnected() {
      console.log('Connected to /emails/ server.');
    })
    .on('email-status', function onEmailStatusReceived(data) {
      console.log('New email status received:', data);
      let $emailStatusElement = $('header .email-status');
      $emailStatusElement.removeClass('not-loaded');

      let $unreadElement = $emailStatusElement.find('.unread');
      $unreadElement.text(data.unread || 0).toggleClass('has-new-email', !!data.unread);

      let $totalElement = $emailStatusElement.find('.total');
      $totalElement.text(data.total || 0);
    });
}

export default initialize;
