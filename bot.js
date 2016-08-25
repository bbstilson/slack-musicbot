// http://www.themechanism.com/voice/2012/08/28/getting-node-js-and-cron-to-play-nicely/
const SlackBot = require('slackbots');
const axios = require('axios');

const musicbot = new SlackBot({   
    token: 'xoxb-68568013527-etHZc52ldKy6H1ft0j8AGzu1',
    name: 'musicbot'
});

// CONSTANTS

const sources = /soundcloud|youtube|youtu.be|spotify|bandcamp/i;
const call = /^hey$|^hi$|^hello$|^whuddup$/i;
const response = ["Hello!", "I'm here!", "its dat boi", "Hey there."]
const BEST = 'BEST';
const emojis = [':slightly_frowning_face:', ':thinking_face:', ':upside_down_face:', ':grimacing:', ':no_mouth:', ':flushed:'];
const helpMessage = `Hey! Here's what I can do: 
\`\`\`
@musicbot subreddit        // get the current top song from that subreddit
@musicbot subreddit best   // get the song with the highest score from that subreddit
\`\`\``;

// MUSICBOT EVENTS

musicbot.on('start', setSelf);

musicbot.on('message', handleMessage);

// HELPERS

function setSelf() {
    musicbot.getUserId('musicbot').then(id => { musicbot.self = id });
    musicbot.postMessageToUser('brandon', `connected at ${new Date()}`);
}

function handleMessage(data) {
    if (data.text) {
        const { user, channel, text } = data;

        if (user !== musicbot.self && text.includes(musicbot.self)) {
            if (call.test(text)) {
                postMessage(channel, response.sample());
            } else if (text.includes('help')) {
                postMessage(channel, helpMessage);
            } else {
                const split = text.split(' ');
                const subreddit = split[1];
                let modifier = null;

                if (split.length === 3) {
                    modifier = split[2];
                }

                fetchTopPost(subreddit, modifier)
                    .then(({ title, url }) => { postMessage(channel, `${title} ${url}`) })
                    .catch(err => { postMessage(channel, err) });
            }
        }
    } else {
        console.log(`${data.type} | ${new Date()}`)
    }    
}

function fetchTopPost (subreddit, filter = null) {
    return axios.get(`http://www.reddit.com/r/${subreddit}.json`)
        .then(processData)
        .then(filterPosts) 
        .then(posts => {
            if (posts.length === 0) {
                throw `There aren't any music sources on "${subreddit}" ${emojis.sample()}`;
            }

            if (filter) {
                switch (filter.toUpperCase()) {
                    case BEST: // return highest overall
                        return posts.reduce((best, post) => {
                            return post.score > best.score ? post : best;
                        }, { score: 0 });
                    default: // unknown filter
                        throw `Sorry, I didn't recognize that filter ${emojis.sample()}`;
                }
            } else {
                return posts[0];        
            }
        })
        .then(returnPostData)
        .catch(err => {
            console.log('Error - ', err);
            throw err;
        });
}

function postMessage(channel, text) {
    musicbot.postMessage(channel, text);
}

function processData(data) {
    // SO NESTED OMG
    return data.data.data.children.map(i => i.data);
}

function filterPosts(posts) {
    if (posts.length) {
        return posts.filter(post => sources.test(post.domain)); // only get allowed sources
    } else {
        throw `I can't find that subreddit ${emojis.sample()}`;
    }
}

function returnPostData(post) {
    return { title, url, permalink, domain } = post;
}

Array.prototype.sample = function() {
    return this[Math.floor(Math.random() * this.length)];
};