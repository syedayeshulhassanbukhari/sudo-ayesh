# Converts Blender work (FBX / .blend) into web-ready GLB for the portfolio's live 3D viewer.
#
#   blender -b --factory-startup -P scripts/blender/export_web_models.py -- jobs.json public/models
#
# jobs.json: [{"collection": "eggs", "src": "path.fbx", "mode": "split"|"whole", "tex": 512, "exclude": "regex of object names to skip",
#              "name": "optional display name (whole mode)", "strip": "optional regex removed from split names"}]
# Output: public/models/<collection>/<slug>.glb plus public/models/manifest.json
# (merged with any existing manifest, so jobs can run in batches).
# Meshes are Draco-compressed, textures written as WebP and downscaled to `tex` px,
# animation clips are kept (the viewer plays them in a chain).
import bpy, sys, json, os, re

args = sys.argv[sys.argv.index('--') + 1:]
jobs = json.load(open(args[0], encoding='utf8'))
out_root = args[1]
os.makedirs(out_root, exist_ok=True)
man_path = os.path.join(out_root, 'manifest.json')
manifest = json.load(open(man_path, encoding='utf8')) if os.path.exists(man_path) else {}


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def nice(s, strip=None):
    s = re.sub(r'\.\d{3}$', '', s)  # Blender duplicate suffix
    if strip:
        s = re.sub(strip, '', s)
    s = re.sub(r'^\d+[_ ]', '', s)
    s = s.replace('_', ' ').strip()
    return re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', s)  # CamelCase -> words


def load(src):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if src.lower().endswith('.blend'):
        bpy.ops.wm.open_mainfile(filepath=src)
        # drop cameras/lights/helpers from scene files; keep meshes and rigs
        for o in list(bpy.context.scene.objects):
            if o.type not in {'MESH', 'ARMATURE', 'EMPTY'}:
                bpy.data.objects.remove(o)
    else:
        bpy.ops.import_scene.fbx(filepath=src, ignore_leaf_bones=True)


def shrink_textures(px):
    for img in bpy.data.images:
        if img.size[0] > px or img.size[1] > px:
            try:
                img.scale(min(px, img.size[0]), min(px, img.size[1]))
            except Exception:
                pass


def fix_textured_emission():
    # FBX import can carry a flat white emission onto a textured material (the winged lion's
    # atlas): in glTF that glows pure white and hides the colour map. Untextured glow
    # materials (lights, gems, fireballs) are intentional and left alone.
    for m in bpy.data.materials:
        if not m.use_nodes:
            continue
        for n in m.node_tree.nodes:
            if n.type != 'BSDF_PRINCIPLED':
                continue
            base, col = n.inputs['Base Color'], n.inputs['Emission Color']
            if base.is_linked and not col.is_linked and min(col.default_value[:3]) > 0.5:
                n.inputs['Emission Strength'].default_value = 0.0
                print('@@ cleared white emission on', m.name)


def tri_count(objs):
    dg = bpy.context.evaluated_depsgraph_get()
    n = 0
    for o in objs:
        if o.type == 'MESH':
            m = o.evaluated_get(dg).to_mesh()
            m.calc_loop_triangles()
            n += len(m.loop_triangles)
            o.evaluated_get(dg).to_mesh_clear()
    return n


def export(path, objs):
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    keep = set(objs)
    for o in bpy.context.view_layer.objects:
        o.hide_set(False)
        o.select_set(o in keep)
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True,
        export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
        export_image_format='WEBP', export_animations=True, export_apply=False,
        export_cameras=False, export_lights=False)


for job in jobs:
    col = job['collection']
    print(f'@@ {col}: {job["src"]}')
    try:
        load(job['src'])
    except Exception as e:
        print('@@ FAILED', e)
        continue
    shrink_textures(job.get('tex', 1024))
    fix_textured_emission()
    clips = [a.name.split('|')[-1] for a in bpy.data.actions]
    os.makedirs(os.path.join(out_root, col), exist_ok=True)
    items = manifest.setdefault(col, [])
    if job['mode'] == 'split':
        tops = sorted((o for o in bpy.context.scene.objects if o.parent is None), key=lambda o: o.name)
        groups = [(nice(t.name, job.get('strip')), [t] + list(t.children_recursive)) for t in tops]
    else:
        name = job.get('name') or nice(os.path.splitext(os.path.basename(job['src']))[0], job.get('strip'))
        objs = list(bpy.context.scene.objects)
        if job.get('exclude'):  # hidden helpers in scene files (e.g. the R6 file's cube and staff)
            objs = [o for o in objs if not re.search(job['exclude'], o.name)]
        groups = [(name, objs)]
    for name, objs in groups:
        f = slug(name) + '.glb'
        try:
            export(os.path.join(out_root, col, f), objs)
        except Exception as e:
            print('@@ FAILED', f, e)
            continue
        rec = {'file': f'{col}/{f}', 'name': name, 'tris': tri_count(objs),
               'kb': round(os.path.getsize(os.path.join(out_root, col, f)) / 1024),
               'clips': clips if job['mode'] == 'whole' else []}
        items[:] = [i for i in items if i['file'] != rec['file']] + [rec]
        print('@@ wrote', rec)
    json.dump(manifest, open(man_path, 'w', encoding='utf8'), indent=1)  # after every job, so a crash keeps progress

json.dump(manifest, open(man_path, 'w', encoding='utf8'), indent=1)
print('@@ DONE')
