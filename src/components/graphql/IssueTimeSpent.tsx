import React from 'react';
import { Issue as IssueType} from 'data/types';
import Input from 'components/presentation/Input';

interface IssueTimeSpentProps {
  issue: IssueType;
  onUpdate?(update: any): void;
}

const IssueTimeSpent: React.FC<IssueTimeSpentProps> = (props) => {

  // We just add or remove labels based on this
  const handleBlur = (value: string | undefined) => {
    props.onUpdate?.({ timeSpent: value, timeSpentChanged: true });
  }

  // Show both weeks
  return (
    <span style={{borderLeft: '1px solid rgba(0,0,0,0.1)', marginTop: '-2px', paddingTop: '2px'}}>
      <Input value={props.issue.humanTotalTimeSpent} placeholder='Act' onBlur={handleBlur} size='compact'/>
    </span>
  );
}

export default IssueTimeSpent;
