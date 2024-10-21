// NOTE: I hope to use this file soon but right now when I
// separate this from the listing it's no longer updating the UI
// when we change the apollo cache

import React, { useState } from 'react';
import { Issue as IssueType,
         Milestone as MilestoneType,
         Option as OptionType,
         MilestoneLibrary } from 'data/types';
import OptionChips from 'components/presentation/OptionChips';
import IssueMilestones from './IssueMilestones';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { SET_ISSUE_MILESTONE } from 'data/queries';
import { milestoneFromTitle } from 'data/milestones';

interface IssueMilestoneProps {
  issue: IssueType;
  milestone?: MilestoneType;
  milestones: MilestoneLibrary;
  onUpdating?(updating: boolean): void;
}

const IssueMilestone: React.FC<IssueMilestoneProps> = (props) => {

  // Give a way to update the cache so we can show the change quickly
  const client = useApolloClient();
  const cacheIssueWithMilestone = (milestone: MilestoneType, updatedAt: any) => {
    client.writeFragment({
      id: `Issue:${props.issue.id}`,
      fragment: gql`fragment IssueWithNewMilestone on Issue { milestone, updatedAt }`,
      data: { __typename: 'Issue', milestone: { '__ref': `Milestone:${milestone.id}` }, updatedAt }
    });
  }

  // Controls whether or not the popup is showing because
  // if we are editing the project we need to show it
  const [isEditing, setEditing] = useState<boolean>(false);

  // Update milestone
  const [setMilestone, ] = useMutation(SET_ISSUE_MILESTONE);
  const handleSelectMilestone = (milestone: MilestoneType) => {

    // When the milestone is updated on the server, cache locally
    const updatedMilestone = (cache) => { props.onUpdating?.(false); }

    // Feed the new milestone into the cache
    cacheIssueWithMilestone(milestone, new Date());

    // To update the milestone, we need the project path
    const projectPath: string | undefined = props.issue.webPath?.split('/-')?.[0].slice(1);
    setMilestone({ update: updatedMilestone,
                   variables: { projectPath: projectPath,
                                 iid: props.issue?.iid,
                                 milestoneId: milestone?.id},
                });


    // This will trigger the parent to update it's UI
    props.onUpdating?.(true);
  }

  // We need milestone IDs to be able to write to GitLab
  // So let's find all the milestone objects from GraphQL
  // corresponding to the milestone names we know and love
  const nextTwoMilestones = props.milestones.upcomingSprints.slice(0, 2);
  const suggestedMilestones: MilestoneType[] = [props.milestones.currentSprint!, ...nextTwoMilestones, milestoneFromTitle('Backlog', props.milestones)]

  // Generate a list of tabs based on upcoming milestones
  const options: OptionType[] = suggestedMilestones.map((milestone: MilestoneType) => {
    return { title: milestone.title,
             name: milestone.title,
             isSelected: (props.milestone?.title === milestone.title),
             isSelectable: true,
             isExpandable: false,
             isSmall: true,
             onSelectOption: () => { handleSelectMilestone(milestone); }
    };
  })

  // Generate an extra ... option
  const moreOption: OptionType = {
    title: '⋯',
    name: 'More',
    isSelected: false,
    isSelectable: true,
    isExpandable: false,
    isSmall: true,
    onSelectOption: () => {
      setEditing(true);
    }
  }

  // Only show the project picker if we're editing
  const picker = () => {
    if ( isEditing ) {
      return (
        <span>
          <IssueMilestones
            milestone={props.issue.milestone}
            onCancel={() => { setEditing(false); }}
            onSelectMilestone={(milestone: MilestoneType) => {
              handleSelectMilestone(milestone);
              setEditing(false);
            }}
          />
        </span>
      );
    }
    return undefined;
  }

  // Put all of our groups together
  return <span>
    <OptionChips options={[[...options, moreOption]]}/>
    {picker()}
  </span>;
}

export default IssueMilestone;
