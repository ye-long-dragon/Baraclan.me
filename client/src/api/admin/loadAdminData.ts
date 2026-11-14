import { checkBackendStatus, fetchUsers } from '../users/user';
import { fetchPortfolioData } from '../portfolio/apiPortfolio';

/** Loads backend status, users and portfolio data in parallel. */
export async function loadAdminData() {
    const [status, { users }, { data: portfolio }] = await Promise.all([
        checkBackendStatus(),
        fetchUsers(),
        fetchPortfolioData(),
    ]);
    return { status, users, portfolio };
}