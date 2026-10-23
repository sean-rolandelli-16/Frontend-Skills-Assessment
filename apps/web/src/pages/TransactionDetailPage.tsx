import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Descriptions, Result, Spin, Tag } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"

import { useTransaction } from "../hooks/useTransaction"
import type { Transaction } from "../models/transaction"
import { formatCurrency, formatDate } from "../utils/format"
import { statusTagColor } from "../utils/status"

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => (
  <>
    <header className="app-header">
      <h1 className="mono">{transaction.id}</h1>
      <Tag color={statusTagColor(transaction.status)}>{transaction.status}</Tag>
    </header>

    <Descriptions
      column={1}
      size="middle"
      bordered
      items={[
        { key: "merchant", label: "Merchant", children: transaction.merchantName },
        { key: "card", label: "Card brand", children: transaction.cardBrand },
        { key: "amount", label: "Amount", children: formatCurrency(transaction.amount) },
        {
          key: "surcharge",
          label: "Surcharge",
          children: `${formatCurrency(transaction.surcharge)} (${(transaction.surchargeRate * 100).toFixed(1)}%)`,
        },
        { key: "total", label: "Total", children: formatCurrency(transaction.total) },
        { key: "date", label: "Date", children: formatDate(transaction.createdAt) },
      ]}
    />
  </>
)

export const TransactionDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { transaction, loading, error, notFound } = useTransaction(id)

  return (
    <div className="transaction-detail">
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/")} style={{ paddingLeft: 0 }}>
        Back to transactions
      </Button>

      {loading && (
        <div className="app-loading">
          <Spin size="large" />
        </div>
      )}

      {notFound && (
        <Result status="404" title="Transaction not found" subTitle={`No transaction with id "${id}".`} />
      )}

      {error && <Alert type="error" showIcon message={error} />}

      {transaction && <TransactionDetails transaction={transaction} />}
    </div>
  )
}