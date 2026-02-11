import dotenv from "dotenv";
import path from "path";

// Load env from admin-panel root before any other imports use process.env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
