interface Props {
  label: string;
  content?: string;
}

export default function InformationBlock({ label, content }: Props) {
  return (
    <div className="p-2 rounded-lg flex sm:flex-row flex-col sm:items-center justify-between gap-2 bg-muted font-mono">
      <p className="text-muted-foreground">{label}</p>
      <p className="text-foreground truncate lg:max-w-[400px] max-w-[300px]">
        {content}
      </p>
    </div>
  );
}
