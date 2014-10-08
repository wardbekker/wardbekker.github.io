---
layout: post
title: "Notes on CloudKit Storage and Data Transfers"
date: 2014-06-13 10:32:45 +0200
comments: true
categories: 
---

At WWDC14 Apple announced Cloudkit, a new [Backend as a Service](http://en.wikipedia.org/wiki/Backend_as_a_service)(Baas). Storage of structured data and assets are offered for free, with limits. In this post I'm attempting to give you more detail and background on this free plan.

<!-- more -->

# Cloudkit free storage and data transfer plan

For every Cloudkit container, you start out with:

Storage
- 5 GB for assets
- 50 MB for database

Data Transfer
- 25 MB/day for assets
- 250 KB/day for database

And for every user you get a bonus of:

Storage
- 100 MB for assets
- 1 MB for database

Data Transfer
- 0.5 MB/day for assets
- 5 KB/day for database

# Sample calculations

To get a better feel of the numbers, I've created a few sample calculations.

**With 1K Cloudkit users you get**

Storage
- 105 GB for assets
- 1 GB for database

Data Transfer
- 505 MB/day for assets
- 5.25 MB/day for database

**With 10K Cloudkit users you get**

Storage
- 1 TB for assets
- 10 GB for database

Data Transfer
- 5 GB/day for assets
- 50 MB/day for database

**With 100K Cloudkit users you get**

Storage
- 10 TB for assets
- 0.1 TB for database

Data Transfer
- 50 GB/day for assets
- 500 MB/day for database


**With 10 Million(!) Cloudkit users you get**

Storage
- 1 PB for assets
- 10 TB for database

Data Transfer
- 5 TB/day for assets
- 50 GB/day for database

And this is also the upper limit for the free plan. So, if you have 10 million folks usings your CloudKit backed app. Apple takes up the hosting bill, and you have a lot more money to waste on Sushi. 

# Details, details

But what is actually is a CloudKit user? There is no official information yet, but my guess Apple counts all users that installed your app and authenticated at least once. That would mean that your CloudKit user count can only increase and never drop. Makes sense, as you don't want data to be removed in the public database, just becaused the user de-installed the app. (Sidenode, if you uninstall an app from your phone, It give the standard warning that all app data will be removed, but as far as I can see, uninstalling an app doesn't affect the public or private data in the CloudKit container of the app.

Public asset and databage storage is pooled, and so is are the data transfers. Private asset and database storage is not counted as this data resides on the iCloud account of the user. Hurray! Though it's not clear yet clear if that also implies that all private data transfer does not count. I sure hope so.

And regarding the data tranfer plan. Do they mean data in, data out or both? Again, no official information yet. Optimistic case Data out only, but Data IN & OUT is very likely.

Other things that are not clear yet:

- 
- What happens when you reach limits? Will your app be broken for your users when the daily tranfer limits are overrun? No official information yet, but my guess is that Apple will allow an incidental overrun of limits, and they will give you a call when there is a structural overrun of limits. They want happy App users as much as you, so these limits are probably soft limits, with higher hard limits to prevent abuse.
- It's not yet possible to get insight in real world data usage, even on development, as Apple did not yet enable usage stats on the CloudKit dashboard. Let's see if they can get that out for the fall release.
- In the iCloud documentation, Apple says you can call them for custom (premium?) plans. I've just send them a request for more information. Until I get a response, it's unclear what the non-free/custom options are.
