---
layout: post
title: "Erlang Fprof output confusing? Try KCachegrind."
date: 2013-04-24 16:13
comments: false
categories: Erlang
---

Your Erlang code is perfect, but to find out why other peoples 
code runs dog slow you probably profile the code with [fprof](http://www.erlang.org/doc/man/fprof.html) like this:

{% codeblock %}
(node@host)1> fprof:apply(module, function, [arguments]).
(node@host)1> fprof:profile().
(node@host)1> fprof:analyse({dest, "outfile.fprof"}).
{% endcodeblock %}

The printout of fprof analyse is a text dump of the result, which can
grow over 1000 lines and contains a lot of noise which makes it hard
to locate the bottlenecks. Below a truncated
sample of an actual fprof trace. 

{% gist 5458222 %}

## KCachegrind

[KCachegrind](http://kcachegrind.sourceforge.net) to the rescue! With this tool you can visually inspect the fprof
analyse result with sorting, a fancy call graph view, callee map and
more. 

{% img  /images/qcachegrind.png 750 750 'Qcachegrind screenshot' 'images' %}

As KCachegrind can't read fprof analysis output directly, you need to
convert it first to the callgrind format with the [Erlgrind](https://github.com/isacssouza/erlgrind) script by [Isac Sacchi e Souza](https://twitter.com/isacssouza). 
{% codeblock lang:sh %}
$ ./erlgrind outfile.fprof callgrind.001
{% endcodeblock %}

## KCachegrind & Erlgrind Installation

For installation of KCachegrind on my Mac I use
[Homebrew](http://mxcl.github.io/homebrew/), a package manager for OSX. Notice that you
install *qcachegrind*, the [QT](http://qt-project.org) version of
KCachegrind. 

{% codeblock lang:sh %}
$ brew install qcachegrind
$ brew instal graphviz
$ sudo ln -s /usr/local/bin/dot /usr/bin/dot
{% endcodeblock %}

Installing the Erlgrind ([Github](https://github.com/isacssouza/erlgrind)) script:

{% codeblock lang:sh %}
$ curl -O "https://raw.github.com/isacssouza/erlgrind/master/src/erlgrind"
$ chmod +x erlgrind
$ mv erlgrind /usr/local/bin/
{% endcodeblock %}

And open qcachegrind:

{% codeblock lang:sh %}
$ open ~/Applications/qcachegrind.app
{% endcodeblock %}

Enjoy!








