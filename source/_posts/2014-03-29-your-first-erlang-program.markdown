---
layout: post
title: "Your first Erlang program (in style)."
date: 2014-03-29 20:21:15 +0100
comments: true
categories: Erlang
---

Always wanted to learn [Erlang](http://www.erlang.org)? Let's create your first Erlang "Hello World" program in style!

In this HOWTO I'll show you how to setup a bleeding edge Erlang development VPS and how to run you first Erlang program.

# Main ingredient: Cores

Erlang's main strength is it's concurrency support. It likes cores, so for our 'Hello World' program we obviously need cores. Lot's! Not 4, not 8, 20!

Create an account on [Digital Ocean](https://www.digitalocean.com/?refcode=0d0404fa1c5c) if you don't have one yet (love them) and we're going to boot up their biggest instance. It's a steal at less than 1 dollar per hour. Just make sure you destroy it when done.

64GB and 20 cores will make our Hello World so snappy!

<img src="https://www.evernote.com/shard/s48/sh/b5a389c7-cd10-4e3f-a099-7f87968e2ec3/211a356f730703fcad9d4c6eb16ba1c7/deep/0/Fullscreen-29-03-14-21-36.png" alt="Fullscreen%2029/03/14%2021:36" />

- Pick a datacenter location near you.
- Select the latest version of Ubuntu: 13.10 x64.
- Create the Droplet.
- And ssh to your Droplet with the credentials received from Digital Ocean: `ssh root@your_ip_address`.

# Bleeding Edge Erlang

We're going to compile Erlang from it's github repository master branch, At the time of writing it's a few commits after R17 release candidate 2 which comes with a Hipe LLVM backend, maps and named funs. If that doesn't make any sense, no worries, just remember it's the fastest Erlang yet. And fast is good.

Install the required Ubuntu packages:

```bash
$ apt-get install tmux build-essential emacs24 git-core libncurses5-dev libssl-dev autconf htop
```

Fire up [Tmux](http://tmux.sourceforge.net):

```bash
$ tmux
```

Install [Kerl](https://github.com/spawngrid/kerl), a tool which makes building and switching Erlang versions easy.

```bash
$ curl -O https://raw.github.com/spawngrid/kerl/master/kerl
$ chmod a+x kerl
```

Let's add some good configuration options for our Erlang installation

```bash
$ emacs .kerlrc
```
And add

```text
KERL_CONFIGURE_OPTIONS="--disable-debug --without-javac --enable-shared-zlib --enable-dynamic-ssl-lib --enable-hipe --enable-smp-support --enable-threads --enable-kernel-poll"
```

And because we can, we forge our Erlang installation on 20 cores. **Muahahaha.**

To see those cores sweat for you on compilation, create another tmux window `CTRL-b c` and run `htop`.

<img src="https://www.evernote.com/shard/s48/sh/49c6830d-6d0f-45e6-958a-6d262050b709/0b252a604ad067fa75f37345d8f59a84/deep/0/Fullscreen-29-03-14-21-52.png" alt="Fullscreen%2029/03/14%2021:52" />

Besides the eye candy, compilation finishes under 5 minutes on a 20 core Digital Ocean Droplet. Whoop!

To start compilation of Erlang:

```bash
$ export MAKEFLAGS=-j20 && ./kerl build git git://github.com/erlang/otp.git master erlang_llvm
```
After compilation we need to install the build and activate it:

```bash
$ kerl install erlang_llvm erlang_llvm
$ . ~/erlang_llvm/activate
```

Great! We are now ready for our Pièce de résistance.

# Just say: Hello!

Real Erlang hacker use Emacs, so let's setup Emacs for Erlang development.

Fetch a good base config for Emacs:

```bash
$ curl -o https://gist.githubusercontent.com/wardbekker/22a1bd79eb93af85fde0/raw/41eb32cbe1bc231c21fba8ec090e537805de2c58/.emacs
```

Start up Emacs `emacs`. It will complain that it can't find [projmake-mode](https://github.com/ericbmerritt/projmake-mode). Let's fix that:

```
[ESC]-x package-install [Enter] projmake-mode
```

Exit emacs:

```
[CTRL]-x [CTRL]-c
```

Start up Emacs again `emacs`. Great! We can finally start writing our "Hello World" program. Oh, not, wait. First, we create a `projmake` file. The file is needed by [Projmake-mode](https://github.com/ericbmerritt/projmake-mode), a Flymake inspired mode that compiles your program on every save and shows build errors and warnings inline. Really useful!

```
[CRTL]-x f projmake [Enter]
```

Add these line and save the file

```cl
(projmake
 :name  "Hello"
 :shell "erlc +native hello.erl")
```

Ok, now we can really start writing our "Hello World" program and put those 20 cores and 64GB RAM to good use.

```
[CTRL]-x f hello.erl [Enter]
```

And type or paste:

```erlang
-module(hello).
-export([just_say/0]).

just_say() ->
    io_format("hello~n", []).
```

And save with `[CTRL]-x [CTRL]-s`.

Whoops. We made an error as projmake-mode shows:

<img src="https://www.evernote.com/shard/s48/sh/ef7fb886-9179-40ea-966e-cdffb8d5d303/b1b324c0e4021c9dac5b320f79f168ab/deep/0/Fullscreen-29-03-14-21-24.png" alt="Fullscreen%2029/03/14%2021:24" />

Replace `io_format` with `io:format` and save again. That fixes our error!.

Let's run our program. Fire up the Erlang shell with:

```
[ESC]-x erlang-shell
```

Load the `hello` module with:

```
1> m(hello). [Enter]
```

And run you first Erlang function....

```
2> hello:just_say(). [Enter]
```

Bliss! 

<img src="http://i.imgur.com/1Sk0c.gif" />

Congratulations. You now have a powerful Erlang development environment in your hands. 

Check out [A beginners guide to Erlang](/blog/2013/05/29/a-beginners-guide-to-erlang/) to continue your Erlang binge.
