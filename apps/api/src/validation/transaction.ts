import { NewTransactionInput } from "../services/transaction-service";

// validation is needed here as well as in the frontend, since if the frontend is bypassed the api should not accept invalid data

export enum CardBrand {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  AMEX = "AMEX",
  DISCOVER = "DISCOVER",
}

const MERCHANT_CHAR_MIN = 2
const MERCHANT_CHAR_MAX = 100
// letters/digits first, then letters, digits, spaces & ' . , -
const MERCHANT_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} &'.,-]*$/u

export type ValidationResult =
  | { ok: true; value: NewTransactionInput }
  | { ok: false; errors: string[] }

const isCardBrand = (value: unknown): value is CardBrand =>
  Object.values(CardBrand).includes(value as CardBrand)

const hasAtMostTwoDecimals = (n: number): boolean => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6

export const validateNewTransaction = (body: unknown): ValidationResult => {
  const { merchantName, cardBrand, amount } = (body ?? {}) as Record<string, unknown>
  const errors: string[] = []

  const name = typeof merchantName === "string" ? merchantName.trim() : ""
  if (!name) errors.push("merchantName is required")
  else if (name.length < MERCHANT_CHAR_MIN || name.length > MERCHANT_CHAR_MAX) {
    errors.push(`merchantName must be ${MERCHANT_CHAR_MIN}-${MERCHANT_CHAR_MAX} characters`)
  } else if (!MERCHANT_PATTERN.test(name)) {
    errors.push("merchantName may only contain letters, numbers, spaces and & ' . , -")
  }

  if (!isCardBrand(cardBrand)) {
    errors.push(`cardBrand must be one of ${Object.values(CardBrand).join(", ")}`)
  }

  if (typeof amount !== "number" || !Number.isFinite(amount)) errors.push("amount must be a number")
  else if (amount <= 0) errors.push("amount must be greater than 0")
  else if (!hasAtMostTwoDecimals(amount)) errors.push("amount must have at most 2 decimal places")

  if (errors.length) return { ok: false, errors }
  return { ok: true, value: { merchantName: name, cardBrand: cardBrand as CardBrand, amount: amount as number } }
}