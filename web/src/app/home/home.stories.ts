import {CommonModule} from '@angular/common';
import {Story, Meta, moduleMetadata} from '@storybook/angular';
import {MaterialModule} from '@yngdieng-web/shared/material/material.module';
import {HomeComponent} from './home.component';

export default {
  title: 'Example/Home',
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

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
