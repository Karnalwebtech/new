import { siteName } from '@/config'
import React, { memo } from 'react'

const Footer = () => {
    return (
        <footer className="text-gray-300 pb-4">
            <div className="mt-2 text-center text-sm border-t pt-4">
                © {new Date().getFullYear()} {siteName}. All Rights Reserved.
            </div>
        </footer>
    )
}

export default memo(Footer)