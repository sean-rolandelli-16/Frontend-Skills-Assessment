import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Form, Input, message, Select, Space } from "antd"

import { CardBrand } from "../models/transaction"
import { createTransaction } from "../services/transaction-service"
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined"

const MERCHANT_CHAR_MIN = 2
const MERCHANT_CHAR_MAX = 100
// letters/digits first, then letters, digits, spaces & ' . , -
const MERCHANT_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} &'.,-]*$/u

// digits, optional 2 decimals; no sign, commas or exponents
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/

interface FormValues {
  merchantName: string
  cardBrand: CardBrand
  amount: string
}

export const NewTransactionPage = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true)
    setError(null)
    try {
      await createTransaction({
        merchantName: values.merchantName.trim(),
        cardBrand: values.cardBrand,
        amount: Number(values.amount),
      })
      message.success("Transaction created")
      navigate("/")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="new-transaction">

      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/")} style={{ paddingLeft: 0 }}>
        Back to transactions
      </Button>

      <h2>New Transaction</h2>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <Form<FormValues>
        layout="vertical"
        initialValues={{ cardBrand: CardBrand.VISA }}
        onFinish={handleSubmit}
        disabled={submitting}
      >
        <Form.Item
          label="Merchant name"
          name="merchantName"
          rules={[
            { required: true, whitespace: true, message: "Enter a merchant name" },
            {
              validator: (_, value: string | undefined) => {
                const name = value?.trim() ?? ""
                if (!name) return Promise.resolve()
                if (name.length < MERCHANT_CHAR_MIN || name.length > MERCHANT_CHAR_MAX) {
                  return Promise.reject(new Error(`Must be ${MERCHANT_CHAR_MIN}-${MERCHANT_CHAR_MAX} characters`))
                }
                if (!MERCHANT_PATTERN.test(name)) {
                  return Promise.reject(new Error("Use letters, numbers, spaces and & ' . , - only"))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input maxLength={MERCHANT_CHAR_MAX} />
        </Form.Item>

        <Form.Item label="Card brand" name="cardBrand" rules={[{ required: true }]}>
          <Select options={Object.values(CardBrand).map((b) => ({ value: b, label: b }))} />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Enter an amount" },
            { pattern: AMOUNT_PATTERN, message: "Enter a dollar amount, e.g. 19.99" },
            {
              validator: (_, value: string | undefined) => {
                if (!value || !AMOUNT_PATTERN.test(value)) return Promise.resolve()
                const n = Number(value)
                if (n <= 0) return Promise.reject(new Error("Amount must be greater than $0"))
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input prefix="$" inputMode="decimal" placeholder="0.00" />
        </Form.Item>

        <Space>
          <Button onClick={() => navigate("/")}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Create
          </Button>
        </Space>
      </Form>

    </div>
  )
}
