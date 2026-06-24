import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency} = useAppContext()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null

    setIsLoading(true)
    try{
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const {data} = await axios.post('/api/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        })
      }else{
        toast.error(data.message)
      }
    } catch (error){
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add New Car" subTitle="Fill in details to list a new car for
      booking, including pricing, availability, and car specifications."/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500
      text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor='car-image'>
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon}
            alt='' className='h-4 rounded cursor-pointer'/>
            <input type='file' id='car-image' accept='image/*' hidden onChange={e=>
              setImage(e.target.files[0])}/>
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your car</p>
        </div>

        {/* Refactored Form Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input label="Brand" placeholder='e.g. BMW, Mercedes, Audi' required value={car.brand} onChange={e=> setCar({...car, brand: e.target.value})} />
          <Input label="Model" placeholder='e.g. X5, E-Class, M4' required value={car.model} onChange={e=> setCar({...car, model: e.target.value})} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <Input label="Year" type="number" placeholder='2025' required value={car.year} onChange={e=> setCar({...car, year: e.target.value})} />
          <Input label={`Daily Price (${currency})`} type="number" placeholder='100' required value={car.pricePerDay} onChange={e=> setCar({...car, pricePerDay: e.target.value})} />
          <Select label="Category" value={car.category} onChange={e=> setCar({...car, category: e.target.value})} options={["Sedan", "SUV", "Van"]} placeholder="Select a category" />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <Select label="Transmission" value={car.transmission} onChange={e=> setCar({...car, transmission: e.target.value})} options={["Automatic", "Manual", "Semi-Automatic"]} placeholder="Select a transmission" />
          <Select label="Fuel Type" value={car.fuel_type} onChange={e=> setCar({...car, fuel_type: e.target.value})} options={["Gas", "Diesel", "Petrol", "Electric", "Hybrid"]} placeholder="Select a fuel type" />
          <Input label="Seating Capacity" type="number" placeholder='4' required value={car.seating_capacity} onChange={e=> setCar({...car, seating_capacity: e.target.value})} />
        </div>

        <Select label="Location" value={car.location} onChange={e=> setCar({...car, location: e.target.value})} options={["New York", "Los Angeles", "Houston", "Chicago"]} placeholder="Select a location" />

        {/* Car Description*/}
        <div className='flex flex-col w-full'>
          <label className='text-sm text-gray-600'>Description</label>
          <textarea rows={5} placeholder='e.g. A luxurious SUV with a spacious interior and a powerful engine.' required
          className='px-3 py-2 mt-1 border border-borderColor rounded-md
          outline-none text-gray-500' value={car.description} onChange={e=> setCar({...car, description: e.
            target.value})}></textarea>
        </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary
        text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt=''/>
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>

      </form>
      </div>
  )
}

export default AddCar