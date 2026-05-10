"Devuelve los movimientos de la cuenta" — parece simple.

Después de un ATAM aparecen 3 tradeoffs, 3 riesgos y 2 puntos de sensibilidad que nadie había articulado.

Hice el ejercicio sobre un API de consulta de movimientos bancarios:

→ El cache de 30s mejora rendimiento y disponibilidad, pero un cliente puede ver un movimiento revertido como si aún existiera
→ El circuit breaker protege contra fallos del core, pero en modo abierto sirve datos obsoletos sin avisar al cliente
→ Los logs de auditoría síncronos garantizan integridad del registro, pero añaden latencia fija a cada operación bajo pico de carga
→ Los JWT no tienen revocación: si se compromete un token, es válido hasta que expire

Ninguno de estos es un error. Son tradeoffs. La diferencia entre un equipo que los conoce y uno que no, es enorme cuando algo falla en producción.

El artículo completo tiene el árbol de utilidad, los 4 enfoques arquitectónicos y la tabla ATAM con todas las decisiones documentadas.

Para este ejercicio usé **atam-facilitator** (github.com/fepc18/claude-skills), un skill para Claude que actúa como co-facilitador del método. Pero hay algo que ninguna herramienta reemplaza: el criterio del arquitecto.

El skill estructura la conversación. La calidad del análisis la pones tú — qué escenarios realmente importan, qué riesgo es aceptable dado el negocio, qué tradeoff vale la pena. ATAM no está diseñado para pensar por ti. Está diseñado para que tu pensamiento quede documentado.

🔗 https://felipepabon.substack.com

#SoftwareArchitecture #Architecture #EngineeringManagement #TechLead #SoftwareDevelopment
