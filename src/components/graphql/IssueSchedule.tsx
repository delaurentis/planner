// NOTE: I hope to use this file soon but right now when I 
// separate this from the listing it's no longer updating the UI
// when we change the apollo cache

import React from 'react';
import { Issue as IssueType} from 'data/types';
import Weeks from 'components/presentation/Weeks';

interface IssueScheduleProps {
  issue: IssueType;
  onUpdate?(update: any): void;
}

const IssueSchedule: React.FC<IssueScheduleProps> = (props) => {

  // We use the names of labels t o determine what days to show highlighted
  // This is because GitLab doesn't have custom fields we can use
  const labelNames: string[] = props.issue?.labels?.nodes?.map((labelNode: any) => labelNode.title) || [];

  // We just add or remove labels based on this
  const handleChangeSchedule = (dayLabel: string, scheduled: boolean) => {
    if ( scheduled ) {
      props.onUpdate?.({ add_labels: dayLabel });
    }
    else {
      props.onUpdate?.({ remove_labels: dayLabel });
    }
  }

  // Show both weeks
  return (
    <Weeks weeks={[['W','Th','F'],['M','T','W','Th','F'], ['M','T']]} 
           dayLabels={labelNames} 
           onChangeSchedule={handleChangeSchedule}/>
  );
}

export default IssueSchedule;
