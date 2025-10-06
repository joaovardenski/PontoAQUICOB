import type { LucideIcon } from "lucide-react";

interface RegistroButtonProps {
  label: string;
  icon: LucideIcon;
  color: "green" | "yellow" | "red";
  onClick: () => void;
  disabled?: boolean;
}

const RegistroButton: React.FC<RegistroButtonProps> = ({
  label,
  icon: Icon,
  color,
  onClick,
  disabled,
}) => {
  const gradienteClasses =
    color === "green"
      ? "from-green-600 to-green-500 hover:to-green-700"
      : color === "yellow"
      ? "from-yellow-500 to-yellow-400 hover:to-yellow-600"
      : "from-red-600 to-red-500 hover:to-red-700";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 bg-gradient-to-r ${gradienteClasses} text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
};

export default RegistroButton;
