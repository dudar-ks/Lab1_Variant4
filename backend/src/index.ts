import app from "./app";
import { initDb } from "./db/initDb";

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();