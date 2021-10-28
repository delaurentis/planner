import React from 'react';
import Card from '../presentation/Card';
import Diff from './Diff';
import { Option, OptionChoice, Diff as DiffType, Team } from 'data/types';
import { extraDiffColumns } from 'data/extras';
import { usernamesForDiffLogins } from 'data/teams';
import { ApolloClient, NormalizedCacheObject, useQuery } from "@apollo/client";
import { PULL_REQUESTS, EXTRA_COLUMN } from 'data/queries';
import { polling } from 'data/polling';

interface DiffsProps {
  project?: string;
  team?: Team;
  client?: ApolloClient<NormalizedCacheObject>; // optional
}

const Diffs: React.FC<DiffsProps> = (props: DiffsProps) => {

  // The card has a setting that controls what we show on the right column
  // We'll store that setting globally for all cards
  const extraQuery = useQuery(EXTRA_COLUMN, { client: props.client });
  const handleExtra = (option: Option, choice: OptionChoice) => {
    props.client?.writeQuery({ query: EXTRA_COLUMN, data: { extraColumn: choice.title } });
    window.localStorage.setItem('extraDiffsColumn', choice.title);
  }

  // TODO: We should add variables here so 
  // we can abstract out project and team
  const variables = () => {
    return { } 
  }
  
  // Load open pull requests from cache, then API, and then refresh every 15 minutes
  const openQuery = useQuery(PULL_REQUESTS, { pollInterval: polling.frequency.pullRequests, variables: variables(), client: props.client }) || {};

  // Convert nested data from GitHub into our flat local data structure
  const nodes: any[] = openQuery.data?.organization?.repository?.pullRequests?.nodes || [];
  const diffs: DiffType[] = nodes.map((pull: any) => {
    const otherReviews: any[] = pull.reviews?.nodes?.filter(node => node.author?.login !== pull.author?.login ) || [];
    const allReviewers: string[] = [...(otherReviews.reduce((reviewers, review) => {
      if ( review.author?.login ) {
        reviewers.add(usernamesForDiffLogins[review.author?.login] || review.author?.login);
      }
      return reviewers;
    }, new Set()))];
    const assignedReviewerLogins: string[] = pull.assignees?.nodes?.map(node => node.login)?.filter(login => login !== pull.author?.login) || []
    const assignedReviewers: string[] = assignedReviewerLogins.map(login => usernamesForDiffLogins[login] || login) || [];
    const firstReview: any = otherReviews[0];
    const descendingReviews: any[] = pull.reviews?.nodes || [];
    const lastApproval: any = descendingReviews.find(node => node.state === 'APPROVED' );
    const lastChangeRequest: any = descendingReviews.find(node => node.state === 'CHANGES_REQUESTED' );
    return { number: pull.number,
             title: pull.title,
             url: pull.url,
             author: usernamesForDiffLogins[pull.author?.login],
             isDraft: pull.isDraft,
             createdAt: pull.createdAt && new Date(pull.createdAt),
             lastEditedAt: pull.lastEditedAt && new Date(pull.lastEditedAt),
             firstReviewAt: firstReview?.createdAt && new Date(firstReview?.createdAt),
             firstReviewAge: firstReview?.createdAt && pull.createdAt && (+new Date(firstReview?.createdAt) - +new Date(pull.createdAt)),
             firstReviewer: firstReview?.author?.login && usernamesForDiffLogins[firstReview?.author?.login],
             allReviewers,
             assignedReviewers,
             lastApprovalAt: lastApproval?.createdAt && new Date(lastApproval?.createdAt),
             lastChangeRequestAt: lastChangeRequest?.createdAt && new Date(lastChangeRequest?.createdAt),
             reviewCount: otherReviews.length,
             changedFileCount: pull.changedFiles,
             additionsCount: pull.additions,
             deletionsCount: pull.deletions
           };
  });

  // We're only going to show a team at a time
  // to keep the list of diff's sensible
  const teamUsernames: string[] = props.team?.usernames || [];
  const nonDraftDiffs: DiffType[] = diffs.filter((diff: DiffType) => !diff.isDraft);
  const teamDiffs: DiffType[] = nonDraftDiffs.filter((diff: DiffType) => teamUsernames.includes(diff.author));
  
  // Filter bugs and features separately
  const bugDiffs: DiffType[] = teamDiffs.filter((diff: DiffType) => diff.title.toUpperCase().includes('[FIX]'));
  const featureDiffs: DiffType[] = teamDiffs.filter((diff: DiffType) => !diff.title.toUpperCase().includes('[FIX]'));

  // Controls what we show in the right column
  const cardOption: Option = {
    title: extraQuery.data?.extraColumn,
    name: extraQuery.data?.extraColumn,
    isSelected: false,
    isSelectable: false,
    isExpandable: true,
    choices: extraDiffColumns,
    onSelectOption: handleExtra
  };

  return (
    <div>
      <Card key='fixes'
            title='Fixes'
            titleUrl='https://github.com/companyname/reponame/pulls'
            isLoading={false}
            option={cardOption}>
        {
          bugDiffs.map((diff: DiffType) => 
            <Diff key={diff.number} diff={diff} extraColumn={extraQuery.data?.extraColumn}/>
          )
        }
      </Card>
      <Card key='features'
            title='Features'
            titleUrl='https://github.com/companyname/reponame/pulls'
            isLoading={false}
            option={cardOption}>
        {
          featureDiffs.map((diff: DiffType) => 
            <Diff key={diff.number} diff={diff} extraColumn={extraQuery.data?.extraColumn}/>
          )
        }
      </Card>
    </div>
  );
}

export default Diffs;