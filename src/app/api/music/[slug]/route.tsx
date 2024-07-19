import path from "path";
import fs from "fs";
import { UPLOAD_DIR } from "@/config";

export const GET = async (req: Request, params: { slug: string }) => {
    const files = fs.readdirSync(path.resolve(UPLOAD_DIR, params.slug));
    return new Response(JSON.stringify(files), { status: 200 });
}