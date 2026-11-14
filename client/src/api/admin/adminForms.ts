import type { Skill, Experience, Project } from '../../dataTypes/dataTypesPortfolio';
import type { UserForm } from '../../dataTypes/dataTypeUserForm';

// Each validator returns an error message, or null when the form is valid.

export function validateUserForm(form: UserForm, isEditing: boolean): string | null {
    if (!form.email.trim()) return 'Email is required';
    if (!isEditing && !form.password) return 'Password is required for new accounts';
    if ((!isEditing || form.password) && form.password !== form.rePassword) return 'Passwords do not match';
    return null;
}

export const validateSkill = (f: Skill) => (f.skillName.trim() ? null : 'Skill name is required');

export const validateProject = (f: Project) => (f.name.trim() ? null : 'Project name is required');

export const validateExperience = (f: Experience) =>
    f.company.trim() ? null : 'Company/Institution name is required';
