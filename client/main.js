import './main.scss';
import './components/sample-component';
import $ from 'jquery';
import initializeEmailSockets from './services/email-notifications';

$(function ready() {
  $('h1').sampleComponent();
  initializeEmailSockets();
});
