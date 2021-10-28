import React, { useState, useEffect } from 'react';
import Prompt from 'components/presentation/Prompt';
import OptionChips from 'components/presentation/OptionChips';
import { Option as OptionType,
         Issue as IssueType,
         Environment } from 'data/types';
import { labelNameFromEnvironment, environments } from 'data/environments';

interface IssueEnvironmentProps {
  issue: IssueType;
  environment?: Environment;
  isPrompt: boolean;
  onUpdate?(update: any): void;
  onClosePrompt?(): void;
}

const IssueEnvironment: React.FC<IssueEnvironmentProps> = (props) => {

  // We want to keep state locally while it syncs with the server
  const [currentEnviroment, setCurrentEnvironment] = useState(props.environment);

  // If the value changes in a remote update, 
  // make sure to overwrite our local cached version
  useEffect(() => {
    setCurrentEnvironment(props.environment);
  }, [props.environment]);

  // When they switch which environment an issue is in, we need to add / remove labels
  const handleSelectEnvironment = (environment: Environment) => {

    // Update locally
    setCurrentEnvironment(environment);

    // Figure out what labels to remove (all the other possible environments)
    const otherEnvironments = environments.filter((other: Environment) => other.name !== environment.name);
    const removeLabels = otherEnvironments.map((other: Environment) => labelNameFromEnvironment(other));

    // Add labels for this enviroment, and remove labels for the others
    props.onUpdate?.({ add_labels: labelNameFromEnvironment(environment), remove_labels: removeLabels });
  }

  // Generate a list of tabs based on upcoming milestones
  const options: OptionType[] = environments.map((environment: Environment) => {
    return { title: environment.icon,
             name: environment.name, 
             isSelected: (currentEnviroment?.name === environment.name), 
             isSelectable: true,
             isDimmable: true,
             isIconOnly: true,
             isExpandable: false, 
             onSelectOption: () => { handleSelectEnvironment(environment); } 
    };
  })

  // Put all of our groups together
  if ( props.isPrompt ) {
    return (
      <Prompt onClosePrompt={() => props.onClosePrompt?.()}>
        <OptionChips options={[options]}/>
      </Prompt>
    );
  }
  else {
    return <span><OptionChips options={[options]}/></span>;
  }
                                        
}

export default IssueEnvironment;
