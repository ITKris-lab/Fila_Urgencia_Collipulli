# Fila Urgencia Collipulli 🏥

Sistema de monitoreo en tiempo real de la demanda asistencial en la Unidad de Emergencia Hospitalaria (UEH) del Hospital de Collipulli. Esta aplicación permite visualizar de forma clara y moderna el estado de la fila, tiempos de espera y categorización de pacientes.

## 🚀 Características Principales

- **Datos en Tiempo Real:** Conexión automatizada con el servidor de salud (SSAN) mediante un "Puente de Datos" seguro en Cloudflare.
- **Visualización de Carga:** Resumen de pacientes en espera, en atención y total acumulado.
- **Categorización ESI Interactiva:** Modal informativo que explica la prioridad de atención (C1 a C5) para educar a la comunidad.
- **Botón TeleSalud:** Integración directa con el portal de atención virtual ministerial.
- **Interfaz "Glassmorphism":** Diseño moderno con efectos de transparencia y tarjetas de alto contraste optimizadas para dispositivos móviles.
- **Multiplataforma:** Web App (Vercel/Cloudflare) y App Nativa Android (Capacitor).

## 🛠️ Arquitectura Técnica

Para garantizar el acceso desde cualquier red y evitar bloqueos, el proyecto utiliza:
1. **Frontend:** Next.js + Tailwind CSS + Lucide Icons.
2. **Backend (Proxy):** Cloudflare Workers que actúan como puente hacia el servidor central de salud.
3. **App Móvil:** Capacitor JS para la compilación a APK de Android.

## 📦 Instalación y Uso Local

### Requisitos
- Node.js 18+
- NPM o PNPM
- Android Studio (para generar el APK)

### Pasos
1. Clonar el repositorio.
2. Instalar dependencias: `npm install`.
3. Ejecutar en modo desarrollo: `npm run dev`.
4. El servidor se iniciará en `localhost:3000` (o la IP configurada).

## 📱 Compilación para Android

1. Generar build: `npm run build`.
2. Sincronizar activos: `npx cap sync`.
3. Abrir proyecto en Android Studio: `npx cap open android`.
4. Generar APK: `Build > Build APK(s)`.

---

## ✒️ Créditos

**Proyecto desarrollado por la Unidad TIC del Hospital de Collipulli.**
- **Liderazgo Técnico:** Christopher Burdiles Vergara, Encargado TIC.
- **Infraestructura:** Cloudflare / Vercel.

---
© 2026 Hospital de Collipulli - Unidad TIC.
