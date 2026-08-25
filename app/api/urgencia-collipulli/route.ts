import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

const CLOUDFLARE_WORKER_URL = 'https://recolector-urgencia.tic-kym24.workers.dev/';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 segundos de gracia

  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error(`Cloudflare devolvió status ${response.status}`);
    }

    const htmlContent = await response.text();

    // Si el contenido es muy corto, probablemente es un error del servidor de salud
    if (htmlContent.length < 500) {
        if (htmlContent.includes('error') || htmlContent.includes('blocked')) {
             throw new Error('El servidor de salud bloqueó la petición (Incluso vía Cloudflare)');
        }
        throw new Error('Respuesta del servidor de salud incompleta o vacía');
    }

    const $ = cheerio.load(htmlContent);

    // Verificamos si existe la tabla de datos antes de procesar
    if (!$('td:contains("Pacientes")').length) {
        throw new Error('No se encontró la tabla de pacientes en el HTML recibido');
    }

    const extractValueNextToText = (textQuery: string) => {
      const element = $(`td:contains("${textQuery}")`).next('td');
      const val = parseInt(element.text().replace(/[^0-9]/g, ''));
      return isNaN(val) ? 0 : val;
    };

    const enEspera = extractValueNextToText('espera de atención');
    const enAtencion = extractValueNextToText('pacientes en atención');
    const totalPacientes = extractValueNextToText('Total de pacientes');

    const quantities: Record<string, number> = { "C1": 0, "C2": 0, "C3": 0, "C4": 0, "C5": 0, "ADMISION": 0 };

    $('script').each((_, script) => {
      const content = $(script).html() || '';
      if (content.includes('xValues') && content.includes('yValues')) {
        const xMatch = content.match(/xValues\s*=\s*\[([^\]]+)\]/);
        const yMatch = content.match(/yValues\s*=\s*\[([^\]]+)\]/);
        if (xMatch && yMatch) {
          const labels = xMatch[1].replace(/['"]/g, '').split(',').map(s => s.trim());
          const values = yMatch[1].split(',').map(s => parseInt(s.trim()));
          labels.forEach((label, index) => {
            const upperLabel = label.toUpperCase();
            if (upperLabel.includes("C1")) quantities["C1"] = values[index] || 0;
            else if (upperLabel.includes("C2")) quantities["C2"] = values[index] || 0;
            else if (upperLabel.includes("C3")) quantities["C3"] = values[index] || 0;
            else if (upperLabel.includes("C4")) quantities["C4"] = values[index] || 0;
            else if (upperLabel.includes("C5")) quantities["C5"] = values[index] || 0;
            else if (upperLabel.includes("ADMISI")) quantities["ADMISION"] = values[index] || 0;
          });
        }
      }
    });

    const times: Record<string, string> = { "C1": "0 min", "C2": "0 min", "C3": "0 min", "C4": "0 min", "C5": "0 min", "ADMISION": "0 min" };

    $('table').each((_, table) => {
      if ($(table).text().includes('TIEMPO PROMEDIO')) {
        $(table).find('tr').each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            const label = $(cells[0]).text().trim().toUpperCase();
            const time = $(cells[1]).text().trim();
            if (label.includes("C1")) times["C1"] = time || "0 min";
            else if (label.includes("C2")) times["C2"] = time || "0 min";
            else if (label.includes("C3")) times["C3"] = time || "0 min";
            else if (label.includes("C4")) times["C4"] = time || "0 min";
            else if (label.includes("C5")) times["C5"] = time || "0 min";
            else if (label.includes("ADMISI")) times["ADMISION"] = time || "0 min";
          }
        });
      }
    });

    return NextResponse.json({
      hospital: "Hospital de Collipulli",
      totalPacientes, enEspera, enAtencion,
      categorias: {
        C1: { cantidad: quantities["C1"], tiempoPromedio: times["C1"] },
        C2: { cantidad: quantities["C2"], tiempoPromedio: times["C2"] },
        C3: { cantidad: quantities["C3"], tiempoPromedio: times["C3"] },
        C4: { cantidad: quantities["C4"], tiempoPromedio: times["C4"] },
        C5: { cantidad: quantities["C5"], tiempoPromedio: times["C5"] },
        AD: { cantidad: quantities["ADMISION"], tiempoPromedio: times["ADMISION"] }
      },
      ultimaActualizacion: new Date().toLocaleString('es-CL', {
        timeZone: 'America/Santiago',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    });

  } catch (error: any) {
    clearTimeout(timeoutId);
    return NextResponse.json({
      error: 'Error de conexión con el Hospital',
      detail: error.name === 'AbortError' ? 'Tiempo de espera agotado' : error.message
    }, { status: 200 });
  }
}
