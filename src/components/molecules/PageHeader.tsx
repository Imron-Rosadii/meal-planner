interface PageHeaderProps {
  title: string;
  description?: string;
}

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
    </header>
  );
}

export default PageHeader;
