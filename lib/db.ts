import { Pool, QueryResult, QueryResultRow } from 'pg'

let pool: Pool | null = null

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, 
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}
export async function query<T extends QueryResultRow>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool()
  return pool.query<T>(text, params)
}
export default getPool()