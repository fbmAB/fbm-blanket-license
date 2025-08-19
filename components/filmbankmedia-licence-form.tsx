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
import { StripePaymentForm } from "./stripe-payment-form"

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
  "Care, Retirement and Sheltered schemes": 12.53,
  // Default pricing for other industries
  default: 25.0,
}

const coverageAreaOptions = [
  { value: "1-500", label: "1-500 m2", price: 126.1 },
  { value: "501-750", label: "501-750 m2", price: 189.14 },
  { value: "751-1000", label: "751-1000 m2", price: 252.2 },
]

const industriesRequiringCoverage = [
  "Campgrounds and Caravan Sites",
  "Sports and Social Clubs",
  "Takeaway, Café & Restaurants",
]

const industriesRequiringVAT = [
  "Campgrounds and Caravan Sites",
  "Care, Retirement and Sheltered schemes",
  "Corporations (office spaces, manufacturing etc)",
]

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

export function FilmbankmediaLicenceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedIndustry, setSelectedIndustry] = useState("Sports and Social Clubs")
  const [quantity, setQuantity] = useState(1)
  const [coverageArea, setCoverageArea] = useState("1-500")
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [applicationId, setApplicationId] = useState("")

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
    if (selectedIndustry === "Campgrounds and Caravan Sites") {
      const coverageOption = coverageAreaOptions.find((option) => option.value === coverageArea)
      return coverageOption?.price || 0
    }

    if (selectedIndustry === "Corporations (office spaces, manufacturing etc)") {
      if (quantity <= 30) {
        return 588.9 // Minimum fee for 30 employees or less
      } else {
        const additionalEmployees = quantity - 30
        return 588.9 + additionalEmployees * 19.63 // Fixed calculation: base fee + additional employees beyond 30
      }
    }

    const basePrice = industryPricing[selectedIndustry as keyof typeof industryPricing] || industryPricing.default

    // Add coverage area cost if industry requires it
    if (industriesRequiringCoverage.includes(selectedIndustry)) {
      const coverageOption = coverageAreaOptions.find((option) => option.value === coverageArea)
      return basePrice + (coverageOption?.price || 0)
    }

    return basePrice
  }

  const getVATAmount = () => {
    if (industriesRequiringVAT.includes(selectedIndustry)) {
      const subtotal =
        getPrice() *
        (selectedIndustry === "Campgrounds and Caravan Sites" ||
        selectedIndustry === "Corporations (office spaces, manufacturing etc)"
          ? 1
          : quantity)
      return subtotal * 0.2 // 20% VAT
    }
    return 0
  }

  const getTotalWithVAT = () => {
    const subtotal =
      getPrice() *
      (selectedIndustry === "Campgrounds and Caravan Sites" ||
      selectedIndustry === "Corporations (office spaces, manufacturing etc)"
        ? 1
        : quantity)
    const vat = getVATAmount()
    return subtotal + vat
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else {
      if (formData.paymentMethod === "card") {
        // Card payment will be handled by StripePaymentForm component
        return
      }

      // Handle invoice payment (existing logic)
      setIsSubmitting(true)
      setSubmitError("")

      try {
        const submissionData = {
          selectedIndustry,
          quantity,
          coverageArea: industriesRequiringCoverage.includes(selectedIndustry) ? coverageArea : undefined,
          unitPrice: getPrice(),
          subtotal: getPrice() * quantity,
          total: getPrice() * quantity,
          organisationName: formData.organisationName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          telephone: formData.telephone,
          jobTitle: formData.jobTitle,
          email: formData.email,
          billingAddress: formData.billingAddress,
          premisesAddress: sameAsBilling ? formData.billingAddress : formData.premisesAddress,
          sameAsBilling,
          agreeToTerms: formData.agreeToTerms,
          paymentMethod: formData.paymentMethod,
        }

        const response = await fetch("/api/licence-applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to submit application")
        }

        setApplicationId(result.applicationId)
        setSubmitSuccess(true)
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
      }
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

  const handlePaymentSuccess = (applicationId: string) => {
    setApplicationId(applicationId)
    setSubmitSuccess(true)
  }

  const handlePaymentError = (error: string) => {
    setSubmitError(error)
  }

  const unitPrice = getPrice()
  const subtotal =
    unitPrice *
    (selectedIndustry === "Campgrounds and Caravan Sites" ||
    selectedIndustry === "Corporations (office spaces, manufacturing etc)"
      ? 1
      : quantity)
  const total = industriesRequiringVAT.includes(selectedIndustry) ? getTotalWithVAT() : subtotal

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

  if (submitSuccess) {
    return (
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="bg-slate-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <Image src="/filmbank-logo.png" alt="Filmbankmedia" width={200} height={40} className="h-8 w-auto" />
            <h1 className="text-2xl font-semibold text-white tracking-wide">Blanket Licence</h1>
          </div>
        </CardHeader>

        <CardContent className="p-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Application Submitted Successfully!</h2>
            <p className="text-slate-600 mb-4">
              Thank you for your licence application. We have received your submission and will process it shortly.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600 mb-1">Application ID:</p>
              <p className="font-mono text-sm font-medium text-slate-900">{applicationId}</p>
            </div>
            <p className="text-sm text-slate-600">
              You will receive a confirmation email at <strong>{formData.email}</strong> with further details.
            </p>
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

        {selectedIndustry !== "Campgrounds and Caravan Sites" && (
          <div className="mb-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              {selectedIndustry === "Care, Retirement and Sheltered schemes"
                ? "How many beds on care, residential and Sheltered schemes do you want to licence?"
                : selectedIndustry === "Corporations (office spaces, manufacturing etc)"
                  ? "How many employees do you have?"
                  : "How many licences do you want to purchase?"}
            </h3>
            {selectedIndustry === "Corporations (office spaces, manufacturing etc)" && (
              <p className="text-sm text-slate-600 mb-4">
                Note: minimum fee £588.90+vat applies to companies with 30 employees or less
              </p>
            )}
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-20"
              />
              <span className="text-sm text-slate-600">
                {selectedIndustry === "Corporations (office spaces, manufacturing etc)" ? (
                  quantity <= 30 ? (
                    "£588.90+vat (minimum fee)"
                  ) : (
                    "£19.63+vat per employee"
                  )
                ) : (
                  <>
                    £{unitPrice.toFixed(2)}{" "}
                    {selectedIndustry === "Care, Retirement and Sheltered schemes" ? "per bed" : "each"}
                    {selectedIndustry === "Care, Retirement and Sheltered schemes" && "+vat"}
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        {industriesRequiringCoverage.includes(selectedIndustry) && (
          <div
            className={`mb-8 ${selectedIndustry === "Campgrounds and Caravan Sites" ? "p-4 bg-sky-50 rounded-lg border border-sky-200" : ""}`}
          >
            <h3 className="text-lg font-medium text-slate-900 mb-4">Select your coverage area.</h3>
            <Select value={coverageArea} onValueChange={setCoverageArea}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {coverageAreaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} (£{option.price.toFixed(2)}+vat)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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

        {/* Email Field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
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
          <div></div>
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
                <SelectContent className="max-h-60">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
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
                  <SelectContent className="max-h-60">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
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

        <div className="mb-8 p-4 bg-slate-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Subtotal</span>
            <span className="text-sm font-medium">
              £
              {(
                getPrice() *
                (selectedIndustry === "Campgrounds and Caravan Sites" ||
                selectedIndustry === "Corporations (office spaces, manufacturing etc)"
                  ? 1
                  : quantity)
              ).toFixed(2)}
            </span>
          </div>
          {industriesRequiringVAT.includes(selectedIndustry) && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">VAT (20%)</span>
              <span className="text-sm font-medium">£{getVATAmount().toFixed(2)}</span>
            </div>
          )}
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

        {formData.paymentMethod === "card" && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Card Payment</h3>
            <StripePaymentForm
              amount={total}
              formData={{
                ...formData,
                selectedIndustry,
                quantity,
                coverageArea: industriesRequiringCoverage.includes(selectedIndustry) ? coverageArea : undefined,
                unitPrice: getPrice(),
                subtotal: getPrice() * quantity,
                total: getPrice() * quantity,
                premisesAddress: sameAsBilling ? formData.billingAddress : formData.premisesAddress,
                sameAsBilling,
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-8 py-2 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
            disabled={isSubmitting}
          >
            Back
          </Button>
          {formData.paymentMethod === "invoice" && (
            <Button
              onClick={handleNext}
              disabled={!formData.agreeToTerms || !formData.paymentMethod || isSubmitting}
              className="px-8 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors border-0 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </div>

        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
                <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
