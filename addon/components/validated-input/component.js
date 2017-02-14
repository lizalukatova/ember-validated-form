import Ember from 'ember';
import layout from './template';

/**
 * This component wraps form inputs.
 *
 * It can be used in a two-way-binding style like
 * {{validated-input model=model name='firstName'}} (model will be updated)
 *
 * or in a one-way-binding style
 * {{validated-input model=model name='firstName' on-update=(action "update"}}
 * (update action is called, model is not updated)
 */
export default Ember.Component.extend({
  layout,

  dirty: false,

  required: false,

  type: 'input',

  classNameBindings: [ 'showError:has-error:valid', 'dirty', 'config.css.group' ],

  error: Ember.computed('model.error', function() {
    const error = this.get('model.error');
    return error ? error[this.get('name')] : null;
  }),

  isValid: Ember.computed('error', function() {
    return !this.get('error');
  }),

  firstError: Ember.computed('error', function() {
    return this.get('error.validation')[0];
  }),

  showError: Ember.computed('isValid', 'dirty', 'submitted', function() {
    return !this.get('isValid') && (this.get('dirty') || this.get('submitted'));
  }),
  
  _labelClass: Ember.computed('config', 'label-class', function() {
    return this._getClass('label');
  }),
  
  _inputWrapClass: Ember.computed('config', 'input-wrap-class', function() {
    return this._getClass('input');
  }),
  
  _configClass(type) {
    return this.get(`config.class.${type}`);
  },
  
  _getClass(type) {
    const i18n = this.get('i18n');
    const customClass = this.get(`${type}-class`);
    if (customClass) {
      return customClass;
    }
    const defaultClass = this._configClass(type);
    return i18n ? i18n.t(defaultClass) : defaultClass;
  },


  init() {
    this._super(...arguments);
    // mark field as required if validation errors are present during init.
    if (this.get(`model.error.${this.get('name')}.validation`)) {
      this.set('required', true);
    };
	
	let owner = Ember.getOwner(this);
    let factory = owner.factoryFor ? owner.factoryFor('service:i18n') : owner._lookupFactory('service:i18n');
    this.set('i18n', factory ? factory.create() : null);
  },

  actions: {
    setDirty() {
      this.set('dirty', true);
    },

    update(value) {
      if (this.attrs['on-update']) {
        this.attrs['on-update'](value);
      }
      else {
        this.set(`model.${this.get('name')}`, value);
      }
    }
  }
});
