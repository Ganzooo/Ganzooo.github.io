---
layout: page
title: On-Device LLM Inference
description: LLaMA, Qwen and DeepSeek on a Raspberry Pi 4, at half the latency.
img:
importance: 6
category: research
related_publications: true
---

Running an LLM on edge hardware is bounded by memory, latency and power simultaneously, and improving one usually costs another.

This is a lightweight **INT8 (LiteRT)** inference pipeline for deploying **LLaMA-3.2, Qwen and DeepSeek** on a Raspberry Pi 4. It achieves **2x faster inference latency** and lower power draw — **4.91 W against 5.52 W** — compared with framework-native PyTorch baselines, while holding output quality.

Published at ICCV Workshop 2025.
