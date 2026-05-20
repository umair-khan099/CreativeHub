import { app } from "./src/app.js";
import { CONFIG } from "./src/config/dotenv.config.js";
import { connectDb } from "./src/db/connectDb.js";

const startServer = (async () => {
  try {
    await connectDb();
    const server = app.listen(CONFIG.PORT || 8000, () => {
      console.log(`Server is runing at PORT ${CONFIG.PORT}`);
    });

    server.on("error", (error) => {
      console.log("Server Error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.log("Server startuo is failed :", error);
    process.exit(1);
  }
})();
