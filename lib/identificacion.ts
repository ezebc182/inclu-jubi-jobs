/**
 * Validación de CUIT/CUIL y DNI argentinos.
 *
 * Para qué sirve: hasta ahora, publicar un empleo solo pedía un nombre de
 * empresa. Cualquiera escribía "Empresa SA" y ya podía subir avisos que ven
 * personas jubiladas y personas con discapacidad buscando trabajo. Esa es la
 * superficie de estafa clásica de un portal de empleo.
 *
 * Qué NO hace: el CUIT no prueba identidad. Nadie verifica contra AFIP que la
 * persona sea quien dice, ni que ese CUIT le pertenezca. Lo que sí hace es
 * dejar rastro —un CUIT es rastreable— y disuadir: quien inventa uno miente por
 * escrito y queda expuesto.
 *
 * La defensa real sigue siendo la moderación: los avisos entran en PENDING y
 * alguien los aprueba. Estos datos son para que ese alguien tenga con qué
 * decidir, en vez de mirar un nombre suelto.
 */

/** Solo los dígitos: "20-12345678-9" → "20123456789". */
export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/**
 * Verifica el dígito verificador de un CUIT/CUIL.
 *
 * El algoritmo es módulo 11 con pesos fijos: se multiplican los diez primeros
 * dígitos por la serie 5-4-3-2-7-6-5-4-3-2, se suma, y el resto de dividir por
 * 11 determina el último dígito.
 *
 * Esto descarta números escritos al azar y errores de tipeo, que es la mayoría
 * de los casos. No descarta un CUIT real ajeno.
 */
export function esCuitValido(valor: string): boolean {
  const digitos = soloDigitos(valor);
  if (digitos.length !== 11) return false;

  // Un CUIT arranca con el tipo de persona. Cualquier otro prefijo es inválido.
  //   20, 23, 24, 27  → persona física
  //   30, 33, 34      → persona jurídica
  const prefijo = digitos.slice(0, 2);
  const PREFIJOS = ["20", "23", "24", "27", "30", "33", "34"];
  if (!PREFIJOS.includes(prefijo)) return false;

  const PESOS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = PESOS.reduce(
    (acc, peso, i) => acc + peso * Number(digitos[i]),
    0
  );

  const resto = suma % 11;
  const esperado = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;

  return esperado === Number(digitos[10]);
}

/** Formatea para mostrar: "20123456789" → "20-12345678-9". */
export function formatearCuit(valor: string): string {
  const d = soloDigitos(valor);
  if (d.length !== 11) return valor;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
}

/**
 * DNI: entre 7 y 8 dígitos.
 *
 * No tiene dígito verificador, así que solo se valida el rango. Es un dato de
 * contacto y de rastro, no una credencial.
 */
export function esDniValido(valor: string): boolean {
  const d = soloDigitos(valor);
  return d.length >= 7 && d.length <= 8 && Number(d) > 0;
}

/**
 * Teléfono argentino, en dígitos.
 *
 * Diez dígitos sin el 0 inicial ni el 15: código de área + número. Se aceptan
 * once por el 9 de celular en formato internacional.
 */
export function esTelefonoValido(valor: string): boolean {
  const d = soloDigitos(valor);
  return d.length >= 10 && d.length <= 13;
}
