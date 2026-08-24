---
layout: page
title: QueryGaze - Gaze Estimation for Automotive Edge NPUs
description: Reusing detection queries as gaze prompts, at 15M parameters.
img:
importance: 3
category: Research
related_publications: false
---

## Why it is needed

A driver monitoring system has to know where the driver is looking, not just that a face is present. But accurate gaze-target models are built for servers: they are large, and they usually run a separate forward pass per person in the scene. Neither property survives contact with an automotive NPU.

## What I did

QueryGaze is a **single-pass** gaze-target model. It reuses **DETR detection queries as person-specific gaze prompts** on a frozen **DINOv3** backbone — the queries that already localise each person are repurposed to condition that person's gaze prediction, so one pass covers everyone in frame instead of one pass each.

The backbone stays frozen, which keeps the trainable parameter count small and makes the model far more predictable under quantization. It is deployed to an automotive edge NPU with **ViT-aware INT8 quantization**.

{% include figure.liquid loading="eager" path="assets/img/projects/querygaze_arch.svg" class="img-fluid rounded" %}

<div class="caption">The detection queries that already localise each person are reused to condition that person&#39;s gaze prediction, so one forward pass covers everyone in frame. The DINOv3 backbone stays frozen, which keeps the trainable parameter count small and the activation ranges predictable under INT8.</div>

## Result

- **0.956 GazeFollow AUC** — above the 0.924 human benchmark
- **15M parameters**, 3 to 60 times smaller than competing models
- Real-time on-device

**On how it was validated.** Multi-seed, placebo-controlled ablations plus zero-shot cross-domain evaluation across four gaze benchmarks. The placebo control is the part that matters: if you add a component and accuracy improves, you have learned nothing until you have also added a component that should do nothing and confirmed that it does nothing. Without that, you are measuring seed variance and calling it a contribution.

QueryGaze is the gaze component of the [UN-R171 driver-state monitoring system]({{ '/projects/1_dcas/' | relative_url }}).
