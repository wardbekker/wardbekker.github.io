---
layout: post
title: "Erlang R17-rc1 on OSX Mavericks with WX and a working Observer"
date: 2014-02-09 08:53
comments: true
categories: Erlang
---

**Update 15 April 2014** Erlang/OTP 17.0 is released. [Read the updated HOWTO here](/blog/2014/04/09/erlang-r17-on-osx-with-wx-and-a-working-observer/).

**Update 11 Feb 2014** [Dan GudMundsson](https://twitter.com/SpiffDgud) pointed out that starting with R17 both 32 and 64 bit Erlang will work with wxWidgets. I've updated part of this blog post with the instructions found in the official [Erlang/OTP installation HOWTO](https://github.com/erlang/otp/blob/maint/HOWTO/INSTALL.md).

This post is based on [HOWTO: Getting wx to work with Erlang r16b02 on OS X](http://featurebranch.com/howto-getting-wx-to-work-with-erlang-r16b02-on-os-x/) by [Martin Schuerrer](https://twitter.com/MSch)

Erlang R17-rc1 is 'the best Erlang yet' and contains two significant language changes: [Maps and named arguments in funs](http://joearms.github.io/2014/02/01/big-changes-to-erlang.html). 

Erlang uses wxWidgets, a cross platform GUI library for it's GUI tools. This build dependency was hard to get working pre-R17, especially for 64-bit Erlang. However, R17 brings double rainbows and care bears for everyone that reads this HOWTO. So Enjoy!

<img src="https://www.evernote.com/shard/s48/sh/452a5f9c-08b3-4153-9dfd-f9444f7484ce/4e0c4c8bb7d8726d3ab482e4330955c8/deep/0/nonode@nohost.png" alt="nonode@nohost" />

## Set correct Xcode path for compilation

```bash
$ xcode-select -s /Applications/Xcode.app/Contents/Developer
```

or if you installed a beta version (in my case `51-Beta5`):

```bash
$ xcode-select -s /Applications/Xcode51-Beta5.app/Contents/Developer
```

## Install wxWidgets

[wxWidgets](http://www.wxwidgets.org) is a Cross Platform GUI library that's used by Erlang for applications like Observer. 

Execute this line and get some coffee, walk the dog, take out the trash and/or play with your kids. Compilation takes a while.

```bash
$ curl -O http://optimate.dl.sourceforge.net/project/wxwindows/3.0.0/wxWidgets-3.0.0.tar.bz2
$ tar xvjf wxWidgets-3.0.0.tar.bz2
$ cd wxWidgets-3.0.0.tar.bz2
$ ./configure --with-cocoa --prefix=/usr/local
$ make && sudo make install
$ export PATH=/usr/local/bin:$PATH
```

Check that you got the correct wx-config

```bash
$ which wx-config
```

## Install kerl

[Kerl](https://github.com/spawngrid/kerl) is a utility that helps you build and manage multiple instances of Erlang/OTP.

```bash
$ curl -O https://raw.github.com/spawngrid/kerl/master/kerl
$ chmod a+x kerl
```

Create `~/.kerlrc`. I use `$ vim ~/.kerlrc`. 

Add these lines:

```bash
KERL_CONFIGURE_OPTIONS="--disable-debug --without-javac --enable-shared-zlib --enable-dynamic-ssl-lib --enable-hipe --enable-smp-support --enable-threads --enable-kernel-poll --with-wx"
```

## Build & Install Erlang with kerl

```bash
$ kerl update releases
$ kerl build 17.0-rc1 17rc1
```

For a 32-bit Erlang prefix `kerl build` with `CPPFLAGS`:

```bash
$ CPPFLAGS="-arch i386" kerl build 17.0-rc1 17rc1
```

Install:

```bash
$ kerl install 17rc1 ~/17rc1
```

Activate:

```bash
$ . ~/17rc1/activate
```

And bliss out on your new wx-enabled Erlang:

```bash
$ erl -s observer start
```
