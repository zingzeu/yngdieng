import {Story, Meta, moduleMetadata} from '@storybook/angular';
import {EndOfResultsCardComponent} from './end-of-results-card.component';
import {MaterialModule} from '@yngdieng-web/shared/material/material.module';
import {CommonModule} from '@angular/common';

export default {
  title: 'YngdiengUiLib/EndOfResultsCard',
  component: EndOfResultsCardComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
  decorators: [
    moduleMetadata({
      imports: [MaterialModule, CommonModule],
    }),
  ],
} as Meta;

const Template: Story<EndOfResultsCardComponent> = (
  args: EndOfResultsCardComponent
) => ({
  component: EndOfResultsCardComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
