---
layout: page
title: On-Device LLM Inference
description: LLaMA, Qwen and DeepSeek on a Raspberry Pi 4, at half the latency.
img: assets/img/projects/llm_results.png
importance: 3
category: Efficiency
related_publications: true
---

## Why it is needed

Running a language model on edge hardware is limited by memory, latency and power at the same time, and the usual fixes trade one against another. A Raspberry Pi 4 is a deliberately hard target: no GPU, little RAM, and a power budget where one watt is a large share of the total.

## What I did

I built a lightweight INT8 (LiteRT) inference pipeline for LLaMA-3.2, Qwen and DeepSeek on a Raspberry Pi 4, and measured it against the framework-native PyTorch path on the same device.

{% include figure.liquid loading="eager" path="assets/img/projects/llm_results.svg" class="img-fluid rounded" %}

<div class="caption">Measured on a Raspberry Pi 4 against the framework-native PyTorch path. Latency and power are on different scales, so they are shown as two panels and not forced onto one axis.</div>

## Result

- **2x faster inference latency**
- **4.91 W against 5.52 W**, so power went down as well as latency
- Output quality held

Published at ICCV Workshop 2025.

The power number matters more than it looks. On edge devices, faster inference often comes from working the hardware harder, which shows up as heat and throttling once the workload runs for a while. Getting latency and power to move in the same direction means the gain survives past the first few seconds.

---

<strong>Related</strong> — [Real-time super-resolution]({{ '/projects/5_sr/' | relative_url }}) · [On-device VLM for AIGC detection]({{ '/projects/4_lpcvc/' | relative_url }})
