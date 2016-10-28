import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['butcher-reviews'],
  attributeBindings: ['ratio:data-stellar-background-ratio', 'verticalOffset:data-stellar-vertical-offset'],

  ratio: '0.5',
  verticalOffset: '-150',

  title: null,
  reviews: null,
});