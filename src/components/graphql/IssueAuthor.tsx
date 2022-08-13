import React from 'react';
import Chip from 'components/presentation/Chip';
import { titleForUsername } from 'data/teams';
import { organization } from 'data/customize';
import { Issue as IssueType, Team } from 'data/types';

interface IssueAuthorProps {
  issue: IssueType;
  team?: Team;
  username?: string;
}

const IssueAuthor: React.FC<IssueAuthorProps> = (props) => {
  return (
    <Chip 
      size='medium' 
      isCenteredVertically={true} 
      url={`https://gitlab.com/groups/${organization}/-/issues?author_username=${props.issue.author?.username}`}
    >
      <span title='The author of the issue'>✍️ {titleForUsername(props.issue.author?.username)}</span>
    </Chip>
  )
}

export default IssueAuthor;
