var Terminado ={
	preload: function () {

	},

	create: function(){
		//cambio de color de pantalla al perder el juego
		//juego.stage.backgroundColor="#990000";
		juego.add.tileSprite(0, 0, 400, 540, 'over');
	},

	update: function () {
		if (juego.input.activePointer.isDown) {		
			juego.state.start('Nivel1');					
			this.gameover.loop = false;
			this.gameover.stop();
		}
	}

};