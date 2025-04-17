const credit_card_input_component = `"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import creditCardType from "credit-card-type";
import { cn } from "@/lib/utils";
import { CreditCardTypeCardBrandId } from "credit-card-type/dist/types";

export function CardNumberInput(
    {
        onValueChange,
        className,
        ...props }:
        React.ComponentProps<"input"> &
        {
            onValueChange?: (value: string) => void
        }
) {
    const [value, setValue] = useState<string>("");
    const [cardType, setCardType] = useState<ReturnType<typeof creditCardType>[0] | null>(null);

    const formatCardNumber = (value: string, gaps: number[]) => {
        const digits = value.replace(/\\D/g, "");
        let result = "";
        let cursor = 0;

        for (let i = 0; i < digits.length; i++) {
            if (gaps.includes(cursor)) result += " ";
            result += digits[i];
            cursor++;
        }

        return result;
    }

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\\D/g, "");
        const detected = creditCardType(rawValue)[0];
        setCardType(detected);

        const formatted = formatCardNumber(rawValue, detected?.gaps || [4, 8, 12]);
        setValue(formatted);

        if (onValueChange) {
            onValueChange(formatted);
        }
    }

    return (
        <div className="w-full relative">
            <img
                src={\`data:image/svg+xml;utf8,\${encodeURIComponent(cardSVGs[cardType?.type ?? "default"])}\`}
                alt="Card Icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onError={
                    (e) =>
                        e.currentTarget.src = \`data:image/svg+xml;utf8,\${encodeURIComponent(cardSVGs["default"])}\`
                }
            />

            <Input
                type="text"
                inputMode="numeric"
                pattern="\\d*"
                maxLength={(cardType?.lengths?.[cardType.lengths.length - 1] ?? 0) + (cardType?.gaps?.length ?? 3)}
                value={value}
                onChange={handleValueChange}
                placeholder="Card Number"
                className={cn(
                    "pl-12",
                    className
                )}
                {...props}
            />
        </div>
    )
}

export function CardExpiryInput(
    {
        onValueChange,
        onMonthChange,
        onYearChange,
        className,
        ...props
    }:
        React.ComponentProps<"input"> &
        {
            onValueChange?: (value: string) => void;
            onMonthChange?: (value: string) => void,
            onYearChange?: (value: string) => void,
        }
) {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\\D/g, ""); // Only digits
        let newValue = value;

        // Prevent input longer than 4 digits (MMYY)
        if (raw.length > 4) return;

        // Parse month and year
        const mm = raw.slice(0, 2);
        const yy = raw.slice(2);

        // Validate month as it's being typed
        if (raw.length === 1 && Number(raw[0]) > 1) return; // First digit can't be > 1
        if (raw.length === 2) {
            const month = Number(mm);
            if (month === 0 || month > 12) return;
        }

        // Format as MM/YY
        if (raw.length >= 3) {
            newValue = \`\${mm}/\${yy}\`;

            if (onMonthChange) {
                onMonthChange(mm);
            }
            if (onYearChange) {
                onYearChange(yy);
            }
        } else {
            newValue = mm;
            
            if (onMonthChange) {
                onMonthChange(mm);
            }
        }


        setValue(newValue);

        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <Input
            type="text"
            inputMode="numeric"
            pattern="\\d*"
            maxLength={5}
            placeholder="MM/YY"
            value={value}
            onChange={handleChange}
            className={className}
            {...props}
        />
    );
}

export function CardCVVInput({
    onValueChange,
    className,
    cardType,
}:
    React.ComponentProps<"input"> & {
        onValueChange?: (value: string) => void;
        cardType?: CreditCardTypeCardBrandId | null;
    }
) {
    const [value, setValue] = useState("");

    const maxLength = cardType === "american-express" ? 4 : 3;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\\D/g, "");

        if (raw.length <= maxLength) {
            setValue(raw);

            if (onValueChange) {
                onValueChange(raw);
            }
        }
    };

    return (
        <Input
            type="text"
            inputMode="numeric"
            pattern="\\d*"
            maxLength={maxLength}
            placeholder="CVV"
            value={value}
            onChange={handleChange}
            className={className}
        />
    );
}

export const cardSVGs: Record<string, string> = {
    "default": \`<? xml version = "1.0" encoding = "UTF-8" ?> <svg version="1.1" xmlns = "http://www.w3.org/2000/svg" width = "48" height = "48" > <path d="M0 0 C0.83096191 -0.00630432 1.66192383 -0.01260864 2.51806641 -0.019104 C3.85877197 -0.01303131 3.85877197 -0.01303131 5.2265625 -0.00683594 C6.14743652 -0.00874939 7.06831055 -0.01066284 8.01708984 -0.01263428 C9.96386997 -0.01399514 11.91065919 -0.01030557 13.85742188 -0.00195312 C16.84005078 0.00874776 19.82207736 -0.00185176 22.8046875 -0.01464844 C24.69531383 -0.01332683 26.58593979 -0.0107644 28.4765625 -0.00683594 C29.81726807 -0.01290863 29.81726807 -0.01290863 31.18505859 -0.019104 C32.43150146 -0.00964752 32.43150146 -0.00964752 33.703125 0 C34.79874756 0.00238678 34.79874756 0.00238678 35.91650391 0.00482178 C37.8515625 0.25878906 37.8515625 0.25878906 40.8515625 2.25878906 C41.23974609 5.39160156 41.23974609 5.39160156 41.25 9.38378906 C41.25287018 10.08648926 41.25574036 10.78918945 41.25869751 11.51318359 C41.26073964 12.99935715 41.25519928 14.48555749 41.24267578 15.97167969 C41.22662242 18.25028415 41.24251749 20.52711496 41.26171875 22.80566406 C41.25973634 24.24837632 41.25589271 25.69108748 41.25 27.13378906 C41.24661621 28.45121094 41.24323242 29.76863281 41.23974609 31.12597656 C41.11164551 32.15980469 40.98354492 33.19363281 40.8515625 34.25878906 C37.78425809 36.30365867 37.15964033 36.51004821 33.703125 36.51757812 C32.87216309 36.52388245 32.04120117 36.53018677 31.18505859 36.53668213 C30.29125488 36.53263367 29.39745117 36.52858521 28.4765625 36.52441406 C27.55568848 36.52632751 26.63481445 36.52824097 25.68603516 36.5302124 C23.73925503 36.53157327 21.79246581 36.5278837 19.84570312 36.51953125 C16.86307422 36.50883036 13.88104764 36.51942989 10.8984375 36.53222656 C9.00781117 36.53090495 7.11718521 36.52834252 5.2265625 36.52441406 C3.88585693 36.53048676 3.88585693 36.53048676 2.51806641 36.53668213 C1.27162354 36.52722565 1.27162354 36.52722565 0 36.51757812 C-0.73041504 36.51598694 -1.46083008 36.51439575 -2.21337891 36.51275635 C-4.1484375 36.25878906 -4.1484375 36.25878906 -7.1484375 34.25878906 C-7.53662109 31.12597656 -7.53662109 31.12597656 -7.546875 27.13378906 C-7.54974518 26.43108887 -7.55261536 25.72838867 -7.55557251 25.00439453 C-7.55761464 23.51822097 -7.55207428 22.03202063 -7.53955078 20.54589844 C-7.52349742 18.26729398 -7.53939249 15.99046317 -7.55859375 13.71191406 C-7.55661134 12.2692018 -7.55276771 10.82649065 -7.546875 9.38378906 C-7.54349121 8.06636719 -7.54010742 6.74894531 -7.53662109 5.39160156 C-7.40852051 4.35777344 -7.28041992 3.32394531 -7.1484375 2.25878906 C-4.08113309 0.21391946 -3.45651533 0.00752991 0 0 Z " fill = "#FDAA32" transform = "translate(7.1484375,5.7412109375)" /> <path d="M0 0 C0.83096191 -0.00630432 1.66192383 -0.01260864 2.51806641 -0.019104 C3.85877197 -0.01303131 3.85877197 -0.01303131 5.2265625 -0.00683594 C6.14743652 -0.00874939 7.06831055 -0.01066284 8.01708984 -0.01263428 C9.96386997 -0.01399514 11.91065919 -0.01030557 13.85742188 -0.00195312 C16.84005078 0.00874776 19.82207736 -0.00185176 22.8046875 -0.01464844 C24.69531383 -0.01332683 26.58593979 -0.0107644 28.4765625 -0.00683594 C29.81726807 -0.01290863 29.81726807 -0.01290863 31.18505859 -0.019104 C32.43150146 -0.00964752 32.43150146 -0.00964752 33.703125 0 C34.79874756 0.00238678 34.79874756 0.00238678 35.91650391 0.00482178 C37.8515625 0.25878906 37.8515625 0.25878906 40.8515625 2.25878906 C40.8515625 6.21878906 40.8515625 10.17878906 40.8515625 14.25878906 C25.0115625 14.25878906 9.1715625 14.25878906 -7.1484375 14.25878906 C-7.1484375 10.29878906 -7.1484375 6.33878906 -7.1484375 2.25878906 C-4.08113309 0.21391946 -3.45651533 0.00752991 0 0 Z " fill = "#363633" transform = "translate(7.1484375,5.7412109375)" /> <path d="M0 0 C12.54 0 25.08 0 38 0 C38 2.97 38 5.94 38 9 C25.46 9 12.92 9 0 9 C0 6.03 0 3.06 0 0 Z " fill = "#F1E1C8" transform = "translate(5,25)" /> <path d="M0 0 C0.83096191 -0.00630432 1.66192383 -0.01260864 2.51806641 -0.019104 C3.85877197 -0.01303131 3.85877197 -0.01303131 5.2265625 -0.00683594 C6.14743652 -0.00874939 7.06831055 -0.01066284 8.01708984 -0.01263428 C9.96386997 -0.01399514 11.91065919 -0.01030557 13.85742188 -0.00195312 C16.84005078 0.00874776 19.82207736 -0.00185176 22.8046875 -0.01464844 C24.69531383 -0.01332683 26.58593979 -0.0107644 28.4765625 -0.00683594 C29.81726807 -0.01290863 29.81726807 -0.01290863 31.18505859 -0.019104 C32.43150146 -0.00964752 32.43150146 -0.00964752 33.703125 0 C34.79874756 0.00238678 34.79874756 0.00238678 35.91650391 0.00482178 C37.8515625 0.25878906 37.8515625 0.25878906 40.8515625 2.25878906 C40.8515625 3.90878906 40.8515625 5.55878906 40.8515625 7.25878906 C25.0115625 7.25878906 9.1715625 7.25878906 -7.1484375 7.25878906 C-7.1484375 5.60878906 -7.1484375 3.95878906 -7.1484375 2.25878906 C-4.08113309 0.21391946 -3.45651533 0.00752991 0 0 Z " fill = "#FFAB32" transform = "translate(7.1484375,5.7412109375)" /> <path d="M0 0 C0 0.66 0 1.32 0 2 C0.99 1.34 1.98 0.68 3 0 C5.4665842 -0.18973725 7.44365029 -0.17266025 9.8125 0.5625 C12.17106376 1.03421275 13.64680358 0.7795236 16 0.375 C18.98688228 -0.06523078 19.72621612 -0.14373654 22.5 1.3125 C24 3 24 3 24 5 C23.443125 4.91621094 22.88625 4.83242188 22.3125 4.74609375 C18.29105677 4.20944845 14.65376503 3.90841554 10.625 4.5 C7 5 7 5 4 4 C2.7934375 4.2784375 2.7934375 4.2784375 1.5625 4.5625 C-1 5 -1 5 -3.0625 3.9375 C-3.701875 3.628125 -4.34125 3.31875 -5 3 C-7.23470405 3.78309467 -7.23470405 3.78309467 -9 5 C-8.625 3.0625 -8.625 3.0625 -8 1 C-5.29120665 -0.35439668 -2.99066732 -0.06501451 0 0 Z " fill = "#94A4AF" transform = "translate(16,27)" /> <path d="M0 0 C5.61 0 11.22 0 17 0 C17 2.31 17 4.62 17 7 C15.68 6.67 14.36 6.34 13 6 C13.66 6 14.32 6 15 6 C13.72156117 3.70992314 13.72156117 3.70992314 11 2 C7.27297245 1.94101107 3.67642697 2.41684262 0 3 C0 2.01 0 1.02 0 0 Z " fill = "#F1F5F8" transform = "translate(25,26)" /> <path d="M0 0 C1.203125 2.05078125 1.203125 2.05078125 2 4 C1.1646875 3.87431641 1.1646875 3.87431641 0.3125 3.74609375 C-5.05791108 3.02943416 -9.65383432 3.12517289 -15 4 C-14.375 2.0625 -14.375 2.0625 -13 0 C-8.52973151 -1.35147652 -4.50933743 -1.12733436 0 0 Z " fill = "#A2B0BA" transform = "translate(38,28)" /> <path d="M0 0 C1.98 0 3.96 0 6 0 C6.66 1.32 7.32 2.64 8 4 C3.545 3.01 3.545 3.01 -1 2 C-0.67 1.34 -0.34 0.68 0 0 Z " fill = "#90A0AC" transform = "translate(32,28)" /> </svg>\`,
    "american-express": \`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#016dd1" d="M6,10c0-2.209,1.791-4,4-4h28c2.209,0,4,1.791,4,4v2.5l-0.423,0.492L42,13.5v10l-0.343,0.489L42,24.5	l-0.303,0.736L42,25.874v7.202l-0.31,0.641L42,34.498l-0.397,0.525L42,35.504V37.5c0,2.209-1.791,4.5-4,4.5H10c-2.209,0-4-1.791-4-4	V10z"/><path fill="#016dd1" d="M35.041,20.208L32.029,13.5h-3.86v9.635L23.866,13.5h-3.257l-4.393,10h2.6l0.961-2.232h4.916	L25.67,23.5h4.963v-7.427l3.293,7.427h2.239l3.368-7.298V23.5H42v-10h-3.932L35.041,20.208z M20.706,19.108l1.47-3.495l1.527,3.495	H20.706z"/><path fill="#016dd1" d="M42,24.5h-3.599l-3.318,3.197L31.802,24.5h-3.577h-0.021h-8.979v10h8.979h0.021h3.566l3.305-3.321	l3.317,3.321H42l-5.059-5.15L42,24.5z M28.225,34.478l-0.002-2.077L21.684,32.4v-1.978h6.212v-1.895h-6.212v-1.873l6.541,0.016	v-2.15l5.001,4.855L28.225,34.478z"/><polygon fill="#fff" points="42,34.5 42,33.073 38.363,29.371 42,25.885 42,24.5 36.941,29.35"/><polygon fill="#fff" points="28.225,26.671 21.684,26.654 21.684,28.527 27.896,28.527 27.896,30.422 21.684,30.422 21.684,32.4 28.223,32.401 28.225,34.478 33.225,29.376 28.225,24.521"/><polygon fill="#fff" points="23.703,19.108 22.176,15.613 20.706,19.108"/><polygon fill="#fff" points="38.413,34.5 35.096,31.179 31.79,34.5 28.225,34.5 28.203,34.5 19.225,34.5 19.225,24.5 19.474,24.5 25.016,24.5 25.67,24.5 28.203,24.5 28.225,24.5 30.633,24.5 31.633,24.5 31.802,24.5 35.084,27.697 38.401,24.5 38.533,24.5 39.533,24.5 42,24.5 42,23.5 39.533,23.5 39.533,16.202 36.166,23.5 33.927,23.5 30.633,16.073 30.633,23.5 28.225,23.5 25.67,23.5 24.693,21.268 19.777,21.268 18.816,23.5 18.225,23.5 16.216,23.5 20.609,13.5 23.866,13.5 28.168,23.135 28.168,13.5 32.029,13.5 35.041,20.208 38.068,13.5 42,13.5 42,12.5 42,12.5 38.068,12.5 37.422,12.5 37.156,13.089 35.043,17.772 32.941,13.09 32.676,12.5 32.029,12.5 28.168,12.5 27.168,12.5 27.168,13.5 27.168,18.442 24.78,13.092 24.515,12.5 23.866,12.5 20.609,12.5 19.956,12.5 19.693,13.098 15.3,23.098 14.684,24.5 16.216,24.5 18.225,24.5 18.225,34.5 18.225,35.5 19.225,35.5 28.203,35.5 31.79,35.5 32.206,35.5 32.499,35.205 35.097,32.595 37.705,35.207 37.998,35.5 38.413,35.5 42,35.5 42,34.5"/></svg>\`,
    "mastercard": \`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#3F51B5" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/><path fill="#FFC107" d="M30 14A10 10 0 1 0 30 34A10 10 0 1 0 30 14Z"/><path fill="#FF3D00" d="M22.014,30c-0.464-0.617-0.863-1.284-1.176-2h5.325c0.278-0.636,0.496-1.304,0.637-2h-6.598C20.07,25.354,20,24.686,20,24h7c0-0.686-0.07-1.354-0.201-2h-6.598c0.142-0.696,0.359-1.364,0.637-2h5.325c-0.313-0.716-0.711-1.383-1.176-2h-2.973c0.437-0.58,0.93-1.122,1.481-1.595C21.747,14.909,19.481,14,17,14c-5.523,0-10,4.477-10,10s4.477,10,10,10c3.269,0,6.162-1.575,7.986-4H22.014z"/></svg>\`,
    "visa": \`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40" width="40px" height="40px"><path fill="#8bb7f0" d="M4,32.5c-1.379,0-2.5-1.122-2.5-2.5V10c0-1.378,1.121-2.5,2.5-2.5h32c1.379,0,2.5,1.122,2.5,2.5v20 c0,1.378-1.121,2.5-2.5,2.5H4z"/><path fill="#4e7ab5" d="M36,8c1.103,0,2,0.897,2,2v20c0,1.103-0.897,2-2,2H4c-1.103,0-2-0.897-2-2V10c0-1.103,0.897-2,2-2 H36 M36,7H4c-1.657,0-3,1.343-3,3v20c0,1.657,1.343,3,3,3h32c1.657,0,3-1.343,3-3V10C39,8.343,37.657,7,36,7L36,7z"/><path fill="#fff" d="M12.1 15.001L9.699 22.12c0 0-.597-2.911-.657-3.29-1.367-3.101-3.397-3.028-3.397-3.028L8.022 25v-.002h2.89l3.996-9.997H12.1zM14.389 25L17.014 25 18.601 15.001 15.943 15.001zM32.967 15.001h-2.762L25.898 25h2.608l.538-1.428h3.288L32.611 25H35L32.967 15.001zM29.771 21.662l1.429-3.779.748 3.779H29.771zM22.325 17.915c0-.551.455-.961 1.761-.961.848 0 1.82.613 1.82.613l.426-2.099c0 0-1.242-.468-2.46-.468-2.76 0-4.184 1.313-4.184 2.974 0 3.005 3.638 2.593 3.638 4.137 0 .265-.211.876-1.726.876-1.52 0-2.523-.554-2.523-.554l-.453 2.014c0 0 .972.551 2.85.551 1.883 0 4.494-1.4 4.494-3.411C25.968 19.17 22.325 18.995 22.325 17.915z"/><g><path fill="#ffeea3" d="M9.362,20.442l-0.864-4.353c0,0-0.4-0.935-1.438-0.935s-4.06,0-4.06,0S8.157,16.71,9.362,20.442z"/></g></svg>\`,
    "diners-club": \`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#CFD8DC" d="M45,35c0,2.2-1.8,4-4,4H7c-2.2,0-4-1.8-4-4V13c0-2.2,1.8-4,4-4h34c2.2,0,4,1.8,4,4V35z"/><path fill="#1565C0" d="M29,16H19c-4.4,0-8,3.6-8,8c0,4.4,3.6,8,8,8h10c4.4,0,8-3.6,8-8C37,19.6,33.4,16,29,16z"/><path fill="#FFF" d="M19,18c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S22.3,18,19,18z M15,24c0-1.9,1.3-3.4,3-3.9v7.7C16.3,27.4,15,25.9,15,24z M20,27.9v-7.7c1.7,0.4,3,2,3,3.9C23,25.9,21.7,27.4,20,27.9z"/></svg>\`,
    "discover": \`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#E1E7EA" d="M45,35c0,2.2-1.8,4-4,4H7c-2.2,0-4-1.8-4-4V13c0-2.2,1.8-4,4-4h34c2.2,0,4,1.8,4,4V35z"/><path fill="#FF6D00" d="M45,35c0,2.2-1.8,4-4,4H16c0,0,23.6-3.8,29-15V35z M22,24c0,1.7,1.3,3,3,3s3-1.3,3-3c0-1.7-1.3-3-3-3S22,22.3,22,24z"/><path d="M11.2,21h1.1v6h-1.1V21z M17.2,24c0,1.7,1.3,3,3,3c0.5,0,0.9-0.1,1.4-0.3v-1.3c-0.4,0.4-0.8,0.6-1.4,0.6c-1.1,0-1.9-0.8-1.9-2c0-1.1,0.8-2,1.9-2c0.5,0,0.9,0.2,1.4,0.6v-1.3c-0.5-0.2-0.9-0.4-1.4-0.4C18.5,21,17.2,22.4,17.2,24z M30.6,24.9L29,21h-1.2l2.5,6h0.6l2.5-6h-1.2L30.6,24.9z M33.9,27h3.2v-1H35v-1.6h2v-1h-2V22h2.1v-1h-3.2V27z M41.5,22.8c0-1.1-0.7-1.8-2-1.8h-1.7v6h1.1v-2.4h0.1l1.6,2.4H42l-1.8-2.5C41,24.3,41.5,23.7,41.5,22.8z M39.2,23.8h-0.3v-1.8h0.3c0.7,0,1.1,0.3,1.1,0.9C40.3,23.4,40,23.8,39.2,23.8z M7.7,21H6v6h1.6c2.5,0,3.1-2.1,3.1-3C10.8,22.2,9.5,21,7.7,21z M7.4,26H7.1v-4h0.4c1.5,0,2.1,1,2.1,2C9.6,24.4,9.5,26,7.4,26z M15.3,23.3c-0.7-0.3-0.9-0.4-0.9-0.7c0-0.4,0.4-0.6,0.8-0.6c0.3,0,0.6,0.1,0.9,0.5l0.6-0.8C16.2,21.2,15.7,21,15,21c-1,0-1.8,0.7-1.8,1.7c0,0.8,0.4,1.2,1.4,1.6c0.6,0.2,1.1,0.4,1.1,0.9c0,0.5-0.4,0.8-0.9,0.8c-0.5,0-1-0.3-1.2-0.8l-0.7,0.7c0.5,0.8,1.1,1.1,2,1.1c1.2,0,2-0.8,2-1.9C16.9,24.2,16.5,23.8,15.3,23.3z"/></svg>\`,
    "maestro": \`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#F44336" d="M33 11A13 13 0 1 0 33 37A13 13 0 1 0 33 11Z"/><path fill="#2196F3" d="M28,24h-8c0-0.682,0.068-1.347,0.169-2h7.661c-0.105-0.685-0.255-1.354-0.464-2h-6.732c0.225-0.694,0.508-1.362,0.84-2h5.051c-0.369-0.709-0.804-1.376-1.293-2h-2.465c0.379-0.484,0.79-0.941,1.233-1.367c-0.226-0.218-0.455-0.432-0.696-0.633c-2.252-1.872-5.146-3-8.304-3C7.82,11,2,16.82,2,24s5.82,13,13,13c3.496,0,6.664-1.388,9-3.633c0.443-0.426,0.854-0.883,1.232-1.367h-2.465c-0.489-0.624-0.923-1.291-1.293-2h5.051c0.333-0.638,0.616-1.306,0.841-2h-6.732c-0.209-0.646-0.358-1.315-0.464-2h7.661C27.932,25.347,28,24.682,28,24z"/></svg>\`,
    "unionpay": \`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#e21836" d="M10.09,9h11.585c1.617,0,2.623,1.362,2.246,3.039l-5.394,23.927c-0.381,1.671-2,3.034-3.618,3.034 H3.325C1.956,38.999,1.023,38.02,1,36.704c-0.004-0.237,0.021-0.484,0.079-0.739l5.396-23.927C6.852,10.362,8.471,9,10.09,9"/><path fill="#00447c" d="M20.5,9h13.47c1.657,0,0.91,1.362,0.52,3.039l-5.527,23.928C28.575,37.637,28.696,39,27.035,39H13.38 c-1.39,0-2.336-0.955-2.379-2.246c-0.008-0.251,0.018-0.516,0.081-0.788l5.711-23.928C17.187,10.362,18.657,9,20.316,9"/><path fill="#007b84" d="M33.273,9h11.401c1.183,0,2.039,0.727,2.266,1.773c0.044,0.204,0.064,0.42,0.059,0.645 c-0.005,0.2-0.031,0.408-0.079,0.62l-5.393,23.928C41.146,37.637,39.525,39,37.906,39h-11.58c-1.355,0-2.279-0.953-2.324-2.241 c-0.009-0.253,0.016-0.518,0.078-0.792l5.578-23.928C30.036,10.362,31.653,9,33.273,9z"/><path fill="#fefefe" d="M19.364 18.117c-.325-.195-.905-.134-1.302.135-.396.263-.45.636-.126.833.319.189.902.134 1.296-.137C19.626 18.68 19.685 18.31 19.364 18.117zM42.308 19.376l-1.171 2.048L40.874 19l-1.24.294.454 3.963-1.415 2.293c-.038.054-.072.091-.119.107-.052.025-.118.03-.21.03h-.04L38 26.624l.75.001c.53-.002.904-.288 1.092-.625L44 19 42.308 19.376zM22.157 25l-.404.701C21.666 25.854 21.518 26 21.19 26h-.201l-.282.875h.668c.787 0 1.158-.431 1.158-.431h2.086l.301-.933h-1.752l.28-.51L22.157 25zM10.416 19.885c-.194.75-.341 1.24-.679 1.585-.233.238-.593.351-.923.35-.493 0-.91-.311-.883-.823.002-.038.007-.078.014-.119C8.187 19.531 9.242 16 9.242 16H7.275l-1.02 4.03c0 0-.25.968-.255 1.379-.004.313.047.569.164.785C6.54 22.879 7.652 23 8.288 23c1.088 0 1.731-.104 2.257-.424.839-.51 1.082-1.2 1.341-2.175C12.178 19.305 13 16 13 16h-1.595C11.405 16 10.417 19.883 10.416 19.885zM13.701 23l.705-2.869C14.559 20.065 14.709 20 14.851 20c.338 0 .414.281.397.393C15.234 20.529 14.658 23 14.658 23h1.404l.491-2.068c.204-.764.307-1.152.177-1.468C16.594 19.111 16.246 19 15.924 19c-.21 0-.596.073-.946.234-.127.061-.247.132-.374.202l.103-.438-1.493.234L12.25 23H13.701zM25.576 23l.705-2.869C26.434 20.065 26.584 20 26.726 20c.338 0 .414.281.397.393C27.109 20.529 26.533 23 26.533 23h1.404l.491-2.068c.204-.764.307-1.152.177-1.468C28.469 19.111 28.121 19 27.799 19c-.21 0-.596.073-.946.234-.127.061-.247.132-.374.202l.103-.438-1.493.234L24.125 23H25.576zM17 23L18.451 23 19.201 20 17.715 20.22zM35.424 16.62c-.414-.603-1.269-.615-2.257-.62-.001 0-.727 0-.727 0h-1.614L29 23h1.579l.665-2.5h.294c1.007 0 1.972-.014 2.809-.618.585-.426 1.033-.992 1.228-1.757.05-.187.09-.41.096-.633C35.678 17.199 35.588 16.847 35.424 16.62zM33.742 18.19c-.115.467-.428.86-.822 1.049-.324.16-.721.137-1.125.136h-.252L32.175 17c.142 0 .38 0 .62 0 .75 0 .988.477.986.875C33.781 17.978 33.768 18.084 33.742 18.19zM28.47 29c0 0-.075.219-.099.293-.02.063-.1.207-.327.207h-.419V29H26.5v2.5c-.007.183.179.5.998.5h.932l.286-.876-.84.001c-.25 0-.245-.116-.248-.3-.003-.2-.003-.575-.003-.575h.794c.73 0 .89-.606.946-.787L29.474 29H28.47z"/><path fill="#fefefe" d="M28.824 25c-1.502 0-1.795.67-1.795.67L27.235 25h-1.21l-1.979 6.083c-.021.07-.048.18-.046.299C24.006 31.664 24.174 32 24.964 32l.718-.001L26.002 31c0 0-.36 0-.485 0-.157 0-.125-.13-.125-.13l.709-2.152h1.778c1.47 0 1.743-.9 1.875-1.31L30.538 25C30.538 25 29.369 25 28.824 25zM28.298 28h-2.001l.206-.604h2.005L28.298 28zM28.822 26.518c0 0-1.012-.01-1.175.02-.717.124-1.018.508-1.018.508L26.967 26h2.023L28.822 26.518zM37.507 19.234c0 0-.01.04-.028.111C37.325 19.179 37.07 19 36.668 19c-.5 0-.937.179-1.45.617-.451.39-.677.926-.811 1.439-.052.19-.083.491-.083.694 0 1.25 1.082 1.25 1.345 1.25.395 0 .71-.151.965-.347C36.602 22.776 36.543 23 36.543 23h1.451L39 19 37.507 19.234zM36.098 22.116c-.063 0-.438 0-.429-.411.004-.203.052-.43.125-.691.17-.608.399-1.139 1-1.139.47 0 .461.377.26 1.133-.058.217-.221.609-.348.8C36.521 22.086 36.31 22.116 36.098 22.116zM23.768 19.493C23.471 19.12 22.93 19.001 22.366 19c-.339 0-1.149.031-1.796.579-.465.396-.69.934-.831 1.449-.142.525-.316 1.471.596 1.824C20.616 22.968 21.025 23 21.29 23c.675.001 1.372-.174 1.908-.695.413-.422.614-1.051.685-1.31C24.114 20.138 23.964 19.737 23.768 19.493zM21.429 22.115c-.063 0-.438 0-.429-.411.004-.203.06-.471.125-.691.169-.572.4-1.139 1-1.139.47 0 .461.377.26 1.133-.058.217-.221.609-.348.8C21.852 22.086 21.641 22.116 21.429 22.115zM20.847 27.115L20.556 28h.846l-.248.769h-.848L20 29.706h.845l-.536 1.639c-.072.217-.075.654.738.654h1.627L23 31c0 0-.931 0-1.181 0s-.183-.177-.183-.177l.368-1.132h1.746l.302-.921h-1.747L22.56 28h1.713l.297-.885H20.847zM39.7 27.916L40 27h-4.037l-.294.916h1.211l-.247.743h-1.232l-.263.812h1.082l-.963 1.265C35.18 30.847 35.017 31 34.749 31h-.486l.095-.289H33.94L35.479 26h.547l.172-.518c0 0 0 .381 0 .517 0 .434.125.626.821.626h.478L37.8 25.69h-.223c-.147.003-.217-.044-.205-.138V25c0 0-.799 0-1.25 0-1.175 0-1.903.055-2.193.132-.351.09-.807.357-.807.357L33.279 25H31.98l-1.862 5.722h-.28L29.52 31.69h2.874L32.293 32h1.229l.1-.31h.402L33.919 32h1.02c.259 0 .468-.058.642-.155.182-.101.325-.244.447-.407l.756-1.006.115 1.055C36.928 31.679 37.002 32 37.791 32h.568l.329-1h-.371c-.265 0-.322-.195-.337-.297l-.132-1.024h-.615l.25-.208h1.703l.268-.812h-1.585l.251-.743C38.12 27.916 39.7 27.916 39.7 27.916zM32.964 26h1.303l-.278.853c0 0-.462.028-.693.08-.393.09-.72.248-.72.248L32.964 26zM32.729 30.722h-1.306l.347-1.064h1.303L32.729 30.722zM33.408 28.622c0 0-.346.043-.574.095C32.435 28.832 31.979 29 31.979 29l.4-1.218h1.308L33.408 28.622z"/></svg>\`,
}
`;

export default credit_card_input_component;