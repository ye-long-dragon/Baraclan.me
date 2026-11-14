import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ToastType } from './useToast';

type Entity = { _id?: string };

interface CrudApi<T> {
    create: (item: T) => Promise<T>;
    update: (id: string, item: T) => Promise<T>;
    remove: (id: string) => Promise<unknown>;
}

interface Options<T extends Entity> {
    /** Singular display name, e.g. "Skill" */
    label: string;
    emptyForm: T;
    getName: (item: T) => string;
    api: CrudApi<T>;
    onItemsChange: (updater: (items: T[]) => T[]) => void;
    showToast: (text: string, type?: ToastType) => void;
    /** Return an error message, or null if the form is valid */
    validate?: (form: T) => string | null;
}

export const getErrorMessage = (err: unknown, fallback: string) =>
    err instanceof Error && err.message ? err.message : fallback;

/** Modal state, form state, and create/update/delete handlers for one entity type. */
export function useCrudModal<T extends Entity>({
    label,
    emptyForm,
    getName,
    api,
    onItemsChange,
    showToast,
    validate,
}: Options<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<T | null>(null);
    const [form, setForm] = useState<T>(emptyForm);

    const open = (item?: T) => {
        setEditing(item ?? null);
        setForm(item ?? emptyForm);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);

    const save = async (e: FormEvent) => {
        e.preventDefault();

        const error = validate?.(form);
        if (error) return showToast(error, 'error');

        try {
            if (editing?._id) {
                const updated = await api.update(editing._id, form);
                onItemsChange((items) => items.map((i) => (i._id === updated._id ? updated : i)));
                showToast(`${label} "${getName(updated)}" updated!`);
            } else {
                const created = await api.create(form);
                onItemsChange((items) => [created, ...items]);
                showToast(`${label} "${getName(created)}" created!`);
            }
            close();
        } catch (err) {
            showToast(getErrorMessage(err, `Failed to save ${label.toLowerCase()}`), 'error');
        }
    };

    const remove = async (item: T) => {
        if (!item._id) return;
        if (!window.confirm(`Delete ${label.toLowerCase()} "${getName(item)}"?`)) return;

        try {
            await api.remove(item._id);
            onItemsChange((items) => items.filter((i) => i._id !== item._id));
            showToast(`${label} "${getName(item)}" removed.`);
        } catch (err) {
            showToast(getErrorMessage(err, `Failed to delete ${label.toLowerCase()}`), 'error');
        }
    };

    return { isOpen, editing, form, setForm, open, close, save, remove };
}