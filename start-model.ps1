$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$venvPython = Join-Path $projectRoot '.venv\Scripts\python.exe'

if (-not (Test-Path $venvPython)) {
    if (Get-Command uv -ErrorAction SilentlyContinue) {
        $env:UV_CACHE_DIR = Join-Path $projectRoot '.uv-cache'
        $env:UV_PYTHON_INSTALL_DIR = Join-Path $projectRoot '.uv-python'
        uv venv --python 3.11.15 (Join-Path $projectRoot '.venv')
    } elseif (Get-Command python -ErrorAction SilentlyContinue) {
        python -m venv (Join-Path $projectRoot '.venv')
    } else {
        throw 'Python not found. Install Python 3.10/3.11 or uv, then run this script again.'
    }
}

if (Get-Command uv -ErrorAction SilentlyContinue) {
    $env:UV_CACHE_DIR = Join-Path $projectRoot '.uv-cache'
    uv pip install --python $venvPython -r (Join-Path $projectRoot 'requirements-model.txt')
} else {
    & $venvPython -m pip install -r (Join-Path $projectRoot 'requirements-model.txt')
}
& $venvPython -m uvicorn inference_server:app --host 127.0.0.1 --port 8000 --app-dir $projectRoot
