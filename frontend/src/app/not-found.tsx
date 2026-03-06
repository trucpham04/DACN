import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <p className="text-muted-foreground">
            The page you are looking for could not be found.
          </p>
          <Link href="/" className="text-primary underline underline-offset-4">
            Back to homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
