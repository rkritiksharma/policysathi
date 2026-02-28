'use server'

import { logout as logoutAction } from '@/app/login/actions'

export async function handleLogout() {
    await logoutAction()
}
