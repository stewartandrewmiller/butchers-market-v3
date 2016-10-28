import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['navbar', 'navbar-default', 'navbar-fixed-top', 'main-nav'],

  didInsertElement() {
    this._super(...arguments);

    this.$('.nav-item:not(.dropdown), .navbar-brand, .dropdown-item').click(() => {
      let toggler = this.$('.navbar-toggler');

      if (!toggler.hasClass('collapsed')) {
        toggler.click();
      }
    });
  }
});