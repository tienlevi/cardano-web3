interface Props {
  label: string
  registration: any
  type?: string
  placeholder?: string
  error?: string
}

const FormItem = ({ label, registration, type = 'text', placeholder, error }: Props) => {
  return (
    <div className='mb-4'>
      <label className='block text-gray-700 text-sm font-bold mb-2'>{label}</label>
      <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        type={type}
        placeholder={placeholder}
        {...registration}
      />
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  )
}

export default FormItem
