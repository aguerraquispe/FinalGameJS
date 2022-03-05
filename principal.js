var juego = new Phaser.Game(400, 540, Phaser.CANVAS, 'bloque_juego');

//Agregando los estados del juego
juego.state.add('Nivel1', Nivel1);
juego.state.add('Nivel2', Nivel2);
juego.state.add('Nivel3', Nivel3);
juego.state.add('Nivel4', Nivel4);
juego.state.add('Terminado', Terminado);
juego.state.add('Inicio',Inicio);
juego.state.add('Ganador',Ganador);

//Inicializamos juego en el estado Juego
juego.state.start('Terminado');