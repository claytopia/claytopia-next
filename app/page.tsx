export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-4">Claytopia</h1>
      <p className="text-foreground-muted mb-8">Design system test page</p>

      <div className="space-y-4">
        <div className="p-4 bg-background-alt rounded-lg">
          <p>Background alt (sage-100)</p>
        </div>
        <div className="p-4 bg-primary text-white rounded-lg">
          <p>Primary (sage-600)</p>
        </div>
        <div className="p-4 bg-accent text-white rounded-lg">
          <p>Accent (lilac-500)</p>
        </div>
      </div>
    </main>
  );
}
