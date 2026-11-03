import { Breadcrumbs } from "./Breadcrumbs";

export function ContentPage({ title, path, children, crumbs = [] }: { title: string; path: string; children: React.ReactNode; crumbs?: Array<{ name: string; href: string }> }) {
  return (
    <div className="container-page max-w-3xl py-8">
      <Breadcrumbs items={[...crumbs, { name: title, href: path }]} />
      <h1 className="mt-3 text-3xl font-extrabold">{title}</h1>
      <div className="prose-shop mt-6">{children}</div>
    </div>
  );
}
