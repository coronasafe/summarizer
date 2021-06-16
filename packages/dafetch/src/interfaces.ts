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
  getPullsForRepoBetween(
    repo: string,
    before: moment.MomentInput,
    after: moment.MomentInput
  ): Promise<Pull[]>;
  getReviewsForRepo(
    repo: string,
    before: moment.MomentInput,
    after: moment.MomentInput
  ): Promise<Review[]>;
}
