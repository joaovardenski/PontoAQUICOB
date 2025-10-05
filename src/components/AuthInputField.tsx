import React from "react";

interface AuthInputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClickIconRight?: () => void;
  error?: string;
}

const AuthInputField: React.FC<AuthInputFieldProps> = ({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  iconLeft,
  iconRight,
  onClickIconRight,
  error,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {iconLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {iconLeft}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full rounded-md py-2 pl-10 pr-10 border border-[var(--color-borda-suave)] sm:text-sm
                      focus:ring-2 focus:ring-[var(--color-azul-primario)] focus:border-[var(--color-azul-primario)] ${error ? 'border-red-500' : ''}`}
        />
        {iconRight && (
          <button
            type="button"
            onClick={onClickIconRight}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {iconRight}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AuthInputField;
