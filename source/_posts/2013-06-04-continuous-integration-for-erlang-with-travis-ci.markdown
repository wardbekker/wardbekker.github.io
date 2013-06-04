---
layout: post
title: "Continuous Integration for Erlang with Travis-CI"
date: 2013-06-04 06:01
comments: true
categories: Erlang
---

[Erlang/OTP](http://www.erlang.org) is designed for building large,
scalable, soft-realtime systems with high availability. Testing such systems is non-trivial, useful [automated testing](http://en.wikipedia.org/wiki/Software_testing#Automated_testing) even more so. That's why Erlang comes with some advanced testing libraries.

The three most important methods are explained here by a few simple examples:

* [Unit testing](#unit-testing-with-eunit)
* [Quickcheck](#quickcheck)
* [Common test](#common-test)

First *clone*  the project from Github using the command: 

```sh
$ git clone git@github.com:wardbekker/ci_quickstart.git
```

For compiling and executing the project we use [Rebar](https://github.com/basho/rebar), a *sophisticated build-tool for Erlang projects that follows OTP principles*.  Steps to build rebar:

```sh
$ git clone git://github.com/basho/rebar.git
$ cd rebar
$ ./bootstrap
Recompile: src/getopt
...
Recompile: src/rebar_utils
==> rebar (compile)
Congratulations! You now have a self-contained script called "rebar" in
your current working directory. Place this script anywhere in your path
and you can use rebar to build OTP-compliant apps.
```

## Unit testing with EUnit ##

Let's start with the most simple test method; [EUnit](http://www.erlang.org/doc/apps/eunit/chapter.html). It's Erlang unit testing library. A unit test check if a function returns the expected result for a given input. In the example below the function `addition` is defined in the module `ci_quickstart_math` and two *assertions* are used: 

- `?assertEqual(expected, actual)` 
- `?assertNotEqual(expected, actual)`.

Try it our yourself with executing EUnit from the command line: `rebar get-deps compile eunit`:

```erlang
-module(ci_quickstart_math).
-export([addition/2]).

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
-endif.

addition(X, Y) ->
    X + Y.

-ifdef(TEST).

simple_test() ->
    ?assertEqual(4, addition(2,2)),
    ?assertNotEqual(3, addition(1,1)).

-endif.
```

Did all test pass? Excellent! Now the bad news. The actual value of this type of test if quite low. Are we sure the addition function works correct for all possible input?  We are now only certain of these cases:

* `addition(2,2) == 4`
* `addition(1,1) /= 3`

And even then, when I change the body of the `addition` function in obviously something totally wrong:

```erlang
 addition(X, Y) ->
    4.
```

The tests will still pass!

So, with unit tests our assertions may be correct, but the function body of `addition` can be a steaming pile of canis faeces.

It's even worse; As in this case, the arguments of addition are [64-bit small integers](http://www.erlang.org/doc/efficiency_guide/advanced.html), which have a range of -576460752303423489 - 576460752303423488. With two arguments, that is a humongous amount of inputs we should test to be really sure our function works correctly.  In the example unit test we only check two? Even adding twenty more cases, the hard worker that you are, effectively have very little value.

Depressed already?  On to the good stuff.

## QuickCheck ##

Continuing with the addition example; what we actually want is a test method that generated all possible inputs, and checks the result. Erlang has this, and the method is called [QuickCheck](http://en.wikipedia.org/wiki/QuickCheck). Erlang even has multiple QuickCheck-style libraries available:

*  [Quvic QuickCheck](http://www.quviq.com)
*  [ProPEr](https://github.com/manopapad/proper)
*  [Triq](https://github.com/krestenkrab/triq)

A QuickCheck test, also called a *property*  for `addition` function looks like this:

```erlang
prop_sum() ->
    ?FORALL(
        {X, Y}, 
        {int(), int()},
        addition(X,Y) - Y == X
    ).
```

Test this example from the command line by executing `./shell.sh`. You will enter the Erlang shell. Then execute `proper:quickcheck(ci_quickstart_math:prop_sum()).`.

If we look at the implementation of the QuickCheck test, notice that we are not testing specific numbers. We are testing a *property*  of the addition function, namely when we add int *X* and *Y*, and subtract *Y*  from the result of the addition, we should be left with *X* again.

The code `{int(), int()}` specifies that the QuickCheck should generate *tuples* with two random integers. Each generated *tuple*  is bound to the pattern `{X, Y}` by [Erlang pattern matching](http://erlang.org/doc/reference_manual/patterns.html).  Quickcheck will generate 100 combinations by default.  With the `numtests` option we can increase this considerably: `proper:quickcheck(ci_quickstart_math:prop_sum(),[{numtests,10000}]).`. 

The challenge when using Quickcheck style testing, is to come up with good function properties. This is much harder than writing unit tests. It's even more difficult to reason about function properties than actually writing the actual function. So why bother? 

Reasons to use QuickCheck:

- Test correct functioning for all inputs. 
- Compared to unit tests, QuickCheck test tend to find more bugs than unit tests.
- You need to reason about your code on a deeper level which improves your understanding of the problem you are solving, which tends to result in better code.

## Common Test ##

As you might know, Erlang is a very good fit for building concurrent, distributed and fault tolerant systems. Testing if what you build is actually has those properties, is quite complex.

For that, Erlang offers [Common Test](http://www.erlang.org/doc/apps/common_test/basics_chapter.html). This test frameworks can do the heavy lifting required for meaningful [system tests](http://en.wikipedia.org/wiki/System_testing).  The inherent complexity of concurrent, distributed en fault tolerant systems is reflected in Common Test. So, in this introduction we only take a very quick glance. In this example we mimic the initial unit test using pattern matching for assertions.

```erlang
-module(basic_SUITE).
-include_lib("common_test/include/ct.hrl").

-export([all/0]).
-export([test1/1, test2/1]).

all() -> [test1,test2].

test1(_Config) ->
    3 = ci_quickstart_math:addition(1,2). %% validated using pattern matching

test2(_Config) ->
    2 = ci_quickstart_math:addition(1,1).  %% validated using pattern matching
```

## Continuous integration with Travis-CI

During development, you run your Erlang automated tests on your own workstation. But there comes a point where that's no longer feasible because of the long duration or high load. Or you work in a team setting where it's important that only working code is integrated. In those cases and  [for several other good reasons](http://en.wikipedia.org/wiki/Continuous_integration#Advantages_and_disadvantages), you need to use a [Continuous integration](http://en.wikipedia.org/wiki/Continuous_integration) system.

There are several continuous integration systems that allow you to run automated tests for Erlang. In this example we use [Travis-CI](http://travis-ci.org). It's a free hosted continuous integration service for the open source community. Travis-CI integrates with the popular [Github](http://www.github.com). 

Let's add our example project to Travis-CI.

### Preparation

The build process of Travis-CI is configured with a `.travis.yml` file in the *root*  of our repository:

```yaml
language: erlang // This project is an Erlang project
notifications: 
  email: you@example.org // Notify this e-mail address on build failures
otp_release: // The Erlang/OTP versions to run your test against.
  - R15B01
  - R15B
  - R14B04
```

### Travis-CI Setup

This video shows how to register with Travis-CI:

* Log in with your Github account.
* Open the Travis-CI *profile* page.
* Enable the *repository*  that you want to test.

That's it!

{% youtube YxJJu6mShiA %}

### Travis-CI Success Run

This video shows how Travis-CI will report an successful *integration build*

{% youtube rJWRY1Uf_qg %}

### Travis-CI Failure Run

This video shows how Travis-CI will report an failed *integration
build*

{% youtube 5u8Kpz3m8ho %}

If you entered your e-mail address in `.travis.yml`, you will receive a mail about which *commit*  broke the build:

<img src="https://raw.github.com/wardbekker/ci_quickstart/master/images/broken_email.png" width="400" height="200" alt="Broken build e-mail notification" />

When your colleague fixed the build (you would never commit broken code, right?), you will receive a mail that the build is fixed by a new *commit*.

<img src="https://raw.github.com/wardbekker/ci_quickstart/master/images/fixed_email.png " width="400" height="200" alt="Fixed build e-mail notification" />

