---
layout: post
title: "Erlang/OTP 17.0 on OSX Mavericks with WX and a working Observer"
date: 2014-04-09 19:53
comments: true
categories: Erlang
---

*Update April 15 - 2014: Erlang/OTP 17.0 with a working WX library is now also available through [Homebrew](http://brew.sh): `brew install wxmac erlang`. HT [@dhc_](https://twitter.com/dch__)*

*This post is an update of [HOWTO: "Erlang R17-RC2 on OSX Mavericks with WX and a working Observer"](/blog/2014/02/09/erlang-r17-rc1-on-osx-with-wx-and-a-working-observer/).*

## The best Erlang yet

Today's Erlang/OTP 17.0 release is 'the best Erlang yet' and contains two significant language changes: [Maps](http://learnyousomeerlang.com/maps) and [Named arguments in funs](http://joearms.github.io/2014/02/01/big-changes-to-erlang.html). 

Erlang uses wxWidgets, a cross platform GUI library for it's GUI tools. This build dependency was hard to get working pre-17, especially for 64-bit Erlang. However, 17.0 brings double rainbows and care bears for everyone that reads this HOWTO. So Enjoy!

<img src="https://www.evernote.com/shard/s48/sh/452a5f9c-08b3-4153-9dfd-f9444f7484ce/4e0c4c8bb7d8726d3ab482e4330955c8/deep/0/nonode@nohost.png" alt="nonode@nohost" />

## Set correct Xcode path for compilation

As far as I know you need have Xcode install to compile Erlang from source. You can [download Xcode](https://itunes.apple.com/nl/app/xcode/id497799835?mt=12) via the Mac App Store

If you have multiple versions of Xcode installed (beta's for example), make sure the [Command Line Tools](http://osxdaily.com/2014/02/12/install-command-line-tools-mac-os-x/) are installed and are pointing to the correct Xcode version.

Initiating an install of the Xcode Command Line Tools:

```bash
$ xcode-select --install
```

And verify that the CL-tools point to the correct Xcode install

```bash
$ xcode-select -s /Applications/Xcode.app/Contents/Developer
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
$ kerl build 17.0 17.0
```

For a 32-bit Erlang prefix `kerl build` with `CPPFLAGS`:

```bash
$ CPPFLAGS="-arch i386" kerl build 17.0 17.0
```

Install:

```bash
$ kerl install 17.0 ~/erlang_17_0
```

Activate:

```bash
$ . ~/erlang_17_0/activate
```

And bliss out on your new wx-enabled Erlang:

```bash
$ erl -s observer start
```
