---
layout: page
title: Multi-Camera In-Cabin Inference System
description: Four cameras, one embedded board, a fixed 10 Hz contract.
img:
importance: 2
category: Automotive
related_publications: false
---

A fleet vehicle has to report what every occupant is doing, per seat, on a fixed cadence, on one board. This is the deployed inference system for a national fleet-management R&D programme (TRL 4 to 7).

**The shape of it.** Four in-cabin cameras publish to four ROS 2 topics on a single **NVIDIA Jetson AGX Orin 64GB**, which sends one 10 Hz JSON stream to the vehicle's occupant-monitoring controller over TCP. It recognises ten classes per seat — five actions, five states — for up to five simultaneous occupants, through a detect, track, pose, per-person circular buffer and appearance-plus-keypoint fusion pipeline.

**Making the 10 Hz contract hold.** TensorRT FP16 conversion cut in-cabin inference from **14.44 ms to 9.59 ms per frame**, matching the PyTorch results on all 120 seat-state cases — a parity check worth running, because a conversion that changes answers is not an optimisation.

**Mixed precision, set by measurement.** INT8 was accepted for detection: zero label changes across the evaluation set. Pose stayed at FP16, because INT8 there produced a **38x keypoint coordinate error**. The same quantization decision was right for one stage and badly wrong for the next, and the only way to know was to measure each stage separately rather than apply one policy to the whole graph.
