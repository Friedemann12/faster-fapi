import { readFileSync } from "fs";
import path from "path";
import { Booking, Customer, Z_Booking, Z_Customer } from "../types";
import z from "zod";
import { SomeType } from "zod/v4/core";

const appid = process.env.APP ?? 'appa'

let customers: Map<string, Customer> | null = null
let bookings: Map<string, Booking> | null = null

export class CacheHandler {
    public static init() {
        const parsedBookings = this._load(
            'booking',
            Z_Booking,
            b => b.id
        )

        bookings = parsedBookings

        const parsedCustomer = this._load(
            'customer',
            Z_Customer,
            c => c.id
        )

        customers = parsedCustomer
    }

    public static getCustomers(): Map<string, Customer> {
        if (customers !== null) return customers

        const _customers = this._load(
            'customer',
            Z_Customer,
            c => c.id
        )

        customers = _customers

        return _customers
    }

    public static getBookings(): Map<string, Booking> {
        if (bookings !== null) return bookings

        const _bookings = this._load(
            'booking',
            Z_Booking,
            b => b.id
        )

        bookings = _bookings

        return _bookings
    }

    public static addBooking(booking: Booking): Booking {
        if (bookings === null) throw new Error('not inited yet')

        bookings.set(booking.id, booking)

        return booking
    }

    private static _load<T extends SomeType>(
        dataType: 'booking' | 'customer',
        Z_Parser: T,
        keySelector: (entry: z.core.output<T>) => string
    ): Map<string, z.core.output<T>> {
        // Use environment variable or fallback to default path
        const outputDir = process.env.SEED_DATA_DIR || path.join(__dirname, '..', '..', 'output');
        const appid = process.env.APP ?? 'appa';
        const jsonBasePath = path.join(outputDir, appid.toUpperCase());

        const dataPath = jsonBasePath + `/${dataType}.csv`;
        
        // For now, return empty map since we're using CSV files
        // This handler seems to be legacy - the actual data loading is done in seed.ts
        console.log(`[CacheHandler] Skipping ${dataType} loading - using CSV files instead`);
        return new Map<string, z.core.output<T>>();
    }
}


