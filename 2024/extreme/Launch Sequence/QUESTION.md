In the enchanting realm of cosmic exploration, where celestial wonders and arcane technologies intertwine, a mission of great importance is at hand. Given an npm package, your task is to facilitate its preparation and launch to the registry at http://packages.sliitfoss.org:6873, ensuring it is primed for other projects to install.

As the stars align, simulate the mystical process where a commit message matching the pattern release: <message> activates the automatic launch sequence, publishing the package through a GitHub Actions workflow. This workflow must be woven into the very fabric of the package, leaving no room for manual edits by hand. Ensure your launch is smooth and successful, for the fate of the cosmos and the destinies of countless projects hang in the balance!

## Constraints

- The script must be **purely written in bash within the execute.sh file**.

## Output / Evaluation Criteria

- A Github workflow file with run name `Launch Sequence` under `launch.yml` must be created in the `.github/workflows` directory of the package which must be triggered by the commit message pattern `release: <message>` where you are responsible for setting up the Git repository.

- The workflow must publish the package to the registry at `http://packages.sliitfoss.org:6873`.

- The package must be published with the correct version number.
