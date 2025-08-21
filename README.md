# Prueba Técnica - ConQuito

- Nombre: Bryan Paul Delgado
- Profesión: Tecnólogo en Desarrollo de Software
- Fecha: 20/08/2025

## Criterios de evaluación
- Validaciones: deben implementarse en el frontend. (En un entorno real lo correcto sería validarlas en el backend, pero para fines de este ejercicio se prioriza el frontend).
- Código limpio y estructurado: aplicación de buenas prácticas en la organización de componentes, servicios y consumo de API.
- Dashboard funcional: con gráficos claros, dinámicos e interactivos que permitan aplicar filtros.
- Diseño y usabilidad: interfaz moderna, intuitiva y de fácil navegación.

## Tecnologías Empleadas
- _Backend_: ExpressJS + PUG Template Views
- _Frontend_: React + ShadeCDN/UI
- _Database_: PostgreSQL

## Estructura del Proyecto
El proyecto se compone de dos directorios, cada uno contiene los diferentes apartados del sistema con sus respectivas librerías y controles de versiones internos.


## Uso del proyecto
En un IDE o editor de código será necesario emplear dos ventanas, una para el frontend y otra pra el backend.

1. Instalación de librerías
> <code> npm install </code>

2. Moverse entre componentes
> <code> cd {nombre_directorio} </code>

3. Inicializar backend
> <code> npm run start </code>

4. Inicializar fronted
> <code> ng serve </code>

## Importante
Para inicializar el backend será necesario crear un archivo .env, el cual contendrá las credenciales de usuario de la base de datos Postgress. Debe escribirse tal y como en el <code>env.example</code>.