"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

const industries = [
  // Left column
  [
    "Campgrounds and Caravan Sites",
    "Care, Retirement and Sheltered schemes",
    "Corporations (office spaces, manufacturing etc)",
    "Doctors, Dentists & Healthcare",
    "Hairdressers, Beauty Salons and Tattoo Studios",
    "Libraries",
    "Nursing Schemes",
    "Residential Living",
    "Sports and Social Clubs",
  ],
  // Right column
  [
    "Car Dealerships",
    "Centres (community centre, village hall or similar)",
    "Day Centres",
    "Gym and Health Clubs",
    "Hotels, Resorts and Bars",
    "Nurseries",
    "Performing Arts",
    "Schools",
    "Takeaway, Café & Restaurants",
  ],
]

const industryPricing = {
  "Sports and Social Clubs": 25.0,
  "Hotels, Resorts and Bars": 45.0,
  Schools: 20.0,
  "Corporations (office spaces, manufacturing etc)": 35.0,
  "Gym and Health Clubs": 30.0,
  // Default pricing for other industries
  default: 25.0,
}

export function FilmbankmediaLicenceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedIndustry, setSelectedIndustry] = useState("Sports and Social Clubs")
  const [quantity, setQuantity] = useState(1)
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [formData, setFormData] = useState({
    organisationName: "",
    firstName: "",
    lastName: "",
    telephone: "",
    jobTitle: "",
    email: "",
    billingAddress: {
      street: "",
      addressLine2: "",
      city: "",
      county: "",
      country: "United Kingdom",
      postalCode: "",
    },
    premisesAddress: {
      street: "",
      addressLine2: "",
      city: "",
      county: "",
      country: "United Kingdom",
      postalCode: "",
    },
    agreeToTerms: false,
    paymentMethod: "",
  })

  const getPrice = () => {
    return industryPricing[selectedIndustry as keyof typeof industryPricing] || industryPricing.default
  }

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else {
      // Handle form submission
      console.log("Form submitted:", { selectedIndustry, quantity, formData })
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateAddressData = (addressType: "billingAddress" | "premisesAddress", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value,
      },
    }))
  }

  const unitPrice = getPrice()
  const subtotal = unitPrice * quantity
  const total = subtotal

  if (currentStep === 1) {
    return (
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="bg-slate-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <Image src="/filmbank-logo.png" alt="Filmbankmedia" width={200} height={40} className="h-8 w-auto" />
            <h1 className="text-2xl font-semibold text-white tracking-wide">Blanket Licence</h1>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-2">Step 1 of 2 - Choose your industry.</p>
            <Progress value={0} className="h-2" />
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium text-slate-900 mb-6">
              Choose your industry. <span className="text-slate-500">(Required)</span>
            </h2>

            <RadioGroup
              value={selectedIndustry}
              onValueChange={setSelectedIndustry}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-3">
                {industries[0].map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <RadioGroupItem value={industry} id={industry} className="text-sky-500 border-slate-300" />
                    <Label htmlFor={industry} className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {industries[1].map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <RadioGroupItem value={industry} id={industry} className="text-sky-500 border-slate-300" />
                    <Label htmlFor={industry} className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="mb-8">
            <p className="text-sm text-slate-600">Don't see your industry? Contact us. +44 (0) 20 3866 6500</p>
          </div>

          <div className="flex justify-start">
            <Button
              onClick={handleNext}
              className="px-8 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors border-0"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="bg-slate-700 px-6 py-6">
        <div className="flex items-center justify-between">
          <Image src="/filmbank-logo.png" alt="Filmbankmedia" width={200} height={40} className="h-8 w-auto" />
          <h1 className="text-2xl font-semibold text-white tracking-wide">Blanket Licence</h1>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-2">Step 2 of 2 - Enter payment details.</p>
          <Progress value={50} className="h-2" />
        </div>

        {/* Quantity Selection */}
        <div className="mb-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">How many licences do you want to purchase?</h3>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="w-20"
            />
            <span className="text-sm text-slate-600">£{unitPrice.toFixed(2)} each</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 border-b border-slate-200 pb-2">
            Enter Payment Details
          </h2>

          {/* Organisation Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Organisation details</h3>
            <Input
              placeholder="Organisation name"
              value={formData.organisationName}
              onChange={(e) => updateFormData("organisationName", e.target.value)}
              className="mb-4"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-slate-700 mb-2 block">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-slate-700 mb-2 block">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="telephone" className="text-sm font-medium text-slate-700 mb-2 block">
                Telephone
              </Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => updateFormData("telephone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="jobTitle" className="text-sm font-medium text-slate-700 mb-2 block">
                Job Title/Position
              </Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => updateFormData("jobTitle", e.target.value)}
                placeholder="Enter your job title"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700 mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
            />
          </div>

          {/* Billing Address */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Billing Address</h3>
            <div className="space-y-4">
              <Input
                placeholder="Street Address"
                value={formData.billingAddress.street}
                onChange={(e) => updateAddressData("billingAddress", "street", e.target.value)}
              />
              <Input
                placeholder="Address Line 2"
                value={formData.billingAddress.addressLine2}
                onChange={(e) => updateAddressData("billingAddress", "addressLine2", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  value={formData.billingAddress.city}
                  onChange={(e) => updateAddressData("billingAddress", "city", e.target.value)}
                />
                <Input
                  placeholder="County/State/Region"
                  value={formData.billingAddress.county}
                  onChange={(e) => updateAddressData("billingAddress", "county", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={formData.billingAddress.country}
                  onValueChange={(value) => updateAddressData("billingAddress", "country", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Postal Code"
                  value={formData.billingAddress.postalCode}
                  onChange={(e) => updateAddressData("billingAddress", "postalCode", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Premises Address */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Premises Address</h3>
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sameAsBilling"
                  checked={sameAsBilling}
                  onCheckedChange={(checked) => {
                    setSameAsBilling(checked as boolean)
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        premisesAddress: { ...prev.billingAddress },
                      }))
                    }
                  }}
                />
                <Label htmlFor="sameAsBilling" className="text-sm text-slate-700">
                  Same as billing address
                </Label>
              </div>
            </div>
            {!sameAsBilling && (
              <div className="space-y-4">
                <Input
                  placeholder="Street Address"
                  value={formData.premisesAddress.street}
                  onChange={(e) => updateAddressData("premisesAddress", "street", e.target.value)}
                />
                <Input
                  placeholder="Address Line 2"
                  value={formData.premisesAddress.addressLine2}
                  onChange={(e) => updateAddressData("premisesAddress", "addressLine2", e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={formData.premisesAddress.city}
                    onChange={(e) => updateAddressData("premisesAddress", "city", e.target.value)}
                  />
                  <Input
                    placeholder="County/State/Region"
                    value={formData.premisesAddress.county}
                    onChange={(e) => updateAddressData("premisesAddress", "county", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    value={formData.premisesAddress.country}
                    onValueChange={(value) => updateAddressData("premisesAddress", "country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Postal Code"
                    value={formData.premisesAddress.postalCode}
                    onChange={(e) => updateAddressData("premisesAddress", "postalCode", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="mb-8 p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Subtotal</span>
              <span className="text-sm font-medium">£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="mb-6">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
              />
              <Label htmlFor="terms" className="text-sm text-slate-700 leading-relaxed">
                I agree to the licensing terms & conditions and privacy policy
              </Label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Choose your payment method</h3>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => updateFormData("paymentMethod", value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Pay by Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="invoice" id="invoice" />
                <Label htmlFor="invoice">Pay by Invoice</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              className="px-8 py-2 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!formData.agreeToTerms || !formData.paymentMethod}
              className="px-8 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors border-0 disabled:opacity-50"
            >
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
