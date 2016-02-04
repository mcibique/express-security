import './main.scss';

import $ from 'jquery';
import './components/sample-component';
import initializeEmailSockets from './services/email-notifications';

$(() => {
  $('h1').sampleComponent();
  initializeEmailSockets();
});
