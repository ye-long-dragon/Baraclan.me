import { useState, useEffect, useCallback } from 'react';
import type { Skill } from '../../../dataTypes/dataTypesPortfolio';
import { skills as fallbackSkills } from '../data/portfolioData';
import {
  getSkills,
  createSkillApi,
  updateSkillApi,
  deleteSkillApi,
} from '../../../api/portfolio/apiPortfolio';

export function useSkills() {
  const [items, setItems] = useState<Skill[]>(fallbackSkills);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSkills();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
      } else {
        setItems(fallbackSkills);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch skills');
      setItems(fallbackSkills);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getSkills()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(fallbackSkills);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch skills');
        setItems(fallbackSkills);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const create = async (skill: Omit<Skill, 'id' | '_id'>): Promise<Skill> => {
    setLoading(true);
    setError(null);
    try {
      const created = await createSkillApi(skill);
      setItems((prev) => [...prev, created]);
      return created;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create skill';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, updates: Partial<Skill>): Promise<Skill> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateSkillApi(id, updates);
      setItems((prev) =>
        prev.map((item) => ((item.id === id || item._id === id) ? updated : item))
      );
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update skill';
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
      await deleteSkillApi(id);
      setItems((prev) => prev.filter((item) => item.id !== id && item._id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete skill';
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
