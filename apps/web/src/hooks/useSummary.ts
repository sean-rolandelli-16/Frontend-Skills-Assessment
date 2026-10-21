import { useEffect, useState } from "react"

import type { TransactionSummary } from "../models/transaction"
import { fetchSummary } from "../services/transaction-service"

export const useSummary = (search: string | undefined) => {
  const [summary, setSummary] = useState<TransactionSummary | null>(null)

  useEffect(() => {

    fetchSummary(search).then((data) => {
      setSummary(data)
    })
  }, [search])

  return summary
}