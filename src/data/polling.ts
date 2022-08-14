
// We stagger our polling so it doesn't happen at the same time
// This keeps response times faster
export const polling: any = {
  frequency: {
    allIssue: 10000,
    issueDetail: 10000,
    unassignedIssueCount: 32250,
    bugCount: 33500,
    epics: 123400,
    pullRequests: (15 * 60000) + 4000,
  },
  period: {
    changedIssue: 10000
  }
}