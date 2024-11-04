// src/components/MenuPathIndicator/index.tsx

'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HEADER_MENU_ITEMS, MenuItemType } from '@/constants/menu'

// 경로를 Breadcrumb 형식으로 보여주는 컴포넌트
const MenuPathIndicator: React.FC = () => {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(Boolean)

    const [menuItems] = useState<MenuItemType[]>(HEADER_MENU_ITEMS)

    const navigationItems: { name: string; path: string }[] = []
    let currentItems = menuItems

    // 첫 번째 경로로 '홈'을 항상 추가
    navigationItems.push({ name: '홈', path: '/' })

    // 경로 세그먼트를 이용해 Breadcrumb 생성
    for (const segment of pathSegments) {
        const menuItem = currentItems.find(item => item.key === segment)
        if (menuItem) {
            navigationItems.push({
                name: menuItem.name,
                path: `${navigationItems[navigationItems.length - 1].path}${segment}/`,
            })
            currentItems = menuItem.items || []
        } else {
            break
        }
    }

    return (
        <nav className="flex items-center gap-2 px-6 py-3">
            {navigationItems.map((item, index) => (
                <React.Fragment key={item.path}>
                    {index > 0 && <span className="text-gray-400">/</span>}
                    {index === navigationItems.length - 1 ? (
                        <span className="font-semibold text-gray-800">{item.name}</span>
                    ) : (
                        <Link href={item.path} className="text-blue-600 hover:underline">
                            {item.name}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    )
}

export default MenuPathIndicator