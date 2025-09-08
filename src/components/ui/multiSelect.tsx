"use client"

import * as React from "react"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FieldError } from "react-hook-form"

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  label?: React.ReactNode
  labelClassName?: string
  className?: string
  disabled?: boolean
  error?: FieldError
  maxSelectedDisplay?: number
  searchable?: boolean
  clearable?: boolean
  size?: "sm" | "default"
  id?: string
}

export function MultiSelect({
  options = [],
  value = [],
  onValueChange,
  placeholder = "Select options...",
  label,
  labelClassName,
  className,
  disabled = false,
  error,
  maxSelectedDisplay = 3,
  searchable = false,
  clearable = true,
  size = "default",
  id,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // Generate a fallback id if not provided and label exists
  const inputId = id || (label ? `multiselect-${Math.random().toString(36).substr(2, 9)}` : undefined)

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchTerm) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [options, searchTerm, searchable])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle option toggle (single select for this style)
  const handleOptionToggle = React.useCallback((optionValue: string) => {
    if (disabled) return
    // Only allow one selection at a time for this style
    const newValue = value.includes(optionValue) ? [] : [optionValue]
    onValueChange?.(newValue)
    setIsOpen(false)
  }, [value, onValueChange, disabled])

  // Get display text for selected item
  const getDisplayText = () => {
    if (value.length === 0) return placeholder
    const selectedOption = options.find(option => value.includes(option.value))
    return selectedOption ? selectedOption.label : placeholder
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setIsOpen(!isOpen)
    } else if (event.key === "Escape" && isOpen) {
      setIsOpen(false)
      setSearchTerm("")
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "block mb-2 text-sm font-medium text-[#0D0D12]",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          id={inputId}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            // Style to match the image: rounded, border, subtle shadow, left-aligned text, subtle placeholder, no chips
            "w-full py-2 px-4 rounded-full bg-white border border-[#E5E7EB] text-gray-900 text-base placeholder:text-[#9CA3AF] outline-none focus:border-[#C7C9D9] transition-colors flex items-center justify-between gap-2 whitespace-nowrap shadow-xs disabled:cursor-not-allowed disabled:opacity-50 text-left",
            error && "border-red-500 focus:border-red-500",
            size === "sm" && "py-1.5 px-3 text-sm",
            className
          )}
        >
          <span className={cn(
            "flex-1 truncate text-left",
            value.length === 0 && "text-[#9CA3AF]"
          )}>
            {getDisplayText()}
          </span>
          <ChevronDownIcon 
            className={cn(
              "size-4 opacity-50 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 bg-white border border-[#E5E7EB] rounded-md shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
            aria-multiselectable="false"
            style={{
              minWidth: "100%",
              boxShadow: "0px 2px 8px 0px rgba(60, 60, 60, 0.08)",
              padding: 0,
            }}
          >
            {/* Options List */}
            <div className="p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  {searchTerm ? "No options found" : "No options available"}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionToggle(option.value)}
                      disabled={option.disabled}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        // Style to match the image: no background unless selected, left-aligned, subtle hover, no check icon unless selected, no chips
                        "w-full flex items-center gap-2 p-1 text-sm text-left hover:bg-gray-50 rounded-sm focus:bg-gray-50 outline-none transition-colors",
                        isSelected && "bg-gray-50 font-medium",
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                      style={{
                        fontWeight: isSelected ? 500 : 400,
                        color: "#222",
                        background: isSelected ? "#F5F6FA" : "transparent",
                      }}
                    >
                      <span className="flex-1">{option.label}</span>
                      {isSelected && (
                        <CheckIcon className="size-4 text-[#222]" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  )
}