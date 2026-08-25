---
layout: page
title: QueryGaze - Gaze Estimation for Automotive Edge NPUs
description: Reusing detection queries as gaze prompts, at 15M parameters.
img: assets/img/projects/querygaze_arch.png
importance: 3
category: Research
related_publications: false
---

## Why it is needed

A driver monitoring system has to know where the driver is looking, not only that a face is there. Accurate gaze-target models are built for servers. They are large, and they usually run one forward pass per person in the scene. Neither of those works on an automotive NPU.

## What I did

QueryGaze runs in a single pass. It reuses the DETR detection queries as gaze prompts for each person, on a frozen DINOv3 backbone. The queries already find each person, so I reuse them to condition that person's gaze prediction. One pass covers everyone in the frame.

The backbone stays frozen. That keeps the number of trained parameters small and makes the model behave more predictably under quantization. It is deployed to an automotive edge NPU with ViT-aware INT8 quantization.

{% include figure.liquid loading="eager" path="assets/img/projects/querygaze_arch.svg" class="img-fluid rounded" %}

<div class="caption">The detection queries that already locate each person are reused to condition that person's gaze prediction, so one forward pass covers everyone in the frame. The DINOv3 backbone stays frozen, which keeps the trained parameter count small and the activation ranges predictable under INT8.</div>

## Result

- **0.956 GazeFollow AUC**, above the 0.924 human benchmark
- **15M parameters**, 3 to 60 times smaller than other models
- Real time on-device

**How it was checked.** Multi-seed, placebo-controlled ablations, plus zero-shot evaluation on four gaze benchmarks. The placebo control is the important part. If you add a component and accuracy goes up, you have learned nothing until you also add a component that should do nothing and confirm it does nothing. Without that you are measuring seed variance and calling it a result.

QueryGaze is the gaze component of the [UN-R171 driver-state monitoring system]({{ '/projects/1_dcas/' | relative_url }}).
