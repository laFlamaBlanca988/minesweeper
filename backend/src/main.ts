import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    app.enableCors({
      origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
      credentials: true,
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`Backend server running on port ${port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Fatal error during bootstrap:', error);
  process.exit(1);
});
