import { priorities, labelFromPriority } from './priorities';
import { primaryLabelForIssue } from './labels';

// Based on state, what do we need to tell the API to update
const updateForAction = (action: any, labelToRemove: any) => {
  
  // Compose our label names
  const labelNameToAdd = `${action.name} ${action.icon}`
  const labelNameToRemove = `${labelToRemove.name} ${labelToRemove.icon}`;

  // Handle different actions differently
  if ( action.icon === '✅' ) {
    const removeWhenClosing = ['Doing ⏳', 'Review 👓', 'Blocked 🛑', 'Paused ⏸', ...[labelNameToRemove]];
    return { state_event: 'close', remove_labels: removeWhenClosing.join(',') };
  } 
  else if ( action.icon === '📖' ) {
    return { state_event: 'reopen' };
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

// Figure out our actions based on our state
const actionsForIcon: any = {
  '✅': [{ icon: '📖', name: 'Reopen'}, 
         { icon: '🗑', name: 'Delete'}],
  '⏳': [{ icon: '✅', name: 'Done'},
         { icon: '👓', name: 'Review'},
         { icon: '⏸', name: 'Paused'},
         { icon: '🛑', name: 'Blocked'},
         { icon: '🗑', name: 'Delete'}],
  '👓': [{ icon: '✅', name: 'Done'},
         { icon: '⏳', name: 'Doing'},
         { icon: '⏸', name: 'Paused'},
         { icon: '🛑', name: 'Blocked'},
         { icon: '🗑', name: 'Delete'}],
  '⏸': [{ icon: '⏳', name: 'Doing'},
         { icon: '✅', name: 'Done'},
         { icon: '🛑', name: 'Blocked'},
         ...priorities,
         { icon: '🗑', name: 'Delete'}],
  '🛑': [{ icon: '✅', name: 'Done'},
         { icon: '⏳', name: 'Doing'},
         { icon: '⏸', name: 'Paused'},
         ...priorities,
         { icon: '🗑', name: 'Delete'}],
  '🧺': [...priorities, { icon: '🗑', name: 'Delete'}],

  /* Handle default case */
  '❓': [{ icon: '✅', name: 'Done'},
         { icon: '⏳', name: 'Doing'},
         { icon: '⏸', name: 'Paused'},
         ...priorities,
         { icon: '🗑', name: 'Delete'}],

  /* Handle case for each priority */
  ...priorities.map(priority => {

    // These are available to any priority level
    const standardActions = [{ icon: '✅', name: 'Done'},
                             { icon: '👓', name: 'Review'},
                             { icon: '⏳', name: 'Doing'},
                             { icon: '⏸', name: 'Paused'},
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

