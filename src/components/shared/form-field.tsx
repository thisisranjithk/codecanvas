import type { ReactNode } from "react"
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type FieldError,
  type UseFormRegisterReturn,
} from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { MonthPicker } from "@/components/ui/month-picker"
import { cn } from "@/lib/utils"

// ── Error Message ──

function FormErrorMessage({ error }: { error?: FieldError }) {
  if (!error?.message) return null
  return (
    <p className="text-[13px] text-destructive mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
      {error.message}
    </p>
  )
}

// ── Form Field Wrapper ──

interface FormFieldWrapperProps {
  label: string
  error?: FieldError
  description?: string
  className?: string
  labelClassName?: string
  children: ReactNode
  required?: boolean
}

function FormFieldWrapper({
  label,
  error,
  description,
  className,
  labelClassName,
  children,
  required,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label className={cn("text-sm", labelClassName)}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {description && !error && (
        <p className="text-[13px] text-muted-foreground">{description}</p>
      )}
      <FormErrorMessage error={error} />
    </div>
  )
}

// ── FormInput ──

interface FormInputProps {
  label: string
  registration: UseFormRegisterReturn
  error?: FieldError
  placeholder?: string
  type?: string
  className?: string
  inputClassName?: string
  description?: string
  required?: boolean
  min?: number
  max?: number
  labelClassName?: string
}

function FormInput({
  label,
  registration,
  error,
  placeholder,
  type = "text",
  className,
  inputClassName,
  description,
  required,
  min,
  max,
  labelClassName,
}: FormInputProps) {
  return (
    <FormFieldWrapper
      label={label}
      error={error}
      description={description}
      className={className}
      labelClassName={labelClassName}
      required={required}
    >
      <Input
        {...registration}
        type={type}
        placeholder={placeholder}
        min={min}
        max={max}
        aria-invalid={!!error}
        className={cn("h-9 text-sm", error && "border-destructive/50 focus-visible:ring-destructive/30", inputClassName)}
      />
    </FormFieldWrapper>
  )
}

// ── FormTextarea ──

interface FormTextareaProps {
  label: string
  registration: UseFormRegisterReturn
  error?: FieldError
  placeholder?: string
  rows?: number
  className?: string
  textareaClassName?: string
  description?: string
  required?: boolean
  labelClassName?: string
}

function FormTextarea({
  label,
  registration,
  error,
  placeholder,
  rows = 3,
  className,
  textareaClassName,
  description,
  required,
  labelClassName,
}: FormTextareaProps) {
  return (
    <FormFieldWrapper
      label={label}
      error={error}
      description={description}
      className={className}
      labelClassName={labelClassName}
      required={required}
    >
      <Textarea
        {...registration}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={!!error}
        className={cn("text-sm", error && "border-destructive/50 focus-visible:ring-destructive/30", textareaClassName)}
      />
    </FormFieldWrapper>
  )
}

// ── FormSelect ──

interface FormSelectProps<T extends FieldValues> {
  label: string
  name: Path<T>
  control: Control<T>
  error?: FieldError
  options: { label: string; value: string }[]
  placeholder?: string
  className?: string
  selectClassName?: string
  description?: string
  required?: boolean
  labelClassName?: string
}

function FormSelect<T extends FieldValues>({
  label,
  name,
  control,
  error,
  options,
  placeholder,
  className,
  selectClassName,
  description,
  required,
  labelClassName,
}: FormSelectProps<T>) {
  return (
    <FormFieldWrapper
      label={label}
      error={error}
      description={description}
      className={className}
      labelClassName={labelClassName}
      required={required}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              className={cn("h-9 text-sm", error && "border-destructive/50", selectClassName)}
              aria-invalid={!!error}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormFieldWrapper>
  )
}

// ── FormSwitch ──

interface FormSwitchProps<T extends FieldValues> {
  label: string
  name: Path<T>
  control: Control<T>
  description?: string
  className?: string
  labelClassName?: string
}

function FormSwitch<T extends FieldValues>({
  label,
  name,
  control,
  description,
  className,
  labelClassName,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn("flex items-center justify-between rounded-lg border border-border/60 px-4 py-3", className)}>
          <div className="flex flex-col gap-0.5">
            <Label className={cn("text-sm font-medium", labelClassName)}>{label}</Label>
            {description && (
              <p className="text-[13px] text-muted-foreground">{description}</p>
            )}
          </div>
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </div>
      )}
    />
  )
}

// ── FormSlider ──

interface FormSliderProps<T extends FieldValues> {
  label: string
  name: Path<T>
  control: Control<T>
  error?: FieldError
  min?: number
  max?: number
  step?: number
  className?: string
  labelClassName?: string
  renderValue?: (value: number) => ReactNode
}

function FormSlider<T extends FieldValues>({
  label,
  name,
  control,
  error,
  min = 0,
  max = 100,
  step = 1,
  className,
  labelClassName,
  renderValue,
}: FormSliderProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn("grid gap-2", className)}>
          <div className="flex items-center justify-between">
            <Label className={cn("text-sm", labelClassName)}>{label}</Label>
            {renderValue ? (
              <span className="text-sm font-medium tabular-nums">
                {renderValue(field.value)}
              </span>
            ) : (
              <span className="text-sm font-medium tabular-nums">{field.value}</span>
            )}
          </div>
          <Slider
            value={[field.value]}
            onValueChange={([v]) => field.onChange(v)}
            min={min}
            max={max}
            step={step}
          />
          <FormErrorMessage error={error} />
        </div>
      )}
    />
  )
}

// ── FormMonthPicker ──

interface FormMonthPickerProps<T extends FieldValues> {
  label: string
  name: Path<T>
  control: Control<T>
  error?: FieldError
  placeholder?: string
  disabled?: boolean
  className?: string
  pickerClassName?: string
  description?: string
  required?: boolean
  labelClassName?: string
}

function FormMonthPicker<T extends FieldValues>({
  label,
  name,
  control,
  error,
  placeholder,
  disabled = false,
  className,
  pickerClassName,
  description,
  required,
  labelClassName,
}: FormMonthPickerProps<T>) {
  return (
    <FormFieldWrapper
      label={label}
      error={error}
      description={description}
      className={className}
      labelClassName={labelClassName}
      required={required}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <MonthPicker
            value={field.value ?? undefined}
            onChange={(date) => field.onChange(date)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("w-full h-9", pickerClassName)}
          />
        )}
      />
    </FormFieldWrapper>
  )
}

export {
  FormErrorMessage,
  FormFieldWrapper,
  FormInput,
  FormTextarea,
  FormSelect,
  FormSwitch,
  FormSlider,
  FormMonthPicker,
}
