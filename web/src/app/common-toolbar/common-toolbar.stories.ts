import {Story, Meta, moduleMetadata} from '@storybook/angular';
import {CommonToolbarComponent} from './common-toolbar.component';
import {MaterialModule} from '@yngdieng-web/shared/material/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

export default {
  title: 'Example/CommonToolbar',
  component: CommonToolbarComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
  decorators: [
    moduleMetadata({
      imports: [MaterialModule, CommonModule, RouterModule],
    }),
  ],
} as Meta;

const Template: Story<CommonToolbarComponent> = (
  args: CommonToolbarComponent
) => ({
  component: CommonToolbarComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
