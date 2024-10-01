import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Listing, { ListingProps } from 'components/presentation/Listing';
import { CATEGORY_BUG, CATEGORY_FEATURE } from 'data/categories';
import { environments } from 'data/environments';

export default {
  component: Listing,
} as Meta<typeof Listing>;

// Creating a template for the component
const Template: StoryObj<ListingProps> = {
  render: (args) => {
    const RenderComponent = () => {

      // Toggle showing actions based on state
      const [isShowingActions, setIsShowingActions] = useState(false);
      const handleShowActions = (showActions: boolean) => {
        setIsShowingActions(showActions);
      }

      // Render our listing
      return <Listing {...args} 
                      isShowingActions={isShowingActions} 
                      onShowActions={handleShowActions}/>;
    };

    return <RenderComponent/>
  },
  args: {
    title: 'Example Listing',
    url: 'https://example.com',
    category: CATEGORY_BUG,
    labels: [],
    icon: '🐛',
    actions: [
      { name: 'Edit', icon: '✏️', update: { status: 'Edit' } },
      { name: 'Close', icon: '✖️', update: { status: 'Closed' } },
    ],
    isHighlighted: false,
    isSelected: false,
    isShowingActions: false,
    isCreating: false,
    isEditing: false,
    placeholder: '',
    defaultCategory: CATEGORY_BUG,
    onUpdate: (update, entity) => {
      alert(`Updated issue: ${update.title}`);
    },
    onEditing: (editing: boolean) => {
      alert(`Editing: ${editing}`);
    },
  }
}

// Sample Label
const sampleLabel = { name: 'UI', url: '/ui', icon: '🖌️' };

// Story: Default Listing
export const Default: StoryObj<ListingProps> = {
  ...Template,
  args: {
    ...Template.args,
  }
}

// Story: Highlighted Listing
export const Highlighted: StoryObj<ListingProps> = {
  ...Template,
  args: {
    ...Template.args,
    isHighlighted: true,
  }
}

// Story: Selected Listing
export const Selected: StoryObj<ListingProps> = {
  ...Template,
  args: {
    ...Template.args,
    isSelected: true,
  }
}

// Story: With Actions
export const ShowingActions: StoryObj<ListingProps> = {
  render: (args) => {
    return <Listing {...args}/>
  },
  args: {
    ...Template.args,
    isShowingActions: true,
  }
};

// Story: Creating New
export const New: StoryObj<ListingProps> = {
  ...Template,
  args: {
    isCreating: true,
    placeholder: 'Type the issue title...',
    defaultCategory: CATEGORY_BUG,
    onUpdate: (update, entity) => {
      alert(`New issue: ${update.title}, Category: ${update.meta.category}`);
    },
  }
};

// Story: Editing Existing
export const Editing: StoryObj<ListingProps> = {
  ...Template,
  args: {
    ...Template.args,
    isEditing: true,
    onEditing: (editing: boolean) => {
      alert(`Editing: ${editing}`);
    },
    onUpdate: (update, entity) => {
      alert(`Updated issue: ${update.title}`);
    },
  }
};
