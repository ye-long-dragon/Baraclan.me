import type { User } from '../../dataTypes/dataTypeUser';
import type { UserForm } from '../../dataTypes/dataTypeUserForm';
import { createUser, updateUser } from '../users/user';

/** Creates a user, or updates one when editingId is given. Password is only sent on update if changed. */
export async function saveUser(form: UserForm, editingId?: string): Promise<User> {
    if (!editingId) return createUser(form);

    const { name, email, role, img, password } = form;
    const payload: Partial<User> = { name, email, role, img, ...(password && { password }) };
    return updateUser(editingId, payload);
}
