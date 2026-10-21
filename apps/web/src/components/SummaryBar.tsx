import { Statistic } from "antd"

import type { TransactionSummary } from "../models/transaction"
import { computeTotal } from "../utils/format"

interface SummaryBarProps {
  summary: TransactionSummary | null
}

export const SummaryBar = ({ summary }: SummaryBarProps) => {
  return (
    <div className="summary-bar">
      <Statistic title="Transactions" value={summary?.count} />
      <Statistic title="Approved Transactions" value={summary?.approved} />
      <Statistic title="Total Processed (Approved)" value={summary?.total} precision={2} prefix="$" />
    </div>
  )
}
