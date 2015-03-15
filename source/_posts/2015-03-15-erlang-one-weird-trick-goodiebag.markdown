---
layout: post
title: "Erlang ‘One weird trick’ Goodiebag"
date: 2015-03-15 08:47:22 +0100
comments: true
categories: erlang
---

# Erlang ‘One weird trick’ Goodiebag (Draft)

I've asked the Erlang twittersphere what they think every Erlang developer should know about. The result is this Erlang random goodiebag. I would love to hear you 'One weird trick' in the comments!

[Follow me on Twitter](https://twitter.com/wardbekker)

## etop - Erlang Top

Erlang Top, `etop` is an Erlang application for presenting information about erlang processes similar to the information presented by `top` in UNIX.

You start it with the following command:

```shell
erl -sname etop  -hidden -s etop -s erlang halt -output text node@host
```

(Replace `node@host` with the correct node name).

Output shows you the CPU load, memory allocation and more:

```shell
Erlang/OTP 17 [erts-6.3] [source] [64-bit] [smp:2:2] [async-threads:10] [hipe] [kernel-poll:false]

Eshell V6.3  (abort with ^G)
(etop@appfelstrudelUSA)1>
========================================================================================
 etop@appfelstrudelUSA                                                     07:32:52
  Load:  cpu         0               Memory:  total       12642    binary        699
          procs      34                        processes    4315    code         4321
                  runq        0                        atom          198    ets           240

Pid            Name or Initial Func    Time    Reds  Memory    MsgQ Current Function
----------------------------------------------------------------------------------------
<0.3.0>        erl_prim_loader          '-'  159565  109232       0 erl_prim_loader:loop
<0.26.0>       code_server              '-'   88670  142784       0 code_server:loop/1
<0.11.0>       kernel_sup               ‘-‘   53137  197408       0 gen_server:loop/6
<0.7.0>        application_controll     ‘-‘    6790  263984       0 gen_server:loop/6
<0.0.0>        init                     ‘-‘    5223   18624       0 init:boot_loop/2
<0.33.0>       erlang:apply/2           ‘-‘    4026  197048       0 shell:get_command1/5
<0.2.0>        etop_server              ‘-‘    1622   34360       0 etop:data_handler/2
<0.20.0>       auth                     ‘-‘     831    7688       0 gen_server:loop/6
<0.21.0>       net_kernel               ‘-‘     710    7136       0 gen_server:loop/6
<0.30.0>       user_drv                 ‘-‘     409   13800       0 user_drv:server_loop
========================================================================================
```

[More information about `etop` can be found in the docs](http://www.erlang.org/doc/apps/observer/etop_ug.html)

h/t to [@mmzeeman](https://twitter.com/mmzeeman)

## Erlang Remote Shell

As you can `ssh` into another server, you can also connect to the [shell](http://www.erlang.org/doc/man/shell.html) of a remote Erlang node. This allows you to inspect the live state of the system. Very powerful.

Below an example session where stop the `mnesia` application on the live node from the remote shell

Start up the ‘live’ node and start the `mnesia` application:

```shell
$> erl -sname live@localhost
Erlang/OTP 17 [erts-6.2] [source-aaaefb3] [64-bit] [smp:4:4] [async-threads:10] [hipe] [kernel-poll:false]

Eshell V6.2  (abort with ^G)
(live@localhost)1> application:start(mnesia).
ok
(live@localhost)2>
```

In another terminal window, connect to the live shell and try to start mnesia again. Notice it is already started, and we can stop the application.

```shell
$> erl -remsh live@localhost -sname debug@localhost
Erlang/OTP 17 [erts-6.2] [source-aaaefb3] [64-bit] [smp:4:4] [async-threads:10] [hipe] [kernel-poll:false]

Eshell V6.2  (abort with ^G)
(live@localhost)1> application:start(mnesia).
{error,{already_started,mnesia}}
(live@localhost)2> application:stop(mnesia).
ok
(live@localhost)2>
```

Notice the info report on the previous terminal:

```
live@localhost)2>
=INFO REPORT==== 11-Mar-2015::09:46:08 ===
application: mnesia
exited: stopped
type: temporary
=INFO REPORT==== 11-Mar-2015::09:46:08 ===
```

h/t to [@aeden](https://twitter.com/aeden)

## Throw As Default Value

Erlang, and OTP, is build on the coding philosophy [“Let It Crash”](http://c2.com/cgi/wiki?LetItCrash). The view is that you don’t need to program defensively. If there are any errors, the process is automatically terminated, and this is reported to any processes that were monitoring the crashed process. In fact, defensive programming in Erlang is frowned upon.

Record fields that are not given a value, are initialized with the value `undefined`. Like `null` in other programming languages, `undefined` is [considered a hack](http://c2.com/cgi/wiki?NullIsaHack).

So to prevent `undefined` field values in records, why not just make throw the default?

Example module:

```erlang
-module(test).

-export([do1/0, do2/0]).

-record(foobar, { bla = throw(“record field not assigned a value”) }).

do1() ->
    F = #foobar{},
        F#foobar.bla.

do2() ->
    F = #foobar{ bla = “orange”},
        F#foobar.bla.
```

Output:

```
2> test:do1().
** exception throw: “record field not assigned a value”
in function  test:do1/0 (test.erl, line 5)
3> test:do2().
“orange”
4>
```

h/t to [@lambdadmitry](https://twitter.com/lambdadmitry)

## List Comprehension without generators

A typical [list comprehension](http://www.erlang.org/doc/programming_examples/list_comprehensions.html) expression, like `Xs = [X ||| X <- [1,2,3]]`, contains the generator `X <- [1,2,3]`. But a list comprehension is *not required* to contain one or more generators.

This allows you to rewrite this case expression:

```erlang
Z = case Y > 2 of
      true -> [X];
      false -> []
   end.
```

Into this short list comprehension: `Z = [X || Y > 2]`.

A real world example of this pattern can be found in the OTP code base:

[https://github.com/erlang/otp/..src/compile.erl#L1713-1714](https://github.com/erlang/otp/blob/735871e6/lib/compiler/src/compile.erl#L1713-1714)
[https://github.com/erlang/otp/..src/v3_codegen.erl#L970-973](https://github.com/erlang/otp/blob/735871e6/lib/compiler/src/v3_codegen.erl#L970-973)


h/t to [@nokusu](https://twitter.com/nokusu)

## Inspecting process status in remote shell

With [`sys:get_status`](http://www.erlang.org/doc/man/sys.html#get_status-1) you can quickly inspect the process status on your live node through [a remote shell](#erlang-remote-shell-by-aeden).

Below we inspect the status of a sample `test_foo_ser` process, which implements the `gen_server` behaviour. Among the information we get the callback module’s state `{“State”,{state,”bar”,”oranges”}`. A `gen_fsm` process returns information such as its current state name and state data, and a `gen_event` process returns information about each of its registered handlers.

```
2> sys:get_status(test_foo_ser).
{status,<0.38.0>,
{module,gen_server},
[[{‘$ancestors’,[test_sup,<0.36.0>]},
{‘$initial_call’,{test_foo_ser,init,1}}],
running,<0.37.0>,[],
[{header,”Status for generic server test_foo_ser”},
{data,[{“Status”,running},
{“Parent”,<0.37.0>},
{“Logged events”,[]}]},
{data,[{“State”,{state,”bar”,”oranges”}}]}]]}
```

h/t to [@OliverFerrigni](https://twitter.com/OliverFerrigni)

## Recon, dialyzer, quickcheck & use iolists to save memory

A bunch of good tips by [@zkessin](https://twitter.com/zkessin):

- Recon ([docs](http://ferd.github.io/recon/), [github](https://github.com/ferd/recon)) aims “to be a set of tools usable in production to diagnose Erlang problems or inspect production environment *safely*”. Safely, as you don’t want to endanger the uptime of a live node.
- Dialyzer: In the past, very smart people tried to come up with a good static type system for Erlang. They couldn’t create one without throwing away some of Erlang’s magic, like hot code loading. Bummer, dude. Instead you can add type-annotations to your code, and check them with a tool called [Dialyzer](http://learnyousomeerlang.com/dialyzer). It’s a sweet alternative to a static type system.
- Quickcheck: Unit testing is nice, but it has a big weakness for which Quickcheck is the solution. I’ve tried to explain this issue in a previous post [Continuous Integration for Erlang With Travis-CI](http://blog.equanimity.nl/blog/2013/06/04/continuous-integration-for-erlang-with-travis-ci/). Also, [@zkessin](https://twitter.com/zkessin) just published a [Testing Erlang With Quickcheck e-book](http://www.erlang-quickcheck-book.com) that you might want to check out.
- Using iolists to save memory. //TODO

## Observer via X11

//TODO




















