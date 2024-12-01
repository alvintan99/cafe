export interface Cafe {
    id: string;
    name: string;
    description: string;
    logo?: string;
    location: string;
    employees: number;
}

export interface Employee {
    id: string;
    name: string;
    emailAddress: string;
    phoneNumber: string;
    daysWorked: number;
    cafeName?: string;
    gender: 'Male' | 'Female';
    cafeId?: string;
}
