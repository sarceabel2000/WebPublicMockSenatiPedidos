const URL = "https://8d28-2803-a3e0-1354-2fe0-b97e-a107-d39-8f5c.ngrok-free.app/pedidos";

// Helper para formatear fechas
function formatearFecha(fecha) {
  return fecha ? new Date(fecha).toISOString().split("T")[0] : 'N/A';
}

function cargarPedidos(filtros = {}) {
  console.log('🔍 Intentando cargar pedidos con filtros:', filtros);
  console.log('🌐 URL de la API:', URL);
  
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "abcd1234",
      "Authorization": "Bearer aD96N5kO1eNRM49pO2UwLTjA6Tz25mISjZ2VLYQjq7M0H1CsVP9tS7w7ki0GgTcg",
    },
    body: JSON.stringify(filtros)
  })
  .then(response => {
    console.log('📡 Status:', response.status);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
  })
  .then(pedidos => {
    console.log('✅ Datos recibidos:', pedidos);
    const tbody = document.querySelector('#tabla tbody');
    tbody.innerHTML = "";

    if (!Array.isArray(pedidos)) {
      mostrarMensajeError('Los datos recibidos no tienen el formato esperado');
      return;
    }

    if (pedidos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No se encontraron pedidos</td></tr>';
      return;
    }

    pedidos.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.number || 'N/A'}</td>
        <td>${p.type || 'N/A'}</td>
        <td>${p.warehouse || 'N/A'}</td>
        <td>${p.warehouseDrc || 'N/A'}</td>
        <td>${p.warehouseDest || 'N/A'}</td>
        <td>${formatearFecha(p.orderDate)}</td>
        <td>${formatearFecha(p.lmDate)}</td>
        <td>${p.products?.length || 0}</td>
        <td><button class="btnDetalle" onclick='mostrarDetalle(${JSON.stringify(p)})'>Ver Detalle</button></td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('❌ Error al cargar pedidos:', error);
  });
}

function mostrarDetalle(pedido) {
  document.getElementById('modalDetalle').classList.remove('hidden');
  document.getElementById('tituloPedido').innerText = `Detalle del Pedido ${pedido.number || 'N/A'}`;
  document.getElementById('infoPedido').innerHTML = `
    
    <p><strong>Tipo:</strong> ${pedido.type}</p>
    <p><strong>Almacén Origen:</strong> ${pedido.warehouse}</p>
    <p><strong>Almacén Drc:</strong> ${pedido.warehouseDrc}</p>
    <p><strong>Almacén Destino:</strong> ${pedido.warehouseDest}</p>
    <p><strong>Fecha Solicitud:</strong> ${new Date(pedido.orderDate).toLocaleDateString()}</p>
    <p><strong>Última Modificación:</strong> ${new Date(pedido.lmDate).toLocaleDateString()}</p>
  `;

  const tbody = document.getElementById('detalleProductos');
  tbody.innerHTML = "";

  pedido.products?.forEach((prod, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${prod.line || ''}</td>
      <td>${prod.sku || ''}</td>
      <td>${prod.description || ''}</td>
      <td>${prod.description2 || ''}</td>
      <td>${prod.um || ''}</td>
      <td>${prod.location || ''}</td>
      <td>${prod.measureUnit || ''}</td>
      <td>${prod.status || ''}</td>
      <td>${prod.lastStatus || ''}</td>
      <td>${prod.quantityOrdered || ''}</td>
      <td>${prod.quantitySent || ''}</td>
      <td>${prod.sheetNumber || ''}</td>
      <td>${prod.referenceUser || ''}</td>
      <td>${prod.initiatorTransaction || ''}</td>
      <td>${prod.userId || ''}</td>
    `;
    tbody.appendChild(row);
  });
}

function probarConexion() {
  cargarPedidos();
}

function mostrarMensajeError(mensaje) {
  console.error('Error:', mensaje);
  const tbody = document.querySelector('#tabla tbody');
  tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #e57373;">${mensaje}</td></tr>`;
}

// Función para sincronizar el scroll horizontal entre header y body
function sincronizarScrollHorizontal() {
  const tablaHeader = document.getElementById('tablaHeader');
  const tablaBody = document.getElementById('tablaBody');
  
  tablaBody.addEventListener('scroll', function() {
    tablaHeader.scrollLeft = tablaBody.scrollLeft;
  });
  
  tablaHeader.addEventListener('scroll', function() {
    tablaBody.scrollLeft = tablaHeader.scrollLeft;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  sincronizarScrollHorizontal();
  
  document.getElementById("cerrarModal").addEventListener("click", () => {
    document.getElementById('modalDetalle').classList.add('hidden');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.getElementById('modalDetalle').classList.add('hidden');
    }
  });

  document.getElementById('modalDetalle').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.add('hidden');
    }
  });

  document.getElementById("formFiltros").addEventListener("submit", e => {
    e.preventDefault();
    const filtros = {
      number: document.getElementById("filtroNumber").value,
      type: document.getElementById("filtroType").value,
      warehouse: document.getElementById("filtroWarehouse").value,
      orderDate: document.getElementById("filtroOrderDate").value,
      minProductos: parseInt(document.getElementById("filtroMinProductos").value) || 0,
      maxProductos: parseInt(document.getElementById("filtroMaxProductos").value) || 0,
    };
    cargarPedidos(filtros);
  });

  // Si quieres cargar de una vez los pedidos al abrir la página, descomenta esto:
  // cargarPedidos();
});

