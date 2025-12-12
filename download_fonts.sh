#!/bin/bash

# Create fonts directory structure
mkdir -p fonts/manrope fonts/exo2 fonts/josefin-sans fonts/black-ops-one fonts/orbitron fonts/poppins fonts/inter

echo "Downloading fonts..."

# Function to download font CSS and extract woff2 URLs
download_font_css() {
    local font_family=$1
    local weight=$2
    local italic=$3
    
    if [ "$italic" = "true" ]; then
        url="https://fonts.googleapis.com/css2?family=${font_family}:ital,wght@1,${weight}"
    else
        url="https://fonts.googleapis.com/css2?family=${font_family}:wght@${weight}"
    fi
    
    # Request with User-Agent that supports woff2
    curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "$url" | grep -o 'https://fonts\.gstatic\.com/[^)]*\.woff2' | head -1
}

# Function to download a font file
download_font_file() {
    local url=$1
    local output_dir=$2
    
    if [ -n "$url" ] && [ "$url" != "" ]; then
        filename=$(basename "$url" | cut -d'?' -f1)
        curl -s -L "$url" -o "${output_dir}/${filename}"
        if [ -f "${output_dir}/${filename}" ] && [ -s "${output_dir}/${filename}" ]; then
            echo "Downloaded: ${output_dir}/${filename}"
            return 0
        else
            rm -f "${output_dir}/${filename}"
            return 1
        fi
    fi
    return 1
}

# Manrope (200-800)
echo "Downloading Manrope..."
for weight in 200 300 400 500 600 700 800; do
    url=$(download_font_css "Manrope" "$weight" "false")
    download_font_file "$url" "fonts/manrope"
done

# Exo 2 (100-900, regular and italic)
echo "Downloading Exo 2..."
for weight in 100 200 300 400 500 600 700 800 900; do
    url=$(download_font_css "Exo+2" "$weight" "false")
    download_font_file "$url" "fonts/exo2"
    url=$(download_font_css "Exo+2" "$weight" "true")
    download_font_file "$url" "fonts/exo2"
done

# Josefin Sans (100-700, regular and italic)
echo "Downloading Josefin Sans..."
for weight in 100 200 300 400 500 600 700; do
    url=$(download_font_css "Josefin+Sans" "$weight" "false")
    download_font_file "$url" "fonts/josefin-sans"
    url=$(download_font_css "Josefin+Sans" "$weight" "true")
    download_font_file "$url" "fonts/josefin-sans"
done

# Black Ops One (400)
echo "Downloading Black Ops One..."
url=$(download_font_css "Black+Ops+One" "400" "false")
download_font_file "$url" "fonts/black-ops-one"

# Orbitron (400, 500, 700)
echo "Downloading Orbitron..."
for weight in 400 500 700; do
    url=$(download_font_css "Orbitron" "$weight" "false")
    download_font_file "$url" "fonts/orbitron"
done

# Poppins (300, 400, 500)
echo "Downloading Poppins..."
for weight in 300 400 500; do
    url=$(download_font_css "Poppins" "$weight" "false")
    download_font_file "$url" "fonts/poppins"
done

# Inter (300, 400, 500)
echo "Downloading Inter..."
for weight in 300 400 500; do
    url=$(download_font_css "Inter" "$weight" "false")
    download_font_file "$url" "fonts/inter"
done

echo ""
echo "Done! Checking downloaded files..."
find fonts -name "*.woff2" -type f | wc -l | xargs echo "Total font files downloaded:"
find fonts -name "*.woff2" -type f
