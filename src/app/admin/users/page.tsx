'use client';
import { UserList } from '@/components/users/user-list';

export default function ManageUsersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Manage Users</h1>
            </div>
            <UserList />
        </div>
    )
}
