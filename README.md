nuts
====
Jouer avec Node pour faire un petit jeu de poker sans prétention.

(https://codeship.com/projects/ab101c10-9f00-0132-75d9-56e0c71a690d/status?branch=master)

Installation du client
----------------------

1. Installer [node.js][node]
2. Récupérer le fichier [client][nuts client]
3. Ouvrir une console et se positionner au niveau du fichier téléchargé
4. Saisir : *npm install json-socket*
5. Puis saisir : *node .\nuts-cli.js*
6. C'est parti

TODO
----
* Lorsqu'un joueur quitte une partie faire qu'il fold.
* Trouver un moyen d'éviter les fautes de frappe. OK
* Informer les autres joueurs de la personne dont c'est le tour. OK
* Lorsqu'un joueur est a AllIn il ne peut que se coucher, ce n'est pas normal.
* Au tour suivant, il est possible de jouer sans argent.
* Faire clignoter la console lorsque c'est mon tour.
* Afficher la main avec laquelle on a gagné.


La liste des URL pratiques pour mon dev
---------------------------------------
* Grunt : http://gruntjs.com/sample-gruntfile
* RequireJS : http://requirejs.org/docs/node.html
* Mocha : http://visionmedia.github.io/mocha/#example-test-suites
nodejs.org/api/net.html#net_event_end* Underscore : http://underscorejs.org/

Allez hop des liens qui me sont utiles:
---------------------------------------
* http://nodejs.org/api/assert.html

### Module
* http://nodejs.org/api/modules.html
* http://blog.liangzan.net/blog/2012/06/04/how-to-use-exports-in-nodejs/

### Socket
* http://nodejs.org/api/net.html#net_class_net_socket
* http://www.sebastianseilund.com/json-socket-sending-json-over-tcp-in-node.js-using-sockets
* https://github.com/sebastianseilund/node-json-socket#readme
* http://nodejs.org/api/net.html

### ReadLine
* http://nodejs.org/api/readline.html
* https://gist.github.com/DTrejo/901104

[node]: http://nodejs.org/ "Node.Js"
[nuts client]: https://raw2.github.com/MiniKeb/nuts/master/nuts/nuts-cli.js "nuts/nuts-cli.js"
