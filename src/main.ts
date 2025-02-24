import dotenv from "dotenv";
import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

// Load environment variables from a .env file (only during server runtime)
if (typeof process !== "undefined") {
	dotenv.config();
}

/*
 * 1. `serverEnvSchema` for sensitive variables (e.g. DATABASE_URL).
 *    These values should never be exposed to the client.
 *
 * 2. `publicEnvSchema` for public variables (e.g. NEXT_PUBLIC_URL). By convention,
 *    these have a prefix (e.g. NEXT_PUBLIC_) ensuring they’re safe to use in client code.
 */

const serverEnvSchema = Type.Object(
	{
		DATABASE_URL: Type.String({ minLength: 1 }),
	},
	{ additionalProperties: true },
);

type ServerEnv = Static<typeof serverEnvSchema>;

const publicEnvSchema = Type.Object(
	{
		NEXT_PUBLIC_URL: Type.String({ minLength: 1 }),
	},
	{ additionalProperties: true },
);

type PublicEnv = Static<typeof publicEnvSchema>;

/*
 * Validate and parse process.env against the defined schemas.
 *
 * The Value.Parse function will throw an error if validation fails.
 * We catch these errors to log a helpful message and then throw an error to fail fast.
 */

let envServer: ServerEnv;
let envPublic: PublicEnv;

try {
	envServer = Value.Parse(serverEnvSchema, process.env);
} catch (error) {
	console.error("❌ Invalid server environment variables:", error);
	throw new Error("Server environment variables validation failed");
}

try {
	envPublic = Value.Parse(publicEnvSchema, process.env);
} catch (error) {
	console.error("❌ Invalid public environment variables:", error);
	throw new Error("Public environment variables validation failed");
}

/*
 * Export the validated environment objects.
 *
 * NOTE: Only export `envPublic` to code that is bundled for the client.
 * Keep `envServer` secure to prevent leaking sensitive values.
 */
export { envServer, envPublic };
