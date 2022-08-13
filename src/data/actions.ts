import { priorities, labelFromPriority } from './priorities';
import { officialLabelNames, primaryLabelForIssue } from './labels';

// Based on state, what do we need to tell the API to update
export const updateForAction = (action: any, labelToRemove: any) => {
  
  // Compose our label names
  const labelNameToAdd = `${action.name} ${action.icon}`
  const labelNameToRemove = `${labelToRemove.name} ${labelToRemove.icon}`;

  // Handle different actions differently
  if ( action.icon === '✅' ) {
    if ( action.isUndo ) {
      return { state_event: 'reopen' };
    }
    else {  
      // Remove state labels that are mutually exclusive with completion
      const removeWhenClosing = [
        officialLabelNames.doing, 
        officialLabelNames.review, 
        officialLabelNames.blocked, 
        officialLabelNames.paused
      ];
      return { state_event: 'close', remove_labels: removeWhenClosing.join(',') };
    }
  } 
  else if ( action.icon === '🗑' ) {
    return { delete: true };
  }
  else {

    // If we go from just showing a priority as the icon to Done or Doing, we want to not remove priority
    // If we go from 1 priority to another, we want to remove the old priority label
    const priorityLabels = priorities.map(priority => labelFromPriority(priority));
    if ( !priorityLabels.includes(labelNameToAdd) && priorityLabels.includes(labelNameToRemove) ) {
      return { add_labels: labelNameToAdd };
    }
    else {
      return { add_labels: labelNameToAdd, remove_labels: labelNameToRemove };
    }
  }
}

// Some action we re-use a bunch
const deleteAction = { icon: '🗑', name: 'Delete', shortcut: 'x', isConfirmable: true, confirmMessage: 'Are you sure you want to delete this issue' };

// Figure out our actions based on our state
const actionsForIcon: any = { 
  '✅': [{ icon: '✅', name: 'Complete', shortcut: 'C', isUndo: true },
         deleteAction],
  '⏳': [{ icon: '✅', name: 'Complete', shortcut: 'c'},
         { icon: '👓', name: 'Review', shortcut: 'r'},
         { icon: '⏳', name: 'Doing', shortcut: 'D', isUndo: true },
         /*{ icon: '⏸', name: 'Paused'},*/
         { icon: '🛑', name: 'Blocked'},
         deleteAction],
  '👓': [{ icon: '✅', name: 'Complete', shortcut: 'c'},
         { icon: '👓', name: 'Review', shortcut: 'R', isUndo: true },
         { icon: '⏳', name: 'Doing', shortcut: 'd'},
         { icon: '🛑', name: 'Blocked'},
         deleteAction],
  '⏸': [{ icon: '✅', name: 'Complete', shortcut: 'c'},
         { icon: '⏳', name: 'Doing', shortcut: 'd'},
         { icon: '⏸', name: 'Paused', isUndo: true },
         { icon: '🛑', name: 'Blocked'},
         ...priorities,
         deleteAction],
  '🛑': [{ icon: '✅', name: 'Complete', shortcut: 'c'},
         { icon: '⏳', name: 'Doing', shortcut: 'd'},
         { icon: '🛑', name: 'Blocked', isUndo: true },
         ...priorities,
         deleteAction],
  '🧺': [...priorities, 
         deleteAction],

  /* Handle default case */
  '❓': [{ icon: '✅', name: 'Complete', shortcut: 'c'},
         { icon: '👓', name: 'Review', shortcut: 'r'},
         { icon: '⏳', name: 'Doing', shortcut: 'd'},
         ...priorities,
         deleteAction ],

  /* Handle case for each priority */
  ...priorities.map(priority => {

    // These are available to any priority level
    const standardActions = [{ icon: '✅', name: 'Complete'},
                             { icon: '👓', name: 'Review'},
                             { icon: '⏳', name: 'Doing'},
                             { icon: '🛑', name: 'Blocked'}];

    // Combine priorities with our standard actions
    return { [priority.icon]: [ ...priorities.filter(other => other.icon !== priority.icon), ...standardActions]  }
  })
}

// Figure out what actions to show and what they'll do
export const actionsForPrimaryLabel = (primaryLabel: any) => {

  // Annotate all of our actions with update instructions
  const actions = actionsForIcon[primaryLabel.icon] || actionsForIcon['❓'];
  return actions.map((action: any) => { return { ...action, update: updateForAction(action, primaryLabel) } });
}

// Shortcut method gets all actions for the given issue (with update instructions)
export const actionsForIssue = (issue: any) => actionsForPrimaryLabel(primaryLabelForIssue(issue));

