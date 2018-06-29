# Classicify

A firefox add-on that helps keep you on reddit's old layout while you're
browsing.

## Motivation

I don't much like the new reddit layout which is now default. The old layout is still available on all reddit pages, though. Most links are automatically redirected to the old layout when you're using the old layout, but not all of them. This add-on seeks to cover some of those edge cases.

## How it works

On mousedown events on link elements the add-on checks if the destination would be to the new reddit site layout. If so, the add-on modifies the link address to go to the old layout.

All of which to say, when you click a link, it makes sure the link is to `old.reddit.com`.

So hyperlinks such as `https://www.reddit.com/r/all` or `https://reddit.com/r/all` will be changed to `https://old.reddit.com/r/all` as you click on them.
