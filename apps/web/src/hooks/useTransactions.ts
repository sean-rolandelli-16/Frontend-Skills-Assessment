import { useEffect, useState } from "react"

import type { Transaction, TransactionPage } from "../models/transaction"
import { fetchTransactions } from "../services/transaction-service"

export const useTransactions = (page: number, pageSize: number, search: string | undefined) => {
  const [transactionPage, setTransactionPage] = useState<TransactionPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchTransactions(page, pageSize, search).then((data) => {
      setTransactionPage(data)
    }).catch((e: unknown) => {
      console.error("Failed to fetch transactions", e)
      setTransactionPage(null)
    }).finally(() => {
      setLoading(false)
    })
  }, [page, pageSize, search])

  console.log("TransactionsPage", transactionPage?.transactions, "total:", transactionPage?.total, "search:", search)

  return {
    transactions: transactionPage?.transactions ?? [],
    total: transactionPage?.total ?? 0,
    loading,
    initialLoading: transactionPage === null,
  }
}
