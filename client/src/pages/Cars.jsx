import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import useDebounce from '../hooks/useDebounce'

const Cars = () => {

  // getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const { cars, axios } = useAppContext()

  const [input, setInput] = useState('')
  const [sortBy, setSortBy] = useState('')

  // ✅ Advanced: Debounce the search input
  const debouncedSearch = useDebounce(input, 500)

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])

  const applyFilter = async () => {
    let filtered = cars.slice();

    if (debouncedSearch !== '') {
      filtered = filtered.filter((car) => {
        return car.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
          || car.model.toLowerCase().includes(debouncedSearch.toLowerCase())
          || car.category.toLowerCase().includes(debouncedSearch.toLowerCase())
          || car.transmission.toLowerCase().includes(debouncedSearch.toLowerCase())
      })
    }

    // sorting logic
    if (sortBy === 'price-low') filtered.sort((a, b) => a.pricePerDay - b.pricePerDay)
    if (sortBy === 'price-high') filtered.sort((a, b) => b.pricePerDay - a.pricePerDay)
    if (sortBy === 'year-new') filtered.sort((a, b) => b.year - a.year)

    setFilteredCars(filtered)
  }

  const searchCarAvailability = async () => {
    const { data } = await axios.post('/api/bookings/check-availability',
      { location: pickupLocation, pickupDate, returnDate })
    if (data.success) {
      setFilteredCars(data.availableCars)
      if (data.availableCars.length === 0) {
        toast('No cars available')
      }
      return null
    }
  }

  useEffect(() => {
    isSearchData && searchCarAvailability()
  }, [])

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter()
  }, [debouncedSearch, cars, sortBy])

  return (
    <div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}

        className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium
        vehicles available for your next adventure'/>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}

          className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12
        rounded-full shadow'>
          <img src={assets.search_icon} alt='' className='w-4.5 h-4.5 mr-2' />

          <input onChange={(e) => setInput(e.target.value)} value={input} type='text'
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500' />

          <img src={assets.filter_icon} alt='' className='w-4.5 h-4.5 ml-2' />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}

        className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>

        <div className='xl:px-20 max-w-7xl mx-auto flex justify-between items-center mb-4'>
          <p className='text-sm text-gray-500'>
            Showing <span className='font-medium text-gray-800'>{filteredCars.length}</span> Cars
          </p>

          <select
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
            className='px-4 py-2 border border-borderColor rounded-lg text-sm text-gray-600 outline-none cursor-pointer bg-white'>
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Newest First</option>
          </select>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4
        xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index) => (
            <motion.div key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Cars