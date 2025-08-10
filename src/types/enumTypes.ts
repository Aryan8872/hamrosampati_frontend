export enum City {
    Kathmandu = "Kathmandu",
    Tokha = "Tokha",
    Kirtipur = "Kirtipur",

    Pokhara = "Pokhara",
    Lekhnath = "Lekhnath",

    Lalitpur = "Lalitpur",
    Godawari = "Godawari",
    Lubhu = "Lubhu",

    Bhaktapur = "Bhaktapur",
    MadhyapurThimi = "Madhyapur Thimi",

    Biratnagar = "Biratnagar",
    Birgunj = "Birgunj",

    Butwal = "Butwal",
    Siddharthanagar = "Siddharthanagar",

    Dharan = "Dharan",
    Nepalgunj = "Nepalgunj",
    Janakpur = "Janakpur",

    Bharatpur = "Bharatpur",
    Ratnanagar = "Ratnanagar",

    Birtamode = "Birtamode",
    Damak = "Damak",
    Mechinagar = "Mechinagar",
}

export enum District {
    Kathmandu = "Kathmandu",
    Lalitpur = "Lalitpur",
    Bhaktapur = "Bhaktapur",

    Kaski = "Kaski",             // For Pokhara, Lekhnath
    Rupandehi = "Rupandehi",     // For Butwal, Siddharthanagar
    Chitwan = "Chitwan",         // For Bharatpur, Ratnanagar
    Jhapa = "Jhapa",             // For Birtamode, Damak, Mechinagar

    Morang = "Morang",           // For Biratnagar
    Parsa = "Parsa",             // For Birgunj
    Sunsari = "Sunsari",         // For Dharan
    Banke = "Banke",             // For Nepalgunj
    Dhanusha = "Dhanusha",       // For Janakpur
}



export enum Amenity {
    Parking = "Parking",
    Pool = "Pool",
    Gym = "Gym",
    Laundry = "Laundry",
    AC = "AC",
    Heating = "Heating",
    Balcony = "Balcony",
    Furnished = "Furnished",
    Elevator = "Elevator",
}


export enum LISTING_TYPES {
    SALE = "SALE",
    RENT = "RENT",
    LEASE = "LEASE"
}

export enum FURNISHING_TYPES {
    FURNISHED = "FURNISHED",
    SEMI_FURNISHED = "SEMI-FURNISHED",
    UNFURNISHED = "UNFURNISHED"
}

export enum STATUS_TYPES {
    AVAILABLE = 'AVAILABLE',
    SOLD = 'SOLD',
    RENTED = 'RENTED'
}

export enum PROPERTY_TYPES {
    APARTMENT = 'APARTMENT',
    HOUSE = 'HOUSE',
    BUILDING = 'BUILDING',
    STORE = 'STORE'
}
export enum TOUR_TYPES {
    pending = 'PENDING',
    confirmed = 'CONFIRMED',
    cancelled = 'CANCELED',
    completed = 'COMPLETED'
}



export enum SESSION_STORAGE_KEYS {
    PropertyCurrentPageNumber = 'PropertyCurrentPageNumber',
    BlogCurrentPageNumber = 'BlogCurrentPageNumber',
    PropertyQueryParams = 'PropertyQueryParams'

}

export const TOUR_STATUS_TYPES = {
    CANCELED: TOUR_TYPES.cancelled,
    PENDING: TOUR_TYPES.pending,
    CONFIRMED: TOUR_TYPES.confirmed,
    COMPLETED: TOUR_TYPES.completed
};