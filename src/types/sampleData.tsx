import { FaCheckCircle, FaHistory, FaTimesCircle } from "react-icons/fa";
import {
  FiCalendar,
  FiDollarSign,
  FiHome,
  FiUsers
} from 'react-icons/fi';
import { Booking, NavItem, StatCardProps } from "./propTypes";


// Sample Bookings Data
export const recentBookings: Booking[] = [
  {
    id: 1,
    property: 'Modern Downtown Apartment',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=100',
    tenant: 'Sarah Johnson',
    date: 'May 15, 2023',
    price: 1850,
    status: 'occupied',
  },
  {
    id: 2,
    property: 'Riverside Villa',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100',
    tenant: 'Michael Brown',
    date: 'May 12, 2023',
    price: 3200,
    status: 'occupied',
  },
  {
    id: 3,
    property: 'Urban Studio Flat',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=100',
    tenant: 'Emily Davis',
    date: 'May 10, 2023',
    price: 1350,
    status: 'pending',
  },
];

// Sample Stats Data
export const statCards: StatCardProps[] = [
  {
    title: 'Total Properties',
    value: '124',
    change: '+12%',
    color: 'bg-blue-50 text-blue-600',
    icon: <FiHome />
  },
  {
    title: 'Occupied Units',
    value: '89',
    change: '+5%',
    color: 'bg-green-50 text-green-600',
    icon: <FiUsers />
  },
  {
    title: 'Vacant Units',
    value: '35',
    change: '-2%',
    color: 'bg-amber-50 text-amber-600',
    icon: <FiHome />
  },
  {
    title: 'Monthly Revenue',
    value: '$42,580',
    change: '+18%',
    color: 'bg-purple-50 text-purple-600',
    icon: <FiDollarSign />
  },
];

// Navigation Items
export const navItems: NavItem[] = [
  { icon: <FiHome />, text: 'Dashboard', path: '/admin' },
  { icon: <FiDollarSign />, text: 'Blogs', path: '/admin-blogs' },
  { icon: <FiCalendar />, text: 'Tour Bookings', path: '/admin-tour-bookings' },

];

// Mobile Navigation Items
export const mobileNavItems: NavItem[] = [
  { icon: <FiHome />, text: 'Dashboard', path: '/admin' },
  { icon: <FiDollarSign />, text: 'Blogs', path: '/admin-blogs' },
  { icon: <FiCalendar />, text: 'Bookings', path: 'admin-tour-bookings' },
];

export const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800'
};

export const statusIcons = {
  PENDING: <FaHistory className="mr-1" />,
  CONFIRMED: <FaCheckCircle className="mr-1" />,
  COMPLETED: <FaCheckCircle className="mr-1" />,
  CANCELED: <FaTimesCircle className="mr-1" />
};

export const primeLocationCity = [
  { name: "Kathmandu", image: "src/assets/cities/kathmandu.avif" },
  { name: "Lalitpur", image: "src/assets/cities/lalitpur.avif" },
  { name: "Bhaktapur", image: "src/assets/cities/bhaktapur.jpg" },
  { name: "Pokhara", image: "src/assets/cities/pokhara.jpg" },
  { name: "Birtamode", image: "src/assets/cities/Birtamode.jpg" },
];