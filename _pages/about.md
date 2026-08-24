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

Most of my work lives at the point where a model has to leave the GPU and run on something small: mobile and automotive NPUs (Qualcomm Hexagon/Snapdragon, NextChip, Synaptics), embedded ARM and automotive SoCs (TI TDA4VM, NVIDIA Jetson/Xavier), and Raspberry Pi. In practice that means INT8 post-training quantization, quantization-robust reparameterization, structural pruning, and TensorRT / ONNX / LiteRT deployment — and measuring what those choices actually cost.

Two current projects: a **driver-state monitoring system** built to the requirement UN-R171 Section 5.5.4 sets for DCAS, with a six-rule Euro NCAP state machine; and a **multi-camera in-cabin inference system** running four cameras through ROS 2 on a single Jetson AGX Orin at a fixed 10 Hz.

Before that I spent several years on autonomous-driving perception — real-time semantic segmentation, 2D and 3D detection, traffic-light recognition — and on real-time super-resolution, where our team took first place at **AIS 2024 (CVPR)** and **Mobile AI 2022 (ECCV)**. Most recently, first place in **LPCVC 2026 Track 3 (CVPR)** for on-device vision-language AI-generated-content detection under a hard token budget.

Separately from my work at KETI, I am part of **[Team Z6](https://teamz6.github.io/)** — an independent study group working on efficient, on-device computer vision. The super-resolution challenge results above came out of that group rather than from institute work.

I did my Ph.D. at Yonsei University (Image & Information Lab) and my M.S. at Konkuk University (VLSI Lab).
