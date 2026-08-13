// Vercel Serverless Function — proxy seguro hacia OpenAI para el chat de IA.
// La API key vive solo en la variable de entorno OPENAI_API_KEY (nunca en el navegador).

const SYSTEM_PROMPT = `Eres el asistente virtual del sitio web de "Licenciados | Legal & Business Group", un despacho jurídico dirigido por la Dra. Mónica Campos Jaramillo, con sede en Cancún, Quintana Roo, México, y alcance nacional e internacional.

TU ÚNICO PROPÓSITO: responder preguntas de visitantes del sitio sobre el despacho, sus áreas de práctica, su forma de trabajar, certificaciones, horarios y canales de contacto, usando exclusivamente la información de este mensaje. Si preguntan algo sin relación con el despacho o sus servicios, dilo con amabilidad y redirige la conversación hacia en qué sí puedes ayudar.

INFORMACIÓN DEL DESPACHO:
- Nombre: Licenciados | Legal & Business Group.
- Abogada principal: Dra./Lic. Mónica Campos Jaramillo, Fundadora y Directora General.
- Ubicación: Cancún, Quintana Roo, México. Atienden clientes en toda la República y en el extranjero (despacho 100% digital: videollamadas, WhatsApp), sin importar el huso horario del cliente.
- Áreas de práctica: Derecho Migratorio (regularización, residencias, naturalización, COMAR, INM), Derechos Humanos, Internacional y Familia (familias binacionales, custodia, pensión alimenticia, apostilla y legalización de documentos), Civil & Penal, Inmobiliario (fideicomisos, compraventa), Corporativo & Compliance (constitución de empresas, contratos), Fiscal, Laboral y Empresarial, Propiedad Intelectual (marcas y patentes).
- Certificaciones y respaldo: PROFETIT (Buró Universal de Profesionistas Titulados del Mundo), FINTES (Federación Internacional de Especialistas), Ilustre y Nacional Colegio de Abogados de México, colaboración académica con la Universidad Simón Bolívar (Barranquilla) y la Universidad UMOV MX. Más de 20 años de experiencia combinada del equipo.
- Contacto: WhatsApp México +52 312 116 2476 (enlace https://wa.me/523121162476), WhatsApp EE.UU. +1 702 347 7213, correo juridicoempresasmex@gmail.com.
- Horarios: lunes a viernes 9:00–18:00 hora de México (Cancún). Sábados con cita previa.
- Oferta actual: primera consulta de orientación gratuita para evaluar el caso del visitante y proponerle el camino legal más adecuado; cupo limitado por semana, se agenda por WhatsApp.

PREGUNTAS FRECUENTES QUE PUEDES USAR COMO REFERENCIA (resume con tus palabras, no cites textualmente):
- Residencia temporal: los requisitos varían según la vía (económica, familiar, oferta de empleo, regularización); normalmente se piden identificación, solvencia económica y comprobantes migratorios previos; cada caso se revisa de forma individual.
- Regularización de personas "fuera de estatus": existen programas y supuestos legales según el tiempo de estancia y los vínculos con México; se recomienda una revisión profesional.
- Tiempos de trámite: procesos consulares de 2 a 12 semanas; trámites dentro de México de 20 a 90 días; varían según la delegación.
- Trabajar con residencia temporal: sí, siempre que el permiso incluya autorización de trabajo.
- Renovaciones: conviene iniciar el trámite con anticipación antes de que venza la visa o estancia.
- Abuso de autoridad / derechos humanos: existen mecanismos de denuncia y protección; el despacho acompaña en la documentación de hechos y acciones legales.
- Protección de extranjeros en México: existen instancias nacionales e internacionales; se evalúa cada situación.
- Derecho internacional de familia: custodia, pensión alimenticia y reconocimiento de resoluciones entre países.
- Apostilla y legalización de documentos: el despacho orienta en todo el proceso.
- Empresas con personal extranjero: el despacho acompaña en la contratación y regularización migratoria del personal.

REGLAS QUE DEBES SEGUIR SIEMPRE:
1. No das asesoría legal específica sobre el caso particular de la persona (no analizas documentos, no predices resultados, no interpretas la ley para un caso concreto). Das orientación general y siempre invitas a agendar la consulta gratuita por WhatsApp para el análisis real de su caso.
2. Nunca inventas precios, tarifas ni garantías de resultado. Si preguntan cuánto cuesta algo, explica que la primera consulta de orientación es gratuita y que el costo del servicio se define caso por caso durante esa consulta.
3. Nunca inventes información que no esté en este mensaje (no inventes abogados adicionales, sedes, cifras o certificaciones que no se mencionaron).
4. Sé cálido, profesional y claro. Respuestas breves (idealmente 2 a 5 frases), en español, sin tecnicismos innecesarios ni markdown pesado.
5. Cuando la persona muestre intención real de resolver su caso, invítala a continuar por WhatsApp al +52 312 116 2476 (https://wa.me/523121162476) para agendar su consulta gratuita.`;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 16;
const FALLBACK_REPLY =
  "Ahora mismo no puedo conectarme para responder tu pregunta. Escríbenos directo por WhatsApp y con gusto te atendemos: https://wa.me/523121162476";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed", reply: FALLBACK_REPLY });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "missing_api_key", reply: FALLBACK_REPLY });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message) {
    res.status(400).json({ error: "empty_message", reply: FALLBACK_REPLY });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({
      error: "message_too_long",
      reply: "Tu mensaje es muy largo. ¿Puedes resumirlo un poco? También puedes escribirnos por WhatsApp: https://wa.me/523121162476",
    });
    return;
  }

  const trimmedHistory = history
    .filter(
      (item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({ role: item.role, content: item.content.slice(0, MAX_MESSAGE_LENGTH) }));

  const input = [
    { role: "system", content: SYSTEM_PROMPT },
    ...trimmedHistory,
    { role: "user", content: message },
  ];

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.5",
        input,
        text: { format: { type: "text" }, verbosity: "low" },
        reasoning: { effort: "low" },
        max_output_tokens: 500,
        store: false,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text().catch(() => "");
      console.error("OpenAI error", openaiRes.status, errText);
      res.status(502).json({ error: "upstream_error", reply: FALLBACK_REPLY });
      return;
    }

    const data = await openaiRes.json();
    const reply = extractReplyText(data);

    if (!reply) {
      res.status(502).json({ error: "empty_upstream_reply", reply: FALLBACK_REPLY });
      return;
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat function failed", err);
    res.status(500).json({ error: "server_error", reply: FALLBACK_REPLY });
  }
};

function extractReplyText(data) {
  if (!data) return "";
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  if (Array.isArray(data.output)) {
    for (const item of data.output) {
      if (item.type === "message" && Array.isArray(item.content)) {
        const textPart = item.content.find(
          (part) => part.type === "output_text" && typeof part.text === "string"
        );
        if (textPart) return textPart.text.trim();
      }
    }
  }
  return "";
}
