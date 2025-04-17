const usage_component = `"use client";

import { useState, useEffect } from "react";
import { CardCVVInput, CardExpiryInput, CardNumberInput } from "@/components/credit-card-input";

export default function Usage() {
    const [number, setNumber] = useState<string | undefined>();
    const [expiry, setExpiry] = useState<string | undefined>();
    const [expiryMonth, setExpiryMonth] = useState<string | undefined>();
    const [expiryYear, setExpiryYear] = useState<string | undefined>();
    const [cvv, setCVV] = useState<string | undefined>();

    return (
        <div className="flex flex-col gap-4">
            <CardNumberInput
                onValueChange={(value: string) => setNumber(value)}
            />
            <div className="w-full flex gap-4 items-center justify-between">
                <CardExpiryInput
                    onValueChange={(value: string) => setExpiry(value)}
                    onMonthChange={(value: string) => setExpiryMonth(value)}
                    onYearChange={(value: string) => setExpiryYear(value)}
                />

                <CardCVVInput
                    onValueChange={(value: string) => setCVV(value)}
                />
            </div>
        </div>
    );
}`;

export default usage_component;