---
layout: post
title: "Appfelstrudel = Erlang + ElasticSearch + AppStore"
date: 2015-02-17 10:27:10 +0100
comments: true
categories: erlang elasticsearch appstore apps
published: false
---

# How Appfelstrudel was build


## Why Appfelstrudel was build

- Experiment with blog posts
- Some affilliate income, perhaps more with appfelstudel
- Love to work on side projects


## ElasticSearch adventures

- Schema less -> actually implicit schema.
- Json config structure difficulties
- Getting data in ES efficiently (data intake process)
- Good Aggregates / faceting interface where most work end up
- Features the site uses: highlighting, paging, etc.
- Open issues
-- Relevance improvements 
-- Too slow when showing full index with calcs
- Unacceptable out-of-box performance on non-SSD

## iTunes affiliate data feed adventures

- Multiple ways of getting app store data
- Full or flat dataset not useful, because doesn't contain rating info
- Mention Fnd.io 'solution' and show what Appfelstudel can do that Fnd.io never will. 
- Current state of the app store: lot's of abandoned apps. 

## Erlang

- Nginx front
- Erlydtl for templating, for html but also for JSON
- Webmachine
- Zurb Foundation for responsive interface.
- Lazy loading of images

## Hosting

- Digital Ocean 2CPU / 2GB box in NY
- 

## SEO strategy

- Indeed style: Don't index individual jobs, only categories. Have browse section available for Google. 
- First phase: Popular topic pages
- Second phase: More topic pages, related popular apps pages
- Third phase: Index al the apps.

## Future plans

- Simple caching
- 

