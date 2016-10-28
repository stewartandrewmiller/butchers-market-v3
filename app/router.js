import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('meat');
  this.route('deli');
  this.route('beverage');
  this.route('contact');
  this.route('events');
});

export default Router;