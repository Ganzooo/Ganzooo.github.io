---
layout: page
title: Vision-Language Seat-State and Left-Object Detection
description: Training a VLM for a task with almost no real labelled data.
img: assets/img/projects/seat_left_object.jpg
importance: 4
category: In-cabin sensing
related_publications: false
---

## Why it is needed

A shared or fleet car has to know the state of each seat between trips: is it clean, has someone left something behind, is it dirty. The problem is the data, not the model. Real labelled photos of left objects and dirty seats are rare, and the range of cases is huge. Every combination of item, position, lighting, seat material and severity is a different picture.

## What I did

**I scaled the data instead of the model.** I built a prompt library over an image-to-image API and generated training images from a small set of real photos. It combines materials, lighting, object types, object positions, contaminant types and severity levels, with a fixed seed so the set can be reproduced. That took the training data from a handful of real photos to over a thousand images.

**I distilled from a large teacher.** A Qwen2.5-VL-72B teacher labelled the synthetic set zero-shot. A Qwen2-VL-2B student was LoRA fine-tuned on those labels, with a match-with-retry policy so disagreements were asked again instead of being accepted quietly.

**I split the task in two.** Stage 1 takes the image and writes an analysis in plain text plus a seat-status line. Stage 2 takes only that text and produces structured JSON: five evidence items, a subtype, and a confidence. Stage 2 never looks at the image again, so there is no second vision pass, and Stage 1's description stays readable.

{% include figure.liquid loading="eager" path="assets/img/projects/seatstate_pipeline.svg" class="img-fluid rounded" %}

<div class="caption">Real photographs are the scarce resource, so the pipeline makes more data from them and distills the labels from a large teacher onto a small student.</div>

{% include figure.liquid loading="eager" path="assets/img/projects/seat_left_object.jpg" class="img-fluid rounded z-depth-1" %}

<div class="caption">A left-object case from the in-cabin camera. What makes this task hard is that the object is ordinary. The model has to notice that something is there which should not be, and it does not need to say what it is.</div>

## Result

- Training data scaled about **200x** from the real photographs available
- Splitting the task in two made the structured output much more reliable than one image-to-JSON pass

**Two findings I want to state plainly.** Distillation helped the output format more than the accuracy. The student's real gain was producing well-formed structured output every time, and it was only slightly more correct. And a simple CLIP linear probe beat the distilled student on the stage-1 routing decision. So the VLM earns its place on telling subtypes apart and giving a readable justification, and it is worth being clear about which part of a pipeline a large model is actually paying for.

One caveat for production. In this form the VLM needs several GB of VRAM on top of the detection, pose and action models already running, and it has no INT8 export path yet. As it stands it is not ready for the embedded board.

<span class="code-note">Programme code is not public.</span>

---

<strong>Related</strong> — [Multi-camera in-cabin inference]({{ '/projects/2_fms/' | relative_url }}) · [On-device VLM for AIGC detection]({{ '/projects/4_lpcvc/' | relative_url }})
