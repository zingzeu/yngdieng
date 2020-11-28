import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from '../user-settings.service';
import {ZhConversionPreference} from 'yngdieng/shared/services_pb';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  zhConversionOptions = [
    {
      value: ZhConversionPreference.LANGAUGE_PREFERENCE_ORIGINAL,
      viewValue: '不转换',
    },
    {
      value: ZhConversionPreference.LANGAUGE_PREFERENCE_HANS,
      viewValue: '转为简体',
    },
    {
      value: ZhConversionPreference.LANGAUGE_PREFERENCE_HANT,
      viewValue: '转为繁体',
    },
  ];
  showSourcelessSearchResults: boolean;
  showOriginalOrthography: boolean;
  zhConversionPreference: ZhConversionPreference;
  constructor(private userSettings: UserSettingsService) {}

  ngOnInit(): void {
    this.showSourcelessSearchResults = this.userSettings.getShowSourcelessSearchResults();
    this.showOriginalOrthography = this.userSettings.getShowOriginalOrthography();
    this.zhConversionPreference = this.userSettings.getZhConversionPreference();
  }

  onShowSourcelessSearchResultsChanged() {
    this.userSettings.setShowSourcelessSearchResults(
      this.showSourcelessSearchResults
    );
  }

  onShowOriginalOrthographyChanged() {
    this.userSettings.setShowOriginalOrthography(this.showOriginalOrthography);
  }

  onZhConversionPreferenceChanged() {
    console.log(this.zhConversionPreference);
    this.userSettings.setZhConversionPreference(this.zhConversionPreference);
  }
}
