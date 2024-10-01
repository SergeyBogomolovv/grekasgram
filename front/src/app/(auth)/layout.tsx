export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full lg:grid lg:grid-cols-2 flex flex-col justify-center">
      {children}
    </main>
  );
}
