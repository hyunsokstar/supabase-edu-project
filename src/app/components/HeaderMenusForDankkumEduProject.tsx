
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
    MenubarSubContent,
} from "@/components/ui/menubar";
import DialogButtonForAuthMenus from '../DialogButtonForAuthMenus';

const HeaderMenusForDankkumEduProject = () => {

    const renderMenuItems = (items: MenuItemType[]) => {
        return items.map((item) => (
            <React.Fragment key={item.key}>
                {item.items && item.items.length > 0 ? (
                    <MenubarSub>
                        <MenubarSubTrigger className="flex items-center justify-between w-full text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors">
                            {item.name}
                        </MenubarSubTrigger>
                        <MenubarSubContent className="bg-white border border-gray-200 rounded-md shadow-lg p-2">
                            {renderMenuItems(item.items)}
                        </MenubarSubContent>
                    </MenubarSub>
                ) : (
                    <MenubarItem asChild>
                        <Link href={`/ ${item.key} `} className="w-full block py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 transition-colors">
                            {item.name}
                        </Link>
                    </MenubarItem>
                )}
            </React.Fragment>
        ));
    };

    return (
        <header className="bg-background">
            <div className="container mx-auto">
                <Menubar className="flex justify-between h-14 mt-2">

                    <div>
                        {HEADER_MENU_ITEMS.map((topLevelItem) => (
                            <MenubarMenu key={topLevelItem.key}>
                                <MenubarTrigger className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary py-2 px-4">
                                    {topLevelItem.name}
                                </MenubarTrigger>
                                <MenubarContent className="bg-white border border-gray-200 rounded-md shadow-lg p-2 mt-2">
                                    {renderMenuItems(topLevelItem.items || [])}
                                </MenubarContent>
                            </MenubarMenu>
                        ))}
                    </div>
                    <div className="ml-auto">
                        <DialogButtonForAuthMenus />
                    </div>
                </Menubar>
            </div>
        </header>
    );
};

export default HeaderMenusForDankkumEduProject;
