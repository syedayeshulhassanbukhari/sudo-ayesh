# Renders each animated GLB to a looping MP4 for the site's Animation section.
#   blender -b --factory-startup -P scripts/blender/render_anim_videos.py -- public/media/anim file1.glb[:Clip[:r6[:zoom]]] ...
# Camera frames the model over the whole clip, slow orbit, navy backdrop matching the site.
# Writes <name>.mp4 (960x720, H.264) and <name>.webp poster (middle frame).
import bpy, sys, os, math
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:]
out_dir, specs = args[0], args[1:]
os.makedirs(out_dir, exist_ok=True)
NAVY = (0.012, 0.02, 0.04, 1)


def setup_world(scene):
    w = bpy.data.worlds.new('W'); scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs[0].default_value = NAVY
    bg.inputs[1].default_value = 0.6


def bounds_over_time(objs, f0, f1, scene):
    # returns overall (lo, hi) plus per-sample [(frame, centre, size)] for a follow camera
    lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
    samples = []
    dg = bpy.context.evaluated_depsgraph_get()
    for f in list(range(f0, f1 + 1, max(1, (f1 - f0) // 24))) + [f1]:
        scene.frame_set(f)
        flo = Vector((1e9,) * 3); fhi = Vector((-1e9,) * 3)
        for o in objs:
            ev = o.evaluated_get(dg)
            m = ev.to_mesh()
            for i in range(0, len(m.vertices), 7):
                p = ev.matrix_world @ m.vertices[i].co
                flo = Vector(map(min, flo, p)); fhi = Vector(map(max, fhi, p))
            ev.to_mesh_clear()
        lo = Vector(map(min, lo, flo)); hi = Vector(map(max, hi, fhi))
        samples.append((f, (flo + fhi) / 2, (fhi - flo).length))
    return lo, hi, samples


for spec in specs:
    # spec: file.glb[:Clip[:flag[:zoom]]], zoom > 1 pulls the camera back
    path, clip, flag, zoom = (spec.split(':') + ['', '', ''])[:4]
    name = os.path.splitext(os.path.basename(path))[0]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(path))

    # pick the clip (glTF import makes one action per animation; the first is active)
    arm = next((o for o in scene.objects if o.type == 'ARMATURE'), None)
    acts = [a for a in bpy.data.actions if not clip or a.name.endswith(clip)]
    act = acts[0] if acts else None
    if arm and act:
        arm.animation_data_create(); arm.animation_data.action = act
    # still models get a full 6 s turntable instead of a clip
    f0, f1 = (int(act.frame_range[0]), int(act.frame_range[1])) if act else (1, 180)
    scene.frame_start, scene.frame_end = f0, f1
    scene.render.fps = 30

    if flag == 'r6':
        # the R6 scene file carries hidden helpers and a UV-template texture: drop the
        # helpers and dress the rig as a white-gi fighter
        for o in list(scene.objects):
            if o.type == 'MESH' and (o.name.startswith(('Cube', 'Icosphere')) or 'pPipe' in o.name):
                bpy.data.objects.remove(o)
        def flat(name, col):
            m = bpy.data.materials.new(name); m.use_nodes = True
            b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = col; b.inputs['Roughness'].default_value = 0.55
            return m
        gi, skin = flat('Gi', (0.85, 0.85, 0.82, 1)), flat('Skin', (0.85, 0.6, 0.42, 1))
        for o in scene.objects:
            if o.type == 'MESH' and o.data.materials and o.data.materials[0] and o.data.materials[0].name == 'R64Mtl':
                o.data.materials[0] = skin if o.name == 'Head' else gi

    # the glTF importer adds material-less Icosphere meshes as bone display shapes; skip them
    for o in list(scene.objects):
        if o.type == 'MESH' and not o.data.materials:
            bpy.data.objects.remove(o)
    meshes = [o for o in scene.objects if o.type == 'MESH']
    lo, hi, samples = bounds_over_time(meshes, f0, f1, scene)
    # frame the biggest single pose, not the whole path, and follow the model's centre
    size = max(sz for _, _, sz in samples)
    travel = (hi - lo).length - size
    follow = travel > size * 0.15
    c = (lo + hi) / 2

    # floor just under the lowest point
    bpy.ops.mesh.primitive_plane_add(size=(hi - lo).length * 8 + size * 8, location=(c.x, c.y, lo.z))
    floor = bpy.context.object
    fm = bpy.data.materials.new('Floor'); fm.use_nodes = True
    fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.002, 0.003, 0.008, 1)
    fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.6
    floor.data.materials.append(fm)

    # camera on an orbiting rig: a quarter turn over the clip
    rig = bpy.data.objects.new('Rig', None); scene.collection.objects.link(rig); rig.location = c
    if follow:
        for f, fc, _ in samples:
            rig.location = (fc.x, fc.y, max(fc.z, lo.z + size * 0.35)); rig.keyframe_insert('location', frame=f)
    cam_data = bpy.data.cameras.new('Cam'); cam_data.lens = 50
    cam = bpy.data.objects.new('Cam', cam_data); scene.collection.objects.link(cam)
    cam.parent = rig
    dist = size * (2.3 if follow else 1.45)  # a moving model needs room inside the frame
    dist *= float(zoom or 1)
    cam.location = (0, -dist, dist * (0.52 if act else 0.32))  # turntables sit lower to show the profile  # high enough that the horizon is out of frame
    tc = cam.constraints.new('TRACK_TO'); tc.target = rig; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
    scene.camera = cam
    sweep = 35 if act else 180  # animated: gentle quarter orbit; still: full turntable
    rig.rotation_euler = (0, 0, math.radians(-sweep)); rig.keyframe_insert('rotation_euler', frame=f0)
    rig.rotation_euler = (0, 0, math.radians(sweep)); rig.keyframe_insert('rotation_euler', frame=f1)
    if not act:  # constant speed for a turntable
        for fc in (rig.animation_data.action.fcurves if hasattr(rig.animation_data.action, 'fcurves') else []):
            for k in fc.keyframe_points: k.interpolation = 'LINEAR'

    # three-point light
    for loc, energy, col in [((-1, -1, 1.4), 4.0, (1, .96, .9)), ((1.3, -.4, .6), 1.5, (.8, .88, 1)), ((0, 1.4, 1.1), 3.0, (.6, .75, 1))]:
        ld = bpy.data.lights.new('L', 'SUN'); ld.energy = energy; ld.color = col
        lo_ = bpy.data.objects.new('L', ld); scene.collection.objects.link(lo_)
        lo_.rotation_euler = Vector(loc).to_track_quat('Z', 'Y').to_euler()
    setup_world(scene)

    r = scene.render
    r.engine = 'BLENDER_EEVEE'
    r.resolution_x, r.resolution_y, r.resolution_percentage = 960, 720, 100
    if hasattr(r.image_settings, 'media_type'):  # Blender 5: pick video before the format
        r.image_settings.media_type = 'VIDEO'
    r.image_settings.file_format = 'FFMPEG'
    r.ffmpeg.format = 'MPEG4'; r.ffmpeg.codec = 'H264'
    r.ffmpeg.constant_rate_factor = 'MEDIUM'; r.ffmpeg.ffmpeg_preset = 'GOOD'
    r.ffmpeg.audio_codec = 'NONE'
    scene.view_settings.view_transform = 'AgX'
    r.filepath = os.path.abspath(os.path.join(out_dir, name + '.mp4'))
    bpy.ops.render.render(animation=True)

    # poster: middle frame as WebP
    scene.frame_set((f0 + f1) // 2)
    if hasattr(r.image_settings, 'media_type'):
        r.image_settings.media_type = 'IMAGE'
    r.image_settings.file_format = 'WEBP'; r.image_settings.quality = 80
    r.filepath = os.path.abspath(os.path.join(out_dir, name + '.webp'))
    bpy.ops.render.render(write_still=True)
    print('@@ rendered', name, f0, f1)
