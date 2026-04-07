interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export function FormInput({ label, required, ...props }: Props) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <input
        {...props}
        className="w-full px-3 py-2 rounded bg-[#22272b] border border-gray-600
        focus:border-blue-400 outline-none text-sm text-gray-200"
      />
    </div>
  );
}