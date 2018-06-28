# Classicify

A small firefox add-on that modifies links to reddit.com from reddit's
classic site so they also point to the classic site.

## Motivation

Links to reddit within reddit comments redirect to their new site layout.
This add-on changes link to reddit that would use the new layout to the old.

## How it works

On mousedown events on link elements the add-on checks if the destination would
be to the new reddit site layout. If so, the add-on modifies the link address
to the classic layout.
