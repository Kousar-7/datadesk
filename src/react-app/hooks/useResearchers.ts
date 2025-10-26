import { useState, useEffect } from 'react';
import { Researcher, CreateResearcher, UpdateResearcher } from '@/shared/types';

export function useResearchers(search: string = '') {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResearchers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      
      const response = await fetch(`/api/researchers?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch researchers');
      }
      
      const data = await response.json();
      setResearchers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchers();
  }, [search]);

  const createResearcher = async (researcher: CreateResearcher) => {
    try {
      const response = await fetch('/api/researchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(researcher),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create researcher');
      }

      const newResearcher = await response.json();
      setResearchers(prev => [newResearcher, ...prev]);
      return newResearcher;
    } catch (err) {
      throw err;
    }
  };

  const updateResearcher = async (id: number, updates: UpdateResearcher) => {
    try {
      const response = await fetch(`/api/researchers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update researcher');
      }

      const updatedResearcher = await response.json();
      setResearchers(prev => prev.map(r => r.id === id ? updatedResearcher : r));
      return updatedResearcher;
    } catch (err) {
      throw err;
    }
  };

  const deleteResearcher = async (id: number) => {
    try {
      const response = await fetch(`/api/researchers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete researcher');
      }

      setResearchers(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    researchers,
    loading,
    error,
    createResearcher,
    updateResearcher,
    deleteResearcher,
    refetch: fetchResearchers,
  };
}
