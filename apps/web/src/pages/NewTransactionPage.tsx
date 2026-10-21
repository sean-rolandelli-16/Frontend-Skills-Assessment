import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Input, message, Select } from "antd"

import { CardBrand } from "../models/transaction"
import { createTransaction } from "../services/transaction-service"
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined"

// there is more I would do here, for example:

// placeholder values and prompting the user to enter values
// validation of the input values, for example amount should be a number and greater than 0
// would also have the api reject the transaction if other validation checks fail, for example if the merchant name is empty
// stop the user from submitting the form in general if the input values are invalid
// also it should not be automatically an approved transaction, it should be processed and the status returned from the api

export const NewTransactionPage = () => {
  const navigate = useNavigate()
  const [merchantName, setMerchantName] = useState("")
  const [cardBrand, setCardBrand] = useState<CardBrand>(CardBrand.VISA)
  const [amount, setAmount] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (merchantName: string, cardBrand: CardBrand, amount: string) => {
    setSubmitting(true)
    setError(null)
    try {
      await createTransaction({
        merchantName: merchantName.trim(),
        cardBrand: cardBrand,
        amount: Number(amount),
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

      <div className="form-field">
        <Input
          placeholder="Merchant name"
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
        />
      </div>

      <div className="form-field">
        <Select
          style={{ width: "100%" }}
          value={cardBrand}
          onChange={(value) => setCardBrand(value)}
          options={[
            { value: CardBrand.VISA, label: "VISA" },
            { value: CardBrand.MASTERCARD, label: "MASTERCARD" },
            { value: CardBrand.AMEX, label: "AMEX" },
            { value: CardBrand.DISCOVER, label: "DISCOVER" },
          ]}
        />
      </div>

      <div className="form-field">
        <Input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <Button type="primary" onClick={() => handleSubmit(merchantName, cardBrand, amount)}>
        Create
      </Button>
    </div>
  )
}
