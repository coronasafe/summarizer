import * as moment from "moment";
import * as github from "@actions/github";

const main = async () => {
  const octo = github.getOctokit(process.env.DISCUSSION_TOKEN);
  const cfePullRequests = await octo.rest.pulls.list({
    repo: "care_fe",
    owner: "coronasafe",
  });

  // All PRs made today at coronasafe/care_fe
  const thePRS = cfePullRequests.data.filter((prs) =>
    moment(prs.created_at).isSame(moment(), "date")
  );

  return thePRS;
};

main().catch(console.error);
