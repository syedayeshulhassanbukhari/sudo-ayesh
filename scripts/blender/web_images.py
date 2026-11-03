# Resizes screenshots to web-sized WebP (no Pillow needed on this machine).
#   blender -b --factory-startup -P scripts/blender/web_images.py -- list.json
# list.json: [["src.png", "public/media/x.webp", 1600], ...]  (width in px; height keeps aspect)
import bpy, sys, json, os

pairs = json.load(open(sys.argv[sys.argv.index('--') + 1], encoding='utf8'))
scene = bpy.context.scene
scene.render.image_settings.file_format = 'WEBP'
scene.render.image_settings.quality = 82
scene.render.image_settings.color_mode = 'RGB'
for src, dst, w in pairs:
    img = bpy.data.images.load(os.path.abspath(src))
    sw, sh = img.size
    if sw > w:
        img.scale(w, round(sh * w / sw))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    img.save_render(os.path.abspath(dst), scene=scene)
    print('@@', dst, img.size[:], os.path.getsize(dst) // 1024, 'KB')
    bpy.data.images.remove(img)
