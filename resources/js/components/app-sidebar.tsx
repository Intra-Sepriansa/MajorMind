import { Link } from '@inertiajs/react';
import { BookOpenText, Compass, FlaskConical, GitCompareArrows, House, LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Assessment Studio',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Insights',
        href: '/insights',
        icon: BookOpenText,
    },
    {
        title: 'Comparison',
        href: '/comparison',
        icon: GitCompareArrows,
    },
    {
        title: 'Scenario Lab',
        href: '/scenario-lab',
        icon: FlaskConical,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Landing',
        href: '/',
        icon: House,
    },
    {
        title: 'Assessment Entry',
        href: '/assessment',
        icon: Compass,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-white/8 bg-[#000000]"
        >
            <SidebarHeader className="border-b border-white/8">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#000000]">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/8 bg-[#000000]">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
