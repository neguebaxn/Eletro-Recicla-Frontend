# Smoke test do contrato da API EletroRecicla (uso local)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$base = 'https://eletrorecicla-backend.onrender.com/api/v1'
$tmp = Join-Path $env:TEMP 'er_api_test'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$email = 'teste.front.' + (Get-Random) + '@email.com'
$utf8 = New-Object System.Text.UTF8Encoding $false

function Post-Json($name, $obj) {
  $path = Join-Path $tmp "$name.json"
  [System.IO.File]::WriteAllText($path, ($obj | ConvertTo-Json -Compress), $utf8)
  return $path
}

Write-Output '=== 1) POST /usuarios (cadastro valido, Origin: localhost:5173) ==='
$cadPath = Post-Json 'cad' @{nome='Teste Front'; email=$email; senha='minhasenha'; telefone='11999999999'; cpf='12345678909'}
curl.exe -sS -D (Join-Path $tmp 'cad.h') -o (Join-Path $tmp 'cad.out') -w 'HTTP %{http_code}' --max-time 120 -X POST -H 'Content-Type: application/json' -H 'Origin: http://localhost:5173' --data-binary "@$cadPath" "$base/usuarios"
Write-Output ''
Get-Content (Join-Path $tmp 'cad.out')
Select-String -Path (Join-Path $tmp 'cad.h') -Pattern 'HTTP/|Access-Control' | ForEach-Object { $_.Line }

Write-Output '=== 2) POST /usuarios email duplicado (espera 400 + erro) ==='
curl.exe -sS -o (Join-Path $tmp 'dup.out') -w 'HTTP %{http_code}' --max-time 120 -X POST -H 'Content-Type: application/json' --data-binary "@$cadPath" "$base/usuarios"
Write-Output ''
Get-Content (Join-Path $tmp 'dup.out')

Write-Output '=== 3) POST /auth/login (senha correta) ==='
$loginPath = Post-Json 'login' @{email=$email; senha='minhasenha'}
curl.exe -sS -D (Join-Path $tmp 'login.h') -o (Join-Path $tmp 'login.out') -w 'HTTP %{http_code}' --max-time 120 -X POST -H 'Content-Type: application/json' -H 'Origin: http://localhost:5173' --data-binary "@$loginPath" "$base/auth/login"
Write-Output ''
Get-Content (Join-Path $tmp 'login.out')
Select-String -Path (Join-Path $tmp 'login.h') -Pattern 'HTTP/|Access-Control' | ForEach-Object { $_.Line }

Write-Output '=== 4) POST /auth/login senha errada (espera 401 + erro) ==='
$badPath = Post-Json 'bad' @{email=$email; senha='senhaerrada'}
curl.exe -sS -o (Join-Path $tmp 'bad.out') -w 'HTTP %{http_code}' --max-time 120 -X POST -H 'Content-Type: application/json' --data-binary "@$badPath" "$base/auth/login"
Write-Output ''
Get-Content (Join-Path $tmp 'bad.out')

Write-Output '=== 5) GET /usuarios/me com Bearer ==='
$token = (Get-Content (Join-Path $tmp 'login.out') -Raw | ConvertFrom-Json).token
if ($token) {
  curl.exe -sS -o (Join-Path $tmp 'me.out') -w 'HTTP %{http_code}' --max-time 120 -H "Authorization: Bearer $token" "$base/usuarios/me"
  Write-Output ''
  Get-Content (Join-Path $tmp 'me.out')
} else {
  Write-Output 'SEM TOKEN - falha no login'
}

Write-Output '=== 6) OPTIONS preflight (Origin: localhost:5173) ==='
curl.exe -sS -D (Join-Path $tmp 'opt.h') -o NUL -w 'HTTP %{http_code}' --max-time 60 -X OPTIONS -H 'Origin: http://localhost:5173' -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: content-type' "$base/auth/login"
Write-Output ''
Select-String -Path (Join-Path $tmp 'opt.h') -Pattern 'HTTP/|Access-Control' | ForEach-Object { $_.Line }

Write-Output '=== 7) GET /usuarios/me SEM token (espera 401) ==='
curl.exe -sS -o (Join-Path $tmp 'notoken.out') -w 'HTTP %{http_code}' --max-time 60 "$base/usuarios/me"
Write-Output ''
Get-Content (Join-Path $tmp 'notoken.out')
