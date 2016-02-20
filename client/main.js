import './main.scss';
import './components/sample-component';
import $ from 'jquery';
import initializeEmailSockets from './services/email-notifications';

$(() => {
  $('h1').sampleComponent();
  initializeEmailSockets();
});
