---
layout: page
title: QueryGaze — Gaze Estimation for Automotive Edge NPUs
description: Reusing detection queries as gaze prompts, at 15M parameters.
img:
importance: 3
category: Research
related_publications: false
---

Accurate gaze-target models are usually far too large for automotive hardware. QueryGaze is a single-pass gaze-target model that reuses **DETR detection queries as person-specific gaze prompts** on a frozen **DINOv3** backbone, deployed to an automotive edge NPU with ViT-aware INT8 quantization.

It reaches **0.956 GazeFollow AUC** — above the 0.924 human benchmark — at **15M parameters**, which is 3 to 60 times smaller than competing models, running in real time on-device.

**On validation.** The result was checked with multi-seed, placebo-controlled ablations and zero-shot cross-domain evaluation across four gaze benchmarks. The placebo control matters: if you add a component and accuracy improves, you have learned nothing until you have also added a component that should do nothing and confirmed it does nothing.

QueryGaze is the gaze component of the [UN-R171 driver-state monitoring system](/projects/1_dcas/).
