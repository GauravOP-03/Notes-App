import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface AuthInputProps {
  id: string,
  name: string,
  type: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholder: string,
  error?: string,
  required?: boolean
  label: string,
  className: string
}

function AuthInput({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
  required,
  label,
  className
}: AuthInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-gray-700 font-medium">{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={className}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default memo(AuthInput);

