#!/usr/bin/env python3
##
##
## Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.19
##
##

##
##
## Provides a variety of utility functions/classes
## Read comments for details
##
##

import os
import re
import shutil
import datetime

###
# Provides constants to be used for terminal output
# Surround the terminal with the constants to show colour, e.g.
# print(term_bgs.OKGREEN + " GOOD " + term_bgs.ENDC)
#
# They can also be combined, e.g.
# print(term_bgs.OKGREEN + term_bgs.UNDERLINE + "VERY GOOD" + term_bgs.ENDC + term_bgs.ENDC)
###
class term_bgs:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

###
#
# Gets rid of quotation marks around user input, and gets rid of trailing zeros if specified
#
###
def cleanup(input, cleanLeadingZeros=False):
    input = input.strip()
    if input[0] == '"' or input[0] == "'":
        input = input[1:]
    if input[-1] == '"' or input[-1] == "'":
        input = input[:-1]

    if cleanLeadingZeros:
        while input[0] == "0":
            input = input[1:]

    input = input.strip()
    return input

###
#
# Creates a backup of a file by creating a copy of it named: %ORIG_NAME%-BACKUP-DATE
#
###
def create_backup(fileName):
    if not os.path.isfile(fileName):
        raise Exception("Cannot backup file which doesn't exist: %s" % (fileName))

    now = datetime.datetime.now()
    newName = "%s-BACKUP-%.2d%.2d%.2d-%.2d%.2d%.2d-%s" % (fileName, now.year, now.month, now.day, now.hour, now.minute, now.second, now.microsecond)
    shutil.copy(fileName, newName)

    return newName

###
#
# Parses an XML Line and gives back attributes, tags, etc as an object
#
####
def parseXmlLine(line):
    result = {}

    line = line.strip()

    if len(line):
        parts = line.split(" ")
        i = 0
        for part in parts:
            if len(part) > 0:
                if part[0] == "<":
                    part = part[1:]
                if part[-1] == ">":
                    part = part[:-1]
                parts[i] = part
            i += 1

        i = 1

        non_joined_found = True
        while non_joined_found:
            non_joined_found = False
            while i < len(parts):
                if not re.compile("\S*=").match(parts[i]):
                    if i != 1:
                        parts[i - 1] += " " + parts[i]
                        del parts[i]

                        i -= 1
                        non_joined_found = True
                i += 1

        if parts[0][0] == "/":
            result["type"] = "closing_tag"
            parts[0] = parts[0][1:]
        else:
            result["type"] = "open_tag"

        result["tag"] = parts[0].lower()
        result["attributes"] = {}

        for part in parts[1:]:
            attributeParts = part.split(" =\"")

            for attributePart in attributeParts:
                attributeSplit = attributePart.split('="')
                if len(attributeSplit) > 1:
                    currVal = '="'.join(attributeSplit[1:])[:-1]
                    currName = attributeSplit[0]
                else:
                    attributeSplitSingle = attributeSplit[0].split("='")
                    if len(attributeSplitSingle) > 1 and attributeSplitSingle[-1][-1] == "'":
                        currVal = "='".join(attributeSplitSingle[1:])[:-1]
                        currName = attributeSplitSingle[0]
                    else:
                        currVal = None
                        currName = attributeSplitSingle[0]

                result["attributes"][currName] = currVal

    else:
        result = None
    return result;
