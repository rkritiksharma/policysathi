
import { getDashboardStats, getUpcomingRenewals, getOverduePolicies, getExpiringNotifications, getRevenueStats, getTodayRenewals } from './app/(dashboard)/dashboard/actions';

async function test() {
    try {
        console.log('Testing getDashboardStats...');
        const stats = await getDashboardStats();
        console.log('Stats:', stats);

        console.log('Testing getRevenueStats...');
        const revenue = await getRevenueStats('6M');
        console.log('Revenue stats length:', revenue.monthlyData.length);

        console.log('Testing getTodayRenewals...');
        const today = await getTodayRenewals();
        console.log('Today renewals:', today.length);

        console.log('All tests passed!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
