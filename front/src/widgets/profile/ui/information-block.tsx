interface Props {
  label: string;
  content?: string;
  isLoading?: boolean;
}

export default function InformationBlock({ label, content, isLoading }: Props) {
  return (
    <div className="p-2 rounded-lg flex items-center justify-between gap-2 bg-muted font-mono">
      <p className="text-muted-foreground">{label}</p>
      <p className="text-foreground truncate lg:max-w-[400px] md:max-w-[200px] sm:max-w-[150px] max-w-[100px]">
        {isLoading ? 'Загрузка...' : content}
      </p>
    </div>
  );
}
