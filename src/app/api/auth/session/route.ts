export async function GET() {
  // stub pour dev : renvoie "pas de session"
  return Response.json({ user: null }, { status: 200 });
}
