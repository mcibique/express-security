import './sample-component.scss';
import $ from 'jquery';

$.fn.sampleComponent = function sampleComponent() {
  $(this).each(() => {
    const self = $(this);

    self
      .addClass('sample-component')
      .off('.sample-component')
      .on('click.sample-component', () => {
        console.log('You clicked sample component.');
        self.toggleClass('active');
      });
  });
};
