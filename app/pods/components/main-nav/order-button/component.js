import Component from '@glimmer/component';
import config from 'butchers-market/config/environment';

export default class MainNavOrderButtonComponent extends Component {
  orderOnlineUrl = config.orderOnlineUrl;
}
