

exports.crear = function(req, res){
	res.render('/contacto/crear.jade',{
		title: 'Nuevo contacto'
	});
}

exports.list = function(req, res){

	var nombre = req.body.nombre,
		apellido = req.body.apellido,
		correo = req.body.correo;
		

	var contacto_data = {
		nombre: nombre,
		apellido: apellido,
		correo: correo
	};

	// res.json( contacto_data );

	var contacto = new Contacto(contacto_data);

	contacto.save(function(err, contacto_data){
		if (err){
			//res.json(err);
			res.redirect('/contacto/crear');
			console.log('Error en insertar');
		}
		else{
			//res.json(contacto_data);
			res.redirect('/contacto');
			console.log('Insertado el contacto con exito');
		}
	});
}