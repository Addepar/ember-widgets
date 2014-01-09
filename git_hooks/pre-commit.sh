#!/bin/sh
#
# Pre-commit hooks

######################################################################
# Environment Setup
# 1) Change directory to build dir so we can run grunt tasks.
# 2) Make sure path is extended to include grunt task executable
#    dir, as this commit shell is executed in the git
#    client's own shell; ie Tower and WebStorm have own shell path.
######################################################################

PATH=$PATH:~/usr/local/bin
PATH=$PATH:/usr/local/bin
git stash -q --keep-index  # stash unstaged changes before running tests

######################################################################
# Unit Tests: Run unit tests/specs before committing
######################################################################
grunt karma:continuous
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
    echo "[ERRROR] code = " ${EXIT_CODE}
    echo "Karma Unit Tests failed."
    echo "Commit aborted."
    exit 1
else
  echo "Karma Unit Tests completed successfully\n"
fi

exit 0

git stash pop -q  # restore changes
