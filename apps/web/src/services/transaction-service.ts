import type { CardBrand, Transaction, TransactionPage, TransactionSummary } from "../models/transaction"

const API_BASE = "/api"

export const fetchTransactions = async (page: number, pageSize: number, search: string | undefined): Promise<TransactionPage> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) {
    params.set("search", search)
  }
  const rsp = await fetch(`${API_BASE}/transactions?${params}`)
  return rsp.json()
}

export const fetchSummary = async (search: string | undefined): Promise<TransactionSummary> => {
  const params = new URLSearchParams()
  if (search) {
    params.set("search", search)
  }
  const rsp = await fetch(`${API_BASE}/transactions/summary?${params}`)
  return rsp.json()
}

export interface NewTransactionInput {
  merchantName: string
  cardBrand: CardBrand
  amount: number
}

export const createTransaction = async (input: NewTransactionInput): Promise<Transaction> => {
  const rsp = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!rsp.ok) {
    const body = await rsp.json().catch(() => null)
    throw new Error(body?.errors?.join(". ") ?? `Request failed (${rsp.status})`)
  }
  return rsp.json()
}
