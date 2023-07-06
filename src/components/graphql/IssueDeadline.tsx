import React from 'react';
import { Issue as IssueType} from 'data/types';
import { numericDateToText, textDateToNumeric } from 'util/dates';
import Input from 'components/presentation/Input';

interface IssueDeadlineProps {
  issue: IssueType;
  onUpdate?(update: any): void;
}

const IssueDeadline: React.FC<IssueDeadlineProps> = (props) => {

  // We just add or remove labels based on this
  const handleBlur = (value: string | undefined) => {

    // If something is input, then save it
    if ( value && value.length > 0 ) {
      props.onUpdate?.({ due_date: textDateToNumeric(value) });
    }
    else {
      props.onUpdate?.({ due_date: 0 });
    }
  }

  // Show our deadline
  return (
    <span>
        <Input size='medium' value={numericDateToText(props.issue.dueDate)} onBlur={handleBlur}/>
    </span>
  );
}

export default IssueDeadline;
