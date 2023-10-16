import React from 'react';
import { Issue as IssueType} from 'data/types';
import Input from 'components/presentation/Input';

interface IssueEstimateProps {
  issue: IssueType;
  onUpdate?(update: any): void;
}

const IssueEstimate: React.FC<IssueEstimateProps> = (props) => {

  // We just add or remove labels based on this
  const handleBlur = (value: string | undefined) => {
    props.onUpdate?.({ duration: value });
  }

  // Show both weeks
  return (
    <Input value={props.issue.humanTimeEstimate} onBlur={handleBlur}/>
  );
}

export default IssueEstimate;
