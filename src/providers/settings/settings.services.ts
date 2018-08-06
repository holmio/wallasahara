import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class SettingsServices {
  private SETTINGS_KEY: string = '_settings';

  settings: any = {};

  private defaults: any;
  // private readyPromise: Promise<any>;

  constructor(public storage: Storage, defaults: any) {
    this.defaults = defaults;
  }

  load() {
    return this.storage.get(this.SETTINGS_KEY).then((value) => {
      if (value) {
        this.settings = value;
        return this.mergeDefaults(this.defaults);
      } else {
        return this.setAll(this.defaults).then((val) => {
          this.settings = val;
        })
      }
    });
  }

  private mergeDefaults(defaults: any) {
    for (const k in defaults) {
      if (!(k in this.settings)) {
        this.settings[k] = defaults[k];
      }
    }
    return this.setAll(this.settings);
  }

  merge(settings: any) {
    for (const k in settings) {
      this.settings[k] = settings[k];
    }
    return this.save();
  }

  setValue(key: string, value: any) {
    this.settings[key] = value;
    return this.storage.set(this.SETTINGS_KEY, this.settings);
  }

  setAll(value: any) {
    return this.storage.set(this.SETTINGS_KEY, value);
  }

  getValue(key: string) {
    return Observable.fromPromise(this.storage.get(this.SETTINGS_KEY)
      .then(settings => {
        return settings ? settings[key] : undefined;
      }));
  }

  save() {
    return this.setAll(this.settings);
  }

  get allSettings() {
    return this.settings;
  }
}
