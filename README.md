# Evidence System

## Sistema de Custodia Digital de Evidencias

---

> **Documento descriptivo orientado a peritos judiciales, profesionales del derecho y órganos jurisdiccionales.**
> No requiere conocimientos técnicos para su comprensión.

---

## Índice

* [Objeto del sistema](#objeto-del-sistema)
* [Qué problema resuelve](#qué-problema-resuelve)
* [Garantías que ofrece](#garantías-que-ofrece)
* [Cómo se protege la evidencia](#cómo-se-protege-la-evidencia)
* [Verificación independiente](#verificación-independiente)
* [Exportación probatoria](#exportación-probatoria)
* [Firma y anclaje legal](#firma-y-anclaje-legal)
* [Qué NO hace el sistema](#qué-no-hace-el-sistema)
* [Validez pericial](#validez-pericial)
* [Estado del sistema](#estado-del-sistema)

---

## Objeto del sistema

**Evidence System** es un sistema diseñado para **custodiar evidencias digitales** garantizando que:

* no puedan ser modificadas posteriormente,
* cualquier intento de alteración sea detectable,
* y terceros puedan verificar la integridad de la evidencia **sin confiar en el sistema original**.

Su finalidad es **preservar prueba digital** de forma **trazable, verificable y defendible**.

---

## Qué problema resuelve

En muchos sistemas digitales:

* los registros pueden modificarse,
* la trazabilidad depende de la buena fe del operador,
* la prueba solo es válida “mientras el sistema existe”.

Este sistema elimina esos problemas creando una **cadena de custodia digital sólida**, comparable a una **cadena de custodia física**, pero aplicada a información digital.

---

## Garantías que ofrece

### Garantías fundamentales

```
┌───────────────────────────────────────────────┐
│  GARANTÍAS DEL SISTEMA                         │
├───────────────────────────────────────────────┤
│  • La evidencia no puede ser modificada        │
│  • El orden de los hechos es verificable       │
│  • Toda alteración es detectable               │
│  • La verificación no depende del proveedor    │
└───────────────────────────────────────────────┘
```

Estas garantías **no dependen de procedimientos internos**, sino que están **impuestas por el propio diseño del sistema**.

---

## Cómo se protege la evidencia

Cada hecho relevante (ingreso de evidencia, exportación, firma, etc.) se registra como un **evento encadenado**:

* Cada evento referencia al anterior.
* Si se altera uno, se rompe la cadena.
* El sistema impide borrar o modificar eventos ya registrados.

Esto equivale, en términos conceptuales, a **numerar y sellar cada hoja de un expediente**, de modo que no pueda extraerse ni sustituirse sin dejar rastro.

---

## Verificación independiente

Una característica esencial del sistema es que **la verificación no requiere confiar en la aplicación ni en la base de datos original**.

La integridad puede comprobarse mediante:

* una función de verificación interna (para uso técnico),
* o mediante herramientas externas, sin acceso al sistema.

```
┌───────────────────────────────────────────────┐
│  PRINCIPIO CLAVE                              │
├───────────────────────────────────────────────┤
│  “No hay que confiar en el sistema:            │
│   hay que poder comprobarlo.”                  │
└───────────────────────────────────────────────┘
```

---

## Exportación probatoria

El sistema permite generar una **exportación probatoria** en formato ZIP que incluye:

* los registros de hechos,
* un manifiesto de huellas digitales (hashes),
* y, opcionalmente, los ficheros asociados.

Este archivo puede:

* conservarse fuera del sistema,
* entregarse a un tercero,
* analizarse sin conexión ni acceso interno.

---

## Firma y anclaje legal

Para reforzar el valor jurídico, la exportación puede anclarse mediante:

* un **documento PDF** que describe la exportación,
* la **huella digital** del archivo ZIP,
* y una **firma electrónica avanzada de tipo PAdES-LTA**.

Este tipo de firma:

* incorpora sellado temporal,
* permite verificación a largo plazo,
* es verificable con herramientas estándar europeas.

---

## Qué NO hace el sistema

Es importante aclarar los límites del sistema:

```
┌───────────────────────────────────────────────┐
│  EL SISTEMA NO:                               │
├───────────────────────────────────────────────┤
│  • Decide hechos o interpreta pruebas         │
│  • Sustituye al criterio pericial             │
│  • Garantiza la veracidad del contenido        │
│  • Actúa como juez o evaluador                 │
└───────────────────────────────────────────────┘
```

El sistema **no juzga**, **no interpreta** y **no concluye**.
Únicamente **preserva y protege** la evidencia.

---

## Validez pericial

Desde un punto de vista pericial, el sistema es relevante porque:

* permite demostrar **integridad**, no solo afirmarla,
* separa claramente custodia, análisis y conclusión,
* facilita la explicación técnica ante terceros,
* y reduce la dependencia de declaraciones del proveedor.

El diseño está pensado para **escenarios de revisión hostil**.

---

## Estado del sistema

Actualmente el sistema proporciona:

```
┌───────────────────────────────────────────────┐
│  ESTADO ACTUAL                                │
├───────────────────────────────────────────────┤
│  ✔ Custodia inmutable de evidencias           │
│  ✔ Trazabilidad verificable                   │
│  ✔ Exportación independiente                  │
│  ✔ Firma electrónica PAdES-LTA                │
└───────────────────────────────────────────────┘
```

Extensiones futuras (análisis, almacenamiento especial, notarización) se plantean como **capas independientes**, sin afectar a la custodia ya realizada.

---

## Nota final

Este sistema no se apoya en promesas, procedimientos internos o confianza implícita.
Se apoya en **verificabilidad**, **rastro técnico** y **principios de custodia** trasladados al ámbito digital.

## Rol profesional y alcance de intervención

Este sistema ha sido diseñado y documentado por un **perito forense digital**, 
actuando exclusivamente en el ámbito técnico de:

- diseño de sistemas de custodia digital,
- preservación de integridad y trazabilidad de evidencias,
- verificación técnica de inmutabilidad y encadenado de eventos,
- definición de mecanismos de exportación y verificación independiente.

La intervención pericial se limita **única y exclusivamente** a aspectos
técnicos y estructurales del sistema.

Este documento **no constituye**:
- una certificación de hechos,
- una valoración del contenido de la evidencia,
- una conclusión pericial sobre la veracidad de los datos,
- ni una interpretación jurídica de los mismos.

Cualquier análisis, interpretación o conclusión pericial deberá realizarse
sobre evidencias concretas, en un contexto procesal específico, y mediante
el correspondiente informe pericial independiente.

Neiland85
Neil M. - Digital Forensic Expert

# Evidence System

## Sistema de Custodia Digital de Evidencias

---

> **Documento descriptivo orientado a peritos judiciales, profesionales del derecho y órganos jurisdiccionales.**
> No requiere conocimientos técnicos para su comprensión.

---

## Índice

* [Objeto del sistema](#objeto-del-sistema)
* [Qué problema resuelve](#qué-problema-resuelve)
* [Garantías que ofrece](#garantías-que-ofrece)
* [Cómo se protege la evidencia](#cómo-se-protege-la-evidencia)
* [Verificación independiente](#verificación-independiente)
* [Exportación probatoria](#exportación-probatoria)
* [Firma y anclaje legal](#firma-y-anclaje-legal)
* [Qué NO hace el sistema](#qué-no-hace-el-sistema)
* [Validez pericial](#validez-pericial)
* [Estado del sistema](#estado-del-sistema)

---

## Objeto del sistema

**Evidence System** es un sistema diseñado para **custodiar evidencias digitales** garantizando que:

* no puedan ser modificadas posteriormente,
* cualquier intento de alteración sea detectable,
* y terceros puedan verificar la integridad de la evidencia **sin confiar en el sistema original**.

Su finalidad es **preservar prueba digital** de forma **trazable, verificable y defendible**.

---

## Qué problema resuelve

En muchos sistemas digitales:

* los registros pueden modificarse,
* la trazabilidad depende de la buena fe del operador,
* la prueba solo es válida “mientras el sistema existe”.

Este sistema elimina esos problemas creando una **cadena de custodia digital sólida**, comparable a una **cadena de custodia física**, pero aplicada a información digital.

---

## Garantías que ofrece

### Garantías fundamentales

```
┌───────────────────────────────────────────────┐
│  GARANTÍAS DEL SISTEMA                         │
├───────────────────────────────────────────────┤
│  • La evidencia no puede ser modificada        │
│  • El orden de los hechos es verificable       │
│  • Toda alteración es detectable               │
│  • La verificación no depende del proveedor    │
└───────────────────────────────────────────────┘
```

Estas garantías **no dependen de procedimientos internos**, sino que están **impuestas por el propio diseño del sistema**.

---

## Cómo se protege la evidencia

Cada hecho relevante (ingreso de evidencia, exportación, firma, etc.) se registra como un **evento encadenado**:

* Cada evento referencia al anterior.
* Si se altera uno, se rompe la cadena.
* El sistema impide borrar o modificar eventos ya registrados.

Esto equivale, en términos conceptuales, a **numerar y sellar cada hoja de un expediente**, de modo que no pueda extraerse ni sustituirse sin dejar rastro.

---

## Verificación independiente

Una característica esencial del sistema es que **la verificación no requiere confiar en la aplicación ni en la base de datos original**.

La integridad puede comprobarse mediante:

* una función de verificación interna (para uso técnico),
* o mediante herramientas externas, sin acceso al sistema.

```
┌───────────────────────────────────────────────┐
│  PRINCIPIO CLAVE                              │
├───────────────────────────────────────────────┤
│  “No hay que confiar en el sistema:            │
│   hay que poder comprobarlo.”                  │
└───────────────────────────────────────────────┘
```

---

## Exportación probatoria

El sistema permite generar una **exportación probatoria** en formato ZIP que incluye:

* los registros de hechos,
* un manifiesto de huellas digitales (hashes),
* y, opcionalmente, los ficheros asociados.

Este archivo puede:

* conservarse fuera del sistema,
* entregarse a un tercero,
* analizarse sin conexión ni acceso interno.

---

## Firma y anclaje legal

Para reforzar el valor jurídico, la exportación puede anclarse mediante:

* un **documento PDF** que describe la exportación,
* la **huella digital** del archivo ZIP,
* y una **firma electrónica avanzada de tipo PAdES-LTA**.

Este tipo de firma:

* incorpora sellado temporal,
* permite verificación a largo plazo,
* es verificable con herramientas estándar europeas.

---

## Qué NO hace el sistema

Es importante aclarar los límites del sistema:

```
┌───────────────────────────────────────────────┐
│  EL SISTEMA NO:                               │
├───────────────────────────────────────────────┤
│  • Decide hechos o interpreta pruebas         │
│  • Sustituye al criterio pericial             │
│  • Garantiza la veracidad del contenido        │
│  • Actúa como juez o evaluador                 │
└───────────────────────────────────────────────┘
```

El sistema **no juzga**, **no interpreta** y **no concluye**.
Únicamente **preserva y protege** la evidencia.

---

## Validez pericial

Desde un punto de vista pericial, el sistema es relevante porque:

* permite demostrar **integridad**, no solo afirmarla,
* separa claramente custodia, análisis y conclusión,
* facilita la explicación técnica ante terceros,
* y reduce la dependencia de declaraciones del proveedor.

El diseño está pensado para **escenarios de revisión hostil**.

---

## Estado del sistema

Actualmente el sistema proporciona:

```
┌───────────────────────────────────────────────┐
│  ESTADO ACTUAL                                │
├───────────────────────────────────────────────┤
│  ✔ Custodia inmutable de evidencias           │
│  ✔ Trazabilidad verificable                   │
│  ✔ Exportación independiente                  │
│  ✔ Firma electrónica PAdES-LTA                │
└───────────────────────────────────────────────┘
```

Extensiones futuras (análisis, almacenamiento especial, notarización) se plantean como **capas independientes**, sin afectar a la custodia ya realizada.

---

## Nota final

Este sistema no se apoya en promesas, procedimientos internos o confianza implícita.
Se apoya en **verificabilidad**, **rastro técnico** y **principios de custodia** trasladados al ámbito digital.

## Rol profesional y alcance de intervención

Este sistema ha sido diseñado y documentado por un **perito forense digital**, 
actuando exclusivamente en el ámbito técnico de:

- diseño de sistemas de custodia digital,
- preservación de integridad y trazabilidad de evidencias,
- verificación técnica de inmutabilidad y encadenado de eventos,
- definición de mecanismos de exportación y verificación independiente.

La intervención pericial se limita **única y exclusivamente** a aspectos
técnicos y estructurales del sistema.

Este documento **no constituye**:
- una certificación de hechos,
- una valoración del contenido de la evidencia,
- una conclusión pericial sobre la veracidad de los datos,
- ni una interpretación jurídica de los mismos.

Cualquier análisis, interpretación o conclusión pericial deberá realizarse
sobre evidencias concretas, en un contexto procesal específico, y mediante
el correspondiente informe pericial independiente.

Neiland85
Neil M. - Digital Forensic Expert
