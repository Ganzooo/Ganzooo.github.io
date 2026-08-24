---
layout: page
title: On-Device VLM for AI-Generated Content Detection
description: 1st place, LPCVC 2026 Track 3 — a vision-language detector inside a 500-token budget.
img:
importance: 4
category: research
related_publications: false
---

Detecting AI-generated images normally takes server-scale compute. This is a two-stage vision-language detector built on **Qwen2-VL-2B (LoRA)** that runs inside a hard **500-token-per-stage budget** on a **Snapdragon 8 Gen 5**.

Stage 1 produces free-text reasoning over eight visual criteria. Stage 2 takes only that text and emits a structured JSON decision. Stage 2 never sees the image again — which removes a second vision-encoder pass and leaves Stage 1's description as a reviewable intermediate artefact rather than a hidden activation.

An auxiliary classification head added **+2.08 pp** on the 26,033-image Chameleon benchmark.

**Result.** 1st place in the 2026 Low-Power Computer Vision Challenge Track 3 at CVPR 2026, with an official rubric score of **0.827 at 30.48 TPS**.
