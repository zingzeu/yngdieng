import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Story, Meta, moduleMetadata} from '@storybook/angular';
import {MaterialModule} from '@yngdieng-web/shared/material/material.module';
import {SearchboxComponent} from './searchbox.component';

export default {
  title: 'YngdiengUiLib/Searchbox',
  component: SearchboxComponent,
  decorators: [
    moduleMetadata({
      imports: [MaterialModule, CommonModule, FormsModule],
    }),
  ],
} as Meta;

const Template: Story<SearchboxComponent> = (args: SearchboxComponent) => ({
  component: SearchboxComponent,
  props: args,
});

export const Empty = Template.bind({});
Empty.args = {
  primary: true,
};

export const TextQuery = Template.bind({});
Empty.args = {
  queryText: 'huziu',
};
