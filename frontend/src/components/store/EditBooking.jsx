import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TableBookingForm from './TableBookingForm';

const EditBooking = () => {
  const { BookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search);
  const editing = query.get('editing') === 'true';

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log(BookingId,'EditBooking')
        const res = await axios.get(`/api/store/TableBookingForm/${BookingId}?editing=true`, {
          withCredentials: true
        });
        setBooking(res.data.booking);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load booking for edit:', err);
      }
    };
    fetchBooking();
  }, [BookingId]);

  if (loading) return <p>Loading booking details...</p>;
  return <TableBookingForm booking={booking} editing={editing} />;
};

export default EditBooking;
