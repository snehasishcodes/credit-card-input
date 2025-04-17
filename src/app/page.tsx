"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ui/theme-toggle";
import { CardCVVInput, CardExpiryInput, CardNumberInput } from "@/components/credit-card-input";
import { CodeBlock } from "@/components/ui/code-block";
import credit_card_input_component from "@/codes/credit-card-input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import usage_component from "@/codes/usage";
import { HeartIcon } from "lucide-react";

export default function Page() {
	const [number, setNumber] = useState<string | undefined>();
	const [expiry, setExpiry] = useState<string | undefined>();
	const [expiryMonth, setExpiryMonth] = useState<string | undefined>();
	const [expiryYear, setExpiryYear] = useState<string | undefined>();
	const [cvv, setCVV] = useState<string | undefined>();

	return (
		<main className="min-h-screen flex flex-col items-center gap-2 p-4">
			<div className="w-full flex flex-row justify-end items-center gap-4 px-4 sm:px-10 md:px-20">
				<ThemeToggle />
			</div>

			<div className="w-full flex flex-col justify-center items-center gap-4 p-4 sm:p-10 md:p-20">
				<h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
					Credit Card Input Component
				</h2>
				<h2 className="text-sm sm:text-base font-medium text-muted-foreground">
					Built on top of shadcn/ui for beautiful React.js and Next.js Credit Card Inputs. By <Link href="https://snehasish.xyz" className="underline">snehasish</Link>.
				</h2>

				<div className="flex flex-row justify-center items-center gap-6 my-6">
					<Button variant="default" size="lg" asChild>
						<Link href="#usage">
							Usage Docs
						</Link>
					</Button>

					<Button variant="outline" size="lg" asChild>
						<Link href="https://github.com/snehasishcodes/credit-card-input">
							Source
						</Link>
					</Button>

					<Button variant="secondary" size="lg" asChild>
						<Link href="https://buymeacoffee.com/snehasish">
							<HeartIcon />
						</Link>
					</Button>
				</div>
			</div>

			<div id="#trial" className="flex flex-col w-full sm:w-[550px] rounded-xl gap-4 p-10 border my-6">
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

				<Separator className="my-4" />

				<div className="w-full">
					<h2 className="font-medium">
						Card Number: {number ?? "undefined"}
					</h2>
					<h2 className="font-medium">
						Card Expiry (MM/YY): {expiry ?? "undefined"}
					</h2>
					<h2 className="font-medium">
						Card Expiry Month: {expiryMonth ?? "undefined"}
					</h2>
					<h2 className="font-medium">
						Card Expiry Year: {expiryYear ?? "undefined"}
					</h2>
					<h2 className="font-medium">
						Card CVV: {cvv ?? "undefined"}
					</h2>
				</div>
			</div>

			<div id="usage" className="w-full flex flex-col gap-4 p-4 sm:p-10 md:p-20">
				<h2 className="text-4xl font-bold">
					Usage
				</h2>

				<Separator className="my-4" />

				<h2 className="text-xl font-medium">
					Install Shadcn via CLI
				</h2>

				<CodeBlock
					code={`npx shadcn@latest init`}
					language="bash"
					showLineNumbers={false}
				/>

				<Separator className="my-2" />

				<h2 className="text-xl font-medium">
					Install the required Shadcn components
				</h2>
				<p>Run the shadcn add command to add the necessary shadcn components to your project:</p>

				<CodeBlock
					language="bash"
					showLineNumbers={false}
					code={`npx shadcn@latest add input`}
				/>

				<Separator className="my-2" />

				<h2 className="text-xl font-medium">
					Install the required <Link href="https://npmjs.com/package/credit-card-type" className="font-bold font-mono">credit-card-type</Link> package using npm:
				</h2>
				<p>Run the shadcn add command to add the necessary shadcn components to your project:</p>

				<CodeBlock
					language="bash"
					showLineNumbers={false}
					code={`npm i credit-card-type`}
				/>

				<Separator className="my-2" />

				<h2 className="text-xl font-medium">
					Add the component to your project
				</h2>
				<p>
					Copy and paste the code for the credit card input component into your project (recommended: /src/components/ directory).
				</p>

				<CodeBlock
					filename="credit-card-input.tsx"
					language="tsx"
					showLineNumbers={true}
					code={`${credit_card_input_component}`}
				/>

				<Separator className="my-2" /><h2 className="text-xl font-medium">
					Usage
				</h2>
				<p>
					Import the component in any file, and simply USE it!
				</p>

				<CodeBlock
					filename="usage.tsx"
					language="tsx"
					showLineNumbers={true}
					code={`${usage_component}`}
				/>

				<Separator className="my-2" />
			</div>

			<div className="w-full flex justify-center items-center gap-6 mb-10">
				<h2 className="text-sm text-muted-foreground font-medium">
					By <Link href="https://snehasish.xyz" className="underline">snehasish</Link>.
				</h2>
			</div>
		</main>
	)
}