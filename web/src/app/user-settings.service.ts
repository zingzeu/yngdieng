import {Injectable} from '@angular/core';
import {LocalStorageService} from './local-storage.service';
import {Settings} from '../protos/settings_pb';
import * as jspb from 'google-protobuf';
import {ZhConversionPreference} from '../../../shared/services_pb';

const SETTINGS_STORAGE_KEY = 'SETTINGS';

const DEFAULT = getDefault();

function getDefault() {
  let v = new Settings();
  v.setZhConversionPreference(ZhConversionPreference.LANGAUGE_PREFERENCE_HANS);
  return v;
}
@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private settings: Settings = DEFAULT;

  constructor(private localStorage: LocalStorageService) {
    this.load();
  }

  getShowSourcelessSearchResults() {
    return this.settings.getShowSourcelessSearchResults();
  }

  setShowSourcelessSearchResults(value: boolean) {
    this.settings.setShowSourcelessSearchResults(value);
    window.setTimeout(() => this.save(), 0);
  }

  getShowOriginalOrthography() {
    return this.settings.getShowOriginalOrthography();
  }

  setShowOriginalOrthography(value: boolean) {
    this.settings.setShowOriginalOrthography(value);
    window.setTimeout(() => this.save(), 0);
  }

  getZhConversionPreference() {
    return this.settings.getZhConversionPreference();
  }

  setZhConversionPreference(value: ZhConversionPreference) {
    this.settings.setZhConversionPreference(value);
    window.setTimeout(() => this.save(), 0);
  }

  private load() {
    const storedStr = this.localStorage.get(SETTINGS_STORAGE_KEY);
    if (storedStr !== null) {
      this.settings = this.unmarshal(storedStr);
    }
  }

  private save() {
    this.localStorage.set(SETTINGS_STORAGE_KEY, this.marshal(this.settings));
  }

  private unmarshal(base64Value: string): Settings {
    return Settings.deserializeBinary(jspb.Message.bytesAsU8(base64Value));
  }

  private marshal(settings: Settings) {
    return jspb.Message.bytesAsB64(settings.serializeBinary());
  }
}
