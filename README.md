# Laboratorio 12 EXTRA — Servicios web con React

**Curso:** Desarrollo de Aplicaciones Empresariales (DAE)  
**Institución:** TECSUP  
**Alumno:** Alexis Prieto Huiza  
**Semana:** 12  
**Modalidad:** Trabajo individual

---

## Descripción

Repositorio del laboratorio extra de la semana 12 de Desarrollo de Aplicaciones Empresariales (DAE). La pantalla de cuestionarios de React consume la API del curso (la de la semana 8) con Axios: lista, crea y elimina. Faltan tres piezas que escribes tú, contra pruebas: el módulo cliente de la API, la política de CORS y el hook del listado. Después revisas las mismas tres piezas «escritas por una IA»: se ven bien, compilan y tienen cinco fallos típicos. Además hay un cliente sin pantalla (`examctl`) que llama a la misma API desde la terminal.

Todo es local: no hace falta Django. La red es simulada (un adaptador de Axios en `src/lib/`), con retardo, con un servidor que se puede «apagar» y con la comprobación de CORS que haría el navegador.

---

## Puesta en marcha

Necesitas **Node 20.19** o superior (o Node 22.12 o superior): `node -v`. En PowerShell:

```powershell
npm install
npm run dev        # abre http://localhost:5173; déjalo corriendo