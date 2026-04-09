import app from "./app";
import { runMigrations } from "./db/migrate";

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap(): Promise<void> {
  try {
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`API started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap();