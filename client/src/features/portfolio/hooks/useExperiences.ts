import { useState, useEffect, useCallback } from 'react';
import type { Experience } from '../../../dataTypes/dataTypesPortfolio';
import { experiences as fallbackExperiences } from '../data/portfolioData';
import {
  getExperiences,
  createExperienceApi,
  updateExperienceApi,
  deleteExperienceApi,
} from '../../../api/portfolio/apiPortfolio';

export function useExperiences() {
  const [items, setItems] = useState<Experience[]>(fallbackExperiences);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExperiences();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
      } else {
        setItems(fallbackExperiences);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
      setItems(fallbackExperiences);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getExperiences()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(fallbackExperiences);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
        setItems(fallbackExperiences);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const create = async (experience: Omit<Experience, 'id' | '_id'>): Promise<Experience> => {
    setLoading(true);
    setError(null);
    try {
      const created = await createExperienceApi(experience);
      setItems((prev) => [...prev, created]);
      return created;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create experience';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, updates: Partial<Experience>): Promise<Experience> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateExperienceApi(id, updates);
      setItems((prev) =>
        prev.map((item) => ((item.id === id || item._id === id) ? updated : item))
      );
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update experience';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteExperienceApi(id);
      setItems((prev) => prev.filter((item) => item.id !== id && item._id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete experience';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
  };
}
