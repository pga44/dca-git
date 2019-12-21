import {API} from './servicios/API.js'
import {compile} from 'handlebars';

// Inicializo el servicio de la API.
var servicio_API = new API('http://localhost:3000')

// Template del Login.
// Inputs para meter el nickname y la contraseña, y el botón para loguearse.
var templateLogin = `
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Sign In</h5>

              <div class="form-label-group">
                <input id="inputNick" class="form-control" placeholder="Nickname">
                <label for="inputNick">Nickname</label>
              </div>

              <div class="form-label-group">
                <input type="password" id="inputPass" class="form-control" placeholder="Password">
                <label for="inputPass">Password</label>
              </div>
              <button id="buttonEntrar" class="btn btn-lg btn-primary btn-block text-uppercase">Entrar</button>
          </div>
        </div>
      </div>
    </div>
`

// Template del navbar derecho no logueado.
// Botón para ir a Login.
var templateNavNologin = `
    <li class="nav-item topnav-right" >
    <a id="linkLogin" class="nav-link" href="">Login</a>
    </li>
`

// Template del navbar derecho logueado.
// Añado el nickname del usuario logueado y un botón logout.
var templateNavLogin = `
    <li class="nav-item">
    <strong style="color:#FFFFFF" class="nav-link" href="">Nickname: {{nickname}}</strong>
    </li>
    <li class="nav-item">
    <a id="linkLogout" class="nav-link" href="">Logout</a>
    </li>
`

// Template del navbar izquierdo con las diferentes opciones que tienes para hacer logueado.
// Botones para ir a la lista de Productos y la lista de pedidos de dicho usuario logueado.
var templateOpciones = `
    <li class="nav-item">
    <a  id="linkProductos" style="color:#FFFFFF" class="nav-link" href="#">Productos</a>
    </li>
    <li class="nav-item">
    <a  id="linkPedidos" style="color:#FFFFFF" class="nav-link" href="#">Pedidos</a>
    </li>
`

// Template para una fila del listado de un producto.
// Muestro el titulo, la categoria y un botón para ver los datos de dicho producto y sus comentarios.
var templateProducto = `
<tr>
    <td>{{titulo}}</td>
    <td>{{categoria}}</td>
    <td><button class="btn btn-primary" id="verComent_{{id}}">Ver Producto</button><td>
</tr>
`

// Template del listado de productos.
// Realizo la tabla con sus columnas para mostrar el listado de los diferentes productos.
var templateListaProductos = `
<div class="row mt-3">
    <div class="col">
    <h2>Listado de Productos</h2>
    </div>
</div>
<div class="row mt-3">
    <div class="col">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Titulo</th>
                    <th>Categoria</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {{#.}}
                ${templateProducto}
                {{/.}}
            </tbody>
        </table>
    </div>
</div>
`

// Template para una fila del listado de un comentario.
// Muestro el nickname y el mensaje de quien lo ha hecho y además los botones para editar y borrar el comentario.
var templateComentario = `
<tr>
    <td>{{this.nick}}</td>
    <td>{{this.message}}</td>
    <td><button class="btn btn-primary" id="editComent_{{this.comment_id}}_{{this.product_id}}_{{this.message}}">Editar</button>
    <button class="btn btn-primary" id="borrComent_{{this.comment_id}}_{{this.product_id}}">Borrar</button><td>
</tr>
`

// Template para crear un comentario.
// Un input donde añado un mensaje para el comentario, un botón para crear el comentario y un enlace para cerrar el template.
var templateCrearComentario = `
<div class="col">
    <h3>Crear Comentario</h2>
    <div class="col-6">
        <div class="form-group">
            <label for="nombre">Mensaje:</label>
            <div class="form-inline">
                <input class="form-control" style="margin-right:10px;" id="mensaje" name="nombre" required type="text"/>
                <button id="buttonCrear_{{id}}" class="btn btn-primary">Crear Comentario</button>
            </div>
            <a type ="button" href="#" id="crearEsta">Cerrar</a>
        </div>
    </div>
</div>
`

// Template para editar un comentario.
// Un input donde añado el nuevo mensaje para el comentario, un botón para editar el comentario y un enlace para cerrar el template.
var templateEditarComentario = `
<div class="col">
    <h3> Editar Comentario</h2>
    <div class="col-6">
        <div class="form-group">
            <label for="nombre">Nuevo mensaje:</label>
            <div class="form-inline">
                <input class="form-control" style="margin-right:10px;" id="newMensaje" name="mensaje" required type="text"/>
                <button id="buttonEditar_{{idProduct}}_{{idComment}}" class="btn btn-primary">Editar Comentario</button>
            </div>
            <a type ="button" href="#" id="editarEsta">Cerrar</a>
        </div>
    </div>
</div>
`

// Template del listado de los comentarios de un producto junto a sus datos.
// Añado todos los datos del producto, los botones para comprar producto, el de vender producto y
// el de crear comentario, y realizo la tabla con sus columnas para mostrar el listado de los diferentes comentarios de dicho producto.
var templateListaComentarios = `
<div class="container-fluid">
    <h2>{{title}}</h2>
    <table cellpadding="30">
    <tr>
    <ul>
    <td>
    <li style="font-size: 20px;">Categoria: {{category}}</li>
    <li style="font-size: 20px;">Descripción: {{description}}</li>
    <li style="font-size: 20px;">Precio Venta: {{sale_price}}</li>
    <li style="font-size: 20px;">Precio Compra: {{buy_price}}</li>
    </td>
    </ul>
    <ul>
    <td>
    <li style="font-size: 20px;">Foto: {{photo}}</li>
    <li style="font-size: 20px;">Año: {{year}}</li>
    <li style="font-size: 20px;">Stock: {{stock}}</li>
    </td>
    </ul>
    </tr>
    </table>
</div>
<button id="buttonPedirC_{{product_id}}" class="btn btn-primary">Comprar Producto</button>
<button id="buttonPedirV_{{product_id}}" class="btn btn-primary">Vender Producto</button>

<div id="crearComentario" class="row mt-3"></div>
<div id="editarComentario" class="row mt-3"></div>
<div class="row mt-3">
    <div class="col">
    <h3>Listado de Comentarios</h3>
    </div>
</div>
<div class="row mt-3">
    <div class="col">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nickname</th>
                    <th>Comentario</th>
                    <th><button class="btn btn-primary" id="crearComent_{{product_id}}">Crear</button>
                    </th>
                </tr>
            </thead>
            <tbody>
                {{#comentarios}}
                ${templateComentario}
                {{/comentarios}}
            </tbody>
        </table>
    </div>
</div>
`

// Template para una fila del listado de un pedido.
// Muestro el id, tipo y estado del pedido, y el titulo del producto y además los botones para ver los detalles, pagar y borrar pedido.
var templatePedido = `
<tr>
    <td>{{this.idOrder}}</td>
    <td>{{this.titulo}}</td>
    <td>{{this.tipo}}</td>
    <td>{{this.proceso}}</td>
    <td><button class="btn btn-primary" id="verPed_{{this.idOrder}}">Detalles</button>
    <button class="btn btn-primary" id="editPed_{{this.idOrder}}_{{this.proceso}}">Pagar</button>
    <button class="btn btn-primary" id="borrPed_{{this.idOrder}}">Borrar</button><td>
</tr>
`

// Template para mostrar los detalles de un pedido.
// Muestro el id, tipo y estado del pedido, y el titulo, categoria, precio de venta y precio de compra del producto 
// y un enlace para cerrar el template.
var templateVerPedido = `
<div class="container-fluid">
<h3>Detalles del producto {{idOrder}}:</h3>
<table cellpadding="25">
    <tr>
    <ul>
    <td>
    <li style="font-size: 20px;">Titulo: {{title}}</li>
    <li style="font-size: 20px;">Categoria: {{category}}</li>
    <li style="font-size: 20px;">Precio Venta: {{sale_price}}</li>
    <li style="font-size: 20px;">Precio Compra: {{buy_price}}</li></td>
    </ul>
    <ul>
    <td><li style="font-size: 20px;">Tipo: {{tipo}}</li>
    <li style="font-size: 20px;">Estado: {{proceso}}</li>
    <li style="font-size: 20px;">Stock: {{stock}}</li></td>
    </ul>
    </tr>
    <a type ="button" href="#" id="verEstaP">Cerrar</a>
    </table>
    
</div>
`

// Template para pagar un pedido.
// Un boton para pagar el pedido y un enlace para cerrar el template.
var templatePagarPedido = `
<div class="col">
    <h3> Pagar Pedido {{idOrder}}</h2>
    <div class="col-6">
        <div class="form-group">
            <label for="nombre">Dale al boton para pagar:</label>
            <button id="buttonPagar_{{idOrder}}" class="btn btn-primary">Pagar</button>
            <div class="form-inline">
            <a type ="button" href="#" id="editarEstaP">Cerrar</a>
            </div>
        </div>
    </div>
</div>
`

// Template del listado de los pedidos del usuario logueado.
// Realizo la tabla con sus columnas para mostrar el listado de los diferentes pedidos del usuario logueado.
var templateListaPedidos = `
<div class="row mt-3">
    <div class="col">
        <div id="verPedido" class="row mt-3"></div>
        <div id="editarPedido"></div>
    </div>
</div>
<div class="row mt-3">
    <div class="col">
        <h3>Listado de Pedidos de {{nick}}</h3>
    </div>
</div>
<div class="row mt-3">
    <div class="col">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Titulo</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {{#pedidos}}
                ${templatePedido}
                {{/pedidos}}
            </tbody>
        </table>
    </div>
</div>
`

// Compilamos las plantillas handlebars. 
// Esto genera funciones a las que llamaremos luego.
var tmpl_login = compile(templateLogin)

var tmpl_navNoLogin = compile(templateNavNologin)
var tmpl_navLogin = compile(templateNavLogin)
var tmpl_navOpciones = compile(templateOpciones)

var tmpl_listaProductos = compile(templateListaProductos)
var tmpl_producto = compile(templateProducto)

var tmpl_listaComentarios = compile(templateListaComentarios)
var tmpl_comentario = compile(templateComentario)
var tmpl_crearComentario = compile(templateCrearComentario)
var tmpl_editarComentario = compile(templateEditarComentario)

var tmpl_listaPedidos = compile(templateListaPedidos)
var tmpl_pedido = compile(templatePedido)
var tmpl_verPedido = compile(templateVerPedido)
var tmpl_editarPedido = compile(templatePagarPedido)

// LocalStorage.
var token = window.localStorage;

// Manejador de eventos para cuando se carga la página.
document.addEventListener('DOMContentLoaded', function(){
    console.log("Página cargada!: " + new Date().toLocaleString())
    
    // Si hay token.
    if(token.getItem('token') != null){
        // Creamos un objeto JS con el nickname guardado en LocalStorage,
        // para que en el navbar aparezca el nombre.
        var nick = {}
        nick.nickname = token.getItem('nick')

        // Insertamos el HTML del navbar cuando estas logueado.
        document.getElementById("navbar").innerHTML = tmpl_navLogin(nick);
        document.getElementById("opciones").innerHTML = tmpl_navOpciones();

        // Pedimos la lista de productos e insertamos el HTML en "listProductos".
        servicio_API.obtenerProductos().then(function(response){
            //console.log(response.linkProducts)
            var listaHTML = tmpl_listaProductos(response.linkProducts)
            document.getElementById("listProductos").innerHTML = listaHTML
        })

    // No hay token.
    }else{
        // Insertamos el HTML del navbar cuando estas logueado.
        document.getElementById("login").innerHTML = tmpl_login();
        document.getElementById("navbar").innerHTML = tmpl_navNoLogin();
    }
})

// Manejador de eventos para cuando se carga la página "opciones".
document.getElementById('opciones').addEventListener('click', function(e){
    // Quitamos el HTML anterior.
    document.getElementById("listProductos").innerHTML = null
    document.getElementById("listPedidos").innerHTML = null
    document.getElementById("listComentarios").innerHTML = null

    // Si clickas en "linkProductos" en el navbar.
    if (e.target.id.startsWith('linkProductos')){
        // Pedimos la lista de productos e insertamos el HTML en "listProductos".
        servicio_API.obtenerProductos().then(function(response){
            //console.log(response.linkProducts)
            var listaHTML = tmpl_listaProductos(response.linkProducts)
            document.getElementById("listProductos").innerHTML = listaHTML
        })
    }

    // Si clickas en "linkPedidos" en el navbar.
    if(e.target.id.startsWith('linkPedidos')){
        // Pedimos la lista de pedidos de ese id de usuario logueado.
        servicio_API.obtenerPedidos(token.getItem('id'), token.getItem('token')).then(function(response){
            // Creamos un objeto JS con el nickname y la lista de pedidos que me da el API.
            var datos = {}
            datos.nick = token.getItem('nick')
            datos.pedidos = []
            
            for(var i in response.linkProducts){
                datos.pedidos[i] = response.linkProducts[i];
                // Cambiamos los 0 y 1 por Strings.
                if(datos.pedidos[i].proceso  == 0){
                    datos.pedidos[i].proceso = "Pagar"
                }else{
                    datos.pedidos[i].proceso = "Pagado"
                }
                if(datos.pedidos[i].tipo == 0){
                    datos.pedidos[i].tipo = "Compra"
                }else{
                    datos.pedidos[i].tipo = "Venta"
                }
            }
            // Insertamos el HTML en "listPedidos".
            var listaHTML = tmpl_listaPedidos(datos)
            document.getElementById("listPedidos").innerHTML = listaHTML
        })
    }
})

// Manejador de eventos para cuando se carga la página "navbar".
document.getElementById('navbar').addEventListener('click', function(e){
    
    // Si clickas en "linkLogin" en el navbar.
	if (e.target.id.startsWith('linkLogin')){
        // Insertamos el HTML en "login" y "navbar".
        document.getElementById("login").innerHTML = tmpl_login()
        document.getElementById("navbar").innerHTML = tmpl_navNoLogin()
    }
    // Si clickas en "linkLogout" en el navbar.
    if(e.target.id.startsWith('linkLogout')){
        // Quitamos todo lo que haya en el LocalStorage.
        token.clear();

        // Insertamos el HTML en "login" y "navbar".
        document.getElementById("login").innerHTML = tmpl_login()
        document.getElementById("navbar").innerHTML = tmpl_navNoLogin()
    }
})

// Manejador de eventos para cuando se carga la página "login".
document.getElementById('login').addEventListener('click', function(e){  
    // Si clickas en "buttonEntrar".
    if (e.target.id.startsWith('buttonEntrar')){
        // Creamos un objeto JS con el nickname y la contraseña introducida en los input.
        var nuevo = {}
        nuevo.nick = document.getElementById('inputNick').value
        nuevo.pass = document.getElementById('inputPass').value
        
        // Pedimos loguearnos
        // e insertamos el HTML en "listPedidos".
        servicio_API.login(nuevo).then(function(response){
            // Si se encuentran los datos en el API.
            if(response.ok){
                return response.json(); 
            }else{
                // Si no se encuentra esos datos en el API muestro una alerta.
                alert('No existe el usuario')
                return response.json();
            }
        }).then(function(json){
            //console.log(json)

            // Si devuelve un mensaje de error la API no hacemos nada.
            if(json.Message != null){
                return 
            }
            // Si devuelve algo distinto a un mensaje, añadimos
            // el token, el nickname y el user_id en LocalStorage.
            token.setItem('token', json.token);
            token.setItem('nick', json.nickname);
            token.setItem('id', json.links.user_id);

            // Quitamos el HTML de "login" e insertamos el HTML en "navbar" y "opciones".
            document.getElementById("login").innerHTML = null;
            document.getElementById("navbar").innerHTML = tmpl_navLogin(json)            
            document.getElementById("opciones").innerHTML = tmpl_navOpciones();

            // Insertamos el HTML en "listPedidos".
            servicio_API.obtenerProductos().then(function(response){
                //console.log(response.linkProducts)
                var listaHTML = tmpl_listaProductos(response.linkProducts)
                document.getElementById("listProductos").innerHTML = listaHTML
            })
        })
    }
})


// Manejador de eventos para cuando se carga la página "listProductos".
document.getElementById('listProductos').addEventListener('click', function(e){
    
    // Si clickas en "verComent".
    if (e.target.id.startsWith('verComent_')){
        // Quitamos el HTML anterior.
        document.getElementById("listProductos").innerHTML = null;
        
        // Obtenemos el id del producto.
        var id = e.target.id.substring(10)
        
        // Pedimos el producto e insertamos el HTML en "listComentarios".
        servicio_API.obtenerProducto(id).then(function(response){
            // Creamos un objeto JS con los datos que me da el API.
            var datos = {}
            for(var i in response.product)
                datos = response.product[i];
            datos.comentarios = response.comments
            //console.log(datos)
            // Insertamos el HTML en "listComentarios".
            var listaHTML = tmpl_listaComentarios(datos)
            document.getElementById("listComentarios").innerHTML = listaHTML
        })
    }
    
})

// Manejador de eventos para cuando se carga la página "listComentarios".
document.getElementById('listComentarios').addEventListener('click', function(e){
    // Si clickas en "buttonPedirV".
    if(e.target.id.startsWith('buttonPedirV_')){
        // Obtenemos el id del producto.
        var idProduct = e.target.id.substring(13)
        // Pedimos crear dicho pedido.
        servicio_API.crearPedido(idProduct, 1, token.getItem('token')).then(function(response){
            // Pedimos la lista de pedidos de ese id de usuario logueado.
            servicio_API.obtenerPedidos(token.getItem('id'), token.getItem('token')).then(function(response){
                // Creamos un objeto JS con el nickname y la lista de pedidos que me da el API.
                var datos = {}
                datos.nick = token.getItem('nick')
                datos.pedidos = []
                
                for(var i in response.linkProducts){
                    datos.pedidos[i] = response.linkProducts[i];
                    // Cambiamos los 0 y 1 por Strings.
                    if(datos.pedidos[i].proceso  == 0){
                        datos.pedidos[i].proceso = "Pagar"
                    }else{
                        datos.pedidos[i].proceso = "Pagado"
                    }
                    if(datos.pedidos[i].tipo == 0){
                        datos.pedidos[i].tipo = "Compra"
                    }else{
                        datos.pedidos[i].tipo = "Venta"
                    }
                }
                // Insertamos el HTML en "listPedidos" y quitamos "listComentarios".
                document.getElementById("listComentarios").innerHTML = null
                var listaHTML = tmpl_listaPedidos(datos)
                document.getElementById("listPedidos").innerHTML = listaHTML
            })
        })
    } 
    // Si clickas en "buttonPedirC" en el navbar.
    if(e.target.id.startsWith('buttonPedirC_')){
        // Obtenemos el id del producto.
        var idProduct = e.target.id.substring(13)        
        // Pedimos crear dicho pedido.
        servicio_API.crearPedido(idProduct, 0, token.getItem('token')).then(function(response){
            // Si devuelve false, es que no hay stock y no puedes crear un pedido.
            if(!response){
                // Devuelvo una alerta.
                alert('No hay stock')
                return
            }
            // Pedimos la lista de pedidos de ese id de usuario logueado.
            servicio_API.obtenerPedidos(token.getItem('id'), token.getItem('token')).then(function(response){
                // Creamos un objeto JS con el nickname y la lista de pedidos que me da el API.
                var datos = {}
                datos.nick = token.getItem('nick')
                datos.pedidos = []
                
                for(var i in response.linkProducts){
                    datos.pedidos[i] = response.linkProducts[i];
                    // Cambiamos los 0 y 1 por Strings.
                    if(datos.pedidos[i].proceso  == 0){
                        datos.pedidos[i].proceso = "Pagar"
                    }else{
                        datos.pedidos[i].proceso = "Pagado"
                    }
                    if(datos.pedidos[i].tipo == 0){
                        datos.pedidos[i].tipo = "Compra"
                    }else{
                        datos.pedidos[i].tipo = "Venta"
                    }
                }
                // Insertamos el HTML en "listPedidos" y quitamos "listComentarios".
                document.getElementById("listComentarios").innerHTML = null
                var listaHTML = tmpl_listaPedidos(datos)
                document.getElementById("listPedidos").innerHTML = listaHTML
            })
        })
    }
    // Si clickas en "crearComent".
    if(e.target.id.startsWith('crearComent_')){
        // Obtenemos el id del producto.
        var datos = {}
        datos.id = e.target.id.substring(12)
        //console.log(datos.id)
        
        // Insertamos el HTML en "crearComentario".
        document.getElementById("crearComentario").innerHTML = null
        var listaHTML = tmpl_crearComentario(datos)
        document.getElementById("crearComentario").innerHTML = listaHTML
    }

    // Si clickas en "crearEsta".
    if(e.target.id.startsWith('crearEsta')){
        // Quitamos el html de "crearComentario".
        document.getElementById("crearComentario").innerHTML = null
    }

    // Si clickas en "buttonCrear".
    if(e.target.id.startsWith('buttonCrear_')){
        // Obtenemos el id del producto y el mensaje para el comentario.
        var nuevo = {}
        var id = e.target.id.substring(12)
        nuevo.message = document.getElementById('mensaje').value
        
        // Si el mensaje es vacio, mando una alerta.
        if(nuevo.message == ""){
            alert('Debes poner algo para crearlo')
            return
        }
        
        // Pedimos crear el comentario.
        servicio_API.crearComentario(id, nuevo, token.getItem('token')).then(function(response){
            // Pedimos el producto.
            servicio_API.obtenerProducto(id).then(function(response){
                // Creamos un objeto JS con los datos que me da el API.
                var datos = {}
                for(var i in response.product)
                    datos = response.product[i];
                datos.comentarios = response.comments

                alert('Se ha creado correctamente')
                
                //console.log(datos)
                // Insertamos el HTML en "listComentarios".
                var listaHTML = tmpl_listaComentarios(datos)
                document.getElementById("listComentarios").innerHTML = listaHTML
            })
        })
    }

    // Si clickas en "editComent".
    if(e.target.id.startsWith('editComent_')){
        // Obtenemos el id del producto, el mensaje y el id del comentario.
        var res = e.target.id.split("_")
        var nuevo = {}
        nuevo.idComment = res[1]
        nuevo.idProduct = res[2]
        nuevo.message = res[3]
        //console.log(nuevo)
        
        // Insertamos el HTML en "editarComentario".
        document.getElementById("editarComentario").innerHTML = null
        var listaHTML = tmpl_editarComentario(nuevo)
        document.getElementById("editarComentario").innerHTML = listaHTML

        // Insertamos el mensaje antiguo en "newMensaje".
        document.getElementById("newMensaje").value = nuevo.message;
    }

    // Si clickas en "editarEsta".
    if(e.target.id.startsWith('editarEsta')){
        // Quitamos el html de "editarComentario".
        document.getElementById("editarComentario").innerHTML = null
    }

    // Si clickas en "buttonEditar".
    if(e.target.id.startsWith('buttonEditar_')){
        // Obtenemos el id del producto, comentario y el nuevo mensaje.
        var res = e.target.id.split("_")
        var nuevo = {}
        var idProduct = res[1]
        var idComment = res[2]
        nuevo.newMessage = document.getElementById('newMensaje').value
        
        // Pedimos editar el comentario.
        servicio_API.editarComentario(idProduct, idComment, nuevo, token.getItem('token')).then(function(response){
            // Pedimos el producto.
            servicio_API.obtenerProducto(idProduct).then(function(response){
                // Creamos un objeto JS con los datos que me da el API.
                var datos = {}
                for(var i in response.product)
                    datos = response.product[i];
                datos.comentarios = response.comments

                alert('Se ha editado correctamente')

                // Insertamos el HTML en "listComentarios"
                var listaHTML = tmpl_listaComentarios(datos)
                document.getElementById("listComentarios").innerHTML = listaHTML
            })
        })
    }
    // Si clickas en "borrComent".
    if(e.target.id.startsWith('borrComent_')){
        // Obtenemos el id del producto y el id del comentario.
        var res = e.target.id.split("_")
        var idComment = res[1]
        var idProduct = res[2]

        // Pedimos borrar el comentario.
        servicio_API.borrarComentario(idProduct, idComment, token.getItem('token')).then(function(res){
            //console.log(res)
            // Si se borra correctamente muestro una alerta.
            if(res){
                alert('Se ha borrado correctamente')
            }else{
                alert('Error')
                return
            }
            // Pedimos el producto.
            servicio_API.obtenerProducto(idProduct).then(function(response){
                // Creamos un objeto JS con los datos que me da el API.
                var datos = {}
                for(var i in response.product)
                    datos = response.product[i];
                datos.comentarios = response.comments
                
                // Insertamos el HTML en "listComentarios".
                var listaHTML = tmpl_listaComentarios(datos)
                document.getElementById("listComentarios").innerHTML = listaHTML
            })
	    })
    }
})

// Manejador de eventos para cuando se carga la página "listPedidos".
document.getElementById('listPedidos').addEventListener('click', function(e){
    // Si clickas en "verPed".
    if(e.target.id.startsWith('verPed_')){
        // Obtenemos el id del pedido.
        var idOrder = e.target.id.substring(7)
        //console.log(idOrder)

        // Pedimos el pedido.
        servicio_API.obtenerPedido(token.getItem('id'), idOrder, token.getItem('token')).then(function(response){
            // Creamos un objeto JS con los datos del pedido que me da el API.
            var datos = {}
            datos = response.linkProducts[0];
            if(datos.proceso  == 0){
                datos.proceso = "Pagar"
            }else{
                datos.proceso = "Pagado"
            }
            if(datos.tipo == 0){
                datos.tipo = "Compra"
            }else{
                datos.tipo = "Venta"
            }
            //console.log(datos)
            // Insertamos el HTML en "verPedido".
            var listaHTML = tmpl_verPedido(datos)
            document.getElementById("verPedido").innerHTML = listaHTML
        })
    }

    // Si clickas en "verEstaP".
    if(e.target.id.startsWith('verEstaP')){
        // Quitamos el html de "verPedido".
        document.getElementById("verPedido").innerHTML = null
    }

    // Si clickas en "editPed".
    if(e.target.id.startsWith('editPed_')){
        // Quitamos el html de "editarPedido".
        document.getElementById("editarPedido").innerHTML = null
        
        // Obtenemos el id del pedido y el tipo de estado.
        var res = e.target.id.split("_")
        var nuevo = {}
        nuevo.idOrder = res[1]
        nuevo.proceso = res[2]

        // Si el estado es "Pagado" devuelvo una alerta.
        if(nuevo.proceso == "Pagado"){
            alert('Ya has pagado este producto')
            return   
        }

        //console.log(nuevo)
        // Insertamos el HTML en "editarPedido".
        var listaHTML = tmpl_editarPedido(nuevo)
        document.getElementById("editarPedido").innerHTML = listaHTML
    }

    // Si clickas en "editarEstaP".
    if(e.target.id.startsWith('editarEstaP')){
        // Quitamos el html de "editarPedido".
        document.getElementById("editarPedido").innerHTML = null
    }

    // Si clickas en "editarEstaP".
    if(e.target.id.startsWith('buttonPagar_')){
        // Obtenemos el id del pedido.
        var idOrder = e.target.id.substring(12)
        //console.log(idOrder)
        // Pedimos pagar dicho pedido.
        servicio_API.pagar(token.getItem('id'), idOrder, token.getItem('token')).then(function(response){
            // Si devuelve false es que no queda stock y devuelvo una alerta.
            if(!response){
                alert('Ya no queda stock')
                return
            }
            // Pedimos la lista de pedidos de ese id de usuario logueado.
            servicio_API.obtenerPedidos(token.getItem('id'), token.getItem('token')).then(function(response){
                // Creamos un objeto JS con el nickname y la lista de pedidos que me da el API.
                var datos = {}
                datos.nick = token.getItem('nick')
                datos.pedidos = []
                
                for(var i in response.linkProducts){
                    datos.pedidos[i] = response.linkProducts[i];
                    // Cambiamos los 0 y 1 por Strings.
                    if(datos.pedidos[i].proceso  == 0){
                        datos.pedidos[i].proceso = "Pagar"
                    }else{
                        datos.pedidos[i].proceso = "Pagado"
                    }
                    if(datos.pedidos[i].tipo == 0){
                        datos.pedidos[i].tipo = "Compra"
                    }else{
                        datos.pedidos[i].tipo = "Venta"
                    }
                }
                //console.log(datos)
                alert('Se ha pagado correctamente')
                // Insertamos el HTML en "listPedidos".
                var listaHTML = tmpl_listaPedidos(datos)
                document.getElementById("listPedidos").innerHTML = listaHTML
            })
        })
    }
    // Si clickas en "borrPed".
    if(e.target.id.startsWith('borrPed_')){
        // Obtenemos el id del pedido.
        var idOrder = e.target.id.substring(8)
        //console.log(idOrder)
        
        // Pedimos borrar dicho pedido.
        servicio_API.borrarPedido(token.getItem('id'), idOrder, token.getItem('token')).then(function(res){
            //console.log(res)
            // Si se borra correctamente muestro una alerta.
            if(res){
                alert('Se borró correctamente')
            }else{
                alert('Error al borrar')
                return
            }
            // Pedimos la lista de pedidos de ese id de usuario logueado.
            servicio_API.obtenerPedidos(token.getItem('id'), token.getItem('token')).then(function(response){
                // Creamos un objeto JS con el nickname y la lista de pedidos que me da el API.
                var datos = {}
                datos.nick = token.getItem('nick')
                datos.pedidos = []
                
                for(var i in response.linkProducts){
                    datos.pedidos[i] = response.linkProducts[i];
                    // Cambiamos los 0 y 1 por Strings.
                    if(datos.pedidos[i].proceso  == 0){
                        datos.pedidos[i].proceso = "Pagar"
                    }else{
                        datos.pedidos[i].proceso = "Pagado"
                    }
                    if(datos.pedidos[i].tipo == 0){
                        datos.pedidos[i].tipo = "Compra"
                    }else{
                        datos.pedidos[i].tipo = "Venta"
                    }
                }
                //console.log(datos)
                // Insertamos el HTML en "listPedidos".
                var listaHTML = tmpl_listaPedidos(datos)
                document.getElementById("listPedidos").innerHTML = listaHTML
            })
	    })
    }
})
