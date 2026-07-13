Tu equipo pasó semanas diseñando la arquitectura de tu sistema con IA.

¿Cuánto tiempo le dedicaron a pensar en cómo un atacante puede manipular al LLM?

OWASP tiene un Top 10 específico para aplicaciones con LLMs desde 2023. La edición 2025 es el estándar de referencia. Estas son las 3 vulnerabilidades que más deberían preocuparle a un arquitecto:

→ **LLM01 — Prompt Injection**: El SQL Injection de la era IA. Un atacante puede inyectar instrucciones en un documento que tu agente va a procesar, y el modelo las ejecuta sin saber que son maliciosas.

→ **LLM06 — Excessive Agency**: Los agentes con demasiados permisos son una bomba de tiempo. Si un agente puede leer emails, enviar emails, modificar bases de datos y llamar APIs externas... ¿qué pasa si lo comprometen?

→ **LLM08 — Vector & Embedding Weaknesses**: Los sistemas RAG tienen un blindspot crítico. Si alguien puede escribir en tu base vectorial, puede cambiar el comportamiento de tu agente sin tocar el modelo ni el código.

La buena noticia: estos riesgos se mitigan principalmente con decisiones de diseño, no con parches de seguridad de último minuto.

Escribí un artículo completo con diagramas y guía de integración en tu proceso de arquitectura.

🔗 https://felipepabon.substack.com

#SoftwareArchitecture #AIArchitecture #LLMSecurity #OWASP #Microservices #TechLead #SoftwareDevelopment #EngineeringManagement
