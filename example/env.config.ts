import { envServer, envPublic } from "../src/main";

export const config = {
	databaseUrl: envServer.DATABASE_URL,
	publicUrl: envPublic.NEXT_PUBLIC_URL,
};
