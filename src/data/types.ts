export interface Priority {
  icon: string;
  name: string;
  level: number;
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
  usernames: string[];
  labels: string[];
  project: string;
  parentTeam?: string;
  hideUserTabs?: boolean;
  links?: TeamLink[];
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
  isBlank?: boolean;
  isSmall?: boolean;
  isIconOnly?: boolean;
  isAutoComplete?: boolean;
  choices?: OptionChoice[],
  onSelectOption?(option: Option, choice?: OptionChoice | undefined): void;
}

export interface Action {
  icon: string;
  name: string;
  update?: any;
  create?: any;
}

export interface Issue {
  iid?: number;
  id?: string;
  labels?: any;
  webUrl?: string;
  webPath?: string;
  title?: string;
  createdAt?: any;
  updatedAt?: any;
  epic?: any;
  author?: any;
  assignees?: any;
  state?: string;
  milestone?: Milestone;
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

export interface Environment {
  icon: string;
  name: string;
  label: string;
}

type VendorTestCallback = (data: any) => boolean;

export interface Vendor {
  name: string;
  host: string;
  scope: string;
  tokenName: string;
  graphUrl: string;
  restUrl: string;
  authorizeUrl: string;
  personalTokenUrl: string;
  instructionTitle: string;
  instructionBody: any;
  instructionImage: string;
  redirectAfterLogin: boolean;
  isLoginFullscreen: boolean;
  clientId?: string;
  clientSecret?: string;
  redirectUrl?: string;
  testQuery: any;
  isTestOk: VendorTestCallback;
}

export interface Diff {
  number: number;
  title: string;
  author: string;
  url: string;
  isDraft: boolean;
  createdAt: Date;
  lastEditedAt: Date;
  firstReviewAt: Date;
  firstReviewAge: number;
  firstReviewer: string;
  allReviewers: string[];
  assignedReviewers: string[];
  lastApprovalAt: Date;
  lastChangeRequestAt: Date;
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