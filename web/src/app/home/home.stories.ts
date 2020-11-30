import {CommonModule} from '@angular/common';
import {Story, Meta, moduleMetadata} from '@storybook/angular';
import {MaterialModule} from '@yngdieng-web/shared/material/material.module';
import {HomeComponent} from './home.component';

export default {
  title: 'YngdiengUiLib/Home',
  component: HomeComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
  decorators: [
    moduleMetadata({
      imports: [MaterialModule, CommonModule],
    }),
  ],
} as Meta;

const Template: Story<HomeComponent> = (args: HomeComponent) => ({
  component: HomeComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
