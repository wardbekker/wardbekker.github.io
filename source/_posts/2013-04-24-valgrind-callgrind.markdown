---
layout: post
title: "Better visualisation of Erlang fprof traces with kcachegrind"
date: 2013-04-24 16:13
comments: false
categories: Erlang
---

Problem: 

You're erlang application is slow. To find the bottleneck, you profile
the code with fprof. 

{% codeblock%}
Put fprof apply, profile, analyze here
{% endcodeblock %}

The printout of fprof analyse is a text dump of the result, which I
find quite hard to read and detect the hotspots because of all the noise. Below a sample.

{% codeblock%}
fprof analuze output here
{% endcodeblock %}

KCachegrind to the rescue! With this tool you can visually inspect the fprof
analyse result with sorting, call graph view, callee map and more.

{% img  /images/qcachegrind.png 350 350 'image' 'images' %}

As KCachegrind can't read fprof analysis output directly, you need to
convert it first with the Erlgrind script. Not all Kcachegrind
features are yet supported, like source code and coverage views.
[https://github.com/isacssouza/erlgrind](download here). 

{% codeblock%}
./erlgrind_script outfile.fprof callgrind.001
{% endcodeblock %}

Installation of KCachegrind on a mac (using homebrew) :
{% codeblock%}
$ brew install qcachegrind
$ brew instal graphviz
$ sudo ln -s /usr/local/bin/dot /usr/bin/dot
{% endcodeblock %}





