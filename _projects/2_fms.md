---
layout: page
title: Multi-Camera In-Cabin Inference System
description: Four cameras, one embedded board, a fixed 10 Hz contract.
img: assets/img/projects/fms_pipeline.png
importance: 2
category: Automotive
related_publications: false
---

## Why it is needed

A fleet operator needs to know what every passenger is doing, seat by seat, all the time. Seatbelt on, getting in, eating, asleep. The hard part is that this has to run on one board already fitted in the car, and it has to send results on a fixed schedule. A system that averages 10 Hz but stops sometimes is no use. The schedule is the requirement.

## What I did

I designed and built the deployed inference system for a national fleet-management R&D programme (TRL 4 to 7).

Four in-cabin cameras publish to four ROS 2 topics on one **NVIDIA Jetson AGX Orin 64GB**. The board sends one 10 Hz JSON stream to the car's occupant-monitoring controller over TCP. It covers ten classes per seat, five actions and five states, for up to five people at once.

{% include figure.liquid loading="eager" path="assets/img/projects/fms_pipeline.svg" class="img-fluid rounded" %}

<div class="caption">The path for each frame. Detection and tracking give every passenger a stable ID for their seat. A buffer collects that person's recent frames. The action model then reads appearance and keypoints together.</div>

The buffer stage is what makes per-seat classification work. You cannot tell "putting a seatbelt on" from "taking it off" in a single frame. Both need a time window, and the window has to follow the person, because people move between seats.

{% include figure.liquid loading="eager" path="assets/img/projects/fms_action_result.jpg" class="img-fluid rounded z-depth-1" %}

<div class="caption">Output for one passenger on an IR frame: a stable track ID, the pose keypoints that feed the keypoint branch, and the action with its confidence. The face is blurred here for publication only. The system does not blur it.</div>

## Result

- **TensorRT FP16 cut in-cabin inference from 14.44 ms to 9.59 ms per frame**, which kept the 10 Hz schedule.
- The converted engine gave the same answer as PyTorch on **all 120 seat-state cases**. A conversion that changes answers is a bug, so this check had to pass before deployment.
- **Mixed precision, decided by measurement.** INT8 was fine for detection: it changed zero labels across the evaluation set. Pose stayed at FP16, because INT8 there gave a **38x keypoint coordinate error**. The same quantization choice was right for one stage and badly wrong for the next. That is why I measured each stage separately.
