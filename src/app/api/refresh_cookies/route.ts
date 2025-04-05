export async function GET(req: Request) {
  await initiateGoogleClients(true);

  return Response.json(JSON.stringify({ data: "ok" }), { status: 203 });
}
function initiateGoogleClients(arg0: boolean) {
  throw new Error("Function not implemented.");
}
