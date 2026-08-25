---
layout: page
title: Camera Soil Detection
description: Knowing when the lens is dirty, before perception trusts the frame.
img: assets/img/projects/soil_detection_result.png
importance: 3
category: Safe self-driving
related_publications: false
---

## Why it is needed

Surround-view cameras sit low on the body of the car, where they collect road spray, mud and salt within minutes of bad weather. A soiled lens does not produce an obviously broken image. It produces a slightly soft, slightly occluded one that still looks like a road.

Perception downstream has no way to tell the difference. It will keep detecting, keep segmenting, and keep returning confident answers about a region the camera can no longer actually see. The failure is silent, which makes it worse than a camera that simply stops working.

## What I did

I trained a semantic-segmentation model to mark soiled regions of the frame directly, using the fisheye surround-view imagery these cameras produce. The training used the WoodScape automotive fisheye dataset, with DDRNet-23 and HardNet backbones evaluated as the segmentation model.

{% include figure.liquid loading="eager" path="assets/img/projects/soil_detection_result.png" class="img-fluid rounded z-depth-1" %}

<div class="caption">Input on the left, predicted soiled regions on the right. The scene still reads as a normal car park. Nothing downstream would flag this frame, which is exactly the point.</div>

The output is a per-pixel mask rather than a whole-frame verdict. That matters because partial soiling is the common case: one corner of the lens is blocked while the rest is fine, and the vehicle can keep using the clean part if it knows which part that is.

On top of the mask, a second stage turns soiled area into a camera-failure decision, so the system can say not just where the dirt is but whether the camera should still be trusted at all. It was optimised for the NVIDIA Xavier embedded platform.

## Result

Segmentation quality on the soiling evaluation set: **0.81 mean IoU** across the sample (0.75 to 0.84). That figure comes from a six-image sample, so treat it as indicative rather than a benchmark number.

The camera-failure stage was run over **2,509 frames**:

| Verdict | Frames | Mean soiled area  |
| ------- | ------ | ----------------- |
| Normal  | 869    | 14.1% (max 28.6%) |
| Fail    | 1,640  | 67.6% (min 31.4%) |

The two groups separate cleanly at roughly 30% soiled area, with no overlap between the highest Normal frame and the lowest Fail frame. That gap is what makes the decision usable: it is a threshold with margin either side, not a cut through the middle of a distribution.

Code: [Ganzooo/soil_segmentation](https://github.com/Ganzooo/soil_segmentation)

---

<strong>Related</strong> — [Error-pixel detection and recovery]({{ '/projects/11_pixelerror/' | relative_url }}) · [Autonomous-driving perception]({{ '/projects/8_perception/' | relative_url }})
