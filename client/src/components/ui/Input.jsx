import React from 'react'

const Input = ({ label, type = "text", placeholder, value, onChange, required = false, ...props }) => {
  return (
    <div className='flex flex-col w-full'>
      <label className='text-sm text-gray-600'>{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        required={required}
        className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-500' 
        value={value} 
        onChange={onChange} 
        {...props}
      />
    </div>
  )
}

export default Input