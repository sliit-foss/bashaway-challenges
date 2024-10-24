mkdir -p out
jq -s '.[0] * .[1]' src/joint_data.json src/seam_specs.json > out/merged.json