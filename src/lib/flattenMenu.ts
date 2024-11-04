

export interface MenuItem {
    key: string;
    name: string;
    items?: MenuItem[];
}

export interface FlattenedMenu {
    first_menu: string;
    second_menu: string;
}

export const flattenMenuStructure = (menuData: MenuItem[]): FlattenedMenu[] => {
    const flattenedMenus: FlattenedMenu[] = [];

    const findDeepestItems = (item: MenuItem, firstMenuName: string) => {
        if (!item.items || item.items.length === 0) {
            // 최하위 메뉴인 경우
            flattenedMenus.push({
                first_menu: firstMenuName,
                second_menu: item.name
            });
            return;
        }

        // 하위 메뉴가 있는 경우 재귀적으로 탐색
        item.items.forEach(subItem => {
            findDeepestItems(subItem, firstMenuName);
        });
    };

    // 1차 메뉴부터 시작하여 최하위 메뉴까지 탐색
    menuData.forEach(topLevelItem => {
        if (topLevelItem.items) {
            topLevelItem.items.forEach(subItem => {
                findDeepestItems(subItem, topLevelItem.name);
            });
        }
    });

    return flattenedMenus;
};