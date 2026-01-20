import express, { Request, Response } from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';

// Configuración de internacionalización
i18next.use(Backend).init({
  lng: 'es',            // idioma por defecto
  fallbackLng: ['es', 'en'],
  backend: {
    loadPath: join(__dirname, '..', 'locales/{{lng}}/common.json'),
  },
});

const app = express();
app.use(express.json());

// Middleware para cambiar idioma en función del header Accept-Language
app.use((req: Request, _res: Response, next) => {
  const lang = req.headers['accept-language'];
  if (lang && typeof lang === 'string') {
    i18next.changeLanguage(lang.split(',')[0]);
  }
  next();
});

// Endpoint de ejemplo para la ingesta de evidencia
app.post('/evidence', (req: Request, res: Response) => {
  // Aquí iría la lógica de ingesta. Ahora solo se devuelve un mensaje traducido.
  const message = i18next.t('evidence_received');
  return res.status(201).json({ message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(\`Servidor escuchando en el puerto \${port}\`);
});
