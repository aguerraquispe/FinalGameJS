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

var vidas;
var txtVidas;

var soundtrack;
var gameover;
var sonido;

var Juego = {
	preload: function () {
		juego.load.image('nave', 'img/nave.png');
		juego.load.image('laser', 'img/laser.png');
		juego.load.image('malo', 'img/roca.png');
		juego.load.image('bg', 'img/bg.png');
		juego.load.image('over', 'img/over.jpg');

		this.load.audio('sonido', 'audio/laser.mp3');
        this.load.audio('ost', 'audio/contra.mp3');
		this.load.audio('finjuego','audio/final.mp3');
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
		juego.add.text(20, 20, "Puntos: ", { font: "14px Arial", fill: "#fff" });
		txtPuntos = juego.add.text(80, 20, "0", { font: "14px Arial", fill: "#fff" });

		//definir contador de vidas
		vidas = 3;
		juego.add.text(310, 20, "Vidas: ", { font: "14px Arial", fill: "#fff" });
		txtVidas = juego.add.text(360, 20, "3", { font: "14px Arial", fill: "#fff" });


		this.sonido = this.sound.add('sonido');
        this.soundtrack = this.sound.add('ost');
		this.gameover = this.sound.add('finjuego');
        this.soundtrack.loop = true;
        this.soundtrack.play();
	},
	update: function () {
		//animacion del juego
		fondoJuego.tilePosition.y -= 3;

		//Rotar imagen donde apunte el cursor
		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

		//mover nave a izquierda y derecha
		if (cursores.right.isDown) {
			nave.position.x += 3;
		}
		else if (cursores.left.isDown) {
			nave.position.x -= 3;
		}

		//disparar al presionar el cursor
		if (juego.input.activePointer.isDown) {
			this.disparar();
		}

		//agregar colision
		juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

		//definir contador de vidas
		malos.forEachAlive(function (m) {
			if (m.position.y > 520 && m.position.y < 521) {
				vidas -= 1;
				txtVidas.text = vidas;
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
		var num = Math.floor(Math.random() * 10 + 1);
		enem.reset(num * 38, 0); //posicion del enemigo
		enem.anchor.setTo(0.5); //velocidad de aparicion
		enem.body.velocity.y = 100;
		enem.checkWorldBounds = true;
		enem.outOfBoundsKill = true; // se eleimina al salir de los limites del juego
	},

	colision: function (b, m) {
		b.kill();
		m.kill();

		puntos++;
		txtPuntos.text = puntos;
	}
};