export interface Pull {
  repo: string;
  title: string;
  author: string;
  assignees: string[];
  reviewers: string[];
}

export interface Review {
  repo: string;
  prTitle: string;
  reviewedBy: string[];
}

export interface InterfaceDAFetch {
  getTeamMembers(): Promise<string[]>;
  getPullsForRepoToday(repo: string): Promise<Pull[]>;
  getReviewsForRepoToday(repo: string): Promise<Review[]>;
}
