'use client';

import React, { useEffect, useState } from 'react';
import { Submission, SubmissionsApiResponse } from '@/types';
import Link from 'next/link';



export default function Page() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/author/submissions`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Gagal memuat data jurnal: ${res.status}`);
        }
        const json: SubmissionsApiResponse = await res.json();
        setSubmissions(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-5">Your Submissions</h1>
      </div>
      <div className="overflow-x-auto text-black">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-gray-600">Title</th>
              <th className="px-4 py-2 text-left text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{submission.id}</td>
                <td className="px-4 py-2">{submission.journal?.name}</td>
                <td className="px-4 py-2">{submission.status}</td>
                <td className="px-4 py-2">
                  {/* <button className="text-blue-500 hover:underline">View</button> */}
                  <Link
                    href={`/submissions/${submission.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
