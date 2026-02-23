$inputFile = "c:\Users\Usuario\Desktop\Proyectos 2026\taxproject\BueCont_TXT.txt"
$outputFile = "c:\Users\Usuario\Desktop\Proyectos 2026\taxproject\BueCont_clean.csv"

if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# The file contains ISO-8859-1 / Windows-1252 characters like Ñ, which show up as [char]65533 if read poorly, but we can just use Get-Content with Default encoding.
$lines = Get-Content -Path $inputFile -Encoding Default
$writer = [System.IO.StreamWriter]::new($outputFile, $false, [System.Text.Encoding]::UTF8)

$isFirstLine = $true

foreach ($line in $lines) {
    # Replace quotes and replace the corrupted translation character or exact unicode
    $cleanLine = $line.Replace('"', '').Replace([char]65533, 'Ñ').Replace('', 'Ñ')
    
    if ($cleanLine.EndsWith('|')) {
        $cleanLine = $cleanLine.Substring(0, $cleanLine.Length - 1)
    }
    
    $parts = $cleanLine.Split('|')
    
    if ($isFirstLine) {
        $writer.WriteLine("ruc,nombre_razon,a_partir_del,resolucion")
        $isFirstLine = $false
        continue
    }
    
    if ($parts.Length -ge 4) {
        $ruc = $parts[0].Trim()
        $name = $parts[1].Trim()
        $dateRaw = $parts[2].Trim()
        $res = $parts[3].Trim()
        
        $dateParts = $dateRaw.Split('/')
        if ($dateParts.Length -eq 3) {
            $dateRaw = "$($dateParts[2])-$($dateParts[1])-$($dateParts[0])"
        }
        
        $safeName = "`"$name`""
        
        $writer.WriteLine("$ruc,$safeName,$dateRaw,$res")
    }
}

$writer.Close()

Write-Host "✅ Success: BueCont_clean.csv generated successfully."
