export interface Priority {
  icon: string;
  name: string;
  level: number;
  shortcut?: string;
}

export interface FilterReadouts {
  unassignedIssueCount?: number;
  fixedBugCount?: number;
  openBugCount?: number;
}

export interface Filter {
  year?: number;
  quarter?: number;
  sprint?: number;
  milestone: string;
  team: string;
  username?: string;
  showClosed?: boolean;
}

export type TeamLink = {
  title: string;
  url: string;
}

export interface Team {
  name: string;
  usernames?: string[];
  labels: string[];
  project: string;
  projectId?: number;
  parentTeam?: string;
  hideUserTabs?: boolean;
  links?: TeamLink[];
}

export interface User {
  name: string;
  username: string;
  teams: string[];
  githubUsername?: string;
}

export interface TeamMap {
  [name: string]: Team;
}

export interface AliasMap {
  [name: string]: string;
}

export interface VendorMap {
  [name: string]: Vendor;
}

export interface ProjectMap {
  [name: string]: number;
}

export interface IssueOrderMap {
  [id: string]: number;
}

export interface Label {
  icon?: string;
  name?: string;
  url?: string;
}

export interface Column {
  name: string;
  title: string;
  icon?: string;
  size: 'icon' | 'small' | 'medium' | 'large';
}

export interface OptionChoice {
  metadata: any;
  title: string;
  indent?: number;
}

export interface Option {
  title: string;
  name: string;
  isSelected?: boolean;
  isSelectable?: boolean;
  isToggleable?: boolean;
  isDimmable?: boolean;
  isExpanded?: boolean;
  isExpandable?: boolean;
  isMultiSelectable?: boolean;
  isBlank?: boolean;
  isSmall?: boolean;
  isIconOnly?: boolean;
  isAutoComplete?: boolean;
  choices?: OptionChoice[],
  tip?: string;
  onSelectOption?(option: Option, choice?: OptionChoice | undefined): void;
}

export interface Action {
  icon: string;
  name: string;
  shortcut?: string;
  isUndo?: boolean;
  isConfirmable?: boolean;
  confirmMessage?: string;
  update?: any;
  create?: any;
}

export interface Issue {
  iid?: number;
  id?: string;
  projectId?: number;
  labels?: any;
  webUrl?: string;
  webPath?: string;
  title?: string;
  createdAt?: any;
  updatedAt?: any;
  epic?: any;
  author?: any;
  assignees?: any;
  notes?: any;
  state?: string;
  description?: string;
  milestone?: Milestone;
  humanTimeEstimate?: string;
  dueDate?: string;
}

export interface Epic {
  iid: number;
  id: string;
  title: string;
  labels?: any;
  webUrl?: string;
  author?: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface Milestone {
  iid?: number;
  id?: string;
  title: string;
}

export interface Resolution {
  icon: string;
  name: string;
  label: string;
}

export interface Flag {
  icon: string;
  name: string;
  label: string;
  category: string;
}

export interface Environment {
  icon: string;
  name: string;
  label: string;
}

type VendorTestCallback = (data: any) => boolean;

export interface Vendor {
  name: string;
  title: string;
  host: string;
  scope: string;
  tokenName: string;
  refreshTokenName: string;
  graphUrl: string;
  restUrl: string;
  authorizeUrl: string;
  personalTokenUrl: string;
  accessTokenRequestUrl: string;
  instructionTitle: string;
  instructionBody: any;
  instructionImage: string;
  redirectAfterLogin: boolean;
  isLoginFullscreen: boolean;
  clientId?: string;
  clientSecret?: string;
  redirectUrl?: string;
  postAuthRedirectPath: string;
  testQuery: any;
  testQueryVariables?: any;
  isTestOk: VendorTestCallback;
}

export interface Diff {
  number: number;
  title: string;
  author: string;
  url: string;
  isDraft: boolean;
  isApproved: boolean;
  createdAt: Date;
  lastEditedAt: Date;
  allReviewers: string[];
  firstReviewAt?: Date;
  firstReviewAge?: number;
  firstReviewer?: string;
  assignedReviewers?: string[];
  approvedBy: string[];
  lastApprovalAt?: Date;
  lastChangeRequestAt?: Date;
  reviewCount: number;
  changedFileCount: number;
  additionsCount: number;
  deletionsCount: number;
}

export type DiffStatusColor = 'green' | 'yellow' | 'red' | 'gray';
export interface DiffStatus {
  icon: string;
  name: string;
  color: DiffStatusColor;
  title: string;
  age: number;
}