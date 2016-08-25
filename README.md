# Musicbot for Slack!

Fetches top song or best song from "frontpage" from a specified subreddit.


## Commands
```
@musicbot help             // prints commands
@musicbot subreddit        // get the current top song from that subreddit
@musicbot subreddit best   // get the song with the highest score from that subreddit
```

## Usage

*write set up directions for slack*

```
git clone `this repo`
cd `this repo`
npm i
nodemon bot.js
```

##TODO

- user subs command (https://www.npmjs.com/package/sqlite)
    - so if you message musicbot with something like `top posts`, then it’ll go and fetch the top from all the things you’re subbed to
    - subscribe to subreddits and have it post the top link of the day
    - @musicbot sub futurebeats
    - @musicbot today

### Tools

Built using [Slackbots](https://www.npmjs.com/package/slackbots)