---
layout: page
title: Real-Time Super-Resolution on Edge NPUs
description: Two first-place challenge solutions, and the reparameterization trick behind them.
img:
importance: 5
category: research
related_publications: true
---

Super-resolution is a good stress test for edge deployment: the quality metric is unforgiving, the latency budget is sub-millisecond, and INT8 conversion tends to destroy both.

**CASR (1st place, AIS 2024 @ CVPR).** A cascade network with an advanced RepConv block and a channel-aware structure, reaching **33.11 dB PSNR (QP31) at 0.47 ms** GPU runtime.

**Mobile SR (1st place, Mobile AI & AIM 2022 @ ECCV).** An efficient network using **reparameterization (RepConv)** specifically to cut INT8 quantization error, reaching **30.03 dB PSNR at 19.20 ms** on a Synaptics VS680 edge NPU. I led this team.

The common thread is reparameterization: train with a wide multi-branch block, fold it into a single convolution for inference, and get the accuracy of the wide block at the cost and — importantly — the quantization behaviour of the narrow one.

Also 2nd place at MAI 2025 (CVPR) for quantized image super-resolution.
