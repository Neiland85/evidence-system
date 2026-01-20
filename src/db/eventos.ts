import { PoolClient } from "pg";

export async function getLastEventHash(
  client: PoolClient,
  expedienteId: string
): Promise<string | null> {
  const { rows } = await client.query(
    `
    SELECT hash
    FROM eventos
    WHERE expediente_id = $1
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [expedienteId]
  );

  return rows.length ? (rows[0].hash as string) : null;
}
