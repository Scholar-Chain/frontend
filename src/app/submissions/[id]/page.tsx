/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Submission, SubmissionDetailResponse } from '@/types';

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/author/submissions/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        const json: SubmissionDetailResponse = await res.json();
        setSubmission(json.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error: {error}</p>
        <Link href="/submissions" className="text-blue-500 hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-8">
        <p>No submission found.</p>
        <Link href="/submissions" className="text-blue-500 hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  const { journal } = submission;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 bg-gray-100 rounded-lg shadow-md text-black">
      <Link href="/submissions" className="text-blue-500 hover:underline">
        ← Back to submissions
      </Link>

      <h1 className="text-3xl font-bold">{journal.name}</h1>

      <div className="flex gap-4">
        <img
          src={journal.thumbnail_url}
          alt={journal.name}
          className="w-32 h-32 object-cover rounded"
        />
        <div>
          <p>
            <span className="font-semibold">Price:</span> {journal.price.toLocaleString()} IDRX
          </p>
          <p>
            <span className="font-semibold">Status:</span> {submission.status}
          </p>
          <p>
            <span className="font-semibold">Transaction:</span>{' '}
            <a
              href={`https://sepolia-blockscout.lisk.com/tx/${submission.trx_hash}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              {submission.trx_hash}
            </a>
          </p>
          <p>
            <span className="font-semibold">Submitted At:</span>{' '}
            {new Date(submission.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Scope</h2>
        <ul className="list-disc list-inside">
          {journal.scope.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Publish Months</h2>
        <p>{journal.publish_months?.join(', ')}</p>
      </section>
    </div>
  );
}
