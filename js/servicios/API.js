// Clase API con diferentes métodos para las distintas peticiones del cliente a la API.
export class API  {

    // Constructor donde le paso la URL con el puerto donde se encuentra la API.
    constructor(url) {
        this.API_URL = url
    }

    // Petición para loguearse.
    login(json){
        return fetch(this.API_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(json)
        })
    }

    // Petición para obtener la lista de los productos.
    obtenerProductos() {
        return fetch(this.API_URL + '/products')
        .then(function(response) {
            if (response.ok)
                return response.json()
        })
    }

    // Petición para obtener los datos y sus comentarios de un producto en específico.
    obtenerProducto(id) {
        return fetch(this.API_URL + "/products/" + id)
        .then(function(response) {
            if (response.ok)
                return response.json()
        })
    }

    // Petición para crear un comentario en dicho producto.
    crearComentario(idProduct, json, token){
        return fetch(this.API_URL + '/products/' + idProduct + '/comments', {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify(json)
        }).then(function (respuesta) {
            console.log(respuesta)
            if (respuesta.ok)
               return respuesta.json()
        })
    }

    // Petición para borrar un comentario de dicho producto.
    borrarComentario(idProduct, idComment, token){
        return fetch(this.API_URL + '/products/' + idProduct + '/comments/' + idComment, {
            method: 'DELETE',
            headers: {
                'Content-type':'application/json',
                'Authorization': token
            }
        }).then(function(respuesta) {
            if (respuesta.status == 200)
                return true
            else
                return false
        })
    }

    // Petición para editar un comentario de dicho producto.
    editarComentario(idProduct, idComment, json, token){
        return fetch(this.API_URL + '/products/' + idProduct + '/comments/' + idComment, {
            method: 'PUT',
            headers: {
                'Content-type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify(json)
        }).then(function(respuesta) {
            if (respuesta.ok)
               return respuesta.json()
        })
    }

    // Petición para obtener la lista de pedidos del usuario logueado.
    obtenerPedidos(idUser, token){
        return fetch(this.API_URL + '/users/' + idUser + '/orders', {
            headers: {
                'Authorization': token
            },
        }).then(function(response) {
                return response.json()
        })
    }

    // Petición para obtener los datos de un pedido del usuario logueado.
    obtenerPedido(idUser, idOrder, token){
        return fetch(this.API_URL + '/users/' + idUser + '/orders/' + idOrder, {
            headers: {
                'Authorization': token
            },
        })
        .then(function(response) {
            return response.json()
        })
    }

    // Petición para crear un pedido dependiendo del tipo para el usuario logueado.
    crearPedido(idProduct, type, token){
        return fetch(this.API_URL + '/products/' + idProduct + '/orders/' + type, {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
                'Authorization': token
            },
        }).then(function (respuesta) {
            //console.log(respuesta)
            if (respuesta.status != 201)
                return false
            else
                return true
        })
    }

    // Petición para editar un pedido del usuario logueado para pasarlo a "Pagado".
    pagar(idUser, idOrder, token){
        return fetch(this.API_URL + '/users/' + idUser + '/orders/' + idOrder, {
            method: 'PUT',
            headers: {
                'Content-type':'application/json',
                'Authorization': token
            }
        }).then(function(respuesta) {
            //console.log(respuesta)
            if (respuesta.status != 200)
                return false
            else
                return true
        })
    }

    // Petición para borrar un pedido del usuario logueado.
    borrarPedido(idUser, idOrder, token){
        return fetch(this.API_URL + '/users/' + idUser + '/orders/' + idOrder, {
            method: 'DELETE',
            headers: {
                'Content-type':'application/json',
                'Authorization': token
            }
        }).then(function(respuesta) {
            if (respuesta.status == 200)
                return true
            else
                return false
        })
    }
}