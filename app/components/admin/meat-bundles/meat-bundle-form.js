import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { dropTask } from 'ember-concurrency';
import MeatBundleValidations from '../../../validations/meat-bundle';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class MeatBundleFormComponent extends Component {
  changeset;

  @tracked prices;
  @tracked items;
  @tracked errorMessage;
  @tracked reordering = false;

  get hasErrors() {
    return this.errorMessage || this.changeset.errors;
  }

  get saveDisabled() {
    return this.changeset && this.changeset.isInvalid;
  }

  constructor() {
    super(...arguments);

    let changeset = new Changeset(
      this.args.bundle,
      lookupValidator(MeatBundleValidations),
      MeatBundleValidations,
    );
    let items = changeset.get('items');

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.changeset = changeset;
    this.items = items;
  }

  saveBundle = dropTask(async () => {
    this.changeset.set('items', this.items);

    await this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
      await this.changeset.save();
      this.args.saved();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  @action
  updateFeatured() {
    this.changeset.set('featured', !this.changeset.get('featured'));
  }

  @action
  updateHidden() {
    this.changeset.set('isHidden', !this.changeset.get('isHidden'));
  }

  @action
  updateOrderEnabled() {
    this.changeset.set('orderEnabled', !this.changeset.get('orderEnabled'));
  }

  @action
  addItem() {
    this.items = [...this.items, ''];
  }

  @action
  itemChanged(index, value) {
    this.items[index] = value;
  }

  @action
  deleteItem(index) {
    let items = this.items.filter((item, itemIndex) => itemIndex !== index);

    // Ensure there's always an item field
    if (items.length === 0) {
      items = [''];
    }

    this.items = items;
  }

  @action
  reorderItems(itemModels) {
    this.items = itemModels;
  }
}
