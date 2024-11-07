import React from 'react';
import { Issue as IssueType} from 'data/types';
import Input from 'components/presentation/Input';
import { estimateInHours, humanTimeInSingleUnit } from 'data/stats';

interface IssueEstimateProps {
  issue: IssueType;
  onUpdate?(update: any): void;
}

const IssueEstimate: React.FC<IssueEstimateProps> = (props) => {

  // When they move away from the field, write to the server
  const handleBlur = (value: string | undefined) => {
    props.onUpdate?.({ estimate: value, estimateChanged: true });
  }

  // Depending on whether there is an actual time, the estimate will be readonly
  if ( props.issue.humanTotalTimeSpent && props.issue.humanTotalTimeSpent.length > 0 ) {
    const hoursSpent = estimateInHours(props.issue.humanTotalTimeSpent);
    const hoursEstimate = estimateInHours(props.issue.humanTimeEstimate);
    const colors: any = () => {
      if ( hoursSpent <= (hoursEstimate - 4) ) {
        return { backgroundColor: '#EBF5FF', color: '#599CDA' };
      }
      else if ( hoursSpent <= hoursEstimate + 2 ) {
        return { backgroundColor: '#D2F9E477', color: '#18C467' };
      }
      else if ( hoursSpent <= hoursEstimate + 8 ) {
        return { backgroundColor: '#FEFFC277', color: '#DAAD0B' };
      }
      else {
        return { backgroundColor: '#FDCEED55', color: '#FB74CD' };
      }
    }
    return <div style={{
      ...colors(), 
      cursor: 'not-allowed', 
      width: '44px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '0', 
      margin: '0', 
      marginTop: '-1px', 
      textAlign: 'center', 
      height: '31px'}}>
        {humanTimeInSingleUnit(props.issue.humanTimeEstimate)}
      </div>
  }
  else {
    return (
      <Input value={humanTimeInSingleUnit(props.issue.humanTimeEstimate)} placeholder='Est' onBlur={handleBlur} size='compact'/>
    );
  }
}

export default IssueEstimate;
