#!/usr/local/bin/python3
#
#
# Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.12
#
#

import os
import sys

VERSION_NEW = sys.argv[1]
TOP_LEVEL_DIR = os.path.join(os.getcwd(), "..")
SPLITTER = "Arxos - v"
allowed_extensions = ("php", "js", "css", "scss")

for (_path, _dirs, _files) in os.walk(TOP_LEVEL_DIR):
    if "git" not in _path:
        for _file in _files:
            if "~" not in _file and "#" not in _file:
                extension = _file.split(".")[-1]

                if extension in allowed_extensions:
                    full_file_name = os.path.join(_path, _file)
                    tempfile = full_file_name + "___"

                    if os.path.isfile(tempfile):
                        os.remove(tempfile)


                    tempfile_ = open(tempfile, "w+")


                    for line in open(full_file_name):
                        line = line.rstrip()

                        if SPLITTER in line:
                            parts = line.split(SPLITTER)

                            parts[-1] = VERSION_NEW

                            line = SPLITTER.join(parts)
                        tempfile_.write(line + "\n")

                    tempfile_.close()

                    os.remove(full_file_name)
                    os.rename(tempfile, full_file_name)
