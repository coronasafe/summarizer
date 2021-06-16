import * as moment from "moment";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import { InterfaceDAFetch, Pull, Review } from "./interfaces";

class DAFetch implements InterfaceDAFetch {
  private owner: string;
  private team_slug: string;
  private octo: InstanceType<typeof GitHub>;

  constructor(token: string, owner: string, team_slug: string) {
    this.owner = owner;
    this.team_slug = team_slug;
    this.octo = github.getOctokit(token);
  }

  public async getTeamMembers(): Promise<string[]> {
    const teams = await this.octo.rest.teams.listMembersInOrg({
      org: this.owner,
      team_slug: this.team_slug,
    });

    return teams.data.map((member) => member.login);
  }

  public async getPullsForRepoBetween(
    repo: string,
    before: string,
    after: string
  ): Promise<Pull[]> {
    const { data: allPulls } = await this.octo.rest.pulls.list({
      repo,
      owner: this.owner,
    });

    return allPulls
      .filter((pull) => moment(pull.created_at).isBetween(before, after))
      .map((pull) => {
        const title = pull.title;
        const author = pull.user.login;
        const assignees = pull.assignees.map((user) => user.login);
        const reviewers = pull.requested_reviewers.map((user) => user.login);

        return { title, author, assignees, reviewers };
      });
  }

  public async getReviewsForRepo(
    repo: string,
    before: string,
    after: string
  ): Promise<Review[]> {
    const { data: thePulls } = await this.octo.rest.pulls.list({
      repo,
      owner: this.owner,
      state: "open",
    });

    return await Promise.all(
      thePulls.map(async (pull) => {
        const { data: allReviews } = await this.octo.rest.pulls.listReviews({
          repo,
          owner: this.owner,
          pull_number: pull.number,
        });

        const prTitle = pull.title;
        const reviewedBy = allReviews
          .filter((review) =>
            moment(review.submitted_at).isBetween(before, after)
          )
          .map((review) => review.user.login);

        return { prTitle, reviewedBy };
      })
    );
  }
}

export default DAFetch;
