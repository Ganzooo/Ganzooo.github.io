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

I am a computer-vision researcher at the **Korea Electronics Technology Institute (KETI)**, working on **efficient, on-device AI** — taking state-of-the-art vision and vision-language models and making them fit real latency, memory and power budgets on edge hardware.

Most of my work sits at the point where a model has to leave the GPU: mobile and automotive NPUs (Qualcomm Hexagon/Snapdragon, NextChip, Synaptics), embedded ARM and automotive SoCs (TI TDA4VM, NVIDIA Jetson/Xavier), and Raspberry Pi. In practice that means INT8 post-training quantization, quantization-robust reparameterization, structural pruning, and TensorRT / ONNX / LiteRT deployment — and measuring what each of those choices actually costs.

Separately from KETI, I am part of **[Team Z6](https://teamz6.github.io/)**, an independent study group working on efficient, on-device computer vision. The super-resolution challenge results below came out of that group.

## Research Interests

- Efficient on-device inference — quantization, pruning, reparameterization
- Vision-language models under hard token and memory budgets
- Driver and occupant monitoring, to UN-R171 and Euro NCAP requirements
- Autonomous-driving perception on automotive SoCs
- Real-time super-resolution and image restoration

## Current Work

- **Driver-state monitoring** built to the requirement UN-R171 Section 5.5.4 sets for DCAS, with a six-rule Euro NCAP state machine — [project]({{ '/projects/1_dcas/' | relative_url }})
- **Multi-camera in-cabin inference**, four cameras through ROS 2 on a single Jetson AGX Orin at a fixed 10 Hz — [project]({{ '/projects/2_fms/' | relative_url }})

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
