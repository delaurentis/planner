import React from 'react';
import { Diff as DiffType, 
         DiffStatus } from 'data/types';
import { titleForUsername } from 'data/teams';
import { primaryLabelForDiff } from 'data/labels';
import Listing from 'components/presentation/Listing';
import ListingColumn from 'components/presentation/ListingColumn';

interface DiffProps {
  diff: DiffType;
  extraColumn?: string;
  onUpdateDiff?(update: any, diff?: DiffType): void;
}

const Diff: React.FC<DiffProps> = (props: DiffProps) => {

  // See how long it took for the first comment on the diff
  // We'll freeze the age clock then, which we use to assign our icon
  const msPerHour: number = 3600000;
  // const hoursSinceCreation: number = (new Date().getTime() - (props.diff.createdAt).getTime()) / msPerHour;
  // const hoursUntilFirstReview: number | undefined = props.diff.firstReviewAt && (((props.diff.firstReviewAt).getTime() - (props.diff.createdAt).getTime()) / msPerHour);
  // const hoursOfAging: number = hoursUntilFirstReview ? Math.min(hoursSinceCreation, hoursUntilFirstReview) : hoursSinceCreation;
  // const daysOfAging: number = hoursOfAging / 24;

  // Extract info from the [] in the issue name and remove them
  const primaryLabel = primaryLabelForDiff(props.diff);
  const bracketFreeTitle = props.diff.title.replace(/\[.*?\]/g, '');

  // This will convert some of our big numbers to K to keep them small enough to show
  const bigNumberToString = (number: number): string => {
    if ( number > 999 ) {
      return `${(number / 1000).toFixed(0)}K`;
    }
    return `${number}`;
  }

  // Optionally display line counts changed
  const lineCountColumns = (): React.ReactNode | undefined => {
    return (
      <span>
        <ListingColumn type='bigNumber' color='green' alignment='right'>
          {props.diff.additionsCount > 0 ? `+${bigNumberToString(props.diff.additionsCount)}` : ''}
        </ListingColumn>
        <ListingColumn type='whitespace'/>
        <ListingColumn type='bigNumber' color='red'>
          {props.diff.deletionsCount > 0 ? `-${bigNumberToString(props.diff.deletionsCount)}` : ''}
        </ListingColumn>
      </span>
    );
  }

  const computeDiffStatus = (): DiffStatus => {
    if ( props.diff.lastApprovalAt && props.diff.lastChangeRequestAt ) {
      if ( props.diff.lastApprovalAt.getTime() > props.diff.lastChangeRequestAt.getTime() ) {
        return { icon: '✅', name: 'approved', title: 'Approved', color: 'green', age: +new Date() - +props.diff.lastApprovalAt };
      }
      return { icon: '✏️', name: 'changeRequested', title: 'Revising', color: 'yellow', age: +new Date() - +props.diff.lastChangeRequestAt };
    }
    else if ( props.diff.lastApprovalAt ) {
      return { icon: '✅', name: 'approved', title: 'Approved', color: 'green', age: +new Date() - +props.diff.lastApprovalAt };
    }
    else if ( props.diff.lastChangeRequestAt ) {
      return { icon: '✏️', name: 'changeRequested', title: 'Revising', color: 'yellow', age: +new Date() - +props.diff.lastChangeRequestAt };
    }
    else {
      const ageSinceCreation = +new Date() - +props.diff.createdAt;
      const youngEnough = (ageSinceCreation / msPerHour) < 72;
      return { icon:  youngEnough ? '⏱' : '⏰', 
                name: 'waiting', 
                title: props.diff.firstReviewAt ? 'Reviewing' : 'Waiting',
                color: youngEnough ? 'gray': 'red',
                age: +new Date() - +(props.diff.firstReviewAt || props.diff.createdAt) };
    }
  }
  const diffStatus = computeDiffStatus();

  // TODO: Move into a separate helper file
  // Convert an age into a displayable number
  const ageSinceDate = (when: Date): number | undefined => when ? +new Date() - +when : undefined;
  const ageToString = (age: number | undefined): string => {
    if ( age ) {
      const hours = age / msPerHour;
      if ( hours < 1) {
        return `${(hours * 60).toFixed(0)}m`;
      }
      else if ( hours < 24 ) {
        return `${hours.toFixed(0)}h`;
      }
      else {
        return `${(hours / 24).toFixed(0)}d`;
      }
    }
    return '';
  }

  // Get a color from the age
  const colorFromAge = (age: number | undefined, goalInHours: number): 'red' | 'green' | 'gray' => {
    if ( age && (age / msPerHour < goalInHours) ) {
      return 'green';
    }
    return 'gray';
  }

  // Figure out what goes in the right column
  const extra = (): React.ReactNode | undefined => {
    if ( props.extraColumn === 'Overview' ) {
      return (
        <span>
          <ListingColumn type='medium' alignment='right'>{titleForUsername(props.diff.author)}</ListingColumn>
          <ListingColumn type='small' alignment='center' color='gray'>changed</ListingColumn>
          <ListingColumn type='icon'>
            {props.diff.changedFileCount > 25 ? '🗂' : '📄'}
          </ListingColumn>
          <ListingColumn type='number'>
            {bigNumberToString(props.diff.changedFileCount)}
          </ListingColumn>
          <ListingColumn type='widespace'/>
          <ListingColumn type='medium' alignment='right' color='gray'>{diffStatus.title}</ListingColumn>
          <ListingColumn type='halfspace'/>
          <ListingColumn type='icon' alignment='center'>{diffStatus.icon}</ListingColumn>
          <ListingColumn type='number' alignment='right'>{ageToString(diffStatus.age)}</ListingColumn>
          <ListingColumn type='widespace'/>
          <ListingColumn type='icon' url={props.diff.url} >{props.diff.reviewCount > 0 ? '💬 ' : '🤐 '}</ListingColumn>
          <ListingColumn type='number' url={props.diff.url} >{props.diff.reviewCount > 0 ? props.diff.reviewCount : '0'}</ListingColumn>
        </span>
      );
    }
    else if ( props.extraColumn === 'Scope' ) {
      return (
        <span>
          <ListingColumn type='medium' alignment='right'>{titleForUsername(props.diff.author)}</ListingColumn>
          <ListingColumn type='small' alignment='center' color='gray'>changed</ListingColumn>
          <ListingColumn type='icon'>
            {props.diff.changedFileCount > 25 ? '🗂' : '📄'}
          </ListingColumn>
          <ListingColumn type='number'>
            {bigNumberToString(props.diff.changedFileCount)}
          </ListingColumn>
          <ListingColumn type='widespace'/>
          {lineCountColumns()}
        </span>
      );
    }
    else if ( props.extraColumn === 'Reviewers' ) {
      return (
        <span>
          <ListingColumn type='unlimited' alignment='right'>
            {props.diff.allReviewers.map(username => titleForUsername(username)).join(', ')}
          </ListingColumn>
        </span>
      );
    }
    else if ( props.extraColumn === '1st Responder' ) {
      return (
        <span>
          <ListingColumn type='medium' alignment='right'>{props.diff.firstReviewer && titleForUsername(props.diff.firstReviewer)}</ListingColumn>
          <ListingColumn type='whitespace'/>
          <ListingColumn type='small' alignment='left' color='gray'>{props.diff.firstReviewer && 'responded'}</ListingColumn>
          <ListingColumn type='whitespace'/>
          <ListingColumn type='icon' url={props.diff.url}>{props.diff.firstReviewAt ? '💬 ' : '🤐'}</ListingColumn>
          <ListingColumn type='number' url={props.diff.url} alignment='right' color={colorFromAge(props.diff.firstReviewAge || ageSinceDate(props.diff.createdAt), 24)}>
            {ageToString(props.diff.firstReviewAge || ageSinceDate(props.diff.createdAt))}
          </ListingColumn>
        </span>
      );
    }
    return <span/>;
  }

  return (
    <div>
      <Listing icon={primaryLabel.icon}
               title={bracketFreeTitle}
               url={props.diff.url}
               entity={props.diff}
               placeholder='New Diff'
               actions={[]}
               extra={extra()}
               isNew={false} 
               isEditing={false}
               isHighlighted={false}/>
    </div>
  );
}

export default Diff;
