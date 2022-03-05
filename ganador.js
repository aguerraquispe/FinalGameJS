var Ganador = {
	preload: function () {
		juego.load.image('over', 'img/ganador.jpg');
	},

	create: function () {
		//cambio de color de pantalla al perder el juego
		juego.add.tileSprite(0, 0, 400, 540, 'over');
	},

	update: function () {
		if (juego.input.activePointer.isDown) {		
			juego.state.start('Nivel1');
		}
	}

};