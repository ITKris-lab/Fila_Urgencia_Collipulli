# Fila Urgencia Collipulli

Sistema de monitoreo en tiempo real de la demanda asistencial en la Unidad de Emergencia Hospitalaria (UEH) del Hospital de Collipulli. Esta aplicación permite visualizar el estado de la fila, tiempos de espera y categorización de pacientes, facilitando el acceso a la información tanto para el personal de salud como para la comunidad.

## Descripción Funcional

La aplicación se conecta directamente a la fuente de datos oficial del Servicio de Salud Araucanía Norte (SSAN) mediante técnicas de web scraping seguro, extrayendo y procesando información crítica:
- **Resumen General:** Total de pacientes, pacientes en espera y pacientes en atención.
- **Categorización (Triage):** Desglose detallado por categorías C1, C2, C3, C4, C5 y Admisión (AD).
- **Tiempos de Espera:** Visualización de tiempos promedio de espera calculados en las últimas 12 horas.
- **Multiplataforma:** Accesible vía web y mediante aplicación nativa Android.

## Instalación y Configuración

### Requisitos Previos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Android Studio](https://developer.android.com/studio) (para la compilación de la app móvil)
- NPM (incluido con Node.js)

### Pasos para Desarrollo Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/fila-urgencia-collipulli.git
    cd fila-urgencia-collipulli
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

### Despliegue en Vercel

Este proyecto está optimizado para desplegarse en [Vercel](https://vercel.com/):
1. Conecta tu cuenta de GitHub con Vercel.
2. Selecciona el repositorio `fila-urgencia-collipulli`.
3. Vercel detectará automáticamente Next.js. Haz clic en **Deploy**.

## Compilación para Android (APK)

La aplicación utiliza **Capacitor** para el empaquetado móvil:

1.  **Generar exportación estática:**
    ```bash
    npm run build
    ```
2.  **Sincronizar con Android:**
    ```bash
    npx cap sync
    ```
3.  **Abrir en Android Studio:**
    ```bash
    npx cap open android
    ```
4.  En Android Studio, ve a **Build > Build Bundle(s) / APK(s) > Build APK(s)** para generar el archivo instalable.

---

## Créditos

**Proyecto elaborado por la Unidad TIC del Hospital de Collipulli.**
- **Responsable:** Christopher Burdiles Vergara, Encargado TIC.

---
© 2026 Hospital de Collipulli - Unidad TIC.
