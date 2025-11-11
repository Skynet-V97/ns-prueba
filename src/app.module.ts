import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Módulo de formularios
import { FormsModule } from './modules/forms/forms.module';
//modulo de salud con Terminus
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuración de la conexión a la base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // Usamos el puerto mapeado 5433
      username: 'postgres', // Usuario
      password: 'postgres', // Contraseña
      database: 'ns_prueba', // Base de datos
      autoLoadEntities: true, // Carga las entidades automáticamente
      synchronize: true, // Solo para desarrollo, no en producción
      logging: true, // Log de las consultas
    }),

    // Importa el módulo de formularios donde están los servicios y repositorios
    FormsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
