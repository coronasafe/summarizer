import * as dotenv from "dotenv";
import * as moment from "moment";
import DAFetch from "@coronasafe/dafetch";

dotenv.config();
const repos = ["care_fe", "life", "dashboard", "care", "citizen", "arike"];

const main = async () => {
  const dafetch = new DAFetch(
    process.env.DISCUSSION_TOKEN,
    "coronasafe",
    "cef"
  );
  const members = await dafetch.getTeamMembers();
  const pulls = await Promise.all(
    repos.map(
      async (repo) =>
        await dafetch.getPullsForRepoBetween(
          repo,
          moment().subtract(1),
          moment()
        )
    )
  );
  const reviews = await Promise.all(
    repos.map(
      async (repo) =>
        await dafetch.getReviewsForRepo(repo, moment().subtract(1), moment())
    )
  );

  return { members, pulls, reviews };
};

main().then(console.log).catch(console.error);
