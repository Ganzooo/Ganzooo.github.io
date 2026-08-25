---
layout: page
title: Real-Time Super-Resolution on Edge NPUs
description: Two first-place challenge solutions, and the reparameterization idea behind both.
img: assets/img/projects/repconv.png
importance: 5
category: Research
related_publications: true
---

## Why it is needed

Super-resolution is a hard test for edge deployment. The quality metric is strict, the latency budget is under a millisecond, and INT8 conversion tends to damage both at once. A network that quantizes badly loses PSNR in exactly the fine detail that super-resolution exists to recover.

## What I did

Two challenge solutions built on the same idea.

**CASR** is a cascade network with an advanced RepConv block and a channel-aware structure, for 4K super-resolution on GPU.

**Mobile SR** is an efficient network that uses reparameterization (RepConv) to reduce INT8 quantization error, for a mobile NPU. I led this team.

The shared idea is reparameterization. You train with a wide multi-branch block, then fold it into a single convolution for inference. You keep the capacity of the wide block at the runtime cost of the narrow one. More useful here, you also get the quantization behaviour of the narrow one, because there are fewer branches whose activation ranges have to be reconciled.

{% include figure.liquid loading="eager" path="assets/img/projects/repconv.svg" class="img-fluid rounded" %}

<div class="caption">Reparameterization: the block is wide while training and a single convolution at inference. The second box on the right is the one that matters for edge deployment. Fewer branches means fewer activation ranges to reconcile, which is why the folded network survives INT8 conversion better.</div>

## Result

| Solution     | Challenge                   | Result                                                                 |
| ------------ | --------------------------- | ---------------------------------------------------------------------- |
| CASR         | AIS 2024 @ CVPR             | **1st place**, 33.11 dB PSNR (QP31) at 0.47 ms GPU runtime             |
| Mobile SR    | Mobile AI & AIM 2022 @ ECCV | **1st place**, 30.03 dB PSNR at 19.20 ms on a Synaptics VS680 edge NPU |
| Quantized SR | MAI 2025 @ CVPR             | **2nd place**                                                          |

Code: [Ganzooo/LRSRN](https://github.com/Ganzooo/LRSRN), the lightweight real-time super-resolution network.
