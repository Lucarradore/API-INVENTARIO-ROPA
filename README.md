# API Pilar Tecno — Inventario de Merch

API REST del proyecto de merch de Pilar Tecno. Administra los productos del catálogo y su stock, con persistencia en MongoDB. El frontend React consume estos endpoints mediante servicios Axios.

## Tecnologías y requisitos

- Node.js 20.19 o superior compatible con las dependencias y npm.
- Express 5, Mongoose 9 y CORS.
- MongoDB local o una instancia remota accesible.
- Nodemon para desarrollo.

## Instalación y ejecución local

Desde la carpeta `API-PILAR-TECNO`:

```powershell
npm install
Copy-Item .env.example .env
```

Configurar `.env` según el entorno:

```dotenv
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/inventarioRopa
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174
```

Iniciar MongoDB antes de ejecutar la API:

```powershell
npm run dev
```

Para ejecutar sin Nodemon:

```powershell
npm start
```

La API comienza a escuchar después de conectarse a MongoDB. La dirección local por defecto es `http://localhost:3000`.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto HTTP; por defecto `3000`. |
| `MONGODB_URI` | Conexión a MongoDB; por defecto `mongodb://127.0.0.1:27017/inventarioRopa`. |
| `CORS_ORIGINS` | Orígenes permitidos separados por comas, sin barra final. |

Sin `CORS_ORIGINS`, se permiten los orígenes HTTP de localhost y 127.0.0.1 en los puertos 3000, 5173 y 5174. Las solicitudes sin encabezado Origin también se admiten. Un origen rechazado recibe 403. Las solicitudes OPTIONS permitidas se responden automáticamente con 204.

No subir credenciales de MongoDB al repositorio.

## Organización

```text
config/
├── db.js                        Conexión a MongoDB
└── corsOption.js                Configuración de CORS
controllers/
└── ProductosController.js       ABM y operaciones de negocio
middlewares/
├── validarProducto.js           Validación del cuerpo e identificadores
└── errorHandler.js              Respuestas de error
models/
└── Producto.js                  Esquema Mongoose
routes/
└── Productos.js                 Rutas del recurso
server.js                        Configuración e inicio de Express
.env.example                     Ejemplo de configuración
```

## Recurso Producto

| Campo | Tipo | Condiciones |
| --- | --- | --- |
| `_id` | String ObjectId | Generado por MongoDB. |
| `nombre` | String | Obligatorio al crear; no admite solo espacios. |
| `descripcion` | String | Opcional. |
| `precio` | Number | Obligatorio al crear, finito y no negativo. |
| `cantidad` | Number | Obligatorio al crear, entero y no negativo. |
| `categoria` | String | Opcional; se consulta por coincidencia exacta. |
| `fechaIngreso` | Date | Generada por el servidor; serializada como fecha ISO en JSON. |

Los cuerpos de creación y edición solo aceptan `nombre`, `descripcion`, `precio`, `cantidad` y `categoria`. No enviar `_id` ni `fechaIngreso`; se rechazan campos desconocidos y cuerpos vacíos. En edición se actualizan únicamente los campos enviados.

Ejemplo de creación:

```json
{
  "nombre": "Remera Pilar Tecno",
  "descripcion": "Remera de la comunidad",
  "precio": 15000,
  "cantidad": 10,
  "categoria": "Remeras"
}
```

## Endpoints

Todas las rutas son relativas a la URL base de la API.

| Método | Ruta | Respuesta correcta |
| --- | --- | --- |
| GET | `/health` | 200: `{"status":"ok"}`. |
| GET | `/productos` | 200: lista de productos. |
| POST | `/productos` | 201: producto creado. |
| GET | `/productos/:id` | 200: producto encontrado. |
| PUT | `/productos/:id` | 200: producto actualizado. |
| DELETE | `/productos/:id` | 204: sin cuerpo. |
| GET | `/productos/categoria/:categoria` | 200: productos de la categoría exacta. |
| GET | `/productos/bajo-stock/:cantidad` | 200: productos con cantidad menor al límite. |
| PUT | `/productos/actualizar-stock` | 200: mensaje de confirmación. |

Las consultas de listado devuelven `[]` cuando no hay coincidencias. Los identificadores deben ser ObjectId válidos; un ID válido sin producto asociado devuelve 404.

### Consultas de negocio

- **Categoría:** por ejemplo, `GET /productos/categoria/Remeras`. Codificar la categoría en la URL si incluye caracteres especiales.
- **Bajo stock:** por ejemplo, `GET /productos/bajo-stock/5` devuelve cantidades menores a 5; no incluye productos con cantidad 5. El límite debe ser un entero seguro no negativo.
- **Actualizar stock:** recibe una lista no vacía de identificadores y cantidades. Cada cantidad reemplaza el stock actual; no se suma ni se resta.

Cuerpo de `PUT /productos/actualizar-stock` — reemplazar el ID por uno existente:

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "cantidad": 5
  }
]
```

Respuesta:

```json
{"mensaje":"Stock actualizado correctamente"}
```

Se validan identificadores, cantidades enteras no negativas, IDs repetidos y existencia de los productos antes de escribir. La operación sobre varios productos no utiliza una transacción.

## Errores

El formato de respuesta es:

```json
{"mensaje":"Descripción del error"}
```

| Estado | Significado |
| --- | --- |
| 400 | Datos, identificador, JSON o validaciones inválidas. |
| 403 | Origen no permitido por CORS. |
| 404 | Producto o ruta inexistente. |
| 409 | Conflicto de clave duplicada, si MongoDB lo informa. |
| 413 | Cuerpo que supera el límite de 100 KB. |
| 500 | Error interno; no expone el detalle al cliente. |

## Conexión con el frontend

En `landing-pilar-tecno/.env.local`:

```dotenv
VITE_API_URL=http://localhost:3000
```

Reiniciar Vite luego de modificar la variable. El frontend centraliza Axios en `src/services/productos.ts` y el tipado en `src/types/Producto.ts`; las llamadas no se realizan directamente desde los componentes.

La interfaz implementa creación y edición con Formik/Yup, listado, eliminación con confirmación, filtros por categoría y bajo stock, y actualización de stock. React Router organiza la navegación entre inicio, catálogo y contacto.

## Comprobación rápida

Con la API iniciada:

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod http://localhost:3000/productos
Invoke-RestMethod http://localhost:3000/productos/bajo-stock/5
```

Para comprobar el flujo completo desde la interfaz, crear un producto temporal, editarlo, consultar su categoría y bajo stock, actualizar su cantidad y eliminarlo mediante el modal de confirmación.

El proyecto no define un comando `npm test`. Los comandos disponibles son `npm run dev` y `npm start`.

## Alcance

Esta entrega incluye catálogo, ABM y operaciones de inventario. No incluye autenticación, autorización ni rutas privadas: los endpoints de escritura son públicos. Tampoco implementa carrito, pagos o pedidos.
