#!/usr/bin/env python3
"""Archive statistics for the Bashaway challenge repository.

Classifies every graded challenge (2023 onwards) by the shape of its grader,
counts archived team solutions, and reports solution-size percentiles.
Run from the repository root:  python3 scripts/archive-stats.py [--csv out.csv]

The numbers feed the evolution documentation in bashaway-official
(docs/evolution/architecture/08-archive-analysis.md). No dependencies
beyond the standard library.
"""
import argparse
import csv
import glob
import os
import re
import statistics
import subprocess
import sys

TAGS = [
    ("docker", r"\bdocker\b"),
    ("k8s", r"kubectl|kubernetes|\bk8s\b|minikube|\bkind\b"),
    ("git", r"\bgit\b"),
    ("nginx", r"nginx"),
    ("redis", r"redis"),
    ("mongo", r"mongo"),
    ("http", r"axios|\bcurl\b|localhost:\d+|http://"),
    ("json", r"\bjq\b|JSON\.parse|\.json\b"),
    ("csv", r"\.csv\b"),
    ("pdf", r"\bpdf\b"),
    ("gh-actions", r"\bact\b|workflows?/|github actions"),
    ("registry", r"verdaccio|npm publish|registry"),
    ("media", r"ffmpeg|\.png\b|\.mp4\b|\.jpg\b|image"),
    ("cron", r"\bcron"),
    ("ssh", r"\bssh\b"),
    ("text", r"input\.txt|\.txt\b|logs?\.txt|stdout"),
]
INFRA = {"docker", "k8s", "nginx", "redis", "mongo", "registry", "gh-actions"}


def read(path):
    try:
        with open(path, errors="ignore") as fh:
            return fh.read()
    except OSError:
        return ""


def solution_sizes(sol_dir):
    """Byte and line counts of execute.sh inside every archived solution zip."""
    sizes = []
    for z in glob.glob(os.path.join(sol_dir, "*.zip")):
        try:
            out = subprocess.run(["unzip", "-p", z, "*execute.sh"], capture_output=True, check=False).stdout
        except FileNotFoundError:
            sys.exit("unzip is required")
        if out:
            sizes.append((len(out), out.count(b"\n") + (0 if out.endswith(b"\n") else 1)))
    return sizes


def classify(challenge_dir):
    test = read(os.path.join(challenge_dir, "code", "test", "index.test.js"))
    qmd = next((read(p) for p in (os.path.join(challenge_dir, n) for n in ("QUESTION.md", "question.md")) if os.path.exists(p)), "")
    both = test + qmd
    tags = [t for t, pat in TAGS if re.search(pat, both, re.I)]
    shape = "infra" if INFRA & set(tags) else ("git" if "git" in tags else "transform")
    golf = re.findall(r"length\)\.toBeLessThan(?:OrEqual)?\((\d+)\)", test)
    ref = os.path.join(challenge_dir, "code", "execute.sh")
    return {
        "shape": shape,
        "tags": ",".join(tags),
        "golf_limit": ",".join(golf),
        "faker": bool(re.search(r"faker\.", test)),
        "lang_restrict": bool(re.search(r"restrictJavascript|restrictPython", test)),
        "prohibited": bool(re.search(r"prohibitedCommands", test)),
        "ref_bytes": os.path.getsize(ref) if os.path.exists(ref) else -1,
    }


def pct(values, p):
    if not values:
        return 0
    values = sorted(values)
    return values[min(len(values) - 1, int(len(values) * p))]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", help="write per-challenge rows to this file")
    ap.add_argument("--years", nargs="*", help="years to include (default: all with code/ dirs)")
    args = ap.parse_args()

    years = args.years or sorted(d for d in os.listdir(".") if d.isdigit() and glob.glob(f"{d}/*/*/code"))
    rows, all_sizes = [], []
    for y in years:
        for diff in ("easy", "medium", "hard", "extreme"):
            for d in sorted(glob.glob(f"{y}/{diff}/*/")):
                info = classify(d)
                sizes = solution_sizes(os.path.join(d, "solutions"))
                all_sizes += sizes
                rows.append({"year": y, "difficulty": diff, "name": os.path.basename(d.rstrip("/")), "solutions": len(sizes), **info})

    if args.csv:
        with open(args.csv, "w", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rows)

    print(f"challenges: {len(rows)}   archived solutions: {len(all_sizes)}")
    for y in years:
        yr = [r for r in rows if r["year"] == y]
        shapes = {s: sum(1 for r in yr if r["shape"] == s) for s in ("transform", "git", "infra")}
        print(f"\n{y}: {len(yr)} challenges  shapes={shapes}")
        for diff in ("easy", "medium", "hard", "extreme"):
            s = [r["solutions"] for r in yr if r["difficulty"] == diff]
            if s:
                print(f"   {diff:8s} n={len(s):2d}  mean solutions={statistics.mean(s):5.1f}  zero-solved={sum(1 for x in s if x == 0)}")
    b = [s[0] for s in all_sizes]
    l = [s[1] for s in all_sizes]
    print("\nsolution execute.sh size  p10 p25 p50 p75 p90 max")
    print("  bytes:", *[pct(b, p) for p in (0.1, 0.25, 0.5, 0.75, 0.9)], max(b) if b else 0)
    print("  lines:", *[pct(l, p) for p in (0.1, 0.25, 0.5, 0.75, 0.9)], max(l) if l else 0)
    print("\ngrader mechanics: faker=%d lang_restrict=%d prohibited=%d golf=%d of %d" % (
        sum(r["faker"] for r in rows), sum(r["lang_restrict"] for r in rows),
        sum(r["prohibited"] for r in rows), sum(1 for r in rows if r["golf_limit"]), len(rows)))


if __name__ == "__main__":
    main()
