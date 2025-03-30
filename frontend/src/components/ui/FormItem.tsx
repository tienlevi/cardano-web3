import React from 'react'

interface FormItemProps {
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}

const FormItem: React.FC<FormItemProps> = ({ label, value, onChange, type = 'text', placeholder = '' }) => {
  return (
    <div className='mb-4'>
      <label className='block text-gray-700 text-sm font-bold mb-2'>{label}</label>
      <input
        className='!shadow appearance-none !border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default FormItem
