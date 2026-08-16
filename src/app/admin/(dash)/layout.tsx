import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { adminApi, requireSession } from "@/lib/admin/api";
import { currentStaff } from "@/lib/admin/session";
import { site } from "@/lib/site";
import { logout } from "@/app/admin/actions";
import SidebarNav, { type NavItem } from "@/components/admin/SidebarNav";

/**
 * The signed-in shell. Login lives outside this route group so it renders
 * without the sidebar.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();
  const staff = await currentStaff();

  // An account still on the password it was issued sees nothing until it picks
  // its own. Enforced here, in the layout every dashboard page renders inside,
  // rather than in the proxy — same reasoning as the auth check itself.
  if (staff?.mustChangePassword) redirect("/admin/account/password");

  // Unread counts in the nav, so staff can see there is work waiting without
  // opening each section. A backend that is down must not blank the shell —
  // the pages themselves report that.
  let badges = { applications: 0, inquiries: 0 };
  try {
    const stats = await adminApi.stats();
    badges = {
      applications: stats.applications_new,
      inquiries: stats.inquiries_new,
    };
  } catch {
    /* counts are a nicety; the shell renders regardless */
  }

  const items: NavItem[] = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/applications", label: "Applications", badge: badges.applications },
    { href: "/admin/inquiries", label: "Inquiries", badge: badges.inquiries },
    { href: "/admin/subscribers", label: "Subscribers" },
    { href: "/admin/blog", label: "Journal" },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[100rem] flex-col gap-8 px-5 py-6 lg:flex-row lg:gap-10 lg:px-8 lg:py-8">
      <aside className="lg:sticky lg:top-8 lg:h-fit lg:w-60 lg:shrink-0">
        <div className="mb-5 flex items-center justify-between gap-3 lg:mb-7">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/img/logo.jpeg"
              alt=""
              width={34}
              height={34}
              className="size-[34px] rounded-xl object-contain"
            />
            <span className="font-display text-sm leading-tight">
              {site.shortName}
              <span className="block text-[0.7rem] font-normal text-muted">
                Dashboard
              </span>
            </span>
          </Link>
        </div>

        <SidebarNav items={items} />

        <div className="mt-6 hidden border-t border-mist/12 pt-5 lg:block">
          {staff && (
            <p
              className="truncate px-4 pb-3 text-[0.7rem] text-muted"
              title={staff.email}
            >
              Signed in as {staff.email}
            </p>
          )}
          <Link
            href="/"
            className="block px-4 py-2 text-xs text-muted transition-colors hover:text-bone"
          >
            View the public site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-2 text-xs text-muted transition-colors hover:text-ember"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-16">{children}</div>
    </div>
  );
}
