Tu agente de IA no falla por ser inteligente. Falla porque nadie le explicó las reglas del juego.

Darle acceso a Claude Code a tu repositorio y pedirle un feature es fácil. Lo difícil es que el resultado sea confiable, auditable y reversible.

Eso es lo que resuelve **Harness Engineering**: un framework de 4 componentes que envuelve al agente de desarrollo y controla cada dimensión de su trabajo.

→ **Guides (CLAUDE.md):** el contrato que define qué puede tocar, qué convenciones seguir, cuándo detenerse a preguntar
→ **Sensors (Hooks):** scripts que interceptan cada acción del agente antes de ejecutarse — y bloquean lo que no debe pasar
→ **Sandbox (Tests + CI):** el agente corre sus propios tests, lee el output y se autocorrige antes de hacer commit
→ **Output (Git + PR):** siempre en un branch, con commits atómicos y un resumen de lo que hizo y por qué

El resultado: un agente que puede trabajar solo en tickets de complejidad media y entregar código que tu equipo puede revisar con confianza.

El harness no limita al agente. Lo hace confiable.

🔗 Artículo completo con diagramas y código: https://felipepabon.substack.com

#SoftwareArchitecture #CleanArchitecture #AI #SoftwareDevelopment #TechLead #EngineeringManagement
