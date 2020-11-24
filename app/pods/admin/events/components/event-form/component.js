import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import EventValidations from 'butchers-market/validations/event';
import { dropTask, enqueueTask } from 'ember-concurrency-decorators';
import baseUrl from 'butchers-market/utils/base-url';

export default class EventForm extends Component {
  @service router;
  @service session;

  changeset;

  @tracked image;
  @tracked tempImageUrl;
  @tracked errorMessage;
  @tracked fileErrorMessage;

  get hasImage() {
    return this.changeset.get('imageUrl') || this.tempImageUrl;
  }

  get imageUrl() {
    if (this.tempImageUrl) {
      return this.tempImageUrl;
    }

    return this.changeset.get('imageUrlPath');
  }

  get saveDisabled() {
    return this.changeset && this.changeset.isInvalid;
  }

  get uploadHeaders() {
    const token = this.session.token;

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    return null;
  }

  constructor() {
    super(...arguments);

    let changeset = new Changeset(
      this.args.event,
      lookupValidator(EventValidations),
      EventValidations
    );

    this.changeset = changeset;
  }

  @dropTask
  *saveEvent() {
    yield this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
      if (this.image) {
        let response = yield this.image.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
        });
        this.changeset.set('imageUrl', response.body);
      }

      yield this.changeset.save();
      this.args.saved();
    } catch (ex) {
      if (ex.status === 401) {
        return this.session.redirectToSignIn(this.router.currentURL);
      } else if (ex.body) {
        this.errorMessage = ex.body.error;
      } else {
        this.errorMessage = ex;
      }
    }
  }

  @enqueueTask({ maxConcurrency: 3 })
  *uploadPhoto(file) {
    try {
      let url = yield file.readAsDataURL();
      this.tempImageUrl = url;
      this.image = file;
    } catch (e) {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  }

  @action
  dateSelected(date) {
    const startTime = this.changeset.get('startTime');
    this.changeset.set(
      'startTime',
      new Date(
        date[0].getFullYear(),
        date[0].getMonth(),
        date[0].getDate(),
        startTime.getHours(),
        startTime.getMinutes()
      )
    );

    const endTime = this.changeset.get('endTime');
    this.changeset.set(
      'endTime',
      new Date(
        date[0].getFullYear(),
        date[0].getMonth(),
        date[0].getDate(),
        endTime.getHours(),
        endTime.getMinutes()
      )
    );
  }

  @action
  startTimeSelected(time) {
    const startTime = this.changeset.get('startTime');
    this.changeset.set(
      'startTime',
      new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        time[0].getHours(),
        time[0].getMinutes()
      )
    );

    const endTime = this.changeset.get('endTime');
    this.changeset.set(
      'endTime',
      new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        endTime.getHours(),
        endTime.getMinutes()
      )
    );
  }

  @action
  endTimeSelected(time) {
    const startTime = this.changeset.get('startTime');
    this.changeset.set(
      'endTime',
      new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        time[0].getHours(),
        time[0].getMinutes()
      )
    );
  }

  @action
  uploadImage(file) {
    this.uploadPhoto.perform(file);
  }

  @action
  removeImage() {
    this.image = null;
    this.tempImageUrl = null;

    this.changeset.set('imageUrl', null);
  }
}
