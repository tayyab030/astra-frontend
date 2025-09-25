import React from 'react'

import dynamic from 'next/dynamic'

const AuthLayout = dynamic(() => import('@/components/AuthLayout'), { ssr: false })

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    )
}

export default layout