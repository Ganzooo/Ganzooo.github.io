---
layout: page
title: On-Device VLM for AI-Generated Content Detection
description: 1st place, LPCVC 2026 Track 3 - a vision-language detector inside a 500-token budget.
img:
importance: 4
category: Research
related_publications: false
---

## Why it is needed

Deciding whether an image was generated is increasingly something a phone needs to answer locally — for provenance, for moderation, for the user simply wanting to know. Existing detectors either need server-scale compute or fail to generalise across diffusion generators they were not trained on.

## What I did

A two-stage vision-language detector built on **Qwen2-VL-2B (LoRA)** running inside a hard **500-token-per-stage budget** on a **Snapdragon 8 Gen 5**.

- **Stage 1** produces free-text reasoning over eight visual criteria.
- **Stage 2** takes only that text — never the image again — and emits a structured JSON decision.

Dropping the image from Stage 2 removes a second vision-encoder pass, which is most of the latency. It also leaves Stage 1's description as a reviewable intermediate artefact rather than a hidden activation, so a wrong answer can be read and understood rather than just observed.

An auxiliary classification head was added alongside the generative output.

**Getting it onto the phone:** the LoRA-fine-tuned model is quantized to **W4A16** with Qualcomm AIMET and exported as a **QNN binary**. Weight-only 4-bit with 16-bit activations is the setting that survives here — the language head tolerates aggressive weight quantization, the activations do not.

{% include figure.liquid loading="eager" path="assets/img/projects/lpcvc_two_stage.svg" class="img-fluid rounded" %}

<div class="caption">Stage 1 reasons over the image in free text; Stage 2 reads only that text and emits the JSON decision. Dropping the image between stages removes the second vision-encoder pass and leaves the reasoning in a form a human can read.</div>

## Result

- **1st place, LPCVC 2026 Track 3** at CVPR 2026
- Official rubric score **0.827 at 30.48 TPS**
- The auxiliary classification head contributed **+2.08 pp** on the 26,033-image Chameleon benchmark

Code, LoRA adapter and training dataset are released: [Ganzooo/LPCVC2026-Track3-OptimAI-1st](https://github.com/Ganzooo/LPCVC2026-Track3-OptimAI-1st) (MIT).
