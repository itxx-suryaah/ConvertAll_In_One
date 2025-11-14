

type ToolHeaderProps = {
  title: string;
  description: string;
};

export function ToolHeader({ title, description }: ToolHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter">
          {title}
        </h1>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
