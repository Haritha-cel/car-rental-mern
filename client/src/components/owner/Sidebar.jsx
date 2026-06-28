import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = () => {

    const {user, axios, fetchUser} = useAppContext()
    const location = useLocation()
    const [image, setImage] = useState('')

    const updateImage = async ()=>{
        try {
            const formData = new FormData()
            formData.append('image', image)

            const {data} = await axios.post('/api/owner/update-image',
            formData)

            if(data.success){
                fetchUser()
                toast.success(data.message)
                setImage('')
            }else{
                toast.error(data.message)
            }
        }catch (error) { // ✅ Fixed: added (error) here so it doesn't crash
            toast.error(error.message)
        }
    }     

  return (

    // ✅ Fixed: Added solid background, shadow, and proper z-index for mobile drawer
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 
    max-w-60 w-full border-r border-borderColor text-sm bg-white md:bg-transparent shadow-xl md:shadow-none z-50'>

        <div className='group relative'>
            <label htmlFor='image'>
                <img src={image ? URL.createObjectURL(image) : user?.image ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"}
                alt='' className='h-9 md:h-14 w-9 md:w-14 rounded-full
                mx-auto'/>
                <input type='file' id='image' accept='image/*' hidden onChange={e=>
                setImage(e.target.files[0])}/>
                
                <div className='absolute hidden top-0 right-0 left-0 bottom-0
                bg-black/10 rounded-full group-hover:flex items-center
                justify-center cursor-pointer'>
                    <img src={assets.edit_icon} alt=''/>
                </div>
            </label>
        </div>
        {image && (
            <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10
            text-primary cursor-pointer' onClick={updateImage}>Save <img src={assets.check_icon} 
            width={13} alt='' /></button>
        )}
        
        {/* ✅ Fixed: Removed max-md:hidden so the name shows on mobile */}
        <p className='mt-2 text-base'>{user?.name}</p>

        <div className='w-full'>
            {ownerMenuLinks.map((link, index)=>(
                <NavLink key={index} to={link.path} className={`relative flex
                items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.
                pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'}`}>
                    <img src={link.path === location.pathname ? link.coloredIcon : link.icon}
                    alt='car icon'/>
                    
                    {/* ✅ Fixed: Removed max-md:hidden so text shows on mobile */}
                    <span>{link.name}</span>
                    
                    <div className={`${link.path === location.pathname && 'bg-primary'}
                    w-1.5 h-8 rounded-1 right-0 absolute`}></div>
                </NavLink>
            ))}
        </div>
    </div>
  )
}

export default Sidebar