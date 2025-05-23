#!/bin/bash
# Enhanced PWA Icons Generation Script for Fehu Financial

echo "🎨 Fehu Financial PWA Icons Generator"
echo "====================================="

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não está instalado."
    echo "   Para instalar no Ubuntu/Debian: sudo apt install imagemagick"
    echo "   Para instalar no macOS: brew install imagemagick"
    echo "   Para instalar no Windows: https://imagemagick.org/script/download.php#windows"
    echo ""
    echo "🌐 Alternativamente, use geradores online:"
    echo "   • https://realfavicongenerator.net/"
    echo "   • https://www.pwabuilder.com/imageGenerator"
    echo "   • https://favicon.io/favicon-converter/"
    exit 1
fi

# Check if source SVG exists
if [ ! -f "fehu-logo.svg" ]; then
    echo "❌ Arquivo fehu-logo.svg não encontrado!"
    echo "   Certifique-se de que o arquivo está no diretório public/"
    exit 1
fi

echo "✅ Gerando ícones PWA a partir de fehu-logo.svg..."

# Generate PWA icons with proper sizing and backgrounds
echo "📱 Gerando ícone 192x192..."
convert fehu-logo.svg -background white -gravity center -extent 192x192 -resize 192x192 icon-192x192.png

echo "📱 Gerando ícone 512x512..."
convert fehu-logo.svg -background white -gravity center -extent 512x512 -resize 512x512 icon-512x512.png

echo "🍎 Gerando Apple Touch Icon (180x180)..."
convert fehu-logo.svg -background white -gravity center -extent 180x180 -resize 180x180 apple-touch-icon.png

echo "🌐 Gerando favicon 32x32..."
convert fehu-logo.svg -background white -gravity center -extent 32x32 -resize 32x32 favicon-32x32.png

echo "🌐 Gerando favicon 16x16..."
convert fehu-logo.svg -background white -gravity center -extent 16x16 -resize 16x16 favicon-16x16.png

# Generate maskable icons (recommended for Android)
echo "🎭 Gerando ícones maskable..."
convert fehu-logo.svg -background white -gravity center -extent 192x192 -resize 144x144 -gravity center -extent 192x192 icon-192x192-maskable.png
convert fehu-logo.svg -background white -gravity center -extent 512x512 -resize 384x384 -gravity center -extent 512x512 icon-512x512-maskable.png

# Create ICO file for browsers
echo "🌐 Gerando favicon.ico..."
convert fehu-logo.svg -background white -resize 48x48 -colors 256 favicon.ico

echo ""
echo "✅ Ícones PWA gerados com sucesso!"
echo ""
echo "📋 Arquivos criados:"
echo "   • icon-192x192.png (PWA ícone padrão)"
echo "   • icon-512x512.png (PWA ícone grande)"
echo "   • apple-touch-icon.png (iOS)"
echo "   • favicon-32x32.png (Navegadores)"
echo "   • favicon-16x16.png (Navegadores)"
echo "   • favicon.ico (Compatibilidade)"
echo "   • icon-*-maskable.png (Android adaptativo)"
echo ""
echo "🔧 Para testar:"
echo "   1. Execute: pnpm run dev:https"
echo "   2. Acesse: https://localhost:3000"
echo "   3. Teste a instalação do PWA"
echo ""
echo "📱 Para produção:"
echo "   • Otimize os ícones com ferramentas como TinyPNG"
echo "   • Teste em diferentes dispositivos"
echo "   • Valide com lighthouse PWA audit"
