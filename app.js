
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  // , contacto = require('./routes/contacto')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , ejs = require('ejs');

var app = express();

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.enable('verbose errors');
/* app.set('view option', {
	open: '<?',
	close: '?>'
}); */
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1/agenda');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Contacto = new Schema({
	nombre: String,
	apellido: String,
	correo: String
});

var Contacto = mongoose.model('Contacto', Contacto);

//var io = require('socket.io').listen()

app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/contacto', function(req, res){
	Contacto.find({}, function (err, docs){
		//res.send( contacto );
		res.render('contacto/index',{
			title: 'Contacto | AgendaJS',
			docs: docs
		});
	});
});

app.get('/contacto/crear', function(req, res){
	res.render(__dirname + '/views/contacto/crear.jade',{
		title: 'Nuevo contacto'
	});
	//res.end('Hola desde crear');
});


app.post('/contacto/crear', function(req, res){

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
});


app.post('/contacto', function(req, res){

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
});

//app.post('/contacto', contacto.list);

app.get('/contacto/:id/editar',function(req, res){
	Contacto.findById(req.params.id, function(err, c){
		res.render('contacto/editar.jade',{
			title: 'Editar contacto',
			c: c
		});
	});
});

app.get('/contacto/:id/eliminar',function(req, res){
	Contacto.findById(req.params.id, function(err, c){
		if (!c) return next(new NotFound('Document not found'));
		c.remove(function(){
			res.redirect('/contacto');
		});
	});
});

app.put('/contacto/:id', function(req, res){
	Contacto.findById(req.params.id, function(err, c){

		c.nombre = req.body.nombre;
		c.apellido = req.body.apellido;
		c.correo = req.body.correo;

		c.save(function(err){
			if (err){
				console.log('Error al actualizar');
				res.redirect('/contacto/crear');
			}
			else{
				console.log('Listo, actualizado');
				res.redirect('/contacto');
			}			
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
