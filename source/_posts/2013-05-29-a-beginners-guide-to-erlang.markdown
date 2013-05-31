---
layout: post
title: "A beginners guide to Erlang"
date: 2013-05-29 22:14
comments: true
categories:  erlang
---

These starting points that helped me getting up to speed with Erlang. I hope this information helps you too.

### How install Erlang/OTP

You can install Erlang/OTP from [source](http://www.erlang.org/download.html), but I like the [ready-to-go packages](https://www.erlang-solutions.com/downloads/download-erlang-otp) provided by Erlang Solutions. 

### Writing Erlang

I use [Aquamacs](http://aquamacs.org/), An Emacs for mac users, with the [Erlang mode](http://www.erlang.org/doc/apps/tools/erlang_mode_chapter.html) provided by Erlang/OTP.  Combined with Eric B Merritt's [projmake-mode](https://github.com/ericbmerritt/projmake-mode) and Mochiweb [reloader](https://github.com/oinksoft/reloader) this makes for a productive development environment.

### Documentation

The [official Erlang documentation](http://www.erlang.org/doc/) is pretty good, but the writing style / structure takes a while to get used to. But the info is certainly there.

I keep a local copy of [Erldocs](http://erldocs.com/) on my development machine for quick access. Unfortunatly it doesn't have an R16 copy and function signatures are not shown fully correct, but it works for me.

### Best places to ask for help

The [Erlang Questions Mailinglist](http://erlang.org/mailman/listinfo/erlang-questions) is the best place to ask your Erlang questions. Don't be suprised if you question is answered by Erlang inventors themselves!

As with other programming languages [Stack overflow](http://stackoverflow.com/questions/tagged/erlang) is also a great place to get answers to your pressing Erlang questions.


### Erlang books

Compared to Java, the quantity of Erlang books is low. But the quality is pretty good! And little birdy told me that some great new books will be published in the near future.

<table>
            <tr>
                <td>
                    <a href="http://www.amazon.com/gp/product/0596518188/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=0596518188&linkCode=as2&tag=dotnettaxi-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=0596518188&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=dotnettaxi-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=0596518188" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                    <br />
                    <a href="http://www.amazon.com/gp/product/0596518188/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0596518188&linkCode=as2&tag=dotnettaxi-20">Erlang Programming by Francesco Cesarini</a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=0596518188" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                </td>
                <td>
                    <a href="http://www.amazon.com/gp/product/1593274351/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=1593274351&linkCode=as2&tag=dotnettaxi-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=1593274351&Format=_SL110_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=dotnettaxi-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=1593274351" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                    <br />
                    <a href="http://www.amazon.com/gp/product/1593274351/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=1593274351&linkCode=as2&tag=dotnettaxi-20">Learn You Some Erlang for Great Good!: A Beginner's Guide by Fred Hebert</a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=1593274351" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                </td>
            </tr>
            <tr>
                <td>
                    <a href="http://www.amazon.com/gp/product/1449309968/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=1449309968&linkCode=as2&tag=dotnettaxi-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=1449309968&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=dotnettaxi-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=1449309968" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                    <br />
                    <a href="http://www.amazon.com/gp/product/1449309968/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=1449309968&linkCode=as2&tag=dotnettaxi-20">Building Web Applications with Erlang: Working with REST and Web Sockets on Yaws</a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=1449309968" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                </td>
                <td>
                    <a href="http://www.amazon.com/gp/product/193435600X/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=193435600X&linkCode=as2&tag=dotnettaxi-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=193435600X&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=dotnettaxi-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=193435600X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                    <br />
                    <a href="http://www.amazon.com/gp/product/193435600X/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=193435600X&linkCode=as2&tag=dotnettaxi-20">Programming Erlang: Software for a Concurrent World</a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=193435600X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                </td>
            </tr>
            <tr>
                <td>
                    <a href="http://www.amazon.com/gp/product/1933988789/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=1933988789&linkCode=as2&tag=dotnettaxi-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=1933988789&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=dotnettaxi-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=1933988789" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                    <br />
                    <a href="http://www.amazon.com/gp/product/1933988789/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=1933988789&linkCode=as2&tag=dotnettaxi-20">Erlang and OTP in Action</a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=1933988789" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                </td>
                <td>
                    <a href="http://www.amazon.com/gp/product/0321636465/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=0321636465&linkCode=as2&tag=dotnettaxi-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=0321636465&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=dotnettaxi-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=0321636465" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                    <br />
                    <a href="http://www.amazon.com/gp/product/0321636465/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0321636465&linkCode=as2&tag=dotnettaxi-20">Building Scalable Applications with Erlang (Developer's Library)</a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=0321636465" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                </td>
            </tr>
            <tr>
                <td>
                    <a href="http://www.amazon.com/gp/product/1449331769/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=1449331769&linkCode=as2&tag=dotnettaxi-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=1449331769&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=dotnettaxi-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=1449331769" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                    <br />
                    <a href="http://www.amazon.com/gp/product/1449331769/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=1449331769&linkCode=as2&tag=dotnettaxi-20">Introducing Erlang</a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=1449331769" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                </td>
                <td>
                    <a href="http://www.amazon.com/gp/product/3941841459/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=3941841459&linkCode=as2&tag=dotnettaxi-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=3941841459&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=dotnettaxi-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=3941841459" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                    <br />
                    <a href="http://www.amazon.com/gp/product/3941841459/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=3941841459&linkCode=as2&tag=dotnettaxi-20">Erlang/OTP</a><img src="http://www.assoc-amazon.com/e/ir?t=dotnettaxi-20&l=as2&o=1&a=3941841459" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
                </td>
            </tr>
</table>
<br /><br />

### Testing and Continuous integration

I recently gave a talk introducing the great automated testing facilities of Erlang. Check out the [video and slides](/blog/2013/04/25/erlang-testing/)

With help from former collegue & friend [Josh Kalderimis](https://twitter.com/j2h) I've added the first iteration of Erlang support to [Travis-CI](https://travis-ci.org/). It's a free continuous integration service for open source projects. It's used by well known Erlang projects like [Basho Riak](http://basho.com/riak/), [Elixir](http://elixir-lang.org/) and [Mochiweb](https://github.com/mochi/mochiweb).
[See the documentation how to add your project](http://about.travis-ci.org/docs/user/languages/erlang/). 

If you can read Dutch, you can also read my blog post about [Geautomatiseerd testen met Erlang/OTP en Travis-CI](blog/2013/04/25/geautomatiseerd-testen-met-erlang/) which covers the same ground.

### Who to follow on twitter

Two of the three Erlang inventors are active tweeps:

- [Joe Armstrong](https://twitter.com/joeerl)
- [Robert Virding](https://twitter.com/rvirding)

Want more?  [Bryan Hunter](https://twitter.com/bryan_hunter) maintains [a list of Erlang folks on twitter](https://twitter.com/bryan_hunter/erlang/members) . 

[I'm also on twitter](https://twitter.com/wardbekker)

### Popular Erlang projects

Want to learn Erlang from the absolute best? Most popular Erlang projects are open source. Make some coffee, clone the repositories and learn from the code of the Erlang gods. Below a selection:

- [Erlang OTP](https://github.com/erlang/otp) - The full Erlang/OTP sourcecode.
- [Basho Riak](https://github.com/basho/riak) - A decentralized datastore.
- [Cowboy](https://github.com/extend/cowboy) - Small, fast, modular HTTP server written in Erlang.
- [Rebar](https://github.com/rebar/rebar) - A sophisticated build-tool for Erlang projects that follows OTP principles.
- [Mochiweb](https://github.com/mochi/mochiweb) - MochiWeb is an Erlang library for building lightweight HTTP servers.
- [Webmachine](https://github.com/basho/webmachine) - A REST-based system for building web applications.

Explore more popular Erlang projects on [Github's Erlang page](https://github.com/languages/Erlang)

### Conferences & User groups

The [Erlang Factory](http://www.erlang-factory.com/) conferences are the best places to meet professional Erlang developers. I've attended a few of them, and I am always amazed by the quality of the speakers and the *hallway* discussions. Pro tip: make sure you have a substantial lunch and then stay for the drinks.

A few local active user groups that I'm aware of:

- [Chicago Erlang User Group](http://www.meetup.com/ErlangChicago/)
- [Cross Functional Amsterdam](http://www.meetup.com/funadam/) - I help organize this one. We have frequent Erlang focused talks.
- [London Erlang User Group](http://www.meetup.com/erlangusergroup/) - 

Explore more Erlang user groups on [Meetup](http://www.meetup.com/find/?offset=0&psize=64&currentpage=1&allMeetups=true&categories=&keywords=erlang&radius=Infinity&userFreeform=&mcId=&mcName=&lat=52.083298&lon=4.300003&sort=default)

### Training

I attended the three day Erlang/OTP express course from [Erlang Solutions](https://www.erlang-solutions.com/services/training) and got a much better understanding of OTP. Erlang Solutions also provide E-learning training.

I also heard some good things from the [Erlang Camp by Erlware](http://erlangcamp.com/). This is a intensive two day trainings for beginners and intermediate Erlang programmers.
