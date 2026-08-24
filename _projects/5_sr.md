---
layout: page
title: Real-Time Super-Resolution on Edge NPUs
description: Two first-place challenge solutions, and the reparameterization idea behind both.
img:
importance: 5
category: Research
related_publications: true
---

## Why it is needed

Super-resolution is an unusually honest stress test for edge deployment. The quality metric is unforgiving, the latency budget is sub-millisecond, and INT8 conversion tends to damage both at once — a network that quantizes badly loses PSNR in exactly the high-frequency detail super-resolution exists to recover.

## What I did

Two challenge solutions built on the same underlying idea.

**CASR** — a cascade network with an advanced RepConv block and a channel-aware structure, targeting 4K super-resolution on GPU.

**Mobile SR** — an efficient network using **reparameterization (RepConv)** specifically to reduce INT8 quantization error, targeting a mobile NPU. I led this team.

The common thread is reparameterization: train with a wide multi-branch block, then fold it algebraically into a single convolution for inference. You get the representational capacity of the wide block at the runtime cost of the narrow one — and, more usefully here, at the *quantization behaviour* of the narrow one, because there are fewer branches whose activation ranges have to be reconciled.

## Result

| Solution | Challenge | Result |
|---|---|---|
| CASR | AIS 2024 @ CVPR | **1st place** — 33.11 dB PSNR (QP31) at 0.47 ms GPU runtime |
| Mobile SR | Mobile AI & AIM 2022 @ ECCV | **1st place** — 30.03 dB PSNR at 19.20 ms on a Synaptics VS680 edge NPU |
| Quantized SR | MAI 2025 @ CVPR | **2nd place** |

Code: [Ganzooo/LRSRN](https://github.com/Ganzooo/LRSRN) - the lightweight real-time super-resolution network.
