import React from 'react';
import { primaryLabelForEpic } from 'data/labels';
import { actionsForPrimaryLabel } from 'data/actions';
import { Epic as EpicType, 
         Label as LabelType,
         Action as ActionType,
         Milestone as MilestoneType,
         Team } from 'data/types';
import Listing from 'components/presentation/Listing';

interface EpicProps {
  epic?: EpicType;
  isEditing?: boolean;
  extraColumn?: string;
  milestone?: MilestoneType,
  team?: Team;
  onUpdateEpic?(update: any, epic?: EpicType): void;
}

const Epic: React.FC<EpicProps> = (props) => {

  // Make sure we have some kind of epic
  const epic: EpicType | undefined = props.epic;
  
  // We'll handle updates to this issue
  // but if a new issue is being created, pass it to the parent
  // const [updateIssue] = useMutation(UPDATE_ISSUE);
  const handleUpdate = (update: any, entity: any) => {
    props.onUpdateEpic?.(update, entity);
  }

  // Get all labels to display below, and pick which one
  // matters most so we can display the right icon + next actions
  const labelNames: string[] = epic?.labels?.nodes?.map((labelNode: any) => labelNode.title) || [];
  const primaryLabel: LabelType = primaryLabelForEpic(epic);

  // What are the next actions we should show for this issue if they click the icon
  const possibleActions: ActionType[] = actionsForPrimaryLabel(primaryLabel);

  // Create our label objects which will become clickable URLs
  const labels: LabelType[] = labelNames.map((name: string) => {
    return { name, url: `https://gitlab.com/groups/team/-/epics?label_name=${name}` };
  });

  // Figure out what goes in the right column
  const extra = (): React.ReactNode | undefined => {
    return undefined;
  }

  // See how fresh the issue is
  const msSinceCreation = new Date().getTime() - (epic?.createdAt && new Date(epic?.createdAt).getTime());
  const msSinceUpdate = new Date().getTime() - (epic?.updatedAt && new Date(epic?.updatedAt).getTime());
  const isNew = (msSinceCreation < 10000) || (msSinceUpdate < 20000);

  return (
    <div>
      <Listing icon={primaryLabel.icon}
            title={epic?.title}
            url={epic?.webUrl}
            entity={epic}
            placeholder='New Epic'
            actions={possibleActions}
            labels={props.extraColumn === 'Labels' ? labels : undefined}
            extra={extra()}
            isNew={isNew} 
            isEditing={props.isEditing}
            isHighlighted={(primaryLabel.name === 'Doing')}
            onUpdate={handleUpdate}/>
    </div>
  );
}

export default Epic;
