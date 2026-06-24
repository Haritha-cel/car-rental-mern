import React from 'react'

const Select = ({ label, value, onChange, options, placeholder = "Select an option" }) => {
  return (
    <div className='flex flex-col w-full'>
      <label className='text-sm text-gray-600'>{label}</label>
      <select 
        onChange={onChange} 
        value={value} 
        className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-500'
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default Select