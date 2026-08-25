---
layout: page
title: Error-Pixel Detection and Recovery
description: Finding and repairing dead sensor pixels on the vehicle's own board.
img: assets/img/projects/pixelerror_arch.png
importance: 2
category: Safe self-driving
related_publications: true
---

## Why it is needed

Automotive image sensors develop defective pixels. Some arrive that way, more appear with heat and age. A handful of dead pixels does not look like a failure. The image still reads as a normal scene, and every model downstream treats the bad values as real measurements.

That is what makes it dangerous. The camera does not report an error, so nothing further down the stack has any reason to distrust the frame. The problem has to be caught in the image itself, on the same board, before perception ever sees it.

## What I did

I built a hybrid two-stage model that detects and repairs in one pass.

Stage one is a detection backbone that produces an error-pixel map: a mask marking which pixels are bad. Stage two is a recovery backbone that takes the original image and that mask, and reconstructs the marked pixels. A residual connection carries the input through, so untouched pixels stay exactly as the sensor recorded them.

{% include figure.liquid loading="eager" path="assets/img/projects/pixelerror_arch.png" class="img-fluid rounded z-depth-1" %}

<div class="caption">Detection produces an error-pixel map, recovery repairs only the marked pixels, and the residual path leaves the rest of the image untouched. Both backbones are plain Conv3x3 + BN + activation blocks, which is what keeps the model small enough for the target board.</div>

Splitting it in two matters. A single network that denoises the whole image will also smooth detail that was never broken. Repairing only what the mask marks means a clean sensor gets a clean image back.

Both backbones use plain convolution blocks with no attention and no exotic operators, because the target was a Texas Instruments TDA4VM automotive board, and the operators that survive that toolchain are the ordinary ones.

## Result

Evaluated on 600 images with injected sensor noise, running on a **BeagleBone AI-64 (TDA4VM)**:

| Metric                       | Result                                   |
| ---------------------------- | ---------------------------------------- |
| Reconstruction quality       | **38.19 dB PSNR** (min 35.44, max 40.28) |
| Error pixels detected        | **94.57%** — 2,251,101 of 2,380,391      |
| Per-image detection accuracy | 94.7% mean                               |
| Error pixels per image       | ~3,967 injected                          |

Published as _Lightweight Deep Learning Model for Defective Pixel Detection and Recovery from the Image Sensors_ at the ECCV 2024 workshops.

The detection rate is the number that matters more than PSNR here. A missed defective pixel stays in the image and stays trusted. A slightly imperfect repair is still a repair.

Code: [Ganzooo/pixel_error_recovery](https://github.com/Ganzooo/pixel_error_recovery)

---

<strong>Related</strong> — [Camera soil detection]({{ '/projects/12_soil/' | relative_url }}) · [Autonomous-driving perception]({{ '/projects/8_perception/' | relative_url }})
