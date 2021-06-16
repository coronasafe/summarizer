export interface Pull {
  title: string;
  author: string;
  assignees: string[];
  reviewers: string[];
}

export interface Review {
  prTitle: string;
  reviewedBy: string[];
}

export interface InterfaceDAFetch {
  getTeamMembers(): Promise<string[]>;
  getPullsForRepoBetween(
    repo: string,
    before: string,
    after: string
  ): Promise<Pull[]>;
  getReviewsForRepo(
    repo: string,
    before: string,
    after: string
  ): Promise<Review[]>;
}
