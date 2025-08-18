"use client"

import type React from "react"

import { useState } from "react"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { stripePromise } from "@/lib/stripe"

interface PaymentFormProps {
  amount: number
  formData: any
  onSuccess: (applicationId: string) => void
  onError: (error: string) => void
  isSubmitting: boolean
  setIsSubmitting: (submitting: boolean) => void
}

function CheckoutForm({ amount, formData, onSuccess, onError, isSubmitting, setIsSubmitting }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentError, setPaymentError] = useState("")

  const validateForm = () => {
    const requiredFields = [
      { field: formData.organisationName, name: "Organisation name" },
      { field: formData.firstName, name: "First name" },
      { field: formData.lastName, name: "Last name" },
      { field: formData.email, name: "Email" },
      { field: formData.telephone, name: "Telephone" },
      { field: formData.billingAddress.street, name: "Billing address" },
      { field: formData.billingAddress.city, name: "City" },
      { field: formData.billingAddress.postalCode, name: "Postal code" },
    ]

    for (const { field, name } of requiredFields) {
      if (!field || field.trim() === "") {
        return `${name} is required`
      }
    }

    if (!formData.agreeToTerms) {
      return "You must agree to the terms and conditions"
    }

    return null
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const validationError = validateForm()
    if (validationError) {
      setPaymentError(validationError)
      return
    }

    setIsSubmitting(true)
    setPaymentError("")

    try {
      console.log("[v0] Creating payment intent...")

      // Create payment intent
      const paymentIntentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          formData: formData,
        }),
      })

      const { clientSecret, paymentIntentId } = await paymentIntentResponse.json()

      if (!paymentIntentResponse.ok) {
        throw new Error("Failed to create payment intent")
      }

      console.log("[v0] Confirming payment...")

      // Confirm payment
      const cardElement = elements.getElement(CardElement)
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.telephone,
            address: {
              line1: formData.billingAddress.street,
              line2: formData.billingAddress.addressLine2,
              city: formData.billingAddress.city,
              state: formData.billingAddress.county,
              postal_code: formData.billingAddress.postalCode,
              country: formData.billingAddress.country === "United Kingdom" ? "GB" : "US",
            },
          },
        },
      })

      if (error) {
        console.log("[v0] Payment failed:", error.message)
        let errorMessage = error.message || "Payment failed"
        if (error.code === "card_declined") {
          errorMessage = "Your card was declined. Please try a different payment method."
        } else if (error.code === "insufficient_funds") {
          errorMessage = "Insufficient funds. Please check your account balance."
        } else if (error.code === "expired_card") {
          errorMessage = "Your card has expired. Please use a different card."
        }
        setPaymentError(errorMessage)
        return
      }

      console.log("[v0] Payment successful, confirming...")

      const confirmResponse = await fetch("/api/confirm-payment-working", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          formData: {
            ...formData,
            paymentIntentId: paymentIntent.id,
          },
        }),
      })

      const confirmResult = await confirmResponse.json()

      if (!confirmResponse.ok) {
        throw new Error(confirmResult.error || "Failed to confirm payment")
      }

      console.log("[v0] Application saved successfully")
      onSuccess(confirmResult.applicationId)
    } catch (error) {
      console.error("[v0] Payment error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setPaymentError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#334155",
        fontFamily: "system-ui, sans-serif",
        "::placeholder": {
          color: "#94a3b8",
        },
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-slate-200 rounded-lg bg-white">
        <label className="block text-sm font-medium text-slate-700 mb-3">Card Details</label>
        <CardElement options={cardElementOptions} />
      </div>

      {paymentError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
              <p className="text-sm text-red-700 mt-1">{paymentError}</p>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors border-0 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          `Pay £${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  )
}

export function StripePaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
