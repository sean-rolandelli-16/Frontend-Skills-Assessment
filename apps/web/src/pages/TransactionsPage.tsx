import { useState } from "react"
import { Empty, Input, Pagination, Spin } from "antd"
import { SearchOutlined } from "@ant-design/icons"

import { SummaryBar } from "../components/SummaryBar"
import { TransactionList } from "../components/TransactionList"
import { TransactionModal } from "../components/TransactionModal"
import { useTransactions } from "../hooks/useTransactions"
import type { Transaction } from "../models/transaction"
import { useSummary } from "../hooks/useSummary"
import { useDebounce } from "../hooks/useDebounce"

const PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 300

export const TransactionsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS)
  const { transactions, total, loading, initialLoading } = useTransactions(page, PAGE_SIZE, debouncedSearch)
  const summary = useSummary(debouncedSearch)

  console.log("render TransactionsPage", transactions.length, "search:", search)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handlePageChange = (next: number) => {
    setPage(next)
    // pager sits at the bottom; start the new page at the top
    window.scrollTo({ top: 0 })
  }

  // full-page spinner on first load only
  if (initialLoading) {
    return (
      <div className="app-loading">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <header className="app-header">
        <h1>Transactions</h1>
        <Input
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
          allowClear
          placeholder="Search merchant, id, card, status..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </header>

      <SummaryBar summary={summary} />

      <Spin spinning={loading}>
        {total === 0 ? (
          <Empty description="No matching transactions" />
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </Spin>

      <Pagination
        style={{ marginTop: 16 }}
        align="center"
        current={page}
        pageSize={PAGE_SIZE}
        total={total}
        showSizeChanger={false}
        showTotal={(t, [from, to]) => `${from}-${to} of ${t}`}
        onChange={handlePageChange}
      />

      {/* <TransactionModal transaction={selected} onClose={() => setSelected(null)} /> */}

    </>
  )
}
