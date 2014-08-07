#!/bin/sh
#
# Pre-commit hooks

# git stash -q --keep-index  # stash unstaged changes before running tests

######################################################################
# Unit Tests: Run unit tests/specs before committing
######################################################################
grunt karma:unit
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
    echo "[ERRROR] code = " ${EXIT_CODE}
    echo "Karma Unit Tests failed."
    echo "Commit aborted."
    exit 1
else
  echo "Karma Unit Tests completed successfully"
fi

exit 0

# git stash pop -q  # restore changes
