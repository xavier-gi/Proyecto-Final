const productos = [
    { id: 1, nombre: 'Nevera de Alta Capacidad', precio: 799.99, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWZWtOFHRa6VwnrOOHW-LNTGqmgs0rHzntO9F1vQVhgg&s=10' },
    { id: 2, nombre: 'Televisor 4K Smart TV', precio: 449.99, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMGLsRF69WtX0YWk5MK08gGhOgkoWHRoZW_2nmCmfmMQ&s=10' },
    { id: 3, nombre: 'Cocina de Inducción', precio: 349.99, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFKHl8jdVO2_0gJfrH-IDTFFGklR5flwSDEzbxA5BdDg&s=10' },
    { id: 4, nombre: 'Microondas Digital', precio: 119.99, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYzNwzsx6ozN3IXYHQZ9DJNBiXti8eccU7k5LbY4-icQ&s=10' },
    { id: 5, nombre: 'Lavadora Automática', precio: 499.99, imagen: 'https://bodeguitadelahorro.com/wp-content/uploads/2024/05/Lavadora-Automatica-Indurama-LRI-22DGR.jpg' },
    { id: 6, nombre: 'Secadora de Carga Frontal', precio: 399.99, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROc8TlGw223Dx_M1yMU8mm4v-ao3Cul7iu-TUnJ3ihVw&s=10' }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosElectro')) || [];
let usuarioLogueadoId = localStorage.getItem('usuarioId') || null;

const verificarSesionUI = () => {
    const formReg = document.getElementById('formRegistro');
    const formLog = document.getElementById('formLogin');
    const btnLogout = document.getElementById('btnLogout');
    const msg = document.getElementById('msgRegistro');

    if (usuarioLogueadoId) {
        const usuario = usuariosRegistrados.find(u => u.correo === usuarioLogueadoId);
        msg.style.color = 'var(--success)';
        msg.innerText = `Sesión activa: Bienvenido, ${usuario ? usuario.nombre : 'Usuario'}.`;
        formReg.style.display = 'none';
        formLog.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'block';
    } else {
        formReg.style.display = 'flex';
        formLog.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'none';
    }
};

window.alternarFormulario = (tipo) => {
    if (usuarioLogueadoId) return;
    
    const formReg = document.getElementById('formRegistro');
    const formLog = document.getElementById('formLogin');
    const tabReg = document.getElementById('tabRegistro');
    const tabLog = document.getElementById('tabLogin');
    const msg = document.getElementById('msgRegistro');

    msg.innerText = '';
    if (tipo === 'registro') {
        formReg.style.display = 'flex';
        formLog.style.display = 'none';
        tabReg.style.opacity = '1';
        tabLog.style.opacity = '0.4';
    } else {
        formReg.style.display = 'none';
        formLog.style.display = 'flex';
        tabReg.style.opacity = '0.4';
        tabLog.style.opacity = '1';
    }
};

const renderizarCatalogo = () => {
    const catalogoDiv = document.getElementById('catalogo');
    catalogoDiv.innerHTML = productos.map(p => `
        <div class="product-card">
            <img src="${p.imagen}" alt="${p.nombre}" class="product-img">
            <h3>${p.nombre}</h3>
            <p class="price-tag">$${p.precio.toFixed(2)}</p>
            <button class="btn btn-success" onclick="agregarAlCarrito(${p.id})">Añadir al carrito</button>
        </div>
    `).join('');
};

document.getElementById('formRegistro').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('regNombre').value.trim();
    const correo = document.getElementById('regCorreo').value.trim();
    const contrasena = document.getElementById('regContrasena').value;

    if (nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres.');
        return;
    }

    const existe = usuariosRegistrados.some(u => u.correo === correo);
    if (existe) {
        document.getElementById('msgRegistro').style.color = 'var(--danger)';
        document.getElementById('msgRegistro').innerText = 'El correo ya está registrado.';
        return;
    }

    usuariosRegistrados.push({ nombre, correo, contrasena });
    localStorage.setItem('usuariosElectro', JSON.stringify(usuariosRegistrados));

    usuarioLogueadoId = correo;
    localStorage.setItem('usuarioId', usuarioLogueadoId);

    document.getElementById('formRegistro').reset();
    verificarSesionUI();
});

document.getElementById('formLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    const correo = document.getElementById('loginCorreo').value.trim();
    const contrasena = document.getElementById('loginContrasena').value;

    const usuario = usuariosRegistrados.find(u => u.correo === correo && u.contrasena === contrasena);

    if (usuario) {
        usuarioLogueadoId = correo;
        localStorage.setItem('usuarioId', usuarioLogueadoId);
        document.getElementById('formLogin').reset();
        verificarSesionUI();
    } else {
        document.getElementById('msgRegistro').style.color = 'var(--danger)';
        document.getElementById('msgRegistro').innerText = 'Credenciales incorrectas o usuario no registrado.';
    }
});

const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        usuarioLogueadoId = null;
        localStorage.removeItem('usuarioId');
        document.getElementById('msgRegistro').innerText = '';
        verificarSesionUI();
    });
}

window.agregarAlCarrito = (id) => {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }
    actualizarInterfazCarrito();
};

window.eliminarDelCarrito = (id) => {
    const itemExistente = carrito.find(item => item.id === id);
    if (!itemExistente) return;

    if (itemExistente.cantidad > 1) {
        itemExistente.cantidad -= 1;
    } else {
        carrito = carrito.filter(item => item.id !== id);
    }
    actualizarInterfazCarrito();
};

function actualizarInterfazCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    const contenedor = document.getElementById('contenidoCarrito');
    const totalSpan = document.getElementById('totalCarrito');
    
    if (carrito.length === 0) {
        contenedor.innerHTML = 'El carrito está vacío.';
        totalSpan.innerText = '0.00';
        return;
    }

    let total = 0;
    const itemsHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="cart-item">
                <span>${item.nombre} <strong>(x${item.cantidad})</strong> - <strong>$${subtotal.toFixed(2)}</strong></span>
                <button class="btn btn-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = itemsHTML;
    totalSpan.innerText = total.toFixed(2);
}

document.getElementById('btnFinalizar').addEventListener('click', () => {
    if (!usuarioLogueadoId) {
        alert('Debes registrarte o iniciar sesión antes de finalizar una compra.');
        return;
    }
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    
    const numeroPedido = Math.floor(Math.random() * 90000) + 10000;
    alert(`¡Compra procesada con éxito localmente! ID Pedido: #EL-${numeroPedido}`);
    
    carrito = [];
    actualizarInterfazCarrito();
});

renderizarCatalogo();
actualizarInterfazCarrito();
verificarSesionUI();
