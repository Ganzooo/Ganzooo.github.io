---
layout: about
title: About
permalink: /
subtitle: Computer-vision researcher at <a href="https://www.keti.re.kr/">KETI</a> — efficient and on-device AI.

profile:
  align: right
  image: a1_ganzo.jpg
  image_circular: false
  more_info: >
    <p>Korea Electronics Technology Institute</p>
    <p>Seoul, South Korea</p>

selected_papers: true
social: true

announcements:
  enabled: true
  scrollable: true
  limit: 5

latest_posts:
  enabled: false
  scrollable: true
  limit: 3
---

I am a computer-vision researcher at the **Korea Electronics Technology Institute (KETI)**, in the **perception team** of the autonomous-driving vehicle systems group. Nearly all of my work traces back to one vehicle.

I started on the car's outward-facing perception — real-time semantic segmentation, 2D detection for emergency vehicles and traffic police, traffic-light recognition — all of it sized for the automotive SoCs the vehicle actually carries rather than for a workstation GPU. That work, together with 3D object detection on the Apollo platform, is what carried the team through to an **autonomous test-driving licence**: the point where the stack stopped being a research project and became a vehicle permitted to drive.

Once the car could drive itself, the interesting question moved inside it. A vehicle that steers on your behalf has to establish that you are still engaged — and under UN-R171 that is a regulatory requirement, not a feature. That is where most of my current work sits: a **driver-state monitoring system** built to what Section 5.5.4 demands, with a six-rule Euro NCAP state machine, and a **four-camera occupant-recognition system** running on a single Jetson AGX Orin at a fixed 10 Hz.

The efficiency work runs underneath all of it. Real-time super-resolution, on-device LLM inference, vision-language models inside a token budget — these are not a separate track. They are how a model that works in a lab ends up inside a car's compute envelope. The quantization and reparameterization methods that won those challenges are the same ones that put the in-cabin models onto an automotive NPU.

I am now beginning work on **vision-language-action (VLA)** models — the step from a vehicle that perceives to one that decides.

Separately from KETI, I am part of **[Team Z6](https://teamz6.github.io/)**, an independent study group working on efficient, on-device computer vision. The super-resolution challenge results below came out of that group.

{% include figure.liquid loading="eager" path="assets/img/projects/career_arc.svg" class="img-fluid rounded" %}

<div class="caption">The work in one picture: outward-facing perception, the test-driving licence it led to, the move inside the vehicle, and the start of vision-language-action work - with the efficiency layer that makes each of them deployable running underneath.</div>

## Research Interests

- Efficient on-device inference — quantization, pruning, reparameterization
- Vision-language models under hard token and memory budgets
- Vision-language-action (VLA) models
- Driver and occupant monitoring, to UN-R171 and Euro NCAP requirements
- Autonomous-driving perception on automotive SoCs
- Real-time super-resolution and image restoration

## Focus, in order

- **Outward perception** — 2D detection and semantic segmentation on automotive SoCs; 3D detection on the Apollo platform toward the team's autonomous test-driving licence — [project]({{ '/projects/8_perception/' | relative_url }})
- **In-cabin sensing** (current) — driver-state monitoring to UN-R171 Section 5.5.4, and four-camera occupant recognition at a fixed 10 Hz — [driver state]({{ '/projects/1_dcas/' | relative_url }}) · [multi-camera]({{ '/projects/2_fms/' | relative_url }})
- **Vision-language-action** (starting) — early work on VLA models, building on the on-device vision-language work below

## Selected Awards

- 🥇 **1st place**, LPCVC 2026 Track 3 @ CVPR — on-device vision-language AIGC detection
- 🥇 **1st place**, AIS 2024 @ CVPR — real-time image super-resolution
- 🥇 **1st place**, Mobile AI & AIM 2022 @ ECCV — real-time super-resolution (team leader)
- 🥈 **2nd place**, MAI 2025 @ CVPR — quantized image super-resolution
- 🥈 **2nd place**, AI Grand Challenge 2020, IITP — AI model optimization

## Education

- **Ph.D. in Electrical and Electronic Engineering**, Yonsei University (2011 – 2020) — Image & Information Lab
- **M.S. in Electronics & Information Communication**, Konkuk University (2006 – 2009) — VLSI Lab
- **B.S. in Information and Communication**, Huree University of ICT, Mongolia (2002 – 2006)

## Experience

- **Postdoctoral Researcher**, Korea Electronics Technology Institute (Jun 2018 – Present)
- **Computer Vision Researcher**, Chowis Co., Ltd. (Nov 2016 – May 2018)
- **Assistant Professor**, Huree University of ICT, Mongolia (Mar 2009 – Aug 2010)

637 citations · h-index 10 · four U.S. patents (three granted)
