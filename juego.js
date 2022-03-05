var fondoJuego;
var nave;

var balas;
var tiempoEntreBalas = 400;
var tiempo = 0;

var cursores;

var malos;
var timer;

var puntos;
var txtPuntos;

var vidas = 4;
var txtVidas;

var soundtrack;
var gameover;
var sonido;

var Nivel1 = {
	preload: function () {
		juego.load.image('nave', 'img/personaje.png');
		juego.load.image('laser', 'img/laser.png');
		juego.load.image('malo', 'img/a_nivel1.png');
		juego.load.image('bg', 'img/bgnivel1.png');
		juego.load.image('over', 'img/over.jpg');

		this.load.audio('sonido', 'audio/lanzar.mp3');
		this.load.audio('ost', 'audio/costa.mp3');
		this.load.audio('finjuego', 'audio/final.mp3');
	},

	create: function () {
		fondoJuego = juego.add.tileSprite(0, 0, 400, 540, 'bg');

		//cursores de juego
		cursores = juego.input.keyboard.createCursorKeys();

		//habilitar mecanicas ARCADE
		juego.physics.startSystem(Phaser.Physics.ARCADE);

		nave = juego.add.sprite(juego.width / 2, 485, 'nave');
		//centrar punto de apoyo
		nave.anchor.setTo(0.5);
		//habilitar mecanicas ARCADE
		juego.physics.arcade.enable(nave, true);
		nave.body.collideWorldBounds = true;

		balas = juego.add.group();
		balas.enableBody = true;
		balas.setBodyType = Phaser.Physics.ARCADE;
		balas.createMultiple(50, 'laser');
		balas.setAll('anchor.x', 0.5);
		balas.setAll('anchor.y', 0.5);
		balas.setAll('checkWorldBounds', true);
		balas.setAll('outOfBoundsKill', true);

		//creacion de enemigos

		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE;
		malos.createMultiple(30, 'malo');
		malos.setAll('anchor.x', 0.5);
		malos.setAll('anchor.y', 0.5);
		malos.setAll('checkWorldBounds', true);
		malos.setAll('outOfBoundsKill', true);

		timer = juego.time.events.loop(2000, this.crearEnemigo, this);


		//definiendo el puntaje en pantalla
		puntos = 0;
		juego.add.text(20, 20, "Nivel 1 - Puntos: ", { font: "18px Arial", fill: "#000" });
		txtPuntos = juego.add.text(160, 20, "0", { font: "18px Arial", fill: "#000" });

		//definir contador de vidas
		// vidas = 4;
		//juego.add.text(310, 20, "Vidas: ", { font: "14px Arial", fill: "#fff" });
		txtVidas = juego.add.text(290, 10, "♥ ♥ ♥ ♥", { font: "30px Arial", fill: "#e42c2c" });


		this.sonido = this.sound.add('sonido');
		this.soundtrack = this.sound.add('ost');
		this.gameover = this.sound.add('finjuego');
		this.soundtrack.loop = true;
		this.soundtrack.play();
	},
	update: function () {
		//animacion del juego
		fondoJuego.tilePosition.x -= 3;

		//Rotar imagen donde apunte el cursor
		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

		//mover nave a izquierda y derecha
		if (cursores.right.isDown) {
			nave.position.x += 3;
		}
		else if (cursores.left.isDown) {
			nave.position.x -= 3;
		} else if (cursores.down.isDown) {
			nave.position.y += 3;
		}
		else if (cursores.up.isDown) {
			nave.position.y -= 3;
		}

		//disparar al presionar el cursor
		if (juego.input.activePointer.isDown) {
			this.disparar();
		}

		//agregar colision
		juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

		//definir contador de vidas
		malos.forEachAlive(function (m) {
			if (m.position.x > 390 && m.position.x < 391) {
				vidas -= 1;
				if (vidas == 3) {
					txtVidas.text = "   ♥ ♥ ♥";
				} else if (vidas == 2) {
					txtVidas.text = "      ♥ ♥";
				} else if (vidas == 1) {
					txtVidas.text = "         ♥";
				}
				//txtVidas.text = vidas;
			}
		});

		if (vidas == 0) {
			this.soundtrack.loop = false;
			this.soundtrack.stop();

			//musica final
			this.gameover.play();
			juego.state.start('Terminado');

		}

		if (puntos == 5) {
			this.soundtrack.loop = false;
			this.soundtrack.stop();

			juego.state.start('Nivel2');
		}
	},

	disparar: function () {
		this.sonido.play();

		if (juego.time.now > tiempo && balas.countDead() > 0) {
			tiempo = juego.time.now + tiempoEntreBalas;
			var bala = balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x, nave.y);
			bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
			juego.physics.arcade.moveToPointer(bala, 200);
		}
	},

	crearEnemigo: function () {
		var enem = malos.getFirstDead();
		//posicion aleatoria de aparacion de los enemigos
		var num = Math.floor(Math.random() * (11 - 2) + 2);
		//var num = 10;
		enem.reset(0, num * 38); //posicion del enemigo
		enem.anchor.setTo(0.5); //velocidad de aparicion
		enem.body.velocity.x = 100;
		enem.checkWorldBounds = true;
		enem.outOfBoundsKill = true; // se eleimina al salir de los limites del juego
	},

	colision: function (b, m) {
		b.kill();
		m.kill();

		puntos++;
		console.log(puntos)
		txtPuntos.text = puntos;


	}
};

var Nivel2 = {
	preload: function () {
		juego.load.image('nave', 'img/personaje.png');
		juego.load.image('laser', 'img/laser.png');
		juego.load.image('malo', 'img/a_nivel2.png');
		juego.load.image('bg', 'img/bgnivel2.png');
		juego.load.image('over', 'img/over.jpg');

		this.load.audio('sonido', 'audio/lanzar.mp3');
		this.load.audio('ost', 'audio/costa.mp3');
		this.load.audio('finjuego', 'audio/final.mp3');
	},

	create: function () {
		fondoJuego = juego.add.tileSprite(0, 0, 400, 540, 'bg');

		//cursores de juego
		cursores = juego.input.keyboard.createCursorKeys();

		//habilitar mecanicas ARCADE
		juego.physics.startSystem(Phaser.Physics.ARCADE);

		nave = juego.add.sprite(juego.width / 2, 485, 'nave');
		//centrar punto de apoyo
		nave.anchor.setTo(0.5);
		//habilitar mecanicas ARCADE
		juego.physics.arcade.enable(nave, true);
		nave.body.collideWorldBounds = true;

		balas = juego.add.group();
		balas.enableBody = true;
		balas.setBodyType = Phaser.Physics.ARCADE;
		balas.createMultiple(50, 'laser');
		balas.setAll('anchor.x', 0.5);
		balas.setAll('anchor.y', 0.5);
		balas.setAll('checkWorldBounds', true);
		balas.setAll('outOfBoundsKill', true);

		//creacion de enemigos

		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE;
		malos.createMultiple(30, 'malo');
		malos.setAll('anchor.x', 0.5);
		malos.setAll('anchor.y', 0.5);
		malos.setAll('checkWorldBounds', true);
		malos.setAll('outOfBoundsKill', true);

		timer = juego.time.events.loop(2000, this.crearEnemigo, this);


		//definiendo el puntaje en pantalla
		puntos = 5;
		juego.add.text(20, 20, "Nivel 2 - Puntos: ", { font: "18px Arial", fill: "#000" });
		txtPuntos = juego.add.text(160, 20, puntos, { font: "18px Arial", fill: "#000" });

		//definir contador de vidas
		// vidas = 4;
		//juego.add.text(310, 20, "Vidas: ", { font: "14px Arial", fill: "#fff" });
		txtVidas = juego.add.text(290, 10, "♥ ♥ ♥ ♥", { font: "30px Arial", fill: "#e42c2c" });


		this.sonido = this.sound.add('sonido');
		this.soundtrack = this.sound.add('ost');
		this.gameover = this.sound.add('finjuego');
		this.soundtrack.loop = true;
		this.soundtrack.play();
	},
	update: function () {
		//animacion del juego
		fondoJuego.tilePosition.x -= 3;

		//Rotar imagen donde apunte el cursor
		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

		//mover nave a izquierda y derecha
		if (cursores.right.isDown) {
			nave.position.x += 3;
		}
		else if (cursores.left.isDown) {
			nave.position.x -= 3;
		} else if (cursores.down.isDown) {
			nave.position.y += 3;
		}
		else if (cursores.up.isDown) {
			nave.position.y -= 3;
		}

		//disparar al presionar el cursor
		if (juego.input.activePointer.isDown) {
			this.disparar();
		}

		//agregar colision
		juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

		//definir contador de vidas
		malos.forEachAlive(function (m) {
			if (m.position.x > 390 && m.position.x < 391) {
				vidas -= 1;
				if (vidas == 3) {
					txtVidas.text = "   ♥ ♥ ♥";
				} else if (vidas == 2) {
					txtVidas.text = "      ♥ ♥";
				} else if (vidas == 1) {
					txtVidas.text = "         ♥";
				}
				//txtVidas.text = vidas;
			}
		});

		if (vidas == 0) {
			this.soundtrack.loop = false;
			this.soundtrack.stop();

			//musica final
			this.gameover.play();
			juego.state.start('Terminado');

		}

		if (puntos == 10) {
			this.soundtrack.loop = false;
			this.soundtrack.stop();

			juego.state.start('Nivel3');
		}
	},

	disparar: function () {
		this.sonido.play();

		if (juego.time.now > tiempo && balas.countDead() > 0) {
			tiempo = juego.time.now + tiempoEntreBalas;
			var bala = balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x, nave.y);
			bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
			juego.physics.arcade.moveToPointer(bala, 200);
		}
	},

	crearEnemigo: function () {
		var enem = malos.getFirstDead();
		//posicion aleatoria de aparacion de los enemigos
		var num = Math.floor(Math.random() * (11 - 2) + 2);
		//var num = 10;
		enem.reset(0, num * 38); //posicion del enemigo
		enem.anchor.setTo(0.5); //velocidad de aparicion
		enem.body.velocity.x = 100;
		enem.checkWorldBounds = true;
		enem.outOfBoundsKill = true; // se eleimina al salir de los limites del juego
	},

	colision: function (b, m) {
		b.kill();
		m.kill();

		puntos++;
		console.log(puntos)
		txtPuntos.text = puntos;


	}
};

var Nivel3 = {
	preload: function () {
		juego.load.image('nave', 'img/personaje.png');
		juego.load.image('laser', 'img/laser.png');
		juego.load.image('malo', 'img/a_nivel3.png');
		juego.load.image('bg', 'img/bg2nivel1.png');
		juego.load.image('over', 'img/over.jpg');

		this.load.audio('sonido', 'audio/lanzar.mp3');
		this.load.audio('ost', 'audio/costa.mp3');
		this.load.audio('finjuego', 'audio/final.mp3');
	},

	create: function () {
		fondoJuego = juego.add.tileSprite(0, 0, 400, 540, 'bg');

		//cursores de juego
		cursores = juego.input.keyboard.createCursorKeys();

		//habilitar mecanicas ARCADE
		juego.physics.startSystem(Phaser.Physics.ARCADE);

		nave = juego.add.sprite(juego.width / 2, 485, 'nave');
		//centrar punto de apoyo
		nave.anchor.setTo(0.5);
		//habilitar mecanicas ARCADE
		juego.physics.arcade.enable(nave, true);
		nave.body.collideWorldBounds = true;

		balas = juego.add.group();
		balas.enableBody = true;
		balas.setBodyType = Phaser.Physics.ARCADE;
		balas.createMultiple(50, 'laser');
		balas.setAll('anchor.x', 0.5);
		balas.setAll('anchor.y', 0.5);
		balas.setAll('checkWorldBounds', true);
		balas.setAll('outOfBoundsKill', true);

		//creacion de enemigos

		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE;
		malos.createMultiple(30, 'malo');
		malos.setAll('anchor.x', 0.5);
		malos.setAll('anchor.y', 0.5);
		malos.setAll('checkWorldBounds', true);
		malos.setAll('outOfBoundsKill', true);

		timer = juego.time.events.loop(2000, this.crearEnemigo, this);


		//definiendo el puntaje en pantalla
		puntos = 10;
		juego.add.text(20, 20, "Nivel 2 - Puntos: ", { font: "18px Arial", fill: "#000" });
		txtPuntos = juego.add.text(160, 20, puntos, { font: "18px Arial", fill: "#000" });

		//definir contador de vidas
		// vidas = 4;
		//juego.add.text(310, 20, "Vidas: ", { font: "14px Arial", fill: "#fff" });
		txtVidas = juego.add.text(290, 10, "♥ ♥ ♥ ♥", { font: "30px Arial", fill: "#e42c2c" });


		this.sonido = this.sound.add('sonido');
		this.soundtrack = this.sound.add('ost');
		this.gameover = this.sound.add('finjuego');
		this.soundtrack.loop = true;
		this.soundtrack.play();
	},
	update: function () {
		//animacion del juego
		fondoJuego.tilePosition.x -= 3;

		//Rotar imagen donde apunte el cursor
		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

		//mover nave a izquierda y derecha
		if (cursores.right.isDown) {
			nave.position.x += 3;
		}
		else if (cursores.left.isDown) {
			nave.position.x -= 3;
		} else if (cursores.down.isDown) {
			nave.position.y += 3;
		}
		else if (cursores.up.isDown) {
			nave.position.y -= 3;
		}

		//disparar al presionar el cursor
		if (juego.input.activePointer.isDown) {
			this.disparar();
		}

		//agregar colision
		juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

		//definir contador de vidas
		malos.forEachAlive(function (m) {
			if (m.position.x > 390 && m.position.x < 391) {
				vidas -= 1;
				if (vidas == 3) {
					txtVidas.text = "   ♥ ♥ ♥";
				} else if (vidas == 2) {
					txtVidas.text = "      ♥ ♥";
				} else if (vidas == 1) {
					txtVidas.text = "         ♥";
				}
				//txtVidas.text = vidas;
			}
		});

		if (vidas == 0) {
			this.soundtrack.loop = false;
			this.soundtrack.stop();

			//musica final
			this.gameover.play();
			juego.state.start('Terminado');

		}

		if (puntos == 15) {
			this.soundtrack.loop = false;
			this.soundtrack.stop();

			juego.state.start('Nivel4');
		}
	},

	disparar: function () {
		this.sonido.play();

		if (juego.time.now > tiempo && balas.countDead() > 0) {
			tiempo = juego.time.now + tiempoEntreBalas;
			var bala = balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x, nave.y);
			bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
			juego.physics.arcade.moveToPointer(bala, 200);
		}
	},

	crearEnemigo: function () {
		var enem = malos.getFirstDead();
		//posicion aleatoria de aparacion de los enemigos
		var num = Math.floor(Math.random() * (11 - 2) + 2);
		//var num = 10;
		enem.reset(0, num * 38); //posicion del enemigo
		enem.anchor.setTo(0.5); //velocidad de aparicion
		enem.body.velocity.x = 100;
		enem.checkWorldBounds = true;
		enem.outOfBoundsKill = true; // se eleimina al salir de los limites del juego
	},

	colision: function (b, m) {
		b.kill();
		m.kill();

		puntos++;
		console.log(puntos)
		txtPuntos.text = puntos;


	}
};

var Nivel4 = {
	preload: function () {
		juego.load.image('nave', 'img/personaje.png');
		juego.load.image('laser', 'img/laser.png');
		juego.load.image('malo', 'img/a_nivel4.png');
		juego.load.image('bg', 'img/bgnivel4.png');
		juego.load.image('over', 'img/over.jpg');

		this.load.audio('sonido', 'audio/lanzar.mp3');
		this.load.audio('ost', 'audio/costa.mp3');
		this.load.audio('finjuego', 'audio/final.mp3');
	},

	create: function () {
		fondoJuego = juego.add.tileSprite(0, 0, 400, 540, 'bg');

		//cursores de juego
		cursores = juego.input.keyboard.createCursorKeys();

		//habilitar mecanicas ARCADE
		juego.physics.startSystem(Phaser.Physics.ARCADE);

		nave = juego.add.sprite(juego.width / 2, 485, 'nave');
		//centrar punto de apoyo
		nave.anchor.setTo(0.5);
		//habilitar mecanicas ARCADE
		juego.physics.arcade.enable(nave, true);
		nave.body.collideWorldBounds = true;

		balas = juego.add.group();
		balas.enableBody = true;
		balas.setBodyType = Phaser.Physics.ARCADE;
		balas.createMultiple(50, 'laser');
		balas.setAll('anchor.x', 0.5);
		balas.setAll('anchor.y', 0.5);
		balas.setAll('checkWorldBounds', true);
		balas.setAll('outOfBoundsKill', true);

		//creacion de enemigos

		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE;
		malos.createMultiple(30, 'malo');
		malos.setAll('anchor.x', 0.5);
		malos.setAll('anchor.y', 0.5);
		malos.setAll('checkWorldBounds', true);
		malos.setAll('outOfBoundsKill', true);

		timer = juego.time.events.loop(2000, this.crearEnemigo, this);


		//definiendo el puntaje en pantalla
		puntos = 15;
		juego.add.text(20, 20, "Nivel 4 - Puntos: ", { font: "18px Arial", fill: "#000" });
		txtPuntos = juego.add.text(160, 20, puntos, { font: "18px Arial", fill: "#000" });

		//definir contador de vidas
		// vidas = 4;
		//juego.add.text(310, 20, "Vidas: ", { font: "14px Arial", fill: "#fff" });
		txtVidas = juego.add.text(290, 10, "♥ ♥ ♥ ♥", { font: "30px Arial", fill: "#e42c2c" });


		this.sonido = this.sound.add('sonido');
		this.soundtrack = this.sound.add('ost');
		this.gameover = this.sound.add('finjuego');
		this.soundtrack.loop = true;
		this.soundtrack.play();
	},
	update: function () {
		//animacion del juego
		fondoJuego.tilePosition.x -= 3;

		//Rotar imagen donde apunte el cursor
		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

		//mover nave a izquierda y derecha
		if (cursores.right.isDown) {
			nave.position.x += 3;
		}
		else if (cursores.left.isDown) {
			nave.position.x -= 3;
		} else if (cursores.down.isDown) {
			nave.position.y += 3;
		}
		else if (cursores.up.isDown) {
			nave.position.y -= 3;
		}

		//disparar al presionar el cursor
		if (juego.input.activePointer.isDown) {
			this.disparar();
		}

		//agregar colision
		juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

		//definir contador de vidas
		malos.forEachAlive(function (m) {
			if (m.position.x > 390 && m.position.x < 391) {
				vidas -= 1;
				if (vidas == 3) {
					txtVidas.text = "   ♥ ♥ ♥";
				} else if (vidas == 2) {
					txtVidas.text = "      ♥ ♥";
				} else if (vidas == 1) {
					txtVidas.text = "         ♥";
				}
				//txtVidas.text = vidas;
			}
		});

		if (vidas == 0) {
			this.soundtrack.loop = false;
			this.soundtrack.stop();

			//musica final
			this.gameover.play();
			juego.state.start('Terminado');

		}
	},

	disparar: function () {
		this.sonido.play();

		if (juego.time.now > tiempo && balas.countDead() > 0) {
			tiempo = juego.time.now + tiempoEntreBalas;
			var bala = balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x, nave.y);
			bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
			juego.physics.arcade.moveToPointer(bala, 200);
		}
	},

	crearEnemigo: function () {
		var enem = malos.getFirstDead();
		//posicion aleatoria de aparacion de los enemigos
		var num = Math.floor(Math.random() * (11 - 2) + 2);
		//var num = 10;
		enem.reset(0, num * 38); //posicion del enemigo
		enem.anchor.setTo(0.5); //velocidad de aparicion
		enem.body.velocity.x = 100;
		enem.checkWorldBounds = true;
		enem.outOfBoundsKill = true; // se eleimina al salir de los limites del juego
	},

	colision: function (b, m) {
		b.kill();
		m.kill();

		puntos++;
		console.log(puntos)
		txtPuntos.text = puntos;


	}
};