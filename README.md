# Aplicación de Gestión de Tiempo

Una aplicación moderna de gestión de tiempo construida con Next.js, TypeScript y ShadCN UI.

## Características

- Gestión de Tareas (Crear, Actualizar, Eliminar)
- Seguimiento de Tiempo con funcionalidad de Inicio/Pausa
- Estadísticas Diarias
- Almacenamiento Persistente usando Local Storage
- Interfaz de Usuario Simple

## Comenzar

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Ejecutar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Stack Tecnológico

- Next.js 14
- TypeScript
- ShadCN UI
- Tailwind CSS
- Zustand para Gestión de Estado
- React Hook Form + Zod para Validación de Formularios
- Date-fns para Manipulación de Fechas

## Estructura del Proyecto

- `/components` - Componentes de React
- `/lib` - Funciones de utilidad y store
- `/types` - Definiciones de tipos TypeScript
- `/app` - Páginas del router de Next.js

# Capturas de pantalla

### Vista principal

![Descripción de la imagen](/public/panel-de-control-cero.png)

### Pos agregado de tarea y puesto el reloj a correr

![Descripción de la imagen](/public/panel-de-control-uno.png)
