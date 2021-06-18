import * as dotenv from "dotenv";
import * as moment from "moment";
import DAFetch from "@coronasafe/dafetch";
import * as writeJsonFile from "write-json-file";

dotenv.config();
const repos = ["care_fe", "life", "dashboard", "care", "citizen", "arike"];

const main = async () => {
  const dafetch = new DAFetch(
    process.env.DISCUSSION_TOKEN,
    "coronasafe",
    "cef"
  );
  const members = await dafetch.getTeamMembers();
  let pulls = await Promise.all(
    repos.map(async (repo) => await dafetch.getPullsForRepoToday(repo))
  );
  let reviews = await Promise.all(
    repos.map(async (repo) => await dafetch.getReviewsForRepoToday(repo))
  );

  // Return only the PRs made by team members
  pulls = pulls.map((repos) =>
    repos.filter((pull) => members.includes(pull.author))
  );
  // Return only the reviews made by team members
  reviews = reviews.map((repos) =>
    repos.filter((review) =>
      review.reviewedBy.some((reviewer) => members.includes(reviewer))
    )
  );

  const date = moment().format("DD-MM-YYYY");
  const membersJson = "data/" + date + "/members.json";
  const reviewsJson = "data/" + date + "/reviews.json";
  const pullsJson = "data/" + date + "/pulls.json";

  await Promise.all([
    writeJsonFile(membersJson, members),
    writeJsonFile(reviewsJson, reviews),
    writeJsonFile(pullsJson, pulls),
  ]);

  return { members, pulls, reviews };
};

main().then(console.log).catch(console.error);
