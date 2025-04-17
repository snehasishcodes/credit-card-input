import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "./theme";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

const metadataParams = {
	title: "Shadcn/UI Credit Card Input",
	description: "Beautiful Credit Card Input component built on top of Shadcn/UI for React & Next.js",
	images: ["/banner.png"],
	icons: {
		icon: "/favicon.png",
		shortcut: "/favicon.png",
		apple: "/favicon.png"
	},
	siteName: "Shadcn/UI Credit Card Input",
	themeColor: "#000",
	url: "https://shadcn-credit-card-input.vercel.app",
	metabase: new URL("https://shadcn-credit-card-input.vercel.app"),
	keywords: ["credit card input", "shadcn credit card input", "shadcn/ui credit card input", "shadcn", "ui", "credit", "card", "input", "shadcn/ui", "shadcn/ui credit", "shadcn/ui credit card", "shadcn/ui credit card input component", "react credit card input", "nextjs credit card input", "nextjs", "vercel credit card input", "vercel credit card", "vercel credit card component", "react", "react component"],
	twitter: {
		card: "summary_large_image",
		creator: "@snehasishcodes"
	},
	robots: {
		index: false,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: false,
			noimageindex: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	}
}

export const metadata = {
	title: metadataParams.title,
	description: metadataParams.description,
	metadataBase: metadataParams.metabase,
	icons: metadataParams.icons,
	openGraph: {
		title: metadataParams.title,
		description: metadataParams.description,
		url: metadataParams.url,
		siteName: metadataParams.siteName,
		images: metadataParams.images,
	},
	twitter: {
		title: metadataParams.title,
		description: metadataParams.description,
		creator: metadataParams.twitter.creator,
		card: metadataParams.twitter.card,
		images: metadataParams.images
	}
}

export const viewport = {
	themeColor: metadataParams.themeColor
}