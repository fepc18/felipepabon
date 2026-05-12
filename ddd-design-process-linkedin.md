La mayoría de los equipos leen DDD, entienden los conceptos... y luego abren un editor de clases sin saber por dónde empezar.

El proceso tiene una secuencia natural que nadie te explica claramente:

→ **Event Storming** — antes de modelar, explora. Pon a negocio y técnicos en la misma sala con post-its. Mapea qué *sucede* en el dominio, no cómo está implementado.

→ **Context Map** — agrupa los eventos por afinidad. Identifica cuál es tu Core subdomain (donde vive tu diferenciación real) vs. los que puedes comprar o externalizar.

→ **Modelado táctico** — entra al Bounded Context Core y define tus Agregados. Las reglas de negocio viven ahí, no en los servicios ni en la base de datos.

→ **Iterar** — el modelo es una hipótesis. El Lenguaje Ubicuo te dirá cuándo está desalineado con el dominio real.

Lo ilustré con un ejemplo de **Open Finance**: el Consent Context, donde un banco gestiona los consentimientos para compartir datos financieros con terceros. Un dominio con reglas complejas, actores múltiples y presión regulatoria — exactamente donde DDD brilla.

Si el post anterior era el "qué" de DDD Estratégico, este es el "cómo".

🔗 https://felipepabon.substack.com

#SoftwareArchitecture #DDD #DomainDrivenDesign #OpenFinance #CleanArchitecture #TechLead #SoftwareDevelopment
