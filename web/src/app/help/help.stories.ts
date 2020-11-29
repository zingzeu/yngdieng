// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/angular/types-6-0';
import {HelpComponent} from './help.component';

export default {
  title: 'YngdiengUiLib/Help',
  component: HelpComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as Meta;

const Template: Story<HelpComponent> = (args: HelpComponent) => ({
  component: HelpComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
