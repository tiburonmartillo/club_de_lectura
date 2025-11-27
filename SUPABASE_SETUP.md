# Configuración de Supabase para GitHub Pages

Para que los correos de validación de Supabase funcionen correctamente con tu aplicación desplegada en GitHub Pages, necesitas configurar las URLs permitidas en el Dashboard de Supabase.

## Pasos para configurar Supabase

1. **Accede al Dashboard de Supabase**
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto (ID: `hxsbzjllvqupydfegyvc`)

2. **Configura las URLs de redirección**
   - Ve a **Authentication** → **URL Configuration**
   - En **Site URL**, agrega:
     ```
     https://tiburonmartillo.github.io/club_de_lectura
     ```
   
   - En **Redirect URLs**, agrega las siguientes URLs (una por línea):
     ```
     https://tiburonmartillo.github.io/club_de_lectura/**
     https://tiburonmartillo.github.io/club_de_lectura/auth/callback
     http://localhost:3000/**
     http://localhost:3000/auth/callback
     ```

3. **Configura las plantillas de email (opcional)**
   - Ve a **Authentication** → **Email Templates**
   - En las plantillas de email (Confirm signup, Reset password, etc.), asegúrate de que las URLs de redirección apunten a:
     ```
     {{ .SiteURL }}/auth/callback?token={{ .TokenHash }}&type=email
     ```
   - O simplemente usa `{{ .ConfirmationURL }}` que Supabase generará automáticamente

4. **Guarda los cambios**
   - Haz clic en **Save** para guardar todas las configuraciones

## URLs configuradas en el código

El código ya está configurado para usar automáticamente:
- **Producción**: `https://tiburonmartillo.github.io/club_de_lectura/auth/callback`
- **Desarrollo**: `http://localhost:3000/auth/callback`

## Nota importante

Después de configurar las URLs en Supabase, los nuevos correos de validación usarán la URL de producción. Los correos enviados antes de esta configuración seguirán usando la URL anterior.

