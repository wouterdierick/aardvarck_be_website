# Aardvarck import

## Contents of this file

- Introduction
- Requirements
- Installation
- Configuration
- Usage
  - Preparing an import package
  - Uploading and importing
  - Overwrite behaviour / idempotency
  - The `mapping.yml` taxonomy mapping file
  - The import report
- Field mapping reference
- Maintainers


## Introduction

The Aardvarck import module provides a single administration tool to import
portfolio "work" content (the `work` node type) in bulk, or one work at a
time, from a `.zip` archive containing:

- one YAML metadata file per work, and
- one or more matching images per work.

It is used both for the one-time historic bulk import of the portfolio and
for every future ad-hoc upload of new work — there is only one import code
path, so there's nothing to keep in sync between "the first import" and
"adding one more work later".

The module:

- Parses each work's YAML file and validates it has the expected fields.
- Resolves taxonomy term references (medium, technique, academy, teacher,
  etc.) via a versioned mapping file (`data/mapping.yml`), creating new
  terms when needed.
- Resizes images (if needed) so neither dimension exceeds a configurable
  maximum (2400px by default), and stores them as `image` media entities.
- Creates or updates `work` nodes (always unpublished, in both
  languages), including their English source content and Dutch
  translation.
- Processes everything through Drupal's Batch API, so large imports don't
  hit PHP execution timeouts.
- Reports the outcome of every work processed (created / updated / skipped
  / error), including a flag for any taxonomy term that had to be created
  because it wasn't listed in `mapping.yml`.

See `context/import.md` in the project repository for the original design
document and rationale behind these decisions.


## Requirements

This module requires the following modules/core subsystems, already
enabled on this site:

- Node
- Taxonomy
- Media (with an `image` media type using `field_media_image` as its
  source field)
- File
- Content Translation (the `work` node type and the `work_medium`,
  `work_technique` and `academy_program` vocabularies must have content
  translation enabled)
- Language (with at least `en` and `nl` configured)

It also assumes the `work` content type has the field structure described
in "Field mapping reference" below (see `context/structure.md`).

No contributed modules are required — image resizing uses Drupal core's
image toolkit (GD by default), and zip extraction uses PHP's built-in
`ZipArchive`.


## Installation

Install as you would normally install a contributed Drupal module. See:
https://www.drupal.org/node/895232 for further information.


## Configuration

1. Grant the **Administer Aardvarck portfolio import** permission
   (`administer aardvarck import`) to the roles that should be able to run
   imports — by default this is the `webmaster` role on this site.
2. Optionally adjust the maximum image dimension at
   **Administration » Configuration » Media » Aardvarck import settings**
   (`/admin/config/media/aardvarck-import`). Default: 2400px.
3. Review and extend `data/mapping.yml` in this module (see below) so that
   your known taxonomy term values are mapped to their English (source)
   names and Dutch translations ahead of importing.


## Usage

### Preparing an import package

An import package is a `.zip` archive. Inside it (subfolders are allowed
and ignored — files are matched purely by filename, wherever they are in
the archive):

- One YAML file per work, named after the work's `id`, e.g.
  `WDABKMO_001.yml`. The `id` key inside the file must match the filename.
- One or more images per work:
  - a single image: `{id}.jpg` (e.g. `WDABKMO_001.jpg`)
  - multiple images: `{id}_1.jpg`, `{id}_2.jpg`, ... — the numeric suffix
    determines the display order in the work's teaser images.
- Supported image extensions: `.jpg`, `.jpeg`, `.png`.

Each YAML file must contain:

```yaml
id: "WDABKMO_001"
name:
  nl: "Typografie"
  en: "Typography"
description:
  nl: ""
  en: ""
date: "02-2016"            # MM-YYYY
work_width: 730              # mm
work_height: 550             # mm
work_medium: "Paper"        # English enum value(s) — see data/mapping.yml
work_technique: "Pastel"    # scalar OR a YAML list of several techniques
academy_name: "ABK Mortsel"
academy_year: "2015-2016"
academy_program: "General Drawing Arts"
academy_study_year: "2"
academy_teacher: "Paul Morez" # scalar OR a YAML list of several teachers
```

`work_technique` and `academy_teacher` may be given as a single string or
as a YAML list of several values — both forms are accepted.

`work_width` and `work_height` are stored as whole numbers (millimetres);
any decimal value in the source YAML is rounded.

`work_medium`, `work_technique` and `academy_program` are always given in
**English** — the module resolves the matching Dutch term name via
`data/mapping.yml` and adds it as the term's Dutch translation.

Files that are not part of any work package — `structure.yml`,
`mapping.yml`, `agent_info.md` — are ignored wherever found in the zip, so
you can safely zip your entire working data folder (including its own copy
of these reference files) without special handling. Hidden files (any
filename starting with a dot, including macOS `.DS_Store` and the
`._filename` AppleDouble files that Finder's "Compress" adds to a zip) are
always ignored too.

### Uploading and importing

1. Go to **Content » Import portfolio work**
   (`/admin/content/work/import`).
2. Choose your `.zip` file.
3. Optionally check **Overwrite existing works** (see below).
4. Submit. The import runs as a batch, with a progress bar.
5. You're redirected to the **import report** at the end, listing every
   work that was processed and its outcome.

### Overwrite behaviour / idempotency

Every work is matched on its `id` (stored in `field_id` on the node) — this
is the natural key used to detect whether a work already exists:

- **"Overwrite existing works" unchecked (default):** existing works are
  left completely untouched. They're reported as **Skipped** on the import
  report. Only genuinely new works are created.
- **"Overwrite existing works" checked:** existing works are updated in
  place — all mapped fields are refreshed from the YAML, and their teaser
  images are **fully replaced** (old media entities and files for that
  work are deleted, new ones created from the zip's images).

This makes it safe to re-upload the same work package after fixing a typo
in its YAML or replacing a photo — you don't need to manually delete
anything first.

### The `mapping.yml` taxonomy mapping file

`data/mapping.yml` (versioned in this module, so changes can be reviewed
like code) is the single source of truth for how raw YAML values are
turned into taxonomy terms:

- **Translatable vocabularies** — `work_medium`, `work_technique`,
  `academy_program` — are listed as `nl`/`en` pairs. The importer looks up
  the raw (English) YAML value under `en`, creates/matches the term with
  that value as its canonical English (source language) name, and adds the
  matching `nl` value as its Dutch translation.
- **Non-translatable vocabularies** — `academy_name`, `academy_year`,
  `academy_study_year`, `academy_teacher` — are listed as flat strings
  (identical in both languages, e.g. a school name or a teacher's name).

**Unmapped values are never a blocking error.** If a raw value isn't found
in `mapping.yml` (a typo, or a genuinely new value not yet reviewed), the
importer still creates the work and the term — using the raw value
verbatim, in English, with no Dutch translation — but flags it on the
import report so you can add a proper `mapping.yml` entry (and a Dutch
translation) afterwards. Fixing normalization/typo issues in the *source*
YAML data itself is outside the scope of this module.

### The import report

After a batch finishes, `/admin/content/work/import/report` shows a table
of every work processed:

| Work ID | Result | Notes |
|---|---|---|
| WDABKMO_001 | Created | Work created. |
| WDABKMO_012 | Updated | Work updated, teaser images replaced. |
| WDABKMO_050 | Skipped | Existing work, overwrite not enabled. |
| WDABKMO_099 | Error | No image files found for this work. |
| WDABKMO_100 | Created | ⚠ Term "Sanguine" for field_work_technique is not in mapping.yml — created as-is, needs manual review. |

The report reflects only the most recently run batch (stored per-user, not
persisted long-term) — re-run the import to see a fresh report.


## Field mapping reference

| YAML key | `work` node field | Notes |
|---|---|---|
| `id` | `field_id` | natural key for idempotency |
| `name.en` | `title` (en, source language) | |
| `name.nl` | `title` (nl translation) | |
| `description.en` | `field_description` (en, `restricted_html`, source language) | |
| `description.nl` | `field_description` (nl translation, `restricted_html`) | |
| `date` | `field_date` (day forced to `01`) | also used for the `public://work/{year}/{id}/` image path |
| `work_width` | `field_work_width` | integer, millimetres |
| `work_height` | `field_work_height` | integer, millimetres |
| `work_medium` | `field_work_medium` | via `mapping.yml`, multi-value |
| `work_technique` | `field_work_technique` | via `mapping.yml`, multi-value |
| `academy_name` | `field_academy_name` | via `mapping.yml` |
| `academy_year` | `field_academic_year` | via `mapping.yml` |
| `academy_program` | `field_academy_program` | via `mapping.yml` |
| `academy_study_year` | `field_academy_study_year` | via `mapping.yml` |
| `academy_teacher` | `field_academy_teacher` | via `mapping.yml`, multi-value |
| *(images)* | `field_teaser_images` | order = filename suffix |

`field_product` — and any field added to the `work` content type in the
future that isn't in the table above — is **never** read or written by
this module. It's left for manual editing in the content form (e.g. when a
work goes up for sale via Commerce).


## Maintainers

Built for the Aardvarck portfolio site. Not intended for reuse on other
sites as-is (the field/vocabulary machine names are hard-coded to match
this site's content architecture) — see `context/structure.md` and
`context/import.md` in the project repository for the underlying content
model this module depends on.
