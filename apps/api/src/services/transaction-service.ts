import _ from "lodash"

import { TransactionStatus } from "../models/transaction.js"
import type { CardBrand, Transaction } from "../models/transaction.js"
import { loadTransactions } from "../data/transactions.js"

export interface TransactionSummary {
  count: number
  approved: number
  total: number
}

export interface NewTransactionInput {
  merchantName: string
  cardBrand: CardBrand
  amount: number
}

export interface TransactionPage {
  transactions: Transaction[]
  total: number
  page: number
  pageSize: number
}

// same criteria as the front-end search filter used to use
const matchesSearch = (t: Transaction, term: string): boolean =>
  t.merchantName.toLowerCase().includes(term) ||
  t.id.toLowerCase().includes(term) ||
  t.cardBrand.toLowerCase().includes(term) ||
  t.status.toLowerCase().includes(term)

export const createTransactionService = () => {
  const transactions = loadTransactions()

  const filterBySearch = (rawSearch: unknown): Transaction[] => {
    const term = typeof rawSearch === "string" ? rawSearch.trim().toLowerCase() : ""
    return term ? transactions.filter((t) => matchesSearch(t, term)) : transactions
  }

  const getAll = (): Transaction[] => transactions

  const getPage = (page: unknown, pageSize: unknown, search: unknown): TransactionPage => {
    const pageSafe = parseInt(page as string) || 1
    const pageSizeSafe = parseInt(pageSize as string) || 25
    const start = (pageSafe - 1) * pageSizeSafe // page is 1 based

    const matches = filterBySearch(search)

    return {
      transactions: matches.slice(start, start + pageSizeSafe),
      total: matches.length, // this counts all transactions proccessed, not just the current page
      page: pageSafe,
      pageSize: pageSizeSafe,
    }
  }

  const getById = (id: string): Transaction | undefined => transactions.find((t) => t.id === id)

  const getSummary = (search: unknown): TransactionSummary => {
    const matches = filterBySearch(search)
    const approved = matches.filter((t) => t.status === TransactionStatus.APPROVED)
    return {
      count: matches.length,
      approved: approved.length,
      total: _.round(_.sumBy(approved, "total"), 2),
    }

  }

  const create = (input: NewTransactionInput): Transaction => {
    // surcharge is different based on area and type of transaction from what I know
    // so it would need to be calculated here, using placeholder examples
    // I am assuming this is always an online purchase as well for simplicity

    const surchargeRate = 0.029
    const surcharge = _.round(input.amount * surchargeRate, 2)

    const transaction: Transaction = {
      id: `txn_${String(transactions.length + 1).padStart(6, "0")}`,
      merchantName: input.merchantName,
      cardBrand: input.cardBrand,
      amount: input.amount,
      surchargeRate: surchargeRate,
      surcharge: surcharge,
      total: input.amount + surcharge,
      status: TransactionStatus.APPROVED,
      createdAt: new Date().toISOString(),
    }
    transactions.unshift(transaction)
    return transaction
  }

  return { getAll, getPage, getById, getSummary, create }
}

export type TransactionService = ReturnType<typeof createTransactionService>
