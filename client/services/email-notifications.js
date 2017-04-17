import $ from 'jquery';
import io from 'socket.io-client';

function initialize() {
  let socket = io.connect('/emails/', {
    path: '/ws/'
  });

  socket
    .on('connect', function onEmailsConnected() {
      console.log('Connected to /emails/ server.');
    })
    .on('email-status', function onEmailStatusReceived(data) {
      console.log('New email status received:', data);
      let $emailStatusElement = $('.js-email-status');
      $emailStatusElement.removeClass('c-email-status--not-loaded');

      let $unreadElement = $emailStatusElement.find('.js-email-status__unread');
      $unreadElement.text(data.unread || 0).toggleClass('c-email-status--has-new-email', !!data.unread);

      let $totalElement = $emailStatusElement.find('.js-email-status__total');
      $totalElement.text(data.total || 0);
    });
}

export default initialize;
