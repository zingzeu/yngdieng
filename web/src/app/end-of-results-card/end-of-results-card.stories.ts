// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import {Story, Meta, moduleMetadata} from '@storybook/angular';
import {EndOfResultsCardComponent} from './end-of-results-card.component';
import {AppModule} from '../app.module';

export default {
  title: 'Example/EndOfResultsCard',
  component: EndOfResultsCardComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
  decorators: [
    moduleMetadata({
      imports: [AppModule],
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
