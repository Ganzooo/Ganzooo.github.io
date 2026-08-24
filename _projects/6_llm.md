---
layout: page
title: On-Device LLM Inference
description: LLaMA, Qwen and DeepSeek on a Raspberry Pi 4, at half the latency.
img: assets/img/projects/llm_results.png
importance: 6
category: Research
related_publications: true
---

## Why it is needed

Running a language model on edge hardware is bounded by memory, latency and power at the same time, and the usual moves trade one against another. A Raspberry Pi 4 is a deliberately unforgiving target: no GPU, limited RAM, and a power envelope where a watt is a meaningful fraction of the budget.

## What I did

Built a lightweight **INT8 (LiteRT)** inference pipeline for deploying **LLaMA-3.2, Qwen and DeepSeek** on a Raspberry Pi 4, and measured it against the framework-native PyTorch path rather than against a theoretical baseline.

{% include figure.liquid loading="eager" path="assets/img/projects/llm_results.svg" class="img-fluid rounded" %}

<div class="caption">Measured on a Raspberry Pi 4 against the framework-native PyTorch path. Latency and power are on different scales, so they are shown as separate panels rather than forced onto one axis.</div>

## Result

- **2x faster inference latency**
- **4.91 W against 5.52 W** — lower power, not just lower latency
- Output quality held

Published at **ICCV Workshop 2025**.

The power number matters more than it looks. Latency improvements on edge devices often come from working the hardware harder, which shows up as heat and throttling on a sustained workload. Getting latency and power to move in the same direction means the gain survives past the first few seconds.
