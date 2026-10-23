import { useEffect, useState } from "react"

import type { Transaction } from "../models/transaction"
import { fetchTransaction } from "../services/transaction-service"

const TRANSACTION_ID_PATTERN = /^txn_\d+$/

export const useTransaction = (id: string | undefined) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTransaction(null)
    setError(null)

    // malformed id: skip the request, render as not found
    if (!id || !TRANSACTION_ID_PATTERN.test(id)) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetchTransaction(id).then((data) => {
      setTransaction(data)
    })
      .catch((e: unknown) => {
        console.error("Failed to fetch transaction", e)
        setError(e instanceof Error ? e.message : "Something went wrong")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const notFound = !loading && !error && transaction === null

  return { transaction, loading, error, notFound }
}