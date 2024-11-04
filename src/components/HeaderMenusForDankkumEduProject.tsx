'use client';
import * as React from 'react';
import Link from 'next/link';
import { HEADER_MENU_ITEMS, MenuItemType } from '@/constants/menu';
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent
} from "@/components/ui/menubar";
import dynamic from 'next/dynamic';

const DialogButtonForAuthMenus = dynamic(() => import('../app/DialogButtonForAuthMenus'), { ssr: false });

const HeaderMenusForDankkumEduProject = () => {

    const renderMenuItems = (items: MenuItemType[], parentKey = '') => {
        return items.map((item) => {
            const itemKey = parentKey ? `${parentKey}/${item.key}` : item.key;

            return (
                <React.Fragment key={itemKey}>
                    {item.items && item.items.length > 0 ? (
                        <MenubarSub>
                            <MenubarSubTrigger className="flex items-center justify-between w-full text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors">
                                {item.name}
                            </MenubarSubTrigger>
                            <MenubarSubContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                                {renderMenuItems(item.items, itemKey)}
                            </MenubarSubContent>
                        </MenubarSub>
                    ) : (
                        <MenubarItem asChild>
                            <Link href={`/${itemKey}`} className="w-full block py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 transition-colors">
                                {item.name}
                            </Link>
                        </MenubarItem>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <header className="bg-background w-full">
            <div className="w-full">
                <Menubar className="flex justify-between h-14 items-center space-x-4 mt-2 w-full">
                    {/* Left-aligned menus */}
                    <div className="flex items-center space-x-6 flex-grow">
                        {HEADER_MENU_ITEMS.map((topLevelItem) => (
                            <MenubarMenu key={topLevelItem.key}>
                                <MenubarTrigger className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary py-2 px-4">
                                    {topLevelItem.name}
                                </MenubarTrigger>
                                <MenubarContent className="bg-white border border-gray-200 rounded-md shadow-lg p-2 mt-2">
                                    {renderMenuItems(topLevelItem.items || [], topLevelItem.key)}
                                </MenubarContent>
                            </MenubarMenu>
                        ))}
                    </div>
                    {/* Right-aligned authentication button */}
                    <div>
                        <DialogButtonForAuthMenus />
                    </div>
                </Menubar>
            </div>
        </header>
    );
};

export default HeaderMenusForDankkumEduProject;
