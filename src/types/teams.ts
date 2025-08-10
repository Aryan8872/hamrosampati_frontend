interface TeamMember {
    name: string;
    position: string;
    bio: string;
    image: string;
  }
  
  const teamMembers: TeamMember[] = [
    {
      name: "Rajesh Shrestha",
      position: "Founder & CEO",
      bio: "Real estate expert with 15+ years experience in Nepal's property market",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Sunita Gurung",
      position: "Operations Director",
      bio: "Ensures smooth operations and client satisfaction",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Amit Joshi",
      position: "Technology Lead",
      bio: "Builds the platforms that power our services",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      name: "Priya Basnet",
      position: "Customer Success",
      bio: "Dedicated to helping clients find their perfect home",
      image: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];
  
  export default teamMembers;