import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Icon, { NamedIconProps } from 'components/icons/Icon';

const iconNames = ['caret-up', 'caret-down', 'x', 'roadmap', 'tickets', 'code', 'link'];

export default {
  component: Icon,
  argTypes: {
    name: { control: 'select', options: iconNames },
    fill: { control: 'color' },
    width: { control: 'number' },
    height: { control: 'number' }
  },
  args: {
    fill: 'rgba(0,0,0,0.75)',
    width: 25,
    height: 25
  }
} as Meta<typeof Icon>;

export const Default: StoryObj<typeof Icon>  = {
  render: (args) => {
    return <Icon {...args}/>;
  },
  args: {
    name: "caret-up",
  }
};

export const Sizes: StoryObj<typeof Icon> = {
  render: (args) => {
    const sizes = [16, 22, 25, 50, 100];  // array of sizes
    
    const SizeVariants = () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sizes.map((size) => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: 10 }} key={size}>
            <Icon {...args} width={size} height={size} />
            <span style={{fontSize: '0.9em', color: args.fill || '#000000'}}>{size}x{size}</span>
          </div>
        ))}
      </div>
    );

    return <SizeVariants />;
  },
  args: {
    name: "caret-up",
    fill: 'rgba(0,0,0,0.75)', // consider placing common args values here
  }
};

// Base Icon Gallery Component
const IconGallery: React.FC<{ iconNames: string[], args: Partial<NamedIconProps> }> = ({ iconNames, args }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 180px)', gap: 20 }}>
    {iconNames.map((iconName) => (
      <div key={iconName} style={{ display: 'flex', gap: 10, alignItems: 'center'}}>
        <Icon {...args} name={iconName} />
        <span style={{fontSize: '0.9em', color: args.fill || '#000000'}}>{iconName}</span>
      </div>
    ))}
  </div>
);

// Symbols Story
export const Symbols: StoryObj<NamedIconProps> = {
  render: (args) => {
    const symbolIcons = ["caret-up", "caret-down", "x"];
    return <IconGallery iconNames={symbolIcons} args={args} />;
  },
  args: {}
};

// Modes Story
export const Modes: StoryObj<NamedIconProps> = {
  render: (args) => {
    const modeIcons = ["roadmap", "tickets", "code", "link"];
    return <IconGallery iconNames={modeIcons} args={args} />;
  },
  args: {}
};