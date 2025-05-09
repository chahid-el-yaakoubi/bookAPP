"use client"

import { useState } from "react";
import { DollarSign, Calendar, Clock, Award, Shield, Percent } from "lucide-react";

export default function PricingStep({ formData, handleInputChange }) {
  // Function to calculate the weekly and monthly rates based on hourly/daily
  const calculateSuggestedRates = () => {
    const hourly = parseFloat(formData.pricing.hourlyRate) || 0;
    const daily = parseFloat(formData.pricing.dailyRate) || 0;
    
    // Only calculate if we have valid data and the field is currently empty
    if (hourly > 0 && formData.pricing.weeklyRate === "") {
      const suggestedWeekly = daily * 5; // 5 days per week
      handleInputChange("pricing", "weeklyRate", suggestedWeekly.toFixed(2));
    }
    
    if (daily > 0 && formData.pricing.monthlyRate === "") {
      const suggestedMonthly = daily * 20; // 20 days per month
      handleInputChange("pricing", "monthlyRate", suggestedMonthly.toFixed(2));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6 border-b pb-3">
        <DollarSign className="h-6 w-6 text-indigo-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">Pricing Information</h3>
      </div>
      
      {/* Basic Rates Section */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <Clock className="h-5 w-5 text-indigo-500 mr-2" />
          Basic Rates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="hourlyRate"
                type="number"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-4 py-2 sm:text-sm border border-gray-300 rounded-md bg-gray-50"
                placeholder="0.00"
                step="0.01"
                value={formData.pricing.hourlyRate}
                onChange={(e) => handleInputChange("pricing", "hourlyRate", e.target.value)}
                onBlur={calculateSuggestedRates}
                required
              />
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 mb-1">
              Daily Rate <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="dailyRate"
                type="number"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-4 py-2 sm:text-sm border border-gray-300 rounded-md bg-gray-50"
                placeholder="0.00"
                step="0.01"
                value={formData.pricing.dailyRate}
                onChange={(e) => handleInputChange("pricing", "dailyRate", e.target.value)}
                onBlur={calculateSuggestedRates}
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Extended Rates Section */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
          Extended Rates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="weeklyRate" className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Rate
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="weeklyRate"
                type="number"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-4 py-2 sm:text-sm border border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
                value={formData.pricing.weeklyRate}
                onChange={(e) => handleInputChange("pricing", "weeklyRate", e.target.value)}
              />
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="monthlyRate" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Rate
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="monthlyRate"
                type="number"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-4 py-2 sm:text-sm border border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
                value={formData.pricing.monthlyRate}
                onChange={(e) => handleInputChange("pricing", "monthlyRate", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Deposit */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <Shield className="h-5 w-5 text-indigo-500 mr-2" />
          Security
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Security Deposit
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="depositAmount"
                type="number"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-4 py-2 sm:text-sm border border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
                value={formData.pricing.depositAmount}
                onChange={(e) => handleInputChange("pricing", "depositAmount", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Discounts */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <Award className="h-5 w-5 text-indigo-500 mr-2" />
          Discounts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="weeklyDiscount" className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Discount
            </label>
            <div className="relative rounded-md">
              <input
                id="weeklyDiscount"
                type="number"
                className="focus:ring-indigo-500 px-4 focus:border-indigo-500 block w-full pr-8 py-2 sm:text-sm border border-gray-300 rounded-md"
                placeholder="0"
                min="0"
                max="100"
                value={formData.pricing.discounts.weekly}
                onChange={(e) => handleInputChange("pricing", "discounts.weekly", e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Percent className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="monthlyDiscount" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Discount
            </label>
            <div className="relative rounded-md">
              <input
                id="monthlyDiscount"
                type="number"
                className="focus:ring-indigo-500 px-4 focus:border-indigo-500 block w-full pr-8 py-2 sm:text-sm border border-gray-300 rounded-md"
                placeholder="0"
                min="0"
                max="100"
                value={formData.pricing.discounts.monthly}
                onChange={(e) => handleInputChange("pricing", "discounts.monthly", e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Percent className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}