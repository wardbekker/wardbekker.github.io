---
layout: post
title: "Enable SPDY for your Erlang website"
date: 2013-04-25 15:01
comments: true
categories: 
---

Google's [Strange Loop](https://thestrangeloop.com) presentation [Making the Web Faster](https://docs.google.com/presentation/d/1dPbm1lKjVqdYq3_z3Dgp4ChPNZuMyrL9uLWGL40HBhI/edit#slide=id.p19) inspired me to enable SPDY on one of my side projects [Zin In Sushi](https://www.zininsushi.nl). This simple sushi restaurant review site is build in Erlang using [Basho's Webmachine](http://wiki.basho.com/Webmachine.html) in combination with [Erlydtl](http://code.google.com/p/erlydtl/).

Below is a quick writeup of the steps needed.

*Assumptions:*

* Your Erlang powered website is running on port 3000 (Substitute this with your own magic value) on HTTP.
* You are running a recent version of Ubuntu (I'm running 12.04 LTS).
* Your domain is `www.example.org`.

*The steps in summary*:

* Reverse proxy setup with Apache 2
* SSL Setup with Apache 2
* Installation of `mod_spdy`
* `$ sudo service apache restart`, and you're done! 

## Reverse proxy setup with Apache 2

First install Apache 2 if not already present:

```sh
$ sudo apt-get install apache2
```
Enable the `proxy_http` Apache module to get reverse proxy support:

```sh
$ sudo a2enmod proxy_http
```
Add a new site to Apache's `available-sites`

```sh
$ sudo vim /etc/apache2/sites-available/reverse_proxy
```
And past in the following contents (and replace the domain name and ports if needed):

```apache
<VirtualHost *:80>
     ServerName www.example.org 
     
     ProxyPreserveHost On
     ProxyRequests Off
     ProxyPass / http://localhost:3000/ 
     ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

Enable the site by executing:

```sh
$ sudo a2ensite reverse_proxy
```

Next up; SSL support!

## SSL Setup with Apache 2

Enable the `ssl` Apache module to enable SSL:

```sh
$ sudo a2enmod ssl
```

SSL certificates are not free, so in this article we generate a self signed SSL certificate to keep moving:

```sh
$ sudo mkdir /etc/apache2/ssl 
$ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/apache2/ssl/apache.key -out /etc/apache2/ssl/apache.crt
```
*Important!* When generating the key, make sure the FQDN matches your domain name:

```sh
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:New York
Locality Name (eg, city) []:NYC
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Awesome Inc
Organizational Unit Name (eg, section) []:Dept of Merriment
Common Name (e.g. server FQDN or YOUR name) []:example.org                  
Email Address []:webmaster@example.org
```

After generating the required encryption keys, we re-edit the `reverse_proxy` site:

```sh
$ sudo vim /etc/apache2/sites-available/reverse_proxy
```

And append the following configuration code:

```apache
<VirtualHost *:443>
     ServerName www.example.org

     SSLEngine on
     SSLCertificateFile /etc/apache2/ssl/apache.crt
     SSLCertificateKeyFile /etc/apache2/ssl/apache.key

     SSLProxyEngine on
     ProxyPreserveHost On
     ProxyRequests Off
     ProxyPass / http://localhost:3000/
     ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

Important! We need to check if Apache is listening on port 443 (SSL) and virtualhost support is enabled for this. `/etc/apache2/ports.conf` should have the following lines enabled:

```apache
<IfModule mod_ssl.c>
    NameVirtualHost *:443
    Listen 443
</IfModule>
```


Now we're in a good shape to add SPDY support

## Installation of `mod_spdy`

You need to fetch the latest `mod_spdy` package from Google:

* [mod_spdy 32-bit .deb (Debian/Ubuntu)](https://dl-ssl.google.com/dl/linux/direct/mod-spdy-beta_current_i386.deb)
* [mod_spdy 64-bit .deb (Debian/Ubuntu)](https://dl-ssl.google.com/dl/linux/direct/mod-spdy-beta_current_amd64.deb)

Check the architecture of your system by running `uname -m`.

Install the package by running the following commands:

```sh
$ sudo dpkg -i mod-spdy-*.deb
$ sudo apt-get -f install
$ sudo a2enmod spdy
```

## Le moment suprême

Restart Apache to power up the new configuration:

```sh
$ sudo service apache2 restart
```

And browse to your website `https://www.example.org` in [Google Chrome](https://www.google.com/intl/en/chrome/browser/).

To verify `mod_spdy` is working, open `chrome://net-internals/#spd` just after the first page load. Your server's domain should be listed in the table under the *SPDY sessions* heading.
