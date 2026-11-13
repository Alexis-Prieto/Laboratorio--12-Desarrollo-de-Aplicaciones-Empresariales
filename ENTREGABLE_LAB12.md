# Laboratorio 12 extra: Servicios web con React

**Curso:** Desarrollo de Aplicaciones Empresariales  
**Alumno:** Alexis Prieto Huiza  
**Docente:** no especificado  
**Semana:** 12  
**Fecha:** 13 de noviembre de 2026  
**Modalidad:** individual

## Índice

Entorno · Procedimiento (18 pasos) · Fallos de IA · Preguntas de revisión · Uso de IA · Pantalla y evidencia · Decisiones · Supuestos · Conclusiones · Capturas.

## Entorno

Node v22.17.1 verificado; dependencias declaradas: React 19, Vite 7, Vitest 3.2 y Axios 1. Las versiones exactas instaladas de todas las dependencias no se verificaron.

## Procedimiento

1. **Estado inicial.** El enunciado informa 46 pruebas fallidas y 21 aprobadas; no se volvió a observar ese resultado. No se capturó la pantalla inicial.
2. **Simuladores.** `fakeNetwork.js` implementa un adaptador Axios con demoras, errores, cancelación y CORS; `fakeApi.js` simula el contrato CRUD y validaciones; `cors.js` modela la autorización de orígenes. Las rutas llevan barra final porque el contrato del servidor simulado la exige: sin ella responde 404. Un origen comprende esquema, host y puerto: los puertos 5173 y 8000 producen orígenes distintos. Una lista vacía no autoriza la aplicación.
3. **API.** `api.js` centraliza la dirección y transforma las respuestas en `response.data`, para que las pantallas usen directamente los datos; admite señal de cancelación y traduce errores. En la ejecución previa pasaron 14 aserciones, pero Vitest detectó un rechazo no manejado durante la prueba de cancelación.
4. **CORS.** Se autorizó únicamente `http://localhost:5173`; `npm.cmd test -- cors --run`: 8 pruebas aprobadas. El comodín no es compatible con respuestas de solicitudes con credenciales en el navegador.
5. **Estados.** El hook expone carga, datos y error; las pantallas no se verificaron manualmente.
6. **Cancelación.** El efecto usa `AbortController` y una bandera `cancelled`. Línea de tiempo: petición A lenta → limpieza y aborto → petición B rápida → B actualiza; A no puede sobrescribirla. En StrictMode de desarrollo React ejecuta montaje, limpieza y montaje para detectar efectos inseguros; sobrevive la segunda petición.
7. **Acciones.** El hook actualiza el estado tras la confirmación del servidor y usa referencias para impedir duplicados. La referencia cambia inmediatamente, sin esperar otra renderización. En el turno anterior las 18 pruebas del hook pasaron.
8. **Errores visuales.** No se ejecutaron las demostraciones en navegador ni se generaron capturas. La red simulada permite provocar desconexión, HTTP 500 y bloqueo de CORS; una validación de título vacío devuelve 400.
9. **Suite completa.** `npm.cmd test -- --run`: 67 pruebas aprobadas en 6 archivos, pero también un rechazo no manejado por cancelación; no se considera una ejecución limpia ni verde.

   ### Nota sobre el resultado de la suite

   La suite registró **67/67 pruebas aprobadas**, pero Vitest también reportó **1 rechazo no manejado (`CanceledError`)** asociado a la prueba `listExams entrega la señal a Axios: al abortar, la petición se cancela`. Que Axios rechace la petición al abortarla es esperado; que ese rechazo quede temporalmente sin manejar es lo que Vitest señala como error. Por ello, las aserciones aprobadas no equivalen a una ejecución completamente limpia.

   En `src/test/api.test.js`, la prueba aborta la petición en la línea 55 y conecta la aserción de rechazo después de `await settle()`, en la línea 58. Durante ese intervalo, Vitest detecta la promesa rechazada como no manejada.

   **Corrección posible (no aplicada):** conectar la aserción antes de abortar. El enunciado prohíbe modificar `src/test/`, por lo que se registra esta limitación sin modificar la prueba.

10. **IA inicial.** `npm.cmd run test:ai -- --run`: 42 aprobadas y 25 fallidas, en 5 archivos de pruebas fallidos de 6.
11. **Clasificación.** Véase la tabla siguiente: las 25 pruebas fallidas no equivalen necesariamente a 25 defectos independientes.
12. **Preguntas de revisión.** Véase la sección correspondiente. No se leyó el archivo renombrado del contrato, conforme a la solicitud; las preguntas proceden del enunciado.
13. **Corrección de IA.** Se ajustaron la señal en `api.js`, la política en `cors.js` y el hook. No se ejecutó la suite tras cada defecto ni se guardó un commit inicial. Después, 67 pruebas aprobadas, pero un rechazo no manejado; no se puede afirmar éxito completo.
14. **Cliente sin pantalla.** Resultados de los comandos ejecutados, proporcionados por el alumno:

| Comando | Salida | Código de salida |
|---|---|---|
| `node cli/examctl.mjs list --json` | Lista de 6 exámenes | 0 |
| `node cli/examctl.mjs create "Examen final" --json` | Creado 7: Examen final | 0 |
| `node cli/examctl.mjs delete 3 --yes` | Eliminado 3 | 0 |
| `node cli/examctl.mjs delete 4` | Pide confirmación (repite con `--yes`) | 8 |
| `node cli/examctl.mjs create "" --json` | Datos no válidos. title: Este campo no puede estar en blanco. | 4 |
| `node cli/examctl.mjs delete 999 --yes` | No existe en el servidor. | 5 |

En modo JSON, los datos legibles por máquina van a stdout y los errores a stderr. El código de salida permite a un agente decidir si continúa, reintenta o informa del fallo. Las salidas normales no JSON también usan stdout.

15. **Comprobación CORS.** Resultados de las ejecuciones proporcionados por el alumno:

| Comando | Salida | Código |
|---|---|---|
| `node cli/examctl.mjs cors-check --origin http://localhost:5173` | `Access-Control-Allow-Origin = http://localhost:5173` | 0 |
| `node cli/examctl.mjs cors-check --origin https://sitio-malo.example` | `(ausente: el navegador lo bloquea)` | 7 |
| `node cli/fake-api.mjs --wildcard` + `cors-check --origin https://sitio-malo.example` | `Access-Control-Allow-Origin = *` | 9 |

El código 0 indica que se autorizó el origen solicitado; 7, que no se autorizó; y 9, que se detectó un comodín. El comodín permite que páginas de cualquier origen lean la respuesta cuando la solicitud no usa credenciales, pero es un fallo para este ejercicio porque concede un acceso más amplio del necesario. Además, los navegadores rechazan `Access-Control-Allow-Origin: *` cuando la solicitud incluye credenciales.

16. **Uso de un agente de IA bajo AGENTS.md.** Se pidió al agente revisar `src/client/api.js` bajo las cuatro preguntas de `AGENTS.md`, sin modificar el archivo.

| Pregunta | Resultado | Evidencia en `src/client/api.js` |
|---|---|---|
| ¿La petición se cancela y una respuesta vieja no pisa a la nueva? | Parcial; no demostrado por completo. | Las líneas 10–11 reciben `signal` y la pasan a Axios. No crean ni abortan el controlador, ni comprueban si la respuesta sigue vigente. |
| ¿Se resuelven los tres estados y el error se ve en pantalla? | No se puede determinar con este archivo. | Las líneas 24–40 traducen errores, pero no gestionan los estados de carga ni muestran la interfaz. |
| ¿El envío y el borrado no pueden dispararse dos veces y la lista refleja el cambio? | No se puede determinar con este archivo. | Las líneas 15–21 ejecutan POST y DELETE; no contienen guardas ni actualizan la lista visible. |
| ¿Los orígenes de CORS son los justos? | No se puede determinar con este archivo. | La línea 3 define la dirección base de la API, no una política de orígenes CORS. |

**Conclusión:** el archivo aporta mecanismos para algunas preguntas, pero por sí solo no demuestra el cumplimiento completo. Lo que no puede comprobarse con este archivo cuenta como «no» hasta revisar la evidencia restante.

**Alcance de la sesión:** se revisó un solo archivo, no se modificaron archivos y no se ejecutaron pruebas.
17. **Pantalla.** Véase la sección específica.
18. **Entrega.** Se realizó el commit del proyecto y se subió al repositorio de GitHub. El entregable fue subido al campus virtual.

## Tabla de fallos de la IA

Las líneas corresponden a las versiones originales leídas antes de la corrección.

| Hallazgo | Archivo y línea original | Prueba o síntoma | Causa | ¿Visible a mano? |
|---|---|---|---|---|
| Sin cancelación ni control de carrera | `src/ai/useExams.js:11–23`, `src/ai/api.js:11–12` | Pruebas de desmontaje, reload y StrictMode | No se pasa señal ni se limpian efectos | Sí, bajo carrera o desmontaje |
| Error oculto | `src/ai/useExams.js:18–22` | Pruebas de error de carga | Se presenta `ready` con lista vacía | Sí, parece lista vacía |
| Doble envío | `src/ai/useExams.js:35–46` | Pruebas de POST duplicado y saving | Sin guarda ni estado de guardado | Sí, al enviar rápidamente |
| Lista no actualizada al borrar | `src/ai/useExams.js:27–33` | Pruebas de borrado | No actualiza estado tras DELETE y oculta errores | Sí, permanece la fila |
| CORS abierto | `src/ai/cors.js:2` | Pruebas de origen ajeno y comodín | Se permite cualquier origen | No necesariamente en la pantalla local |

## Análisis de las cuatro preguntas

1. Cancelación y carrera: `src/client/useExams.js:33–55` aborta e ignora la respuesta anterior.
2. Tres estados y error: `src/client/useExams.js:24–27, 36–49` gestiona estado y mensaje; la representación visual no se comprobó en esta ejecución.
3. Doble acción y lista: `src/client/useExams.js:61–93` protege altas y borrados repetidos por identificador y modifica el estado tras confirmación.
4. Orígenes: `src/client/cors.js:8–10` contiene solo el origen local especificado.

## Tabla de uso de IA

| Solicitud | Resultado | Verificación | Limitación |
|---|---|---|---|
| Implementar API | Cliente Axios | 14 aserciones aprobadas | Rechazo no manejado en Vitest |
| Implementar hook | Estados, cancelación y acciones | 18 pruebas aprobadas | No sustituye revisión manual |
| Completar laboratorio | Política y correcciones de IA | 67 aserciones por modalidad | Error no manejado; no se verificó paso 16 bajo el contrato |

## ¿Por qué la pantalla puede mentir?

* Una lista vacía con servidor apagado puede ocultar un error; lo detecta la prueba de error de conexión o `examctl list` sin servidor.
* Una respuesta lenta puede pisar datos recientes; lo detecta la prueba de carrera del hook.
* Una fila puede persistir tras borrar en el servidor; lo detecta la prueba de borrado o una consulta posterior con `examctl list`.

## Decisiones de diseño y supuestos

Se reutiliza la implementación simulada de `checkCors`; los componentes consumen el cliente centralizado. `useRef` proporciona guardas inmediatas. El origen local indicado es el único autorizado; no se habilitan credenciales. Se supone que los comandos de CLI se ejecutarán con su servidor local activo. No se infiere el nombre del docente ni se inventan resultados, capturas o permisos.

## Conclusiones

1. Centralizar Axios reduce la dispersión de direcciones.
2. La cancelación y la protección contra carreras son complementarias.
3. Los errores deben distinguirse de una lista vacía.
4. Una política CORS debe limitar los orígenes.
5. Las aserciones aprobadas no bastan cuando el ejecutor informa errores no manejados.

## Anexo — Capturas

Las siguientes 16 capturas están pendientes; no fueron generadas ni verificadas.

1. Pantalla inicial de carga.
2. Pruebas iniciales.
3. Pruebas de API.
4. Pruebas de CORS.
5. Pantalla con datos.
6. Error de servidor apagado.
7. Error HTTP 500.
8. Error CORS.
9. Suite completa.
10. Suite IA inicial.
11. Tabla de fallos de IA.
12. Suite IA posterior.
13. Comandos list, create y delete.
14. Errores de examctl.
15. Comprobaciones CORS.
16. Estructura en VS Code.