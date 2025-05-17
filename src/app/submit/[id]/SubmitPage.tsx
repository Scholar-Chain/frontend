/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { scholarChainABI } from "@/utils/abi";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { SCHOLARCHAIN_ADDRESS, IDRX_SEPOLIA } from "@/constants";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/components/Web3Provider";
import { liskSepolia } from "viem/chains";
import { keccak256, toBytes } from 'viem'
import { JournalDetail } from '@/types/journal'
import AuthConnectButton from '@/components/AuthConnectButton'


interface Props { journal: JournalDetail }

export default function SubmitPageClient({ journal }: Props) {
  const { address, isConnected } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract();
  const router = useRouter();
  // const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const randomString = useMemo(
    () => Math.random().toString(36).substring(2, 15),
    []
  )
  // cek sessionStorage.getItem("access_token")
  const token = sessionStorage.getItem("access_token")
  if (!token) {
    router.push("/login")
  }



  // read contract balance on idrx
  const { data: balance } = useReadContract({
    address: IDRX_SEPOLIA,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
  });
  const balanceFormatted = useMemo(() => {
    if (!balance) return 0;
    const formattedBalance = formatUnits(balance, 2);
    return parseFloat(formattedBalance);
  }
    , [balance]);
  console.log("Balance:", balanceFormatted);

    const handleApprove = async (amount: number) => {
      if (isPending) {
        return;
      }
      if (!address) {
        alert("Please connect your wallet");
        return;
      }
      if (amount <= 0) {
        alert("Amount must be greater than 0");
        return;
      }
  
      const parsedAmount = parseUnits(amount.toString(), 2);
      console.log("Parsed amount:", parsedAmount);
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: IDRX_SEPOLIA,
        functionName: "approve",
        args: [SCHOLARCHAIN_ADDRESS, parsedAmount],
      });
  
      await waitForTransactionReceipt(config, {
        hash,
        chainId: liskSepolia.id,
      });
  
      alert(`Approved ${amount} IDRX`);
      handleSubmit(parsedAmount);
    };

    // handle submit 
  const handleSubmit = async (amount: any) => {
    if (isPending) {
      return;
    }
    if (!address) {
      alert("Please connect your wallet");
      return;
    }
    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    // const parsedAmount = parseUnits(amount.toString(), 2);
    // console.log("Parsed amount:", parsedAmount);
    const articleIdHash = keccak256(toBytes(randomString));
    const hash = await writeContractAsync({
      abi: scholarChainABI,
      address: SCHOLARCHAIN_ADDRESS,
      functionName: "createSubmission",
      args: [articleIdHash, address!, amount],
    });

    await waitForTransactionReceipt(config, {
      hash,
      chainId: liskSepolia.id,
    });

    console.log("Transaction hash:", hash);
    // submit to https://scholarchain.neuronnusantara.com/api/author/submissions
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/author/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          journal_id: journal.id,
          trx_hash: hash,
        }),
      }
    );
    if (!response.ok) {
      alert("Failed to submit journal");
      return;
    }
    const data = await response.json();
    console.log("Submit response:", data);
    // redirect to /author/submissions
    router.push("/submissions/" + data.id);
    alert(`Submitted ${journal.name}`);
  }


  function numberFormat(num: number) {
    const numberString = num.toString()
    const formattedNumber = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${formattedNumber} IDRX`
  }

  return <div className="p-8 max-w-3xl mx-auto flex gap-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">Submit Journal</h1>
        <p className="mb-4">Submit your journal to the blockchain.</p>
        <div className="bg-white text-black rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{journal.name}</h2>
          <p>{numberFormat(journal.price)}</p>
          {
            isConnected ? (
              <>
                <button
                  className="mt-4 bg-blue-500 mr-4 text-white py-1 px-2 rounded"
                  onClick={() => handleApprove(journal.price)}
                >
                  Submit
                </button>
                {/* <button
                  className="mt-4 bg-green-500 text-white py-1 px-2 rounded"
                  onClick={() => handleSubmit(journalPrice)}
                >
                  Submit
                </button> */}
              </>
              // submit button
            ) : (
              <div className="flex justify-center">
                <AuthConnectButton />
              </div>
            )

          }
          
        </div>
      </div>
    </div>
}
