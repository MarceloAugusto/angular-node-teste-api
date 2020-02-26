import { Department } from './department';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Product {
    name: string;
    departments: number;
    stock: number;
    price: number;
    photo: string;
    id ?: string;
    created_at ?: string;
}

