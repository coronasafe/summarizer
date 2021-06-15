import * as dotenv from "dotenv";
import * as moment from "moment";
import * as github from "@actions/github";

dotenv.config();
const repos = ["care_fe", "care", "life", "dashboard", "citizen", "arike"];

const main = async () => {
  const octo = github.getOctokit(process.env.DISCUSSION_TOKEN);
  const cefStudents = await octo.rest.teams.listMembersInOrg({
    org: "coronasafe",
    team_slug: "cef",
  });

  // All members inside the CEF team
  const students = cefStudents.data.map((student) => student.login);

  // Every PR made by users inside CEF team, grouped by repos.
  const thePRs = await Promise.all(
    repos.map(async (repo) => {
      const { data: allPRs } = await octo.rest.pulls.list({
        repo,
        owner: "coronasafe",
      });

      const todaysPR = allPRs
        .filter((pr) => moment(pr.created_at).isSame(moment(), "date"))
        .filter((pr) => students.includes(pr.user.login))
        .map((pr) => {
          const title = pr.title;
          const author = pr.user.login;
          const assignees = pr.assignees.map((user) => user.login);
          const reviewers = pr.requested_reviewers.map((user) => user.login);

          return { title, author, assignees, reviewers };
        });

      return { [repo]: todaysPR };
    })
  );

  return { thePRs, students };
};

main().then(console.log).catch(console.error);
