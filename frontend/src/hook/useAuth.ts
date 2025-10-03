'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuthSession = () => {
    const { data: session, status, update } = useSession();
    const router = useRouter()
    const [redirecting, setRedirecting] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated' && !redirecting) {
            setRedirecting(true)
            signIn('keycloak')
        }
    }, [status, redirecting, router])
    const userId = session?.user?.id;

    return {
        session,
        status,
        isLoading: status === 'loading',
        isAuthenticated: status === 'authenticated',
        update,
        redirecting,
        userId
    }
}