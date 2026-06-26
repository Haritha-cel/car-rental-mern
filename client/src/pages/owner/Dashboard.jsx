import React, { useEffect, useState } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {

  const { axios, isOwner, currency } = useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
  ]

  // ✅ Process booking data for the chart
  const getChartData = () => {
    const revenueMap = {};

    data.recentBookings.forEach(booking => {
      // Extract just the date (YYYY-MM-DD)
      const date = booking.createdAt.split('T')[0];
      // Add the price to that date's total
      revenueMap[date] = (revenueMap[date] || 0) + booking.price;
    });

    // Convert the map object into an array Recharts can read
    return Object.entries(revenueMap).map(([date, revenue]) => ({
      date: date.substring(5), // Shows "MM-DD" instead of "YYYY-MM-DD" for cleaner X-axis
      revenue: revenue
    }));
  };

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/owner/dashboard')
      if (data.success) {
        setData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData()
    }
  }, [isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title="Admin Dashboard" subTitle="Monitor overall platform performance
      including total cars, bookings, revenue, and recent activities"/>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8
      max-w-3xl'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex gap-2 items-center justify-between p-4
          rounded-md border border-borderColor'>
            <div>
              <h1 className='text-xs text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
            <div className='flex items-center justify-center w-10 h-10 rounded-full
            bg-primary/10'>
              <img src={card.icon} alt='' className='h-4 w-4' />
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
        {/* recent booking */}
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg
        w-full'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500'>Latest customer bookings</p>
          {data.recentBookings.map((booking, index) => (
            <div key={index} className='mt-4 flex items-center justify-between'>

              <div className='flex items-center gap-2'>
                <div className='hidden md:flex items-center justify-center w-12
                h-12 rounded-full bg-primary/10'>
                  <img src={assets.listIconColored} alt='' className='h-5 w-5' />
                </div>
                <div>
                  <p>{booking.car.brand} {booking.car.model}</p>
                  <p className='text-sm text-gray-500'>{booking.createdAt.split('T')
                  [0]}</p>
                </div>
              </div>

              <div className='flex items-center gap-2 font-medium'>
                <p className='text-sm text-gray-500'>{currency}{booking.price}</p>
                <p className='px-3 py-0.5 border border-borderColor rounded-full
                text-sm'>{booking.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Analytics Chart */}
        <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-lg'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h1 className='text-lg font-medium'>Revenue Analytics</h1>
              <p className='text-gray-500 text-sm'>Revenue from recent bookings</p>
            </div>
            <p className='text-2xl font-semibold text-primary'>{currency}{data.monthlyRevenue}</p>
          </div>

          <div className='h-48 w-full mt-4'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" fontSize={12} tick={{ fill: '#6b7280' }} />
                <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  formatter={(value) => [`${currency}${value}`, "Revenue"]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard