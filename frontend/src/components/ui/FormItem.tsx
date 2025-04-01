interface Props {
  label: string;
  registration: any;
  type?: string;
  placeholder?: string;
  error?: string;
}

const FormItem = ({
  label,
  registration,
  type = "text",
  placeholder,
  error,
}: Props) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className="flex h-10 w-full rounded-md !border !border-gray-300 bg-transparent !px-3 !py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        type={type}
        placeholder={placeholder}
        {...registration}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormItem;
