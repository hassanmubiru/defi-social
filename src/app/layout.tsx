import type { Metadata } from 'next'
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: "DeFi Connect",
  description: "DeFi Connect integrates trading, lending, and staking into messaging apps, merging ease with blockchain security, offering tangible incentives, and promoting seamless onchain financial interactions.",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_9a4940cf-2b19-403d-b731-eff69b1d82f5-rURq5LiJs8pOP2LYNWSMRqwFqymnMA",
      button: {
        title: "Open with Ohara",
        action: {
          type: "launch_frame",
          name: "DeFi Connect",
          url: "https://condition-enemy-967.preview.series.engineering",
          splashImageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg",
          splashBackgroundColor: "#ffffff"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}