import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../../../dataTypes/dataTypesPortfolio';
import { projects as fallbackProjects } from '../data/portfolioData';
import {
  getProjects,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from '../../../api/portfolio/apiPortfolio';

export function useProjects() {
  const [items, setItems] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
      } else {
        setItems(fallbackProjects);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      setItems(fallbackProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getProjects()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(fallbackProjects);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        setItems(fallbackProjects);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const create = async (project: Omit<Project, 'id' | '_id'>): Promise<Project> => {
    setLoading(true);
    setError(null);
    try {
      const created = await createProjectApi(project);
      setItems((prev) => [...prev, created]);
      return created;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create project';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, updates: Partial<Project>): Promise<Project> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProjectApi(id, updates);
      setItems((prev) =>
        prev.map((item) => ((item.id === id || item._id === id) ? updated : item))
      );
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update project';
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
      await deleteProjectApi(id);
      setItems((prev) => prev.filter((item) => item.id !== id && item._id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete project';
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
