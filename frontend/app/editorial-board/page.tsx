"use client";

import { useEffect, useState } from 'react';
import { boardAPI } from '@/lib/api';

interface BoardMember {
  _id: string;
  name: string;
  position: string;
  affiliation: string;
  email?: string;
  photo?: string;
  bio?: string;
  order: number;
}

export default function EditorialBoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await boardAPI.getAll();
        setMembers(response.data);
      } catch (err) {
        console.error('Failed to fetch editorial board members:', err);
        setError('Failed to load editorial board members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Group members by position and order
  const groupedMembers = members.reduce((acc, member) => {
    if (!acc[member.position]) {
      acc[member.position] = [];
    }
    acc[member.position].push(member);
    return acc;
  }, {} as Record<string, BoardMember[]>);

  // Define position render order to ensure they appear logically
  const positionOrder = [
    'Honorary Chief Editor',
    'Honorary Co-Chief Editor',
    'Executive Editor',
    'Managing Editor',
    'Associate Editor',
    'Academic Editor',
    'Assistant Editor',
    'International Advisory Board',
    'Editorial Advisory Board'
  ];

  // Add any positions that aren't in the predefined order
  Object.keys(groupedMembers).forEach(pos => {
    if (!positionOrder.includes(pos)) {
      positionOrder.push(pos);
    }
  });

  return (
    <main className="w-full bg-white min-h-[600px] px-4 py-12 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#000044] mb-8 text-center border-b-2 border-orange-500 pb-4 inline-block mx-auto flex justify-center">
          Editorial Board
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000044]"></div>
          </div>
        )}

        {error && (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xl font-medium text-gray-600">Editorial board members are currently being updated.</p>
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="space-y-12">
            {positionOrder.map(position => {
              const positionMembers = groupedMembers[position];
              if (!positionMembers || positionMembers.length === 0) return null;

              return (
                <section key={position} className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-[#000044] mb-6 border-l-4 border-orange-500 pl-4">
                    {position}{positionMembers.length > 1 && !position.endsWith('(s)') && !position.endsWith('Board') && !position.endsWith('Editors') ? '(s)' : ''}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {positionMembers.map(member => (
                      <div key={member._id} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full">
                        <div className="flex items-start gap-4">
                          {member.photo && (
                            <img 
                              src={member.photo} 
                              alt={member.name} 
                              className="w-16 h-16 rounded-full object-cover border-2 border-orange-100"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{member.affiliation}</p>
                            {member.email && (
                              <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                                {member.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
