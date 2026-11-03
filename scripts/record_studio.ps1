# Records the Roblox Studio playtest viewport to a web-ready MP4 + WebP poster.
#   powershell -ExecutionPolicy Bypass -File scripts/record_studio.ps1 -Name thunder-knee-storm -Seconds 14
# Studio must be maximised on the main (1920x1080) screen: GDI capture of the external
# monitor only manages ~10 fps, and ffmpeg's ddagrab doesn't work on this hybrid-GPU laptop.
# The region is the 16:9 part of the viewport below Roblox's top-left buttons.
# Capture goes to a fast lossless file first, then is compressed, so encoding never drops frames.
param(
  [Parameter(Mandatory)] [string] $Name,
  [double] $Seconds = 8,
  [int] $X = 349, [int] $Y = 272, [int] $W = 1222, [int] $H = 688,
  [string] $Out = 'public/media/vfx'
)
New-Item -ItemType Directory -Force $Out | Out-Null
$raw = Join-Path $env:TEMP "rec_$Name.mkv"
$mp4 = Join-Path $Out "$Name.mp4"
& ffmpeg -hide_banner -loglevel error -y -f gdigrab -framerate 25 -draw_mouse 0 `
  -offset_x $X -offset_y $Y -video_size "${W}x${H}" -t $Seconds -i desktop -c:v libx264 -preset ultrafast -crf 10 $raw
& ffmpeg -hide_banner -loglevel error -y -i $raw -vf 'scale=1280:720:flags=lanczos' -r 25 `
  -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -an $mp4
& ffmpeg -hide_banner -loglevel error -y -ss ($Seconds / 2) -i $mp4 -frames:v 1 -c:v libwebp -quality 78 (Join-Path $Out "$Name.webp")
Remove-Item $raw
"{0} {1} KB" -f $mp4, [math]::Round((Get-Item $mp4).Length / 1KB)
