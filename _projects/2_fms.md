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

A fleet operator needs to know what every occupant is doing — seatbelt on, boarding, eating, asleep — per seat, continuously. The constraint is that this has to happen on one board already installed in the vehicle, on a cadence the downstream controller can rely on. A system that averages 10 Hz but stalls occasionally is not usable; the contract is the point.

## What I did

Designed and built the deployed inference system for a national fleet-management R&D programme (TRL 4 to 7).

**The shape of it:** four in-cabin cameras publish to four ROS 2 topics on a single **NVIDIA Jetson AGX Orin 64GB**, which sends one 10 Hz JSON stream to the vehicle's occupant-monitoring controller over TCP. It covers ten classes per seat — five actions, five states — for up to five simultaneous occupants.

{% include figure.liquid loading="eager" path="assets/img/projects/fms_pipeline.svg" class="img-fluid rounded" %}

<div class="caption">Per-frame path: detection and tracking give each occupant a stable per-seat identity, a circular buffer accumulates that person's recent frames, and the action model classifies appearance and keypoints together.</div>

The buffer stage is what makes per-seat classification work at all. Classifying a single frame cannot distinguish "putting a seatbelt on" from "taking it off"; both need a time window, and the window has to follow the person rather than the seat, because occupants move.

{% include figure.liquid loading="eager" path="assets/img/projects/fms_action_result.jpg" class="img-fluid rounded z-depth-1" %}

<div class="caption">Per-occupant output on an IR frame: a stable track ID, the pose keypoints feeding the keypoint branch, and the classified action with its confidence. The subject's face is blurred here; it is not blurred in the system itself.</div>

## Result

- **TensorRT FP16 conversion cut in-cabin inference from 14.44 ms to 9.59 ms per frame**, holding the 10 Hz contract.
- The converted engine matched the PyTorch results on **all 120 seat-state cases**. A conversion that changes answers is not an optimisation, so this parity check gated the deployment.
- **Mixed precision, set by measurement rather than policy:** INT8 was accepted for detection, where it changed zero labels across the evaluation set. Pose stayed at FP16, because INT8 there produced a **38x keypoint coordinate error**. The same quantization decision was correct for one stage and badly wrong for the next — which is the argument for measuring per stage instead of quantizing the whole graph uniformly.
