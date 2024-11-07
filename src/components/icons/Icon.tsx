import IconCaretDown from "./IconCaretDown";
import IconCaretUp from "./IconCaretUp";
import IconRoadmap from "./IconRoadmap";
import IconEpics from "./IconEpics";
import IconTickets from "./IconTickets";
import IconCode from "./IconCode";
import IconLink from "./IconLink";
import IconDesign from "./IconDesign";
import IconBuild from "./IconBuild";
import IconLaunch from "./IconLaunch";
import IconPerson from "./IconPerson";
import IconX from "./IconX";
import { IconProps } from "./types";

export interface NamedIconProps extends IconProps {
  name: string;
}

const Icon: React.FC<NamedIconProps> = ({ name, ...otherProps }) => {
  // Select which icon to show based on name
  // And pass down all props except for the icon name
  switch (name) {
    case 'caret-down':
      return <IconCaretDown {...otherProps} />;
    case 'caret-up':
      return <IconCaretUp {...otherProps} />;
    case 'roadmap':
      return <IconRoadmap {...otherProps} />;
    case 'epics':
      return <IconEpics {...otherProps} />;
    case 'tickets':
      return <IconTickets {...otherProps} />;
    case 'code':
      return <IconCode {...otherProps} />;
    case 'link':
      return <IconLink {...otherProps} />;
    case 'design':
      return <IconDesign {...otherProps} />;
    case 'build':
      return <IconBuild {...otherProps} />;
    case 'launch':
      return <IconLaunch {...otherProps} />;
    case 'person':
      return <IconPerson {...otherProps} />;
    case 'x':
      return <IconX {...otherProps} />;
    default:
      return null; // or a default icon
  }
};

export default Icon;
