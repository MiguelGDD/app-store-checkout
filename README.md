# Store Checkout

Aplicacion movil en React Native para un flujo de compra con catalogo, carrito,
onboarding de pago con tarjeta y confirmacion de transaccion.

## Funcionalidad

- Catalogo sincronizado desde el backend desplegado.
- Seleccion de uno o varios productos con cantidades de 1 a N unidades.
- Carrito con calculo de subtotal y total.
- Selector `Pay with credit card` que abre el formulario en un backdrop.
- Deteccion visual de VISA y Mastercard con logos nativos.
- Validacion de titular, Luhn, vencimiento vigente y CVC antes del pago.
- Estado de transaccion pendiente, completada o fallida.
- Persistencia cifrada del resumen de transacciones en `AsyncStorage`.
- Interfaz responsive para telefonos compactos y pantallas grandes.
- Splash screen nativo personalizado para Android.
- Ilustraciones locales construidas con primitivas nativas, sin descargas remotas.

## Stack

- React Native 0.86
- React 19
- TypeScript
- Redux Toolkit
- AsyncStorage
- Jest

## Requisitos

- Node.js 22 o superior.
- npm 10 o superior.
- Android Studio con Android SDK Platform 36.
- Android Build Tools 36.0.0.
- NDK 27.1.12297006.
- JDK 17 o superior. Se puede usar el JDK incluido en Android Studio.
- Para iOS: Xcode y CocoaPods.

## Instalacion

```bash
npm install
cp .env.example .env
```

Configura en `.env` la variable `BACKEND_BASE_URL` con la URL del backend, sin
una barra final.

En Android, crea `android/local.properties` si Android Studio no lo genero:

```properties
sdk.dir=/Users/TU_USUARIO/Library/Android/sdk
```

Este archivo es local y esta ignorado por Git.

## Ejecutar en Android

1. Abre un emulador desde Android Studio.
2. Inicia Metro:

```bash
npm start
```

3. En otra terminal ejecuta:

```bash
npm run android
```

Si el emulador no encuentra Metro:

```bash
adb reverse tcp:8081 tcp:8081
```

## Ejecutar en iOS

Instala los Pods y abre el workspace generado:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

## Configuracion del backend

La URL se lee desde `BACKEND_BASE_URL` en el archivo local `.env`. Babel la
inyecta en el bundle mediante `react-native-dotenv`; no es necesario configurar
Android e iOS por separado. El archivo `.env` esta ignorado por Git y el
repositorio incluye `.env.example` como plantilla.

La API key de desarrollo y los demas valores no sensibles estan centralizados
en:

```text
src/infrastructure/backend/backendConfig.ts
```

Despues de cambiar `.env`, reinicia Metro limpiando la cache:

```bash
npm start -- --reset-cache
```

El cliente agrega el header `x-api-key` a las solicitudes. La clave incluida en
una aplicacion movil no debe considerarse un secreto, porque puede extraerse del
APK o IPA. Para produccion se necesita HTTPS, autenticacion por usuario, tokens
de corta duracion y rate limiting.

El despliegue actual usa HTTP y credenciales sandbox. No se deben introducir
tarjetas reales hasta publicar la API detras de HTTPS.

El catalogo consume:

```text
GET /products
```

El checkout envia el carrito y la tarjeta al backend:

```text
POST /transactions
```

La respuesta del backend es la fuente de verdad para el total, la referencia y
el estado final. El carrito se limpia solamente cuando el estado recibido es
`APPROVED`; en pagos rechazados o errores de red se conserva para reintentar.

El repositorio backend hermano gestiona productos, tokenizacion de tarjeta,
transacciones con el proveedor de pagos y asignacion de entregas.

## Flujo

1. La aplicacion abre directamente en el catalogo.
2. Agrega uno o varios productos y ajusta sus cantidades.
3. Confirma el total del carrito y abre el checkout.
4. Pulsa `Pay with credit card` para abrir el backdrop de pago.
5. Completa una tarjeta falsa VISA o Mastercard con estructura valida.
6. La aplicacion valida los campos, crea la transaccion y muestra el resultado.

Los datos introducidos en el formulario de tarjeta no se guardan en
`AsyncStorage`. Solo se persiste el resumen cifrado de la transaccion.

## Imagenes y rendimiento

Los tres productos principales usan imagenes JPEG empaquetadas en
`assets/products`. `ProductArtwork` las resuelve estaticamente, conserva un
tamano fijo y desactiva el fade para que aparezcan desde el primer render sin
depender de la red. Los productos sin imagen registrada mantienen la
ilustracion nativa como fallback.

## Calidad

```bash
npm run lint
npx tsc --noEmit
npm test -- --runInBand
npm run test:coverage
```

La cobertura global minima configurada es 80%.

## Build Android

```bash
cd android
./gradlew assembleRelease
```

El APK se genera en:

```text
android/app/build/outputs/apk/release/app-release.apk
```

La configuracion de firma incluida es apropiada para pruebas. Una publicacion
real debe usar un keystore de produccion almacenado fuera del repositorio.

## Estructura

```text
src/components/                 Componentes visuales reutilizables
src/screens/                    Pantallas del flujo
src/store/                      Redux, workflows y persistencia
src/infrastructure/backend/     Cliente y mapeo de la API
src/i18n/                       Textos de interfaz
src/theme.ts                    Colores, tipografia y espaciado
```
