import {Story, Meta, moduleMetadata} from '@storybook/angular';
import {CommonToolbarComponent, DisplayMode} from './common-toolbar.component';
import {MaterialModule} from '@yngdieng-web/shared/material/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SearchboxComponent} from '../searchbox/searchbox.component';
import {FormsModule} from '@angular/forms';

export default {
  title: 'YngdiengUiLib/CommonToolbar',
  component: CommonToolbarComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
  decorators: [
    moduleMetadata({
      imports: [MaterialModule, CommonModule, RouterModule, FormsModule],
      declarations: [SearchboxComponent],
    }),
  ],
} as Meta;

const Template: Story<CommonToolbarComponent> = (
  args: CommonToolbarComponent
) => ({
  component: CommonToolbarComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  mode: DisplayMode.Default,
  label: 'Button',
};

export const HomePage = Template.bind({});
HomePage.args = {
  mode: DisplayMode.HomePage,
  label: 'Button',
};
