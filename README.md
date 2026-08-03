# Brief de Proyecto — Licenciados | Legal & Business Group

Este documento es el informe/brief para el desarrollo del sitio web de **Licenciados | Legal & Business Group**. El desarrollador construirá sobre la **plantilla base de HTML** ya entregada, siguiendo el prompt inicial de adaptación. Este README complementa ese prompt con la información del negocio, el branding y los requisitos visuales obligatorios.

**Tipo de proyecto:** Sitio web corporativo / institucional para despacho jurídico, sobre plantilla base existente.

> La estructura de secciones y páginas del sitio **ya está definida por la plantilla base**. Este documento no propone ni modifica esa estructura — solo aporta contenido, marca y requisitos visuales para llenarla.

---

## 1. Información del negocio

Datos extraídos de los archivos en `imagenes/` (flyers, tarjeta de presentación y capturas compartidas por el cliente).

- **Nombre de la firma:** Licenciados | Legal & Business Group
- **Abogada principal / Fundadora:** Dra./Lic. Mónica Campos Jaramillo — Fundadora y Directora General
- **WhatsApp / teléfono principal (México):** +52 312 116 2476
- **WhatsApp secundario (EE. UU.):** +1 702 347 7213
- **Correo electrónico:** juridicoempresasmex@gmail.com
- **Sitio web:** www.licenciados.mx
- **Zona de operación:** Cancún, Quintana Roo, México (con alcance a Riviera Maya / Yucatán)
- **Redes sociales identificadas:** Facebook e Instagram como "Licenciados Legal & Business Group" / @licenciados.legal.business

⚠️ **A confirmar con el cliente:** en materiales secundarios (flyers inmobiliarios, tarjetas de otra socia) aparecen otros números de teléfono y un dominio alterno ("licenciadosgroup.mx"). Para el sitio web usar únicamente los datos de contacto listados arriba (los de la tarjeta de presentación oficial de la Dra. Mónica Campos), salvo indicación contraria del cliente.

### Áreas de práctica / servicios (tal como aparecen en los materiales de marca)

Derecho Migratorio · Derecho Patrimonial · Derecho Familiar · Derecho Penal · Derechos Humanos · Derecho Corporativo · Derecho Inmobiliario · Derecho Civil · Litigio Estratégico

### Certificaciones e insignias institucionales a mostrar

- **PROFETIT** — Buró Universal de Profesionistas Titulados del Mundo
- **FINTES** — Federación Internacional de Especialistas
- **Universidad Simón Bolívar (Barranquilla)** — logo **no está** en la carpeta `imagenes/`, debe solicitarse al cliente
- **Universidad UMOV MX** — logo **no está** en la carpeta `imagenes/`, debe solicitarse al cliente

---

## 2. Branding (definido a partir del logo e imágenes del cliente)

### Paleta de colores

| Uso | Color | HEX aprox. |
|---|---|---|
| Fondo oscuro principal (navy/negro) | Azul marino muy oscuro | `#0A1F3D` |
| Acento de marca / dorado | Dorado | `#D4AF37` |
| Acento cálido / hover / detalles | Ámbar | `#F2A93B` |
| Texto sobre fondo oscuro | Blanco | `#FFFFFF` |
| Fondo de secciones claras | Gris muy claro | `#F5F5F5` |
| Detalle suave (opcional) | Beige/tostado | `#C9A66B` |

Esta paleta se extrajo de la tarjeta de presentación oficial y de los flyers "Legal & Business Group" (fondo navy/negro con acentos dorados). Entre las imágenes también hay capturas de un sitio de referencia (**www.licenciados.mx**, en negro + ámbar) que el cliente mencionó explícitamente como fuente de inspiración de diseño: úsalas como referencia de **estilo y atmósfera visual** (no de estructura), y aplica sobre ellas la paleta de marca real del cliente indicada en la tabla.

### Tipografía sugerida

- **Títulos / wordmark:** serif elegante (ej. Playfair Display, Cormorant Garamond) — coherente con el tratamiento tipográfico de "LICENCIADOS" en los flyers.
- **Cuerpo de texto / UI:** sans-serif limpia (ej. Inter, Montserrat, Manrope).

### Identidad visual

Marca jurídica premium: navy/negro + dorado, con balanza de la justicia y monograma como elementos gráficos recurrentes en los materiales del cliente. El tono debe transmitir autoridad, confianza y exclusividad (despacho internacional), no un estilo genérico de landing page.

---

## 3. Estilo visual obligatorio

El proyecto debe manejar:

- Estilo **premium, enterprise y corporativo de marca**.
- Nivel **big tech**: elegante y a la vez minimalista.

---

## 4. Efectos y animaciones requeridos

- Efectos visuales y **animaciones de scroll** en toda la página.
- **Pantalla de carga (preloader)** con spinner + logo del negocio.
- Animaciones en el **título del hero**: efecto máquina de escribir, cambio de color en las letras u otros efectos tipográficos.

---

## 5. Instrucciones sobre assets (carpeta `imagenes/`)

- El **logo/sello de certificación** (`profetit.jpeg`, PROFETIT + FINTES) viene con **fondo sólido**: se debe **remover el fondo** (dejarlo en PNG transparente) antes de usarlo como insignia/sello de confianza en el sitio.
- **No existe en la carpeta un archivo aislado del logo principal de "Licenciados | Legal & Business Group"** (el monograma dorado). Solicitar al cliente el archivo original (SVG o PNG con fondo transparente); mientras tanto, puede recortarse provisionalmente del mejor flyer disponible.
- Faltan los logos de **Universidad Simón Bolívar (Barranquilla)** y **Universidad UMOV MX**, mencionados por el cliente para mostrarse junto a PROFETIT/FINTES — solicitarlos.
- El cliente pidió que, en la sección donde se muestre **Derecho Patrimonial**, se use una imagen suya editada con IA replicando el fondo/estilo del material de PROFETIT/FINTES (fondo vino/rojo oscuro con las insignias). Sus fotos en alta calidad para ese retoque debe pedírselas directamente por correo, ya que por WhatsApp pierden calidad.
- La carpeta `imagenes/` tiene **muchos archivos duplicados** (el mismo flyer repetido en distintos recortes/tamaños): usar solo la mejor versión de cada diseño único.
- Hay imágenes **sin relación con esta firma** (p. ej. un logo de laboratorio clínico y una captura de otra empresa distinta) mezcladas en la carpeta por error de envío.
- Hay 2 archivos de video (`WhatsApp Video...`) que pueden aprovecharse como contenido audiovisual si la plantilla lo permite.
- **Cualquier imagen de la carpeta que no sea necesaria para el proyecto puede eliminarse directamente.**

---

## 6. Nota para el desarrollador

Puedes iterar sobre el proyecto usando Claude Code, dándole instrucciones las veces que sea necesario hasta lograr el resultado deseado (ajustes de color, animaciones, contenido, etc.).

---

## 7. Checklist del desarrollador

- [ ] Revisar la plantilla base y el prompt inicial de adaptación.
- [ ] Cargar los datos de contacto oficiales (teléfono, correo, web) en el sitio.
- [ ] Incluir las áreas de práctica y certificaciones listadas en este documento.
- [ ] Aplicar la paleta de colores y tipografía definidas en la sección de Branding.
- [ ] Remover el fondo del logo/sello PROFETIT + FINTES antes de integrarlo.
- [ ] Solicitar al cliente el logo aislado de la firma y los logos faltantes (Universidad Simón Bolívar, UMOV MX).
- [ ] Solicitar al cliente fotos en alta calidad para el retoque con IA de la sección de Derecho Patrimonial.
- [ ] Eliminar del proyecto imágenes duplicadas o sin relación con la firma.
- [ ] Implementar el preloader (spinner + logo).
- [ ] Implementar animaciones de scroll en la página.
- [ ] Implementar la animación del título del hero (máquina de escribir / cambio de color u otro efecto).
- [ ] Validar que el estilo general se sienta premium, enterprise y minimalista (nivel big tech).
- [ ] Revisar el resultado final e iterar con Claude Code hasta aprobación del cliente.
