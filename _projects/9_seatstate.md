---
layout: page
title: Vision-Language Seat-State and Left-Object Detection
description: Training a VLM for a task with almost no real labelled data.
img: assets/img/projects/seat_left_object.jpg
importance: 9
category: Automotive
related_publications: false
---

## Why it is needed

A shared or fleet vehicle has to know the state of each seat between trips: is it clean, has something been left behind, is it soiled. The obstacle is not the model, it is the data. Real labelled in-cabin images of left objects and contamination are rare, and the long tail is enormous — every combination of item, position, lighting, upholstery and severity is a different picture.

## What I did

**Scaled the data instead of the model.** Built a procedural prompt library over an image-to-image API and generated training images from a small set of real photos, combining materials, lighting conditions, object types, object positions, contaminant types and severity levels under a fixed seed so the set is reproducible. That took the training data from a handful of real photos to over a thousand images.

**Distilled from a large teacher.** A Qwen2.5-VL-72B teacher labelled the synthetic set zero-shot; a Qwen2-VL-2B student was LoRA fine-tuned on those labels with a match-with-retry curation policy so disagreements were re-queried rather than silently accepted.

**Split the task in two.** Stage 1 takes the image and produces an analysis in free text plus a seat-status line. Stage 2 takes only that text and produces structured JSON — five evidence items, a subtype, and a confidence. Stage 2 never re-encodes the image, which removes a second vision pass and leaves Stage 1's description as a reviewable intermediate.

{% include figure.liquid loading="eager" path="assets/img/projects/seat_left_object.jpg" class="img-fluid rounded z-depth-1" %}

<div class="caption">A left-object case from the in-cabin camera. The interesting part of this task is that the object is unremarkable — the model has to notice that something is present that should not be, not classify what it is.</div>

{% include figure.liquid loading="eager" path="assets/img/projects/seatstate_pipeline.svg" class="img-fluid rounded" %}

<div class="caption">Real photographs are the scarce resource, so the pipeline manufactures data from them and distills the labels from a large teacher onto a small student.</div>

## Result

- Training data scaled roughly **200x** from the real photographs available
- The two-stage split made the structured output far more reliable than a single image-to-JSON pass

**Two findings worth stating plainly.** Distillation helped output _format_ stability more than it helped accuracy — the student's gain was in producing well-formed structured output consistently, not in being much more correct. And a simple CLIP linear probe beat the distilled student on the first-stage routing decision. The VLM earns its place on subtype discrimination and on producing a readable justification, not on raw routing accuracy, and it is worth being explicit about which part of a pipeline a large model is actually paying for.

A production caveat: in this form the VLM needs several GB of VRAM on top of the detection, pose and action models already running, and it has no INT8 export path yet. It is not embedded-ready as it stands.
