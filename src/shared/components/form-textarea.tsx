interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FormTextarea({ label, ...props }: Props) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        {label}
      </label>

      <textarea
        {...props}
        rows={4}
        className="w-full px-3 py-2 rounded bg-[#22272b] border border-gray-600
        focus:border-blue-400 outline-none text-sm text-gray-200 resize-y"
      />
    </div>
  );
}