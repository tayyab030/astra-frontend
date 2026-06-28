interface FormFieldErrorProps {
  message?: string
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) return null

  return <p className="text-sm font-mono text-red-400">{message}</p>
}
