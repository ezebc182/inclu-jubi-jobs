# Cómo colaborar

Gracias por pasar. Este proyecto lo mantengo solo, así que cualquier ayuda cuenta.

## La ayuda que más sirve no es código

Lo digo primero porque es verdad: **el cuello de botella no es el código, son los avisos de trabajo.**

- **Si trabajás en una empresa** y tenés un puesto part-time, por día o con horario flexible, publicalo. Es gratis. Un aviso real vale más que cien líneas de código.
- **Si conocés un centro de jubilados, una organización de personas con discapacidad o una bolsa de trabajo**, contame. Llegar a la gente es el problema difícil.
- **Si usás el sitio y algo no se entiende**, decímelo. Especialmente si sos parte del público al que está dirigido, o acompañás a alguien que lo es. Esa mirada no la puedo reemplazar con ninguna herramienta.

## Reportar un problema

Abrí un issue. Hay plantillas para error, mejora y problema de accesibilidad.

Contame qué esperabas que pasara y qué pasó en cambio. Si podés, agregá el navegador y si estabas en teléfono o computadora.

**Un problema de seguridad NO va en un issue.** Ver [SECURITY.md](SECURITY.md).

## Contribuir código

Antes de escribir algo grande, abrí un issue y charlemos. Me evita tener que rechazarte un trabajo de tres días porque no encajaba, y eso no se lo quiero hacer a nadie.

Para arreglos chicos, mandá el pull request directo.

### Arrancar

Hace falta Node 20 o superior, pnpm y PostgreSQL.

```bash
pnpm install
cp .env.example .env          # completar las variables
pnpm db:migrate
pnpm dev
```

Los dos portales salen del mismo proyecto y se distinguen por el dominio:

- `localhost:3000` es JubiJobs
- `inclu.localhost:3000` es IncluJobs

### Lo que espero de un cambio

**Que compile.** `pnpm exec tsc --noEmit` tiene que pasar limpio.

**Commits con formato convencional.** `feat:`, `fix:`, `docs:`, `refactor:`. En español está bien.

**Accesibilidad, siempre.** No es una característica opcional acá, es el producto. Si tocás interfaz:

- Los controles se manejan con teclado y se ve dónde está el foco.
- Los botones y enlaces miden 48 píxeles como mínimo.
- El texto contrasta contra el fondo, en tema claro y oscuro.
- Las imágenes tienen texto alternativo, y los íconos decorativos están ocultos al lector de pantalla.
- Nada depende solo del color para entenderse.

**Comentarios que expliquen el porqué.** Vas a ver que el código tiene comentarios largos que cuentan qué problema resolvía una decisión. Eso es a propósito. Si cambiás algo por una razón que no es evidente, escribila.

**Cuidado con los datos sensibles.** Si tocás algo que muestra información de un candidato, pensá dos veces qué se ve y en qué orden. Hay una decisión tomada de no mostrar la condición de discapacidad en la pantalla donde la empresa elige a quién llamar, y razones escritas al lado.

### Lo que no va a entrar

- Cambiar la tipografía o los tamaños "porque se ve más moderno". Son grandes a propósito.
- Agregar pasos al formulario de postulación. Son tres preguntas y se quedan en tres.
- Funcionalidades pagas, avisos destacados o planes premium.
- Refactors grandes sin haberlo charlado antes.

## Dudas

Abrí un issue con la etiqueta de pregunta, o escribí a hola@jubijobs.com o hola@inclujobs.com.
