import Ember from 'ember';
import MediaMixin from '../mixins/media-mixin';

export default Ember.Controller.extend(MediaMixin, {
  featuredBundles: Ember.computed.filterBy('model.bundles', 'featured', true)
});
