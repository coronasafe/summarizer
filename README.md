# Summarizer

Daily summarizer of work done by CEF students across coronasafe organization. A summary is created as a discussion at the end of every day over at [disucssion board](https://github.com/orgs/coronasafe/teams/cef)

## Development

> Use Yarn only, pls xD

1. Clone the repository

```bash
git clone git@github.com:coronasafe/summarizer.git
yarn install
```

2. Copy example env file and enter your github Personal Access Token. Checkout section below to get your PAT.

```bash
cp .env.example .env
```

3. Run typescript compiler in watch mode

```bash
yarn ts:watch
```

## Get your PAT

1. Go into [tokens page](https://github.com/settings/tokens) for your github account
2. Click on Generate Token
3. Create a new token with these permissions `public_repo, read:org, read:user, write:discussion`
4. Copy the created PAT token into `DISCUSSION_TOKEN` at your `.env` file

## Run as a container

1. Build the image

```bash
docker build -t summarizer:latest .
```

2. Create a container

```bash
docker container run -e DISCUSSION_TOKEN=your-pat-token -it summarizer:latest
```
