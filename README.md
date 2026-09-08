# Fila Urgencia Collipulli 🏥

Sistema de monitoreo en tiempo real de la demanda asistencial en la Unidad de Emergencia Hospitalaria (UEH) del Hospital de Collipulli. Esta aplicación permite visualizar de forma clara y moderna el estado de la fila, tiempos de espera y categorización de pacientes.

## 🚀 Características Principales

- **Datos en Tiempo Real:** Conexión automatizada con el servidor de salud (SSAN) mediante un "Puente de Datos" seguro.
- **Visualización de Carga:** Resumen de pacientes en espera, en atención y total acumulado.
- **Categorización ESI:** Desglose detallado por niveles de urgencia:
  - **C1 (Rojo):** Crítico.
  - **C2 (Naranja):** Grave.
  - **C3 (Amarillo):** Complejidad Media
  - **C4 (Azul):** No Urgente.
  - **C5 (Verde):** Consulta General
- **Tiempos de Espera:** Tiempos promedio calculados en las últimas 12 horas.
- **Multiplataforma:** Desplegado en la web (Vercel) y disponible como aplicación nativa para Android.

## 🛠️ Arquitectura Técnica

Para superar los bloqueos de firewall regionales, el proyecto utiliza una arquitectura de tres capas:
1. **Frontend (ClaudeFlare Pages):** Interfaz de usuario construida con Next.js y Tailwind CSS.
2. **Puente (Cloudflare Workers):** Actúa como un proxy inteligente que realiza el "trabajo sucio" de consultar al servidor de salud evitando bloqueos de IP.
3. **App Móvil:** Empaquetado mediante Capacitor para una experiencia nativa en dispositivos Android.

## 📦 Instalación y Uso Local

### Requisitos
- Node.js 18+
- Android Studio (para el APK)

### Pasos
1. Clonar el repositorio.
2. Instalar dependencias: `npm install`.
3. Configurar la URL del Worker en `app/api/urgencia-collipulli/route.ts`.
4. Ejecutar desarrollo: `npm run dev`.

## 📱 Compilación para Android

1. Generar build: `npm run build`.
2. Sincronizar: `npx cap sync`.
3. Generar APK desde Android Studio: `Build > Build APK(s)`.

---

## ✒️ Créditos

**Proyecto elaborado por la Unidad TIC del Hospital de Collipulli.**
- **Dirección Técnica:** Christopher Burdiles Vergara, Encargado TIC.

---
© 2026 Hospital de Collipulli - Unidad TIC.
