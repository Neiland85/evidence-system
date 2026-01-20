# Evidence System

## Digital Evidence Custody System

---

> **Descriptive document oriented to judicial experts, legal professionals, and judicial bodies.**
> It does not require technical knowledge for its understanding.

---

## Index

* [Purpose of the system](#purpose-of-the-system)
* [What problem it solves](#what-problem-it-solves)
* [Guarantees it provides](#guarantees-it-provides)
* [How the evidence is protected](#how-the-evidence-is-protected)
* [Independent verification](#independent-verification)
* [Probative export](#probative-export)
* [Signature and legal anchoring](#signature-and-legal-anchoring)
* [What the system does NOT do](#what-the-system-does-not-do)
* [Forensic validity](#forensic-validity)
* [System status](#system-status)

---

## Purpose of the system

**Evidence System** is a system designed to **custody digital evidence**, guaranteeing that:

* it cannot be modified subsequently,
* any attempt at alteration is detectable,
* and third parties can verify the integrity of the evidence **without trusting the original system**.

Its purpose is to **preserve digital evidence** in a **traceable, verifiable, and defensible** manner.

---

## What problem it solves

In many digital systems:

* records can be modified,
* traceability depends on the good faith of the operator,
* evidence is only valid “as long as the system exists”.

This system eliminates those problems by creating a **solid digital chain of custody**, comparable to a **physical chain of custody**, but applied to digital information.

---

## Guarantees it provides

### Fundamental guarantees

```
┌───────────────────────────────────────────────┐
│  SYSTEM GUARANTEES                            │
├───────────────────────────────────────────────┤
│  • Evidence cannot be modified                │
│  • The order of events is verifiable           │
│  • Any alteration is detectable               │
│  • Verification does not depend on the vendor │
└───────────────────────────────────────────────┘
```

These guarantees **do not depend on internal procedures**, but are **imposed by the system’s own design**.

---

## How the evidence is protected

Each relevant fact (evidence intake, export, signature, etc.) is recorded as a **chained event**:

* Each event references the previous one.
* If one is altered, the chain is broken.
* The system prevents deletion or modification of already recorded events.

Conceptually, this is equivalent to **numbering and sealing each page of a case file**, so that it cannot be removed or replaced without leaving a trace.

---

## Independent verification

An essential characteristic of the system is that **verification does not require trusting the application or the original database**.

Integrity can be checked by:

* an internal verification function (for technical use),
* or by external tools, without access to the system.

```
┌───────────────────────────────────────────────┐
│  KEY PRINCIPLE                                │
├───────────────────────────────────────────────┤
│  “There is no need to trust the system:       │
│   it must be possible to verify it.”          │
└───────────────────────────────────────────────┘
```

---

## Probative export

The system allows generating a **probative export** in ZIP format that includes:

* records of events,
* a digital fingerprint (hash) manifest,
* and, optionally, the associated files.

This file can:

* be preserved outside the system,
* be delivered to a third party,
* be analyzed without connection or internal access.

---

## Signature and legal anchoring

To reinforce legal value, the export can be anchored by means of:

* a **PDF document** describing the export,
* the **digital fingerprint** of the ZIP file,
* and an **advanced electronic signature of the PAdES-LTA type**.

This type of signature:

* incorporates time stamping,
* allows long-term verification,
* is verifiable with standard European tools.

---

## What the system does NOT do

It is important to clarify the limits of the system:

```
┌───────────────────────────────────────────────┐
│  THE SYSTEM DOES NOT:                         │
├───────────────────────────────────────────────┤
│  • Decide facts or interpret evidence          │
│  • Replace forensic judgment                  │
│  • Guarantee the truthfulness of the content  │
│  • Act as judge or evaluator                  │
└───────────────────────────────────────────────┘
```

The system **does not judge**, **does not interpret**, and **does not conclude**.
It only **preserves and protects** the evidence.

---

## Forensic validity

From a forensic point of view, the system is relevant because:

* it allows demonstrating **integrity**, not merely asserting it,
* it clearly separates custody, analysis, and conclusion,
* it facilitates technical explanation to third parties,
* and it reduces dependence on statements from the provider.

The design is intended for **hostile review scenarios**.

---

## System status

Currently, the system provides:

```
┌───────────────────────────────────────────────┐
│  CURRENT STATUS                               │
├───────────────────────────────────────────────┤
│  ✔ Immutable custody of evidence              │
│  ✔ Verifiable traceability                    │
│  ✔ Independent export                         │
│  ✔ PAdES-LTA electronic signature             │
└───────────────────────────────────────────────┘
```

Future extensions (analysis, special storage, notarization) are conceived as **independent layers**, without affecting custody already performed.

---

## Final note

This system does not rely on promises, internal procedures, or implicit trust.
It relies on **verifiability**, **technical trace**, and **custody principles** applied to the digital domain.

---

## Professional role and scope of intervention

This system has been designed and documented by a **digital forensic expert**,
acting exclusively within the technical scope of:

* digital custody system design,
* preservation of evidence integrity and traceability,
* technical verification of immutability and event chaining,
* definition of independent export and verification mechanisms.

The forensic intervention is limited **solely and exclusively** to the
technical and structural aspects of the system.

This document **does not constitute**:

* a certification of facts,
* an assessment of the content of the evidence,
* a forensic conclusion regarding the truthfulness of the data,
* nor a legal interpretation thereof.

Any forensic analysis, interpretation, or conclusion must be carried out
on specific evidence, within a specific procedural context, and through
the corresponding independent forensic report.

Neiland85
Neil M. - Digital Forensic Expert

-------------------------------------------------------------------------------ESPAÑOL
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
