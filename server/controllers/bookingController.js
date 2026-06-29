import Booking from "../models/Booking.js"
import Car from "../models/Car.js"

// ✅ Optimized API to check Availability (Eliminates N+1 Query Problem)
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        // 1. Fetch all available cars for the given location
        const cars = await Car.find({ location, isAvailable: true });
        
        if (cars.length === 0) {
            return res.json({ success: true, availableCars: [] });
        }

        // 2. Extract just the IDs of these cars
        const carIds = cars.map(car => car._id);

        // 3. Find ALL bookings for THESE cars that overlap with the requested dates in ONE query
        const overlappingBookings = await Booking.find({
            car: { $in: carIds },
            pickupDate: { $lte: returnDate },
            returnDate: { $gte: pickupDate }
        });

        // 4. Put the booked car IDs into a Set for lightning-fast O(1) lookup
        const bookedCarIds = new Set(overlappingBookings.map(b => b.car.toString()));

        // 5. Filter out the cars that are booked
        const availableCars = cars.filter(car => !bookedCarIds.has(car._id.toString()));

        res.json({ success: true, availableCars });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Create Booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    // Convert to Date objects
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const today = new Date();

    // Validate date formats
    if (isNaN(picked.getTime()) || isNaN(returned.getTime())) {
      return res.json({ success: false, message: "Invalid date format" });
    }

    // Ensure pickup date is not in the past
    if (picked < today.setHours(0, 0, 0, 0)) {
      return res.json({ success: false, message: "Pickup date cannot be in the past" });
    }

    // Ensure return date is after pickup date
    if (returned <= picked) {
      return res.json({ success: false, message: "Return date must be after pickup date" });
    }

    // ✅ Optimized single-car availability check (Replaces old helper function)
    const overlappingBooking = await Booking.findOne({
      car: car,
      pickupDate: { $lte: returnDate },
      returnDate: { $gte: pickupDate }
    });

    if (overlappingBooking) {
      return res.json({ success: false, message: "Car is not available for the selected dates" });
    }

    // Fetch car data
    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    // Calculate number of days and total price
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    // Create booking
    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    res.json({ success: true, message: "Booking Created" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to List User Bookings
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})

        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings
export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: "Unauthorized"})
        }
        const bookings = await Booking.find({ owner: req.user._id }).populate("car user").select("-user.password").sort({createdAt: -1})

        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body;

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({success: true, message: "Status Updated"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}