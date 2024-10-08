export const metadata = {
  title: "Manage Component",
};

export default function ComponentLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
