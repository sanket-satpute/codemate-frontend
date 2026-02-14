$dependencyMap = @{
    components = @{}
    services = @{}
    routes = @{}
}

$files = Get-ChildItem -Path src/app -Recurse -Filter *.ts

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $classNameMatch = $content | Select-String -Pattern 'export class (\w+)'
    if ($classNameMatch) {
        $className = $classNameMatch.Matches.Groups[1].Value
        $constructorMatch = $content | Select-String -Pattern 'constructor\(([^)]*)\)'
        if ($constructorMatch) {
            $constructor = $constructorMatch.Matches.Groups[1].Value
            $dependenciesMatch = $constructor | Select-String -Pattern 'private \w+: (\w+)' -AllMatches
            if ($dependenciesMatch) {
                $dependencies = $dependenciesMatch.Matches.Groups[1].Value
                if ($content -match '@Component') {
                    $dependencyMap.components[$className] = @{
                        dependencies = $dependencies
                    }
                } elseif ($content -match '@Injectable') {
                    $dependencyMap.services[$className] = @{
                        dependencies = $dependencies
                    }
                }
            }
        }
    }
}

$dependencyMap | ConvertTo-Json -Depth 100 | Out-File dependency-map.json
