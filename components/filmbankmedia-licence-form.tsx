"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
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

export function FilmbankmediaLicenceForm() {
  const [selectedIndustry, setSelectedIndustry] = useState("Sports and Social Clubs")

  const handleNext = () => {
    // Handle form submission or navigation to next step
    console.log("Selected industry:", selectedIndustry)
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
          <p className="text-sm text-slate-600 mb-2">Step 1 of 2 - Choose your industry.</p>
          {/* Simplified progress bar usage since colors are now handled in the component */}
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
