import { motion } from 'framer-motion';
import React from 'react';

interface TeamMember {
    name: string;
    role: string;
}

interface TeamMemberProps {
    member: TeamMember;
    index: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({ member, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                </div>
            </div>
            <motion.div
                className="p-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
            >
                <h3 className="text-xl font-ManropeBold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600 font-ManropeBold text-sm">{member.role}</p>
            </motion.div>
        </motion.div>
    );
};

export const MeetDreamTeam: React.FC = () => {
    const teamMembers: TeamMember[] = [
        { name: "Jacob Jones", role: "Chief Executive Officer" },
        { name: "Francene Vandyne", role: "Licensed Estate Agent/Director" },
        { name: "Marci Senter", role: "Sales Manager" },
        { name: "Wade Warren", role: "Sales Consultant" },
        { name: "Floyd Miles", role: "Sales Consultant" },
        { name: "Devon Lane", role: "Sales Consultant" }
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-ManropeBold text-gray-900 mb-4">
                    Meet the Dream Team
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                    <TeamMember key={member.name} member={member} index={index} />
                ))}
            </div>
        </div>
    );
};







