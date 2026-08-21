import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout de 8 seg

  try {
    const url = 'https://www.esissan.cl/ssan_pth_mapa_redurgencia/sele_ciu_grafico';

    const params = new URLSearchParams();
    params.append('NOM', 'UEH COLLIPULLI');
    params.append('estab', '103');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://www.esissan.cl/ssan_pth_mapa_redurgencia',
        'Origin': 'https://www.esissan.cl',
        'Accept': '*/*',
      },
      body: params.toString(),
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
        return NextResponse.json({
            error: 'Servidor SSAN no responde',
            status: response.status
        }, { status: 200 }); // Retornamos 200 para que la app no explote, pero con el error
    }

    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);

    // 1. Extraer contadores generales
    const extractValueNextToText = (textQuery: string) => {
      const element = $(`td:contains("${textQuery}")`).next('td');
      const val = parseInt(element.text().trim());
      return isNaN(val) ? 0 : val;
    };

    const enEspera = extractValueNextToText('N° de Pacientes en espera de atención');
    const enAtencion = extractValueNextToText('N° de pacientes en atención');
    const totalPacientes = extractValueNextToText('Total de pacientes');

    // 2. Extraer cantidades de categorías
    const quantities: Record<string, number> = {
      "C1": 0, "C2": 0, "C3": 0, "C4": 0, "C5": 0, "ADMISION": 0
    };

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

    // 3. Extraer tiempos promedio
    const times: Record<string, string> = {
      "C1": "0 min", "C2": "0 min", "C3": "0 min", "C4": "0 min", "C5": "0 min", "ADMISION": "0 min"
    };

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
    console.error('Error fetching data:', error.name === 'AbortError' ? 'Timeout' : error.message);
    return NextResponse.json({
      error: 'Servicio temporalmente no disponible',
      detail: error.name === 'AbortError' ? 'Timeout en conexión con SSAN' : error.message
    }, { status: 200 }); // Retornamos 200 para evitar que la UI se rompa
  }
}
