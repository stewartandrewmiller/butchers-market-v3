import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['butcher-promo'],
  attributeBindings: ['ratio:data-stellar-background-ratio', 'verticalOffset:data-stellar-vertical-offset'],

  darken: false,

  ratio: '0.5',
  verticalOffset: '-76'
});