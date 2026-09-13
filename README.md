<div align="center">

<img src="public/icons/jubi-192.png" alt="JubiJobs" width="96" height="96">
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="public/icons/inclu-192.png" alt="IncluJobs" width="96" height="96">

# JubiJobs · IncluJobs

**Dos plataformas de empleo para dos grupos de personas a las que el mercado laboral argentino deja afuera.**

Tu experiencia no se jubila. · Las condiciones, antes de la entrevista.

[jubijobs.com](https://jubijobs.com) · [inclujobs.com](https://inclujobs.com)

</div>

---

## El problema

En Argentina, una persona de 63 años que necesita trabajar manda el currículum y no le contestan. No porque no sirva: porque un sistema de selección automático la descarta por la fecha de nacimiento.

Una persona con discapacidad se postula, la llaman, va a la entrevista, y recién ahí descubre que la oficina está en un primer piso por escalera. Perdió el día, el viaje y la expectativa por un dato que nadie le dijo antes.

Los dos casos tienen la misma raíz: **el portal de empleo tradicional no está pensado para ellos.** Pide currículum en PDF, letra chica, formularios de veinte campos y una cuenta de LinkedIn.

## Qué hacen estas plataformas

**JubiJobs** es para personas jubiladas y mayores de 60. Trabajos part-time, por día y con horarios flexibles. Sin currículum: la persona responde tres preguntas en su idioma y eso es su postulación.

> ¿Qué hiciste? · ¿Qué sabés hacer? · ¿Qué te gustaría hacer?

**IncluJobs** es para personas con discapacidad. La diferencia clave: **cada aviso declara sus condiciones de accesibilidad antes de que alguien se postule.** Si el lugar tiene rampa y ascensor, lo dice. Si los horarios se ajustan a un tratamiento, lo dice. Si se puede trabajar desde casa, lo dice. Nadie viaja dos horas para descubrir que el baño no es accesible.

Son dos sitios separados, con dos públicos separados. Una empresa publica una vez y elige en cuál de los dos aparece, o en los dos.

## Cómo funciona

**Para quien busca trabajo**

1. Entra, mira los avisos y elige uno. No hace falta cuenta para mirar.
2. Se registra con Google o con su teléfono.
3. Responde las tres preguntas y se postula. Listo.
4. Recibe un correo cuando la empresa quiere contactarlo.

**Para quien ofrece trabajo**

1. Se registra y declara quién es: empresa con CUIT, o persona particular con DNI.
2. Publica el aviso y elige el portal o los dos.
3. Un moderador lo revisa antes de que se publique.
4. Recibe un correo cada vez que alguien se postula, con sus tres respuestas.

Publicar es gratis. Postularse es gratis. No hay plan premium ni destacados pagos.

## Decisiones que valen la pena contar

**Se admiten particulares, no solo empresas.** Mucho del trabajo por día para esta gente lo ofrece una casa que busca a alguien que cuide a un familiar, no una empresa con CUIT. Dejarlos afuera era dejar afuera el trabajo real. Se les pide DNI y quedan igual de identificados.

**Todo aviso pasa por moderación humana** antes de publicarse. Esta audiencia es blanco frecuente de estafas laborales. Una empresa que ya demostró seriedad queda verificada y sus avisos salen directo.

**La condición de discapacidad no se muestra en la pantalla donde la empresa decide a quién llamar.** Estaba ahí, destacada, y era lo primero que veía el ojo: la condición antes que la persona. Lo que la empresa sí necesita saber son las condiciones de trabajo a garantizar, y eso se muestra junto al resto de los datos del puesto.

**Accesibilidad real, no una etiqueta.** Tipografía grande por defecto, botones de 48 píxeles como mínimo, contraste alto, todo navegable con teclado y anunciado correctamente por lector de pantalla. IncluJobs usa una tipografía diseñada para baja visión.

**Los dos públicos no se mezclan.** Un aviso publicado solo en JubiJobs no se ve en IncluJobs, ni siquiera entrando con el enlace directo.

## Cómo podés ayudar

Esto lo mantengo yo, en mi tiempo, y es gratis para quien lo usa.

<div align="center">

[![Invitame un café en cafecito.app](https://cdn.cafecito.app/imgs/buttons/button_5.svg)](https://cafecito.app/ezebc182)

</div>

Si trabajás en una empresa y tenés un puesto part-time, por día o flexible: **publicalo.** Es gratis y es la ayuda que más sirve. Sin avisos, no hay plataforma.

Si conocés un centro de jubilados, una organización de personas con discapacidad o una bolsa de trabajo que pueda difundirlo, contame.

Si querés reportar un problema o proponer algo, abrí un issue acá mismo.

## Correr el proyecto

Hace falta Node 20 o superior, pnpm y una base PostgreSQL.

```bash
pnpm install
cp .env.example .env          # completar las variables
pnpm db:migrate
pnpm dev
```

Los dos portales se sirven desde el mismo proyecto y se distinguen por el dominio. En desarrollo:

- `localhost:3000` abre JubiJobs
- `inclu.localhost:3000` abre IncluJobs

Está hecho con Next.js, TypeScript, PostgreSQL y Tailwind. Los detalles de despliegue, variables de entorno y puesta en producción están en [DEPLOY.md](DEPLOY.md).

## Licencia

MIT. El código es libre de usar. Si armás algo parecido para otro país o para otro grupo de personas que el mercado laboral deja afuera, contame: me gustaría verlo.
