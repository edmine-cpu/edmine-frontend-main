'use client';

import { Header } from "@/components/Header/Header";
import { RegisterForms } from "@/components/register/RegisterForms";
import { Lang } from "@/app/(types)/lang";

export default function RegisterPage() {
    return (
        <div>
            <Header lang="en" as Lang />
            <RegisterForms lang="en" as Lang />
        </div>
    );
}
