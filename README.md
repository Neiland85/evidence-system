Evidence System
Forensic Ledger · Probative Custody · Offline Verification

Immutable, auditable, and independently verifiable digital evidence custody system.
Designed for forensic, legal, and high-integrity scenarios.

Table of Contents

Overview

Core Guarantees

System Architecture

Database Ledger Model

Application Responsibilities

Forensic Export & Offline Verification

PAdES-LTA Legal Anchoring

Configuration & Environment

Design Principles

Intended Use Cases

Non-Goals

Project Status

Overview

Evidence System is a forensic-grade digital custody platform focused on proof, not convenience.

It provides a cryptographically chained, append-only event ledger, enforced at database level and aligned with strict application-side controls.
All exported artifacts can be verified offline, without access to the original system.

This repository is not a generic backend template.
It is an evidence and custody system designed under the assumption of hostile review.

Core Guarantees

The system enforces the following guarantees by design:

Append-only ledger

No UPDATE or DELETE operations allowed on forensic events.

Enforced via database triggers.

Deterministic ordering

Events are ordered using a monotonic per-expediente sequence (seq).

No reliance on timestamps for integrity.

Cryptographic chaining

Each event references the previous one via prev_hash.

Any manipulation is detectable.

Independent verification

Ledger integrity can be verified directly in SQL.

Exports can be validated offline by third parties.

Fail-fast configuration

All runtime behavior is controlled via validated environment variables.

Misconfiguration prevents startup.

System Architecture

At a high level, the system is composed of four clearly separated layers:

[ Application Layer ]
        |
        v
[ Forensic Ledger (PostgreSQL) ]
        |
        v
[ Export & Verification Artifacts ]
        |
        v
[ Legal Anchoring (PAdES-LTA) ]


Each layer has a single responsibility and can be independently audited.

Database Ledger Model

The eventos table acts as a forensic ledger, not a log.

Key properties:

Monotonic sequence per expediente (seq)

Strict prev_hash validation

UPDATE and DELETE fully blocked

Ledger verification function:

SELECT * FROM verify_expediente_ledger('<EXPEDIENTE_UUID>');


A failed verification indicates tampering or corruption, not a soft warning.

Application Responsibilities

The application layer is intentionally constrained:

Hashes are computed only in the application

SQL never recalculates or “decides” hashes

Database logic is defensive, not business-driven

All writes to the ledger are append-only and validated

This separation ensures that no hidden logic exists in the database.

Forensic Export & Offline Verification

The system can generate a forensic-grade ZIP export containing:

Canonical JSON artifacts

Cryptographic hash manifest

Ledger snapshot

Optional binary evidence (when available)

Export
npx ts-node src/scripts/export-zip.ts

Offline verification
npx ts-node src/scripts/verify-zip.ts


Verification does not require:

Database access

Application code

Network connectivity

PAdES-LTA Legal Anchoring

Exports can be legally anchored using PAdES-LTA:

A PDF “Acta de Exportación” is generated referencing the ZIP hash

The PDF is signed with a qualified certificate

Timestamping (TSA) enables long-term validation

Verification can be performed using ETSI DSS tools, independently of this system.

Configuration & Environment

All configuration is centralized and strictly validated:

Single source of truth: src/config/env.ts

.env.example documents all required variables

.env is never committed

Missing or invalid configuration causes startup failure

This eliminates implicit behavior and environment drift.

Design Principles

Verification over trust

Immutability over convenience

Determinism over timestamps

Explicit constraints over conventions

Defense in depth

The system is designed assuming external scrutiny.

Intended Use Cases

Digital forensic custody

Legal evidence preservation

Audit-grade event tracking

Compliance-driven systems

High-integrity investigative workflows

Non-Goals

This system intentionally does not aim to be:

A generic CRUD backend

A soft-delete based audit log

A mutable event store

A trust-based logging solution

Project Status

Current capabilities:

✅ Database-enforced forensic ledger

✅ Application-level cryptographic chaining

✅ Offline-verifiable exports

✅ PAdES-LTA legal anchoring

Future extensions (NLP analysis, WORM storage, notarization) are designed as optional, isolated layers.

License

MIT — see LICENSE.

Por qué este diseño funciona (resumen rápido)

El README explica garantías, no features.

La estructura guía a:

desarrolladores

auditores

peritos

No hay promesas vagas: todo lo descrito existe en el código.

Es fácil de leer, pero difícil de refutar.

Si quieres, el siguiente refinado puede ser:

añadir diagramas Mermaid

una versión corta (README_PUBLIC.md)

o un README orientado a juzgado / peritos (lenguaje no técnico)

Dime cómo lo dejamos redondo.

traducelo a español

Aquí tienes el README completamente traducido al español, manteniendo el tono profesional, la precisión técnica y el enfoque pericial del original. Puedes copiar/pegar y reemplazar el README actual.

Evidence System
Ledger Forense · Custodia Probatoria · Verificación Offline

Sistema de custodia de evidencia digital inmutable, auditable y verificable de forma independiente.
Diseñado para escenarios forenses, legales y de alta integridad.

Tabla de Contenidos

Visión general

Garantías principales

Arquitectura del sistema

Modelo de ledger en base de datos

Responsabilidades de la aplicación

Exportación forense y verificación offline

Anclaje legal PAdES-LTA

Configuración y entorno

Principios de diseño

Casos de uso previstos

No objetivos

Estado del proyecto

Visión general

Evidence System es una plataforma de custodia digital de grado forense orientada a la prueba, no a la conveniencia.

Proporciona un ledger de eventos encadenado criptográficamente y append-only, impuesto a nivel de base de datos y alineado con controles estrictos en la aplicación.
Todos los artefactos exportados pueden verificarse offline, sin acceso al sistema original.

Este repositorio no es una plantilla genérica de backend.
Es un sistema de evidencia y custodia, diseñado bajo la asunción de revisión hostil.

Garantías principales

El sistema impone por diseño las siguientes garantías:

Ledger append-only

No se permiten operaciones UPDATE ni DELETE sobre eventos forenses.

Impuesto mediante triggers en base de datos.

Orden determinista

Los eventos se ordenan mediante una secuencia monotónica por expediente (seq).

No se depende de marcas temporales para la integridad.

Encadenado criptográfico

Cada evento referencia al anterior mediante prev_hash.

Cualquier manipulación es detectable.

Verificación independiente

La integridad del ledger puede verificarse directamente en SQL.

Las exportaciones pueden validarse offline por terceros.

Configuración fail-fast

Todo el comportamiento en runtime se controla mediante variables de entorno validadas.

Una configuración inválida impide el arranque.

Arquitectura del sistema

A alto nivel, el sistema se compone de cuatro capas claramente separadas:

[ Capa de Aplicación ]
        |
        v
[ Ledger Forense (PostgreSQL) ]
        |
        v
[ Artefactos de Exportación y Verificación ]
        |
        v
[ Anclaje Legal (PAdES-LTA) ]


Cada capa tiene una única responsabilidad y puede auditarse de forma independiente.

Modelo de ledger en base de datos

La tabla eventos actúa como un ledger forense, no como un log.

Propiedades clave:

Secuencia monotónica por expediente (seq)

Validación estricta de prev_hash

Bloqueo total de UPDATE y DELETE

Función de verificación del ledger:

SELECT * FROM verify_expediente_ledger('<UUID_DEL_EXPEDIENTE>');


Una verificación fallida indica manipulación o corrupción, no un aviso blando.

Responsabilidades de la aplicación

La capa de aplicación está intencionadamente restringida:

Los hashes se calculan únicamente en la aplicación

SQL nunca recalcula ni “decide” hashes

La lógica en base de datos es defensiva, no de negocio

Todas las escrituras en el ledger son append-only y validadas

Esta separación garantiza que no exista lógica oculta en la base de datos.

Exportación forense y verificación offline

El sistema puede generar una exportación ZIP de grado forense que incluye:

Artefactos JSON canónicos

Manifiesto criptográfico de hashes

Snapshot del ledger

Inclusión opcional de binarios (cuando estén disponibles)

Exportación
npx ts-node src/scripts/export-zip.ts

Verificación offline
npx ts-node src/scripts/verify-zip.ts


La verificación no requiere:

Acceso a la base de datos

Código de la aplicación

Conectividad de red

Anclaje legal PAdES-LTA

Las exportaciones pueden anclarse legalmente mediante PAdES-LTA:

Se genera un PDF “Acta de Exportación” que referencia el hash del ZIP

El PDF se firma con un certificado cualificado

El sellado temporal (TSA) permite validación a largo plazo

La verificación puede realizarse con herramientas ETSI DSS, independientemente de este sistema.

Configuración y entorno

Toda la configuración está centralizada y estrictamente validada:

Fuente única de verdad: src/config/env.ts

.env.example documenta todas las variables requeridas

.env nunca se versiona

Variables faltantes o inválidas impiden el arranque

Esto elimina comportamientos implícitos y deriva de entorno.

Principios de diseño

Verificación por encima de confianza

Inmutabilidad por encima de conveniencia

Determinismo por encima de timestamps

Restricciones explícitas por encima de convenciones

Defensa en profundidad

El sistema se diseña asumiendo escrutinio externo.

Casos de uso previstos

Custodia digital forense

Preservación de evidencia legal

Trazabilidad de eventos con nivel de auditoría

Sistemas orientados a cumplimiento normativo

Flujos de investigación de alta integridad

No objetivos

Este sistema no pretende ser:

Un backend CRUD genérico

Un sistema de auditoría con soft-delete

Un event store mutable

Una solución basada en supuestos de confianza

Estado del proyecto

Capacidades actuales:

✅ Ledger forense impuesto por base de datos

✅ Encadenado criptográfico a nivel de aplicación

✅ Exportaciones verificables offline

✅ Anclaje legal mediante PAdES-LTA

Las extensiones futuras (análisis NLP, almacenamiento WORM, notarización) se diseñan como capas opcionales e independientes.

Licencia

MIT — ver LICENSE.
