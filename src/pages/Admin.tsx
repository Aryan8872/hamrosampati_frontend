import { useState } from "react";
import { FiDollarSign, FiHome, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import BookingList from "../components/Admin/BookingList";
import Card, { CardContent, CardHeader } from "../components/Admin/Card";
import DeleteConfirmation from "../components/Admin/DeleteConfirmation";
import AddPropertyModal from "../components/Admin/Property/AddProperty/AddProperty";
import PropertyTable from "../components/Admin/PropertyTable";
import StatCard from "../components/Admin/StatCard";
import UpdatePropertyModal from "../components/Admin/UpdateProperty";
import { useProperty } from "../context/PropertyContext";
import { useTour } from "../context/TourRequestContext";


function Admin() {
    const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
    const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { propertyById, useAdminDashboardStats } = useProperty()
    const { useGetRecentTourBookings } = useTour()
    const { data: tours } = useGetRecentTourBookings()
    const recentTours = tours?.tourRequests

    const navigate = useNavigate()
    const { data } = useAdminDashboardStats()
    const stats = data?.stats
    if (!stats)
        return <div>Loading........</div>

    if (!recentTours)
        return <div>Loading........</div>
    const statCards = [
        {
            title: 'Total Properties',
            value: stats?.totalProperties.value.toString(),
            change: stats?.totalProperties.change,
            color: 'bg-blue-50 text-blue-600',
            icon: <FiHome />
        },
        {
            title: 'Occupied Units',
            value: stats?.occupiedUnits.value.toString(),
            change: stats?.occupiedUnits.change,
            color: 'bg-green-50 text-green-600',
            icon: <FiUsers />
        },
        {
            title: 'Vacant Units',
            value: stats?.vacantUnits.value.toString(),
            change: stats?.vacantUnits.change,
            color: 'bg-amber-50 text-amber-600',
            icon: <FiHome />
        },
        {
            title: 'Monthly Revenue',
            value: `$${stats?.monthlyRevenue.value.toLocaleString()}`,
            change: stats?.monthlyRevenue.change,
            color: 'bg-purple-50 text-purple-600',
            icon: <FiDollarSign />
        }
    ];


    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-auto">
            <div className="flex-1 flex flex-col">
             

                <main className="flex-1 overflow-auto">
                    <div className="w-[80%] smx:container smx:mx-auto px-4 py-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                            {statCards.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}

                        </div>

                        <div className="mb-6">
                            <PropertyTable
                                onAddNew={() => setIsAddPropertyOpen(true)}
                                onEdit={() => setIsEditPropertyOpen(true)}
                                onDeleteProperty={() => setIsDeleteModalOpen(true)}
                            />
                        </div>

                        <Card>
                            <CardHeader className="flex justify-between items-center">
                                <h3 className="text-lg font-ManropeBold text-gray-800">Recent Tour Bookings</h3>
                                <button
                                    onClick={() => navigate("/admin-tour-bookings")}
                                    className="text-sm font-ManropeBold text-blue-600 hover:underline font-medium">
                                    View All
                                </button>
                            </CardHeader>
                            <CardContent>
                                <BookingList bookings={recentTours} />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            <AddPropertyModal
                isOpen={isAddPropertyOpen}
                onClose={() => setIsAddPropertyOpen(false)}
            />
            <UpdatePropertyModal
                propertyData={propertyById}
                isOpen={isEditPropertyOpen}
                onClose={() => setIsEditPropertyOpen(false)}
            />

            <DeleteConfirmation
                onOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />

        </div>
    );
}

export default Admin;