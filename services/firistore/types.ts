export enum CollectionName {
    Customers = 'customers',
    Reservations = 'reservations',
    Salons = 'salons',
    Staffs = 'staffs',
    Menus = 'menus',
    Admins = 'admins'
}

// Customer
export type Customer = {
    lineId: string;
    name: string;
    destination?: string;
    phone?: string;
}

