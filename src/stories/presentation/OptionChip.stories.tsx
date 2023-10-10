import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import OptionChip, { OptionChipProps } from 'components/presentation/OptionChip';
import type { Option as OptionType, OptionChoice as OptionChoiceType } from 'data/types';

export default {
  component: OptionChip,
  argTypes: {
    title: { control: 'text' },
    isSelected: { control: 'boolean' },
    isSelectable: { control: 'boolean' },
    isToggleable: { control: 'boolean' },
    isDimmable: { control: 'boolean' },
    isExpanded: { control: 'boolean' },
    isExpandable: { control: 'boolean' },
    isRadio: { control: 'boolean' },
    isMultiSelectable: { control: 'boolean' },
    isBlank: { control: 'boolean' },
    isSmall: { control: 'boolean' },
    isIconOnly: { control: 'boolean' },
    isAutoComplete: { control: 'boolean' },
    choices: { control: 'object' },
    tip: { control: 'text' },
    onSelectOption: {
      control: null, // disabling control for function
      description: 'Callback for option selection', // You can add descriptions
    }
  },
  args: {
    isSelected: false,
    isSelectable: true,
    isToggleable: false,
    isDimmable: false,
    isExpanded: false,
    isExpandable: false,
    isRadio: false,
    isMultiSelectable: false,
    isBlank: false,
    isSmall: false,
    isIconOnly: false,
    isAutoComplete: false,
  }
} as Meta<typeof OptionChip>;

const Default: StoryObj<OptionType>  = {
  render: (args) => {
    return <OptionChip option={args}/>;
  },
  args: {
    name: "MyOptionChip",
  }
};

export const Toggleable: StoryObj<OptionType>  = {
  ...Default,
  render: (args) => {
    const RenderComponent = () => {  // Notice the capitalization
      const [isSelected, setIsSelected] = useState(args.isSelected);
    
      const handleToggleSelected = () => {
        setIsSelected(!isSelected);
      };
    
      return (
        <OptionChip 
          option={{ 
            ...args,
            isSelected,
            onSelectOption: (option: OptionType) => {
              handleToggleSelected();
              args.onSelectOption?.(option);
            }
          }} 
        />
      );
    };

    return <RenderComponent />;
  },
  args: {
    ...Default.args,
    title: 'Toggle Me',
    isToggleable: true,
  }
};

export const Selected: StoryObj<OptionType>  = {
  ...Toggleable,
  args: {
    ...Default.args,
    title: 'Already Selected',
    isSelected: true,
  }
};

export const Expandable: StoryObj<OptionType>  = {
  ...Default,
  render: (args) => {
    const RenderComponent = () => {  
      const [selectedTitle, setSelectedTitle] = useState<string | undefined>(args.title);
      const handleSelect = (option: OptionType, choice: OptionChoiceType) => {
        setSelectedTitle(choice.title);
      };

      return (
        <OptionChip 
          option={{ 
            ...args,
            title: selectedTitle,
            onSelectOption: handleSelect
          }} 
        />
      );    
    };
    return <RenderComponent />;
  },
  args: {
    ...Default.args,
    title: "Option 1",  // default placeholder title
    isExpandable: true,
    choices: [
      { metadata: 1, title: 'Option 1' },
      { metadata: 2, title: 'Option 2' },
      { metadata: 3, title: 'Option 3' },
    ],
  }
};

export const Small: StoryObj<OptionType>  = {
  ...Toggleable,
  args: {
    ...Default.args,
    title: 'Small Option',
    isSmall: true,
  }
};

export const Radio: StoryObj<OptionType> = {
  render: (args) => {
    const RadioComponent = () => {
      const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
      const handleSelect = (optionName: string) => {
        setSelectedOption(optionName);
        args.onSelectOption?.({ name: optionName, title: optionName } as OptionType);
      };
  
      const options = ['Option 1', 'Option 2', 'Option 3'];
  
      return (
        <div style={{ display: 'flex' }}>
          {options.map((optionName) => (
            <OptionChip 
              key={optionName}
              option={{ 
                ...args,
                name: optionName,
                title: optionName,
                isSelected: selectedOption === optionName,
                onSelectOption: () => handleSelect(optionName)
              }} 
            />
          ))}
        </div>
      );
    };

    return <RadioComponent />;
  },
  args: {
    ...Default.args,
    title: "Option",
    isRadio: true, 
  }
};

export const IconRadio: StoryObj<OptionType> = {
  render: (args) => {
    const RadioComponent = () => {
      const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
      const handleSelect = (optionName: string) => {
        setSelectedOption(optionName);
        args.onSelectOption?.({ name: optionName } as OptionType);
      };
  
      const options = ['roadmap','tickets','code','link'];
  
      return (
        <div style={{ display: 'flex' }}>
          {options.map((optionName) => (
            <OptionChip 
              key={optionName}
              option={{ 
                ...args,
                name: optionName,
                icon: optionName,
                isSelected: selectedOption === optionName,
                onSelectOption: () => handleSelect(optionName)
              }} 
            />
          ))}
        </div>
      );
    };

    return <RadioComponent />;
  },
  args: {
    ...Default.args,
    isRadio: true, 
  }
};

export const MultiSelect: StoryObj<OptionType> = {
  render: (args) => {
    const MultiSelectComponent = () => {
      const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

      const handleSelect = (optionName: string) => {
        if (selectedOptions.includes(optionName)) {
          // If already selected, remove the option from selection
          setSelectedOptions(selectedOptions.filter((opt) => opt !== optionName));
        } else {
          // Otherwise, add the option to selection
          setSelectedOptions([...selectedOptions, optionName]);
        }

        // Call the external onSelectOption if provided
        args.onSelectOption?.({ name: optionName, title: optionName } as OptionType);
      };

      const options = ['Option 1', 'Option 2', 'Option 3'];

      return (
        <div style={{ display: 'flex' }}>
          {options.map((optionName) => (
            <OptionChip 
              key={optionName}
              option={{ 
                ...args,
                name: optionName,
                title: optionName,
                isSelected: selectedOptions.includes(optionName),
                onSelectOption: () => handleSelect(optionName)
              }} 
            />
          ))}
        </div>
      );
    };

    return <MultiSelectComponent />;
  },
  args: {
    ...Default.args,
    title: "Option",
    isMultiSelectable: true, // Ensure this prop is true to signal multi-select to your component
  }
};
