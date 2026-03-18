# RefCheck — Validador de Referencias

Aplicación Next.js para extraer y validar referencias bibliográficas de PDFs, con sistema de autenticación completo.

## Características

- Sistema de autenticación completo (registro, login, verificación de email)
- Base de datos MongoDB Atlas
- Envío de emails con Resend
- Protección de rutas con middleware
- UI moderna con Tailwind CSS y shadcn/ui
- Tema oscuro/claro con next-themes
- Diseño estilo GitHub Dark + Cyan

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus credenciales reales:

#### MongoDB Atlas

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crea un cluster (si no tienes uno)
3. Haz clic en "Connect" → "Connect your application"
4. Copia el connection string y reemplaza en `MONGODB_URI`

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/refcheck?retryWrites=true&w=majority
```

#### JWT Secret

Genera una clave secreta segura:

```bash
# En Linux/Mac:
openssl rand -base64 32

# O usa cualquier string aleatorio largo
```

```env
JWT_SECRET=tu-clave-super-secreta-generada-aleatoriamente
```

#### Resend (Envío de emails)

1. Ve a [Resend](https://resend.com)
2. Crea una cuenta gratuita
3. Ve a "API Keys" y crea una nueva key
4. Copia la key a `.env.local`

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

> **Nota**: Para producción, debes verificar tu propio dominio en Resend y usar un email de ese dominio.

#### URL de la aplicación

```env
# Desarrollo
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Producción (cuando despliegues)
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
front/
├── app/
│   ├── api/auth/          # API Routes de autenticación
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── verify-email/      # Página de verificación de email
│   ├── layout.tsx         # Layout principal con AuthProvider
│   └── page.tsx           # Página principal (protegida)
├── components/
│   ├── layout/            # Componentes del layout (header, etc.)
│   └── ui/                # Componentes shadcn/ui
├── lib/
│   ├── auth-context.tsx   # Context de autenticación
│   ├── email.ts           # Templates de emails
│   ├── jwt.ts             # Utilidades JWT
│   ├── mongodb.ts         # Cliente MongoDB
│   └── validation.ts      # Schemas de validación Zod
├── services/
│   └── auth.service.ts    # Cliente API de autenticación
├── types/
│   └── user.ts            # Tipos TypeScript
├── middleware.ts          # Protección de rutas
├── .env.example           # Template de variables de entorno
└── .env.local             # Variables de entorno (NO subir a git)
```

## Flujo de Autenticación

1. **Registro**:
   - Usuario completa formulario en `/register`
   - Sistema crea usuario (no verificado) en MongoDB
   - Se envía email de verificación con Resend
   - Usuario debe verificar email antes de poder hacer login

2. **Verificación**:
   - Usuario hace clic en link del email
   - Sistema marca usuario como verificado
   - Redirige a `/login`

3. **Login**:
   - Usuario ingresa credenciales en `/login`
   - Sistema valida que el email esté verificado
   - Se crea JWT y se guarda en httpOnly cookie
   - Redirige a página principal

4. **Sesión**:
   - Middleware verifica JWT en cada request
   - AuthContext mantiene estado del usuario
   - Rutas protegidas redirigen a `/login` si no hay sesión

## Seguridad

- Contraseñas hasheadas con bcrypt
- JWT en httpOnly cookies (protección XSS)
- Tokens de verificación con expiración (24h)
- Validación de datos con Zod
- Middleware para proteger rutas
- Variables sensibles en `.env.local` (git-ignored)

## Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Base de datos**: MongoDB Atlas
- **Autenticación**: JWT, bcrypt
- **Email**: Resend
- **Validación**: Zod
- **Temas**: next-themes

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## Deploy en Vercel

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega las variables de entorno en la configuración del proyecto
4. Deploy automático

## Soporte

Para problemas o preguntas, abre un issue en el repositorio.
