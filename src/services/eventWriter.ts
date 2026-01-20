import { randomUUID } from "crypto";
import { PoolClient } from "pg";
import { canonicalize, sha256 } from "../crypto/ledger";
import { getLastEventHash } from "../db/eventos";

export async function appendEvent(
  client: PoolClient,
  params: {
    expedienteId: string;
    tipo: string;
    actor: string;
    datos: unknown;
  }
) {
  const prevHash = await getLastEventHash(client, params.expedienteId);

  const eventCore = {
    expedienteId: params.expedienteId,
    tipo_evento: params.tipo,
    actor: params.actor,
    datos: params.datos,
    prev_hash: prevHash,
  };

  const hash = sha256(canonicalize(eventCore));

  await client.query(
    `
    INSERT INTO eventos (
      id,
      expediente_id,
      tipo_evento,
      actor,
      datos,
      prev_hash,
      hash
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
    [
      randomUUID(),
      params.expedienteId,
      params.tipo,
      params.actor,
      params.datos,
      prevHash,
      hash,
    ]
  );

  return { hash, prevHash };
}
