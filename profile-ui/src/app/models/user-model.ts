export interface User {
    Id?: string;
    Name: string;
    Email: string;
    DateOfBirth: Date;
    Address: Address;
}

export interface Address {
    Latitude: number;
    Longitude: number;
}
