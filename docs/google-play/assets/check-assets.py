"""Checks the store assets against Play's format rules before an upload.

Run from this folder:  python check-assets.py
"""

import glob
import io
import struct
import sys

COLOUR_TYPES = {0: 'grayscale', 2: 'RGB (24-bit)', 3: 'palette', 4: 'gray+alpha', 6: 'RGBA (32-bit)'}


def read_png(path):
    head = io.open(path, 'rb').read(33)

    if head[:8] != b'\x89PNG\r\n\x1a\n':
        return None

    width, height = struct.unpack('>II', head[16:24])

    return width, height, head[25]


def check(path, want_alpha, size=None):
    info = read_png(path)

    if info is None:
        return ['%s is not a PNG' % path]

    width, height, colour = info
    has_alpha = colour in (4, 6)
    problems = []

    if size and (width, height) != size:
        problems.append('%s is %dx%d, expected %dx%d' % (path, width, height, *size))

    if has_alpha != want_alpha:
        problems.append(
            '%s is %s; Play wants %s here'
            % (path, COLOUR_TYPES.get(colour, colour), 'alpha' if want_alpha else 'no alpha')
        )

    if not size and min(width, height) * 2 < max(width, height):
        problems.append('%s is %dx%d; the long side may not exceed twice the short one' % (path, width, height))

    return problems


def main():
    problems = check('icon-512.png', want_alpha=True, size=(512, 512))
    problems += check('feature-graphic.png', want_alpha=False, size=(1024, 500))

    shots = sorted(glob.glob('screenshots/*.png'))

    if len(shots) < 2:
        problems.append('need at least 2 phone screenshots, found %d' % len(shots))

    if len(shots) > 8:
        problems.append('at most 8 phone screenshots, found %d' % len(shots))

    for shot in shots:
        problems += check(shot, want_alpha=False)

    if problems:
        print('\n'.join(problems))
        sys.exit(1)

    print('%d screenshots, icon and feature graphic all match Play requirements' % len(shots))


main()
