import React from 'react';
import Card from '../presentation/Card';
import Diff from './Diff';
import { Option, OptionChoice, Diff as DiffType, Team } from 'data/types';
import { extraDiffColumns } from 'data/extras';
import { titleForUsername } from 'data/teams';
import { ApolloClient, NormalizedCacheObject, useQuery, useApolloClient } from "@apollo/client";
import { MERGE_REQUESTS, EXTRA_DIFF_COLUMN } from 'data/queries';
import { polling } from 'data/polling';

interface DiffsProps {
  project?: string;
  team?: Team;
  client?: ApolloClient<NormalizedCacheObject>; // optional
}

const Diffs: React.FC<DiffsProps> = (props: DiffsProps) => {

  // The card has a setting that controls what we show on the right column
  // We'll store that setting globally for all cards
  const client = useApolloClient();
  const extraQuery = useQuery(EXTRA_DIFF_COLUMN, { client });
  const handleExtra = (option: Option, choice: OptionChoice) => {
    client.writeQuery({ query: EXTRA_DIFF_COLUMN, data: { extraDiffColumn: choice.title } });
    window.localStorage.setItem('extraDiffColumn', choice.title);
  }

  // TODO: We should add variables here so 
  // we can abstract out project and team
  const variables = () => {
    return { fullPath: `team/${props.project}` } 
  }
  
  // Load open pull requests from cache, then API, and then refresh every 15 minutes
  const openQuery = useQuery(MERGE_REQUESTS, { pollInterval: polling.frequency.pullRequests, variables: variables(), client: client }) || {};

  // Convert nested data from GitHub into our flat local data structure
  const nodes: any[] = openQuery.data?.project?.mergeRequests?.nodes || [];
  const diffs: DiffType[] = nodes.map((pull: any) => {
    // Take all the notes and put them together into a flat array
    const notes = pull.discussions?.nodes?.reduce((notes, discussion) => { 
      return [...notes, ...discussion?.notes?.nodes];
    }, []);

    // Find any notes by other people, not the author of the MR
    const otherReviews: any[] = notes.filter(note => note.author?.username !== pull.author?.username ) || [];
    const firstReview: any = otherReviews[0];

    const reviewNoteAuthors = otherReviews.map(review => review.author?.username)
    const approvers = pull.approvedBy?.nodes?.map(node => node.usernames) || [];
    const assignedReviewers = pull.assignees?.nodes?.map(node => node.username) || []
    const allReviewers = [...new Set([...reviewNoteAuthors, ...approvers, ...assignedReviewers].filter(x => x !== undefined))];
    //const assignedReviewerLogins: string[] = pull.assignees?.nodes?.map(node => node.login)?.filter(login => login !== pull.author?.login) || []
    //const assignedReviewers: string[] = assignedReviewerLogins.map(login => usernamesForDiffLogins[login] || login) || [];
    //const descendingReviews: any[] = pull.reviews?.nodes || [];
    //const lastApproval: any = descendingReviews.find(node => node.state === 'APPROVED' );
    //const lastChangeRequest: any = descendingReviews.find(node => node.state === 'CHANGES_REQUESTED' );
    return { number: pull.id,
             title: pull.title,
             url: pull.webUrl,
             author: titleForUsername(pull.author?.username),
             isDraft: pull.draft,
             isApproved: pull.approvedBy?.nodes?.length > 0,
             approvedBy: pull.approvedBy?.nodes?.map(node => node.username) || [],
             createdAt: pull.createdAt && new Date(pull.createdAt),
             lastEditedAt: pull.updatedAt && new Date(pull.updatedAt),
             firstReviewAt: firstReview?.createdAt && new Date(firstReview?.createdAt),
             firstReviewAge: firstReview?.createdAt && pull.createdAt && (+new Date(firstReview?.createdAt) - +new Date(pull.createdAt)),
             firstReviewer: firstReview?.author?.username,
             /*allReviewers,
             /*lastApprovalAt: lastApproval?.createdAt && new Date(lastApproval?.createdAt),
             lastChangeRequestAt: lastChangeRequest?.createdAt && new Date(lastChangeRequest?.createdAt),*/
             reviewCount: otherReviews.length,
             assignedReviewers: assignedReviewers,
             allReviewers: allReviewers,
             changedFileCount: pull.diffStatsSummary.fileCount || 0,
             additionsCount: pull.diffStatsSummary.additions || 0,
             deletionsCount: pull.diffStatsSummary.deletions || 0
           };
  });

  // We're only going to show a team at a time
  // to keep the list of diff's sensible
  const teamUsernames: string[] = props.team?.usernames || [];
  const nonDraftDiffs: DiffType[] = diffs.filter((diff: DiffType) => !diff.isDraft);
  const teamDiffs: DiffType[] = nonDraftDiffs.filter((diff: DiffType) => teamUsernames.includes(diff.author));
  
  // Filter bugs and features separately
  // const bugDiffs: DiffType[] = diffs.filter((diff: DiffType) => diff.title.toUpperCase().includes('[FIX]'));
  const approvedDiffs: DiffType[] = diffs.filter((diff: DiffType) => !diff.isDraft && diff.isApproved);
  const reviewDiffs: DiffType[] = diffs.filter((diff: DiffType) => !diff.isDraft && !diff.isApproved);
  const draftDiffs: DiffType[] = diffs.filter((diff: DiffType) => diff.isDraft);

  // Controls what we show in the right column
  const cardOption: Option = {
    title: extraQuery.data?.extraDiffColumn,
    name: extraQuery.data?.extraDiffColumn,
    isSelected: false,
    isSelectable: false,
    isExpandable: true,
    choices: extraDiffColumns,
    onSelectOption: handleExtra
  };

  return (
    <div>
      <Card key='approved'
            title='Approved'
            titleUrl=''
            isLoading={false}
            option={cardOption}>
        {
          approvedDiffs.map((diff: DiffType) => 
            <Diff key={diff.number} diff={diff} extraColumn={extraQuery.data?.extraDiffColumn}/>
          )
        }
      </Card>
      <Card key='review'
            title='Needs Review'
            titleUrl=''
            isLoading={false}
            option={cardOption}>
        {
          reviewDiffs.map((diff: DiffType) => 
            <Diff key={diff.number} diff={diff} extraColumn={extraQuery.data?.extraDiffColumn}/>
          )
        }
      </Card>
      <Card key='drafts'
            title='Drafts'
            titleUrl=''
            isLoading={false}
            option={cardOption}>
        {
          draftDiffs.map((diff: DiffType) => 
            <Diff key={diff.number} diff={diff} extraColumn={extraQuery.data?.extraDiffColumn}/>
          )
        }
      </Card>
    </div>
  );
}

export default Diffs;