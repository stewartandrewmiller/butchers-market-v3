import Ember from 'ember';
import RSVP from 'rsvp';
import ResetScrollMixin from '../mixins/reset-scroll-mixin';
import MobileAppMixin from '../mixins/mobile-app-mixin';

export default Ember.Route.extend(ResetScrollMixin, MobileAppMixin, {
  model() {
    return RSVP.hash({
      bundles: this.store.findAll('meat-bundle'),
      products: this.store.findAll('meat-product')
    });
  },

  resetController: function(controller, isExiting/*, transition*/) {
    if (isExiting) {
      controller.set('packages', false);
    }
  }
});
