---
layout: post
title: "Selenium Webdriver for Erlang quick start"
date: 2014-03-07 08:18
comments: true
categories: Erlang 
---

[Selenium](http://docs.seleniumhq.org) is the industry standard for automated testing of web applications. Together with [Webdriver](http://docs.seleniumhq.org/projects/webdriver/), a 'remote control' API for all major browsers, it enables you to create robust integration test for the browser.

The great people of [QuviQ](http://www.youtube.com/watch?v=_RvIeEAn5P4), creators of the unique [Quickcheck](/blog/2013/06/04/continuous-integration-for-erlang-with-travis-ci/) test framework, created an Erlang Webdriver client implementation ([Github repository](https://github.com/Quviq/webdrv)).

It's trivial to get started with the following steps:

## Step 1: Add webdrv to the rebar.config of your project

Open `rebar.config` in your favorite editor, and make sure webdrv is listed as dependency. I use a fork of the original repository that support rebar:

    {deps, [
       {webdrv, "", {git, "https://github.com/ehedenst/webdrv.git", {branch, "master"}}},
       ]}.

## Step 2: Get and compile webdrv

Go to the root of your Erlang project and execute:

    $ rebar get-deps compile

## Step 3: Get & start the Google chromedriver

For this quick start we will be using the [Google Chromedriver](https://sites.google.com/a/chromium.org/chromedriver/). Get the right package for your environment [here](http://chromedriver.storage.googleapis.com/index.html?path=2.9/). I'm now on a Mac, so:

    $ curl -O http://chromedriver.storage.googleapis.com/2.9/chromedriver_mac32.zip
    $ unzip chromedriver_mac32.zip
    $ ./chromedriver

The last line starts up the Chromedriver server and if all went well, you should get the following output:

    Starting ChromeDriver (v2.9.248307) on port 9515

Important! This server needs to be running during test execution.

## Step 4:  Your first Erlang webdrvr test!

Save the following module in `src/random_org_test.erl`. In this test we open a page, fill in a form, submit the form, and check if an expected piece of text is indeed present in the response:

```erlang
-module(random_org_test).
    
-compile(export_all).

-include_lib("webdrv/include/webdrv.hrl").

-define(CHROMEDRIVER, "http://localhost:9515/").

test() ->
    {ok, _Pid} = webdrv_session:start_session(test, ?CHROMEDRIVER,  webdrv_cap:default_chrome(), 10000),
    webdrv_session:set_url(test, "http://www.random.org/integers/"),
    {ok, Emin} = webdrv_session:find_element(test, "name", "min"),
    webdrv_session:clear_element(test, Emin),
    webdrv_session:send_value(test, Emin, "5"),
    {ok, Emax} = webdrv_session:find_element(test, "name", "max"),
    webdrv_session:clear_element(test, Emax),
    webdrv_session:send_value(test, Emax, "15"),
    webdrv_session:submit(test, Emax),  
    {ok, PageSource} = webdrv_session:get_page_source(test),
    string:str(PageSource, "Here are your random numbers") > 0,
    webdrv_session:stop_session(test).
```

## Step 5: Run the test

Run your test by opening up the Erlang shell..

    $ erl -pa ebin deps/*/ebin
    
..and execute the test function

    1> random_org_test:test().
    
You should see the Chrome browser opening in the background, quickly flashing some pages, closing, and on the Erlang shell the anticlamatic output `ok`.
    
## Further information

- [Watch the Erlang Factory presentation by Hans Svensson from Quviq](http://www.youtube.com/watch?v=_RvIeEAn5P4)
- [Erlang Webdrvr Github repository](https://github.com/Quviq/webdrv)
- [Selenium Webdriver documentation](http://docs.seleniumhq.org/docs/03_webdriver.jsp)
