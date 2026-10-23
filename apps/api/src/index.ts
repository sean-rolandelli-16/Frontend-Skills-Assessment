import express from "express"
import type { NextFunction, Request, Response } from "express"
import cors from "cors"

import { PORT } from "./config.js"
import { createTransactionService } from "./services/transaction-service.js"
import { validateNewTransaction } from "./validation/transaction.js"

const app = express()

app.use(cors({ origin: "*", credentials: true }))
app.use(express.json())

const transactionService = createTransactionService()

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" })
})

app.get("/api/transactions", (req: Request, res: Response) => {
  console.log("GET /api/transactions", req.query)
  const transactionPage = transactionService.getPage(req.query.page, req.query.pageSize, req.query.search)
  res.json(transactionPage )
})

app.get("/api/transactions/summary", (req: Request, res: Response) => {
  res.json(transactionService.getSummary(req.query.search))
})

app.post("/api/transactions", (req: Request, res: Response) => {
  const { merchantName, cardBrand, amount } = req.body
  const result = validateNewTransaction({ merchantName, cardBrand, amount })
  if (!result.ok) {
    return res.status(400).json({ errors: result.errors })
  }
  const transaction = transactionService.create(result.value)
  res.status(201).json(transaction)
})

app.get("/api/transactions/:id", (req: Request, res: Response) => {
  const transaction = transactionService.getById(req.params.id)
  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" })
  }
  res.json(transaction)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message, stack: err.stack })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT} (${transactionService.getAll().length} transactions)`)
})
