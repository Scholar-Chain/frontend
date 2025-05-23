"use client"
import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig, darkTheme } from "@xellar/kit";
import { liskSepolia } from "wagmi/chains";
 
export const config = defaultConfig({
  appName: "Scholar Chain",
  // Required for WalletConnect
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
 
  // Required for Xellar Passport
  xellarAppId: process.env.NEXT_PUBLIC_XELLAR_APP_ID,
  xellarEnv: !process.env.NEXT_PUBLIC_XELLAR_ENV ? 'sandbox' : 'sandbox',
  ssr: true, // Use this if you're using Next.js App Router
  chains: [liskSepolia],
}) as Config;
 
const queryClient = new QueryClient();
 
export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider
          theme={darkTheme}
        >
          {children}
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};